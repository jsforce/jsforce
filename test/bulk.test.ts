import assert from 'assert';
import path from 'path';
import fs from './helper/fs';
import { Connection, Date as SfDate, Record } from 'jsforce';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import { isNodeJS } from './helper/env';
import { BulkIngestBatchResult } from 'jsforce/lib/api/bulk';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.bulk.pollTimeout = 90 * 1000; // adjust poll timeout to test timeout.

export async function insertAccounts(
  id: string | number,
  qty: number = 20,
): Promise<BulkIngestBatchResult> {
  if (typeof id === 'number') {
    id = id.toString();
  }

  const insertRecords = [
    ...Array.from(Array(qty), (a, i) => ({
      Name: `Bulk Account ${id} #${i + 1}`,
    })),
  ];
  const batchInsertRes = await conn.bulk.load(
    'Account',
    'insert',
    insertRecords,
  );

  assert.ok(Array.isArray(batchInsertRes));
  assert.ok(batchInsertRes.length === qty);
  for (const res of batchInsertRes) {
    assert.ok(isString(res.id));
    assert.ok(res.success === true);
  }

  return batchInsertRes;
}

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
it('should bulk insert records and return result status', async () => {
  const id = Date.now();

  const bulkAccountNum = 200;

  // bulk insert 200 valid records + 1 invalid.
  const records = [
    ...Array.from(Array(bulkAccountNum), (a, i) => ({
      Name: `Bulk Account ${id} #${i + 1}`,
      NumberOfEmployees: 300 * (i + 1),
    })),
    { BillingState: 'CA' }, // missing required field `Name`, will fail to insert.
  ];
  const batchInsertRes = await conn.bulk.load('Account', 'insert', records);
  assert.ok(Array.isArray(batchInsertRes));

  // should successfully insert the first 200 records.
  for (const res of batchInsertRes.slice(0, -1)) {
    assert.ok(isString(res.id));
    assert.ok(res.success === true);
  }

  const failedToInsert = batchInsertRes[bulkAccountNum];
  assert.ok(failedToInsert.id === null);
  assert.ok(failedToInsert.success === false);
  assert.ok(
    failedToInsert.errors[0] ===
      'REQUIRED_FIELD_MISSING:Required fields are missing: [Name]:Name --',
  );
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
  const batchUpdateRes = await conn.bulk.load(
    'Account',
    'update',
    updatedRecords,
  );

  assert.ok(Array.isArray(batchUpdateRes));
  for (const ret of batchUpdateRes) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

it('should bulk update with empty input and raise client input error', async () => {
  try {
    await conn.bulk.load('Account', 'update', []);
    assert.fail();
  } catch (err) {
    assert.ok(isObject(err));
    assert.ok(err.name === 'ClientInputError');
  }
});

it('should bulk delete and return deleted status', async () => {
  const id = Date.now();

  await insertAccounts(id, bulkAccountNum);

  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .execute();

  const batchDeleteRes = await conn.bulk.load('Account', 'delete', records);

  assert.ok(Array.isArray(batchDeleteRes));
  assert.ok(batchDeleteRes.length === bulkAccountNum);
  for (const ret of batchDeleteRes) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

it('should bulk delete with empty input and raise client input error', async () => {
  try {
    await conn.bulk.load('Account', 'delete', []);
  } catch (err) {
    assert.ok(isObject(err));
    assert.ok(err.name === 'ClientInputError');
  }
});

/*------------------------------------------------------------------------*/
if (isNodeJS()) {
  it('should bulk insert from file and return inserted results', async () => {
    // insert 100 account records from csv file
    const fstream = fs.createReadStream(
      path.join(__dirname, 'data/Account_bulk1_test.csv'),
    );
    const batch = conn.bulk.load('Account', 'insert');
    fstream.pipe(batch.stream());
    const rets = await new Promise<any[]>((resolve, reject) => {
      batch.on('response', resolve);
      batch.on('error', reject);
    });

    try {
      assert.ok(Array.isArray(rets));
      assert.ok(rets.length === 100);
      for (const ret of rets) {
        assert.ok(isString(ret.id));
        assert.ok(ret.success === true);
      }
    } finally {
      // cleanup:
      // always delete successfully inserted records.
      const deleteRecords = rets.map((r) => ({
        Id: r.id,
      }));

      await conn.bulk.load('Account', 'delete', deleteRecords);
    }
  });

  it('should bulk delete from file and return deleted results', async () => {
    const id = Date.now();

    await insertAccounts(id);

    const records = await conn
      .sobject('Account')
      .find({ Name: { $like: `Bulk Account ${id}%` } });

    assert.ok(Array.isArray(records));
    assert.ok(records.length === 20);

    const data = `Id\n${records.map((r: Record) => r.Id).join('\n')}\n`;

    const deleteFile = path.join(__dirname, 'data/Account_delete.csv');

    await fs.promises.writeFile(deleteFile, data);

    const fstream = fs.createReadStream(deleteFile);
    const batch = conn.bulk.load('Account', 'delete');
    fstream.pipe(batch.stream());
    const [rets] = await Promise.all([
      new Promise<any[]>((resolve, reject) => {
        batch.on('response', resolve);
        batch.on('error', reject);
      }),
      new Promise<void>((resolve) => {
        batch.job.on('close', resolve); // await job close
      }),
    ]);
    assert.ok(Array.isArray(rets));
    assert.ok(rets.length === 20);
    for (const ret of rets) {
      assert.ok(isString(ret.id));
      assert.ok(ret.success === true);
    }

    fs.rmdirSync(deleteFile);
  });

  it('should bulk query and get records with yielding file output', async () => {
    const file = path.join(__dirname, '/data/BulkQuery_export.csv');
    const fstream = fs.createWriteStream(file);
    const count = await conn.sobject(config.bigTable).count({});
    const records = await new Promise<any[]>((resolve, reject) => {
      const recs: Record[] = [];
      conn.bulk
        .query(`SELECT Id, Name FROM ${config.bigTable}`)
        .on('record', (rec) => recs.push(rec))
        .on('error', reject)
        .stream()
        .pipe(fstream)
        .on('finish', () => resolve(recs));
    });
    assert.ok(Array.isArray(records) && records.length === count);
    for (const rec of records) {
      assert.ok(isString(rec.Id));
      assert.ok(isString(rec.Name));
    }
    const data = fs.readFileSync(file, 'utf-8');
    assert.ok(isString(data) && data !== '');
    const lines = data.replace(/[\r\n]+$/, '').split(/[\r\n]/);
    assert.ok(lines.length === records.length + 1);

    await fs.promises.rm(file);
  });
}

/*------------------------------------------------------------------------*/

/**
 *
 */
it('should call bulk api from invalid session conn with refresh fn, and return result', async () => {
  const accounts = Array.from(Array(100), (a, i) => ({
    Name: `Session Expiry Test #${i}`,
  }));
  const insRets = await conn.bulk.load('Account', 'insert', accounts);
  const deleteRecords = insRets.map((r) => ({ Id: r.id ?? undefined }));
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
  const rets = await conn2.bulk.load('Account', 'delete', deleteRecords);
  assert.ok(refreshCalled);
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === 100);
  for (const ret of rets) {
    assert.ok(ret.success);
  }
});

/**
 *
 */
it('should call bulk api from invalid session conn without refresh fn, and raise error', async () => {
  const conn3 = new Connection({
    instanceUrl: conn.instanceUrl,
    accessToken: 'invalid_token',
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl,
  });
  const records = [{ Name: 'Impossible Bulk Account #1' }];
  try {
    await conn3.bulk.load('Account', 'insert', records);
    assert.fail();
  } catch (err) {
    assert.ok(isObject(err));
    assert.ok(err.name === 'InvalidSessionId');
  }
});

/*------------------------------------------------------------------------*/
// The num should be more than 200 which fallback from SObject collection API
const bulkAccountNum = 250;

/**
 *
 */
it('should bulk update using Query#update and return updated status', async () => {
  const id = Date.now();

  await insertAccounts(id, bulkAccountNum);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
    });
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === bulkAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }

  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } }, 'Id, Name');

  assert.ok(Array.isArray(records));
  assert.ok(records.length === bulkAccountNum);
  for (const record of records) {
    assert.ok(isString(record.Id));
    assert.ok(/\(Updated\)$/.test(record.Name));
  }
});

/**
 *
 */
it('should bulk update using Query#update with unmatching query and return empty array records', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } }) // should not match any records
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null,
    });
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === 0);
});

/**
 *
 */
it('should bulk delete using Query#destroy and return deleted status', async () => {
  const id = Date.now();

  await insertAccounts(id, bulkAccountNum);

  const batchDeleteRes = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .destroy();

  assert.ok(Array.isArray(batchDeleteRes));
  assert.ok(batchDeleteRes.length === bulkAccountNum);
  for (const res of batchDeleteRes) {
    assert.ok(isString(res.id));
    assert.ok(res.success === true);
  }
});

/**
 *
 */
it('should bulk delete using Query#destroy with unmatching query and return empty array records', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } })
    .destroy();
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === 0);
});

/*------------------------------------------------------------------------*/
// This is usually small num to use Bulk API, but forcely use it by modifying bulkThreshold num
const smallAccountNum = 20;

/**
 *
 */
it('should bulk update using Query#update with bulkThreshold modified and return updated status', async () => {
  const id = Date.now();

  const records = Array.from({ length: smallAccountNum }).map((_, i) => ({
    Name: `New Bulk Account ${id} #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  const batchInsertRes = await conn.bulk.load('Account', 'insert', records);

  assert.ok(Array.isArray(batchInsertRes));
  assert.ok(batchInsertRes.length === smallAccountNum);
  for (const res of batchInsertRes) {
    assert.ok(isString(res.id));
    assert.ok(res.success === true);
  }

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `New Bulk Account ${id}%` } })
    .update(
      {
        Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
        BillingState: null,
      },
      { bulkThreshold: 0 },
    );
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === smallAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
  const updatedRecords = await conn
    .sobject('Account')
    .find(
      { Name: { $like: `New Bulk Account ${id}%` } },
      'Id, Name, BillingState',
    );
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

  const bulkAccountNum = 20;

  const insertRecords = [
    ...Array.from(Array(bulkAccountNum), (a, i) => ({
      Name: `New Bulk Account ${id} #${i + 1}`,
      NumberOfEmployees: 300 * (i + 1),
    })),
  ];
  const batchInsertRes = await conn.bulk.load(
    'Account',
    'insert',
    insertRecords,
  );

  assert.ok(Array.isArray(batchInsertRes));
  assert.ok(batchInsertRes.length === bulkAccountNum);
  for (const res of batchInsertRes) {
    assert.ok(isString(res.id));
    assert.ok(res.success === true);
  }

  const batchDeleteRes = await conn
    .sobject('Account')
    .find({ Name: { $like: `New Bulk Account ${id}%` } })
    .destroy({
      bulkThreshold: 0,
    });

  assert.ok(Array.isArray(batchDeleteRes));
  assert.ok(batchDeleteRes.length === smallAccountNum);

  for (const res of batchDeleteRes) {
    assert.ok(isString(res.id));
    assert.ok(res.success === true);
  }
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
