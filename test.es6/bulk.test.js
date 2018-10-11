import fs from 'fs';
import path from 'path';
import test from './util/ava/ext';
import { Connection, Date as SfDate } from '..';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import { isNodeJS } from './helper/env';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.bulk.pollTimeout = 40 * 1000; // adjust poll timeout to test timeout.


/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});


/**
 *
 */
test('bulk insert records and return result status', async (t) => {
  const records = [
    ...Array.from(Array(200), (a, i) => ({
      Name: `Bulk Account #${i + 1}`,
      NumberOfEmployees: 300 * (i + 1),
    })),
    { BillingState: 'CA' }, // should raise error
  ];
  const rets = await conn.bulk.load('Account', 'insert', records);
  t.true(Array.isArray(rets));
  let i = 0;
  let ret;
  for (; i < 200; i++) {
    ret = rets[i];
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
  ret = rets[200];
  t.true(ret.id === null);
  t.true(ret.success === false);
});

/**
 *
 */
test('bulk update and return updated status', async (t) => {
  let records = await conn.sobject('Account')
    .find({ Name: { $like: 'Bulk Account%' } }, { Id: 1, Name: 1 })
    .execute();
  records = records.map(rec => Object.assign({}, rec, { Name: `${rec.Name} (Updated)` }));
  const rets = await conn.bulk.load('Account', 'update', records);
  t.true(Array.isArray(rets));
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
});

/**
 *
 */
test('bulk update with empty input and raise client input error', async (t) => {
  try {
    await conn.bulk.load('Account', 'update', []);
    t.fail();
  } catch (err) {
    t.true(isObject(err));
    t.true(err.name === 'ClientInputError');
  }
});

/**
 *
 */
test('bulk delete and return deleted status', async (t) => {
  const records = await conn.sobject('Account')
    .find({ Name: { $like: 'Bulk Account%' } })
    .execute();
  const rets = await conn.bulk.load('Account', 'delete', records);
  t.true(Array.isArray(rets));
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
});

/**
 *
 */
test('bulk delete with empty input and raise client input error', async (t) => {
  try {
    await conn.bulk.load('Account', 'delete', []);
  } catch (err) {
    t.true(isObject(err));
    t.true(err.name === 'ClientInputError');
  }
});

/*------------------------------------------------------------------------*/
if (isNodeJS()) {
  /**
   *
   */
  test('bulk insert from file and return inserted results', async (t) => {
    const fstream = fs.createReadStream(path.join(__dirname, 'data/Account.csv'));
    const batch = conn.bulk.load('Account', 'insert');
    fstream.pipe(batch.stream());
    const rets = await new Promise((resolve, reject) => {
      batch.on('response', resolve);
      batch.on('error', reject);
    });
    t.true(Array.isArray(rets));
    for (const ret of rets) {
      t.true(isString(ret.id));
      t.true(ret.success === true);
    }
  });

  /**
   *
   */
  test('bulk delete from file and return deleted results', async (t) => {
    const records = await conn.sobject('Account').find({ Name: { $like: 'Bulk Account%' } });
    const data = `Id\n${records.map(r => r.Id).join('\n')}\n`;
    const deleteFileName = path.join(__dirname, 'data/Account_delete.csv');
    await new Promise((resolve, reject) => {
      fs.writeFile(deleteFileName, data, err => (err ? reject(err) : resolve()));
    });
    const fstream = fs.createReadStream(deleteFileName);
    const batch = conn.bulk.load('Account', 'delete');
    fstream.pipe(batch.stream());
    const [rets] = await Promise.all([
      new Promise((resolve, reject) => {
        batch.on('response', resolve);
        batch.on('error', reject);
      }),
      new Promise((resolve) => {
        batch.job.on('close', resolve); // await job close
      }),
    ]);
    t.true(Array.isArray(rets));
    for (const ret of rets) {
      t.true(isString(ret.id));
      t.true(ret.success === true);
    }
  });

  /**
   *
   */
  test('bulk query and get records with yielding file output', async (t) => {
    const file = path.join(__dirname, '/data/BulkQuery_export.csv');
    const fstream = fs.createWriteStream(file);
    const count = await conn.sobject(config.bigTable).count({});
    const records = await new Promise((resolve, reject) => {
      const recs = [];
      conn.bulk.query(`SELECT Id, Name FROM ${config.bigTable}`)
        .on('record', rec => recs.push(rec))
        .on('error', reject)
        .stream()
        .pipe(fstream)
        .on('finish', () => resolve(recs));
    });
    t.true(Array.isArray(records) && records.length === count);
    for (const rec of records) {
      t.true(isString(rec.Id));
      t.true(isString(rec.Name));
    }
    const data = fs.readFileSync(file, 'utf-8');
    t.true(isString(data) && data !== '');
    const lines = data.replace(/[\r\n]+$/, '').split(/[\r\n]/);
    t.true(lines.length === records.length + 1);
  });
}

/*------------------------------------------------------------------------*/

/**
 *
 */
test('call bulk api from invalid session conn with refresh fn, and return result', async (t) => {
  const accounts = Array.from(Array(100), (a, i) => ({ Name: `Session Expiry Test #${i}` }));
  const insRets = await conn.bulk.load('Account', 'insert', accounts);
  const deleteRecords = insRets.map(r => ({ Id: r.id }));
  let refreshCalled = false;
  const conn2 = new Connection({
    instanceUrl: conn.instanceUrl,
    accessToken: 'invalid_token',
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl,
    refreshFn: (c, callback) => {
      refreshCalled = true;
      setTimeout(() => callback(null, conn.accessToken), 500);
    },
  });
  const rets = await conn2.bulk.load('Account', 'delete', deleteRecords);
  t.true(refreshCalled);
  t.true(Array.isArray(rets));
  t.true(rets.length === 100);
  for (const ret of rets) {
    t.true(ret.success);
  }
});

/**
 *
 */
test('call bulk api from invalid session conn without refresh fn, and raise error', async (t) => {
  const conn3 = new Connection({
    instanceUrl: conn.instanceUrl,
    accessToken: 'invalid_token',
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl
  });
  const records = [{ Name: 'Impossible Bulk Account #1' }];
  try {
    await conn3.bulk.load('Account', 'insert', records);
    t.fail();
  } catch (err) {
    t.true(isObject(err));
    t.true(err.name === 'InvalidSessionId');
  }
});

/*------------------------------------------------------------------------*/
// The num should be more than 200 which fallback from SObject collection API
const bulkAccountNum = 250;

/**
 *
 */
test('bulk update using Query#update and return updated status', async (t) => {
  const accounts = Array.from(Array(bulkAccountNum), (a, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.bulk.load('Account', 'insert', accounts);
  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null
    });
  t.true(Array.isArray(rets));
  t.true(rets.length === bulkAccountNum);
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }

  const records = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } }, 'Id, Name, BillingState');
  t.true(Array.isArray(records));
  t.true(records.length === bulkAccountNum);
  for (const record of records) {
    t.true(isString(record.Id));
    t.true(/\(Updated\)$/.test(record.Name));
    t.true(record.BillingState === null);
  }
});

/**
 *
 */
test('bulk update using Query#update with unmatching query and return empty array records', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } }) // should not match any records
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null
    });
  t.true(Array.isArray(rets));
  t.true(rets.length === 0);
});

/**
 *
 */
test('bulk delete using Query#destroy and return deleted status', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .destroy();
  t.true(Array.isArray(rets));
  t.true(rets.length === bulkAccountNum);
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
});

/**
 *
 */
test('bulk delete using Query#destroy with unmatching query and return empty array records', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } })
    .destroy();
  t.true(Array.isArray(rets));
  t.true(rets.length === 0);
});

/*------------------------------------------------------------------------*/
// This is usually small num to use Bulk API, but forcely use it by modifying bulkThreshold num
const smallAccountNum = 20;

/**
 *
 */
test('bulk update using Query#update with bulkThreshold modified and return updated status', async (t) => {
  const records = Array.from({ length: smallAccountNum }).map((_, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.bulk.load('Account', 'insert', records);

  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null
    }, { bulkThreshold: 0 });
  t.true(Array.isArray(rets));
  t.true(rets.length === smallAccountNum);
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
  const urecords = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } }, 'Id, Name, BillingState');
  t.true(Array.isArray(urecords));
  t.true(records.length === smallAccountNum);
  for (const record of urecords) {
    t.true(isString(record.Id));
    t.true(/\(Updated\)$/.test(record.Name));
    t.true(record.BillingState === null);
  }
});

/**
 *
 */
test('bulk delete using Query#destroy with bulkThreshold modified and return deleted status', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .destroy({ bulkThreshold: 0 });
  t.true(Array.isArray(rets));
  t.true(rets.length === smallAccountNum);
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
});

/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
