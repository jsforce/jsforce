import stream from 'stream';
import through2 from 'through2';
import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isString, isNumber } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

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
  const records = [];
  let query;
  await new Promise((resolve, reject) => {
    query = conn.query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`)
      .on('record', record => records.push(record))
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
  const records = [];
  let query;
  await new Promise((resolve, reject) => {
    query = conn.query(`SELECT Id, Name FROM ${config.bigTable || 'Account'}`)
      .on('record', record => records.push(record))
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
  const records = [];
  let query;
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
    query.stream().pipe(csvOut)
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


/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
