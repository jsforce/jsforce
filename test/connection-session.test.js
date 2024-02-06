/*global describe, it, before */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var async  = require('async'),
    _      = require('lodash/core'),
    authorize = require('./helper/webauth'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

/**
 *
 */
describe("connection-session", function() {

  this.timeout(20000); // set timeout to 20 sec.

  /**
   *
   */
  describe("login", function() {
    var conn;
    it("should login by username and password", function(done) {
      conn = new sf.Connection({ logLevel: config.logLevel, proxyUrl: config.proxyUrl });
      conn.login(config.username, config.password, function(err, userInfo) {
        if (err) { throw err; }
        assert.ok(_.isString(conn.accessToken));
        assert.ok(_.isString(userInfo.id));
        assert.ok(_.isString(userInfo.organizationId));
        assert.ok(_.isString(userInfo.url));
      }.check(done));
    });

    describe("then do simple query", function() {
      it("should return some records", function(done) {
        conn.query("SELECT Id FROM User", function(err, res) {
          assert.ok(_.isArray(res.records));
        }.check(done));
      });
    });

    describe("then catch/handle bad access token", function() {
      var newAccessToken, refreshCount = 0;
      it("should return User records", function(done) {
        conn.accessToken = "invalid access token";
        conn.removeAllListeners("refresh");
        conn.on("refresh", function(at) {
          newAccessToken = at;
          refreshCount++;
        });
        conn.query("SELECT Id FROM User LIMIT 5", function(err, res) {
          assert.ok(refreshCount === 1);
          assert.ok(_.isString(newAccessToken));
          assert.ok(_.isArray(res.records));
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("logout", function() {

    describe("soap session", function() {
      var sessionInfo;
      it("should logout soap session", function(done) {
        var conn1 = new sf.Connection({ logLevel: config.logLevel, proxyUrl: config.proxyUrl });
        conn1.loginBySoap(config.username, config.password, function(err) {
          if (err) { return done(err); }
          sessionInfo = {
            sessionId : conn1.accessToken,
            serverUrl : conn1.instanceUrl
          };
          conn1.logout(function(err) {
            if (err) { throw err; }
            assert.ok(_.isNull(conn1.accessToken));
          }.check(done));
        });
      });

      describe("then connect with previous session info", function() {
        it("should raise authentication error", function(done) {
          var conn2 = new sf.Connection({
            sessionId: sessionInfo.sessionId,
            serverUrl: sessionInfo.serverUrl,
            logLevel: config.logLevel,
            proxyUrl: config.proxyUrl
          });
          setTimeout(function() { // wait a moment
            conn2.query("SELECT Id FROM User", function(err, res) {
              assert.ok(err && _.isString(err.message));
            }.check(done));
          }, 10000);
        });
      });
    });

if (TestEnv.isNodeJS) {

    describe("oauth2 session", function() {
      var sessionInfo;
      it("should logout oauth2 session", function(done) {
        var conn1 = new sf.Connection({
          oauth2: {
            clientId : config.clientId,
            clientSecret : config.clientSecret,
            redirectUri : config.redirectUri
          },
          logLevel : config.logLevel
        });
        conn1.loginByOAuth2(config.username, config.password, function(err) {
          if (err) { return done(err); }
          sessionInfo = {
            accessToken : conn1.accessToken,
            instanceUrl : conn1.instanceUrl
          };
          conn1.logout(function(err) {
            if (err) { throw err; }
            assert.ok(_.isNull(conn1.accessToken));
          }.check(done));
        });
      });

      describe("then connect with previous session info", function() {
        it("should raise authentication error", function(done) {
          var conn2 = new sf.Connection({
            accessToken: sessionInfo.accessToken,
            instanceUrl: sessionInfo.instanceUrl,
            logLevel: config.logLevel
          });
          setTimeout(function() { // wait a moment
            conn2.query("SELECT Id FROM User", function(err, res) {
              assert.ok(err && _.isString(err.message));
            }.check(done));
          }, 10000);
        });
      });
    });

}


  });


/*------------------------------------------------------------------------*/
if (TestEnv.isNodeJS) {

  /**
   *
   */
  describe("login by oauth2 web server flow", function() {
    var newConn = new sf.Connection({
      oauth2: {
        clientId : config.clientId,
        clientSecret : config.clientSecret,
        redirectUri : config.redirectUri
      },
      logLevel : config.logLevel
    });
    var accessToken, instanceUrl;

    it("should login and get access tokens", function(done) {
      async.waterfall([
        function(cb) {
          authorize(newConn.oauth2.getAuthorizationUrl(), config.username, config.password, cb);
        },
        function(params, cb) {
          newConn.authorize(params.code, cb);
        }
      ], function(err, userInfo) {
        if (err) { return done(err); }
        assert.ok(_.isString(userInfo.id));
        assert.ok(_.isString(userInfo.organizationId));
        assert.ok(_.isString(userInfo.url));
        assert.ok(_.isString(newConn.accessToken));
        assert.ok(_.isString(newConn.refreshToken));
        accessToken = newConn.accessToken;
        instanceUrl = newConn.instanceUrl;
      }.check(done));
    });

    describe("then do simple query", function() {
      it("should return some records", function(done) {
        newConn.query("SELECT Id FROM User", function(err, res) {
          assert.ok(_.isArray(res.records));
        }.check(done));
      });
    });

    describe("then make access token invalid", function() {
      var newAccessToken, refreshCount = 0;
      it("should return responses", function(done) {
        newConn.accessToken = "invalid access token";
        newConn.removeAllListeners("refresh");
        newConn.on("refresh", function(at) {
          newAccessToken = at;
          refreshCount++;
        });
        newConn.query("SELECT Id FROM User", function(err, res) {
          assert.ok(refreshCount === 1);
          assert.ok(_.isString(newAccessToken));
          assert.ok(_.isArray(res.records));
          accessToken = newAccessToken;
        }.check(done));
      });
    });

    describe("then make access token invalid and call api in parallel", function() {
      var newAccessToken, refreshCount = 0;
      it("should return responses", function(done) {
        newConn.accessToken = "invalid access token";
        newConn.removeAllListeners("refresh");
        newConn.on("refresh", function(at) {
          newAccessToken = at;
          refreshCount++;
        });
        async.parallel([
          function(cb) {
            newConn.query('SELECT Id FROM User', cb);
          },
          function(cb) {
            newConn.describeGlobal(cb);
          },
          function(cb) {
            newConn.sobject('User').describe(cb);
          }
        ], function(err, results) {
          assert.ok(refreshCount === 1);
          assert.ok(_.isString(newAccessToken));
          assert.ok(_.isArray(results));
          assert.ok(_.isArray(results[0].records));
          assert.ok(_.isArray(results[1].sobjects));
          assert.ok(_.isArray(results[2].fields));
          accessToken = newAccessToken;
        }.check(done));
      });
    });

    describe("then expire both access token and refresh token", function() {
      it("should return error response", function(done) {
        newConn.accessToken = "invalid access token";
        newConn.refreshToken = "invalid refresh token";
        newConn.query("SELECT Id FROM User", function(err) {
          assert.ok(err instanceof Error);
          assert.ok(err.name === "invalid_grant");
        }.check(done));
      });
    });

  });

}
/*------------------------------------------------------------------------*/

});
