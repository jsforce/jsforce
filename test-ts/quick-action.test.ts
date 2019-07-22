import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';

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
test('list global actions and return global actions', async (t) => {
  const results = await conn.quickActions();
  t.true(Array.isArray(results));
  for (const result of results) {
    t.true(isString(result.type));
    t.true(isString(result.name));
    t.true(isString(result.label));
    t.true(isObject(result.urls));
  }
});

/**
 *
 */
test('list sobject actions and return global actions', async (t) => {
  const results = await conn.sobject('Account').quickActions();
  t.true(Array.isArray(results));
  for (const result of results) {
    t.true(isString(result.type));
    t.true(isString(result.name));
    t.true(isString(result.label));
    t.true(isObject(result.urls));
  }
});

let action: any; // TODO: remove any

/**
 *
 */
test('describe global action info and return global actions', async (t) => {
  action = conn.quickAction('LogACall');
  const res = await action.describe();
  t.true(isObject(res));
  t.true(isString(res.type));
  t.true(isString(res.name));
  t.true(isString(res.label));
  t.true(isObject(res.urls));
  t.true(isObject(res.layout));
  t.true(res.targetSobjectType === 'Task');
});

/**
 *
 */
test('get default values of the action and return default field values', async (t) => {
  const res = await action.defaultValues();
  t.true(isObject(res));
  // t.true(res.Subject === null);
  t.true(res.Description === null);
  t.true(res.WhoId === null);
  t.true(res.WhatId === null);
});

/**
 *
 */
test('get default values of the action for an account record and return default values', async (t) => {
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'JSforce QuickAction Test' });
  const accId = ret.id;
  try {
    const res = await action.defaultValues(accId);
    t.true(isObject(res));
    // t.true(res.Subject === null);
    t.true(res.Description === null);
    t.true(res.WhoId === null);
    t.true(res.WhatId === accId);
  } finally {
    await conn.sobject('Account').destroy(accId);
  }
});

/**
 *
 */
test('execute action for record', async (t) => {
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'JSforce QuickAction Test' });
  const accId = ret.id;
  const record = {
    Subject: 'My Task Test',
    Description: 'This is the task',
  };
  try {
    const res = await action.execute(accId, record);
    t.true(isObject(res));
    t.true(res.success === true);
    t.true(res.created === true);
    t.true(isString(res.id));
    t.true(Array.isArray(res.feedItemIds));
    t.true(res.contextId === accId);
  } finally {
    await conn.sobject('Account').destroy(accId);
  }
});

/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
