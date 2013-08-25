var vows   = require('vows'),
    assert = require('assert'),
    async  = require('async'),
    fs     = require('fs'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

var conn = new sf.Connection({ logLevel : config.logLevel });
var context = {};

vows.describe("apex").addBatch({
  "login" : {
    topic : function() {
      conn.login(config.username, config.password, this.callback);
    },
    "done" : function() {
      assert.isString(conn.accessToken);
    }
  }

}).addBatch({

  "post account info by apex rest method" : {
    topic : function() {
      var params = {
        name: 'My Apex Rest Test #1',
        phone: '654-321-0000',
        website: 'http://www.google.com'
      };
      conn.apex.post('/MyApexRestTest/', params, this.callback);
    },
    "should return created account id" : function (id) {
      assert.isString(id);
      context.accountId = id;
    },

  "then get account info by apex rest method" : {
    topic: function() {
      conn.apex.get('/MyApexRestTest/' + context.accountId, this.callback);
    },

    "should return updated account" : function (acc) {
      assert.isObject(acc);
      assert.equal(acc.Name, 'My Apex Rest Test #1');
      assert.equal(acc.Phone, '654-321-0000');
      assert.equal(acc.Website, 'http://www.google.com');
    },


  "then put account info by apex rest method" : {
    topic: function() {
      var params = {
        account: {
          Name : 'My Apex Rest Test #1 (put)',
          Phone : null
        }
      };
      conn.apex.put('/MyApexRestTest/' + context.accountId, params, this.callback);
    },
    "should return updated account" : function (acc) {
      assert.isObject(acc);
      assert.equal(acc.Name, 'My Apex Rest Test #1 (put)');
      assert.equal(acc.Phone, null);
      assert.equal(acc.Website, 'http://www.google.com');
    },

  "then patch account info by apex rest method" : {
    topic: function() {
      var params = {
        name: 'My Apex Rest Test #1 (patch)'
      };
      conn.apex.patch('/MyApexRestTest/' + context.accountId, params, this.callback);
    },
    "should return updated account" : function (acc) {
      assert.isObject(acc);
      assert.equal(acc.Name, 'My Apex Rest Test #1 (patch)');
      assert.equal(acc.Phone, null);
      assert.equal(acc.Website, 'http://www.google.com');
    },

  "then delete account info by apex rest method" : {
    topic: function() {
      conn.apex.delete('/MyApexRestTest/' + context.accountId, this.callback);
    },

  "then get account by id" : {
    topic: function() {
      conn.sobject('Account').find({ Id: context.accountId }, this.callback);
    },
    "should not get any account": function(records) {
      assert.equal(records.length, 0);
    }

  }}}}}}

}).export(module);
