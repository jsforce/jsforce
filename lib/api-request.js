var inherits = require('inherits'),
    events = require('events'),
    _ = require('underscore'),
    Promise = require('./promise');

/**
 *
 */
var ApiRequest = function(conn, options) {
  options = options || {};
  this._conn = conn;
  this.on('resume', function(err) { conn.emit('resume', err); });
  this._transport = options.transport || conn._transport;
  this._refreshDelegate = options.refreshDelegate;
  this._noContentResponse = options.noContentResponse;
};

inherits(ApiRequest, events.EventEmitter);

/**
 *
 */
ApiRequest.prototype.send = function(params, callback) {
  var self = this;
  var conn = this._conn;
  var logger = conn._logger;

  var deferred = Promise.defer();

  var onResume = function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    self.send(params).then(function(response) {
      deferred.resolve(response);
    }, function(err) {
      deferred.reject(err);
    });
  };

  if (conn._suspended) {
    conn.once('resume', onResume);
    return deferred.promise.thenCall(callback);
  }

  // hook before sending
  self.beforeSend(params);

  self.emit('request', params);

  logger.debug("<request> method=" + params.method + ", url=" + params.url);
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

    logger.debug("<response> status=" + response.statusCode + ", url=" + params.url);

    self.emit('response', response);

    // Refresh token if session has been expired and requires authentication
    // when oauth2 info and refresh token is available.
    if (self.isSessionExpired(response) && self._refreshDelegate) {
      // Access token may be refreshed before the response
      if (self._initializedAt > requestTime) {
        onResume();
      } else {
        self.once('resume', onResume);
        if (!self._suspended) {
          self._suspended = true;
          self._refresh();
        }
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

  return this._transport.httpRequest(params).then(onResponse, onFailure).thenCall(callback);

};

/**
 *
 * @protected
 */
ApiRequest.prototype.beforeSend = function(params) {
  params.headers = params.headers || {};
  if (this._conn.accessToken) {
    params.headers.Authorization = "Bearer " + this._conn.accessToken;
  }
};

/**
 * Detect response content mime-type
 * @protected
 */
ApiRequest.prototype.getContentType = function(response) {
  return response.headers && response.headers["content-type"];
};

/**
 * Get response body
 * @protected
 */
ApiRequest.prototype.getResponseBody = function(response) {
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
ApiRequest.prototype.isSessionExpired = function(response) {
  return response.statusCode === 401;
};

/**
 * Detect error response
 * @protected
 */
ApiRequest.prototype.isErrorResponse = function(response) {
  return response.statusCode >= 400;
};

/**
 * Parsing error message in response
 * @protected
 */
ApiRequest.prototype.getError = function(response) {
  if (this.isErrorResponse(response)) {
    var error;
    try {
      var errors = this.getResponseBody(response);
      error = _.isArray(errors) ? errors[0] : errors;
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

module.exports = ApiRequest;