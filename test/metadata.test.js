/*global describe, it, before, after, __dirname */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('lodash/core'),
    fs     = require('fs'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);


/**
 *
 */
describe("metadata", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  // adjust poll timeout to test timeout.
  conn.metadata.pollTimeout = 40*1000;

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
  });

  /**
   * Synchronous CRUD call tests (create, read, update, upsert, rename, delete)
   */
  describe("synchronous metadata call sequence", function() {

    var metadata = [{
      fullName: 'JSforceTestObjectSync1__c',
      label: 'Test Object Sync 1',
      pluralLabel: 'Test Object Sync 1',
      nameField: {
        type: 'Text',
        label: 'Test Object Name'
      },
      deploymentStatus: 'Deployed',
      sharingModel: 'ReadWrite'
    }, {
      fullName: 'JSforceTestObjectSync2__c',
      label: 'Test Object Sync 2',
      pluralLabel: 'Test Object 2',
      nameField: {
        type: 'AutoNumber',
        label: 'Test Object #'
      },
      deploymentStatus: 'InDevelopment',
      sharingModel: 'Private'
    }];
    var fullNames = _.map(metadata, function(meta) { return meta.fullName; });
    var rmetadata = null;

    /**
     *
     */
    describe("create metadata synchronously", function() {
      it("should create custom objects", function(done) {
        conn.metadata.create('CustomObject', metadata, function(err, results) {
          if (err) { throw err; }
          assert.ok(_.isArray(results));
          assert.ok(results.length === metadata.length);
          _.forEach(results, function(result) {
            assert.ok(result.success === true);
            assert.ok(_.isString(result.fullName));
          });
        }.check(done));
      });
    });

    /**
     *
     */
    describe("read metadata synchronously", function() {
      it("should read created custom objects metadata", function(done) {
        conn.metadata.read('CustomObject', fullNames, function(err, results) {
          if (err) { throw err; }
          assert.ok(_.isArray(results));
          assert.ok(results.length === fullNames.length);
          _.forEach(results, function(result) {
            assert.ok(_.isString(result.fullName));
            assert.ok(result.nameField);
            assert.ok(_.isString(result.nameField.label));
          });
          rmetadata = results;
        }.check(done));
      });
    });

    /**
     *
     */
    describe("update metadata synchronously", function() {
      it("should update custom objects", function(done) {
        rmetadata[0].label = 'Updated Test Object Sync 2';
        rmetadata[1].deploymentStatus = 'Deployed';
        conn.metadata.update('CustomObject', rmetadata, function(err, results) {
          if (err) { throw err; }
          assert.ok(_.isArray(results));
          assert.ok(results.length === fullNames.length);
          _.forEach(results, function(result) {
            assert.ok(result.success === true);
            assert.ok(_.isString(result.fullName));
          });
          rmetadata = results;
        }.check(done));
      });
    });

    /**
     *
     */
    describe("upsert metadata synchronously", function() {
      it("should upsert custom objects", function(done) {
        var umetadata = [{
          fullName: 'JSforceTestObjectSync2__c',
          label: 'Upserted Object Sync 2',
          pluralLabel: 'Upserted Object Sync 2',
          nameField: {
            type: 'Text',
            label: 'Test Object Name'
          },
          deploymentStatus: 'Deployed',
          sharingModel: 'ReadWrite'
        }, {
          fullName: 'JSforceTestObjectSync3__c',
          label: 'Upserted Object Sync 3',
          pluralLabel: 'Upserted Object Sync 3',
          nameField: {
            type: 'Text',
            label: 'Test Object Name'
          },
          deploymentStatus: 'Deployed',
          sharingModel: 'ReadWrite'
        }];
        conn.metadata.upsert('CustomObject', umetadata, function(err, results) {
          if (err) { throw err; }
          assert.ok(_.isArray(results));
          assert.ok(results.length === umetadata.length);
          _.forEach(results, function(result, i) {
            assert.ok(result.success === true);
            assert.ok(result.created === (result.fullName === 'JSforceTestObjectSync3__c' ? true : false));
            assert.ok(result.fullName === umetadata[i].fullName);
          });
        }.check(done));
      });
    });

    /**
     *
     */
    describe("rename metadata synchronously", function() {
      it("should rename a custom object", function(done) {
        var oldName = fullNames[0], newName = oldName.replace(/__c$/, 'Updated__c');
        // Rename operation is not working before API version 35.0
        // because of the "enableSearch" property introduced in API 35.0.
        var origVersion = conn.version;
        if (parseFloat(conn.version) < 35) {
          conn.version = '35.0';
        }
        var _done = function() {
          conn.version = origVersion;
          return done.apply(this, arguments);
        };
        conn.metadata.rename('CustomObject', oldName, newName).then(function(result) {
          assert.ok(result.success === true);
          assert.ok(_.isString(result.fullName));
          assert.ok(result.fullName === oldName);
          return conn.metadata.read('CustomObject', newName);
        }).then(function(result) {
          assert.ok(_.isString(result.fullName));
          assert.ok(result.fullName === newName);
        }).then(_done, _done);
      });
    });

    /**
     *
     */
    describe("list metadata synchronously", function() {
      it("should list custom objects", function(done) {
        conn.metadata.list({ type: 'CustomObject' }, function(err, results) {
          if (err) { throw err; }
          assert.ok(_.isArray(results));
          _.forEach(results, function(result) {
            assert.ok(result.type === 'CustomObject');
            assert.ok(_.isString(result.id));
            assert.ok(_.isString(result.fullName));
          });
          fullNames = results.filter(function(m) {
            return m.fullName.match(/^JSforceTestObject.+__c$/);
          }).map(function(m) {
            return m.fullName;
          });
        }.check(done));
      });
    });

    /**
     *
     */
    describe("delete metadata synchronously", function() {
      it("should delete custom objects", function(done) {
        conn.metadata.delete('CustomObject', fullNames, function(err, results) {
          if (err) { throw err; }
          assert.ok(_.isArray(results));
          assert.ok(results.length === fullNames.length);
          _.forEach(results, function(result) {
            assert.ok(result.success === true);
            assert.ok(_.isString(result.fullName));
          });
        }.check(done));
      });
    });

  }); // end of synchronous call tests


if (TestEnv.isNodeJS) {

  /**
   *
   */
  describe("deploy metadata in packaged file", function() {
    it("should deploy package", function(done) {
      var zipStream = fs.createReadStream(__dirname + "/data/MyPackage.zip");
      conn.metadata.deploy(zipStream, { testLevel: 'RunSpecifiedTests', runTests: [ 'MyApexTriggerTest' ] }).complete(function(err, result) {
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

}

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


/*------------------------------------------------------------------------*/

  describe("metadata API session refresh", function() {
    it("should list metadata even if the session has been expired", function(done) {
      var conn2 = new sf.Connection({
        instanceUrl: conn.instanceUrl,
        accessToken: 'invalid_token',
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        refreshFn: function(c, callback) {
          setTimeout(function() {
            callback(null, conn.accessToken);
          }, 500);
        }
      });
      conn2.metadata.list({ type: 'CustomObject' }, function(err, results) {
        if (err) { throw err; }
        assert.ok(_.isArray(results));
      }.check(done));
    });
  });

/*------------------------------------------------------------------------*/

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
