var vows   = require('vows'),
    assert = require('assert'),
    zombie = require('zombie'),
    async  = require('async'),
    querystring = require('querystring'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

var conn = new sf.Connection({ logLevel : config.logLevel });
var browser = new zombie.Browser();
var context = {};

vows.describe("connection").addBatch({
  "login" : {
    topic : function() {
      conn.login(config.username, config.password, this.callback);
    }, 
    "done" : function(userInfo) { 
      assert.isString(conn.accessToken);
      assert.isString(userInfo.id);
      assert.isString(userInfo.organizationId);
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
      assert.isObject(record.attributes);
      assert.equal(record.Name, 'Hello');
    },

  ", then update account" : {
    topic : function(account) {
      conn.sobject('Account').record(account.Id).update({ Name : "Hello2" }, this.callback);
    },
    "should update successfully" : function(ret) {
      assert.ok(ret.success);
    },

  ", then retrieve account" : {
    topic : function(ret) {
      conn.sobject('Account').record(ret.id).retrieve(this.callback);
    },
    "sholuld return updated account object" : function(record) {
      assert.equal(record.Name, 'Hello2');
      assert.isObject(record.attributes);
    },

  ", then delete account" : {
    topic : function(account) {
      conn.sobject('Account').record(account.Id).destroy(this.callback);
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



}).addBatch({


  "create multiple accounts" : {
    topic : function() {
      conn.sobject('Account').create([
        { Name : 'Account #1' }, 
        { Name : 'Account #2' }
      ], this.callback);
    },
    "should return created obj" : function(rets) {
      assert.isArray(rets);
      rets.forEach(function(ret) {
        assert.ok(ret.success);
        assert.isString(ret.id);
      });
    },

  ", then retrieve accounts" : {
    topic : function(rets) {
      conn.sobject('Account').retrieve(
        rets.map(function(ret){ return ret.id; }), this.callback);
    },
    "should return records" : function(records) {
      assert.isArray(records);
      records.forEach(function(record, i) {
        assert.isString(record.Id);
        assert.isObject(record.attributes);
        assert.equal(record.Name, 'Account #' + (i+1));
      });
    },

  ", then update accounts" : {
    topic : function(accounts) {
      conn.sobject('Account').update(
        accounts.map(function(account) {
          return { Id : account.Id, Name : "Updated " + account.Name };
        }),
        this.callback);
    },
    "should update successfully" : function(rets) {
      assert.isArray(rets);
      rets.forEach(function(ret){
        assert.ok(ret.success);
      });
    },

  ", then retrieve accounts" : {
    topic : function(rets) {
      conn.sobject('Account').retrieve(
        rets.map(function(ret){ return ret.id; }), this.callback);
    },
    "sholuld return updated account object" : function(records) {
      assert.isArray(records);
      records.forEach(function(record, i) {
        assert.equal(record.Name, 'Updated Account #' + (i+1));
        assert.isObject(record.attributes);
      });
    },

  ", then delete accounts" : {
    topic : function(accounts) {
      conn.sobject('Account').destroy(
        accounts.map(function(account){ return account.Id; }), this.callback);
    },
    "should delete successfully" : function(rets) {
      assert.isArray(rets);
      rets.forEach(function(ret){
        assert.ok(ret.success);
      });
    },

  ", then retrieve account" : {
    topic : function(rets) {
      conn.sobject('Account').retrieve(
        rets.map(function(ret){ return ret.id; }), this.callback);
    },
    "should not return any record" : function(err, records) {
      assert.isNotNull(err);
      assert.equal(err.errorCode, 'NOT_FOUND');
    }

  }}}}}}



}).addBatch({

  "generate unique external id" : {
    topic : "ID" + Date.now(),

  ", upsert record with the ext id" : {
    topic : function(extId) {
      var rec = { Name : 'New Record' };
      rec[config.upsertField] = extId;
      conn.sobject(config.upsertTable).upsert(rec, config.upsertField, this.callback);
    },
    "should insert new record successfully" : function(ret) {
      assert.ok(ret.success);
      assert.isString(ret.id);
    },

  ", then upsert again with same ext id" : {
    topic : function(ret, extId) {
      var rec = { Name : 'Updated Record' };
      rec[config.upsertField] = extId;
      conn.sobject(config.upsertTable).upsert(rec, config.upsertField, this.callback);
    },
    "should update the record successfully" : function(ret) {
      assert.ok(ret.success);
      assert.isUndefined(ret.id);
    },

  ", then retrieve record by id" : {
    topic : function(ret2, ret1) {
      var id = ret1.id;
      conn.sobject(config.upsertTable).retrieve(id, this.callback);
    },
    "should return updated record" : function(record) {
      assert.equal(record.Name, "Updated Record");
    },

  ", then insert record with same ext id" : {
    topic : function(record, ret2, ret1, extId) {
      var rec = { Name : 'Duplicated Record' };
      rec[config.upsertField] = extId;
      conn.sobject(config.upsertTable).create(rec, this.callback);
    }, 

  "and upsert with the same ext id" : {
    topic: function(ret3, record, ret2, ret1, extId) {
      var rec = { Name : 'Updated Record, Twice' };
      rec[config.upsertField] = extId;
      conn.sobject(config.upsertTable).upsert(rec, config.upsertField, this.callback);
    },
    "should throw error and return array of choices" : function(err, ret) {
      assert.isObject(err);
      assert.isArray(ret);
      assert.isString(ret[0]);
    }

  }}}}}}


}).addBatch({

  "describe Account" : {
    topic : function() {
      conn.sobject('Account').describe(this.callback);
    },
    "should return described metadata information" : function(meta) {
      assert.equal(meta.name, "Account");
      assert.isArray(meta.fields);
    }
  },

  "describe global sobjects" : {
    topic : function() {
      conn.describeGlobal(this.callback);
    },
    "should return whole global sobject list" : function(res) {
      assert.isArray(res.sobjects);
      assert.isString(res.sobjects[0].name);
      assert.isString(res.sobjects[0].label);
      assert.isUndefined(res.sobjects[0].fields);
    }
  }

}).addBatch({

  "logout by soap api" : {
    topic : function() {
      var self = this;
      context.sessionInfo = {
        accessToken : conn.accessToken,
        instanceUrl : conn.instanceUrl
      };
      conn.logout(this.callback);
    },

    "should logout" : function() {
      assert.isNull(conn.accessToken);
    },

  "then connect using logouted session" : {
    topic : function() {
      conn = new sf.Connection(context.sessionInfo);
      conn.query("SELECT Id FROM User", this.callback);
    },

    "should raise authentication error" : function(err, res) {
      assert.isObject(err);
    }
  }}

}).addBatch({

  "login by oauth2" : {
    topic : function() {
      var self = this;
      conn = new sf.Connection({
        clientId : config.clientId,
        clientSecret : config.clientSecret,
        redirectUri : config.redirectUri,
        logLevel : config.logLevel
      });
      browser.visit(conn.oauth2.getAuthorizationUrl())
        .then(function() {
          return browser.wait(2000);
        })
        .fail(function(err) {
          // ignore js errors
          console.log(err.message);
        })
        .then(function() {
          browser.fill("input[name=un]", config.username);
          browser.fill("input[name=pw]", config.password);
          return browser.pressButton("input[name=Login]");
        })
        .then(function() {
          return browser.wait(2000);
        })
        .then(function() {
          return browser.pressButton("#oaapprove");
        })
        .then(function() {
          return browser.wait(1500);
        })
        .fail(function(err) {
          // ignore connection failure
          console.log(err.message);
        })
        .then(function() {
          var url = browser.location.href;
          url = require('url').parse(url);
          var params = querystring.parse(url.query);
          conn.authorize(params.code, self.callback);
        })
        .fail(function(err) {
          self.callback(err);
        });
    },

    "done" : function(userInfo) {
      assert.isString(userInfo.id);
      assert.isString(userInfo.organizationId);
      assert.isString(conn.accessToken);
      assert.isString(conn.refreshToken);
    },

  ", then query user" : {
    topic : function() {
      conn.query("SELECT Id FROM User", this.callback);
    },

    "should return some records" : function(res) {
      assert.isArray(res.records);
    },

  ", then expire access token and query user" : {
    topic : function() {
      context.refreshCount = 0;
      conn.accessToken = "invalid access token";
      conn.removeAllListeners("refresh");
      conn.on("refresh", function(at) {
        context.newAccessToken = at;
        context.refreshCount++;
      });
      conn.query("SELECT Id FROM User", this.callback);
    },
    "should return records" : function(res) {
      assert.equal(context.refreshCount, 1);
      assert.isString(context.newAccessToken);
      assert.isArray(res.records);
    },

  ", then again expire access token and call api in parallel" : {
    topic : function() {
      context.refreshCount = 0;
      conn.accessToken = "invalid access token";
      conn.removeAllListeners("refresh");
      conn.on("refresh", function(at) {
        context.newAccessToken = at;
        context.refreshCount++;
      });
      async.parallel([
        function(cb) {
          conn.query('SELECT Id FROM User', cb);
        },
        function(cb) {
          conn.describeGlobal(cb);
        },
        function(cb) {
          conn.sobject('User').describe(cb);
        }
      ], this.callback);
    },

    "should return responces" : function(results) {
      assert.equal(context.refreshCount, 1);
      assert.isString(context.newAccessToken);
      assert.isArray(results);
      assert.isArray(results[0].records);
      assert.isArray(results[1].sobjects);
      assert.isArray(results[2].fields);
    },

  ", then again expire access token and expire refresh token" : {
    topic : function() {
      conn.accessToken = "invalid access token";
      conn.refreshToken = "invalid refresh token";
      conn.query("SELECT Id FROM User", this.callback);
    },

    "should return error response" : function(err, user) {
      assert.isObject(err);
      assert.equal("invalid_grant", err.error);
    }

  }}}}}



}).export(module);

