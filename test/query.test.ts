import stream from 'stream';
import through2 from 'through2';
import assert from 'assert';
import { SfDate } from 'jsforce';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isString, isNumber } from './util';
import { insertAccounts } from './bulk.test';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.bulk2.pollTimeout = 90000; // adjust poll timeout to test timeout.
conn.bulk.pollTimeout = 90000; // adjust poll timeout to test timeout.

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
it('should query accounts and return records', async () => {
  const query = conn.query('SELECT Id, Name FROM Account');
  const result = await query.run();
  assert.ok(isNumber(result.totalSize));
});

/**
 *
 */
it('should query accounts with scanAll option and return all records', async () => {
  // create and delete record
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'Deleting Account #1' });
  assert(ret.id);
  await conn.sobject('Account').record(ret.id).destroy();
  const query = conn.query(
    'SELECT Id, IsDeleted, Name FROM Account WHERE IsDeleted = true',
  );
  const result = await query.run({ scanAll: true });
  assert.ok(isNumber(result.totalSize));
  assert.ok(result.totalSize > 0);
});

describe('big tables and autoFetch', () => {
  let totalRecordCount: number;
  let maxFetchThatWillComplete: number;
  const bigTableQuery = `SELECT Id, Name FROM ${config.bigTable || 'Account'}`;
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    totalRecordCount = await conn.query(bigTableQuery, {
      responseTarget: 'Count',
    });
    maxFetchThatWillComplete = 2000 * Math.floor(totalRecordCount / 2000);
  });

  /**
   *
   */
  it('should query big table and execute queryMore and fetch all records', async () => {
    let result = await conn.query(bigTableQuery);
    expect(result.records.length).toBe(2000);
    expect(result.nextRecordsUrl).toBeTruthy();
    expect(result.done).toBe(false);
    let records = result.records;
    while (!result.done && result.nextRecordsUrl) {
      result = await conn.queryMore(result.nextRecordsUrl); // TODO: remove "!" when assertion function is introduced
      records = [...records, ...result.records];
    }
    assert.ok(records.length === totalRecordCount);
  });

  it('should return the first batch with autoFetch and maxFetch set to 2000', async () => {
    let requestQty = 0

    const result = await conn.query(bigTableQuery, { autoFetch: true, maxFetch: 2000}).on('fetch', () => {
      requestQty++
    })

    expect(result.records.length).toBe(2000);
    expect(result.nextRecordsUrl).toBeTruthy();
    expect(result.done).toBe(false);
    expect(requestQty).toBe(1);
  });

  /**
   *
   */
  it('should query big tables without autoFetch and scan records in one query fetch', async () => {
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
  it('should query big tables with autoFetch and scan records up to maxFetch num', async () => {
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

  it('should query big tables with autoFetch using async/await and hit max fetch', async () => {
    const result = await conn.query(bigTableQuery, {
      autoFetch: true,
      maxFetch: maxFetchThatWillComplete - 1,
    });
    expect(result.totalSize).toBe(totalRecordCount);
    expect(result.records.length).toBe(maxFetchThatWillComplete - 1);
  });

  it('should query big tables with autoFetch using async/await and hit max fetch', async () => {
    const result = await conn.query(bigTableQuery, {
      autoFetch: true,
      maxFetch: maxFetchThatWillComplete,
    });
    expect(result.totalSize).toBe(totalRecordCount);
    expect(result.records.length).toBe(maxFetchThatWillComplete);
  });

  it('should query big tables with autoFetch using async/await and hit max fetch', async () => {
    const result = await conn.query(bigTableQuery, {
      autoFetch: true,
      maxFetch: maxFetchThatWillComplete + 1,
    });
    expect(result.totalSize).toBe(totalRecordCount);
    expect(result.records.length).toBe(maxFetchThatWillComplete + 1);
  });

  it('should query big tables with autoFetch using async/await when max fetch is not hit', async () => {
    const result = await conn.query(bigTableQuery, {
      autoFetch: true,
      maxFetch: 5000000,
    });
    expect(result.totalSize).toBe(totalRecordCount);
    expect(result.records.length).toBe(totalRecordCount);
  });
});
/**
 *
 */
it('should query big tables by piping randomly-waiting output record stream object and scan records via stream up to maxFetch num', async () => {
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
it('should query table and convert to readable stream and get CSV text', async () => {
  const query = conn.query('SELECT Id, Name FROM Account LIMIT 10');
  const csvOut = new stream.Writable();
  let result = '';
  csvOut._write = (data, enc, next) => {
    result += data.toString('utf8');
    next();
  };
  await new Promise((resolve, reject) => {
    query.stream('csv').pipe(csvOut).on('finish', resolve).on('error', reject);
  });
  assert.ok(isString(result));
  const header = result.split('\n')[0];
  assert.ok(header === 'Id,Name');
});

/**
 *
 */
it('should explain query plan of soql query and get explain result', async () => {
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
it('should setup for query and update / destroy test', async () => {
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
it('should update queried records using Query#update and return updated records', async () => {
  const id = Date.now();

  await insertAccounts(id, accountNum);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
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
  const updatedRecords = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } });
  assert.ok(Array.isArray(updatedRecords));
  assert.ok(updatedRecords.length === accountNum);
  for (const record of updatedRecords) {
    assert.ok(isString(record.Id));
    assert.ok(record.Name.endsWith('(Updated)'));
    assert.ok(record.BillingState === null);
  }
});

/**
 *
 */
it('should update queried records using Query#update, for unmatching query, and return empty array records', async () => {
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
it('should delete queried records using Query#destroy and return deleted status', async () => {
  const id = Date.now();

  await insertAccounts(id, accountNum);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
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
it('should delete queried records using Query#destroy, for unmatching query, and return empty array records', async () => {
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

it('should setup for query and update/destroy with allowBulk=false test', async () => {
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
it('should update queried records using Query#update, with allowBulk = false, and return updated records', async () => {
  const id = Date.now();

  await insertAccounts(id, massiveAccountNum);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
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
  const updatedRecords = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } }, 'Id, Name, BillingState');
  assert.ok(Array.isArray(updatedRecords));
  assert.ok(updatedRecords.length === massiveAccountNum);
  for (const record of updatedRecords) {
    assert.ok(isString(record.Id));
    assert.ok(record.Name.endsWith('(Updated)'));
    assert.ok(record.BillingState === null);
  }
});

/**
 *
 */
it('should delete queried records using Query#destroy, with allowBulk = false, and return deleted status', async () => {
  const id = Date.now();

  await insertAccounts(id, massiveAccountNum);

  const rets = await conn
    .sobject('Account')
    .find({ Name: { $like: `Bulk Account ${id}%` } })
    .destroy({ allowBulk: false });

  assert.ok(Array.isArray(rets));
  assert.ok(rets.length === massiveAccountNum);
  for (const ret of rets) {
    assert.ok(isString(ret.id));
    assert.ok(ret.success === true);
  }
});
