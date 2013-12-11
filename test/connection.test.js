/*global describe, it, before */
var assert = require('power-assert'),
    async  = require('async'),
    _      = require('underscore'),
    authorize = require('./helper/webauth'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

/**
 *
 */
describe("connection", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  /**
   *
   */
  describe("login", function() {
    it("should login by username and password", function(done) {
      conn.login(config.username, config.password, function(err, userInfo) {
        if (err) { throw err; }
        assert.ok(_.isString(conn.accessToken));
        assert.ok(_.isString(userInfo.id));
        assert.ok(_.isString(userInfo.organizationId));
        assert.ok(_.isString(userInfo.url));
      }.check(done));
    });
  });

  var accountId, account;
  /**
   *
   */
  describe("create account", function() {
    it("should return created obj", function(done) {
      conn.sobject('Account').create({ Name : 'Hello' }, function(err, ret) {
        if (err) { throw err; }
        assert.ok(ret.success);
        assert.ok(_.isString(ret.id));
        accountId = ret.id;
      }.check(done));
    });
  });

  /**
   *
   */
  describe("retrieve account", function() {
    it("should return a record", function(done) {
      conn.sobject('Account').retrieve(accountId, function(err, record) {
        if (err) { throw err; }
        assert.ok(_.isString(record.Id));
        assert.ok(_.isObject(record.attributes));
        assert.ok(record.Name === 'Hello');
        account = record;
      }.check(done));
    });
  });

  /**
   *
   */
  describe("update account", function() {
    it("should update successfully", function(done) {
      conn.sobject('Account').record(account.Id).update({ Name : "Hello2" }, function(err, ret) {
        if (err) { throw err; }
        assert.ok(ret.success);
      }.check(done));
    });

    describe("then retrieve the account", function() {
      it("sholuld return updated account object", function(done) {
        conn.sobject('Account').record(accountId).retrieve(function(err, record) {
          if (err) { throw err; }
          assert.ok(record.Name === 'Hello2');
          assert.ok(_.isObject(record.attributes));
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("delete account", function() {
    it("should delete successfully", function(done) {
      conn.sobject('Account').record(account.Id).destroy(function(err, ret) {
        if (err) { throw err; }
        assert.ok(ret.success);
      }.check(done));
    });

    describe("then retrieve the account", function() {
      it("should not return any record for deleted account", function(done) {
        conn.sobject('Account').retrieve(account.Id, function(err, record) {
          assert.ok(err instanceof Error);
          assert.ok(err.errorCode === 'NOT_FOUND');
        }.check(done));
      });
    });
  });


  var accountIds, accounts;
  /**
   *
   */
  describe("create multiple accounts", function() {
    it("should return created records", function(done) {
      conn.sobject('Account').create([
        { Name : 'Account #1' }, 
        { Name : 'Account #2' }
      ], function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        rets.forEach(function(ret) {
          assert.ok(ret.success);
          assert.ok(_.isString(ret.id));
        });
        accountIds = rets.map(function(ret){ return ret.id; });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("retrieve multiple accounts", function() {
    it("should return specified records", function(done) {
      conn.sobject('Account').retrieve(accountIds, function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        records.forEach(function(record, i) {
          assert.ok(_.isString(record.Id));
          assert.ok(_.isObject(record.attributes));
          assert.ok(record.Name === 'Account #' + (i+1));
        });
        accounts = records;
      }.check(done));
    });
  });

  /**
   *
   */
  describe("update multiple accounts", function() {
    it("should update records successfully", function(done) {
      conn.sobject('Account').update(
        accounts.map(function(account) {
          return { Id : account.Id, Name : "Updated " + account.Name };
        }),
        function(err, rets) {
          if (err) { throw err; }
          assert.ok(_.isArray(rets));
          rets.forEach(function(ret){
            assert.ok(ret.success);
          });
        }.check(done)
      );
    });

    describe("then retrieve the accounts", function() {
      it("sholuld return updated records", function(done) {
        conn.sobject('Account').retrieve(accountIds, function(err, records) {
          if (err) { throw err; }
          assert.ok(_.isArray(records));
          records.forEach(function(record, i) {
            assert.ok(record.Name === 'Updated Account #' + (i+1));
            assert.ok(_.isObject(record.attributes));
          });
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("delete multiple accounts", function() {
    it("should delete successfully", function(done) {
      conn.sobject('Account').destroy(accountIds, function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        rets.forEach(function(ret){
          assert.ok(ret.success);
        });
      }.check(done));
    });

    describe("then retrieve the accounts", function() {
      it("should not return any records", function(done) {
        conn.sobject('Account').retrieve(accountIds, function(err, records) {
          assert.ok(err instanceof Error);
          assert.ok(err.errorCode === 'NOT_FOUND');
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("upsert record", function() {
    var extId = "ID" + Date.now();
    var recId;

    describe("for not existing record", function() {
      it("should create record successfully", function(done) {
        var rec = { Name : 'New Record' };
        rec[config.upsertField] = extId;
        conn.sobject(config.upsertTable).upsert(rec, config.upsertField, function(err, ret) {
          if (err) { throw err; }
          assert.ok(ret.success);
          assert.ok(_.isString(ret.id));
          recId = ret.id;
        }.check(done));
      });
    });

    describe("for already existing record", function() {
      it("should update record successfully", function(done) {
        var rec = { Name : 'Updated Record' };
        rec[config.upsertField] = extId;
        conn.sobject(config.upsertTable).upsert(rec, config.upsertField, function(err, ret) {
          if (err) { throw err; }
          assert.ok(ret.success);
          assert.ok(_.isUndefined(ret.id));
        }.check(done));
      });

      describe("then retrieve the record", function() {
        it("should return updated record", function(done) {
          conn.sobject(config.upsertTable).retrieve(recId, function(err, record) {
            if (err) { throw err; }
            assert.ok(record.Name === "Updated Record");
          }.check(done));
        });
      });
    });

    describe("for duplicated external id record", function() {
      before(function(done) {
        var rec = { Name : 'Duplicated Record' };
        rec[config.upsertField] = extId;
        conn.sobject(config.upsertTable).create(rec, done);
      });

      it("should throw error and return array of choices", function(done) {
        var rec = { Name : 'Updated Record, Twice' };
        rec[config.upsertField] = extId;
        conn.sobject(config.upsertTable).upsert(rec, config.upsertField, function(err, ret) {
          assert.ok(err instanceof Error);
          assert.ok(err.name === "MULTIPLE_CHOICES");
          assert.ok(_.isArray(err.content));
          assert.ok(_.isString(err.content[0]));
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("describe Account", function() {
    it("should return metadata information", function(done) {
      conn.sobject('Account').describe(function(err, meta) {
        if (err) { throw err; }
        assert.ok(meta.name === "Account");
        assert.ok(_.isArray(meta.fields));
      }.check(done));
    });

    describe("then describe cached Account", function() {
      it("should return metadata information", function(done) {
        conn.sobject('Account').describe$(function(err, meta) {
          if (err) { throw err; }
          assert.ok(meta.name === "Account");
          assert.ok(_.isArray(meta.fields));
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("describe global sobjects", function() {
    it("should return whole global sobject list", function(done) {
      conn.describeGlobal(function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isArray(res.sobjects));
        assert.ok(_.isString(res.sobjects[0].name));
        assert.ok(_.isString(res.sobjects[0].label));
        assert.ok(_.isUndefined(res.sobjects[0].fields));
      }.check(done));
    });

    describe("then describe cached global sobjects", function() {
      it("should return whole global sobject list", function(done) {
        conn.describeGlobal$(function(err, res) {
          if (err) { throw err; }
          assert.ok(_.isArray(res.sobjects));
          assert.ok(_.isString(res.sobjects[0].name));
          assert.ok(_.isString(res.sobjects[0].label));
          assert.ok(_.isUndefined(res.sobjects[0].fields));
        }.check(done));
      });
    });
  });


  /**
   *
   */
  describe("logout by soap api", function() {
    var sessionInfo;
    it("should logout", function(done) {
      sessionInfo = {
        accessToken : conn.accessToken,
        instanceUrl : conn.instanceUrl
      };
      conn.logout(function(err) {
        if (err) { throw err; }
        assert.ok(_.isNull(conn.accessToken));
      }.check(done));
    });

    describe("then connect with previous session info", function() {
      it("should raise authentication error", function(done) {
        conn = new sf.Connection(sessionInfo);
        setTimeout(function() { // wait a moment
          conn.query("SELECT Id FROM User", function(err, res) {
            assert.ok(err instanceof Error);
          }.check(done));
        }, 5000);
      });
    });
  });

  /**
   *
   */
  describe("login by oauth2", function() {
    var newConn = new sf.Connection({
      oauth2: {
        clientId : config.clientId,
        clientSecret : config.clientSecret,
        redirectUri : config.redirectUri,
      },
      logLevel : config.logLevel
    });

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

});

