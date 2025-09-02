import { Query } from '../lib/query';
import { Connection } from '../lib/connection';
import type { Record } from '../lib/types';
import type { StreamPromise } from '../src/util/promise';

interface QueryResult<T> {
    done: boolean;
    totalSize: number;
    records: T[];
    nextRecordsUrl?: string;
}

interface MockRecord extends Record {
    Id: string;
    Name?: string;
    LastName?: string;
    Subject?: string;
    Contacts?: QueryResult<MockRecord>;
    Tasks?: QueryResult<MockRecord>;
}

// Mock connection class
class MockConnection extends Connection<any> {
    private mockResponses: Array<QueryResult<MockRecord>> = [];
  
    setMockResponses(responses: Array<QueryResult<MockRecord>>): void {
    this.mockResponses = responses;
  }

    // Override the request method to return mock responses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request<R = any>(request: any, options?: any): StreamPromise<R> {
    if (this.mockResponses.length === 0) {
      throw new Error('No mock responses available');
    }
        const response = this.mockResponses.shift() as R;
        const promise = Promise.resolve(response) as StreamPromise<R>;
        // Add stream method to satisfy StreamPromise interface
        promise.stream = () => {
            throw new Error('Stream not implemented in mock');
        };
        return promise;
  }
}

describe('Query with mocked pagination', () => {
  let conn: MockConnection;

  beforeEach(() => {
    conn = new MockConnection({});
  });

  it('should handle paginated subquery results when autoFetch is true', async () => {
    // Create mock responses that simulate pagination
      const mockResponses: Array<QueryResult<MockRecord>> = [
      // First response with main record and first batch of child records
      {
        done: true,
        totalSize: 1,
        records: [{
            attributes: { type: 'Account', url: '/services/data/v53.0/sobjects/Account/001xx000003DGb2AAG' },
          Id: '001xx000003DGb2AAG',
          Name: 'Test Account',
          Contacts: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
                attributes: { type: 'Contact', url: `/services/data/v53.0/sobjects/Contact/003xx${i.toString().padStart(12, '0')}` },
              Id: `003xx${i.toString().padStart(12, '0')}`,
              LastName: `Contact ${i + 1}`
            })),
            nextRecordsUrl: '/services/data/v53.0/query/01gxx000000NEXT001'
          }
        }]
      },
      // Second response for the remaining child records
      {
        done: true,
        totalSize: 50,
        records: Array.from({ length: 50 }, (_, i) => ({
            attributes: { type: 'Contact', url: `/services/data/v53.0/sobjects/Contact/003xx${(i + 200).toString().padStart(12, '0')}` },
          Id: `003xx${(i + 200).toString().padStart(12, '0')}`,
          LastName: `Contact ${i + 201}`
        }))
      }
    ];

    conn.setMockResponses(mockResponses);

      const result = await conn.query<MockRecord>(
      "SELECT Id, Name, (SELECT Id, LastName FROM Contacts) FROM Account WHERE Id='001xx000003DGb2AAG'"
    )
      .autoFetch(true)
      .execute();

    // Verify main query results
    expect(result.records).toHaveLength(1);
    const account = result.records[0];
    expect(account.Name).toBe('Test Account');

    // Verify subquery results
      expect(account.Contacts?.records).toHaveLength(250);
      expect(account.Contacts?.done).toBe(true);
      expect(account.Contacts?.nextRecordsUrl).toBeUndefined();

    // Verify first and last contact records
      expect(account.Contacts?.records[0].LastName).toBe('Contact 1');
      expect(account.Contacts?.records[249].LastName).toBe('Contact 250');
  });

  it('should handle multiple paginated subqueries when autoFetch is true', async () => {
      const mockResponses: Array<QueryResult<MockRecord>> = [
      // Initial response with main record and first batch of both child relationships
      {
        done: true,
        totalSize: 1,
        records: [{
            attributes: { type: 'Account', url: '/services/data/v53.0/sobjects/Account/001xx000003DGb2AAG' },
          Id: '001xx000003DGb2AAG',
          Name: 'Test Account',
          Contacts: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
                attributes: { type: 'Contact', url: `/services/data/v53.0/sobjects/Contact/003xx${i.toString().padStart(12, '0')}` },
              Id: `003xx${i.toString().padStart(12, '0')}`,
              LastName: `Contact ${i + 1}`
            })),
            nextRecordsUrl: '/services/data/v53.0/query/01gxx000000NEXT001'
          },
          Tasks: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
                attributes: { type: 'Task', url: `/services/data/v53.0/sobjects/Task/00Txx${i.toString().padStart(12, '0')}` },
              Id: `00Txx${i.toString().padStart(12, '0')}`,
              Subject: `Task ${i + 1}`
            })),
            nextRecordsUrl: '/services/data/v53.0/query/01gxx000000NEXT002'
          }
        }]
      },
      // Second response for remaining contacts
      {
        done: true,
        totalSize: 50,
        records: Array.from({ length: 50 }, (_, i) => ({
            attributes: { type: 'Contact', url: `/services/data/v53.0/sobjects/Contact/003xx${(i + 200).toString().padStart(12, '0')}` },
          Id: `003xx${(i + 200).toString().padStart(12, '0')}`,
          LastName: `Contact ${i + 201}`
        }))
      },
      // Third response for remaining tasks
      {
        done: true,
        totalSize: 50,
        records: Array.from({ length: 50 }, (_, i) => ({
            attributes: { type: 'Task', url: `/services/data/v53.0/sobjects/Task/00Txx${(i + 200).toString().padStart(12, '0')}` },
          Id: `00Txx${(i + 200).toString().padStart(12, '0')}`,
          Subject: `Task ${i + 201}`
        }))
      }
    ];

    conn.setMockResponses(mockResponses);

      const result = await conn.query<MockRecord>(
      "SELECT Id, Name, (SELECT Id, LastName FROM Contacts), (SELECT Id, Subject FROM Tasks) FROM Account WHERE Id='001xx000003DGb2AAG'"
    )
      .autoFetch(true)
      .execute();

    // Verify main query results
    expect(result.records).toHaveLength(1);
    const account = result.records[0];
    expect(account.Name).toBe('Test Account');

    // Verify Contacts subquery results
      expect(account.Contacts?.records).toHaveLength(250);
      expect(account.Contacts?.done).toBe(true);
      expect(account.Contacts?.nextRecordsUrl).toBeUndefined();

    // Verify Tasks subquery results
      expect(account.Tasks?.records).toHaveLength(250);
      expect(account.Tasks?.done).toBe(true);
      expect(account.Tasks?.nextRecordsUrl).toBeUndefined();

    // Verify first and last records of both relationships
      expect(account.Contacts?.records[0].LastName).toBe('Contact 1');
      expect(account.Contacts?.records[249].LastName).toBe('Contact 250');
      expect(account.Tasks?.records[0].Subject).toBe('Task 1');
      expect(account.Tasks?.records[249].Subject).toBe('Task 250');
  });

  it('should not fetch additional records when autoFetch is false', async () => {
      const mockResponses: Array<QueryResult<MockRecord>> = [
      {
        done: true,
        totalSize: 1,
        records: [{
            attributes: { type: 'Account', url: '/services/data/v53.0/sobjects/Account/001xx000003DGb2AAG' },
          Id: '001xx000003DGb2AAG',
          Name: 'Test Account',
          Contacts: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
                attributes: { type: 'Contact', url: `/services/data/v53.0/sobjects/Contact/003xx${i.toString().padStart(12, '0')}` },
              Id: `003xx${i.toString().padStart(12, '0')}`,
              LastName: `Contact ${i + 1}`
            })),
            nextRecordsUrl: '/services/data/v53.0/query/01gxx000000NEXT001'
          }
        }]
      }
    ];

    conn.setMockResponses(mockResponses);

      const result = await conn.query<MockRecord>(
      "SELECT Id, Name, (SELECT Id, LastName FROM Contacts) FROM Account WHERE Id='001xx000003DGb2AAG'"
    )
      .autoFetch(false)
      .execute();

    // Verify main query results
    expect(result.records).toHaveLength(1);
    const account = result.records[0];
    expect(account.Name).toBe('Test Account');

    // Verify subquery results show pagination is available but not fetched
      expect(account.Contacts?.records).toHaveLength(200);
      expect(account.Contacts?.done).toBe(false);
      expect(account.Contacts?.nextRecordsUrl).toBe('/services/data/v53.0/query/01gxx000000NEXT001');
  });
});