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
describe("bulk", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { throw err; }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
      done();
    });
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
  });

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
  describe("bulk update using Query#update", function() {
    before(function(done) {
      var records = [];
      for (var i=0; i<200; i++) {
        records.push({
          Name: 'New Bulk Account #'+(i+1),
          NumberOfEmployees: 300 * (i+1) 
        });
      }
      conn.bulk.load("Account", "insert", records, done);
    });

    it("should return updated status", function(done) {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .update({ Name : '${Name} (Updated)' }, function(err, rets) {
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
            .find({ Name : { $like : 'New Bulk Account%' }}, 'Id, Name', function(err, records) {
              if (err) { throw err; }
              assert.ok(_.isArray(records));
              assert.ok(records.length === 200);
              var record;
              for (var i=0; i<200; i++) {
                record = records[i];
                assert.ok(_.isString(record.Id));
                assert.ok(/\(Updated\)$/.test(record.Name));
              }
            }.check(done));
      });
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

});
