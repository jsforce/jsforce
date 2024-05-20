import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import type { QuickAction } from '../src/quick-action';

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
it('should list global actions and return global actions', async () => {
  const results = await conn.quickActions();
  assert.ok(Array.isArray(results));
  for (const result of results) {
    assert.ok(isString(result.type));
    assert.ok(isString(result.name));
    assert.ok(isString(result.label));
    assert.ok(isObject(result.urls));
  }
});

/**
 *
 */
it('should list sobject actions and return global actions', async () => {
  const results = await conn.sobject('Account').quickActions();
  assert.ok(Array.isArray(results));
  for (const result of results) {
    assert.ok(isString(result.type));
    assert.ok(isString(result.name));
    assert.ok(isString(result.label));
    assert.ok(isObject(result.urls));
  }
});

let action: QuickAction<any>;

/**
 *
 */
it('should describe global action info and return global actions', async () => {
  action = conn.quickAction('LogACall');
  const res = await action.describe();
  assert.ok(isObject(res));
  assert.ok(isString(res.type));
  assert.ok(isString(res.name));
  assert.ok(isString(res.label));
  assert.ok(isObject(res.urls));
  assert.ok(isObject(res.layout));
  assert.ok(res.targetSobjectType === 'Task');
});

/**
 *
 */
it('should get default values of the action and return default field values', async () => {
  const res = await action.defaultValues();
  assert.ok(isObject(res));
  // assert.ok(res.Subject === null);
  assert.ok(res.Description === null);
  assert.ok(res.WhoId === null);
  assert.ok(res.WhatId === null);
});

/**
 *
 */
it('should get default values of the action for an account record and return default values', async () => {
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'JSforce QuickAction Test' });
  assert.ok(ret.success);
  const accId = ret.id;
  try {
    const res = await action.defaultValues(accId);
    assert.ok(isObject(res));
    // assert.ok(res.Subject === null);
    assert.ok(res.Description === null);
    assert.ok(res.WhoId === null);
    assert.ok(res.WhatId === accId);
  } finally {
    await conn.sobject('Account').destroy(accId);
  }
});

/**
 *
 */
it('should execute action for record', async () => {
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'JSforce QuickAction Test' });
  assert.ok(ret.success);
  const accId = ret.id;
  const record = {
    Subject: 'My Task Test',
    Description: 'This is the task',
  };
  try {
    const res = await action.execute(accId, record);
    assert.ok(isObject(res));
    assert.ok(res.success === true);
    assert.ok(res.created === true);
    assert.ok(isString(res.id));
    assert.ok(Array.isArray(res.feedItemIds));
    assert.ok(res.contextId === accId);
  } finally {
    await conn.sobject('Account').destroy(accId);
  }
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
