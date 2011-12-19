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
    "then returns records" : function (res) {
      assert.isNumber(res.totalSize);
    }
  }

}).addBatch({

  "create account" : {
    topic : function() {
      conn.sobject('Account').create({ Name : 'Hello' }, this.callback);
    },
    "then returns created obj" : function(ret) {
      assert.ok(ret.success);
      assert.isString(ret.id);
    },

  "then update account" : {
    topic : function(ret) {
      conn.sobject('Account').update({ Id : ret.id, Name : "Hello2" }, this.callback);
    },
    "then successfully updates" : function(ret) {
      assert.ok(ret.success);
    },

  "then retrieve account" : {
    topic : function(ret) {
      conn.sobject('Account').retrieve(ret.id, this.callback);
    },
    "then returns updated account object" : function(account) {
      assert.equal(account.Name, 'Hello2');
    },

  "then delete account" : {
    topic : function(ret) {
      conn.sobject('Account').del(ret.id, this.callback);
    },
    "then successfully updates" : function(ret) {
      assert.ok(ret.success);
    }

  }}}}

}).export(module);

