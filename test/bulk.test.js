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

  "bulk insert records" : {
    topic : function() {
      var records = [];
      for (var i=0; i<200; i++) {
        records.push({
          Name: 'Bulk Account #'+(i+1),
          NumberOfEmployees: 300 * (i+1) 
        });
      }
      records.push({ BillingState: 'CA' }); // should raise error
      conn.bulkload("Account", "insert", records, this.callback);
    },
    "should return result status" : function (rets) {
      assert.isArray(rets);
      var ret;
      for (var i=0; i<200; i++) {
        ret = rets[i];
        assert.isString(ret.id);
        assert.equal(true, ret.success);
      }
      ret = rets[200];
      assert.isNull(ret.id);
      assert.equal(false, ret.success);
    },

  "then bulk update" : {
    topic: function() {
      conn.sobject('Account')
          .find({ Name : { $like : 'Bulk Account%' }}, { Id: 1, Name : 1 })
          .execute(this.callback);
    },
    "." : {
      topic: function(records) {
        records = records.map(function(rec) {
          rec.Name = rec.Name + ' (Updated)';
          return rec;
        });
        conn.bulkload('Account', 'update', records, this.callback);
      },
    "should return updated status" : function (rets) {
      assert.isArray(rets);
      var ret;
      for (var i=0; i<rets.length; i++) {
        ret = rets[i];
        assert.isString(ret.id);
        assert.equal(true, ret.success);
      }
    },

  "then bulk delete" : {
    topic: function() {
      conn.sobject('Account')
          .find({ Name : { $like : 'Bulk Account%' }})
          .execute(this.callback);
    },
    "." : {
      topic: function(records) {
        conn.bulkload('Account', 'delete', records, this.callback);
      },
    "should return deleted status" : function (rets) {
      assert.isArray(rets);
      var ret;
      for (var i=0; i<rets.length; i++) {
        ret = rets[i];
        assert.isString(ret.id);
        assert.equal(true, ret.success);
      }
    }

  }}}}}


}).export(module);
