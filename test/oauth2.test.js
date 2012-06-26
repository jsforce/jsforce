var vows   = require('vows')
  , assert = require('assert')
  , zombie = require('zombie')
  , querystring = require('querystring')
  , OAuth2 = require('../lib/oauth2')
  , config = require('./config/oauth2')
  ;


var oauth2 = new OAuth2(config);

var browser = new zombie.Browser();
browser.runScripts = true;

  
vows.describe("oauth2").addBatch({

  "OAuth2 web server flow : access to authz url" : {
    topic : function() {
      browser.visit(oauth2.getAuthorizationUrl({ state : "hello" }), this.callback);
    },

    "should get login page" : function() {
      assert.ok(browser.success);
      assert.lengthOf(browser.body.querySelectorAll('input[name=username]'), 1);
      assert.lengthOf(browser.body.querySelectorAll('input[name=pw]'), 1);
      assert.lengthOf(browser.body.querySelectorAll('input[name=Login]'), 1);
    },

  ", then input username/password" : {
    topic : function() {
      var self = this;
      browser.fill("input[name=un]", config.username)
             .fill("input[name=pw]", config.password)
             .pressButton("input[name=Login]", function() {
               browser.wait(1500, self.callback);
             });
    },

    "should get authz page" : function() {
      assert.ok(browser.success);
    },

  ", then press authorize, if it is required" : {
    topic : function() {
      var url = browser.location.href;
      if (url.indexOf(config.redirectUri) === 0) {
        this.callback();
      } else {
        browser.pressButton("#oaapprove", this.callback);
      }
    },

    "should get authorization code and state" : function() {
      assert.ok(browser.success);
      var url = browser.location.href;
      assert.equal(url.indexOf(config.redirectUri), 0);
      url = require('url').parse(url);
      var params = querystring.parse(url.query);
      assert.equal(params.state, "hello");
      assert.isString(params.code);
    },

  ", then retrieve access token" : {
    topic : function() {
      var url = browser.location.href;
      url = require('url').parse(url);
      var params = querystring.parse(url.query);
      oauth2.requestToken(params.code, this.callback);
    },

    "should receive access token (and refresh token)" : function(res) {
      assert.isString(res.access_token);
      assert.isString(res.refresh_token);
    },

  ", then refresh token" : {
    topic : function(res) {
      oauth2.refreshToken(res.refresh_token, this.callback);
    },

    "should receive new access token" : function(res) {
      assert.isString(res.access_token);
    }

  }}}}}

}).addBatch({

  "OAuth2 username & password flow : authenticate" : {
    topic : function() {
      oauth2.authenticate(config.username, config.password, this.callback);
    },

    "should receive access token" : function(res) {
      assert.isString(res.access_token);
    }
  }

}).export(module);
