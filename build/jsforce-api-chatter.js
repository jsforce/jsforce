(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Chatter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @file Manages Salesforce Chatter REST API calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var inherits = window.jsforce.require('inherits'),
    _       = window.jsforce.require('lodash/core'),
    jsforce = window.jsforce.require('./core'),
    Promise = window.jsforce.require('./promise');

/**
 * API class for Chatter REST API call
 *
 * @class
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
  if (/^(put|post|patch)$/i.test(params.method)) {
    if (_.isObject(params.body)) {
      params.headers = {
        "Content-Type": "application/json"
      };
      params.body = JSON.stringify(params.body);
    }
  }
  params.url = this._normalizeUrl(params.url);
  return this._conn.request(params, callback);
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
 * @typedef {Object} Chatter~RequestParams
 * @prop {String} method - HTTP method
 * @prop {String} url - Resource URL
 * @prop {String} [body] - HTTP body (in POST/PUT/PATCH methods)
 */

/**
 * @typedef {Object} Chatter~RequestResult
 */

/**
 * Make a request for chatter API resource
 *
 * @param {Chatter~RequestParams} params - Paramters representing HTTP request
 * @param {Callback.<Chatter~RequestResult>} [callback] - Callback func
 * @returns {Chatter~Request}
 */
Chatter.prototype.request = function(params, callback) {
  return new Request(this, params).thenCall(callback);
};

/**
 * Make a resource request to chatter API
 *
 * @param {String} url - Resource URL
 * @param {Object} [queryParams] - Query parameters (in hash object)
 * @returns {Chatter~Resource}
 */
Chatter.prototype.resource = function(url, queryParams) {
  return new Resource(this, url, queryParams);
};

/**
 * @typedef {Object} Chatter~BatchRequestResult
 * @prop {Boolean} hasError - Flag if the batch has one or more errors
 * @prop {Array.<Object>} results - Batch request results in array
 * @prop {Number} results.statusCode - HTTP response status code
 * @prop {Chatter~RequestResult} results.result - Parsed HTTP response body
 */

/**
 * Make a batch request to chatter API
 *
 * @params {Array.<Chatter~Request>} requests - Chatter API requests
 * @param {Callback.<Chatter~BatchRequestResult>} [callback] - Callback func
 * @returns {Promise.<Chatter~BatchRequestResult>}
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
  return this.request(params).then(function(res) {
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
 * @class Chatter~Request
 * @implements {Promise.<Chatter~RequestResult>}
 * @param {Chatter} chatter - Chatter API object
 * @param {Chatter~RequestParams} params - Paramters representing HTTP request
 */
var Request = function(chatter, params) {
  this._chatter = chatter;
  this._params = params;
  this._promise = null;
};

/**
 * @typedef {Object} Chatter~BatchRequestParams
 * @prop {String} method - HTTP method
 * @prop {String} url - Resource URL
 * @prop {String} [richInput] - HTTP body (in POST/PUT/PATCH methods)
 */

/**
 * Retrieve parameters in batch request form
 *
 * @method Chatter~Request#batchParams
 * @returns {Chatter~BatchRequestParams}
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
 * @method Chatter~Request#promise
 * @returns {Promise.<Chatter~RequestResult>}
 */
Request.prototype.promise = function() {
  return this._promise || this._chatter._request(this._params);
};

/**
 * Returns Node.js Stream object for request
 *
 * @method Chatter~Request#stream
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
 *
 * @method Chatter~Request#then
 */
Request.prototype.then = function(onResolve, onReject) {
  return this.promise().then(onResolve, onReject);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 *
 * @method Chatter~Request#thenCall
 */
Request.prototype.thenCall = function(callback) {
  return _.isFunction(callback) ? this.promise().thenCall(callback) : this;
};


/*--------------------------------------------*/
/**
 * A class representing chatter API resource
 *
 * @protected
 * @class Chatter~Resource
 * @extends Chatter~Request
 * @param {Chatter} chatter - Chatter API object
 * @param {String} url - Resource URL
 * @param {Object} [queryParams] - Query parameters (in hash object)
 */
var Resource = function(chatter, url, queryParams) {
  if (queryParams) {
    var qstring = _.map(_.keys(queryParams), function(name) {
      return name + "=" + encodeURIComponent(queryParams[name]);
    }).join('&');
    url += (url.indexOf('?') > 0 ? '&' : '?') + qstring;
  }
  Resource.super_.call(this, chatter, { method: 'GET', url: url });
  this._url = url;
};

inherits(Resource, Request);

/**
 * Create a new resource
 *
 * @method Chatter~Resource#create
 * @param {Object} data - Data to newly post
 * @param {Callback.<Chatter~RequestResult>} [callback] - Callback function
 * @returns {Chatter~Request}
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
 * @method Chatter~Resource#retrieve
 * @param {Callback.<Chatter~RequestResult>} [callback] - Callback function
 * @returns {Chatter~Request}
 */
Resource.prototype.retrieve = function(callback) {
  return this.thenCall(callback);
};

/**
 * Update specified resource
 *
 * @method Chatter~Resource#update
 * @param {Obejct} data - Data to update
 * @param {Callback.<Chatter~RequestResult>} [callback] - Callback function
 * @returns {Chatter~Request}
 */
Resource.prototype.update = function(data, callback) {
  return this._chatter.request({
    method: 'POST',
    url: this._url,
    body: data
  }).thenCall(callback);
};

/**
 * Synonym of Resource#delete()
 *
 * @method Chatter~Resource#del
 * @param {Callback.<Chatter~RequestResult>} [callback] - Callback function
 * @returns {Chatter~Request}
 */
/**
 * Delete specified resource
 *
 * @method Chatter~Resource#delete
 * @param {Callback.<Chatter~RequestResult>} [callback] - Callback function
 * @returns {Chatter~Request}
 */
Resource.prototype.del =
Resource.prototype["delete"] = function(callback) {
  return this._chatter.request({
    method: 'DELETE',
    url: this._url
  }).thenCall(callback);
};


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.chatter = new Chatter(conn);
});

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL2NoYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcclxuICogQGZpbGUgTWFuYWdlcyBTYWxlc2ZvcmNlIENoYXR0ZXIgUkVTVCBBUEkgY2FsbHNcclxuICogQGF1dGhvciBTaGluaWNoaSBUb21pdGEgPHNoaW5pY2hpLnRvbWl0YUBnbWFpbC5jb20+XHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGluaGVyaXRzID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnaW5oZXJpdHMnKSxcclxuICAgIF8gICAgICAgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdsb2Rhc2gvY29yZScpLFxyXG4gICAganNmb3JjZSA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vY29yZScpLFxyXG4gICAgUHJvbWlzZSA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vcHJvbWlzZScpO1xyXG5cclxuLyoqXHJcbiAqIEFQSSBjbGFzcyBmb3IgQ2hhdHRlciBSRVNUIEFQSSBjYWxsXHJcbiAqXHJcbiAqIEBjbGFzc1xyXG4gKiBAcGFyYW0ge0Nvbm5lY3Rpb259IGNvbm4gQ29ubmVjdGlvblxyXG4gKi9cclxudmFyIENoYXR0ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbm4pIHtcclxuICB0aGlzLl9jb25uID0gY29ubjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZW5kaW5nIHJlcXVlc3QgdG8gQVBJIGVuZHBvaW50XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5DaGF0dGVyLnByb3RvdHlwZS5fcmVxdWVzdCA9IGZ1bmN0aW9uKHBhcmFtcywgY2FsbGJhY2spIHtcclxuICBpZiAoL14ocHV0fHBvc3R8cGF0Y2gpJC9pLnRlc3QocGFyYW1zLm1ldGhvZCkpIHtcclxuICAgIGlmIChfLmlzT2JqZWN0KHBhcmFtcy5ib2R5KSkge1xyXG4gICAgICBwYXJhbXMuaGVhZGVycyA9IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICB9O1xyXG4gICAgICBwYXJhbXMuYm9keSA9IEpTT04uc3RyaW5naWZ5KHBhcmFtcy5ib2R5KTtcclxuICAgIH1cclxuICB9XHJcbiAgcGFyYW1zLnVybCA9IHRoaXMuX25vcm1hbGl6ZVVybChwYXJhbXMudXJsKTtcclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHBhcmFtcywgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgcGF0aCB0byBzaXRlIHJvb3QgcmVsYXRpdmUgdXJsXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5DaGF0dGVyLnByb3RvdHlwZS5fbm9ybWFsaXplVXJsID0gZnVuY3Rpb24odXJsKSB7XHJcbiAgaWYgKHVybC5pbmRleE9mKCcvY2hhdHRlci8nKSA9PT0gMCB8fCB1cmwuaW5kZXhPZignL2Nvbm5lY3QvJykgPT09IDApIHtcclxuICAgIHJldHVybiAnL3NlcnZpY2VzL2RhdGEvdicgKyB0aGlzLl9jb25uLnZlcnNpb24gKyB1cmw7XHJcbiAgfSBlbHNlIGlmICgvXlxcL3ZbXFxkXStcXC5bXFxkXStcXC8vLnRlc3QodXJsKSkge1xyXG4gICAgcmV0dXJuICcvc2VydmljZXMvZGF0YScgKyB1cmw7XHJcbiAgfSBlbHNlIGlmICh1cmwuaW5kZXhPZignL3NlcnZpY2VzLycpICE9PSAwICYmIHVybFswXSA9PT0gJy8nKSB7XHJcbiAgICByZXR1cm4gJy9zZXJ2aWNlcy9kYXRhL3YnICsgdGhpcy5fY29ubi52ZXJzaW9uICsgJy9jaGF0dGVyJyArIHVybDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHVybDtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gQ2hhdHRlcn5SZXF1ZXN0UGFyYW1zXHJcbiAqIEBwcm9wIHtTdHJpbmd9IG1ldGhvZCAtIEhUVFAgbWV0aG9kXHJcbiAqIEBwcm9wIHtTdHJpbmd9IHVybCAtIFJlc291cmNlIFVSTFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBbYm9keV0gLSBIVFRQIGJvZHkgKGluIFBPU1QvUFVUL1BBVENIIG1ldGhvZHMpXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENoYXR0ZXJ+UmVxdWVzdFJlc3VsdFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBNYWtlIGEgcmVxdWVzdCBmb3IgY2hhdHRlciBBUEkgcmVzb3VyY2VcclxuICpcclxuICogQHBhcmFtIHtDaGF0dGVyflJlcXVlc3RQYXJhbXN9IHBhcmFtcyAtIFBhcmFtdGVycyByZXByZXNlbnRpbmcgSFRUUCByZXF1ZXN0XHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPENoYXR0ZXJ+UmVxdWVzdFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jXHJcbiAqIEByZXR1cm5zIHtDaGF0dGVyflJlcXVlc3R9XHJcbiAqL1xyXG5DaGF0dGVyLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24ocGFyYW1zLCBjYWxsYmFjaykge1xyXG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCBwYXJhbXMpLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWtlIGEgcmVzb3VyY2UgcmVxdWVzdCB0byBjaGF0dGVyIEFQSVxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gUmVzb3VyY2UgVVJMXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcXVlcnlQYXJhbXNdIC0gUXVlcnkgcGFyYW1ldGVycyAoaW4gaGFzaCBvYmplY3QpXHJcbiAqIEByZXR1cm5zIHtDaGF0dGVyflJlc291cmNlfVxyXG4gKi9cclxuQ2hhdHRlci5wcm90b3R5cGUucmVzb3VyY2UgPSBmdW5jdGlvbih1cmwsIHF1ZXJ5UGFyYW1zKSB7XHJcbiAgcmV0dXJuIG5ldyBSZXNvdXJjZSh0aGlzLCB1cmwsIHF1ZXJ5UGFyYW1zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDaGF0dGVyfkJhdGNoUmVxdWVzdFJlc3VsdFxyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gaGFzRXJyb3IgLSBGbGFnIGlmIHRoZSBiYXRjaCBoYXMgb25lIG9yIG1vcmUgZXJyb3JzXHJcbiAqIEBwcm9wIHtBcnJheS48T2JqZWN0Pn0gcmVzdWx0cyAtIEJhdGNoIHJlcXVlc3QgcmVzdWx0cyBpbiBhcnJheVxyXG4gKiBAcHJvcCB7TnVtYmVyfSByZXN1bHRzLnN0YXR1c0NvZGUgLSBIVFRQIHJlc3BvbnNlIHN0YXR1cyBjb2RlXHJcbiAqIEBwcm9wIHtDaGF0dGVyflJlcXVlc3RSZXN1bHR9IHJlc3VsdHMucmVzdWx0IC0gUGFyc2VkIEhUVFAgcmVzcG9uc2UgYm9keVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBNYWtlIGEgYmF0Y2ggcmVxdWVzdCB0byBjaGF0dGVyIEFQSVxyXG4gKlxyXG4gKiBAcGFyYW1zIHtBcnJheS48Q2hhdHRlcn5SZXF1ZXN0Pn0gcmVxdWVzdHMgLSBDaGF0dGVyIEFQSSByZXF1ZXN0c1xyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxDaGF0dGVyfkJhdGNoUmVxdWVzdFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxDaGF0dGVyfkJhdGNoUmVxdWVzdFJlc3VsdD59XHJcbiAqL1xyXG5DaGF0dGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uKHJlcXVlc3RzLCBjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICB2YXIgYmF0Y2hSZXF1ZXN0cyA9IFtdLCBiYXRjaERlZmVycmVkcyA9IFtdO1xyXG4gIF8uZm9yRWFjaChyZXF1ZXN0cywgZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gICAgdmFyIGRlZmVycmVkID0gUHJvbWlzZS5kZWZlcigpO1xyXG4gICAgcmVxdWVzdC5fcHJvbWlzZSA9IGRlZmVycmVkLnByb21pc2U7XHJcbiAgICBiYXRjaFJlcXVlc3RzLnB1c2gocmVxdWVzdC5iYXRjaFBhcmFtcygpKTtcclxuICAgIGJhdGNoRGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xyXG4gIH0pO1xyXG4gIHZhciBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIHVybDogdGhpcy5fbm9ybWFsaXplVXJsKCcvY29ubmVjdC9iYXRjaCcpLFxyXG4gICAgYm9keToge1xyXG4gICAgICBiYXRjaFJlcXVlc3RzOiBiYXRjaFJlcXVlc3RzXHJcbiAgICB9XHJcbiAgfTtcclxuICByZXR1cm4gdGhpcy5yZXF1ZXN0KHBhcmFtcykudGhlbihmdW5jdGlvbihyZXMpIHtcclxuICAgIF8uZm9yRWFjaChyZXMucmVzdWx0cywgZnVuY3Rpb24ocmVzdWx0LCBpKSB7XHJcbiAgICAgIHZhciBkZWZlcnJlZCA9IGJhdGNoRGVmZXJyZWRzW2ldO1xyXG4gICAgICBpZiAocmVzdWx0LnN0YXR1c0NvZGUgPj0gNDAwKSB7XHJcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3VsdC5yZXN1bHQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0LnJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9KS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG5cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qKlxyXG4gKiBBIGNsYXNzIHJlcHJlc2VudGluZyBjaGF0dGVyIEFQSSByZXF1ZXN0XHJcbiAqXHJcbiAqIEBwcm90ZWN0ZWRcclxuICogQGNsYXNzIENoYXR0ZXJ+UmVxdWVzdFxyXG4gKiBAaW1wbGVtZW50cyB7UHJvbWlzZS48Q2hhdHRlcn5SZXF1ZXN0UmVzdWx0Pn1cclxuICogQHBhcmFtIHtDaGF0dGVyfSBjaGF0dGVyIC0gQ2hhdHRlciBBUEkgb2JqZWN0XHJcbiAqIEBwYXJhbSB7Q2hhdHRlcn5SZXF1ZXN0UGFyYW1zfSBwYXJhbXMgLSBQYXJhbXRlcnMgcmVwcmVzZW50aW5nIEhUVFAgcmVxdWVzdFxyXG4gKi9cclxudmFyIFJlcXVlc3QgPSBmdW5jdGlvbihjaGF0dGVyLCBwYXJhbXMpIHtcclxuICB0aGlzLl9jaGF0dGVyID0gY2hhdHRlcjtcclxuICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XHJcbiAgdGhpcy5fcHJvbWlzZSA9IG51bGw7XHJcbn07XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gQ2hhdHRlcn5CYXRjaFJlcXVlc3RQYXJhbXNcclxuICogQHByb3Age1N0cmluZ30gbWV0aG9kIC0gSFRUUCBtZXRob2RcclxuICogQHByb3Age1N0cmluZ30gdXJsIC0gUmVzb3VyY2UgVVJMXHJcbiAqIEBwcm9wIHtTdHJpbmd9IFtyaWNoSW5wdXRdIC0gSFRUUCBib2R5IChpbiBQT1NUL1BVVC9QQVRDSCBtZXRob2RzKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZSBwYXJhbWV0ZXJzIGluIGJhdGNoIHJlcXVlc3QgZm9ybVxyXG4gKlxyXG4gKiBAbWV0aG9kIENoYXR0ZXJ+UmVxdWVzdCNiYXRjaFBhcmFtc1xyXG4gKiBAcmV0dXJucyB7Q2hhdHRlcn5CYXRjaFJlcXVlc3RQYXJhbXN9XHJcbiAqL1xyXG5SZXF1ZXN0LnByb3RvdHlwZS5iYXRjaFBhcmFtcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBwYXJhbXMgPSB0aGlzLl9wYXJhbXM7XHJcbiAgdmFyIGJhdGNoUGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiBwYXJhbXMubWV0aG9kLFxyXG4gICAgdXJsOiB0aGlzLl9jaGF0dGVyLl9ub3JtYWxpemVVcmwocGFyYW1zLnVybClcclxuICB9O1xyXG4gIGlmICh0aGlzLl9wYXJhbXMuYm9keSkge1xyXG4gICAgYmF0Y2hQYXJhbXMucmljaElucHV0ID0gdGhpcy5fcGFyYW1zLmJvZHk7XHJcbiAgfVxyXG4gIHJldHVybiBiYXRjaFBhcmFtcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZSBwYXJhbWV0ZXJzIGluIGJhdGNoIHJlcXVlc3QgZm9ybVxyXG4gKlxyXG4gKiBAbWV0aG9kIENoYXR0ZXJ+UmVxdWVzdCNwcm9taXNlXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxDaGF0dGVyflJlcXVlc3RSZXN1bHQ+fVxyXG4gKi9cclxuUmVxdWVzdC5wcm90b3R5cGUucHJvbWlzZSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLl9wcm9taXNlIHx8IHRoaXMuX2NoYXR0ZXIuX3JlcXVlc3QodGhpcy5fcGFyYW1zKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIE5vZGUuanMgU3RyZWFtIG9iamVjdCBmb3IgcmVxdWVzdFxyXG4gKlxyXG4gKiBAbWV0aG9kIENoYXR0ZXJ+UmVxdWVzdCNzdHJlYW1cclxuICogQHJldHVybnMge3N0cmVhbS5TdHJlYW19XHJcbiAqL1xyXG5SZXF1ZXN0LnByb3RvdHlwZS5zdHJlYW0gPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5fY2hhdHRlci5fcmVxdWVzdCh0aGlzLl9wYXJhbXMpLnN0cmVhbSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFByb21pc2UvQSsgaW50ZXJmYWNlXHJcbiAqIGh0dHA6Ly9wcm9taXNlcy1hcGx1cy5naXRodWIuaW8vcHJvbWlzZXMtc3BlYy9cclxuICpcclxuICogRGVsZWdhdGUgdG8gZGVmZXJyZWQgcHJvbWlzZSwgcmV0dXJuIHByb21pc2UgaW5zdGFuY2UgZm9yIGJhdGNoIHJlc3VsdFxyXG4gKlxyXG4gKiBAbWV0aG9kIENoYXR0ZXJ+UmVxdWVzdCN0aGVuXHJcbiAqL1xyXG5SZXF1ZXN0LnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25SZXNvbHZlLCBvblJlamVjdCkge1xyXG4gIHJldHVybiB0aGlzLnByb21pc2UoKS50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFByb21pc2UvQSsgZXh0ZW5zaW9uXHJcbiAqIENhbGwgXCJ0aGVuXCIgdXNpbmcgZ2l2ZW4gbm9kZS1zdHlsZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKlxyXG4gKiBAbWV0aG9kIENoYXR0ZXJ+UmVxdWVzdCN0aGVuQ2FsbFxyXG4gKi9cclxuUmVxdWVzdC5wcm90b3R5cGUudGhlbkNhbGwgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHJldHVybiBfLmlzRnVuY3Rpb24oY2FsbGJhY2spID8gdGhpcy5wcm9taXNlKCkudGhlbkNhbGwoY2FsbGJhY2spIDogdGhpcztcclxufTtcclxuXHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLyoqXHJcbiAqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGNoYXR0ZXIgQVBJIHJlc291cmNlXHJcbiAqXHJcbiAqIEBwcm90ZWN0ZWRcclxuICogQGNsYXNzIENoYXR0ZXJ+UmVzb3VyY2VcclxuICogQGV4dGVuZHMgQ2hhdHRlcn5SZXF1ZXN0XHJcbiAqIEBwYXJhbSB7Q2hhdHRlcn0gY2hhdHRlciAtIENoYXR0ZXIgQVBJIG9iamVjdFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gUmVzb3VyY2UgVVJMXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcXVlcnlQYXJhbXNdIC0gUXVlcnkgcGFyYW1ldGVycyAoaW4gaGFzaCBvYmplY3QpXHJcbiAqL1xyXG52YXIgUmVzb3VyY2UgPSBmdW5jdGlvbihjaGF0dGVyLCB1cmwsIHF1ZXJ5UGFyYW1zKSB7XHJcbiAgaWYgKHF1ZXJ5UGFyYW1zKSB7XHJcbiAgICB2YXIgcXN0cmluZyA9IF8ubWFwKF8ua2V5cyhxdWVyeVBhcmFtcyksIGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgcmV0dXJuIG5hbWUgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChxdWVyeVBhcmFtc1tuYW1lXSk7XHJcbiAgICB9KS5qb2luKCcmJyk7XHJcbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPiAwID8gJyYnIDogJz8nKSArIHFzdHJpbmc7XHJcbiAgfVxyXG4gIFJlc291cmNlLnN1cGVyXy5jYWxsKHRoaXMsIGNoYXR0ZXIsIHsgbWV0aG9kOiAnR0VUJywgdXJsOiB1cmwgfSk7XHJcbiAgdGhpcy5fdXJsID0gdXJsO1xyXG59O1xyXG5cclxuaW5oZXJpdHMoUmVzb3VyY2UsIFJlcXVlc3QpO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG5ldyByZXNvdXJjZVxyXG4gKlxyXG4gKiBAbWV0aG9kIENoYXR0ZXJ+UmVzb3VyY2UjY3JlYXRlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gRGF0YSB0byBuZXdseSBwb3N0XHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPENoYXR0ZXJ+UmVxdWVzdFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7Q2hhdHRlcn5SZXF1ZXN0fVxyXG4gKi9cclxuUmVzb3VyY2UucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2NoYXR0ZXIucmVxdWVzdCh7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgYm9keTogZGF0YVxyXG4gIH0pLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZSByZXNvdXJjZSBjb250ZW50XHJcbiAqXHJcbiAqIEBtZXRob2QgQ2hhdHRlcn5SZXNvdXJjZSNyZXRyaWV2ZVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxDaGF0dGVyflJlcXVlc3RSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge0NoYXR0ZXJ+UmVxdWVzdH1cclxuICovXHJcblJlc291cmNlLnByb3RvdHlwZS5yZXRyaWV2ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgcmV0dXJuIHRoaXMudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBzcGVjaWZpZWQgcmVzb3VyY2VcclxuICpcclxuICogQG1ldGhvZCBDaGF0dGVyflJlc291cmNlI3VwZGF0ZVxyXG4gKiBAcGFyYW0ge09iZWpjdH0gZGF0YSAtIERhdGEgdG8gdXBkYXRlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPENoYXR0ZXJ+UmVxdWVzdFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7Q2hhdHRlcn5SZXF1ZXN0fVxyXG4gKi9cclxuUmVzb3VyY2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2NoYXR0ZXIucmVxdWVzdCh7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIHVybDogdGhpcy5fdXJsLFxyXG4gICAgYm9keTogZGF0YVxyXG4gIH0pLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTeW5vbnltIG9mIFJlc291cmNlI2RlbGV0ZSgpXHJcbiAqXHJcbiAqIEBtZXRob2QgQ2hhdHRlcn5SZXNvdXJjZSNkZWxcclxuICogQHBhcmFtIHtDYWxsYmFjay48Q2hhdHRlcn5SZXF1ZXN0UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtDaGF0dGVyflJlcXVlc3R9XHJcbiAqL1xyXG4vKipcclxuICogRGVsZXRlIHNwZWNpZmllZCByZXNvdXJjZVxyXG4gKlxyXG4gKiBAbWV0aG9kIENoYXR0ZXJ+UmVzb3VyY2UjZGVsZXRlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPENoYXR0ZXJ+UmVxdWVzdFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7Q2hhdHRlcn5SZXF1ZXN0fVxyXG4gKi9cclxuUmVzb3VyY2UucHJvdG90eXBlLmRlbCA9XHJcblJlc291cmNlLnByb3RvdHlwZVtcImRlbGV0ZVwiXSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2NoYXR0ZXIucmVxdWVzdCh7XHJcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgdXJsOiB0aGlzLl91cmxcclxuICB9KS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG5cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qXHJcbiAqIFJlZ2lzdGVyIGhvb2sgaW4gY29ubmVjdGlvbiBpbnN0YW50aWF0aW9uIGZvciBkeW5hbWljYWxseSBhZGRpbmcgdGhpcyBBUEkgbW9kdWxlIGZlYXR1cmVzXHJcbiAqL1xyXG5qc2ZvcmNlLm9uKCdjb25uZWN0aW9uOm5ldycsIGZ1bmN0aW9uKGNvbm4pIHtcclxuICBjb25uLmNoYXR0ZXIgPSBuZXcgQ2hhdHRlcihjb25uKTtcclxufSk7XHJcbiJdfQ==
