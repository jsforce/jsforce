/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('underscore'),
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

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
