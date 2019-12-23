import stream from 'stream';
import through2 from 'through2';
import assert from 'assert';
import { SfDate } from '../src';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isString, isNumber } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection(); // TODO: remove any

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
test('query accounts and return records', async () => {
  const query = conn.query('SELECT Id, Name FROM Account');
  const result = await query.run();
  assert.ok(isNumber(result.totalSize));
});

/**
 *
 */
test('query accounts with scanAll option and return all records', async () => {
  // create and delete record
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'Deleting Account #1' });
  await conn
    .sobject('Account')
    .record(ret.id!) // TODO: remove "!" when assertion funcion is introduced
    .destroy();
  const query = conn.query(
    'SELECT Id, IsDeleted, Name FROM Account WHERE IsDeleted = true',
  );
  const result = await query.run({ scanAll: true });
  assert.ok(isNumber(result.totalSize));
  assert.ok(result.totalSize > 0);
});

/**
 *
 */
test('query big table and execute queryMore and fetch all records', async () => {
  let result = await conn.query(
    `SELECT Id, Name FROM ${config.bigTable || 'Account'}`,
  );
  let records = result.records;
  while (!result.done) {
    result = await conn.queryMore(result.nextRecordsUrl!); // TODO: remove "!" when assrtion functionn is introduced
    records = [...records, ...result.records];
  }
  assert.ok(records.length === result.totalSize);
});

/**
 *
 */
test('query big tables without autoFetch and scan records in one query fetch', async () => {
  const records: any[] = []; // TODO: remove any
  let query: any; // TODO: remove any
  await new Promise((resolve, reject) => {
    query = conn
      .query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`)
      .on('record', (record: any) => records.push(record)) // TODO: remove any
      .on('end', resolve)
      .on('error', reject)
      .run({ autoFetch: false });
  });
  assert.ok(query.totalFetched === records.length);
  assert.ok(
    query.totalSize > 2000
      ? query.totalFetched === 2000
      : query.totalFetched === query.totalSize,
  );
});

/**
 *
 */
test('query big tables with autoFetch and scan records up to maxFetch num', async () => {
  const records: any[] = []; // TODO: remove any
  let query: any; // TODO: remove any
  await new Promise((resolve, reject) => {
    query = conn
      .query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`)
      .on('record', (record: any) => records.push(record)) // TODO: remove any
      .on('end', resolve)
      .on('error', reject)
      .run({ autoFetch: true, maxFetch: 5000 });
  });
  assert.ok(query.totalFetched === records.length);
  assert.ok(
    query.totalSize > 5000
      ? query.totalFetched === 5000
      : query.totalFetched === query.totalSize,
  );
});

/**
 *
 */
test('query big tables by piping randomly-waiting output record stream object and scan records via stream up to maxFetch num', async () => {
  const records: any[] = []; // TODO: remove any
  let query: any;
  await new Promise((resolve, reject) => {
    const outStream = through2.obj(
      (record, enc, next) => {
        records.push(record);
        if (records.length % 100 === 0) {
          const waitTime = Math.floor(1000 * Math.random());
          setTimeout(() => {
            next();
          }, waitTime);
        } else {
          next();
        }
      },
      (done) => done(),
    );
    query = conn.query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`);
    query
      .run({ autoFetch: true, maxFetch: 5000 })
      .pipe(outStream)
      .on('finish', resolve)
      .on('error', reject);
  });
  assert.ok(query.totalFetched === records.length);
  assert.ok(
    query.totalSize > 5000
      ? query.totalFetched === 5000
      : query.totalFetched === query.totalSize,
  );
});

/**
 *
 */
test('query table and convert to readable stream and get CSV text', async () => {
  const query = conn.query('SELECT Id, Name FROM Account LIMIT 10');
  const csvOut = new stream.Writable();
  let result = '';
  csvOut._write = (data, enc, next) => {
    result += data.toString('utf8');
    next();
  };
  await new Promise((resolve, reject) => {
    query
      .stream('csv')
      .pipe(csvOut)
      .on('finish', resolve)
      .on('error', reject);
  });
  assert.ok(isString(result));
  const header = result.split('\n')[0];
  assert.ok(header === 'Id,Name');
});

/**
 *
 */
test('explain query plan of soql query and get explain result', async () => {
  const query = conn.query(
    'SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 10',
  );
  const result = await query.explain();
  assert.ok(Array.isArray(result.plans));
  for (const plan of result.plans) {
    assert.ok(isNumber(plan.cardinality));
    assert.ok(Array.isArray(plan.fields));
    assert.ok(isString(plan.leadingOperationType));
    assert.ok(isNumber(plan.relativeCost));
    assert.ok(isNumber(plan.sobjectCardinality));
    assert.ok(isString(plan.sobjectType));
  }
});

/*------------------------------------------------------------------------*/
// The num should be less than 200, not to fallback to bulk API
const accountNum = 20;

/**
 *
 */
test('setup for query and update / destroy test', async () => {
  const records = Array.from({ length: accountNum }).map((_, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.sobject('Account').create(records);
  assert.ok(true);
});

/**
 *
 */
test('update queried records using Query#update and return updated records', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null,
    });
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === accountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
  const urecords = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } });
  assert.ok(Array.isArray(urecords));
  assert.ok(urecords.length === accountNum);
  for (const record of urecords) {
    assert.ok(isString(record.Id));
    assert.ok(/\(Updated\)$/.test(record.Name));
    assert.ok(record.BillingState === null);
  }
});

/**
 *
 */
test('update queried records using Query#update, for unmatching query, and return empty array records', async () => {
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
test('delete queried records using Query#destroy and return deleted status', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .destroy();
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === accountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});

/**
 *
 */
test('delete queried records using Query#destroy, for unmatching query, and return empty array records', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } })
    .destroy();
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === 0);
});

/*------------------------------------------------------------------------*/
// The num is over 200, but not falling back to bulk API because `allowBulk` option is set to false.
const massiveAccountNum = 300;

test('setup for query and update/destroy with allowBulk=false test', async () => {
  const records = Array.from({ length: massiveAccountNum }).map((_, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.sobject('Account').create(records, { allowRecursive: true });
  assert.ok(true);
});

/**
 *
 */
test('update queried records using Query#update, with allowBulk = false, and return updated records', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .update(
      {
        Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
        BillingState: null,
      },
      { allowBulk: false },
    );
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === massiveAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
  const records = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } }, 'Id, Name, BillingState');
  assert.ok(Array.isArray(records));
  assert.ok(records.length === massiveAccountNum);
  for (const record of records) {
    assert.ok(isString(record.Id));
    assert.ok(/\(Updated\)$/.test(record.Name));
    assert.ok(record.BillingState === null);
  }
});

/**
 *
 */
test('delete queried records using Query#destroy, with allowBulk = false, and return deleted status', async () => {
  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .destroy();
  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === massiveAccountNum);
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
