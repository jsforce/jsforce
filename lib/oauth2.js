var querystring = require('querystring')
  , request = require('request')
  , _ = require('underscore')._
  ;

/**
 * OAuth2
 */
var OAuth2 = module.exports = function(options) {
  this.authzServiceUrl = options.authzServiceUrl;
  this.tokenServiceUrl = options.tokenServiceUrl;
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
    params = _.extend(params || {}, {
      response_type : "code",
      client_id : this.clientId,
      redirect_uri : this.redirectUri
    });
    return this.authzServiceUrl + 
      (this.authzServiceUrl.indexOf('?') >= 0 ? "&" : "?") + 
      querystring.stringify(params);
  }
  ,

  /**
   *
   */
  refreshToken : function(refreshToken, callback) {
    request({
      method : 'POST',
      url : this.tokenServiceUrl,
      body : querystring.stringify({
        grant_type : "refresh_token",
        refresh_token : refreshToken,
        client_id : this.clientId,
        client_secret : this.clientSecret
      }),
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
      } catch(e) {
        callback(e);
        return;
      }
      callback(null, res);
    });
  }
  ,

  /**
   *
   */
  authorizeCode : function(code, callback) {
    request({
      method : 'POST',
      url : this.tokenServiceUrl,
      body : querystring.stringify({
        grant_type : "authorization_code",
        code : code,
        client_id : this.clientId,
        client_secret : this.clientSecret,
        redirect_uri : this.redirectUri
      }),
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
      } catch(e) {
        callback(e);
        return;
      }
      callback(null, res);
    });
  }
  ,

  /**
   * OAuth2 Username-Password Flow (Resource Owner Password Credentials)
   */
  authorizePassword : function(username, password, callback) {
    request({
      method : 'POST',
      url : this.tokenServiceUrl,
      body : querystring.stringify({
        grant_type : "authorization_code",
        username : username,
        password : password,
        client_id : this.clientId,
        client_secret : this.clientSecret,
        redirect_uri : this.redirectUri
      })
    }, function(err, response) {
      if (err) {
        callback(err);
        return;
      }
      var res;
      try {
        res = JSON.parse(response.body);
      } catch(e) {
        callback(e);
        return;
      }
      callback(null, res);
    });

  }

});
  


