/*global describe, it, before */
var assert = require('power-assert'),
    async  = require('async'),
    _      = require('underscore'),
    fs     = require('fs'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

/**
 *
 */
describe("analytics", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  var reportId;

  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { return done(err); }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
      conn.sobject('Report').findOne({ Name: 'Lead List Report'}, "Id").execute(function(err, res) {
        if (err) { return done(err); }
        if (!res) { return done(new Error("No Report Name 'Lead List Report' was found in the org.")); }
        reportId = res.Id;
        done();
      });
    });
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
        assert.ok(_.isObject(result.reportMetadata));
        assert.ok(result.reportMetadata.id === reportId);
      }.check(done));
    });
  });

});
