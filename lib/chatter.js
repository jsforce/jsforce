/**
 * @file Manages Salesforce Chatter REST API calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
var util = require('util'),
    _ = require('underscore'),
    Promise = require('./promise');

/**
 * API class for Chatter REST API call
 *
 * @constructor
 * @param {Connection} conn Connection
 */
var Chatter = module.exports = function(conn) {
  this._conn = conn;
};

/**
 * Sending request to API endpoint
 * @private
 */
Chatter.prototype._request = function(params, callback) {
  if (/^(put|post|patch)$/i.test(params.method) && params.body) {
    params.headers = {
      "Content-Type": "application/json"
    };
    params.body = JSON.stringify(params.body);
  }
  params.url = this._normalizeUrl(params.url);
  return this._conn._request(params, callback);
};

/**
 * Convert path to site root relative url
 * @private
 */
Chatter.prototype._normalizeUrl = function(url) {
  if (url.indexOf('/chatter/') === 0 || url.indexOf('/connect/') === 0) {
    return '/services/data/v' + this._conn.version + url;
  } else if (/^\/v[\d]+\.[\d]+\//.test(url)) {
    return '/services/data' + url;
  } else if (url.indexOf('/services/') !== 0 && url[0] === '/') {
    return '/services/data/v' + this._conn.version + '/chatter' + url;
  } else {
    return url;
  }
};

/**
 * @typedef {Object} RequestResult
 * @memberof Chatter
 */

/**
 * @typedef {Object} RequestParams
 * @memberof Chatter
 * @param {String} method - HTTP method
 * @param {String} url - Resource URL
 * @param {String} [body] - HTTP body (in POST/PUT/PATCH methods)
 */

/**
 * Make a request for chatter API resource
 *
 * @param {Chatter.RequestParams} params - Paramters representing HTTP request
 * @param {Callback.<Chatter.RequestResult>} [callback] - Callback func
 * @returns {Chatter.Request}
 */
Chatter.prototype.request = function(params, callback) {
  return new Request(this, params).thenCall(callback);
};

/**
 * Make a resource request to chatter API
 *
 * @param {String} url - Resource URL
 * @param {Object} [queryParams] - Query parameters (in hash object)
 * @returns {Chatter.Resource}
 */
Chatter.prototype.resource = function(url, queryParams) {
  return new Resource(this, url, queryParams);
};

/**
 * @typedef {Object} BatchRequestResult
 * @memberof Chatter
 * @extends Chatter.RequestResult
 * @prop {Boolean} hasError - Flag if the batch has one or more errors
 * @prop {Array.<Object>} results - Batch request results in array
 * @prop {Number} results.statusCode - HTTP response status code
 * @prop {Chatter.RequestResult} results.result - Parsed HTTP response body
 */

/**
 * Make a batch request to chatter API
 *
 * @params {Array.<Chatter.Request>} requests - Chatter API requests
 * @param {Callback.<Chatter.BatchRequestResult>} [callback] - Callback func
 * @returns {Promise.<Chatter.BatchRequestResult>}
 */
Chatter.prototype.batch = function(requests, callback) {
  var self = this;
  var batchRequests = [], batchDeferreds = [];
  _.forEach(requests, function(request) {
    var deferred = Promise.defer();
    request._promise = deferred.promise;
    batchRequests.push(request.batchParams());
    batchDeferreds.push(deferred);
  });
  var params = {
    method: 'POST',
    url: this._normalizeUrl('/connect/batch'),
    body: {
      batchRequests: batchRequests
    }
  };
  return this._request(params).then(function(res) {
    _.forEach(res.results, function(result, i) {
      var deferred = batchDeferreds[i];
      if (result.statusCode >= 400) {
        deferred.reject(result.result);
      } else {
        deferred.resolve(result.result);
      }
    });
    return res;
  }).thenCall(callback);
};

/*--------------------------------------------*/
/**
 * A class representing chatter API request
 *
 * @protected
 * @memberof Chatter
 * @class
 * @constructor
 * @implements Promise.<Chatter.RequestResult>
 * @param {Chatter} chatter - Chatter API object
 * @param {Chatter.RequestParams} params - Paramters representing HTTP request
 */
var Request = Chatter.Request = function(chatter, params) {
  this._chatter = chatter;
  this._params = params;
  this._promise = null;
};

/**
 * @typedef {Object} BatchRequestParams
 * @memberof Chatter
 * @param {String} method - HTTP method
 * @param {String} url - Resource URL
 * @param {String} [richInput] - HTTP body (in POST/PUT/PATCH methods)
 */

/**
 * Retrieve parameters in batch request form
 *
 * @returns {BatchRequestParams}
 */
Request.prototype.batchParams = function() {
  var params = this._params;
  var batchParams = {
    method: params.method,
    url: this._chatter._normalizeUrl(params.url)
  };
  if (this._params.body) {
    batchParams.richInput = this._params.body;
  }
  return batchParams;
};

/**
 * Retrieve parameters in batch request form
 *
 * @returns {Promise.<RequestResult>}
 */
Request.prototype.promise = function() {
  return this._promise || this._chatter._request(this._params);
};

/**
 * Returns Node.js Stream object for request
 *
 * @returns {stream.Stream}
 */
Request.prototype.stream = function() {
  return this._chatter._request(this._params).stream();
};

/**
 * Promise/A+ interface
 * http://promises-aplus.github.io/promises-spec/
 *
 * Delegate to deferred promise, return promise instance for batch result
 */
Request.prototype.then = function(onResolve, onReject) {
  return this.promise().then(onResolve, onReject);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 */
Request.prototype.thenCall = function(callback) {
  return _.isFunction(callback) ? this.promise().thenCall(callback) : this;
};


/*--------------------------------------------*/
/**
 * A class representing chatter API resource
 *
 * @protected
 * @memberof Chatter
 * @constructor
 * @class
 * @extends Chatter.Request
 * @param {Chatter} chatter - Chatter API object
 * @param {String} url - Resource URL
 * @param {Object} [queryParams] - Query parameters (in hash object)
 */
var Resource = Chatter.Resource = function(chatter, url, queryParams) {
  if (queryParams) {
    var qstring = _.map(_.keys(queryParams), function(name) {
      return name + "=" + encodeURIComponent(queryParams[name]);
    }).join('&');
    url += (url.indexOf('?') > 0 ? '&' : '?') + qstring;
  }
  Resource.super_.call(this, chatter, { method: 'GET', url: url });
  this._url = url;
};

util.inherits(Resource, Request);

/**
 * Create a new resource
 *
 * @param {Objecjt} data - Data to newly post
 * @param {Callback.<RequestResult>} [callback] - Callback function
 * @returns {Chatter.Request}
 */
Resource.prototype.create = function(data, callback) {
  return this._chatter.request({
    method: 'POST',
    url: this._url,
    body: data
  }).thenCall(callback);
};

/**
 * Retrieve resource content
 *
 * @param {Callback.<RequestResult>} [callback] - Callback function
 * @returns {Chatter.Request}
 */
Resource.prototype.retrieve = function(callback) {
  return this.thenCall(callback);
};

/**
 * Update specified resource
 *
 * @param {Obejct} data - Data to update
 * @param {Callback.<RequestResult>} [callback] - Callback function
 * @returns {Chatter.Request}
 */
Resource.prototype.update = function(data, callback) {
  return this._chatter.request({
    method: 'POST',
    url: this._url,
    body: data
  }).thenCall(callback);
};

/**
 * Delete specified resource
 *
 * @param {Callback.<RequestResult>} [callback] - Callback function
 * @returns {Chatter.Request}
 */
Resource.prototype.del =
Resource.prototype.delete = function(callback) {
  return this._chatter.request({
    method: 'DELETE',
    url: this._url
  }).thenCall(callback);
};
