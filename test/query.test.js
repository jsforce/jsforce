/*global describe, it, before */
var assert = require('power-assert'),
    _      = require('underscore'),
    fs     = require('fs'),
    stream = require('stream'),
    Stream = stream.Stream,
    querystring = require('querystring'),
    sf     = require('../lib/salesforce'),
    RecordStream = require('../lib/record-stream'),
    config = require('./config/salesforce');

/**
 *
 */
describe("query", function() { 

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
    describe("should scan records in one query fetch", function(done) {
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
      var outStream = new RecordStream();
      outStream.sendable = true;
      outStream.send = function(record) {
        records.push(record);
        if (records.length % 100 === 0) {
          outStream.sendable = false;
          setTimeout(function() {
            outStream.sendable = true;
            outStream.emit('drain');
          }, 1000 * Math.random());
        }
        return outStream.sendable;
      };
      outStream.end = function() {
        callback(null, { query : query, records : records });
      };
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
      var csvOut = new Stream();
      csvOut.writable = true;
      var result = '';
      csvOut.write = function(data) {
        result += data;
      };
      csvOut.end = function(data) {
        result += data;
        csvOut.writable = false;
        callback(null, result);
      };
      query.stream().pipe(csvOut);
      var callback = function(err, csv) {
        if (err) { throw err; }
        assert.ok(_.isString(csv));
        var header = csv.split("\n")[0];
        assert.equal(header, "Id,Name");
      }.check(done);
    });
  });

});

