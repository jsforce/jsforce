/*global describe, it */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var SOQLBuilder = require('../lib/soql-builder'),
    SfDate = require('../lib/date');

/**
 *
 */
describe("soql-builder", function() {

  /**
   *
   */
  describe("Simple query", function() {
    var soql = SOQLBuilder.createSOQL({
      fields: [ "Id", "Name" ],
      table: "Account",
      conditions: { Id: '0011000000NPNrW' },
      limit : 10,
      offset : 20
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id, Name FROM Account " +
        "WHERE Id = '0011000000NPNrW' LIMIT 10 OFFSET 20"
      );
    });
  });

  /**
   *
   */
  describe("Query with OR operator", function() {
    var soql = SOQLBuilder.createSOQL({
      fields: [ "Id", "Name" ],
      table: "Account",
      conditions: {
        $or: [
          { Id: '0011000000NPNrW' },
          { Id: '00110000005WlZd' }
        ]
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id, Name FROM Account " +
        "WHERE Id = '0011000000NPNrW' OR Id = '00110000005WlZd'"
      );
    });
  });

  /**
   *
   */
  describe("Query with nested OR operator", function() {
    var soql = SOQLBuilder.createSOQL({
      fields: [ "Id", "Name" ],
      table: "Account",
      conditions: {
        Type: 'Partner',
        $or: [
          { Id: '0011000000NPNrW' },
          { Id: '00110000005WlZd' }
        ]
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id, Name FROM Account " +
        "WHERE Type = 'Partner' AND (Id = '0011000000NPNrW' OR Id = '00110000005WlZd')"
      );
    });
  });


  /**
   *
   */
  describe("Query with nested OR/AND operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        $or : [
          { 'Account.Type' : 'Partner' },
          {
            $and : [
              { Amount: { $gte : 1000 } },
              { Amount: { $lt  : 2000 } }
            ]
          }
        ]
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "WHERE Account.Type = 'Partner' OR (Amount >= 1000 AND Amount < 2000)"
      );
    });
  });

  /**
   *
   */
  describe("Query with nested NOT/AND operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        $not : {
          $and : [
            { Amount: { $gte : 1000 } },
            { Amount: { $lt  : 2000 } },
            { 'Account.Type' : 'Customer' }
          ]
        }
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "WHERE NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer')"
      );
    });
  });

  /**
   *
   */
  describe("Query with nested NOT operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        $not : {
          Name: { $like : 'Test%' }
        },
        Amount: { $gte: 1000 }
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "WHERE (NOT Name LIKE 'Test%') AND Amount >= 1000"
      );
    });
  });

  /**
   *
   */
  describe("Query with nested OR/NOT/AND operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        $or : [
          { 'Account.Type' : 'Partner' },
          {
            $not : {
              $and : [
                { Amount: { $gte : 1000 } },
                { Amount: { $lt  : 2000 } },
                { 'Account.Type' : 'Customer' }
              ]
            }
          }
        ]
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "WHERE Account.Type = 'Partner' OR (NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer'))"
      );
    });
  });

  /**
   *
   */
  describe("Query with Date field for date literal", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        $and : [
          { CloseDate: { $gte : SfDate.LAST_N_DAYS(10) } },
          { CloseDate: { $lte : SfDate.TOMORROW } },
          { CloseDate: { $gt : SfDate.toDateLiteral(new Date(1288958400000)) }},
          { CreatedDate: { $lt : SfDate.toDateTimeLiteral('2010-11-02T04:45:04+09:00') }}
        ]
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "WHERE CloseDate >= LAST_N_DAYS:10 AND CloseDate <= TOMORROW " +
        "AND CloseDate > 2010-11-05 AND CreatedDate < 2010-11-01T19:45:04Z"
      );
    });
  });

  /**
   *
   */
  describe("Query with String field using $like/$nlike operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Account",
      conditions: {
        Name : { $like : "John's%"},
        'Owner.Name' : { $nlike : '%Test%' }
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Account " +
        "WHERE Name LIKE 'John\\'s%' AND (NOT Owner.Name LIKE '%Test%')"
      );
    });
  });

  /**
   *
   */
  describe("Query using $in/$nin operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Contact",
      conditions: {
        "Id" : { $in : [] },
        "Account.Id" : { $in : [ '0011000000NPNrW', '00110000005WlZd' ] },
        "Owner.Id" : { $nin : [ '00510000000N2C2' ] }
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Contact " +
        "WHERE Account.Id IN ('0011000000NPNrW', '00110000005WlZd') "+
        "AND Owner.Id NOT IN ('00510000000N2C2')"
      );
    });
  });

  /**
   *
   */
  describe("Query using $exists operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Task",
      conditions: {
        WhatId: { $exists: true },
        WhoId: { $exists: false }
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Task " +
        "WHERE WhatId != null AND WhoId = null"
      );
    });
  });

  /**
   *
   */
  describe("Query using $includes/$excludes operator", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Contact",
      conditions: {
        Languages__c: { $includes: [ 'English', 'Japanese' ] },
        Certifications__c: { $excludes: [ 'Oracle' ] }
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Contact " +
        "WHERE Languages__c INCLUDES ('English', 'Japanese') "+
        "AND Certifications__c EXCLUDES ('Oracle')"
      );
    });
  });

  /**
   *
   */
  describe("Query for matching null", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Account",
      conditions: {
        Type: { $ne: null },
        LastActivityDate: null
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Account " +
        "WHERE Type != null AND LastActivityDate = null"
      );
    });
  });

  /**
   *
   */
  describe("Query with undefined condition", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Account",
      conditions: {
        Type : undefined
      }
    });

    it("should equal to soql", function() {
      assert.ok(soql === "SELECT Id FROM Account");
    });
  });

  /**
   *
   */
  describe("Query with sort option", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      sort: "-CreatedDate",
      limit : 10
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "ORDER BY CreatedDate DESC " +
        "LIMIT 10"
      );
    });
  });

  /**
   *
   */
  describe("Query with multiple sort option in array", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        "Owner.Name" : { $like : "A%" }
      },
      sort: [
        [ "CreatedDate", "desc" ],
        [ "Name", "asc" ]
      ],
      limit : 10
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "WHERE Owner.Name LIKE 'A%' " +
        "ORDER BY CreatedDate DESC, Name ASC " +
        "LIMIT 10"
      );
    });
  });

  /**
   *
   */
  describe("Query with multiple sort option in hash", function() {
    var soql = SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        "Owner.Name" : { $like : "A%" }
      },
      sort: {
        CreatedDate: "descending",
        Name : "ascending"
      },
      limit : 10
    });

    it("should equal to soql", function() {
      assert.ok(soql ===
        "SELECT Id FROM Opportunity " +
        "WHERE Owner.Name LIKE 'A%' " +
        "ORDER BY CreatedDate DESC, Name ASC " +
        "LIMIT 10"
      );
    });
  });

});
