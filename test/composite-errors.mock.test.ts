import { Connection } from 'jsforce';
import { StreamPromise } from '../lib/util/promise';

// Connection whose request() returns canned responses instead of hitting Salesforce
class MockConnection extends Connection<any> {
  response: any;

  request<R = any>(): StreamPromise<R> {
    const promise = Promise.resolve(
      JSON.parse(JSON.stringify(this.response)),
    ) as StreamPromise<R>;
    promise.stream = () => {
      throw new Error('Stream not implemented in mock');
    };
    return promise;
  }
}

const compositeResponse = [
  {
    success: false,
    errors: [
      {
        statusCode: 'DUPLICATES_DETECTED',
        message: 'Use one of these records?',
        fields: [],
      },
    ],
  },
  { success: true, id: '001000000000001AAA', errors: [] },
];

describe('Composite API error mapping (statusCode -> errorCode)', () => {
  let conn: MockConnection;

  beforeEach(() => {
    conn = new MockConnection({});
    conn.response = compositeResponse;
  });

  const expectMapped = (results: any) => {
    expect(results[0].success).toBe(false);
    expect(results[0].errors[0].errorCode).toBe('DUPLICATES_DETECTED');
    expect(results[0].errors[0].statusCode).toBe('DUPLICATES_DETECTED');
    expect(results[0].errors[0].message).toBe('Use one of these records?');
    expect(results[1]).toEqual({
      success: true,
      id: '001000000000001AAA',
      errors: [],
    });
  };

  it('create maps statusCode to errorCode', async () => {
    expectMapped(
      await conn.create('Asset', [{ Name: 'a' }, { Name: 'b' }]),
    );
  });

  it('update maps statusCode to errorCode', async () => {
    expectMapped(
      await conn.update('Asset', [
        { Id: '001000000000001AAA', Name: 'a' },
        { Id: '001000000000002AAA', Name: 'b' },
      ]),
    );
  });

  it('upsert maps statusCode to errorCode', async () => {
    expectMapped(
      await conn.upsert(
        'Asset',
        [{ Ext__c: '1' }, { Ext__c: '2' }],
        'Ext__c',
      ),
    );
  });

  it('leaves existing errorCode untouched', async () => {
    conn.response = [
      {
        success: false,
        errors: [{ errorCode: 'REQUIRED_FIELD_MISSING', message: 'x' }],
      },
    ];
    const [res] = (await conn.create('Asset', [{ Name: 'a' }])) as any[];
    expect(res.errors[0].errorCode).toBe('REQUIRED_FIELD_MISSING');
    expect(res.errors[0].statusCode).toBeUndefined();
  });
});
