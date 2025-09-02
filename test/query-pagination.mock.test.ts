import { Query } from '../src/query';
import { Connection } from '../src/connection';
import type { QueryResult, Record } from '../src/types';

// Mock connection class
class MockConnection extends Connection<any> {
  private mockResponses: any[] = [];
  
  setMockResponses(responses: any[]) {
    this.mockResponses = responses;
  }

  async request<T>(options: { method: string; url: string; headers?: { [key: string]: string } }): Promise<T> {
    if (this.mockResponses.length === 0) {
      throw new Error('No mock responses available');
    }
    return this.mockResponses.shift();
  }
}

describe('Query with mocked pagination', () => {
  let conn: MockConnection;

  beforeEach(() => {
    conn = new MockConnection({});
  });

  it('should handle paginated subquery results when autoFetch is true', async () => {
    // Create mock responses that simulate pagination
    const mockResponses = [
      // First response with main record and first batch of child records
      {
        done: true,
        totalSize: 1,
        records: [{
          Id: '001xx000003DGb2AAG',
          Name: 'Test Account',
          Contacts: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
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
          Id: `003xx${(i + 200).toString().padStart(12, '0')}`,
          LastName: `Contact ${i + 201}`
        })),
        nextRecordsUrl: undefined
      }
    ];

    conn.setMockResponses(mockResponses);

    const result = await conn.query<any>(
      "SELECT Id, Name, (SELECT Id, LastName FROM Contacts) FROM Account WHERE Id='001xx000003DGb2AAG'"
    )
      .autoFetch(true)
      .execute();

    // Verify main query results
    expect(result.records).toHaveLength(1);
    const account = result.records[0];
    expect(account.Name).toBe('Test Account');

    // Verify subquery results
    expect(account.Contacts.records).toHaveLength(250);
    expect(account.Contacts.done).toBe(true);
    expect(account.Contacts.nextRecordsUrl).toBeUndefined();

    // Verify first and last contact records
    expect(account.Contacts.records[0].LastName).toBe('Contact 1');
    expect(account.Contacts.records[249].LastName).toBe('Contact 250');
  });

  it('should handle multiple paginated subqueries when autoFetch is true', async () => {
    const mockResponses = [
      // Initial response with main record and first batch of both child relationships
      {
        done: true,
        totalSize: 1,
        records: [{
          Id: '001xx000003DGb2AAG',
          Name: 'Test Account',
          Contacts: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
              Id: `003xx${i.toString().padStart(12, '0')}`,
              LastName: `Contact ${i + 1}`
            })),
            nextRecordsUrl: '/services/data/v53.0/query/01gxx000000NEXT001'
          },
          Tasks: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
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
          Id: `003xx${(i + 200).toString().padStart(12, '0')}`,
          LastName: `Contact ${i + 201}`
        })),
        nextRecordsUrl: undefined
      },
      // Third response for remaining tasks
      {
        done: true,
        totalSize: 50,
        records: Array.from({ length: 50 }, (_, i) => ({
          Id: `00Txx${(i + 200).toString().padStart(12, '0')}`,
          Subject: `Task ${i + 201}`
        })),
        nextRecordsUrl: undefined
      }
    ];

    conn.setMockResponses(mockResponses);

    const result = await conn.query<any>(
      "SELECT Id, Name, (SELECT Id, LastName FROM Contacts), (SELECT Id, Subject FROM Tasks) FROM Account WHERE Id='001xx000003DGb2AAG'"
    )
      .autoFetch(true)
      .execute();

    // Verify main query results
    expect(result.records).toHaveLength(1);
    const account = result.records[0];
    expect(account.Name).toBe('Test Account');

    // Verify Contacts subquery results
    expect(account.Contacts.records).toHaveLength(250);
    expect(account.Contacts.done).toBe(true);
    expect(account.Contacts.nextRecordsUrl).toBeUndefined();

    // Verify Tasks subquery results
    expect(account.Tasks.records).toHaveLength(250);
    expect(account.Tasks.done).toBe(true);
    expect(account.Tasks.nextRecordsUrl).toBeUndefined();

    // Verify first and last records of both relationships
    expect(account.Contacts.records[0].LastName).toBe('Contact 1');
    expect(account.Contacts.records[249].LastName).toBe('Contact 250');
    expect(account.Tasks.records[0].Subject).toBe('Task 1');
    expect(account.Tasks.records[249].Subject).toBe('Task 250');
  });

  it('should not fetch additional records when autoFetch is false', async () => {
    const mockResponses = [
      {
        done: true,
        totalSize: 1,
        records: [{
          Id: '001xx000003DGb2AAG',
          Name: 'Test Account',
          Contacts: {
            done: false,
            totalSize: 250,
            records: Array.from({ length: 200 }, (_, i) => ({
              Id: `003xx${i.toString().padStart(12, '0')}`,
              LastName: `Contact ${i + 1}`
            })),
            nextRecordsUrl: '/services/data/v53.0/query/01gxx000000NEXT001'
          }
        }]
      }
    ];

    conn.setMockResponses(mockResponses);

    const result = await conn.query<any>(
      "SELECT Id, Name, (SELECT Id, LastName FROM Contacts) FROM Account WHERE Id='001xx000003DGb2AAG'"
    )
      .autoFetch(false)
      .execute();

    // Verify main query results
    expect(result.records).toHaveLength(1);
    const account = result.records[0];
    expect(account.Name).toBe('Test Account');

    // Verify subquery results show pagination is available but not fetched
    expect(account.Contacts.records).toHaveLength(200);
    expect(account.Contacts.done).toBe(false);
    expect(account.Contacts.nextRecordsUrl).toBe('/services/data/v53.0/query/01gxx000000NEXT001');
  });
});
