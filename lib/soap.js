/**
 * @file Manages method call to SOAP endpoint
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var inherits = require('inherits'),
    _ = require('lodash/core'),
    xml2js = require('xml2js'),
    HttpApi = require('./http-api');


/**
 * Class for SOAP endpoint of Salesforce
 *
 * @protected
 * @class
 * @constructor
 * @param {Connection} conn - Connection instance
 * @param {Object} options - SOAP endpoint setting options
 * @param {String} options.endpointUrl - SOAP endpoint URL
 * @param {String} [options.xmlns] - XML namespace for method call (default is "urn:partner.soap.sforce.com")
 */
var SOAP = module.exports = function(conn, options) {
  SOAP.super_.apply(this, arguments);
  this._endpointUrl = options.endpointUrl;
  this._xmlns = options.xmlns || 'urn:partner.soap.sforce.com';
};

inherits(SOAP, HttpApi);

/**
 * Invoke SOAP call using method and arguments
 *
 * @param {String} method - Method name
 * @param {Object} args - Arguments for the method call
 * @param {Object} [schema] - Schema definition of response message
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
SOAP.prototype.invoke = function(method, args, schema, callback) {
  if (typeof schema === 'function') {
    callback = schema;
    schema = null;
  }
  var message = {};
  message[method] = args;
  return this.request({
    method: 'POST',
    url: this._endpointUrl,
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': '""'
    },
    message: message
  }).then(function(res) {
    return schema ? convertType(res, schema) : res;
  }).thenCall(callback);
};

/* @private */
function convertType(value, schema) {
  if (_.isArray(value)) {
    return value.map(function(v) {
      return convertType(v, schema && schema[0])
    });
  } else if (_.isObject(value)) {
    if (value.$ && value.$['xsi:nil'] === 'true') {
      return null;
    } else if (_.isArray(schema)) {
      return [ convertType(value, schema[0]) ];
    } else {
      var o = {};
      for (var key in value) {
        o[key] = convertType(value[key], schema && schema[key]);
      }
      return o;
    }
  } else {
    if (_.isArray(schema)) {
      return [ convertType(value, schema[0]) ];
    } else if (_.isObject(schema)) {
      return {};
    } else {
      switch(schema) {
        case 'string':
          return String(value);
        case 'number':
          return Number(value);
        case 'boolean':
          return value === 'true';
        default:
          return value;
      }
    }
  }
}

/** @override **/
SOAP.prototype.beforeSend = function(request) {
  request.body = this._createEnvelope(request.message);
};

/** @override **/
SOAP.prototype.isSessionExpired = function(response) {
  return response.statusCode === 500 &&
    /<faultcode>[a-zA-Z]+:INVALID_SESSION_ID<\/faultcode>/.test(response.body);
};

/** @override **/
SOAP.prototype.parseError = function(body) {
  var error = lookupValue(body, [ /:Envelope$/, /:Body$/, /:Fault$/ ]);
  return {
    errorCode: error.faultcode,
    message: error.faultstring
  };
};

/** @override **/
SOAP.prototype.getResponseBody = function(response) {
  var body = SOAP.super_.prototype.getResponseBody.call(this, response);
  return lookupValue(body, [ /:Envelope$/, /:Body$/, /.+/ ]);
};

/**
 * @private
 */
function lookupValue(obj, propRegExps) {
  var regexp = propRegExps.shift();
  if (!regexp) {
    return obj;
  }
  else {
    for (var prop in obj) {
      if (regexp.test(prop)) {
        return lookupValue(obj[prop], propRegExps);
      }
    }
    return null;
  }
}

/**
 * @private
 */
function toXML(name, value) {
  if (_.isObject(name)) {
    value = name;
    name = null;
  }
  if (_.isArray(value)) {
    return _.map(value, function(v) { return toXML(name, v); }).join('');
  } else {
    var attrs = [];
    var elems = [];
    if (_.isObject(value)) {
      for (var k in value) {
        var v = value[k];
        if (k[0] === '@') {
          k = k.substring(1);
          attrs.push(k + '="' + v + '"');
        } else {
          elems.push(toXML(k, v));
        }
      }
      value = elems.join('');
    } else {
      value = String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
    var startTag = name ? '<' + name + (attrs.length > 0 ? ' ' + attrs.join(' ') : '') + '>' : '';
    var endTag = name ? '</' + name + '>' : '';
    return  startTag + value + endTag;
  }
}

/**
 * @private
 */
SOAP.prototype._createEnvelope = function(message) {
  var header = {};
  var conn = this._conn;
  if (conn.accessToken) {
    header.SessionHeader = { sessionId: this._conn.accessToken };
  }
  if (conn.callOptions) {
    header.CallOptions = conn.callOptions;
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"',
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"',
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
    '<soapenv:Header xmlns="' + this._xmlns + '">',
    toXML(header),
    '</soapenv:Header>',
    '<soapenv:Body xmlns="' + this._xmlns + '">',
    toXML(message),
    '</soapenv:Body>',
    '</soapenv:Envelope>'
  ].join('');
};
