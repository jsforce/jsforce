import assert from 'assert';
import { getCSVColumns, toCSV } from '../src/csv';

it('should include columns that first appear in later records', () => {
  const records = [
    { Name: 'First' },
    { Name: 'Second', Extra__c: 'only later' },
    { Name: 'Third', Extra__c: 'another value' },
    { Name: 'Fourth' },
    { Name: 'Fifth', Extra__c: 'last value', Extra2__c: 'never used' },
  ];

  assert.deepStrictEqual(getCSVColumns(records), ['Name', 'Extra__c', 'Extra2__c']);
  assert.strictEqual(
    toCSV(records),
    [
      'Name,Extra__c,Extra2__c',
      'First,,',
      'Second,only later,',
      'Third,another value,',
      'Fourth,,',
      'Fifth,last value,never used',
      '',
    ].join('\n'),
  );
});