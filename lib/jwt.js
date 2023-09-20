/**
 * @file Manages Salesforce OAuth2 JWT flow specific operations
 * @author Rafael Galani <galani.rafael@gmail.com>
 */

'use strict';

var jwt = require('jsonwebtoken'),
    _ = require('lodash/core');

var defaults = {
  loginUrl : "https://login.salesforce.com"
};

/**
 * JWT class
 *
 * @class
 * @constructor
 * @param {Object} options -  config options
 * @param {String} options.clientId - OAuth2 client ID.
 * @param {String} options.username - Salesforce username - Username must be preauthorized when using the JWT flow.
 * @param {String} options.privateKey - X509 key, base64 encoded - Salesforce uploaded certificate (signing secret) must match this key.
 * @param {String} [options.loginUrl] - Salesforce login server URL.
 */
var JWT = module.exports = function(options) {
  this.loginUrl = options.loginUrl || defaults.loginUrl;
  this.clientId = options.clientId;
  this.privateKey = options.privateKey;
  this.username = options.username;
};

/**
 *
 */
_.extend(JWT.prototype, /** @lends JWT.prototype **/ {

  /**
   * Get JWT representation as token.
   *
   * @returns {String} JWT String
   */
  getToken : function() {
    const privateKey = new Buffer.from(this.privateKey, 'base64').toString('ascii');
    
    const claims = {
      iss: this.clientId, 
      sub: this.username, 
      aud: this.loginUrl, 
      exp: Math.floor(Date.now()/1000) + (3*60)
    };
    const token = jwt.sign(claims, privateKey, { algorithm: 'RS256'});
    return token;
  },

});
