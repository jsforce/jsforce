var vows   = require('vows'),
    assert = require('assert'),
    SOQLBuilder = require('../lib/soql-builder'),
    SfDate = require('../lib/date');

vows.describe("soql-builder").addBatch({

  "Simple query" : {
    topic : SOQLBuilder.createSOQL({
      fields: [ "Id", "Name" ],
      table: "Account",
      conditions: { Id: '0011000000NPNrW' },
      limit : 10,
      offset : 20
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id, Name FROM Account " +
        "WHERE Id = '0011000000NPNrW' LIMIT 10 OFFSET 20"
      );
    }
  },

  "Query with OR operator" : {
    topic : SOQLBuilder.createSOQL({
      fields: [ "Id", "Name" ],
      table: "Account",
      conditions: {
        $or: [
          { Id: '0011000000NPNrW' },
          { Id: '00110000005WlZd' }
        ]
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id, Name FROM Account " +
        "WHERE Id = '0011000000NPNrW' OR Id = '00110000005WlZd'"
      );
    }
  },

  "Query with nested OR operator" : {
    topic : SOQLBuilder.createSOQL({
      fields: [ "Id", "Name" ],
      table: "Account",
      conditions: {
        Type: 'Partner',
        $or: [
          { Id: '0011000000NPNrW' },
          { Id: '00110000005WlZd' }
        ]
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id, Name FROM Account " +
        "WHERE Type = 'Partner' AND (Id = '0011000000NPNrW' OR Id = '00110000005WlZd')"
      );
    }
  },


  "Query with nested OR/AND operator" : {
    topic : SOQLBuilder.createSOQL({
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
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "WHERE Account.Type = 'Partner' OR (Amount >= 1000 AND Amount < 2000)"
      );
    }
  },

  "Query with nested NOT/AND operator" : {
    topic : SOQLBuilder.createSOQL({
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
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "WHERE NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer')"
      );
    }
  },

  "Query with nested NOT operator" : {
    topic : SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        $not : {
          Name: { $like : 'Test%' }
        },
        Amount: { $gte: 1000 }
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "WHERE (NOT Name LIKE 'Test%') AND Amount >= 1000"
      );
    }
  },

  "Query with nested OR/NOT/AND operator" : {
    topic : SOQLBuilder.createSOQL({
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
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "WHERE Account.Type = 'Partner' OR (NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer'))"
      );
    }
  },

  "Query with Date field for date literal" : {
    topic : SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        $and : [
          { CloseDate: { $gte : SfDate.LAST_N_DAYS(10) } },
          { CloseDate: { $lte : SfDate.TOMORROW } },
          { CloseDate: { $gt : SfDate.toDateLiteral(new Date(1288958400000)) }},
          { CreatedDate: { $lt : SfDate.toDateTimeLiteral('2010-11-02T04:45:04+09:00') }}
        ]
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "WHERE CloseDate >= LAST_N_DAYS:10 AND CloseDate <= TOMORROW " +
        "AND CloseDate > 2010-11-05 AND CreatedDate < 2010-11-01T19:45:04Z"
      );
    }
  },

  "Query with String field using $like/$nlike operator" : {
    topic : SOQLBuilder.createSOQL({
      table: "Account",
      conditions: {
        Name : { $like : "John's%"},
        'Owner.Name' : { $nlike : '%Test%' }
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Account " +
        "WHERE Name LIKE 'John\\'s%' AND (NOT Owner.Name LIKE '%Test%')"
      );
    }
  },

  "Query using $in/$nin operator" : {
    topic : SOQLBuilder.createSOQL({
      table: "Contact",
      conditions: {
        "Id" : { $in : [] },
        "Account.Id" : { $in : [ '0011000000NPNrW', '00110000005WlZd' ] },
        "Owner.Id" : { $nin : [ '00510000000N2C2' ] }
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Contact " +
        "WHERE Account.Id IN ('0011000000NPNrW', '00110000005WlZd') "+
        "AND Owner.Id NOT IN ('00510000000N2C2')"
      );
    }
  },

  "Query using $exists operator" : {
    topic : SOQLBuilder.createSOQL({
      table: "Task",
      conditions: {
        WhatId: { $exists: true },
        WhoId: { $exists: false }
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Task " +
        "WHERE WhatId != null AND WhoId = null"
      );
    }
  },

  "Query for matching null " : {
    topic : SOQLBuilder.createSOQL({
      table: "Account",
      conditions: {
        Type: { $ne: null },
        LastActivityDate: null
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Account " +
        "WHERE Type != null AND LastActivityDate = null"
      );
    }
  },

  "Query with undefined condition" : {
    topic : SOQLBuilder.createSOQL({
      table: "Account",
      conditions: {
        Type : undefined
      }
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql, "SELECT Id FROM Account");
    }
  },
  
  "Query with sort option" : {
    topic : SOQLBuilder.createSOQL({
      table: "Opportunity",
      sort: "-CreatedDate",
      limit : 10
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "ORDER BY CreatedDate DESC " +
        "LIMIT 10"
      );
    }
  },

  "Query with multiple sort option in array" : {
    topic : SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        "Owner.Name" : { $like : "A%" }
      },
      sort: [
        [ "CreatedDate", "desc" ],
        [ "Name", "asc" ]
      ],
      limit : 10
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "WHERE Owner.Name LIKE 'A%' " +
        "ORDER BY CreatedDate DESC, Name ASC " +
        "LIMIT 10"
      );
    }
  },
  
  "Query with multiple sort option in hash" : {
    topic : SOQLBuilder.createSOQL({
      table: "Opportunity",
      conditions: {
        "Owner.Name" : { $like : "A%" }
      },
      sort: {
        CreatedDate: "descending",
        Name : "ascending"
      },
      limit : 10
    }),

    "should equal to soql" : function(soql) {
      assert.equal(soql,
        "SELECT Id FROM Opportunity " +
        "WHERE Owner.Name LIKE 'A%' " +
        "ORDER BY CreatedDate DESC, Name ASC " +
        "LIMIT 10"
      );
    }
  }
     
}).export(module);
