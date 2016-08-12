/*global describe, it, before, __dirname */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var async  = require('async'),
    _      = require('lodash/core'),
    fs     = require('fs'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("bulk", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  // adjust poll timeout to test timeout.
  conn.bulk.pollTimeout = 40*1000;

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
  describe("bulk insert records", function() {
    it("should return result status", function(done) {
      var records = [];
      for (var i=0; i<200; i++) {
        records.push({
          Name: 'Bulk Account #'+(i+1),
          NumberOfEmployees: 300 * (i+1)
        });
      }
      records.push({ BillingState: 'CA' }); // should raise error
      conn.bulk.load("Account", "insert", records, function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        var ret;
        for (var i=0; i<200; i++) {
          ret = rets[i];
          assert.ok(_.isString(ret.id));
          assert.ok(ret.success === true);
        }
        ret = rets[200];
        assert.ok(_.isNull(ret.id));
        assert.ok(ret.success === false);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("bulk update", function() {
    it("should return updated status", function(done) {
      async.waterfall([
        function(next) {
          conn.sobject('Account')
              .find({ Name : { $like : 'Bulk Account%' }}, { Id: 1, Name : 1 })
              .execute(next);
        },
        function(records, next) {
          records = records.map(function(rec) {
            rec.Name = rec.Name + ' (Updated)';
            return rec;
          });
          conn.bulk.load('Account', 'update', records, next);
        }
      ], function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        var ret;
        for (var i=0; i<rets.length; i++) {
          ret = rets[i];
          assert.ok(_.isString(ret.id));
          assert.ok(ret.success === true);
        }
      }.check(done));
    });

    it("should fail when no input is given", function(done) {
      conn.bulk.load('Account', 'update', [], function(err, rets) {
        assert.ok(err);
        assert.ok(err.name === 'ClientInputError');
      }.check(done));
    });

  });

  /**
   *
   */
  describe("bulk delete", function() {
    it("should return deleted status", function(done) {
      async.waterfall([
        function(next) {
          conn.sobject('Account')
              .find({ Name : { $like : 'Bulk Account%' }})
              .execute(next);
        },
        function(records, next) {
          conn.bulk.load('Account', 'delete', records, next);
        }
      ], function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        for (var i=0; i<rets.length; i++) {
          var ret = rets[i];
          assert.ok(_.isString(ret.id));
          assert.ok(ret.success === true);
        }
      }.check(done));
    });

    it("should fail when no input is given", function(done) {
      conn.bulk.load('Account', 'delete', [], function(err, rets) {
        assert.ok(err);
        assert.ok(err.name === 'ClientInputError');
      }.check(done));
    });

  });

/*------------------------------------------------------------------------*/
if (TestEnv.isNodeJS) {

  /**
   *
   */
  describe("bulk insert from file", function() {
    it("should return inserted results", function(done) {
      var fstream = fs.createReadStream(__dirname + "/data/Account.csv");
      var batch = conn.bulk.load("Account", "insert");
      batch.on('response', function(results) { next(null, results); });
      batch.on('error', function(err) { next(err); });
      fstream.pipe(batch.stream());
      var next = function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        var ret;
        for (var i=0; i<rets.length; i++) {
          ret = rets[i];
          assert.ok(_.isString(ret.id));
          assert.ok(ret.success === true);
        }
      }.check(done);
    });
  });

  /**
   *
   */
  describe("bulk delete from file", function() {
    it("should return deleted results", function(done) {
      var batch;
      async.waterfall([
        function(next) {
          conn.sobject('Account').find({ Name : { $like : 'Bulk Account%' }}, next);
        },
        function(records, next) {
          var data = "Id\n";
          for (var i=0; i<records.length; i++) {
            data += records[i].Id + "\n";
          }
          fs.writeFile(__dirname + "/data/Account_delete.csv", data, next);
        },
        function(next) {
          var fstream = fs.createReadStream(__dirname + "/data/Account_delete.csv");
          batch = conn.bulk.load("Account", "delete");
          async.parallel([
            function(cb) {
              batch.on('response', function(rets) { cb(null, rets); });
              batch.on('error', function(err) { cb(err); });
            },
            function(cb) {
              batch.job.on('close', function() { cb(); }); // await job close
            }
          ], function(err, results) {
            next(err, results && results[0]);
          });
          fstream.pipe(batch.stream());
        }
      ], function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        for (var i=0; i<rets.length; i++) {
          var ret = rets[i];
          assert.ok(_.isString(ret.id));
          assert.ok(ret.success === true);
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("bulk query and output to file", function() {
    it("should get a record stream and file output", function(done) {
      var file = __dirname + "/data/BulkQuery_export.csv";
      var fstream = fs.createWriteStream(file);
      var records = [];
      var count = -1;
      async.waterfall([
        function(next) {
          conn.sobject(config.bigTable).count({}, next);
        },
        function(_count, next) {
          count = _count;
          conn.bulk.query("SELECT Id, Name FROM " + config.bigTable)
            .on('record', function(rec) { records.push(rec); })
            .on('error', function(err) { next(err); })
            .stream().pipe(fstream)
            .on('finish', function() { next(null, records); });
        }
      ], function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records) && records.length === count);
        for (var i=0; i<records.length; i++) {
          var rec = records[i];
          assert.ok(_.isString(rec.Id));
          assert.ok(_.isString(rec.Name));
        }
        var data = fs.readFileSync(file, "utf-8");
        assert.ok(data);
        var lines = data.replace(/[\r\n]+$/, '').split(/[\r\n]/);
        assert.ok(lines.length === records.length + 1);
      }.check(done));
    });
  });
}

/*------------------------------------------------------------------------*/

  describe("bulk API session refresh", function() {
    var recs = null;

    before(function(done) {
      var records = Array(101).join('_').split('').map(function(a, i) {
        return { Name: 'Session Expiry Test #'+i };
      });
      conn.bulk.load('Account', 'insert', records, function(err, rets) {
        if (err) { throw err; }
        recs = rets.map(function(r) { return { Id: r.id }; });
      }.check(done));
    });

    it("should delete records even if the session has been expired", function(done) {
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
      conn2.bulk.load('Account', 'delete', recs, function(err, rets) {
        if (err) { throw err; }
        assert.ok(_.isArray(rets));
        assert.ok(rets.length === 100);
        for (var i=0; i<rets.length; i++) {
          var ret = rets[i];
          assert.ok(ret.success);
        }
      }.check(done));
    });

    it("should raise error when no refresh fn is found", function(done) {
      var conn3 = new sf.Connection({
        instanceUrl: conn.instanceUrl,
        accessToken: 'invalid_token',
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl
      });
      var records = [ { Name: 'Impossible Bulk Account #1' } ];
      conn3.bulk.load('Account', 'insert', records, function(err, rets) {
        assert(err && err.name === 'InvalidSessionId');
      }.check(done));
    });
  });

/*------------------------------------------------------------------------*/

  /**
   *
   */
  describe("bulk update using Query#update", function() {
    before(function(done) {
      var records = [];
      for (var i=0; i<200; i++) {
        records.push({
          Name: 'New Bulk Account #'+(i+1),
          BillingState: 'CA',
          NumberOfEmployees: 300 * (i+1)
        });
      }
      conn.bulk.load("Account", "insert", records, done);
    });

    it("should return updated status", function(done) {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .update({
            Name : '${Name} (Updated)',
            BillingState: null
          }, function(err, rets) {
            if (err) { throw err; }
            assert.ok(_.isArray(rets));
            assert.ok(rets.length === 200);
            for (var i=0; i<rets.length; i++) {
              var ret = rets[i];
              assert.ok(_.isString(ret.id));
              assert.ok(ret.success === true);
            }
          }.check(done));
    });

    describe("then query updated records", function() {
      it("should return updated records", function(done) {
        conn.sobject('Account')
            .find({ Name : { $like : 'New Bulk Account%' }}, 'Id, Name, BillingState', function(err, records) {
              if (err) { throw err; }
              assert.ok(_.isArray(records));
              assert.ok(records.length === 200);
              var record;
              for (var i=0; i<200; i++) {
                record = records[i];
                assert.ok(_.isString(record.Id));
                assert.ok(/\(Updated\)$/.test(record.Name));
                assert.ok(record.BillingState === null);
              }
            }.check(done));
      });
    });
  });

  describe("bulk update using Query#update, for unmatching query", function() {
    it("should return empty array records", function(done) {
      conn.sobject('Account')
          .find({ CreatedDate : { $lt : new sf.Date('1970-01-01T00:00:00Z') }}) // should not match any records
          .update({
            Name: '${Name} (Updated)',
            BillingState: null
          }, function(err, rets) {
            if (err) { throw err; }
            assert.ok(_.isArray(rets));
            assert.ok(rets.length === 0);
          }.check(done));
    });
  });

  /**
   *
   */
  describe("bulk delete using Query#destroy", function() {
    it("should return deleted status", function(done) {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .destroy(function(err, rets) {
            if (err) { throw err; }
            assert.ok(_.isArray(rets));
            assert.ok(rets.length === 200);
            for (var i=0; i<rets.length; i++) {
              var ret = rets[i];
              assert.ok(_.isString(ret.id));
              assert.ok(ret.success === true);
            }
          }.check(done));
    });
  });

  describe("bulk delete using Query#destroy, for unmatching query", function() {
    it("should return empty array records", function(done) {
      conn.sobject('Account')
          .find({ CreatedDate : { $lt : new sf.Date('1970-01-01T00:00:00Z') }})
          .destroy(function(err, rets) {
            if (err) { throw err; }
            assert.ok(_.isArray(rets));
            assert.ok(rets.length === 0);
          }.check(done));
    });
  });

  // graceful shutdown to wait remaining jobs to close...
  after(function(done) {
    setTimeout(function() {
      testEnv.closeConnection(conn, done);
    }, 2000);
  });

});
