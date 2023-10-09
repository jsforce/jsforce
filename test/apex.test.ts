import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject } from './util';
import { beforeAll, it, afterAll } from '@jest/globals';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

let accountId: string;

/**
 *
 */
it('should post account info and return created account id', async () => {
  const params = {
    name: 'My Apex Rest Test #1',
    phone: '654-321-0000',
    website: 'http://www.google.com',
  };
  const id = await conn.apex.post('/JSforceTestApexRest/', params);
  assert.ok(typeof id === 'string');
  accountId = id;
});

/**
 *
 */
it('should get account info and return created account', async () => {
  const acc = await conn.apex.get(`/JSforceTestApexRest/${accountId}`);
  assert.ok(isObject(acc));
  assert.ok(acc.Name === 'My Apex Rest Test #1');
  assert.ok(acc.Phone === '654-321-0000');
  assert.ok(acc.Website === 'http://www.google.com');
});

/**
 *
 */
it('should put account info and return updated account', async () => {
  const params = {
    account: {
      Name: 'My Apex Rest Test #1 (put)',
      Phone: null,
    },
  };
  const acc = await conn.apex.put(`/JSforceTestApexRest/${accountId}`, params);
  assert.ok(isObject(acc));
  assert.ok(acc.Name === 'My Apex Rest Test #1 (put)');
  assert.ok(typeof acc.Phone === 'undefined');
  assert.ok(acc.Website === 'http://www.google.com');
});

/**
 *
 */
it('should patch account info and return updated account', async () => {
  const params = {
    name: 'My Apex Rest Test #1 (patch)',
  };
  const acc = await conn.apex.patch(
    `/JSforceTestApexRest/${accountId}`,
    params,
  );
  assert.ok(isObject(acc));
  assert.ok(acc.Name === 'My Apex Rest Test #1 (patch)');
  assert.ok(typeof acc.Phone === 'undefined');
  assert.ok(acc.Website === 'http://www.google.com');
});

/**
 *
 */
it('should delete account info and get no account for delete account id', async () => {
  await conn.apex.delete(`/JSforceTestApexRest/${accountId}`);
  const records = await conn.sobject('Account').find({ Id: accountId });
  assert.ok(records.length === 0);
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
