/*global describe, it, before */
var assert = require('power-assert'),
    _      = require('underscore'),
    authorize = require('./helper/webauth'),
    OAuth2 = require('../lib/oauth2'),
    config = require('./config/oauth2');

var oauth2 = new OAuth2(config);

/**
 *
 */
describe("oauth2", function() {

  /**
   *
   */
  describe("OAuth2 web server flow", function() {
    this.timeout(40000);
    var code, accessToken, refreshToken;

    it("should receive authz code", function(done) {
      var url = oauth2.getAuthorizationUrl({ state: 'hello' });
      authorize(url, config.username, config.password, function(err, params) {
        assert.ok(_.isString(params.code));
        assert.ok(params.state === 'hello');
        code = params.code;
      }.check(done));
    });

    it("should receive access/refresh token", function(done) {
      oauth2.requestToken(code, function(err, res) {
        assert.ok(_.isString(res.access_token));
        assert.ok(_.isString(res.refresh_token));
        accessToken = res.access_token;
        refreshToken = res.refresh_token;
      }.check(done));
    });

    it("should refresh access token", function(done) {
      oauth2.refreshToken(refreshToken, function(err, res) {
        assert.ok(_.isString(res.access_token));
      }.check(done));
    });

  });

  /**
   *
   */
  describe("OAuth2 username & password flow : authenticate", function() {
    it("should receive access token", function(done) {
      oauth2.authenticate(config.username, config.password, function(err, res) {
        if (err) { return done(err); }
        assert.ok(_.isString(res.access_token));
      }.check(done));
    });
  });

});
