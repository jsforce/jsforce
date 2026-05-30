import assert from 'assert';
import { toStringLiteral, getActivePicklistValues, buildPicklistUnion } from '../src/schema/generator';

describe('toStringLiteral', () => {
  it('wraps a plain value in single quotes', () => {
    assert.strictEqual(toStringLiteral('Closed Won'), "'Closed Won'");
  });

  it('escapes single quotes', () => {
    assert.strictEqual(toStringLiteral("O'Brien"), "'O\\'Brien'");
  });

  it('escapes backslashes', () => {
    assert.strictEqual(toStringLiteral('a\\b'), "'a\\\\b'");
  });

  it('escapes a backslash immediately followed by a single quote', () => {
    assert.strictEqual(toStringLiteral("a\\'b"), "'a\\\\\\'b'");
  });
});

describe('getActivePicklistValues', () => {
  it('returns [] when picklistValues is missing', () => {
    assert.deepStrictEqual(getActivePicklistValues(null), []);
    assert.deepStrictEqual(getActivePicklistValues(undefined), []);
  });

  it('keeps only active entries and maps to .value', () => {
    const result = getActivePicklistValues([
      { active: true, value: 'A' },
      { active: false, value: 'B' },
      { active: true, value: 'C' },
    ]);
    assert.deepStrictEqual(result, ['A', 'C']);
  });

  it('uses value, not label', () => {
    const result = getActivePicklistValues([
      { active: true, value: 'api_val', label: 'Pretty Label' },
    ]);
    assert.deepStrictEqual(result, ['api_val']);
  });

  it('de-duplicates while preserving order', () => {
    const result = getActivePicklistValues([
      { active: true, value: 'A' },
      { active: true, value: 'A' },
      { active: true, value: 'B' },
    ]);
    assert.deepStrictEqual(result, ['A', 'B']);
  });

  it('returns [] when all entries are inactive', () => {
    assert.deepStrictEqual(
      getActivePicklistValues([
        { active: false, value: 'A' },
        { active: false, value: 'B' },
      ]),
      [],
    );
  });

  it('an inactive entry does not block a later active entry with the same value', () => {
    assert.deepStrictEqual(
      getActivePicklistValues([
        { active: false, value: 'A' },
        { active: true, value: 'A' },
      ]),
      ['A'],
    );
  });
});

describe('buildPicklistUnion', () => {
  it('returns null for non-picklist fields', () => {
    assert.strictEqual(
      buildPicklistUnion('Opportunity', { name: 'Amount', type: 'currency' }),
      null,
    );
  });

  it('returns null when there are no active values', () => {
    assert.strictEqual(
      buildPicklistUnion('Opportunity', {
        name: 'StageName',
        type: 'picklist',
        picklistValues: [{ active: false, value: 'Old' }],
      }),
      null,
    );
  });

  it('builds an exported union from active values for a picklist', () => {
    const decl = buildPicklistUnion('Opportunity', {
      name: 'StageName',
      type: 'picklist',
      picklistValues: [
        { active: true, value: 'Qualification' },
        { active: true, value: 'Closed Won' },
      ],
    });
    assert.strictEqual(
      decl,
      "export type PicklistValues$Opportunity$StageName =\n" +
        "  | 'Qualification'\n" +
        "  | 'Closed Won';",
    );
  });

  it('builds a union for multipicklist fields too', () => {
    const decl = buildPicklistUnion('Account', {
      name: 'Domains__c',
      type: 'multipicklist',
      picklistValues: [{ active: true, value: 'A' }],
    });
    assert.strictEqual(
      decl,
      "export type PicklistValues$Account$Domains__c =\n  | 'A';",
    );
  });

  it('escapes special characters in values', () => {
    const decl = buildPicklistUnion('Account', {
      name: 'Owner__c',
      type: 'picklist',
      picklistValues: [{ active: true, value: "O'Brien" }],
    });
    assert.strictEqual(
      decl,
      "export type PicklistValues$Account$Owner__c =\n  | 'O\\'Brien';",
    );
  });

  it('returns null for a picklist with null/absent picklistValues', () => {
    assert.strictEqual(
      buildPicklistUnion('Opportunity', { name: 'StageName', type: 'picklist' }),
      null,
    );
    assert.strictEqual(
      buildPicklistUnion('Opportunity', {
        name: 'StageName',
        type: 'picklist',
        picklistValues: null,
      }),
      null,
    );
  });
});
