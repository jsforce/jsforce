import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject } from './util';
import type { Record, SavedRecord } from 'jsforce';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

// copied from '../src/http-api' to avoid exporting it
class HttpApiError extends Error {
  errorCode: string;
  content: any;
  constructor(message: string, errorCode?: string | undefined, content?: any) {
    super(message);
    this.name = errorCode || this.name;
    this.errorCode = this.name;
    this.content = content;
  }
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
describe('single record crud', () => {
  let accountId: string;
  let account: Record;

  //
  it('should create account and get created obj', async () => {
    const ret = await conn.sobject('Account').create({ Name: 'Hello' });
    assert.ok(ret.success);
    assert.ok(typeof ret.id === 'string');
    accountId = ret.id as string;
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
      const err = error as HttpApiError
      assert.ok(err.name === 'MULTIPLE_CHOICES');
      assert.ok(Array.isArray(err.content));
      assert.ok(typeof err.content[0] === 'string');
    }
  });
});

/**
 *
 */
describe('search', () => {
  it('should search records', async () => {
    const { searchRecords } = await conn.search(
      'FIND {Ac*} IN ALL FIELDS RETURNING Account(Id, Name)',
    );
    assert.ok(searchRecords.length > 0);
  });
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
