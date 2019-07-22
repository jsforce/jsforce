import test from './util/ava/ext';
import { createSOQL } from '../src/soql-builder';
import { SfDate } from '..';

/**
 *
 */
test.group('soql-builder', (test) => {
  //
  test('build simple query', (t) => {
    const soql = createSOQL({
      fields: ['Id', 'Name'],
      table: 'Account',
      conditions: { Id: '0011000000NPNrW' },
      limit: 10,
      offset: 20,
    });
    t.true(
      soql ===
        'SELECT Id, Name FROM Account ' +
          "WHERE Id = '0011000000NPNrW' LIMIT 10 OFFSET 20",
    );
  });

  /**
   *
   */
  test('build query with OR operator', (t) => {
    const soql = createSOQL({
      fields: ['Id', 'Name'],
      table: 'Account',
      conditions: {
        $or: [{ Id: '0011000000NPNrW' }, { Id: '00110000005WlZd' }],
      },
    });
    t.true(
      soql ===
        'SELECT Id, Name FROM Account ' +
          "WHERE Id = '0011000000NPNrW' OR Id = '00110000005WlZd'",
    );
  });

  //
  test('build query with nested OR operator', (t) => {
    const soql = createSOQL({
      fields: ['Id', 'Name'],
      table: 'Account',
      conditions: {
        Type: 'Partner',
        $or: [{ Id: '0011000000NPNrW' }, { Id: '00110000005WlZd' }],
      },
    });
    t.true(
      soql ===
        'SELECT Id, Name FROM Account ' +
          "WHERE Type = 'Partner' AND (Id = '0011000000NPNrW' OR Id = '00110000005WlZd')",
    );
  });

  //
  test('build query with nested OR/AND operator', (t) => {
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
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Account.Type = 'Partner' OR (Amount >= 1000 AND Amount < 2000)",
    );
  });

  //
  test('build query with nested NOT/AND operator', (t) => {
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
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer')",
    );
  });

  //
  test('build query with nested NOT operator', (t) => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        $not: {
          Name: { $like: 'Test%' },
        },
        Amount: { $gte: 1000 },
      },
    });
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE (NOT Name LIKE 'Test%') AND Amount >= 1000",
    );
  });

  //
  test('build query with nested OR/NOT/AND operator', (t) => {
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
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Account.Type = 'Partner' OR (NOT (Amount >= 1000 AND Amount < 2000 AND Account.Type = 'Customer'))",
    );
  });

  //
  test('build query with Date field for date literal', (t) => {
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
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          'WHERE CloseDate >= LAST_N_DAYS:10 AND CloseDate <= TOMORROW ' +
          'AND CloseDate > 2010-11-05 AND CreatedDate < 2010-11-01T19:45:04Z',
    );
  });

  //
  test('build query with String field using $like/$nlike operator', (t) => {
    const soql = createSOQL({
      table: 'Account',
      conditions: {
        Name: { $like: "John's%" },
        'Owner.Name': { $nlike: '%Test%' },
      },
    });
    t.true(
      soql ===
        'SELECT Id FROM Account ' +
          "WHERE Name LIKE 'John\\'s%' AND (NOT Owner.Name LIKE '%Test%')",
    );
  });

  //
  test('build query using $in/$nin operator', (t) => {
    const soql = createSOQL({
      table: 'Contact',
      conditions: {
        Id: { $in: [] },
        'Account.Id': { $in: ['0011000000NPNrW', '00110000005WlZd'] },
        'Owner.Id': { $nin: ['00510000000N2C2'] },
      },
    });
    t.true(
      soql ===
        'SELECT Id FROM Contact ' +
          "WHERE Account.Id IN ('0011000000NPNrW', '00110000005WlZd') " +
          "AND Owner.Id NOT IN ('00510000000N2C2')",
    );
  });

  //
  test('build query using $exists operator', (t) => {
    const soql = createSOQL({
      table: 'Task',
      conditions: {
        WhatId: { $exists: true },
        WhoId: { $exists: false },
      },
    });
    t.true(
      soql === 'SELECT Id FROM Task ' + 'WHERE WhatId != null AND WhoId = null',
    );
  });

  //
  test('build query using $includes/$excludes operator', (t) => {
    const soql = createSOQL({
      table: 'Contact',
      conditions: {
        Languages__c: { $includes: ['English', 'Japanese'] },
        Certifications__c: { $excludes: ['Oracle'] },
      },
    });
    t.true(
      soql ===
        'SELECT Id FROM Contact ' +
          "WHERE Languages__c INCLUDES ('English', 'Japanese') " +
          "AND Certifications__c EXCLUDES ('Oracle')",
    );
  });

  //
  test('build query for matching null', (t) => {
    const soql = createSOQL({
      table: 'Account',
      conditions: {
        Type: { $ne: null },
        LastActivityDate: null,
      },
    });
    t.true(
      soql ===
        'SELECT Id FROM Account ' +
          'WHERE Type != null AND LastActivityDate = null',
    );
  });

  //
  test('build query with undefined condition', (t) => {
    const soql = createSOQL({
      table: 'Account',
      conditions: {
        Type: undefined,
      },
    });
    t.true(soql === 'SELECT Id FROM Account');
  });

  //
  test('build query with sort option', (t) => {
    const soql = createSOQL({
      table: 'Opportunity',
      sort: '-CreatedDate',
      limit: 10,
    });
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          'ORDER BY CreatedDate DESC ' +
          'LIMIT 10',
    );
  });

  //
  test('build query with multiple sort option in array', (t) => {
    const soql = createSOQL({
      table: 'Opportunity',
      conditions: {
        'Owner.Name': { $like: 'A%' },
      },
      sort: [['CreatedDate', 'desc'], ['Name', 'asc']] as any, // TODO: remove any
      limit: 10,
    });
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Owner.Name LIKE 'A%' " +
          'ORDER BY CreatedDate DESC, Name ASC ' +
          'LIMIT 10',
    );
  });

  //
  test('build query with multiple sort option in hash', (t) => {
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
    t.true(
      soql ===
        'SELECT Id FROM Opportunity ' +
          "WHERE Owner.Name LIKE 'A%' " +
          'ORDER BY CreatedDate DESC, Name ASC ' +
          'LIMIT 10',
    );
  });
});
