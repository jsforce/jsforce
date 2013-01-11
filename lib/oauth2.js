var querystring = require('querystring')
  , request = require('request')
  , _ = require('underscore')._
  ;

/**
 * @private
 */
function postParams(url, params, callback) {
  request({
    method : 'POST',
    url : url,
    body : querystring.stringify(params),
    headers : {
      "content-type" : "application/x-www-form-urlencoded"
    }
  }, function(err, response) {
    if (err) {
      callback(err);
      return;
    }
    var res;
    try {
      res = JSON.parse(response.body);
      if (response.statusCode >= 400) {
        err = res;
        err.message = err.error + ": " + err.error_description;
        res = undefined;
      }
    } catch(e) {
      err = e;
    }
    callback(err, res);
  });
}

/**
 *
 */
var defaults = {
  loginUrl : "https://login.salesforce.com"
};

/**
 * OAuth2
 */
var OAuth2 = module.exports = function(options) {
  if (options.authzServiceUrl && options.tokenServiceUrl) {
    this.loginUrl = options.authzServiceUrl.split('/').slice(0, 3).join('/');
    this.authzServiceUrl = options.authzServiceUrl;
    this.tokenServiceUrl = options.tokenServiceUrl;
  } else {
    this.loginUrl = options.loginUrl || defaults.loginUrl;
    this.authzServiceUrl = this.loginUrl + "/services/oauth2/authorize";
    this.tokenServiceUrl = this.loginUrl + "/services/oauth2/token";
  }
  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.redirectUri = options.redirectUri;
};



/**
 *
 */
_.extend(OAuth2.prototype, {
  
  /**
   *
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
  }
  ,

  /**
   * OAuth2 Refresh Token Flow
   */
  refreshToken : function(refreshToken, callback) {
    postParams(this.tokenServiceUrl, {
      grant_type : "refresh_token",
      refresh_token : refreshToken,
      client_id : this.clientId,
      client_secret : this.clientSecret
    }, callback);
  }
  ,

  /**
   * OAuth2 Web Server Authentication Flow (Authorization Code)
   * Access Token Request
   */
  requestToken : function(code, callback) {
    postParams(this.tokenServiceUrl, {
      grant_type : "authorization_code",
      code : code,
      client_id : this.clientId,
      client_secret : this.clientSecret,
      redirect_uri : this.redirectUri
    }, callback);
  }
  ,

  /**
   * OAuth2 Username-Password Flow (Resource Owner Password Credentials)
   */
  authenticate : function(username, password, callback) {
    postParams(this.tokenServiceUrl, {
      grant_type : "password",
      username : username,
      password : password,
      client_id : this.clientId,
      client_secret : this.clientSecret,
      redirect_uri : this.redirectUri
    }, callback);
  }
});



