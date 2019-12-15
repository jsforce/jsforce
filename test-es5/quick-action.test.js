/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('lodash/core'),
    sf     = require('../lib/jsforce'),
    QuickAction = require("../lib/quick-action"),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("quick-action", function() {

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
  describe("list global actions", function() {
    it("should return global actions", function(done) {
      conn.quickActions(function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
        results.forEach(function(res) {
          assert.ok(_.isString(res.type));
          assert.ok(_.isString(res.name));
          assert.ok(_.isString(res.label));
          assert.ok(_.isObject(res.urls));
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("list sobject actions", function() {
    it("should return global actions", function(done) {
      conn.sobject('Account').quickActions(function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
        results.forEach(function(res) {
          assert.ok(_.isString(res.type));
          assert.ok(_.isString(res.name));
          assert.ok(_.isString(res.label));
          assert.ok(_.isObject(res.urls));
        });
      }.check(done));
    });
  });

  var action;
  /**
   *
   */
  describe("get a global action", function() {
    it("should return a global quick action reference", function() {
      action = conn.quickAction('LogACall');
      assert.ok(action instanceof QuickAction);
    });
  });

  /**
   *
   */
  describe("describe global action info", function() {
    it("should return global actions", function(done) {
      action.describe(function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isObject(res));
        assert.ok(_.isString(res.type));
        assert.ok(_.isString(res.name));
        assert.ok(_.isString(res.label));
        assert.ok(_.isObject(res.urls));
        assert.ok(_.isObject(res.layout));
        assert.ok(res.targetSobjectType === 'Task');
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get default values of the action", function() {
    it("should return default field values", function(done) {
      action.defaultValues(function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isObject(res));
        // assert.ok(res.Subject === null);
        assert.ok(res.Description === null);
        assert.ok(res.WhoId === null);
        assert.ok(res.WhatId === null);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get default values of the action for an account record", function() {
    var accId;

    before(function(done) {
      conn.sobject('Account').create({ Name: 'JSforce QuickAction Test' }, function(err, ret) {
        if (err) { throw err; }
        accId = ret.id;
      }.check(done));
    });

    it("should return default field values", function(done) {
      action.defaultValues(accId, function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isObject(res));
        // assert.ok(res.Subject === null);
        assert.ok(res.Description === null);
        assert.ok(res.WhoId === null);
        assert.ok(res.WhatId === accId);
      }.check(done));
    });

    after(function(done) {
      conn.sobject('Account').destroy(accId, done);
    });

  });

  /**
   *
   */
  describe("execute action for record", function() {
    var accId;

    before(function(done) {
      conn.sobject('Account').create({ Name: 'JSforce QuickAction Test' }, function(err, ret) {
        if (err) { throw err; }
        accId = ret.id;
      }.check(done));
    });

    it("should execute and return the result", function(done) {
      var record = {
        Subject: 'My Task Test',
        Description: 'This is the task'
      };
      action.execute(accId, record, function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isObject(res));
        assert.ok(res.success === true);
        assert.ok(res.created === true);
        assert.ok(_.isString(res.id));
        assert.ok(_.isArray(res.feedItemIds));
        assert.ok(res.contextId === accId);
      }.check(done));
    });

    after(function(done) {
      conn.sobject('Account').destroy(accId, done);
    });

  });

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
