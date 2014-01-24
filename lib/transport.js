/*global process */
var util = require('util'),
    request = require('./request');

/**
 *
 */
var Transport = module.exports = function() {};

Transport.prototype.httpRequest = function(params, callback) {
  return request(params, callback);
};

/**
 *
 */
var ProxyTransport = Transport.ProxyTransport = function(proxyUrl) {
  this._proxyUrl = proxyUrl;
};

util.inherits(ProxyTransport, Transport);

/**
 *
 */
ProxyTransport.prototype.httpRequest = function(params, callback) {
  var proxyParams = {
    method: params.method,
    url: this._proxyUrl + '?' + Date.now() + "." + ("" + Math.random()).substring(2),
    headers: {
      'salesforceproxy-endpoint': params.url,
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
