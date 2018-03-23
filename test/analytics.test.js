/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('lodash/core'),
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
  var cloneId;
  var dashboardMetadata;
  var dashboardId;
  var dashboardFolderId;
  var cloneDashboardId;

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
  before(function(done) {
    conn.sobject('Dashboard').findOne({ Title: 'Lead List Dashboard'}, "Id").execute(function(err, res) {
      if (err) { throw err; }
      if (!res) { throw new Error("No Dashboard Named 'Lead List Dashboard' was found in the org."); }
      dashboardId = res.Id;
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
  describe("clone report", function() {
    it("should clone the report", function(done) {
      conn.analytics.report(reportId).clone("Lead List Report Clone", function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result.reportMetadata));
        cloneId = result.reportMetadata.id;
        assert.ok(cloneId !== reportId);
        assert.ok(result.reportMetadata.name === "Lead List Report Clone");
      }.check(done));
    });
  });

  /**
   *
   */
  describe("destroy report", function() {
    it("should destroy the report", function(done) {
      conn.analytics.report(cloneId).destroy(function(err, result) {
        if (err) { throw err; }
        conn.analytics.report(cloneId).describe(function(desc_err) {
          assert.ok(_.isObject(desc_err));
          assert.ok(desc_err.name === "NOT_FOUND");
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("list recent dashboards", function() {
    it("should return dashboard infomation list", function(done) {
      conn.analytics.reports(function(err, dashboards) {
        if (err) { throw err; }
        assert.ok(_.isArray(dashboards));
        dashboards.forEach(function(dashboard) {
          assert.ok(_.isString(dashboard.id));
          assert.ok(_.isString(dashboard.name));
          assert.ok(_.isString(dashboard.url));
        });
      }.check(done));
    });
  });


  /**
   *
   */
  describe("describe dashboard", function() {
    it("should return dashboard metadata", function(done) {
      conn.analytics.dashboard(dashboardId).describe(function(err, meta) {
        if (err) { throw err; }
        assert.ok(_.isObject(meta));
        assert.ok(_.isArray(meta.components));
        assert.ok(_.isObject(meta.layout));
        dashboardMetadata = _.clone(meta);
        dashboardFolderId = meta.folderId;
      }.check(done));
    });
  });

  /**
   *
   */
  describe("getting all dashboard components", function () {
    it("should return all components", function (done) {
      conn.analytics.dashboard(dashboardId).components(function (err, meta) {
        if (err) { throw err; }
        assert.equal(_.size(dashboardMetadata.components), _.size(meta.componentData));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("getting one dashboard component", function() {
    it("should return one component", function(done) {
      conn.analytics.dashboard(dashboardId).components(dashboardMetadata.components[0].id, function (err, meta) {
        if (err) { throw err; }
        assert.equal(1, _.size(meta.componentData));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("getting three dashboard components", function () {
    it("should return three components", function (done) {
      var ids = [
        dashboardMetadata.components[0].id,
        dashboardMetadata.components[1].id,
        dashboardMetadata.components[2].id,
      ];
      assert.equal(3, _.size(ids));
      conn.analytics.dashboard(dashboardId).components(ids, function (err, meta) {
        if (err) { throw err; }
        assert.equal(3, _.size(meta.componentData));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("status dashboard", function() {
    it("should return dashboard metadata", function(done) {
      conn.analytics.dashboard(dashboardId).status(function(err, meta) {
        if (err) { throw err; }
        assert.ok(_.isObject(meta));
        assert.ok(_.isArray(meta.componentStatus));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("clone dashboard", function() {
    it("should clone the dashboard", function(done) {
      conn.analytics.dashboard(dashboardId).clone({ name : "Lead List Dashboard Clone", folderId : dashboardFolderId }, function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result.attributes));
        cloneDashboardId = result.attributes.dashboardId;
        assert.ok(cloneDashboardId !== dashboardId);
        assert.ok(result.name === "Lead List Dashboard Clone");
      }.check(done));
    });
  });

  /**
   *
   */
  describe("refresh dashboard", function() {
    it("should refresh dashboard metadata", function(done) {
      // refresh cloned dashboard, in order to prevent frequent refresh error.
      conn.analytics.dashboard(cloneDashboardId).refresh(function(err, meta) {
        if (err) { throw err; }
        assert.ok(_.isObject(meta));
        assert.ok(_.isString(meta.statusUrl));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("destroy dashboard", function() {
    it("should destroy the dashboard", function(done) {
      conn.analytics.dashboard(cloneDashboardId).destroy(function(err, result) {
        if (err) { throw err; }
        conn.analytics.dashboard(cloneDashboardId).describe(function(desc_err) {
          assert.ok(_.isObject(desc_err));
          assert.ok(desc_err.name === "ENTITY_IS_DELETED");
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
