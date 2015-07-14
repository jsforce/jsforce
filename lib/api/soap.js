/**
 * @file Salesforce SOAP API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var SOAP = require('../soap');

/**
 * API class for Partner SOAP call
 *
 * @class
 * @param {Connection} conn - Connection
 */
var SoapApi = module.exports = function(conn) {
  this._conn = conn;
};


/**
 * Call SOAP Api (Partner) endpoint
 *
 * @private
 */
SoapApi.prototype._invoke = function(method, message, callback) {
  var soapEndpoint = new SOAP(this._conn, {
    xmlns: "urn:partner.soap.sforce.com",
    endpointUrl: this._conn.instanceUrl + "/services/Soap/u/" + this._conn.version
  });
  return soapEndpoint.invoke(method, message).then(function(res) {
    return res.result;
  }).thenCall(callback);
};


SoapApi.prototype.getServerTimestamp = function(callback) {
  return this._invoke("getServerTimestamp", {}, callback);
};

SoapApi.prototype.convertLead = function(leadConverts, callback) {
  return this._invoke("convertLead", { leadConverts: leadConverts }, callback);
};

SoapApi.prototype.merge = function(mergeRequests, callback) {
  return this._invoke("convertLead", { mergeRequests: mergeRequests }, callback);
};


module.exports = SoapApi;
