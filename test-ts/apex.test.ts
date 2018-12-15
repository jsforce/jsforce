import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject } from './util';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection(); // TODO: remove any

/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});

let accountId: string;

/**
 *
 */
test('post account info and return created account id', async (t) => {
  const params = {
    name: 'My Apex Rest Test #1',
    phone: '654-321-0000',
    website: 'http://www.google.com'
  };
  const id = await conn.apex.post('/JSforceTestApexRest/', params);
  t.true(typeof id === 'string');
  accountId = id;
});

/**
 *
 */
test('get account info and return created account', async (t) => {
  const acc = await conn.apex.get(`/JSforceTestApexRest/${accountId}`);
  t.true(isObject(acc));
  t.true(acc.Name === 'My Apex Rest Test #1');
  t.true(acc.Phone === '654-321-0000');
  t.true(acc.Website === 'http://www.google.com');
});


/**
 *
 */
test('put account info and return updated account', async (t) => {
  const params = {
    account: {
      Name: 'My Apex Rest Test #1 (put)',
      Phone: null,
    },
  };
  const acc = await conn.apex.put(`/JSforceTestApexRest/${accountId}`, params);
  t.true(isObject(acc));
  t.true(acc.Name === 'My Apex Rest Test #1 (put)');
  t.true(typeof acc.Phone === 'undefined');
  t.true(acc.Website === 'http://www.google.com');
});


/**
 *
 */
test('patch account info and return updated account', async (t) => {
  const params = {
    name: 'My Apex Rest Test #1 (patch)'
  };
  const acc = await conn.apex.patch(`/JSforceTestApexRest/${accountId}`, params);
  t.true(isObject(acc));
  t.true(acc.Name === 'My Apex Rest Test #1 (patch)');
  t.true(typeof acc.Phone === 'undefined');
  t.true(acc.Website === 'http://www.google.com');
});

/**
 *
 */
test('delete account info and get no account for delete account id', async (t) => {
  await conn.apex.delete(`/JSforceTestApexRest/${accountId}`);
  const records = await conn.sobject('Account').find({ Id: accountId });
  t.true(records.length === 0);
});


/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
