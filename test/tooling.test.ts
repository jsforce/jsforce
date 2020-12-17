import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isNumber, isString, isObject } from './util';

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
test('describe global', async () => {
  const res = await conn.tooling.describeGlobal();
  assert.ok(isString(res.encoding));
  assert.ok(isNumber(res.maxBatchSize));
  assert.ok(Array.isArray(res.sobjects));
});

/**
 *
 */
test('describe tooling sobject', async () => {
  const so = await conn.tooling.sobject('ApexClass').describe();
  assert.ok(isString(so.name));
  assert.ok(isString(so.label));
  assert.ok(Array.isArray(so.fields));
});

/**
 *
 */
test('find tooling sobject record', async () => {
  const rec = await conn.tooling.sobject('ApexClass').findOne();
  if (rec) {
    assert.ok(isString(rec.Id));
  }
});

/**
 *
 */
test('execute anonymous apex and execute successfully', async () => {
  const body = ["System.debug('Hello, World');"].join('\n');
  const res = await conn.tooling.executeAnonymous(body);
  assert.ok(res.compiled === true);
  assert.ok(res.success === true);
});

/**
 *
 */
test('run tests asynchronously', async () => {
  const id = await conn.tooling.runTestsAsynchronous({
    classNames: 'JSforceTestLogicTest',
  });
  assert.ok(typeof id === 'string');
});

/**
 *
 */
test('run tests synchronously', async () => {
  const cls = await conn.tooling
    .sobject('ApexClass')
    .findOne({ Name: 'JSforceTestLogicTest' });
  const clsid = cls?.Id ?? '';
  const res = await conn.tooling.runTestsSynchronous({
    tests: [{ classId: clsid }],
    maxFailedTests: 0,
  });
  assert.ok(isObject(res));
  if (res) {
    assert.ok(res.failures.length <= 1);
  }
});

/**
 *
 */
test('get completions and return completions', async () => {
  const res = await conn.tooling.completions('apex');
  assert.ok(isObject(res));
  assert.ok(isObject(res.publicDeclarations));
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
