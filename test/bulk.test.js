var vows   = require('vows'),
    assert = require('assert'),
    async  = require('async'),
    fs     = require('fs'),
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
      conn.bulk.load("Account", "insert", records, this.callback);
    },
    "should return result status" : function (rets) {
      assert.isArray(rets);
      var ret;
      for (var i=0; i<200; i++) {
        ret = rets[i];
        assert.isString(ret.id);
        assert.equal(ret.success, true);
      }
      ret = rets[200];
      assert.isNull(ret.id);
      assert.equal(ret.success, false);
    },


  "then bulk update" : {
    topic: function() {
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
      ], this.callback);
    },

    "should return updated status" : function (rets) {
      assert.isArray(rets);
      var ret;
      for (var i=0; i<rets.length; i++) {
        ret = rets[i];
        assert.isString(ret.id);
        assert.equal(ret.success, true);
      }
    },

  "then bulk delete" : {
    topic: function() {
      async.waterfall([
        function(next) {
          conn.sobject('Account')
              .find({ Name : { $like : 'Bulk Account%' }})
              .execute(next);
        },
        function(records, next) {
          conn.bulk.load('Account', 'delete', records, next);
        }
      ], this.callback);
    },
    "should return deleted status" : function (rets) {
      assert.isArray(rets);
      for (var i=0; i<rets.length; i++) {
        var ret = rets[i];
        assert.isString(ret.id);
        assert.equal(ret.success, true);
      }
    }

  }}}


}).addBatch({

  "bulk insert from file" : {
    topic: function() {
      var self = this;
      var fstream = fs.createReadStream(__dirname + "/data/Account.csv");
      var batch = conn.bulk.load("Account", "insert");
      batch.on('response', function(results) { self.callback(null, results); });
      batch.on('error', function(err) { self.callback(err); });
      fstream.pipe(batch.stream());
    },
    "should return inserted results" : function(rets) {
      assert.isArray(rets);
      var ret;
      for (var i=0; i<rets.length; i++) {
        ret = rets[i];
        assert.isString(ret.id);
        assert.equal(ret.success, true);
      }
    },

  "then bulk delete from file" : {
    topic: function() {
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
      ], this.callback);
    },

    "should return deleted results": function(rets) {
      assert.isArray(rets);
      for (var i=0; i<rets.length; i++) {
        var ret = rets[i];
        assert.isString(ret.id);
        assert.equal(ret.success, true);
      }
    }

  }}
  
}).addBatch({

  "bulk insert records" : {
    topic : function() {
      var records = [];
      for (var i=0; i<200; i++) {
        records.push({
          Name: 'New Bulk Account #'+(i+1),
          NumberOfEmployees: 300 * (i+1) 
        });
      }
      conn.bulk.load("Account", "insert", records, this.callback);
    },
    "should return result status" : function (rets) {
      assert.isArray(rets);
      var ret;
      for (var i=0; i<200; i++) {
        ret = rets[i];
        assert.isString(ret.id);
        assert.equal(ret.success, true);
      }
    },

  "then bulk update using Query#update" : {
    topic: function() {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .update({ Name : '${Name} (Updated)' }, this.callback);
    },
    "should return updated status" : function (rets) {
      assert.isArray(rets);
      assert.equal(rets.length, 200);
      for (var i=0; i<rets.length; i++) {
        var ret = rets[i];
        assert.isString(ret.id);
        assert.equal(ret.success, true);
      }
    },

  "then query updated records" : {
    topic : function() {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }}, 'Id, Name', this.callback);
    },
    "should return updated records" : function (records) {
      assert.isArray(records);
      assert.equal(records.length, 200);
      var record;
      for (var i=0; i<200; i++) {
        record = records[i];
        assert.isString(record.Id);
        assert.ok(/\(Updated\)$/.test(record.Name));
      }
    },

  "then bulk delete records using Query#destroy" : {
    topic: function() {
      conn.sobject('Account')
          .find({ Name : { $like : 'New Bulk Account%' }})
          .destroy(this.callback);
    },
    "should return deleted status" : function (rets) {
      assert.isArray(rets);
      assert.equal(rets.length, 200);
      for (var i=0; i<rets.length; i++) {
        var ret = rets[i];
        assert.isString(ret.id);
        assert.equal(true, ret.success);
      }
    }

  }}}}

}).export(module);
