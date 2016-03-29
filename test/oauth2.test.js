/*global describe, it, before */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('lodash/core'),
    authorize = require('./helper/webauth'),
    OAuth2 = require('../lib/oauth2'),
    config = require('./config/salesforce');

/**
 *
 */
describe("oauth2", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var oauth2 = new OAuth2(config);

/*------------------------------------------------------------------------*/
if (TestEnv.isNodeJS) {
  /**
   *
   */
  describe("OAuth2 web server flow", function() {
    var code, accessToken, refreshToken;

    it("should receive authz code", function(done) {
      var url = oauth2.getAuthorizationUrl({ state: 'hello' });
      authorize(url, config.username, config.password, function(err, params) {
        if (err) { throw err; }
        assert.ok(_.isString(params.code));
        assert.ok(params.state === 'hello');
        code = params.code;
      }.check(done));
    });

    it("should receive access/refresh token", function(done) {
      oauth2.requestToken(code, function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isString(res.access_token));
        assert.ok(_.isString(res.refresh_token));
        accessToken = res.access_token;
        refreshToken = res.refresh_token;
      }.check(done));
    });

    it("should refresh access token", function(done) {
      oauth2.refreshToken(refreshToken, function(err, res) {
        if (err) { throw err; }
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
        if (err) { throw err; }
        assert.ok(_.isString(res.access_token));
      }.check(done));
    });
  });

}
/*------------------------------------------------------------------------*/

});
