/*global process, Sfdc */

'use strict';

var inherits = require('inherits'),
    Promise = require('./promise');

/* */

var request = require('request'),
    canvas = require('./browser/canvas'),
    jsonp = require('./browser/jsonp');

// set options if defaults setting is available in request, which is not available in xhr module.
if (request.defaults) {
  var defaults = {
    followAllRedirects: true
  };
  if (process.env.HTTP_PROXY) {
    defaults.proxy = process.env.HTTP_PROXY;
  }
  if (parseInt(process.env.HTTP_TIMEOUT)) {
    defaults.timeout = parseInt(process.env.HTTP_TIMEOUT);
  }
  request = request.defaults(defaults);
}

var baseUrl;
if (typeof window === 'undefined') {
  baseUrl = process.env.LOCATION_BASE_URL || "";
} else {
  var apiHost = normalizeApiHost(window.location.host);
  baseUrl = apiHost ? "https://" + apiHost : "";
}

/**
 * Add stream() method to promise (and following promise chain), to access original request stream.
 * @private
 */
function streamify(promise, factory) {
  var _then = promise.then;
  promise.then = function() {
    factory();
    var newPromise = _then.apply(promise, arguments);
    return streamify(newPromise, factory);
  };
  promise.stream = factory;
  return promise;
}

/**
 * Normarize Salesforce API host name
 * @private
 */
function normalizeApiHost(apiHost) {
  var m = /(\w+)\.(visual\.force|salesforce)\.com$/.exec(apiHost);
  if (m) {
    apiHost = m[1] + ".salesforce.com";
  }
  return apiHost;
}

/**
 * Class for HTTP request transport
 *
 * @class
 * @protected
 */
var Transport = module.exports = function() {};

/**
 * Make HTTP request, returns promise instead of stream
 *
 * @param {Object} params - HTTP request
 * @param {Callback.<Object>} [callback] - Calback Function
 * @returns {Promise.<Object>}
 */
Transport.prototype.httpRequest = function(params, callback) {
  var deferred = Promise.defer();
  var req;
  var httpRequest = this._getHttpRequestModule();
  var createRequest = function() {
    if (!req) {
      req = httpRequest(params, function(err, response) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(response);
        }
      });
    }
    return req;
  };
  return streamify(deferred.promise, createRequest).thenCall(callback);
};

/** @protected **/
Transport.prototype._getHttpRequestModule = function() {
  return request;
};


/**
 * Class for JSONP request transport
 * @class Transport~JsonpTransport
 * @protected
 * @extends Transport
 * @param {String} jsonpParam - Callback parameter name for JSONP invokation.
 */
var JsonpTransport = Transport.JsonpTransport = function(jsonpParam) {
  this._jsonpParam = jsonpParam;
};

inherits(JsonpTransport, Transport);

/** @protected **/
JsonpTransport.prototype._getHttpRequestModule = function() {
  return jsonp.createRequest(this._jsonpParam);
};

JsonpTransport.supported = jsonp.supported;


/**
 * Class for Sfdc Canvas request transport
 * @class Transport~CanvasTransport
 * @protected
 * @extends Transport
 * @param {Object} signedRequest - Parsed signed request object
 */
var CanvasTransport = Transport.CanvasTransport = function(signedRequest) {
  this._signedRequest = signedRequest;
};

inherits(CanvasTransport, Transport);

/** @protected **/
CanvasTransport.prototype._getHttpRequestModule = function() {
  return canvas.createRequest(this._signedRequest);
};

CanvasTransport.supported = canvas.supported;


/**
 * Class for HTTP request transport using AJAX proxy service
 *
 * @class Transport~ProxyTransport
 * @protected
 * @extends Transport
 * @param {String} proxyUrl - AJAX Proxy server URL
 */
var ProxyTransport = Transport.ProxyTransport = function(proxyUrl) {
  this._proxyUrl = proxyUrl;
};

inherits(ProxyTransport, Transport);

/**
 * Make HTTP request via AJAX proxy
 *
 * @method Transport~ProxyTransport#httpRequest
 * @param {Object} params - HTTP request
 * @param {Callback.<Object>} [callback] - Calback Function
 * @returns {Promise.<Object>}
 */
ProxyTransport.prototype.httpRequest = function(params, callback) {
  var url = params.url;
  if (url.indexOf("/") === 0) {
    url = baseUrl + url;
  }
  var proxyParams = {
    method: params.method,
    url: this._proxyUrl + '?' + Date.now() + "." + ("" + Math.random()).substring(2),
    headers: {
      'salesforceproxy-endpoint': url
    }
  };
  if (params.body || params.body === "") {
    proxyParams.body = params.body;
  }
  if (params.headers) {
    for (var name in params.headers) {
      proxyParams.headers[name] = params.headers[name];
    }
  }
  return ProxyTransport.super_.prototype.httpRequest.call(this, proxyParams, callback);
};


/**
 * Class for HTTP request transport using a proxy server
 *
 * @class Transport~HttpProxyTransport
 * @protected
 * @extends Transport
 * @param {String} httpProxy - URL of the HTTP proxy server
 */
var HttpProxyTransport = Transport.HttpProxyTransport = function(httpProxy) {
  this._httpProxy = httpProxy;
};

inherits(HttpProxyTransport, Transport);

/**
 * Make HTTP request via proxy server
 *
 * @method Transport~HttpProxyTransport#httpRequest
 * @param {Object} params - HTTP request
 * @param {Callback.<Object>} [callback] - Callback Function
 * @returns {Promise.<Object>}
 */
HttpProxyTransport.prototype.httpRequest = function(params, callback) {
  var url = params.url;
  if (url.indexOf("/") === 0) {
    url = baseUrl + url;
  }
  var proxyParams = {
    method: params.method,
    url: params.url,
    proxy: this._httpProxy,
    headers: {}
  };
  if (params.body || params.body === "") {
    proxyParams.body = params.body;
  }
  if (params.headers) {
    for (var name in params.headers) {
      proxyParams.headers[name] = params.headers[name];
    }
  }
  return HttpProxyTransport.super_.prototype.httpRequest.call(this, proxyParams, callback);
};
