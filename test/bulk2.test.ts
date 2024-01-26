import assert from 'assert';
import path from 'path';
import fs from './helper/fs';
import { Connection, Date as SfDate, Schema, Record } from 'jsforce';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import { isNodeJS } from './helper/env';
import { BulkOperation, IngestJobV2Results } from 'jsforce/lib/api/bulk';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.bulk2.pollTimeout = 90000; // set bulk2 poll timeout to 90s for tests in this file

async function insertAccounts(
  id: string | number,
  qty: number = 20,
): Promise<IngestJobV2Results<Schema>> {
  if (typeof id === 'number') {
    id = id.toString();
  }

  const insertRecords = [
    ...Array.from(Array(qty), () => ({
      Name: `Bulk Account ${id}`,
    })),
  ];

  const res = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'insert',
    input: insertRecords,
  });

  ensureSuccessfulBulkResults(res, qty, 'insert');

  return res;
}

function ensureSuccessfulBulkResults(
  results: IngestJobV2Results<Schema>,
  qty: number,
  operation: BulkOperation,
) {
  const { successfulResults, failedResults, unprocessedRecords } = results;

  assert.ok(Array.isArray(successfulResults));
  assert.ok(successfulResults.length === qty);

  const recordCreated = operation === 'insert' ? 'true' : 'false';

  for (const successfulResult of successfulResults) {
    assert.ok(isString(successfulResult.sf__Id));
    assert.ok(successfulResult.sf__Created === recordCreated);
  }

  assert.ok(Array.isArray(failedResults));
  assert.ok(failedResults.length === 0);

  assert.ok(Array.isArray(unprocessedRecords));
  assert.ok(unprocessedRecords.length === 0);
}

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

it('should bulk insert records and return result status', async () => {
  const id = Date.now();

  // bulk insert 200 valid records + 1 invalid.
  const records = [
    ...Array.from(Array(200), (a, i) => ({
      Name: `Bulk Account ${id}`,
      NumberOfEmployees: 300 * (i + 1),
    })),
    { BillingState: 'CA' }, // missing required field `Name`, will fail to insert.
  ];

  const {
    successfulResults,
    failedResults,
    unprocessedRecords,
  } = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'insert',
    input: records,
  });

  assert.ok(Array.isArray(successfulResults));

  // should successfully insert the first 200 records.
  assert.ok(successfulResults.length === 200);
  for (const successfulResult of successfulResults) {
    assert.ok(isString(successfulResult.sf__Id));
    assert.ok(successfulResult.sf__Created === 'true');
  }

  assert.ok(Array.isArray(failedResults));
  assert.ok(failedResults.length === 1);
  for (const failedResult of failedResults) {
    assert.ok(failedResult.sf__Id === '');
    assert.ok(isString(failedResult.sf__Error));
    assert.ok(
      failedResult.sf__Error ===
        'REQUIRED_FIELD_MISSING:Required fields are missing: [Name]:Name --',
    );
  }

  assert.ok(Array.isArray(unprocessedRecords));
  assert.ok(unprocessedRecords.length === 0);
});

it('should bulk update and return updated status', async () => {
  const id = Date.now();

  await insertAccounts(id);

  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } }, ['Id', 'Name'])
    .execute();

  const updatedRecords = records.map((rec) => ({
    ...rec,
    Name: `${rec.Name} (Updated)`,
  }));

  const res = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'update',
    input: updatedRecords,
  });

  ensureSuccessfulBulkResults(res, 20, 'update');
});

it('should bulk update with empty input and not raise client input error', async () => {
  const {
    successfulResults,
    failedResults,
    unprocessedRecords,
  } = await conn.bulk2.loadAndWaitForResults({
    operation: 'insert',
    object: 'Account',
    input: [],
  });
  assert.ok(Array.isArray(successfulResults) && successfulResults.length === 0);
  assert.ok(Array.isArray(failedResults) && failedResults.length === 0);
  assert.ok(
    Array.isArray(unprocessedRecords) && unprocessedRecords.length === 0,
  );
});

it('should bulk delete and return deleted status', async () => {
  const id = Date.now();

  await insertAccounts(id);

  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .execute();

  const res = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'delete',
    input: records,
  });

  ensureSuccessfulBulkResults(res, 20, 'delete');
});

it('should bulk delete with empty input and not raise client input error', async () => {
  const {
    successfulResults,
    failedResults,
    unprocessedRecords,
  } = await conn.bulk2.loadAndWaitForResults({
    operation: 'delete',
    object: 'Account',
    input: [],
  });
  assert.ok(Array.isArray(successfulResults) && successfulResults.length === 0);
  assert.ok(Array.isArray(failedResults) && failedResults.length === 0);
  assert.ok(
    Array.isArray(unprocessedRecords) && unprocessedRecords.length === 0,
  );
});

// /*------------------------------------------------------------------------*/
if (isNodeJS()) {
  it('should bulk insert from file and return inserted results', async () => {
    // insert 100 account records from csv file
    const csvStream = fs.createReadStream(
      path.join(__dirname, 'data/Account_bulk2_test.csv'),
    );

    const res = await conn.bulk2.loadAndWaitForResults({
      object: 'Account',
      operation: 'insert',
      input: csvStream,
    });

    try {
      ensureSuccessfulBulkResults(res, 100, 'insert');
    } finally {
      // cleanup:
      // always delete successfully inserted records.
      const deleteRecords = res.successfulResults.map((r) => ({
        Id: r.sf__Id,
      }));

      await conn.bulk2.loadAndWaitForResults({
        object: 'Account',
        operation: 'delete',
        input: deleteRecords,
      });
    }
  });

  it('should bulk delete from file and return deleted results', async () => {
    const id = Date.now();

    await insertAccounts(id);

    const records = await conn
      .sobject('Account')
      .find({ Name: { $like: `Bulk Account ${id}%` } });
    const data = `Id\n${records.map((r: Record) => r.Id).join('\n')}\n`;
    const deleteFile = path.join(__dirname, 'data/Account_delete.csv');

    await fs.promises.writeFile(deleteFile, data);

    const fstream = fs.createReadStream(deleteFile);
    const res = await conn.bulk2.loadAndWaitForResults({
      object: 'Account',
      operation: 'delete',
      input: fstream,
    });

    ensureSuccessfulBulkResults(res, 20, 'delete');
    await fs.promises.rm(deleteFile);
  });

  it('should bulk query and get records', async () => {
    const count = await conn.sobject(config.bigTable).count({});
    const records = await conn.bulk2.query(
      `SELECT Id, Name FROM ${config.bigTable}`,
    );
    assert.ok(Array.isArray(records) && records.length === count);
    for (const rec of records) {
      assert.ok(isString(rec.Id));
      assert.ok(isString(rec.Name));
    }
  });
}

/*------------------------------------------------------------------------*/
it('should call bulk api from invalid session conn with refresh fn, and return result', async () => {
  const accounts = Array.from(Array(100), (_a, i) => ({
    Name: `Session Expiry Test #${i}`,
  }));
  const bulkInsert = await conn.bulk2.loadAndWaitForResults({
    operation: 'insert',
    object: 'Account',
    input: accounts,
  });

  let refreshCalled = false;
  const conn2 = new Connection({
    instanceUrl: conn.instanceUrl,
    accessToken: 'invalid_token',
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl,
    refreshFn: (_c, callback) => {
      refreshCalled = true;
      setTimeout(() => callback(null, conn.accessToken ?? undefined), 500);
    },
  });

  conn2.bulk2.pollTimeout = 90000;

  const deleteRecords = bulkInsert.successfulResults.map((r) => ({
    Id: r.sf__Id,
  }));

  const bulkDelete = await conn2.bulk2.loadAndWaitForResults({
    operation: 'delete',
    object: 'Account',
    input: deleteRecords,
  });
  assert.ok(refreshCalled);
  ensureSuccessfulBulkResults(bulkDelete, 100, 'delete');
});

it('should call bulk api from invalid session conn without refresh fn, and raise error', async () => {
  const conn3 = new Connection({
    instanceUrl: conn.instanceUrl,
    accessToken: 'invalid_token',
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl,
  });

  conn3.bulk2.pollTimeout = 90000;

  const records = [{ Name: 'Impossible Bulk Account #1' }];
  try {
    await conn3.bulk2.loadAndWaitForResults({
      object: 'Account',
      operation: 'insert',
      input: records,
    });
    assert.fail();
  } catch (err) {
    assert.ok(isObject(err));
    assert.ok(err.name === 'INVALID_SESSION_ID');
  }
});

/*------------------------------------------------------------------------*/
// The num should be more than 200 which fallback from SObject collection API
const bulkAccountNum = 250;

it('should bulk update using Query#update and return updated status', async () => {
  const id = Date.now();

  const accounts = Array.from(Array(bulkAccountNum), (_a, i) => ({
    Name: `Bulk Account ${id} #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));

  const res = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'insert',
    input: accounts,
  });

  ensureSuccessfulBulkResults(res, bulkAccountNum, 'insert');

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .update(
      {
        Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
        BillingState: null,
      },
      {
        bulkApiVersion: 2,
      },
    );

  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === bulkAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }

  const updatedRecords = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } }, 'Id, Name, BillingState');

  assert.ok(Array.isArray(updatedRecords));
  assert.ok(updatedRecords.length === bulkAccountNum);
  for (const record of updatedRecords) {
    assert.ok(isString(record.Id));
    assert.ok(/\(Updated\)$/.test(record.Name));
    assert.ok(record.BillingState === null);
  }
});

it('should bulk update using Query#update with unmatching query and return empty array records', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } }) // should not match any records
    .update(
      {
        Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
        BillingState: null,
      },
      {
        bulkApiVersion: 2,
      },
    );
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === 0);
});

it('should bulk delete using Query#destroy and return deleted status', async () => {
  const id = Date.now();

  await insertAccounts(id, bulkAccountNum);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .destroy({
      bulkApiVersion: 2,
    });
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === bulkAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

it('should bulk delete using Query#destroy with unmatching query and return empty array records', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } })
    .destroy({
      bulkApiVersion: 2,
    });
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === 0);
});

/*------------------------------------------------------------------------*/
// This is usually small num to use Bulk API, but forcely use it by modifying bulkThreshold num
const smallAccountNum = 20;

it('should bulk update using Query#update with bulkThreshold modified and return updated status', async () => {
  const id = Date.now();

  const records = Array.from({ length: smallAccountNum }).map((_, i) => ({
    Name: `Bulk Account ${id} #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));

  const res = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'insert',
    input: records,
  });

  ensureSuccessfulBulkResults(res, smallAccountNum, 'insert');

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .update(
      {
        Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
        BillingState: null,
      },
      { bulkThreshold: 0, bulkApiVersion: 2 },
    );
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === smallAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }

  const updatedRecords = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } }, 'Id, Name, BillingState');

  assert.ok(Array.isArray(updatedRecords));
  assert.ok(records.length === smallAccountNum);
  for (const record of updatedRecords) {
    assert.ok(isString(record.Id));
    assert.ok(/\(Updated\)$/.test(record.Name));
    assert.ok(record.BillingState === null);
  }
});

/**
 *
 */
it('should bulk delete using Query#destroy with bulkThreshold modified and return deleted status', async () => {
  const id = Date.now();

  await insertAccounts(id, smallAccountNum);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .destroy({ bulkThreshold: 0, bulkApiVersion: 2 });

  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === smallAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

afterAll(async () => {
  await connMgr.closeConnection(conn);
});
