/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('underscore'),
    sf     = require('../lib/jsforce'),
    SObject = require("../lib/sobject"),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("sobject", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
  });


  var Account, Opportunity;

  /**
   *
   */
  describe("create sobject", function() {
    it("should get SObject instances", function() {
      Account = conn.sobject("Account");
      Opportunity = conn.sobject("Opportunity");
      assert.ok(Account instanceof SObject);
      assert.ok(Opportunity instanceof SObject);
    });
  });

  var acc;
  /**
   *
   */
  describe("find records", function() {

    it("should return records", function(done) {
      Account.find().run(function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
      }.check(done));
    });

    it("should return records with direct callback", function(done) {
      Account.find({}, { Name : 1 }, function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        acc = records[0]; // keep sample account record
      }.check(done));
    });

    it("should return records with conditions", function(done) {
      var likeStr = acc.Name[0] + "%";
      Account.find({ Name : { $like : likeStr } }, { Name : 1 }, function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        assert.ok(records.length > 0);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("find one record", function() {
    it("should return a record", function(done) {
      Account.findOne({ Id : acc.Id }, function(err, record) {
        if (err) { throw err; }
        assert.ok(_.isObject(record));
        assert.ok(_.isString(record.Id));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("count records", function() {
    it("should return total size count", function(done) {
      var likeStr = acc.Name[0] + "%";
      Account.count({ Name : { $like : likeStr } }, function(err, count) {
        if (err) { throw err; }
        assert.ok(_.isNumber(count));
        assert.ok(count > 0);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("find records with sort option", function() {
    it("should return sorted records", function(done) {
      Opportunity.find({}, { CloseDate : 1 })
                 .sort("CloseDate", "desc")
                 .exec(function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        assert.ok(records.length > 0);
        for (var i=0; i<records.length - 1; i++) {
          assert.ok(records[i].CloseDate >= records[i+1].CloseDate);
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("find records with multiple sort options", function() {
    it("should return sorted records", function(done) {
      Opportunity.find({}, { "Account.Name" : 1, CloseDate : 1 })
                 .sort("Account.Name -CloseDate")
                 .exec(function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        assert.ok(records.length > 0);
        for (var i=0; i<records.length - 1; i++) {
          var r1 = records[i], r2 = records[i+1];
          assert.ok(r1.Account.Name <= r2.Account.Name);
          if (r1.Account.Name === r2.Account.Name) {
            assert.ok(r1.CloseDate >= r2.CloseDate);
          }
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("find records with multiple sort options and limit option", function() {
    it("should return sorted records", function(done) {
      Opportunity.find({}, { "Owner.Name" : 1, CloseDate : 1 })
                 .sort({ "Owner.Name" : 1, CloseDate : -1 })
                 .limit(10)
                 .exec(function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        assert.ok(records.length > 0);
        assert.ok(records.length < 11);
        for (var i=0; i<records.length - 1; i++) {
          var r1 = records[i], r2 = records[i+1];
          assert.ok(r1.Owner.Name <= r2.Owner.Name);
          if (r1.Owner.Name === r2.Owner.Name) {
            assert.ok(r1.CloseDate >= r2.CloseDate);
          }
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("select records", function() {
    it("should return records", function(done) {
      Opportunity.select("Id,Owner.Name,CloseDate")
                 .limit(10)
                 .exec(function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        assert.ok(records.length > 0);
        assert.ok(records.length < 11);
        for (var i=0; i<records.length - 1; i++) {
          var record = records[i];
          assert.ok(_.isString(record.Id));
          assert.ok(_.isObject(record.Owner));
          assert.ok(_.isString(record.Owner.Name));
          assert.ok(_.isString(record.CloseDate));
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("select records with asterisk", function() {
    it("should return records", function(done) {
      Opportunity.select("*, Account.*, Owner.*").exec(function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        for (var i=0; i<records.length - 1; i++) {
          var record = records[i];
          assert.ok(_.isString(record.Id));
          assert.ok(_.isString(record.Name));
          assert.ok(_.isString(record.CloseDate));
          assert.ok(_.isObject(record.Account));
          assert.ok(_.isString(record.Account.Name));
          assert.ok(_.isObject(record.Owner));
          assert.ok(_.isString(record.Owner.Name));
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("select records including child objects", function() {
    it("should return records with child records", function(done) {
      Account.find(null, 'Id')
             .include('Contacts').select('*').limit(2).end()
             .include('Opportunities', null, 'Id, Name', { limit: 2 }).end()
             .limit(10)
             .exec(function(err, records) {
        if (err) { throw err; }
        assert.ok(_.isArray(records));
        assert.ok(records.length > 0);
        assert.ok(records.length < 11);
        for (var i=0; i<records.length; i++) {
          var record = records[i];
          assert.ok(_.isString(record.Id));
          assert.ok(_.isUndefined(record.Name));
          if (record.Contacts) {
            assert.ok(_.isObject(record.Contacts));
            var crecords = record.Contacts.records;
            assert.ok(_.isArray(crecords));
            assert.ok(crecords.length > 0);
            assert.ok(crecords.length < 3);
            for (var j=0; j<crecords.length; j++) {
              var crecord = crecords[j];
              assert.ok(_.isString(crecord.Id));
              assert.ok(_.isString(crecord.FirstName));
              assert.ok(_.isString(crecord.LastName));
            }
          }
          if (record.Opportunities) {
            assert.ok(_.isObject(record.Opportunities));
            var orecords = record.Opportunities.records;
            assert.ok(_.isArray(orecords));
            assert.ok(orecords.length > 0);
            assert.ok(orecords.length < 3);
            for (var k=0; k<orecords.length; k++) {
              var orecord = orecords[k];
              assert.ok(_.isString(orecord.Id));
              assert.ok(_.isString(orecord.Name));
              assert.ok(_.isUndefined(orecord.CloseDate));
            }
          }
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("list layout for SObject", function() {
    it("should return Account layout information", function(done) {
      Account.layouts(function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isArray(res.layouts));
        res.layouts.forEach(function(layout) {
          assert.ok(layout.id === null || _.isString(layout.id));
          assert.ok(_.isObject(layout.buttonLayoutSection));
          assert.ok(_.isArray(layout.detailLayoutSections));
          assert.ok(_.isArray(layout.editLayoutSections));
          assert.ok(_.isObject(layout.quickActionList));
          assert.ok(_.isArray(layout.quickActionList.quickActionListItems));
          assert.ok(_.isArray(layout.relatedLists));
        });
        assert.ok(_.isArray(res.recordTypeMappings));
        assert.ok(_.isArray(res.recordTypeSelectorRequired));
      }.check(done));
    });

    it("should return Account layout information immediately", function() {
      var res = Account.layouts$();
      assert.ok(_.isArray(res.layouts));
      res.layouts.forEach(function(layout) {
        assert.ok(layout.id === null || _.isString(layout.id));
        assert.ok(_.isObject(layout.buttonLayoutSection));
        assert.ok(_.isArray(layout.detailLayoutSections));
        assert.ok(_.isArray(layout.editLayoutSections));
        assert.ok(_.isObject(layout.quickActionList));
        assert.ok(_.isArray(layout.quickActionList.quickActionListItems));
        assert.ok(_.isArray(layout.relatedLists));
      });
      assert.ok(_.isArray(res.recordTypeMappings));
      assert.ok(_.isArray(res.recordTypeSelectorRequired));
    });
  });

  /**
   *
   */
  describe("list named layout for SObject", function() {
    it("should return User named layout information", function(done) {
      conn.sobject('User').layouts('UserAlt', function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isArray(res.layouts));
        res.layouts.forEach(function(layout) {
          assert.ok(layout.id === null || _.isString(layout.id));
          assert.ok(_.isObject(layout.buttonLayoutSection));
          assert.ok(_.isArray(layout.detailLayoutSections));
          assert.ok(_.isArray(layout.editLayoutSections));
          assert.ok(_.isObject(layout.quickActionList));
          assert.ok(_.isArray(layout.quickActionList.quickActionListItems));
          assert.ok(_.isArray(layout.relatedLists));
        });
        assert.ok(_.isArray(res.recordTypeMappings));
        assert.ok(_.isArray(res.recordTypeSelectorRequired));
      }.check(done));
    });

    it("should return User named layout information immediately", function() {
      var res = conn.sobject('User').layouts$('UserAlt');
      assert.ok(_.isArray(res.layouts));
      res.layouts.forEach(function(layout) {
        assert.ok(layout.id === null || _.isString(layout.id));
        assert.ok(_.isObject(layout.buttonLayoutSection));
        assert.ok(_.isArray(layout.detailLayoutSections));
        assert.ok(_.isArray(layout.editLayoutSections));
        assert.ok(_.isObject(layout.quickActionList));
        assert.ok(_.isArray(layout.quickActionList.quickActionListItems));
        assert.ok(_.isArray(layout.relatedLists));
      });
      assert.ok(_.isArray(res.recordTypeMappings));
      assert.ok(_.isArray(res.recordTypeSelectorRequired));
    });
  });

  /**
   *
   */
  describe("list compact layout for SObject", function() {
    it("should return Account comact layout information", function(done) {
      Account.compactLayouts(function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isArray(res.compactLayouts));
        res.compactLayouts.forEach(function(clayout) {
          assert.ok(clayout.id === null || _.isString(clayout.id));
          assert.ok(_.isString(clayout.objectType));
          assert.ok(_.isArray(clayout.actions));
          assert.ok(_.isArray(clayout.fieldItems));
        });
        assert.ok(!res.defaultCompactLayoutId || _.isString(res.defaultCompactLayoutId));
        assert.ok(_.isArray(res.recordTypeCompactLayoutMappings));
      }.check(done));
    });

    it("should return Account comapct layout information immediately", function() {
      var res = Account.compactLayouts$();
      assert.ok(_.isArray(res.compactLayouts));
      res.compactLayouts.forEach(function(clayout) {
        assert.ok(clayout.id === null || _.isString(clayout.id));
        assert.ok(_.isString(clayout.objectType));
        assert.ok(_.isArray(clayout.actions));
        assert.ok(_.isArray(clayout.fieldItems));
      });
      assert.ok(!res.defaultCompactLayoutId || _.isString(res.defaultCompactLayoutId));
      assert.ok(_.isArray(res.recordTypeCompactLayoutMappings));
    });
  });


  /**
   *
   */
  describe("list approval layout for SObject", function() {
    it("should return Account approval layout information", function(done) {
      Account.approvalLayouts(function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isArray(res.approvalLayouts));
        res.approvalLayouts.forEach(function(alayout) {
          assert.ok(alayout.id === null || _.isString(alayout.id));
          assert.ok(_.isString(alayout.name));
          assert.ok(_.isString(alayout.label));
          assert.ok(_.isArray(alayout.layoutItems));
        });
      }.check(done));
    });

    it("should return Account approval layout information immediately", function() {
      var res = Account.approvalLayouts$();
      assert.ok(_.isArray(res.approvalLayouts));
      res.approvalLayouts.forEach(function(alayout) {
        assert.ok(alayout.id === null || _.isString(alayout.id));
        assert.ok(_.isString(alayout.name));
        assert.ok(_.isString(alayout.label));
        assert.ok(_.isArray(alayout.layoutItems));
      });
    });
  });


  var listviewId;

  /**
   *
   */
  describe("listup list views", function() {
    it("should return list views definitions on the sobject", function(done) {
      Account.listviews(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result));
        assert.ok(_.isArray(result.listviews));
        for (var i=0, len=result.listviews.length; i<len; i++) {
          var listview = result.listviews[i];
          assert.ok(_.isString(listview.id));
          assert.ok(_.isString(listview.label));
          assert.ok(_.isString(listview.describeUrl));
          assert.ok(_.isString(listview.resultsUrl));
          assert.ok(_.isBoolean(listview.soqlCompatible));
          if (i===0) { listviewId = listview.id; }
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("describe list view", function() {
    it("should return described list view info for given list view id", function(done) {
      Account.listview(listviewId).describe(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result));
        assert.ok(_.isString(result.id));
        assert.ok(_.isString(result.sobjectType));
        assert.ok(_.isString(result.query) || result.query === null);
        assert.ok(_.isArray(result.columns));
        assert.ok(_.isArray(result.orderBy));
        for (var i=0, len=result.columns.length; i<len; i++) {
          var column = result.columns[i];
          assert.ok(_.isString(column.label));
          assert.ok(_.isString(column.fieldNameOrPath));
          assert.ok(_.isString(column.selectListItem));
          assert.ok(_.isNumber(column.sortIndex) || column.sortIndex === null);
          assert.ok(_.isBoolean(column.sortable));
        }
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get result of list view", function() {
    it("should return executed result of list view for given list view id", function(done) {
      Account.listview(listviewId).results(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isObject(result));
        assert.ok(_.isBoolean(result.done));
        assert.ok(_.isNumber(result.size));
        assert.ok(_.isString(result.id));
        assert.ok(_.isString(result.label));
        assert.ok(_.isArray(result.columns));
        for (var i=0, len=result.columns.length; i<len; i++) {
          var column = result.columns[i];
          assert.ok(_.isString(column.label));
          assert.ok(_.isString(column.fieldNameOrPath));
          assert.ok(_.isString(column.selectListItem));
          assert.ok(_.isNumber(column.sortIndex) || column.sortIndex === null);
          assert.ok(_.isBoolean(column.sortable));
        }
        assert.ok(_.isArray(result.records));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("explain query plan of list view", function() {
    it("should get explain result", function(done) {
      Account.listview(listviewId).explain(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isArray(result.plans));
        for (var i=0; i<result.plans.length; i++) {
          var plan = result.plans[i];
          assert.ok(_.isNumber(plan.cardinality));
          assert.ok(_.isArray(plan.fields));
          assert.ok(_.isString(plan.leadingOperationType));
          assert.ok(_.isNumber(plan.relativeCost));
          assert.ok(_.isNumber(plan.sobjectCardinality));
          assert.ok(_.isString(plan.sobjectType));
        }
      }.check(done));
    });
  });



  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
