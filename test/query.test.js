var vows   = require('vows'),
    assert = require('assert'),
    fs     = require('fs'),
    async  = require('async'),
    events = require('events'),
    stream = require('stream'),
    Stream = stream.Stream,
    querystring = require('querystring'),
    sf     = require('../lib/salesforce'),
    RecordStream = require('../lib/record-stream'),
    config = require('./config/salesforce');


var conn = new sf.Connection({ logLevel : config.logLevel });
var context = {};

vows.describe("query").addBatch({
  "login" : {
    topic : function() {
      conn.login(config.username, config.password, this.callback);
    }, 
    "done" : function() { 
      assert.isString(conn.accessToken);
    }
  }

}).addBatch({


  "query accounts" : {
    topic : function() {
      var query = conn.query("SELECT Id, Name FROM Account");
      query.run(this.callback);
    },
    "should return records" : function (res) {
      assert.isNumber(res.totalSize);
    }
  },


  "query big tables without autoFetch" : {
    topic : function() {
      var self = this;
      var records = [];
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'));
      query.on('record', function(record, i, cnt){
        records.push(record); 
      });
      query.on('end', function() {
        self.callback(null, { query : query, records : records });
      });
      query.on('error', function(err) {
        self.callback(err);
      });
      query.run({ autoFetch : false });
    },

    "should scan records in one query fetch" : function(result) {
      assert.ok(result.query.totalFetched === result.records.length);
      assert.ok(result.query.totalSize > 2000 ? 
                result.query.totalFetched === 2000 : 
                result.query.totalFetched === result.query.totalSize
      );
    }
  },


  "query big tables with autoFetch" : {
    topic : function() {
      var self = this;
      var records = [];
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'));
      query.on('record', function(record) {
             records.push(record); 
           })
           .on('error', function(err) {
             self.callback(err);
           })
           .on('end', function() {
             self.callback(null, { query : query, records : records });
           })
           .run({ autoFetch : true, maxFetch : 5000 });
    },

    "should scan records up to maxFetch num" : function(result) {
      assert.ok(result.query.totalFetched === result.records.length);
      assert.ok(result.query.totalSize > 5000 ? 
                result.query.totalFetched === 5000 : 
                result.query.totalFetched === result.query.totalSize
      );
    }
  },



  "query big tables by piping randomly-waiting output record stream object" : {
    topic : function() {
      var self = this;
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
        self.callback(null, { query : query, records : records });
      };
      query.pipe(outStream);
      query.on("error", function(err) { self.callback(err); });
    },


    "should scan records via stream up to maxFetch num" : function(result) {
      assert.ok(result.query.totalFetched === result.records.length);
      assert.ok(result.query.totalSize > 5000 ? 
                result.query.totalFetched === 5000 : 
                result.query.totalFetched === result.query.totalSize
      );
    }

  }

}).addBatch({

  "query table and convert to readable stream": {
    topic : function() {
      var self = this;
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
        self.callback(null, result);
      };
      query.stream().pipe(csvOut);
    },

    "should get CSV text" : function(csv) {
      assert.isString(csv);
      var header = csv.split("\n")[0];
      assert.equal(header, "Id,Name");
    }

  }



}).export(module);

