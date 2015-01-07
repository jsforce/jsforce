var inherits = require('inherits'),
    events = require('events'),
    _ = require('underscore'),
    Promise = require('./promise');

/**
 * HTTP based API class with authorization hook
 *
 * @constructor
 * @extends events.EventEmitter
 * @param {Connection} conn - Connection object
 * @param {Object} [options] - Http API Options
 * @param {String} [options.responseType] - Overriding content mime-type in response
 * @param {Transport} [options.transport] - Transport for http api
 * @param {Object} [options.noContentResponse] - Alternative response when no content returned in response (= HTTP 204)
 */
var HttpApi = function(conn, options) {
  options = options || {};
  this._conn = conn;
  this.on('resume', function(err) { conn.emit('resume', err); });
  this._responseType = options.responseType;
  this._transport = options.transport || conn._transport;
  this._noContentResponse = options.noContentResponse;
};

inherits(HttpApi, events.EventEmitter);

/**
 * Callout to API endpoint using http
 *
 * @param {Object} request - Http Request object
 * @param {String} request.url - Endpoint URL to request
 * @param {String} request.method - Http method for request
 * @param {Object} [request.headers] - Http request headers in hash object
 * @param {Callback.<Object>} callback - Callback function
 * @returns {Promise.<Object>} - 
 */
HttpApi.prototype.request = function(request, callback) {
  var self = this;
  var conn = this._conn;
  var logger = conn._logger;
  var refreshDelegate = this.getRefreshDelegate();

  var deferred = Promise.defer();

  var onResume = function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    self.request(request).then(function(response) {
      deferred.resolve(response);
    }, function(err) {
      deferred.reject(err);
    });
  };

  if (refreshDelegate && refreshDelegate._refreshing) {
    refreshDelegate.once('resume', onResume);
    return deferred.promise.thenCall(callback);
  }

  // hook before sending
  self.beforeSend(request);

  self.emit('request', request);

  logger.debug("<request> method=" + request.method + ", url=" + request.url);
  var requestTime = Date.now();

  var onFailure = function(err) {
    var responseTime = Date.now();
    logger.debug("elappsed time : " + (responseTime - requestTime) + "msec");

    logger.error(err);
    throw err;
  };

  var onResponse = function(response) {
    var responseTime = Date.now();
    logger.debug("elappsed time : " + (responseTime - requestTime) + "msec");

    logger.debug("<response> status=" + response.statusCode + ", url=" + request.url);

    self.emit('response', response);

    // Refresh token if session has been expired and requires authentication
    // when oauth2 info and refresh token is available.
    if (self.isSessionExpired(response) && refreshDelegate) {
      // Access token may be refreshed before the response
      if (refreshDelegate._lastRefreshedAt > requestTime) {
        onResume();
      } else {
        refreshDelegate.refresh(onResume);
      }
      return deferred.promise;
    }

    var err = self.getError(response);
    if (err) {
      throw err;
    } else {
      return self.getResponseBody(response);
    }
  };

  return this._transport.httpRequest(request).then(onResponse, onFailure).thenCall(callback);

};

/**
 * @protected
 */
HttpApi.prototype.getRefreshDelegate = function() {
  return this._conn._refreshDelegate;
};

/**
 *
 * @protected
 */
HttpApi.prototype.beforeSend = function(request) {
  request.headers = request.headers || {};
  if (this._conn.accessToken) {
    request.headers.Authorization = "Bearer " + this._conn.accessToken;
  }
};

/**
 * Detect response content mime-type
 * @protected
 */
HttpApi.prototype.getContentType = function(response) {
  return this._responseType || response.headers && response.headers["content-type"];
};

/**
 * Get response body
 * @protected
 */
HttpApi.prototype.getResponseBody = function(response) {
  if (response.statusCode === 204) { // No Content
    return this._noContentResponse;
  }
  var contentType = this.getContentType(response);
  var parseBody = /^application\/xml(;|$)/.test(contentType) ? parseXML :
         /^application\/json(;|$)/.test(contentType) ? parseJSON :
         /^text\/csv(;|$)/.test(contentType) ? parseCSV :
         parseText;
  var res = parseBody(response.body);
  if (response.statusCode === 300) { // Multiple Choices
    var err = new Error('Multiple records found');
    err.name = "MULTIPLE_CHOICES";
    err.content = res;
    throw err;
  }
  return res;
};

/** @private */
function parseJSON(str) {
  return JSON.parse(str);
}

/** @private */
function parseXML(str) {
  var ret = {};
  require('xml2js').parseString(str, { explicitArray: false }, function(err, result) {
    ret = { error: err, result : result };
  });
  if (ret.error) { throw ret.error; }
  return ret.result;
}

/** @private */
function parseCSV(str) {
  return require('./csv').parseCSV(str);
}

/** @private */
function parseText(str) { return str; }


/**
 * Detect session expiry
 * @protected
 */
HttpApi.prototype.isSessionExpired = function(response) {
  return response.statusCode === 401;
};

/**
 * Detect error response
 * @protected
 */
HttpApi.prototype.isErrorResponse = function(response) {
  return response.statusCode >= 400;
};

/**
 * Parsing error message in response
 * @protected
 */
HttpApi.prototype.parseError = function(response) {
  var errors = this.getResponseBody(response);
  return _.isArray(errors) ? errors[0] : errors;
};

/**
 * Get error message in response
 * @protected
 */
HttpApi.prototype.getError = function(response) {
  if (this.isErrorResponse(response)) {
    var error;
    try {
      error = this.parseError(response);
    } catch(e) {}
    error = _.isObject(error) && _.isString(error.message) ? error : {
      errorCode: 'ERROR_HTTP_' + response.statusCode,
      message : response.body
    };
    var err = new Error(error.message);
    err.name = error.errorCode;
    for (var key in error) { err[key] = error[key]; }
    return err;
  }
};

/*-------------------------------------------------------------------------*/

/**
 * @protected
 */
var SessionRefreshDelegate = function(conn, refreshFn) {
  this._conn = conn;
  this._refreshFn = refreshFn;
  this._refreshing = false;
};

inherits(SessionRefreshDelegate, events.EventEmitter);

/**
 * Refresh access token
 * @private
 */
SessionRefreshDelegate.prototype.refresh = function(callback) {
  var self = this;
  var conn = this._conn;
  var logger = conn._logger;
  self.once('resume', callback);
  if (self._refreshing) { return; }
  logger.debug("<refresh token>");
  self._refreshing = true;
  return self._refreshFn(conn, function(err, accessToken, res) {
    if (!err) {
      logger.debug("Connection refresh completed. Refreshed access token = " + accessToken);
      conn.accessToken = accessToken;
      conn.emit("refresh", accessToken, res);
    }
    self._lastRefreshedAt = Date.now();
    self._refreshing = false;
    self.emit('resume', err);
  });
};


/**
 *
 */
HttpApi.SessionRefreshDelegate = SessionRefreshDelegate;
module.exports = HttpApi;