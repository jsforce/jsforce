import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import type { Record } from 'jsforce';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 * Setup test data - create an account with more than 200 contacts
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
  
  // Create test account
  const account = await conn.sobject('Account').create({
    Name: 'Test Account For Pagination'
  });

  if (!account.success) {
    throw new Error('Failed to create test account');
  }

  // Create 250 contacts for the account (should trigger pagination)
  const contacts = [];
  for (let i = 1; i <= 250; i++) {
    contacts.push({
      LastName: `Contact ${i}`,
      AccountId: account.id
    });
  }

  // Insert contacts in batches to avoid limits
  for (let i = 0; i < contacts.length; i += 200) {
    const batch = contacts.slice(i, i + 200);
    await conn.sobject('Contact').create(batch);
  }
});

/**
 * Clean up test data
 */
afterAll(async () => {
  // Delete test account (will cascade delete contacts)
  const accounts = await conn.query("SELECT Id FROM Account WHERE Name = 'Test Account For Pagination'");
  if (accounts.records.length > 0) {
    await conn.sobject('Account').destroy(accounts.records.map(record => record.Id));
  }
});

describe('query with large subquery results', () => {
  it('should fetch all subquery records when autoFetch is true', async () => {
    const result = await conn.query("SELECT Id, Name, (SELECT Id, LastName FROM Contacts) FROM Account WHERE Name = 'Test Account For Pagination'")
      .autoFetch(true)
      .execute();

    assert.ok(Array.isArray(result.records));
    assert.strictEqual(result.records.length, 1);

    const account = result.records[0];
    assert.ok(account.Contacts);
    assert.ok(Array.isArray(account.Contacts.records));
    assert.strictEqual(account.Contacts.records.length, 250);
    assert.strictEqual(account.Contacts.done, true);
    assert.strictEqual(account.Contacts.nextRecordsUrl, undefined);

    // Verify we got all contacts with correct naming pattern
    const contactNames = new Set(account.Contacts.records.map(c => c.LastName));
    for (let i = 1; i <= 250; i++) {
      assert.ok(contactNames.has(`Contact ${i}`), `Missing Contact ${i}`);
    }
  });

  it('should only fetch first batch when autoFetch is false', async () => {
    const result = await conn.query("SELECT Id, Name, (SELECT Id, LastName FROM Contacts) FROM Account WHERE Name = 'Test Account For Pagination'")
      .autoFetch(false)
      .execute();

    assert.ok(Array.isArray(result.records));
    assert.strictEqual(result.records.length, 1);

    const account = result.records[0];
    assert.ok(account.Contacts);
    assert.ok(Array.isArray(account.Contacts.records));
    
    // Should only have first batch (usually 200 records)
    assert.ok(account.Contacts.records.length <= 200);
    
    // Should indicate more records are available
    if (account.Contacts.records.length < 250) {
      assert.strictEqual(account.Contacts.done, false);
      assert.ok(account.Contacts.nextRecordsUrl);
    }
  });

  it('should handle multiple subqueries with pagination', async () => {
    // First create some tasks for the account
    const account = (await conn.query("SELECT Id FROM Account WHERE Name = 'Test Account For Pagination'")).records[0];
    
    const tasks = [];
    for (let i = 1; i <= 250; i++) {
      tasks.push({
        Subject: `Task ${i}`,
        WhatId: account.Id
      });
    }

    // Insert tasks in batches
    for (let i = 0; i < tasks.length; i += 200) {
      const batch = tasks.slice(i, i + 200);
      await conn.sobject('Task').create(batch);
    }

    // Query both contacts and tasks
    const result = await conn.query(`
      SELECT Id, Name,
        (SELECT Id, LastName FROM Contacts),
        (SELECT Id, Subject FROM Tasks)
      FROM Account WHERE Name = 'Test Account For Pagination'
    `)
      .autoFetch(true)
      .execute();

    assert.ok(Array.isArray(result.records));
    assert.strictEqual(result.records.length, 1);

    const accountWithBoth = result.records[0];
    
    // Verify contacts
    assert.ok(accountWithBoth.Contacts);
    assert.ok(Array.isArray(accountWithBoth.Contacts.records));
    assert.strictEqual(accountWithBoth.Contacts.records.length, 250);
    assert.strictEqual(accountWithBoth.Contacts.done, true);
    assert.strictEqual(accountWithBoth.Contacts.nextRecordsUrl, undefined);

    // Verify tasks
    assert.ok(accountWithBoth.Tasks);
    assert.ok(Array.isArray(accountWithBoth.Tasks.records));
    assert.strictEqual(accountWithBoth.Tasks.records.length, 250);
    assert.strictEqual(accountWithBoth.Tasks.done, true);
    assert.strictEqual(accountWithBoth.Tasks.nextRecordsUrl, undefined);

    // Clean up tasks
    const taskIds = accountWithBoth.Tasks.records.map(task => task.Id);
    await conn.sobject('Task').destroy(taskIds);
  });
});
