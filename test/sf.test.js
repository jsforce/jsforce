var vows   = require('vows')
  , assert = require('assert')
  , sf     = require('../lib/sf')
  , config = require('./config/sf')
  ;

var conn = new sf.Connection({});

vows.describe("salesforce").addBatch({
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
      conn.query("SELECT Id, Name FROM Account", this.callback);
    },
    "should return records" : function (res) {
      assert.isNumber(res.totalSize);
    }
  },

  "query big tables" : {
    topic : function() {
      var self = this;
      var records = [];
      var query = conn.query("SELECT Id, Name FROM " + (config.bigTable || 'Account'));
      query.on('record', function(record, i, cnt){
        records.push(record); 
      });
      query.on('end', function(fetched) {
        self.callback(null, { query : query, records : records });
      });
      query.on('error', function(err) {
        self.callback(err);
      });
      query.autoFetch = true;
      query.run();
    },

    "should scan all tables" : function(result) {
      assert.ok(result.query.totalFetched === result.records.length);
      assert.ok(result.query.totalSize >= result.query.totalFetched);
    }
  }


}).addBatch({

  "create account" : {
    topic : function() {
      conn.sobject('Account').create({ Name : 'Hello' }, this.callback);
    },
    "should return created obj" : function(ret) {
      assert.ok(ret.success);
      assert.isString(ret.id);
    },

  ", then retrieve account" : {
    topic : function(ret) {
      conn.sobject('Account').retrieve(ret.id, this.callback);
    },
    "should return a record" : function(record) {
      assert.isString(record.Id);
      assert.equal(record.Name, 'Hello');
    },

  ", then update account" : {
    topic : function(account) {
      conn.sobject('Account').update({ Id : account.Id, Name : "Hello2" }, this.callback);
    },
    "should update successfully" : function(ret) {
      assert.ok(ret.success);
    },

  ", then retrieve account" : {
    topic : function(ret) {
      conn.sobject('Account').retrieve(ret.id, this.callback);
    },
    "sholuld return updated account object" : function(account) {
      assert.equal(account.Name, 'Hello2');
    },

  ", then delete account" : {
    topic : function(account) {
      conn.sobject('Account').del(account.Id, this.callback);
    },
    "should delete successfully" : function(ret) {
      assert.ok(ret.success);
    },

  ", then retrieve account" : {
    topic : function(ret) {
      conn.sobject('Account').retrieve(ret.id, this.callback);
    },
    "should not return any record" : function(err, record) {
      assert.isNotNull(err);
      assert.equal(err.errorCode, 'NOT_FOUND');
    }

  }}}}}}

}).export(module);

