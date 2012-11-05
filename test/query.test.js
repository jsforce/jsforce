var vows   = require('vows'),
    assert = require('assert'),
    async  = require('async'),
    events = require('events'),
    querystring = require('querystring'),
    sf     = require('../lib/salesforce'),
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


  "query big tables by piping randomly-waiting send stream object" : {
    topic : function() {
      var self = this;
      var records = [];
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'));
      var sendstream = new events.EventEmitter();
      sendstream.sendable = true;
      sendstream.send = function(record) {
        records.push(record);
        if (records.length % 100 === 0) {
          sendstream.sendable = false;
          setTimeout(function() {
            sendstream.sendable = true;
            sendstream.emit('drain');
          }, 1000 * Math.random());
        }
        return sendstream.sendable;
      };
      sendstream.end = function() {
        self.callback(null, { query : query, records : records });
      };
      query.pipe(sendstream);
      query.resume();
    },


    "should scan records up to maxFetch num" : function(result) {
      assert.ok(result.query.totalFetched === result.records.length);
      assert.ok(result.query.totalSize > 5000 ? 
                result.query.totalFetched === 5000 : 
                result.query.totalFetched === result.query.totalSize
      );
    }

  }


}).export(module);

