/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('lodash/core'),
    fs     = require('fs'),
    stream = require('readable-stream'),
    through2 = require('through2'),
    querystring = require('querystring'),
    sf     = require('../lib/jsforce'),
    RecordStream = require('../lib/record-stream'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("query", function() {

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
  describe("query accounts", function() {
    it("should return records", function(done) {
      var query = conn.query("SELECT Id, Name FROM Account");
      query.run(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isNumber(result.totalSize));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("query accounts with scanAll option", function() {
    before(function(done) {
      conn.sobject('Account').create({ Name: 'Deleting Account #1'}, function(err, ret) {
        if (err) { return done(err); }
        conn.sobject('Account').record(ret.id).destroy(done);
      });
    });

    it("should return records", function(done) {
      var query = conn.query("SELECT Id, IsDeleted, Name FROM Account WHERE IsDeleted = true");
      query.run({ scanAll: true }, function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isNumber(result.totalSize));
        assert.ok(result.totalSize > 0);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("query big table and execute queryMore", function() {
    it("should fetch all records", function(done) {
      var records = [];
      var handleResult = function(err, res) {
        if (err) { callback(err); }
        records.push.apply(records, res.records);
        if (res.done) {
          callback(null, { result: res, records: records });
        } else {
          query = conn.queryMore(res.nextRecordsUrl, handleResult);
        }
      };
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'), handleResult);
      var callback = function(err, result) {
        if (err) { throw err; }
        assert.equal(result.records.length, result.result.totalSize);
      }.check(done);
    });
  });

  /**
   *
   */
  describe("query big tables without autoFetch", function() {
    it("should scan records in one query fetch", function(done) {
      var records = [];
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'));
      query.on('record', function(record, i, cnt){
        records.push(record);
      });
      query.on('end', function() {
        callback(null, { query : query, records : records });
      });
      query.on('error', function(err) {
        callback(err);
      });
      query.run({ autoFetch : false });
      var callback = function(err, result) {
        if (err) { throw err; }
        assert.ok(result.query.totalFetched === result.records.length);
        assert.ok(result.query.totalSize > 2000 ?
                  result.query.totalFetched === 2000 :
                  result.query.totalFetched === result.query.totalSize
        );
      }.check(done);
    });
  });

  /**
   *
   */
  describe("query big tables with autoFetch", function() {
    it("should scan records up to maxFetch num", function(done) {
      var records = [];
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'));
      query.on('record', function(record) {
             records.push(record);
           })
           .on('error', function(err) {
             callback(err);
           })
           .on('end', function() {
             callback(null, { query : query, records : records });
           })
           .run({ autoFetch : true, maxFetch : 5000 });
      var callback = function(err, result) {
        if (err) { throw err; }
        assert.ok(result.query.totalFetched === result.records.length);
        assert.ok(result.query.totalSize > 5000 ?
                  result.query.totalFetched === 5000 :
                  result.query.totalFetched === result.query.totalSize
        );
      }.check(done);
    });
  });

  /**
   *
   */
  describe("query big tables by piping randomly-waiting output record stream object", function() {
    it("should scan records via stream up to maxFetch num", function(done) {
      var records = [];
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'));
      var outStream = through2.obj(
        function transform(record, enc, next) {
          records.push(record);
          if (records.length % 100 === 0) {
            var waitTime = Math.floor(1000 * Math.random());
            setTimeout(function() { next(); }, waitTime);
          } else {
            next();
          }
        },
        function flush(done) {
          callback(null, { query : query, records : records });
          done();
        }
      );
      query.pipe(outStream);
      query.on("error", function(err) { callback(err); });

      var callback = function(err, result) {
        if (err) { throw err; }
        assert.ok(result.query.totalFetched === result.records.length);
        assert.ok(result.query.totalSize > 5000 ?
                  result.query.totalFetched === 5000 :
                  result.query.totalFetched === result.query.totalSize
        );
      }.check(done);
    });
  });

  /**
   *
   */
  describe("query table and convert to readable stream", function() {
    it("should get CSV text", function(done) {
      var query = conn.query("SELECT Id, Name FROM Account LIMIT 10");
      var csvOut = new stream.Writable();
      var result = '';
      csvOut._write = function(data, enc, next) {
        result += data.toString('utf8');
        next();
      };
      query.stream().pipe(csvOut).on('finish', function() {
        callback(null, result);
      });
      var callback = function(err, csv) {
        if (err) { throw err; }
        assert.ok(_.isString(csv));
        var header = csv.split('\n')[0];
        assert(header === "Id,Name");
      }.check(done);
    });
  });

  /**
   *
   */
  describe("explain query plan of soql query", function() {
    it("should get explain result", function(done) {
      var query = conn.query("SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 10");
      query.explain(function(err, result) {
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

/*------------------------------------------------------------------------*/
  // The num should be less than 200, not to fallback to bulk API
  var accountNum = 20;

  /**
   *
   */
  describe("update queried records using Query#update", function() {
    before(function(done) {
      var records = [];
      for (var i=0; i<accountNum; i++) {
        records.push({
          Name: 'New Bulk Account #'+(i+1),
          BillingState: 'CA',
          NumberOfEmployees: 300 * (i+1)
        });
      }
      conn.sobject("Account").create(records, done);
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
            assert.ok(rets.length === accountNum);
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
              assert.ok(records.length === accountNum);
              var record;
              for (var i=0; i<records.length; i++) {
                record = records[i];
                assert.ok(_.isString(record.Id));
                assert.ok(/\(Updated\)$/.test(record.Name));
                assert.ok(record.BillingState === null);
              }
            }.check(done));
      });
    });
  });

  describe("update queried records using Query#update, for unmatching query", function() {
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
  describe("delete queried records using Query#destroy", function() {
    it("should return deleted status", function(done) {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .destroy(function(err, rets) {
            if (err) { throw err; }
            assert.ok(_.isArray(rets));
            assert.ok(rets.length === accountNum);
            for (var i=0; i<rets.length; i++) {
              var ret = rets[i];
              assert.ok(_.isString(ret.id));
              assert.ok(ret.success === true);
            }
          }.check(done));
    });
  });

  describe("delete queried records using Query#destroy, for unmatching query", function() {
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

/*------------------------------------------------------------------------*/
  // The num is over 200, but not falling back to bulk API because `allowBulk` option is set to false.
  var massiveAccountNum = 300;

  /**
   *
   */
  describe("update queried records using Query#update, with allowBulk = false", function() {
    before(function(done) {
      var records = [];
      for (var i=0; i<massiveAccountNum; i++) {
        records.push({
          Name: 'New Bulk Account #'+(i+1),
          BillingState: 'CA',
          NumberOfEmployees: 300 * (i+1)
        });
      }
      conn.sobject("Account").create(records, { allowRecursive: true }, done);
    });

    it("should return updated status", function(done) {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .update({
            Name : '${Name} (Updated)',
            BillingState: null
          }, { allowBulk: false }, function(err, rets) {
            if (err) { throw err; }
            assert.ok(_.isArray(rets));
            assert.ok(rets.length === massiveAccountNum);
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
              assert.ok(records.length === massiveAccountNum);
              var record;
              for (var i=0; i<records.length; i++) {
                record = records[i];
                assert.ok(_.isString(record.Id));
                assert.ok(/\(Updated\)$/.test(record.Name));
                assert.ok(record.BillingState === null);
              }
            }.check(done));
      });
    });
  });

  /**
   *
   */
  describe("delete queried records using Query#destroy, with allowBulk = false", function() {
    it("should return deleted status", function(done) {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .destroy(function(err, rets) {
            if (err) { throw err; }
            assert.ok(_.isArray(rets));
            assert.ok(rets.length === massiveAccountNum);
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
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
