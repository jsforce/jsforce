var vows   = require('vows'),
    assert = require('assert'),
    async  = require('async'),
    sf     = require('../lib/salesforce'),
    SObject = require("../lib/sobject"),
    config = require('./config/salesforce');

var conn = new sf.Connection({ logLevel : config.logLevel });
var context = {};
var Account, Opportunity;

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
      assert.ok(_Account instanceof SObject);
      Account = _Account;
    }
  },

  "create Opportunity sobject" : {
    topic : conn.sobject("Opportunity"),
    "should get SObject instance" : function(_Opportunity) {
      assert.ok(_Opportunity instanceof SObject);
      Opportunity = _Opportunity;
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

}).addBatch({

  "find records with sort options" : {
    topic : function() {
      Opportunity.find({}, { CloseDate : 1 })
                 .sort("CloseDate", "desc")
                 .exec(this.callback);
    },
    "should return sorted records" : function (records) {
      assert.isArray(records);
      assert.greater(records.length, 0);
      for (var i=0; i<records.length - 1; i++) {
        assert.ok(records[i].CloseDate >= records[i+1].CloseDate);
      }
    }
  },

  "find records with multiple sort options" : {
    topic : function() {
      Opportunity.find({}, { "Account.Name" : 1, CloseDate : 1 })
                 .sort("Account.Name -CloseDate")
                 .exec(this.callback);
    },
    "should return sorted records" : function (records) {
      assert.isArray(records);
      assert.greater(records.length, 0);
      for (var i=0; i<records.length - 1; i++) {
        var r1 = records[i], r2 = records[i+1];
        assert.ok(r1.Account.Name <= r2.Account.Name);
        if (r1.Account.Name === r2.Account.Name) {
          assert.ok(r1.CloseDate >= r2.CloseDate);
        }
      }
    }
  },

  "find records with multiple sort options and limit option" : {
    topic : function() {
      Opportunity.find({}, { "Owner.Name" : 1, CloseDate : 1 })
                 .sort({ "Owner.Name" : 1, CloseDate : -1 })
                 .limit(10)
                 .exec(this.callback);
    },
    "should return sorted records" : function (records) {
      assert.isArray(records);
      assert.greater(records.length, 0);
      assert.lesser(records.length, 11);
      for (var i=0; i<records.length - 1; i++) {
        var r1 = records[i], r2 = records[i+1];
        assert.ok(r1.Owner.Name <= r2.Owner.Name);
        if (r1.Owner.Name === r2.Owner.Name) {
          assert.ok(r1.CloseDate >= r2.CloseDate);
        }
      }
    }
  },

  "select records" : {
    topic : function() {
      Opportunity.select("Id,Owner.Name,CloseDate")
                 .limit(10)
                 .exec(this.callback);
    },
    "should return records" : function (records) {
      assert.isArray(records);
      assert.greater(records.length, 0);
      assert.lesser(records.length, 11);
      for (var i=0; i<records.length - 1; i++) {
        var record = records[i];
        assert.isString(record.Id);
        assert.isObject(record.Owner);
        assert.isString(record.Owner.Name);
        assert.isString(record.CloseDate);
      }
    }
  },

  "select records with asterisk" : {
    topic : function() {
      Opportunity.select("*, Account.*, Owner.*").exec(this.callback);
    },
    "should return records" : function (records) {
      assert.isArray(records);
      for (var i=0; i<records.length - 1; i++) {
        var record = records[i];
        assert.isString(record.Id);
        assert.isString(record.Name);
        assert.isString(record.CloseDate);
        assert.isObject(record.Account);
        assert.isString(record.Account.Name);
        assert.isObject(record.Owner);
        assert.isString(record.Owner.Name);
      }
    }
  },

  "select records including child objects" : {
    topic : function() {
      Account.find(null, 'Id')
             .include('Contacts').select('*').limit(2).end()
             .include('Opportunities', null, 'Id, Name', { limit: 2 }).end()
             .limit(10)
             .exec(this.callback);
    },
    "should return records with child records" : function (records) {
      assert.isArray(records);
      assert.greater(records.length, 0);
      assert.lesser(records.length, 11);
      for (var i=0; i<records.length; i++) {
        var record = records[i];
        assert.isString(record.Id);
        assert.isUndefined(record.Name);
        if (record.Contacts) {
          assert.isObject(record.Contacts);
          var crecords = record.Contacts.records;
          assert.isArray(crecords);
          assert.greater(crecords.length, 0);
          assert.lesser(crecords.length, 3);
          for (var j=0; j<crecords.length; j++) {
            var crecord = crecords[j];
            assert.isString(crecord.Id);
            assert.isString(crecord.FirstName);
            assert.isString(crecord.LastName);
          }
        }
        if (record.Opportunities) {
          assert.isObject(record.Opportunities);
          var orecords = record.Opportunities.records;
          assert.isArray(orecords);
          assert.greater(orecords.length, 0);
          assert.lesser(orecords.length, 3);
          for (var k=0; k<orecords.length; k++) {
            var orecord = orecords[k];
            assert.isString(orecord.Id);
            assert.isString(orecord.Name);
            assert.isUndefined(orecord.CloseDate);
          }
        }
      }
    }
  }
   
}).export(module);

