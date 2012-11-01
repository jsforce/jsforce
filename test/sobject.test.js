var vows   = require('vows'),
    assert = require('assert'),
    async  = require('async'),
    sf     = require('../lib/salesforce'),
    SObject = require("../lib/sobject"),
    config = require('./config/salesforce');

var conn = new sf.Connection({ logLevel : config.logLevel });
var context = {};
var Account;

vows.describe("sobject").addBatch({
  "login" : {
    topic : function() {
      conn.login(config.username, config.password, this.callback);
    }, 
    "done" : function() { 
      assert.isString(conn.accessToken);
    }
  }

}).addBatch({

  "create Account sobject" : {
    topic : conn.sobject("Account"),
    "should get SObject instance" : function(_Account) {
      assert(_Account instanceof SObject);
      Account = _Account;
    }
  }

}).addBatch({

  "find records" : {
    topic : function() {
      Account.find().run(this.callback);
    },
    "should return records" : function (records) {
      assert.isArray(records);
    }
  },

  "find records (with direct callback)" : {
    topic : function() {
      Account.find({}, { Name : 1 }, this.callback);
    },
    "should return records" : function (records) {
      assert.isArray(records);
      context.acc = records[0]; // keep sample account record
    }
  }

}).addBatch({

  "find records with conditions" : {
    topic : function() {
      var likeStr = context.acc.Name[0] + "%";
      Account.find({ Name : { $like : likeStr } }, { Name : 1 },  this.callback);
    },
    "should return records" : function (records) {
      assert.isArray(records);
      assert.greater(records.length, 0);
    }
  },

  "find one record with conditions" : {
    topic : function() {
      Account.findOne({ Id : context.acc.Id }, this.callback);
    },
    "should return records" : function (record) {
      assert.isObject(record);
      assert.isString(record.Id);
    }
  },

  "count records with conditions" : {
    topic : function() {
      var likeStr = context.acc.Name[0] + "%";
      Account.count({ Name : { $like : likeStr } }, this.callback);
    },
    "should return total size count" : function (count) {
      assert.isNumber(count);
      assert.greater(count, 0);
    }
  }

}).export(module);

