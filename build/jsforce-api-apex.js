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
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
/**
 * Call Apex REST service in DELETE request
 *
 * @method Apex#delete
 *
 * @param {String} path - URL path to Apex REST service
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL2FwZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXHJcbiAqIEBmaWxlIE1hbmFnZXMgU2FsZXNmb3JjZSBBcGV4IFJFU1QgZW5kcG9pbnQgY2FsbHNcclxuICogQGF1dGhvciBTaGluaWNoaSBUb21pdGEgPHNoaW5pY2hpLnRvbWl0YUBnbWFpbC5jb20+XHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGpzZm9yY2UgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCcuL2NvcmUnKTtcclxuXHJcbi8qKlxyXG4gKiBBUEkgY2xhc3MgZm9yIEFwZXggUkVTVCBlbmRwb2ludCBjYWxsXHJcbiAqXHJcbiAqIEBjbGFzc1xyXG4gKiBAcGFyYW0ge0Nvbm5lY3Rpb259IGNvbm4gQ29ubmVjdGlvblxyXG4gKi9cclxudmFyIEFwZXggPSBmdW5jdGlvbihjb25uKSB7XHJcbiAgdGhpcy5fY29ubiA9IGNvbm47XHJcbn07XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICovXHJcbkFwZXgucHJvdG90eXBlLl9iYXNlVXJsID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4uaW5zdGFuY2VVcmwgKyBcIi9zZXJ2aWNlcy9hcGV4cmVzdFwiO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5BcGV4LnByb3RvdHlwZS5fY3JlYXRlUmVxdWVzdFBhcmFtcyA9IGZ1bmN0aW9uKG1ldGhvZCwgcGF0aCwgYm9keSwgb3B0aW9ucykge1xyXG4gIHZhciBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgIHVybDogdGhpcy5fYmFzZVVybCgpICsgcGF0aFxyXG4gIH0sXHJcbiAgX2hlYWRlcnMgPSB7fTtcclxuICBpZihvcHRpb25zICYmICdvYmplY3QnID09PSB0eXBlb2Ygb3B0aW9uc1snaGVhZGVycyddKXtcclxuICAgIF9oZWFkZXJzID0gb3B0aW9uc1snaGVhZGVycyddO1xyXG4gIH1cclxuICBpZiAoIS9eKEdFVHxERUxFVEUpJC9pLnRlc3QobWV0aG9kKSkge1xyXG4gICAgX2hlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcclxuICB9XHJcbiAgcGFyYW1zLmhlYWRlcnMgPSBfaGVhZGVycztcclxuICBpZiAoYm9keSkge1xyXG4gICAgcGFyYW1zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcclxuICB9XHJcbiAgcmV0dXJuIHBhcmFtcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDYWxsIEFwZXggUkVTVCBzZXJ2aWNlIGluIEdFVCByZXF1ZXN0XHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVVJMIHBhdGggdG8gQXBleCBSRVNUIHNlcnZpY2VcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBIb2xkcyBoZWFkZXJzIGFuZCBvdGhlciBtZXRhIGRhdGEgZm9yIHRoZSByZXF1ZXN0LlxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPE9iamVjdD59XHJcbiAqL1xyXG5BcGV4LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihwYXRoLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgY2FsbGJhY2sgPSBvcHRpb25zO1xyXG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdCh0aGlzLl9jcmVhdGVSZXF1ZXN0UGFyYW1zKCdHRVQnLCBwYXRoLCB1bmRlZmluZWQsIG9wdGlvbnMpKS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2FsbCBBcGV4IFJFU1Qgc2VydmljZSBpbiBQT1NUIHJlcXVlc3RcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBVUkwgcGF0aCB0byBBcGV4IFJFU1Qgc2VydmljZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gW2JvZHldIC0gUmVxdWVzdCBib2R5XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gSG9sZHMgaGVhZGVycyBhbmQgb3RoZXIgbWV0YSBkYXRhIGZvciB0aGUgcmVxdWVzdC5cclxuICogQHBhcmFtIHtDYWxsYmFjay48T2JqZWN0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxyXG4gKi9cclxuQXBleC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uKHBhdGgsIGJvZHksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBib2R5ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IGJvZHk7XHJcbiAgICBib2R5ID0gdW5kZWZpbmVkO1xyXG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiAgICBvcHRpb25zID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICB2YXIgcGFyYW1zID0gdGhpcy5fY3JlYXRlUmVxdWVzdFBhcmFtcygnUE9TVCcsIHBhdGgsIGJvZHksIG9wdGlvbnMpO1xyXG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3QocGFyYW1zKS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2FsbCBBcGV4IFJFU1Qgc2VydmljZSBpbiBQVVQgcmVxdWVzdFxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIFVSTCBwYXRoIHRvIEFwZXggUkVTVCBzZXJ2aWNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYm9keV0gLSBSZXF1ZXN0IGJvZHlcclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEhvbGRzIGhlYWRlcnMgYW5kIG90aGVyIG1ldGEgZGF0YSBmb3IgdGhlIHJlcXVlc3QuXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPE9iamVjdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48T2JqZWN0Pn1cclxuICovXHJcbkFwZXgucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uKHBhdGgsIGJvZHksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBib2R5ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IGJvZHk7XHJcbiAgICBib2R5ID0gdW5kZWZpbmVkO1xyXG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiAgICBvcHRpb25zID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICB2YXIgcGFyYW1zID0gdGhpcy5fY3JlYXRlUmVxdWVzdFBhcmFtcygnUFVUJywgcGF0aCwgYm9keSwgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdChwYXJhbXMpLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDYWxsIEFwZXggUkVTVCBzZXJ2aWNlIGluIFBBVENIIHJlcXVlc3RcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBVUkwgcGF0aCB0byBBcGV4IFJFU1Qgc2VydmljZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gW2JvZHldIC0gUmVxdWVzdCBib2R5XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBIb2xkcyBoZWFkZXJzIGFuZCBvdGhlciBtZXRhIGRhdGEgZm9yIHRoZSByZXF1ZXN0LlxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPE9iamVjdD59XHJcbiAqL1xyXG5BcGV4LnByb3RvdHlwZS5wYXRjaCA9IGZ1bmN0aW9uKHBhdGgsIGJvZHksIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgaWYgKHR5cGVvZiBib2R5ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IGJvZHk7XHJcbiAgICBib2R5ID0gdW5kZWZpbmVkO1xyXG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XHJcbiAgICBvcHRpb25zID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICB2YXIgcGFyYW1zID0gdGhpcy5fY3JlYXRlUmVxdWVzdFBhcmFtcygnUEFUQ0gnLCBwYXRoLCBib2R5LCBvcHRpb25zKTtcclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHBhcmFtcykudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN5bm9ueW0gb2YgQXBleCNkZWxldGUoKVxyXG4gKlxyXG4gKiBAbWV0aG9kIEFwZXgjZGVsXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVVJMIHBhdGggdG8gQXBleCBSRVNUIHNlcnZpY2VcclxuICogQHBhcmFtIHtDYWxsYmFjay48T2JqZWN0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxPYmplY3Q+fVxyXG4gKi9cclxuLyoqXHJcbiAqIENhbGwgQXBleCBSRVNUIHNlcnZpY2UgaW4gREVMRVRFIHJlcXVlc3RcclxuICpcclxuICogQG1ldGhvZCBBcGV4I2RlbGV0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIFVSTCBwYXRoIHRvIEFwZXggUkVTVCBzZXJ2aWNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBIb2xkcyBoZWFkZXJzIGFuZCBvdGhlciBtZXRhIGRhdGEgZm9yIHRoZSByZXF1ZXN0LlxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxPYmplY3Q+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPE9iamVjdD59XHJcbiAqL1xyXG5BcGV4LnByb3RvdHlwZS5kZWwgPVxyXG4gIEFwZXgucHJvdG90eXBlW1wiZGVsZXRlXCJdID0gZnVuY3Rpb24ocGF0aCwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcclxuICAgIG9wdGlvbnMgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3QodGhpcy5fY3JlYXRlUmVxdWVzdFBhcmFtcygnREVMRVRFJywgcGF0aCwgdW5kZWZpbmVkLCBvcHRpb25zKSkudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKlxyXG4gKiBSZWdpc3RlciBob29rIGluIGNvbm5lY3Rpb24gaW5zdGFudGlhdGlvbiBmb3IgZHluYW1pY2FsbHkgYWRkaW5nIHRoaXMgQVBJIG1vZHVsZSBmZWF0dXJlc1xyXG4gKi9cclxuanNmb3JjZS5vbignY29ubmVjdGlvbjpuZXcnLCBmdW5jdGlvbihjb25uKSB7XHJcbiAgY29ubi5hcGV4ID0gbmV3IEFwZXgoY29ubik7XHJcbn0pO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBleDtcclxuIl19
