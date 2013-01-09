var vows   = require('vows'),
    assert = require('assert'),
    async  = require('async'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

var conn = new sf.Connection({ logLevel : config.logLevel });
var context = {};

vows.describe("bulk").addBatch({
  "login" : {
    topic : function() {
      conn.login(config.username, config.password, this.callback);
    }, 
    "done" : function() { 
      assert.isString(conn.accessToken);
    }
  }

}).addBatch({

  "bulkload records" : {
    topic : function() {
      var records = [
        { Name: 'Account #1', NumberOfEmployees: 300 },
        { Name: 'Account #2', NumberOfEmployees: 400 },
        { Name: 'Account #3', NumberOfEmployees: 100 },
        { Name: 'Account #4' },
        { BillingState: 'CA' }
      ];
      conn.bulkload("Account", "insert", records, this.callback);
    },
    "should return result status" : function (rets) {
      assert.isArray(rets);
      console.log(rets);
      for (var i=0; i<rets.length; i++) {
        var ret = rets[i];
        assert.isString(ret.Id);
      }
    }
  }


}).export(module);
