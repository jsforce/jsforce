import stream from 'stream';
import through2 from 'through2';
import test from './util/ava/ext';
import { SfDate } from '..';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isString, isNumber } from './util';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection(); // TODO: remove any

/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
test('query accounts and return records', async (t) => {
  const query = conn.query('SELECT Id, Name FROM Account');
  const result = await query.run();
  t.true(isNumber(result.totalSize));
});

/**
 *
 */
test('query accounts with scanAll option and return all records', async (t) => {
  // create and delete record
  const ret = await conn.sobject('Account').create({ Name: 'Deleting Account #1' });
  await conn.sobject('Account').record(ret.id).destroy();
  const query = conn.query('SELECT Id, IsDeleted, Name FROM Account WHERE IsDeleted = true');
  const result = await query.run({ scanAll: true });
  t.true(isNumber(result.totalSize));
  t.true(result.totalSize > 0);
});

/**
 *
 */
test('query big table and execute queryMore and fetch all records', async (t) => {
  let result = await conn.query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`);
  let records = result.records;
  while (!result.done) {
    result = await conn.queryMore(result.nextRecordsUrl);
    records = [...records, ...result.records];
  }
  t.true(records.length === result.totalSize);
});

/**
 *
 */
test('query big tables without autoFetch and scan records in one query fetch', async (t) => {
  const records: any[] = []; // TODO: remove any
  let query: any; // TODO: remove any
  await new Promise((resolve, reject) => {
    query = conn.query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`)
      .on('record', (record: any) => records.push(record)) // TODO: remove any
      .on('end', resolve)
      .on('error', reject)
      .run({ autoFetch: false });
  });
  t.true(query.totalFetched === records.length);
  t.true(query.totalSize > 2000 ?
         query.totalFetched === 2000 :
         query.totalFetched === query.totalSize);
});

/**
 *
 */
test('query big tables with autoFetch and scan records up to maxFetch num', async (t) => {
  const records: any[] = []; // TODO: remove any
  let query: any; // TODO: remove any
  await new Promise((resolve, reject) => {
    query = conn.query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`)
      .on('record', (record: any) => records.push(record)) // TODO: remove any
      .on('end', resolve)
      .on('error', reject)
      .run({ autoFetch: true, maxFetch: 5000 });
  });
  t.true(query.totalFetched === records.length);
  t.true(query.totalSize > 5000 ?
         query.totalFetched === 5000 :
         query.totalFetched === query.totalSize);
});

/**
 *
 */
test('query big tables by piping randomly-waiting output record stream object and scan records via stream up to maxFetch num', async (t) => {
  const records: any[] = []; // TODO: remove any
  let query: any;
  await new Promise((resolve, reject) => {
    const outStream = through2.obj(
      (record, enc, next) => {
        records.push(record);
        if (records.length % 100 === 0) {
          const waitTime = Math.floor(1000 * Math.random());
          setTimeout(() => { next(); }, waitTime);
        } else {
          next();
        }
      },
      done => done(),
    );
    query = conn.query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`);
    query.run({ autoFetch: true, maxFetch: 5000 })
      .pipe(outStream)
      .on('finish', resolve)
      .on('error', reject);
  });
  t.true(query.totalFetched === records.length);
  t.true(query.totalSize > 5000 ?
         query.totalFetched === 5000 :
         query.totalFetched === query.totalSize);
});

/**
 *
 */
test('query table and convert to readable stream and get CSV text', async (t) => {
  const query = conn.query('SELECT Id, Name FROM Account LIMIT 10');
  const csvOut = new stream.Writable();
  let result = '';
  csvOut._write = (data, enc, next) => {
    result += data.toString('utf8');
    next();
  };
  await new Promise((resolve, reject) => {
    query.stream('csv').pipe(csvOut)
      .on('finish', resolve)
      .on('error', reject);
  });
  t.true(isString(result));
  const header = result.split('\n')[0];
  t.true(header === 'Id,Name');
});

/**
 *
 */
test('explain query plan of soql query and get explain result', async (t) => {
  const query = conn.query('SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 10');
  const result = await query.explain();
  t.true(Array.isArray(result.plans));
  for (const plan of result.plans) {
    t.true(isNumber(plan.cardinality));
    t.true(Array.isArray(plan.fields));
    t.true(isString(plan.leadingOperationType));
    t.true(isNumber(plan.relativeCost));
    t.true(isNumber(plan.sobjectCardinality));
    t.true(isString(plan.sobjectType));
  }
});

/*------------------------------------------------------------------------*/
// The num should be less than 200, not to fallback to bulk API
const accountNum = 20;

/**
 *
 */
test('setup for query and update / destroy test', async (t) => {
  const records = Array.from({ length: accountNum }).map((_, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.sobject('Account').create(records);
  t.pass();
});

/**
 *
 */
test('update queried records using Query#update and return updated records', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null,
    });
  t.true(Array.isArray(rets));
  t.true(rets.length === accountNum);
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
  const urecords = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } });
  t.true(Array.isArray(urecords));
  t.true(urecords.length === accountNum);
  for (const record of urecords) {
    t.true(isString(record.Id));
    t.true(/\(Updated\)$/.test(record.Name));
    t.true(record.BillingState === null);
  }
});

/**
 *
 */
test('update queried records using Query#update, for unmatching query, and return empty array records', async (t) => {
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
test('delete queried records using Query#destroy and return deleted status', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .destroy();
  t.true(Array.isArray(rets));
  t.true(rets.length === accountNum);
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
});

/**
 *
 */
test('delete queried records using Query#destroy, for unmatching query, and return empty array records', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ CreatedDate: { $lt: new SfDate('1970-01-01T00:00:00Z') } })
    .destroy();
  t.true(Array.isArray(rets));
  t.true(rets.length === 0);
});

/*------------------------------------------------------------------------*/
// The num is over 200, but not falling back to bulk API because `allowBulk` option is set to false.
const massiveAccountNum = 300;

test('setup for query and update/destroy with allowBulk=false test', async (t) => {
  const records = Array.from({ length: massiveAccountNum }).map((_, i) => ({
    Name: `New Bulk Account #${i + 1}`,
    BillingState: 'CA',
    NumberOfEmployees: 300 * (i + 1),
  }));
  await conn.sobject('Account').create(records, { allowRecursive: true });
  t.pass();
});

/**
 *
 */
test('update queried records using Query#update, with allowBulk = false, and return updated records', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .update({
      Name: '${Name} (Updated)', // eslint-disable-line no-template-curly-in-string
      BillingState: null
    }, { allowBulk: false });
  t.true(Array.isArray(rets));
  t.true(rets.length === massiveAccountNum);
  for (const ret of rets) {
    t.true(isString(ret.id));
    t.true(ret.success === true);
  }
  const records = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } }, 'Id, Name, BillingState');
  t.true(Array.isArray(records));
  t.true(records.length === massiveAccountNum);
  for (const record of records) {
    t.true(isString(record.Id));
    t.true(/\(Updated\)$/.test(record.Name));
    t.true(record.BillingState === null);
  }
});

/**
 *
 */
test('delete queried records using Query#destroy, with allowBulk = false, and return deleted status', async (t) => {
  const rets = await conn.sobject('Account')
    .find({ Name: { $like: 'New Bulk Account%' } })
    .destroy();
  t.true(Array.isArray(rets));
  t.true(rets.length === massiveAccountNum);
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
