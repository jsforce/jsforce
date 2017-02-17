import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject } from './util';

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
test.group('single crud', (test) => {
  let accountId;
  let account;

  //
  test.serial('create account and get created obj', async (t) => {
    const ret = await conn.sobject('Account').create({ Name: 'Hello' });
    t.true(ret.success);
    t.true(typeof ret.id === 'string');
    accountId = ret.id;
  });

  //
  test.serial('retrieve account and return a record', async (t) => {
    const record = await conn.sobject('Account').retrieve(accountId);
    t.true(typeof record.Id === 'string');
    t.true(isObject(record.attributes));
    account = record;
  });

  //
  test.serial('update account, get successful result, and retrieve the updated record', async (t) => {
    const ret = await conn.sobject('Account').record(account.Id).update({ Name: 'Hello2' });
    t.true(ret.success);
    const record = await conn.sobject('Account').record(accountId).retrieve();
    t.true(record.Name === 'Hello2');
    t.true(isObject(record.attributes));
  });

  //
  test.serial('update account with options headers, get successfull result, and retrieve the updated record', async (t) => {
    const options = {
      headers: {
        'SForce-Auto-Assign': 'FALSE',
      },
    };
    const ret = await conn.sobject('Account').record(account.Id).update({ Name: 'Hello3' }, options);
    t.true(ret.success);
    const record = await conn.sobject('Account').record(accountId).retrieve(options);
    t.true(record.Name === 'Hello3');
    t.true(isObject(record.attributes));
  });
});


/**
 *
 */
test.before('close connection', async () => {
  await connMgr.closeConnection(conn);
});
