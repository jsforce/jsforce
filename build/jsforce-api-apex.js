(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Apex = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @file Manages Salesforce Apex REST endpoint calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var jsforce = window.jsforce.require('./core');

/**
 * API class for Apex REST endpoint call
 *
 * @class
 * @param {Connection} conn Connection
 */
var Apex = function(conn) {
  this._conn = conn;
};

/**
 * @private
 */
Apex.prototype._baseUrl = function() {
  return this._conn.instanceUrl + "/services/apexrest";
};

/**
 * @private
 */
Apex.prototype._createRequestParams = function(method, path, body, options) {
  var params = {
    method: method,
    url: this._baseUrl() + path
  },
  _headers = {};
  if(options && 'object' === typeof options['headers']){
    _headers = options['headers'];
  }
  if (!/^(GET|DELETE)$/i.test(method)) {
    _headers["Content-Type"] = "application/json";
  }
  params.headers = _headers;
  if (body) {
    params.body = JSON.stringify(body);
  }
  return params;
};

/**
 * Call Apex REST service in GET request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} options - Holds headers and other meta data for the request.
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.get = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  return this._conn.request(this._createRequestParams('GET', path, undefined, options)).thenCall(callback);
};

/**
 * Call Apex REST service in POST request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [body] - Request body
 * @param {Object} options - Holds headers and other meta data for the request.
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.post = function(path, body, options, callback) {
  if (typeof body === 'function') {
    callback = body;
    body = undefined;
    options = undefined;
  }
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  var params = this._createRequestParams('POST', path, body, options);
  return this._conn.request(params).thenCall(callback);
};

/**
 * Call Apex REST service in PUT request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [body] - Request body
 * @param {Object} [options] - Holds headers and other meta data for the request.
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.put = function(path, body, options, callback) {
  if (typeof body === 'function') {
    callback = body;
    body = undefined;
    options = undefined;
  }
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  var params = this._createRequestParams('PUT', path, body, options);
  return this._conn.request(params).thenCall(callback);
};

/**
 * Call Apex REST service in PATCH request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [body] - Request body
 * @param {Object} [options] - Holds headers and other meta data for the request.
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.patch = function(path, body, options, callback) {
  if (typeof body === 'function') {
    callback = body;
    body = undefined;
    options = undefined;
  }
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  var params = this._createRequestParams('PATCH', path, body, options);
  return this._conn.request(params).thenCall(callback);
};

/**
 * Synonym of Apex#delete()
 *
 * @method Apex#del
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [body] - Request body
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
/**
 * Call Apex REST service in DELETE request
 *
 * @method Apex#delete
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [body] - Request body
 * @param {Object} [options] - Holds headers and other meta data for the request.
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.del =
  Apex.prototype["delete"] = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  return this._conn.request(this._createRequestParams('DELETE', path, undefined, options)).thenCall(callback);
};


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.apex = new Apex(conn);
});


module.exports = Apex;

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL2FwZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQGZpbGUgTWFuYWdlcyBTYWxlc2ZvcmNlIEFwZXggUkVTVCBlbmRwb2ludCBjYWxsc1xuICogQGF1dGhvciBTaGluaWNoaSBUb21pdGEgPHNoaW5pY2hpLnRvbWl0YUBnbWFpbC5jb20+XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIganNmb3JjZSA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vY29yZScpO1xuXG4vKipcbiAqIEFQSSBjbGFzcyBmb3IgQXBleCBSRVNUIGVuZHBvaW50IGNhbGxcbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7Q29ubmVjdGlvbn0gY29ubiBDb25uZWN0aW9uXG4gKi9cbnZhciBBcGV4ID0gZnVuY3Rpb24oY29ubikge1xuICB0aGlzLl9jb25uID0gY29ubjtcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuQXBleC5wcm90b3R5cGUuX2Jhc2VVcmwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2Nvbm4uaW5zdGFuY2VVcmwgKyBcIi9zZXJ2aWNlcy9hcGV4cmVzdFwiO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5BcGV4LnByb3RvdHlwZS5fY3JlYXRlUmVxdWVzdFBhcmFtcyA9IGZ1bmN0aW9uKG1ldGhvZCwgcGF0aCwgYm9keSwgb3B0aW9ucykge1xuICB2YXIgcGFyYW1zID0ge1xuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIHVybDogdGhpcy5fYmFzZVVybCgpICsgcGF0aFxuICB9LFxuICBfaGVhZGVycyA9IHt9O1xuICBpZihvcHRpb25zICYmICdvYmplY3QnID09PSB0eXBlb2Ygb3B0aW9uc1snaGVhZGVycyddKXtcbiAgICBfaGVhZGVycyA9IG9wdGlvbnNbJ2hlYWRlcnMnXTtcbiAgfVxuICBpZiAoIS9eKEdFVHxERUxFVEUpJC9pLnRlc3QobWV0aG9kKSkge1xuICAgIF9oZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG4gIH1cbiAgcGFyYW1zLmhlYWRlcnMgPSBfaGVhZGVycztcbiAgaWYgKGJvZHkpIHtcbiAgICBwYXJhbXMuYm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xuICB9XG4gIHJldHVybiBwYXJhbXM7XG59O1xuXG4vKipcbiAqIENhbGwgQXBleCBSRVNUIHNlcnZpY2UgaW4gR0VUIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIFVSTCBwYXRoIHRvIEFwZXggUkVTVCBzZXJ2aWNlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEhvbGRzIGhlYWRlcnMgYW5kIG90aGVyIG1ldGEgZGF0YSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxuICovXG5BcGV4LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHRoaXMuX2NyZWF0ZVJlcXVlc3RQYXJhbXMoJ0dFVCcsIHBhdGgsIHVuZGVmaW5lZCwgb3B0aW9ucykpLnRoZW5DYWxsKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogQ2FsbCBBcGV4IFJFU1Qgc2VydmljZSBpbiBQT1NUIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIFVSTCBwYXRoIHRvIEFwZXggUkVTVCBzZXJ2aWNlXG4gKiBAcGFyYW0ge09iamVjdH0gW2JvZHldIC0gUmVxdWVzdCBib2R5XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEhvbGRzIGhlYWRlcnMgYW5kIG90aGVyIG1ldGEgZGF0YSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxuICovXG5BcGV4LnByb3RvdHlwZS5wb3N0ID0gZnVuY3Rpb24ocGF0aCwgYm9keSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBib2R5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBib2R5O1xuICAgIGJvZHkgPSB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgfVxuICB2YXIgcGFyYW1zID0gdGhpcy5fY3JlYXRlUmVxdWVzdFBhcmFtcygnUE9TVCcsIHBhdGgsIGJvZHksIG9wdGlvbnMpO1xuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHBhcmFtcykudGhlbkNhbGwoY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBDYWxsIEFwZXggUkVTVCBzZXJ2aWNlIGluIFBVVCByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBVUkwgcGF0aCB0byBBcGV4IFJFU1Qgc2VydmljZVxuICogQHBhcmFtIHtPYmplY3R9IFtib2R5XSAtIFJlcXVlc3QgYm9keVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEhvbGRzIGhlYWRlcnMgYW5kIG90aGVyIG1ldGEgZGF0YSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxuICovXG5BcGV4LnByb3RvdHlwZS5wdXQgPSBmdW5jdGlvbihwYXRoLCBib2R5LCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGJvZHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayA9IGJvZHk7XG4gICAgYm9keSA9IHVuZGVmaW5lZDtcbiAgICBvcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG4gIHZhciBwYXJhbXMgPSB0aGlzLl9jcmVhdGVSZXF1ZXN0UGFyYW1zKCdQVVQnLCBwYXRoLCBib2R5LCBvcHRpb25zKTtcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdChwYXJhbXMpLnRoZW5DYWxsKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogQ2FsbCBBcGV4IFJFU1Qgc2VydmljZSBpbiBQQVRDSCByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBVUkwgcGF0aCB0byBBcGV4IFJFU1Qgc2VydmljZVxuICogQHBhcmFtIHtPYmplY3R9IFtib2R5XSAtIFJlcXVlc3QgYm9keVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEhvbGRzIGhlYWRlcnMgYW5kIG90aGVyIG1ldGEgZGF0YSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxuICovXG5BcGV4LnByb3RvdHlwZS5wYXRjaCA9IGZ1bmN0aW9uKHBhdGgsIGJvZHksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgYm9keSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gYm9keTtcbiAgICBib2R5ID0gdW5kZWZpbmVkO1xuICAgIG9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIHBhcmFtcyA9IHRoaXMuX2NyZWF0ZVJlcXVlc3RQYXJhbXMoJ1BBVENIJywgcGF0aCwgYm9keSwgb3B0aW9ucyk7XG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3QocGFyYW1zKS50aGVuQ2FsbChjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIFN5bm9ueW0gb2YgQXBleCNkZWxldGUoKVxuICpcbiAqIEBtZXRob2QgQXBleCNkZWxcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIFVSTCBwYXRoIHRvIEFwZXggUkVTVCBzZXJ2aWNlXG4gKiBAcGFyYW0ge09iamVjdH0gW2JvZHldIC0gUmVxdWVzdCBib2R5XG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxuICovXG4vKipcbiAqIENhbGwgQXBleCBSRVNUIHNlcnZpY2UgaW4gREVMRVRFIHJlcXVlc3RcbiAqXG4gKiBAbWV0aG9kIEFwZXgjZGVsZXRlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBVUkwgcGF0aCB0byBBcGV4IFJFU1Qgc2VydmljZVxuICogQHBhcmFtIHtPYmplY3R9IFtib2R5XSAtIFJlcXVlc3QgYm9keVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEhvbGRzIGhlYWRlcnMgYW5kIG90aGVyIG1ldGEgZGF0YSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxuICovXG5BcGV4LnByb3RvdHlwZS5kZWwgPVxuICBBcGV4LnByb3RvdHlwZVtcImRlbGV0ZVwiXSA9IGZ1bmN0aW9uKHBhdGgsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3QodGhpcy5fY3JlYXRlUmVxdWVzdFBhcmFtcygnREVMRVRFJywgcGF0aCwgdW5kZWZpbmVkLCBvcHRpb25zKSkudGhlbkNhbGwoY2FsbGJhY2spO1xufTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qXG4gKiBSZWdpc3RlciBob29rIGluIGNvbm5lY3Rpb24gaW5zdGFudGlhdGlvbiBmb3IgZHluYW1pY2FsbHkgYWRkaW5nIHRoaXMgQVBJIG1vZHVsZSBmZWF0dXJlc1xuICovXG5qc2ZvcmNlLm9uKCdjb25uZWN0aW9uOm5ldycsIGZ1bmN0aW9uKGNvbm4pIHtcbiAgY29ubi5hcGV4ID0gbmV3IEFwZXgoY29ubik7XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwZXg7XG4iXX0=
