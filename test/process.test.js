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
describe("process", function() {

  this.timeout(10000); // set timeout to 10 sec.

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
  });

  var accountId = null;

  /**
   * Test data setup
   */
  before(function(done) {
    conn.sobject('Account').create({ Name: 'JSforce ProcessRule/ApprovalProcess Test' }, function(err, ret) {
      if (err) { throw err; }
      accountId = ret.id;
    }.check(done));
  });

  /**
   *
   */
  describe("process rule", function() {
    describe("retrieve all process rules", function() {
      it("should list process rules", function(done) {
        conn.process.rule.list(function(err, rulesSet) {
          if (err) { throw err; }
          for (var sobject in rulesSet) {
            var rules = rulesSet[sobject];
            for (var i=0; i<rules.length; i++) {
              var rule = rules[i];
              assert.ok(_.isString(rule.id));
              assert.ok(_.isString(rule.name));
              assert.ok(_.isString(rule.object));
            }
          }
        }.check(done));
      });
    });

    describe("trigger process rule", function() {
      it("should trigger process rules", function(done) {
        conn.process.rule.trigger(accountId, function(err, result) {
          if (err) { throw err; }
          assert.ok(result.success);
          assert.ok(_.isNull(result.errors));
        }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("approval process", function() {
    describe("retrieve all approval process definitions", function() {
      it("should list approval process definitions", function(done) {
        conn.process.rule.list(function(err, defsSet) {
          if (err) { throw err; }
          for (var sobject in defsSet) {
            var approvals = defsSet[sobject];
            for (var i=0; i<approvals.length; i++) {
              var approval = approvals[i];
            }
          }
        }.check(done));
      });
    });

    describe("submit approval process", function() {
      var workitemId = null;

      it("should submit approval request", function(done) {
        conn.process.approval.submit(accountId, "This is test approval request submission.", function(err, result) {
          if (err) { throw err; }
          assert.ok(result.success);
          assert.ok(_.isNull(result.errors));
          assert.ok(_.isArray(result.actorIds));
          assert.ok(_.isString(result.entityId));
          assert.ok(_.isString(result.instanceId));
          assert.ok(result.instanceStatus === 'Pending');
          assert.ok(_.isArray(result.newWorkitemIds));
          workitemId = result.newWorkitemIds[0];
        }.check(done));
      });

      it("should approve approval request", function(done) {
        conn.process.approval.approve(workitemId, "Approved.", function(err, result) {
          if (err) { throw err; }
          assert.ok(result.success);
          assert.ok(_.isNull(result.errors));
          assert.ok(_.isArray(result.actorIds));
          assert.ok(_.isString(result.entityId));
          assert.ok(_.isString(result.instanceId));
          assert.ok(result.instanceStatus === 'Pending');
          assert.ok(_.isArray(result.newWorkitemIds));
          workitemId = result.newWorkitemIds[0];
        }.check(done));
      });

      it("should reject approval request", function(done) {
        conn.process.approval.reject(workitemId, "Rejected.", function(err, result) {
          if (err) { throw err; }
          assert.ok(result.success);
          assert.ok(_.isNull(result.errors));
          assert.ok(_.isNull(result.actorIds));
          assert.ok(_.isString(result.entityId));
          assert.ok(_.isString(result.instanceId));
          assert.ok(result.instanceStatus === 'Rejected');
          assert.ok(_.isArray(result.newWorkitemIds));
        }.check(done));
      });
    });
  });

  /**
   * cleanup
   */
  after(function(done) {
    if (accountId) {
      conn.sobject('Account').destroy(accountId, done);
    } else {
      done();
    }
  });

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
