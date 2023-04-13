import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isNumber, isString, isObject } from './util';
import fs from './helper/fs';
import { isNodeJS } from './helper/env';

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
it('should describe global', async () => {
  const res = await conn.tooling.describeGlobal();
  assert.ok(isString(res.encoding));
  assert.ok(isNumber(res.maxBatchSize));
  assert.ok(Array.isArray(res.sobjects));
});

/**
 *
 */
it('should describe tooling sobject', async () => {
  const so = await conn.tooling.sobject('ApexClass').describe();
  assert.ok(isString(so.name));
  assert.ok(isString(so.label));
  assert.ok(Array.isArray(so.fields));
});

/**
 *
 */
it('should find tooling sobject record', async () => {
  const rec = await conn.tooling.sobject('ApexClass').findOne();
  if (rec) {
    assert.ok(isString(rec.Id));
  }
});

/**
 *
 */
it('should execute anonymous apex and execute successfully', async () => {
  const body = ["System.debug('Hello, World');"].join('\n');
  const res = await conn.tooling.executeAnonymous(body);
  assert.ok(res.compiled === true);
  assert.ok(res.success === true);
});

/**
 *
 */
it('should run tests asynchronously', async () => {
  const id = await conn.tooling.runTestsAsynchronous({
    classNames: 'JSforceTestLogicTest',
  });
  assert.ok(typeof id === 'string');
});

/**
 *
 */
it('should run tests synchronously', async () => {
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
it('should get completions and return completions', async () => {
  const res = await conn.tooling.completions('apex');
  assert.ok(isObject(res));
  assert.ok(isObject(res.publicDeclarations));
});

it('can create static resource using application/json content type', async () => {
  if (isNodeJS()) {
    const request = createStaticResourceRequest(
      fs.readFileSync('test/data/test.zip').toString('base64'),
    );
    const record = await conn.tooling.create('StaticResource', request);
    assert.ok(record.success);
  }
});

it('can create static resource using multipart/form-data content type with a buffer', async () => {
  if (isNodeJS()) {
    const request = createStaticResourceRequest(
      fs.readFileSync('test/data/test.zip'),
    );
    const options = {
      multipartFileFields: {
        Body: {
          contentType: 'application/zip',
          filename: 'test.zip',
        },
      },
    };
    const record = await conn.tooling.create('StaticResource', request, options);
    assert.ok(record.success);
  }
});

it('can create static resource using multipart/form-data content type with a base64 encoded string', async () => {
  if (isNodeJS()) {
    const request = createStaticResourceRequest(
      fs.readFileSync('test/data/test.zip').toString('base64'),
    );

    const options = {
      multipartFileFields: {
        Body: {
          contentType: 'application/zip',
          filename: 'test.zip',
        },
      },
    };

    const record = await conn.tooling.create('StaticResource', request, options);
    assert.ok(record.success);
  }
});

function createStaticResourceRequest(body: String | Buffer) {
  return {
    ContentType: 'application/zip',
    CacheControl: 'Private',
    Name: 'TestZip_' + Date.now(),
    Body: body,
  };
}

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
