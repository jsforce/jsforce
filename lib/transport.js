'use strict';

const inherits = require('inherits');
const Promise = require('./promise');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const canvas = require('./browser/canvas');
const jsonp = require('./browser/jsonp');

let baseUrl;
if (typeof window === 'undefined') {
  baseUrl = process.env.LOCATION_BASE_URL || "";
} else {
  const apiHost = normalizeApiHost(window.location.host);
  baseUrl = apiHost ? `https://${apiHost}` : "";
}

/**
 * Add stream() method to promise (and following promise chain), to access original request stream.
 * @private
 */
function streamify(promise, factory) {
  const _then = promise.then;
  promise.then = function() {
    factory();
    const newPromise = _then.apply(promise, arguments);
    return streamify(newPromise, factory);
  };
  promise.stream = factory;
  return promise;
}

/**
 * Normalize Salesforce API host name
 * @private
 */
function normalizeApiHost(apiHost) {
  const m = /(\w+)\.(visual\.force|salesforce)\.com$/.exec(apiHost);
  if (m) {
    apiHost = `${m[1]}.salesforce.com`;
  }
  return apiHost;
}

/**
 * Class for HTTP request transport
 *
 * @class
 * @protected
 */
const Transport = module.exports = function() {};

/**
 * Make HTTP request, returns promise instead of stream
 *
 * @param {Object} params - HTTP request
 * @param {Callback.<Object>} [callback] - Callback Function
 * @returns {Promise.<Object>}
 */
Transport.prototype.httpRequest = function(params, callback) {
  const deferred = Promise.defer();
  let url;
  try {
    url = new URL(params.url);
  } catch (e) {
    deferred.reject(new Error(`Invalid URL: ${params.url}`));
    return deferred.promise;
  }
  delete params.url;

  const timeout = parseInt(process.env.HTTP_TIMEOUT, 10) || 5000;
  const isHttps = url.protocol === 'https:';

  const options = {
    method: params.method,
    headers: params.headers || {},
    timeout: timeout,
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname + url.search,
  };

  if (params.body) {
    options.headers['Content-Length'] = Buffer.byteLength(params.body);
  }

  if (process.env.HTTP_PROXY) {
    const proxyUrl = new URL(process.env.HTTP_PROXY);
    options.hostname = proxyUrl.hostname;
    options.port = proxyUrl.port;
    options.path = url.href;
    options.headers.Host = url.hostname;
  }

  const createRequest = function() {
    const lib = isHttps ? https : http;
    const req = lib.request(options, (res) => {
      let body = '';

      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const contentType = res.headers['content-type'];
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (contentType && contentType.includes('application/json')) {
            try {
              deferred.resolve(JSON.parse(body));
            } catch (e) {
              deferred.reject(e);
            }
          } else {
            deferred.resolve(body);
          }
        } else {
          deferred.reject(new Error(`HTTP error! status: ${res.statusCode}, body: ${body}`));
        }
      });
    });

    req.on('error', (e) => {
      deferred.reject(e);
    });

    if (params.body) {
      req.write(params.body);
    }

    req.end();
    return req;
  };

  return streamify(deferred.promise, createRequest).thenCall(callback);
};

/**
 * Class for JSONP request transport
 * @class Transport~JsonpTransport
 * @protected
 * @extends Transport
 * @param {String} jsonpParam - Callback parameter name for JSONP invocation.
 */
const JsonpTransport = Transport.JsonpTransport = function(jsonpParam) {
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
const CanvasTransport = Transport.CanvasTransport = function(signedRequest) {
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
const ProxyTransport = Transport.ProxyTransport = function(proxyUrl) {
  this._proxyUrl = proxyUrl;
};

inherits(ProxyTransport, Transport);

/**
 * Make HTTP request via AJAX proxy
 *
 * @method Transport~ProxyTransport#httpRequest
 * @param {Object} params - HTTP request
 * @param {Callback.<Object>} [callback] - Callback Function
 * @returns {Promise.<Object>}
 */
ProxyTransport.prototype.httpRequest = function(params, callback) {
  let url = params.url;
  if (url.indexOf("/") === 0) {
    url = baseUrl + url;
  }
  const proxyParams = {
    method: params.method,
    url: `${this._proxyUrl}?${Date.now()}.${("" + Math.random()).substring(2)}`,
    headers: {
      'salesforceproxy-endpoint': url
    }
  };
  if (params.body || params.body === "") {
    proxyParams.body = params.body;
  }
  if (params.headers) {
    proxyParams.headers = { ...params.headers, ...proxyParams.headers };
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
const HttpProxyTransport = Transport.HttpProxyTransport = function(httpProxy) {
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
  let url = params.url;
  if (url.indexOf("/") === 0) {
    url = baseUrl + url;
  }
  const proxyParams = {
    method: params.method,
    url: params.url,
    proxy: this._httpProxy,
    headers: {}
  };
  if (params.body || params.body === "") {
    proxyParams.body = params.body;
  }
  if (params.headers) {
    proxyParams.headers = { ...params.headers, ...proxyParams.headers };
  }
  return HttpProxyTransport.super_.prototype.httpRequest.call(this, proxyParams, callback);
};
