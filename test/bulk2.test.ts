import assert from 'assert';
import path from 'path';
import fs from './helper/fs';
import { Connection, Date as SfDate } from 'jsforce';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import { isNodeJS } from './helper/env';
import { beforeAll, it, afterAll } from '@jest/globals';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.bulk2.pollTimeout = 40 * 1000; // adjust poll timeout to test timeout.

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

it('should bulk insert records and return result status', async () => {
  const records = [
    ...Array.from(Array(200), (a, i) => ({
      Name: `Bulk Account #${i + 1}`,
      NumberOfEmployees: 300 * (i + 1),
    })),
    { BillingState: 'CA' }, // should raise error
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
  }

  assert.ok(Array.isArray(unprocessedRecords));
  assert.ok(unprocessedRecords.length === 0);
});

it('should bulk update and return updated status', async () => {
  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: 'Bulk Account%' } }, ['Id', 'Name'])
    .execute();

  const updatedRecords = records.map((rec) => ({
    ...rec,
    Name: `${rec.Name} (Updated)`,
  }));

  const { successfulResults } = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'update',
    input: updatedRecords,
  });

  assert.ok(Array.isArray(successfulResults));
  for (const successfulResult of successfulResults) {
    assert.ok(isString(successfulResult.sf__Id));
    assert.ok(successfulResult.sf__Created === 'false');
  }
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
  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: 'Bulk Account%' } })
    .execute();

  const { successfulResults } = await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'delete',
    input: records,
  });

  assert.ok(Array.isArray(successfulResults));
  for (const successfulResult of successfulResults) {
    assert.ok(isString(successfulResult.sf__Id));
    assert.ok(successfulResult.sf__Created === 'false');
  }
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
    const csvStream = fs.createReadStream(
      path.join(__dirname, 'data/Account.csv'),
    );

    const { successfulResults } = await conn.bulk2.loadAndWaitForResults({
      object: 'Account',
      operation: 'insert',
      input: csvStream,
    });

    assert.ok(Array.isArray(successfulResults));
    for (const successfulResult of successfulResults) {
      assert.ok(isString(successfulResult.sf__Id));
      assert.ok(successfulResult.sf__Created === 'true');
    }
  });

  it('should bulk delete from file and return deleted results', async () => {
    const records = await conn
      .sobject('Account')
      .find({ Name: { $like: 'Bulk Account%' } });
    const data = `Id\n${records.map((r: any) => r.Id).join('\n')}\n`;
    const deleteFileName = path.join(__dirname, 'data/Account_delete.csv');
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(deleteFileName, data, (err) =>
        err ? reject(err) : resolve(),
      );
    });
    const fstream = fs.createReadStream(deleteFileName);
    const { successfulResults } = await conn.bulk2.loadAndWaitForResults({
      object: 'Account',
      operation: 'delete',
      input: fstream,
    });
    assert.ok(Array.isArray(successfulResults));
    for (const ret of successfulResults) {
      assert.ok(isString(ret.sf__Id));
      assert.ok(ret.sf__Created === 'false');
    }
  });

  it('should bulk query and get records', async () => {
    const count = await conn.sobject(config.bigTable).count({});
    const records = await conn.bulk2.query(
      `SELECT Id, Name FROM ${config.bigTable}`,
    );
    assert.ok(Array.isArray(records) && records.length === count);
    for (const rec of records) {
      assert.ok(isString(rec.Id));
      // assert.ok(isString(rec.Name));
    }
  });
}

/*------------------------------------------------------------------------*/
it('should call bulk api from invalid session conn with refresh fn, and return result', async () => {
  const accounts = Array.from(Array(100), (a, i) => ({
    Name: `Session Expiry Test #${i}`,
  }));
  const bulkInsert = await conn.bulk2.loadAndWaitForResults({
    operation: 'insert',
    object: 'Account',
    input: accounts,
  });
  const deleteRecords = bulkInsert.successfulResults.map((r) => ({
    Id: r.sf__Id ?? undefined,
  }));
  let refreshCalled = false;
  const conn2 = new Connection({
    instanceUrl: conn.instanceUrl,
    accessToken: 'invalid_token',
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl,
    refreshFn: (c, callback) => {
      refreshCalled = true;
      setTimeout(() => callback(null, conn.accessToken ?? undefined), 500);
    },
  });
  const bulkDelete = await conn2.bulk2.loadAndWaitForResults({
    operation: 'delete',
    object: 'Account',
    input: deleteRecords,
  });
  assert.ok(refreshCalled);
  assert.ok(Array.isArray(bulkDelete.successfulResults));
  assert.ok(bulkDelete.successfulResults.length === 100);
  for (const ret of bulkDelete.successfulResults) {
    assert.ok(isString(ret.sf__Id));
    assert.ok(ret.sf__Created === 'false');
  }
});

it('should call bulk api from invalid session conn without refresh fn, and raise error', async () => {
  const conn3 = new Connection({
    instanceUrl: conn.instanceUrl,
    accessToken: 'invalid_token',
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl,
  });
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
  const accounts = Array.from(Array(bulkAccountNum), (a, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'insert',
    input: accounts,
  });
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
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

  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } }, 'Id, Name, BillingState');
  assert.ok(Array.isArray(records));
  assert.ok(records.length === bulkAccountNum);
  for (const record of records) {
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
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
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
  const records = Array.from({ length: smallAccountNum }).map((_, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.bulk2.loadAndWaitForResults({
    object: 'Account',
    operation: 'insert',
    input: records,
  });

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
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
  const urecords = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } }, 'Id, Name, BillingState');
  assert.ok(Array.isArray(urecords));
  assert.ok(records.length === smallAccountNum);
  for (const record of urecords) {
    assert.ok(isString(record.Id));
    assert.ok(/\(Updated\)$/.test(record.Name));
    assert.ok(record.BillingState === null);
  }
});

/**
 *
 */
it('should bulk delete using Query#destroy with bulkThreshold modified and return deleted status', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
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
