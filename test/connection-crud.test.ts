import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, delay } from './util';
import { insertAccounts } from './bulk.test';
import type { Record, SavedRecord } from 'jsforce';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
describe('single record crud', () => {
  let accountId: string;
  let account: Record;

  //
  it('should create account and get created obj', async () => {
    const ret = await conn.sobject('Account').create({ Name: 'Hello' });
    assert.ok(ret.success);
    assert.ok(typeof ret.id === 'string');
    accountId = ret.id ;
  });

  //
  it('should retrieve account and return a record', async () => {
    const record = await conn.sobject('Account').retrieve(accountId);
    assert.ok(typeof record.Id === 'string');
    assert.ok(isObject(record.attributes));
    account = record;
  });

  //
  it('should update account, get successful result, and retrieve the updated record', async () => {
    const ret = await conn
      .sobject('Account')
      .record(account.Id as string)
      .update({ Name: 'Hello2' });
    assert.ok(ret.success);
    const record = await conn.sobject('Account').record(accountId).retrieve();
    assert.ok(record.Name === 'Hello2');
    assert.ok(isObject(record.attributes));
  });

  //
  it('should update account with options headers, get successfull result, and retrieve the updated record', async () => {
    const options = {
      headers: {
        'SForce-Auto-Assign': 'FALSE',
      },
    };
    const ret = await conn
      .sobject('Account')
      .record(account.Id as string)
      .update({ Name: 'Hello3' }, options);
    assert.ok(ret.success);
    const record = await conn
      .sobject('Account')
      .record(accountId)
      .retrieve(options);
    assert.ok(record.Name === 'Hello3');
    assert.ok(isObject(record.attributes));
  });
});

/**
 *
 */
describe('multiple records crud', () => {
  let accountIds: string[];
  let accounts: Record[];

  //
  it('should create multiple accounts and get successfull results', async () => {
    const rets = await conn
      .sobject('Account')
      .create([{ Name: 'Account #1' }, { Name: 'Account #2' }]);
    assert.ok(Array.isArray(rets));
    rets.forEach((ret) => {
      assert.ok(ret.success);
      assert.ok(typeof ret.id === 'string');
    });
    accountIds = rets.map(({ id }) => id as string);
  });

  //
  it('should retrieve multiple accounts and get specified records', async () => {
    const records = await conn.sobject('Account').retrieve(accountIds);
    assert.ok(Array.isArray(records));
    records.forEach((record, i) => {
      assert.ok(typeof record.Id === 'string');
      assert.ok(isObject(record.attributes));
      assert.ok(record.Name === `Account #${i + 1}`);
    });
    accounts = records;
  });

  //
  it('should update multiple accounts, get successfull results, and get updated records', async () => {
    const rets = await conn
      .sobject('Account')
      .update(
        accounts.map(
          ({ Id, Name }) => ({ Id, Name: `Updated ${Name}` } as SavedRecord),
        ),
      );
    assert.ok(Array.isArray(rets));
    rets.forEach((ret) => {
      assert.ok(ret.success);
    });
    const records = await conn.sobject('Account').retrieve(accountIds);
    assert.ok(Array.isArray(records));
    records.forEach((record, i) => {
      assert.ok(record.Name === `Updated Account #${i + 1}`);
      assert.ok(isObject(record.attributes));
    });
  });

  //
  it('should delete multiple accounts, get successfull results, and not get any records', async () => {
    const rets = await conn.sobject('Account').destroy(accountIds);
    assert.ok(Array.isArray(rets));
    rets.forEach((ret) => {
      assert.ok(ret.success);
    });
    const records = await conn.sobject('Account').retrieve(accountIds);
    for (const record of records) {
      assert.ok(record === null);
    }
  });
});

/**
 *
 */
describe('upsert', () => {
  const extId = `ID${Date.now()}`;
  let recId: string;
  //
  it('should upsert not exisiting record and get successfull result', async () => {
    const rec = {
      Name: 'New Record',
      [config.upsertField]: extId,
    };
    const ret = await conn
      .sobject(config.upsertTable)
      .upsert(rec, config.upsertField);
    assert.ok(ret.success);
    assert.ok(ret.created);
    assert.ok(typeof ret.id === 'string');
    recId = ret.id;
  });

  it('should upsert already existing record, get successfull result, and get updated record', async () => {
    const rec = { Name: 'Updated Record', [config.upsertField]: extId };
    const ret = await conn
      .sobject(config.upsertTable)
      .upsert(rec, config.upsertField);
    assert.ok(ret.success);
    assert.ok(!ret.created);
    assert.ok(ret.id === recId);
    const record = await conn.sobject(config.upsertTable).retrieve(recId);
    assert.ok(record.Name === 'Updated Record');
  });

  it('should upsert duplicated external id record and get multiple choise error', async () => {
    const rec1 = { Name: 'Duplicated Record', [config.upsertField]: extId };
    await conn.sobject(config.upsertTable).create(rec1);
    try {
      const rec2 = {
        Name: 'Updated Record, Twice',
        [config.upsertField]: extId,
      };
      await conn.sobject(config.upsertTable).upsert(rec2, config.upsertField);
      assert.fail();
    } catch (error) {
      const err = error as Error & {
        data: any;
      };
      assert.ok(err.name === 'MULTIPLE_CHOICES');
      assert.ok(Array.isArray(err.data));
      assert.ok(typeof err.data[0] === 'string');
    }
  });
});

/**
 *
 */
describe('search', () => {
  it('should search records', async () => {
    const id = Date.now();

    await insertAccounts(id, 20);

    const testRetryLimit = 5;
    let retryCounter = 0

    let recordsFound = false;

    while (!recordsFound && retryCounter <= testRetryLimit) {
      // wait 10s before running sosl search
      await delay(10000);

      const { searchRecords } = await conn.search(
        `FIND {"${id}"} IN NAME FIELDS RETURNING Account(Id, Name)`,
      );
      if (searchRecords.length === 20) {
        recordsFound = true
      } else {
        retryCounter++
      }
    }
    assert.ok(recordsFound)
  });
});

/**
 *
 */
describe('upsert multiple records', () => {
  const extIdField = config.upsertField;
  const sobjectType = config.upsertTable;
  const makeRecords = (prefix: string, count: number) =>
    Array.from({ length: count }, (_, i) => ({
      Name: `${prefix} #${i + 1}`,
      [extIdField]: `${prefix}_${Date.now()}_${i}`,
    }));

  it('should upsert 5 records on API < 46 (single-record requests)', async () => {
    const origVersion = conn.version;
    conn.version = '45.0';
    const records = makeRecords('Pre46', 5);
    const results = await conn.sobject(sobjectType).upsert(records, extIdField);
    assert.ok(Array.isArray(results));
    results.forEach((ret) => {
      assert.ok(ret.success);
      assert.ok(typeof ret.id === 'string');
    });
    // Clean up
    await conn.sobject(sobjectType).destroy(results.map(r => r.id!).filter((id): id is string => typeof id === 'string'));
    conn.version = origVersion;
  });

  it('should upsert 5 records on API >= 46 (sObject collection API)', async () => {
    const origVersion = conn.version;
    conn.version = '50.0';
    const records = makeRecords('Post46', 5);
    const results = await conn.sobject(sobjectType).upsert(records, extIdField);
    assert.ok(Array.isArray(results));
    results.forEach((ret) => {
      assert.ok(ret.success);
      assert.ok(typeof ret.id === 'string');
    });
    // Clean up
    await conn.sobject(sobjectType).destroy(results.map(r => r.id!).filter((id): id is string => typeof id === 'string'));
    conn.version = origVersion;
  });

  it('should upsert 5 records on API >= 46 with allOrNone=true and one invalid record, expect rollback', async () => {
    const origVersion = conn.version;
    conn.version = '50.0';
    const records = makeRecords('AllOrNone', 5);
    // Intentionally break one record (e.g., Name is required, so set to empty string)
    records[2] = { Name: '', [extIdField]: `AllOrNone_${Date.now()}_fail` };
    const results = await conn.sobject(sobjectType).upsert(records, extIdField, { allOrNone: true });
    assert.ok(Array.isArray(results));
    // All should be failed
    results.forEach((res) => {
      assert.strictEqual(res.success, false);
      assert.ok(Array.isArray(res.errors));
      // At least one error should be ALL_OR_NONE_OPERATION_ROLLED_BACK
      assert.ok(res.errors.some((e: any) => e.statusCode === 'ALL_OR_NONE_OPERATION_ROLLED_BACK'));
    });
    // None of the records should exist
    const extIds = records.map(r => r[extIdField]);
    const found = await conn.sobject(sobjectType).find({ [extIdField]: { $in: extIds } });
    assert.ok(Array.isArray(found));
    assert.strictEqual(found.length, 0);
    conn.version = origVersion;
  });
});
