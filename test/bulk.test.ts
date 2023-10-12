import assert from 'assert';
import path from 'path';
import fs from './helper/fs';
import { Connection } from '../src/connection';
import { SfDate } from '../src/date';
import type { Record } from '../src/types';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import { isNodeJS } from './helper/env';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.bulk.pollTimeout = 90 * 1000; // adjust poll timeout to test timeout.

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
  const records = [
    ...Array.from(Array(200), (a, i) => ({
      Name: `Bulk Account #${i + 1}`,
      NumberOfEmployees: 300 * (i + 1),
    })),
    { BillingState: 'CA' }, // should raise error
  ];
  const rets = await conn.bulk.load('Account', 'insert', records);
  assert.ok(Array.isArray(rets));
  let i = 0;
  let ret;
  for (; i < 200; i++) {
    ret = rets[i];
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
  ret = rets[200];
  assert.ok(ret.id === null);
  assert.ok(ret.success === false);
});

/**
 *
 */
it('should bulk update and return updated status', async () => {
  let records = await conn
    .sobject('Account')
    .find({ Name: { $like: 'Bulk Account%' } }, ['Id', 'Name'])
    .execute();
  records = records.map((rec) => ({ ...rec, Name: `${rec.Name} (Updated)` }));
  const rets = await conn.bulk.load('Account', 'update', records);
  assert.ok(Array.isArray(rets));
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

/**
 *
 */
it('should bulk update with empty input and raise client input error', async () => {
  try {
    await conn.bulk.load('Account', 'update', []);
    assert.fail();
  } catch (err) {
    assert.ok(isObject(err));
    assert.ok(err.name === 'ClientInputError');
  }
});

/**
 *
 */
it('should bulk delete and return deleted status', async () => {
  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: 'Bulk Account%' } })
    .execute();
  const rets = await conn.bulk.load('Account', 'delete', records);
  assert.ok(Array.isArray(rets));
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

/**
 *
 */
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
  /**
   *
   */
  it('should bulk insert from file and return inserted results', async () => {
    const fstream = fs.createReadStream(
      path.join(__dirname, 'data/Account.csv'),
    );
    const batch = conn.bulk.load('Account', 'insert');
    fstream.pipe(batch.stream());
    const rets = await new Promise<any[]>((resolve, reject) => {
      batch.on('response', resolve);
      batch.on('error', reject);
    });
    assert.ok(Array.isArray(rets));
    for (const ret of rets) {
      assert.ok(isString(ret.id));
      assert.ok(ret.success === true);
    }
  });

  /**
   *
   */
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
    for (const ret of rets) {
      assert.ok(isString(ret.id));
      assert.ok(ret.success === true);
    }
  });

  /**
   *
   */
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
  const accounts = Array.from(Array(bulkAccountNum), (a, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.bulk.load('Account', 'insert', accounts);
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null,
    });
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
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .destroy();
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === bulkAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
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
  const records = Array.from({ length: smallAccountNum }).map((_, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.bulk.load('Account', 'insert', records);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
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
    .destroy({ bulkThreshold: 0 });
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === smallAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
