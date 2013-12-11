/*global describe, it, before */
var assert = require('power-assert'),
    _      = require('underscore'),
    async  = require('async'),
    sf     = require('../lib/salesforce'),
    SObject = require("../lib/sobject"),
    config = require('./config/salesforce');

/**
 *
 */
describe("sobject", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  var Account, Opportunity;
  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { throw err; }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
      done();
    });
  });

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
   
});

