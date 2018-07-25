/**
 * @file Manages Salesforce OAuth2 operations
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var querystring = require('querystring'),
    _ = require('lodash/core'),
    Transport = require('./transport');

var defaults = {
  loginUrl : "https://login.salesforce.com"
};

/**
 * OAuth2 class
 *
 * @class
 * @constructor
 * @param {Object} options - OAuth2 config options
 * @param {String} [options.loginUrl] - Salesforce login server URL
 * @param {String} [options.authzServiceUrl] - OAuth2 authorization service URL. If not specified, it generates from default by adding to login server URL.
 * @param {String} [options.tokenServiceUrl] - OAuth2 token service URL. If not specified it generates from default by adding to login server URL.
 * @param {String} options.clientId - OAuth2 client ID.
 * @param {String} [options.clientSecret] - OAuth2 client secret (This is optional for public client).
 * @param {String} options.redirectUri - URI to be callbacked from Salesforce OAuth2 authorization service.
 */
var OAuth2 = module.exports = function(options) {
  if (options.authzServiceUrl && options.tokenServiceUrl) {
    this.loginUrl = options.authzServiceUrl.split('/').slice(0, 3).join('/');
    this.authzServiceUrl = options.authzServiceUrl;
    this.tokenServiceUrl = options.tokenServiceUrl;
    this.revokeServiceUrl = options.revokeServiceUrl;
  } else {
    this.loginUrl = options.loginUrl || defaults.loginUrl;
    this.authzServiceUrl = this.loginUrl + "/services/oauth2/authorize";
    this.tokenServiceUrl = this.loginUrl + "/services/oauth2/token";
    this.revokeServiceUrl = this.loginUrl + "/services/oauth2/revoke";
  }
  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.redirectUri = options.redirectUri;
  if (options.proxyUrl) {
    this._transport = new Transport.ProxyTransport(options.proxyUrl);
  } else if (options.httpProxy) {
    this._transport = new Transport.HttpProxyTransport(options.httpProxy);
  } else {
    this._transport = new Transport();
  }
};



/**
 *
 */
_.extend(OAuth2.prototype, /** @lends OAuth2.prototype **/ {

  /**
   * Get Salesforce OAuth2 authorization page URL to redirect user agent.
   *
   * @param {Object} params - Parameters
   * @param {String} [params.scope] - Scope values in space-separated string
   * @param {String} [params.state] - State parameter
   * @param {String} [params.code_challenge] - Code challenge value (RFC 7636 - Proof Key of Code Exchange)
   * @returns {String} Authorization page URL
   */
  getAuthorizationUrl : function(params) {
    params = _.extend({
      response_type : "code",
      client_id : this.clientId,
      redirect_uri : this.redirectUri
    }, params || {});
    return this.authzServiceUrl +
      (this.authzServiceUrl.indexOf('?') >= 0 ? "&" : "?") +
      querystring.stringify(params);
  },

  /**
   * @typedef TokenResponse
   * @type {Object}
   * @property {String} access_token
   * @property {String} refresh_token
   */

  /**
   * OAuth2 Refresh Token Flow
   *
   * @param {String} refreshToken - Refresh token
   * @param {Callback.<TokenResponse>} [callback] - Callback function
   * @returns {Promise.<TokenResponse>}
   */
  refreshToken : function(refreshToken, callback) {
    var params = {
      grant_type : "refresh_token",
      refresh_token : refreshToken,
      client_id : this.clientId
    };
    if (this.clientSecret) {
      params.client_secret = this.clientSecret;
    }
    return this._postParams(params, callback);
  },

  /**
   * OAuth2 Web Server Authentication Flow (Authorization Code)
   * Access Token Request
   *
   * @param {String} code - Authorization code
   * @param {Object} [params] - Optional parameters to send in token retrieval
   * @param {String} [params.code_verifier] - Code verifier value (RFC 7636 - Proof Key of Code Exchange)
   * @param {Callback.<TokenResponse>} [callback] - Callback function
   * @returns {Promise.<TokenResponse>}
   */
  requestToken : function(code, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    params = _.extend({
      grant_type : "authorization_code",
      code : code,
      client_id : this.clientId,
      redirect_uri : this.redirectUri
    }, params || {});
    if (this.clientSecret) {
      params.client_secret = this.clientSecret;
    }
    return this._postParams(params, callback);
  },

  /**
   * OAuth2 Username-Password Flow (Resource Owner Password Credentials)
   *
   * @param {String} username - Salesforce username
   * @param {String} password - Salesforce password
   * @param {Callback.<TokenResponse>} [callback] - Callback function
   * @returns {Promise.<TokenResponse>}
   */
  authenticate : function(username, password, callback) {
    return this._postParams({
      grant_type : "password",
      username : username,
      password : password,
      client_id : this.clientId,
      client_secret : this.clientSecret,
      redirect_uri : this.redirectUri
    }, callback);
  },

  /**
   * OAuth2 Revoke Session or API Token
   *
   * @param {String} token - Access or Refresh token to revoke. Passing in the Access token revokes the session. Passing in the Refresh token revokes API Access.
   * @param {Callback.<undefined>} [callback] - Callback function
   * @returns {Promise.<undefined>}
   */
  revokeToken : function(token, callback) {
    return this._transport.httpRequest({
      method : 'POST',
      url : this.revokeServiceUrl,
      body: querystring.stringify({ token: token }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function(response) {
      if (response.statusCode >= 400) {
        var res = querystring.parse(response.body);
        if (!res || !res.error) {
          res = { error: "ERROR_HTTP_"+response.statusCode, error_description: response.body };
        }
        var err = new Error(res.error_description);
        err.name = res.error;
        throw err;
      }
    }).thenCall(callback);
  },

  /**
   * @private
   */
  _postParams : function(params, callback) {
    return this._transport.httpRequest({
      method : 'POST',
      url : this.tokenServiceUrl,
      body : querystring.stringify(params),
      headers : {
        "content-type" : "application/x-www-form-urlencoded"
      }
    }).then(function(response) {
      var res;
      try {
        res = JSON.parse(response.body);
      } catch(e) {}
      if (response.statusCode >= 400) {
        res = res || { error: "ERROR_HTTP_"+response.statusCode, error_description: response.body };
        var err = new Error(res.error_description);
        err.name = res.error;
        throw err;
      }
      return res;
    }).thenCall(callback);
  }

});
