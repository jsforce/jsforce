/**
 * @file Manages Salesforce Apex REST endpoint calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var jsforce = require('../core');

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
Apex.prototype._createRequestParams = function(method, path, settings) {
  var params = {
    method: method,
    url: this._baseUrl() + path
  };

  var _headers = {};
  if(settings && typeof(settings['headers']) === 'object'){
    _headers = settings['headers'];
  }
  if (!/^(GET|DELETE)$/i.test(method)) {
    _headers["Content-Type"] = "application/json";
  }
  params.headers = _headers;

  if (settings && typeof(settings['body']) === 'object') {
    params.body = JSON.stringify(settings['body']);
  }

  /*
   *  for backword compatibility.
   */
  if(typeof(settings) === 'object' && !settings['body'] && !settings['headers']){
    params.body = JSON.stringify(settings);
  }

  return params;
};

/**
 * Call Apex REST service in GET request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [settings] - A set of key/value pairs that configure the Ajax request. 
 *                              `settings.body` holds body for the request, `settings.headers` holds the headers. 
 *                              If body and headers key is not present, whole setting object will be considered as body.(For backword compatibility) 
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.get = function(path, settings, callback) {
  if (typeof settings === 'function') {
    callback = settings;
    settings = undefined;
  }
  return this._conn.request(this._createRequestParams('GET', path, settings)).thenCall(callback);
};

/**
 * Call Apex REST service in POST request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [settings] - A set of key/value pairs that configure the Ajax request. 
 *                              `settings.body` holds body for the request, `settings.headers` holds the headers. 
 *                              If body and headers key is not present, whole setting object will be considered as body.(For backword compatibility) 
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.post = function(path, settings, callback) {
  if (typeof settings === 'function') {
    callback = settings;
    settings = undefined;
  }
  var params = this._createRequestParams('POST', path, settings);
  return this._conn.request(params).thenCall(callback);
};

/**
 * Call Apex REST service in PUT request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [settings] - A set of key/value pairs that configure the Ajax request. 
 *                              `settings.body` holds body for the request, `settings.headers` holds the headers. 
 *                              If body and headers key is not present, whole setting object will be considered as body.(For backword compatibility) 
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.put = function(path, settings, callback) {
  if (typeof settings === 'function') {
    callback = settings;
    settings = undefined;
  }
  var params = this._createRequestParams('PUT', path, settings);
  return this._conn.request(params).thenCall(callback);
};

/**
 * Call Apex REST service in PATCH request
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [settings] - A set of key/value pairs that configure the Ajax request. 
 *                              `settings.body` holds body for the request, `settings.headers` holds the headers. 
 *                              If body and headers key is not present, whole setting object will be considered as body.(For backword compatibility) 
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.patch = function(path, settings, callback) {
  if (typeof settings === 'function') {
    callback = settings;
    settings = undefined;
  }
  var params = this._createRequestParams('PATCH', path, settings);
  return this._conn.request(params).thenCall(callback);
};

/**
 * Synonym of Apex#delete()
 *
 * @method Apex#del
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [settings] - A set of key/value pairs that configure the Ajax request. 
 *                              `settings.body` holds body for the request, `settings.headers` holds the headers. 
 *                              If body and headers key is not present, whole setting object will be considered as body.(For backword compatibility) 
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
/**
 * Call Apex REST service in DELETE request
 *
 * @method Apex#delete
 *
 * @param {String} path - URL path to Apex REST service
 * @param {Object} [settings] - A set of key/value pairs that configure the Ajax request. 
 *                              `settings.body` holds body for the request, `settings.headers` holds the headers. 
 *                              If body and headers key is not present, whole setting object will be considered as body.(For backword compatibility) 
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Apex.prototype.del =
  Apex.prototype["delete"] = function(path, settings, callback) {
  if (typeof settings === 'function') {
    callback = settings;
    settings = undefined;
  }
  return this._conn.request(this._createRequestParams('DELETE', path, settings)).thenCall(callback);
};


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.apex = new Apex(conn);
});


module.exports = Apex;
