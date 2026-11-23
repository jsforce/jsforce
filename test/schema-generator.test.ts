import { collectUsedJsforceTypes } from '../src/schema/generator';
import type { DescribeSObjectResult } from '../src/types/common';

function makeSobject(
  name: string,
  fieldTypes: string[],
): DescribeSObjectResult {
  return {
    name,
    fields: fieldTypes.map((type, i) => ({ name: `Field${i}`, type, nillable: false }) as any),
    childRelationships: [],
  } as unknown as DescribeSObjectResult;
}

describe('collectUsedJsforceTypes', () => {
  it('returns empty set when no conditional types are used', () => {
    const sobjects = [makeSobject('Obj', ['string', 'boolean', 'int', 'double'])];
    expect(collectUsedJsforceTypes(sobjects)).toEqual(new Set());
  });

  it('detects DateString for date, datetime, and time fields', () => {
    const sobjects = [makeSobject('Obj', ['date'])];
    expect(collectUsedJsforceTypes(sobjects)).toEqual(new Set(['DateString']));

    const sobjects2 = [makeSobject('Obj', ['datetime'])];
    expect(collectUsedJsforceTypes(sobjects2)).toEqual(new Set(['DateString']));

    const sobjects3 = [makeSobject('Obj', ['time'])];
    expect(collectUsedJsforceTypes(sobjects3)).toEqual(new Set(['DateString']));
  });

  it('detects BlobString for base64 fields', () => {
    const sobjects = [makeSobject('Obj', ['base64'])];
    expect(collectUsedJsforceTypes(sobjects)).toEqual(new Set(['BlobString']));
  });

  it('detects Address for address fields', () => {
    const sobjects = [makeSobject('Obj', ['address'])];
    expect(collectUsedJsforceTypes(sobjects)).toEqual(new Set(['Address']));
  });

  it('detects multiple types across multiple sobjects', () => {
    const sobjects = [
      makeSobject('A', ['date', 'string']),
      makeSobject('B', ['base64', 'address']),
    ];
    expect(collectUsedJsforceTypes(sobjects)).toEqual(
      new Set(['DateString', 'BlobString', 'Address']),
    );
  });

  it('respects filterObjects — excludes types from filtered-out sobjects', () => {
    const sobjects = [
      makeSobject('Included', ['string']),
      makeSobject('Excluded', ['base64', 'address']),
    ];
    const filter = new Set(['Included']);
    expect(collectUsedJsforceTypes(sobjects, filter)).toEqual(new Set());
  });

  it('respects filterObjects — includes types from allowed sobjects', () => {
    const sobjects = [
      makeSobject('Included', ['date']),
      makeSobject('Excluded', ['base64']),
    ];
    const filter = new Set(['Included']);
    expect(collectUsedJsforceTypes(sobjects, filter)).toEqual(
      new Set(['DateString']),
    );
  });
});
