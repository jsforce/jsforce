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
describe("connection-crud", function() {

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
      it("should return updated account object", function(done) {
        conn.sobject('Account').record(accountId).retrieve(function(err, record) {
          if (err) { throw err; }
          assert.ok(record.Name === 'Hello2');
          assert.ok(_.isObject(record.attributes));
        }.check(done));
      });
    });
  });

  describe("update account with options headers", function() {
    var options = {
      headers: {
        'SForce-Auto-Assign': 'FALSE'
      }
    };

    it("should update with options headers successfully", function(done) {
      conn.sobject('Account').record(account.Id).update({ Name : "Hello3" }, options, function(err, ret) {
        if (err) { throw err; }
        assert.ok(ret.success);
      }.check(done));
    });

    describe("then retrieve the account", function() {
      it("should return updated account object with options headers set", function(done) {
        conn.sobject('Account').record(accountId).retrieve(options, function(err, record) {
          if (err) { throw err; }
          assert.ok(record.Name === 'Hello3');
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
          records.forEach(function(record) {
            assert.ok(record === null);
          });
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
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
