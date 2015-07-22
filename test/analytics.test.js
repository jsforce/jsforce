/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('underscore'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("analytics", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  var reportId;

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
  before(function(done) {
    conn.sobject('Report').findOne({ Name: 'Lead List Report'}, "Id").execute(function(err, res) {
      if (err) { throw err; }
      if (!res) { throw new Error("No Report Name 'Lead List Report' was found in the org."); }
      reportId = res.Id;
    }.check(done));
  });

  /**
   *
   */
  describe("list recent reports", function() {
    it("should return report infomation list", function(done) {
      conn.analytics.reports(function(err, reports) {
        if (err) { throw err; }
        assert.ok(_.isArray(reports));
        reports.forEach(function(report) {
          assert.ok(_.isString(report.id));
          assert.ok(_.isString(report.name));
          assert.ok(_.isString(report.url));
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("describe report", function() {
    it("should return report metadata", function(done) {
      conn.analytics.report(reportId).describe(function(err, meta) {
        if (err) { throw err; }
        assert.ok(_.isObject(meta));
        assert.ok(_.isObject(meta.reportMetadata));
        assert.ok(_.isObject(meta.reportTypeMetadata));
        assert.ok(_.isObject(meta.reportExtendedMetadata));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("execute report synchronously", function() {
    it("should return report execution result", function(done) {
      conn.analytics.report(reportId).execute(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result));
        assert.ok(result.hasDetailRows === false);
        assert.ok(_.isObject(result.reportMetadata));
        assert.ok(result.reportMetadata.id === reportId);
        assert.ok(_.isObject(result.factMap));
        assert.ok(_.isObject(result.factMap["T!T"]));
        assert.ok(_.isUndefined(result.factMap["T!T"].rows));
        assert.ok(_.isObject(result.factMap["T!T"].aggregates));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("execute report synchronously with details", function() {
    it("should return report execution result", function(done) {
      conn.analytics.report(reportId).execute({ details: true }, function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result));
        assert.ok(result.hasDetailRows === true);
        assert.ok(_.isObject(result.reportMetadata));
        assert.ok(result.reportMetadata.id === reportId);
        assert.ok(_.isObject(result.factMap));
        assert.ok(_.isObject(result.factMap["T!T"]));
        assert.ok(_.isArray(result.factMap["T!T"].rows));
        assert.ok(_.isObject(result.factMap["T!T"].aggregates));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("execute report synchronously with filters overrided", function() {
    it("should return report execution result", function(done) {
      var metadata = {
        reportMetadata : {
          historicalSnapshotDates : [],
          reportFilters : [{
            column: 'COMPANY',
            operator: 'contains',
            value: ',Inc.'
          }]
        }
      };
      conn.analytics.report(reportId).execute({ metadata : metadata, details: true }, function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result));
        assert.ok(_.isObject(result.reportMetadata));
        assert.ok(_.isArray(result.reportMetadata.reportFilters));
        assert.ok(result.reportMetadata.id === reportId);
        assert.ok(_.isObject(result.factMap));
        assert.ok(_.isObject(result.factMap["T!T"]));
        assert.ok(_.isArray(result.factMap["T!T"].rows));
        assert.ok(_.isObject(result.factMap["T!T"].aggregates));
      }.check(done));
    });
  });

  var instanceId;

  /**
   *
   */
  describe("execute report asynchronously", function() {
    it("should return report instance info", function(done) {
      conn.analytics.report(reportId).executeAsync(function(err, instance) {
        if (err) { throw err; }
        assert.ok(_.isObject(instance));
        assert.ok(_.isString(instance.id));
        assert.ok(_.isString(instance.status));
        assert.ok(_.isString(instance.requestDate));
        instanceId = instance.id;
      }.check(done));
    });
  });

  /**
   *
   */
  describe("list asynchronously executed report instances", function() {
    it("should return report instance list", function(done) {
      var rinstance = conn.analytics.report(reportId).instances(function(err, instances) {
        if (err) { throw err; }
        assert.ok(_.isArray(instances));
        instances.forEach(function(instance) {
          assert.ok(_.isString(instance.id));
          assert.ok(_.isString(instance.status));
          assert.ok(_.isString(instance.requestDate));
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("retrieve asynchronously executed report result", function() {
    it("should return report execution result", function(done) {
      conn.analytics.report(reportId).instance(instanceId).retrieve(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result));
        assert.ok(_.isObject(result.attributes));
        assert.ok(result.attributes.id === instanceId);
        assert.ok(_.isString(result.attributes.status));
        assert.ok(_.isString(result.attributes.requestDate));
        if (result.attributes.status == 'Success') {
          assert.ok(_.isObject(result.reportMetadata));
          assert.ok(result.reportMetadata.id === reportId);
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("explain query plan of report", function() {
    it("should get explain result", function(done) {
      conn.analytics.report(reportId).explain(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isArray(result.plans));
        for (var i=0; i<result.plans.length; i++) {
          var plan = result.plans[i];
          assert.ok(_.isNumber(plan.cardinality));
          assert.ok(_.isArray(plan.fields));
          assert.ok(_.isString(plan.leadingOperationType));
          assert.ok(_.isNumber(plan.relativeCost));
          assert.ok(_.isNumber(plan.sobjectCardinality));
          assert.ok(_.isString(plan.sobjectType));
        }
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
