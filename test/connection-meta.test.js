/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var async  = require('async'),
    _      = require('lodash/core'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("connection-meta", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
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
  describe("get recently accessed records", function() {
    before(function(done) {
      conn.query("SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 2 FOR VIEW", function(err) {
        if (err) { throw err; }
      }.check(done));
    });

    it("should return recently viewed records in all object", function(done) {
      conn.recent(2, function(err, records) {
        if (err) { throw err; }
        assert(_.isArray(records));
        records.forEach(function(record) {
          assert(_.isString(record.Id));
          assert(_.isString(record.Name));
          assert(_.isString(record.attributes.type));
          assert(record.attributes.type === 'Account');
        });
      }.check(done));
    });

    it("should return recently viewed accounts in Account object", function(done) {
      conn.sobject('Account').recent(function(err, records) {
        if (err) { throw err; }
        assert(_.isArray(records));
        records.forEach(function(record) {
          assert(_.isString(record.Id));
          assert(_.isString(record.Name));
          assert(_.isString(record.attributes.type));
          assert(record.attributes.type === 'Account');
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get updated / deleted account", function () {
    before(function(done) {
      var accs = [{ Name: 'Hello' }, { Name: 'World' }];
      conn.sobject('Account').create(accs, function(err, rets) {
        if (err) { throw err; }
        var id1 = rets[0].id, id2 = rets[1].id;
        async.parallel([
          function(cb) {
            conn.sobject('Account').record(id1).update({ Name: "Hello2" }, cb);
          },
          function(cb) {
            conn.sobject('Account').record(id2).destroy(cb);
          }
        ], function (err, ret) {
          if (err) { throw err; }
        }.check(done));
      });
    });

    /**
     *
     */
    describe("get updated accounts", function () {
      it("should return updated account object", function (done) {
        var end = new Date();
        var start = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day before
        conn.sobject('Account').updated(start, end, function (err, result) {
          if (err) { throw err; }
          assert.ok(_.isArray(result.ids));
        }.check(done));
      });
    });

    /**
     *
     */
    describe("get updated account with string input", function () {
      it("should return updated account object", function (done) {
        var end = new Date();
        var start = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day before
        conn.sobject('Account').updated(start.toString(), end.toString(), function (err, result) {
          if (err) { throw err; }
          assert.ok(_.isArray(result.ids));
        }.check(done));
      });
    });

    /**
     *
     */
    describe("get deleted account", function () {
      it("should return deleted account object", function (done) {
        var end = new Date();
        var start = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day before
        conn.sobject('Account').deleted(start, end, function (err, result) {
          if (err) { throw err; }
          assert.ok(_.isArray(result.deletedRecords));
        }.check(done));
      });
    });

    /**
     *
     */
    describe("get deleted account with string input", function () {
      it("should return deleted account object", function (done) {
        var end = new Date();
        var start = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day before
        conn.sobject('Account').deleted(start.toString(), end.toString(), function (err, result) {
          if (err) { throw err; }
          assert.ok(_.isArray(result.deletedRecords));
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("get user identity information", function() {
    it("should return user identity information", function (done) {
      conn.identity(function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isString(res.id));
        assert.ok(res.id.indexOf('https://') === 0);
        assert.ok(_.isString(res.user_id));
        assert.ok(_.isString(res.organization_id));
        assert.ok(_.isString(res.email));
        assert.ok(_.isObject(res.photos));
        assert.ok(_.isObject(res.urls));
      }.check(done));
    });
  });


  /**
   *
   */
  describe("get api limit information", function() {
    it("should get api usage and its limit in the org", function() {
      var limitInfo = conn.limitInfo;
      assert.ok(_.isObject(limitInfo.apiUsage));
      assert.ok(_.isNumber(limitInfo.apiUsage.used));
      assert.ok(_.isNumber(limitInfo.apiUsage.limit));
      assert.ok(limitInfo.apiUsage.used > 0);
      assert.ok(limitInfo.apiUsage.limit >= limitInfo.apiUsage.used);
    });
  });

  /**
   *
   */
  describe("get tabs list information", function() {
    it("should get tabs info in the org", function(done) {
      conn.tabs(function(err, tabs) {
        assert.ok(_.isArray(tabs));
        tabs.forEach(function(tab) {
          assert.ok(_.isString(tab.label));
          assert.ok(_.isString(tab.name));
          assert.ok(_.isString(tab.url));
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get system limits information", function() {
    it("should get limit info in the org", function(done) {
      conn.limits(function(err, limits) {
        assert.ok(_.isObject(limits));
        assert.ok(_.isObject(limits.DataStorageMB));
        assert.ok(limits.DataStorageMB.Remaining >= 0);
        assert.ok(limits.DataStorageMB.Max > 0);
        assert.ok(_.isObject(limits.FileStorageMB));
        assert.ok(limits.FileStorageMB.Remaining >= 0);
        assert.ok(limits.FileStorageMB.Max > 0);
        assert.ok(_.isObject(limits.DailyApiRequests));
        assert.ok(limits.DailyApiRequests.Remaining >= 0);
        assert.ok(limits.DailyApiRequests.Max > 0);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get theme information", function() {
    it("should get theme info in the org", function(done) {
      conn.theme(function(err, theme) {
        assert.ok(_.isObject(theme));
        assert.ok(_.isArray(theme.themeItems));
        theme.themeItems.forEach(function(t) {
          assert.ok(_.isString(t.name));
          assert.ok(_.isArray(t.colors) || t.colors === null);
          (t.colors || []).forEach(function(c) {
            assert.ok(_.isString(c.color));
            assert.ok(_.isString(c.context));
            assert.ok(_.isString(c.theme));
          });
          assert.ok(_.isArray(t.icons) || t.icons === null);
          (t.icons || []).forEach(function(ic) {
            assert.ok(_.isString(ic.url));
            assert.ok(_.isNumber(ic.width));
            assert.ok(_.isNumber(ic.height));
            assert.ok(_.isString(ic.contentType));
          });
        });
      }.check(done));
    });
  });

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
