var vows   = require('vows')
  , assert = require('assert')
  , async  = require('async')
  , sf     = require('../lib/salesforce')
  , config = require('./config/streaming')
  ;

var conn = new sf.Connection();

vows.describe("streaming").addBatch({

  "login" : {
    topic : function() {
      conn.login(config.username, config.password, this.callback);
    }, 
    "done" : function() { 
      assert.isString(conn.accessToken);
    }
  }

}).addBatch({

  "subscribe to topic and create account" : {
    topic : function() {
      callback = this.callback;
      // pushTopic should be query for "SELECT Id, Name FROM Account"
      conn.topic(config.pushTopicName).subscribe(function(msg) {
        callback(null, msg);
      });
      conn.sobject('Account').create({
        Name: 'My New Account #'+Date.now()
      }, function() {});
    },
    ", then receive event account created" : function(msg) {
      assert.equal("created", msg.event.type);
      assert.isString(msg.sobject.Name);
      assert.isString(msg.sobject.Id);
    },
  }

}).export(module);

