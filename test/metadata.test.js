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
describe("metadata", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { return done(err); }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
      done();
    });
  });

  /**
   *
   */
  describe("create metadata", function() {
    var asyncResults;

    it("should create custom objects", function(done) {
      var metadata = [{
        fullName: 'TestObject1__c',
        label: 'Test Object 1',
        pluralLabel: 'Test Object 1',
        nameField: {
          type: 'Text',
          label: 'Test Object Name'
        },
        deploymentStatus: 'Deployed',
        sharingModel: 'ReadWrite'
      }, {
        fullName: 'TestObject2__c',
        label: 'Test Object 2',
        pluralLabel: 'Test Object 2',
        nameField: {
          type: 'AutoNumber',
          label: 'Test Object #'
        },
        deploymentStatus: 'InDevelopment',
        sharingModel: 'Private'
      }];
      conn.metadata.create('CustomObject', metadata, function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
        assert.ok(results.length === metadata.length);
        _.forEach(results, function(result) {
          assert.ok(_.isString(result.id));
        });
        asyncResults = results;
      }.check(done));
    });

    it("should get finished status in completion", function(done) {
      var ids = _.map(asyncResults, function(ar){ return ar.id; });
      conn.metadata.checkStatus(ids).complete(function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
        assert.ok(results.length === ids.length);
        _.forEach(results, function(result) {
          assert.ok(result.done === true);
          assert.ok(result.state === 'Completed');
        });
      }.check(done));
    });

    it("should create custom fields", function(done) {
      var metadata = [{
        type: 'Text',
        fullName: 'TestObject1__c.TextField__c',
        label: 'Text #1',
        length: 50
      }, {
        type: 'TextArea',
        fullName: 'TestObject1__c.TextAreaField__c',
        label: 'Text Area #1'
      }, {
        type: 'Number',
        fullName: 'TestObject1__c.NumberField__c',
        label: 'Number #1',
        precision: 18,
        scale: 2
      }, {
        type: 'AutoNumber',
        fullName: 'TestObject1__c.AutoNumberField__c',
        label: 'Auto Number #1'
      }];
      conn.metadata.create('CustomField', metadata).complete(function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
        assert.ok(results.length === metadata.length);
        _.forEach(results, function(result) {
          assert.ok(_.isString(result.id));
          assert.ok(result.done === true);
          assert.ok(result.state === "Completed");
        });
      }.check(done));
    });

  });

  /**
   *
   */
  describe("update metadata", function() {
    it("should update custom fields", function(done) {
      var updateMetadata = [{
        currentName: 'TestObject1__c.AutoNumberField__c',
        metadata: {
          type: 'Text',
          fullName: 'TestObject2__c.AutoNumberField2__c',
          label: 'Auto Number #2',
          length: 50
        }
      }];
      conn.metadata.update('CustomField', updateMetadata).complete(function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
        assert.ok(results.length === updateMetadata.length);
        _.forEach(results, function(result) {
          assert.ok(_.isString(result.id));
          assert.ok(result.done === true);
          assert.ok(result.state === "Completed");
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("delete metadata", function() {
    it("should delete custom objects", function(done) {
      var metadata = [{
        fullName: 'TestObject1__c',
      }, {
        fullName: 'TestObject2__c',
      }];
      conn.metadata.delete('CustomObject', metadata).complete(function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
        assert.ok(results.length === metadata.length);
        _.forEach(results, function(result) {
          assert.ok(_.isString(result.id));
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("deploy metadata in packaged file", function() {
    it("should deploy package", function(done) {
      var zipStream = fs.createReadStream(__dirname + "/data/MyPackage.zip");
      conn.metadata.deploy(zipStream, { runTests: [ 'MyApexTriggerTest' ] }).complete(function(err, result) {
        if (err) { throw err; }
        assert.ok(result.done === true);
        assert.ok(result.success === true);
        assert.ok(result.status === 'Succeeded');
        assert.ok(result.numberComponentErrors === 0);
        assert.ok(result.numberComponentsDeployed === result.numberComponentsTotal);
        assert.ok(result.numberTestsCompleted === 1);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("retrieve metadata in packaged file", function() {
    it("should retrieve package", function(done) {
      var bufs = [];
      conn.metadata.retrieve({ packageNames: [ 'My Test Package' ] })
                   .stream()
                   .on('data', function(d) {
                     bufs.push(d);
                   })
                   .on('end', function() {
                     assert.ok(bufs.length > 0);
                     done();
                   })
                   .on('error', function(err) {
                     done(err);
                   });
    });
  });

});
