/*global describe, it, before, __dirname */
var testUtils = require('./helper/test-utils'),
    assert = testUtils.assert;

var async  = require('async'),
    _      = require('underscore'),
    fs     = require('fs'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

/**
 *
 */
describe("bulk", function() {

  this.timeout(20000); // set timeout to 20 sec.

  var conn = new testUtils.createConnection(config);

  /**
   *
   */
  before(function(done) {
    testUtils.establishConnection(conn, config, done);
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
if (testUtils.isNodeJS) {

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
      var file = __dirname + "/data/Account_export.csv";
      var fstream = fs.createWriteStream(file);
      var records = [];
      async.waterfall([
        function(next) {
          conn.bulk.query("SELECT Id, Name, NumberOfEmployees FROM Account")
            .on('record', function(rec) { records.push(rec); })
            .on('error', function(err) { next(err); })
            .on('end', function() { next(null, records); })
            .stream().pipe(fstream);
        }
      ], function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records) && records.length > 0);
        for (var i=0; i<records.length; i++) {
          var rec = records[i];
          assert.ok(_.isString(rec.Id));
          assert.ok(_.isString(rec.Name));
          assert.ok(_.isString(rec.NumberOfEmployees)); // no type conversion from CSV stream to record
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
    setTimeout(function() { done(); }, 2000);
  });

});
