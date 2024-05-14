import assert from 'assert';
import { SfDate } from '../src/date'
import { createSOQL } from '../src/soql-builder';

/**
 *
 */
describe('soql-builder', () => {
  it('should build simple query', () => {
    const soql = createSOQL({
      fields: ['Id', 'Name'],
      table: 'Account',
      conditions: { Id: '0011000000NPNrW' },
      limit: 10,
      offset: 20,
    });
    assert.ok(
      soql ===
        'SELECT Id, Name FROM Account ' +
          "WHERE Id = '0011000000NPNrW' LIMIT 10 OFFSET 20",
    );
  });

  /**
   *
   */
  it('should build query with OR operator', () => {
    const soql = createSOQL({
      fields: ['Id', 'Name'],
      table: 'Account',
      conditions: {
        $or: [{ Id: '0011000000NPNrW' }, { Id: '00110000005WlZd' }],
      },
    });
    assert.ok(
      soql ===
        'SELECT Id, Name FROM Account ' +
          "WHERE Id = '0011000000NPNrW' OR Id = '00110000005WlZd'",
    );
  });

  //
  it('should build query with nested OR operator', () => {
    const soql = createSOQL({
      fields: ['Id', 'Name'],
      table: 'Account',
      conditions: {
        Type: 'Partner',
        $or: [{ Id: '0011000000NPNrW' }, { Id: '00110000005WlZd' }],
      },
    });
    assert.ok(
      soql ===
        'SELECT Id, Name FROM Account ' +
          "WHERE Type = 'Partner' AND (Id = '0011000000NPNrW' OR Id = '00110000005WlZd')",
    );
  });

  //
  it('should build query with nested OR/AND operator', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        $or: [
          { 'Account.Type': 'Partner' },
          {
            $and: [{ Amount: { $gte: 1000 } }, { Amount: { $lt: 2000 } }],
          },
        ],
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Account.Type = 'Partner' OR (Amount >= 1000 AND Amount < 2000)",
    );
  });

  //
  it('should build query with nested NOT/AND operator', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        $not: {
          $and: [
            { Amount: { $gte: 1000 } },
            { Amount: { $lt: 2000 } },
            { 'Account.Type': 'Customer' },
          ],
        },
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer')",
    );
  });

  //
  it('should build query with nested NOT operator', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        $not: {
          Name: { $like: 'Test%' },
        },
        Amount: { $gte: 1000 },
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE (NOT Name LIKE 'Test%') AND Amount >= 1000",
    );
  });

  //
  it('should build query with nested OR/NOT/AND operator', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        $or: [
          { 'Account.Type': 'Partner' },
          {
            $not: {
              $and: [
                { Amount: { $gte: 1000 } },
                { Amount: { $lt: 2000 } },
                { 'Account.Type': 'Customer' },
              ],
            },
          },
        ],
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Account.Type = 'Partner' OR (NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer'))",
    );
  });

  //
  it('should build query with Date field for date literal', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        $and: [
          { CloseDate: { $gte: SfDate.LAST_N_DAYS(10) } },
          { CloseDate: { $lte: SfDate.TOMORROW } },
          { CloseDate: { $gt: SfDate.toDateLiteral(new Date(1288958400000)) } },
          {
            CreatedDate: {
              $lt: SfDate.toDateTimeLiteral('2010-11-02T04:45:04+09:00'),
            },
          },
        ],
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          'WHERE CloseDate >= LAST_N_DAYS:10 AND CloseDate <= TOMORROW ' +
          'AND CloseDate > 2010-11-05 AND CreatedDate < 2010-11-01T19:45:04Z',
    );
  });

  //
  it('should build query with String field using $like/$nlike operator', () => {
    const soql = createSOQL({
      table: 'Account',
      conditions: {
        Name: { $like: "John's%" },
        'Owner.Name': { $nlike: '%Test%' },
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Account ' +
          "WHERE Name LIKE 'John\\'s%' AND (NOT Owner.Name LIKE '%Test%')",
    );
  });

  //
  it('should build query using $in/$nin operator', () => {
    const soql = createSOQL({
      table: 'Contact',
      conditions: {
        Id: { $in: [] },
        'Account.Id': { $in: ['0011000000NPNrW', '00110000005WlZd'] },
        'Owner.Id': { $nin: ['00510000000N2C2'] },
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Contact ' +
          "WHERE Account.Id IN ('0011000000NPNrW', '00110000005WlZd') " +
          "AND Owner.Id NOT IN ('00510000000N2C2')",
    );
  });

  //
  it('should build query using $exists operator', () => {
    const soql = createSOQL({
      table: 'Task',
      conditions: {
        WhatId: { $exists: true },
        WhoId: { $exists: false },
      },
    });
    assert.ok(
      soql === 'SELECT Id FROM Task ' + 'WHERE WhatId != null AND WhoId = null',
    );
  });

  //
  it('should build query using $includes/$excludes operator', () => {
    const soql = createSOQL({
      table: 'Contact',
      conditions: {
        Languages__c: { $includes: ['English', 'Japanese'] },
        Certifications__c: { $excludes: ['Oracle'] },
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Contact ' +
          "WHERE Languages__c INCLUDES ('English', 'Japanese') " +
          "AND Certifications__c EXCLUDES ('Oracle')",
    );
  });

  //
  it('should build query for matching null', () => {
    const soql = createSOQL({
      table: 'Account',
      conditions: {
        Type: { $ne: null },
        LastActivityDate: null,
      },
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Account ' +
          'WHERE Type != null AND LastActivityDate = null',
    );
  });

  //
  it('should build query with undefined condition', () => {
    const soql = createSOQL({
      table: 'Account',
      conditions: {
        Type: undefined,
      },
    });
    assert.ok(soql === 'SELECT Id FROM Account');
  });

  //
  it('should build query with sort option', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      sort: '-CreatedDate',
      limit: 10,
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          'ORDER BY CreatedDate DESC ' +
          'LIMIT 10',
    );
  });

  //
  it('should build query with multiple sort option in array', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        'Owner.Name': { $like: 'A%' },
      },
      sort: [
        ['CreatedDate', 'desc'],
        ['Name', 'asc'],
      ] as any, // TODO: remove any
      limit: 10,
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Owner.Name LIKE 'A%' " +
          'ORDER BY CreatedDate DESC, Name ASC ' +
          'LIMIT 10',
    );
  });

  //
  it('should build query with multiple sort option in hash', () => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        'Owner.Name': { $like: 'A%' },
      },
      sort: {
        CreatedDate: 'descending',
        Name: 'ascending',
      } as any, // TODO: remove any
      limit: 10,
    });
    assert.ok(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Owner.Name LIKE 'A%' " +
          'ORDER BY CreatedDate DESC, Name ASC ' +
          'LIMIT 10',
    );
  });
});
