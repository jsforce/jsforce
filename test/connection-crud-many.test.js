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
describe("connection-crud-many", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
  });

  var accountId, account;
  /**
   *
   */
  describe("create account", function() {
    it("should return created obj", function(done) {
      conn.sobject('Account').createMany({ Name : 'Hello' }, function(err, ret) {
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


  var accountIds, accounts;
  /**
   *
   */
  describe("create multiple accounts", function() {
    it("should return created records", function(done) {
      conn.sobject('Account').createMany([
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
      conn.sobject('Account').updateMany(
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
      conn.sobject('Account').destroyMany(accountIds, function(err, rets) {
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
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
