import assert from 'assert';
import nock from 'nock';
import { Connection } from '../src/connection';

describe('SOSL query escaping', () => {
  it('should properly encode SOSL queries with escaped dashes', async () => {
    // Create a connection for testing URL encoding
    const testConnection = new Connection({
      accessToken: 'test-token',
      instanceUrl: 'https://test.salesforce.com',
    });

    // Mock the HTTP request to capture the actual URL that would be sent
    let capturedUrl = '';
    nock('https://test.salesforce.com')
      .get(/\/services\/data\/.*\/search/)
      .query(true)
      .reply(function(uri) {
        capturedUrl = uri;
        return [200, { searchRecords: [] }];
      });

    // Test query with escaped dash
    const soslQuery = 'FIND {test\\-query} IN ALL FIELDS RETURNING Account(Id, Name)';
    
    try {
      await testConnection.search(soslQuery);
    } catch (err) {
      // We don't care about the response, just want to capture the URL
    }

    // The captured URL should preserve the backslash escape sequence
    // The correct encoding for \- should preserve the backslash but URL-encode it as %5C
    assert.ok(capturedUrl.includes('test%5C-query'), 
      `SOSL query should preserve backslash escape sequences as %5C. Got URL: ${capturedUrl}`);
    
    // Clean up nock
    nock.cleanAll();
  });

  it('should properly encode SOSL queries with other special characters', async () => {
    // Create a connection for testing URL encoding
    const testConnection = new Connection({
      accessToken: 'test-token',
      instanceUrl: 'https://test.salesforce.com',
    });

    // Mock the HTTP request to capture the actual URL that would be sent
    let capturedUrl = '';
    nock('https://test.salesforce.com')
      .get(/\/services\/data\/.*\/search/)
      .query(true)  
      .reply(function(uri) {
        capturedUrl = uri;
        return [200, { searchRecords: [] }];
      });

    // Test query with characters that should still be encoded
    const soslQuery = 'FIND {test query with spaces & symbols} IN ALL FIELDS RETURNING Account(Id, Name)';
    
    try {
      await testConnection.search(soslQuery);
    } catch (err) {
      // We don't care about the response, just want to capture the URL
    }

    // Spaces should be encoded as + in query parameters, & should be encoded as %26
    assert.ok(capturedUrl.includes('test+query+with+spaces+%26+symbols'), 
      `SOSL query should encode spaces as + and & as %26. Got URL: ${capturedUrl}`);
      
    // Clean up nock
    nock.cleanAll();
  });
});