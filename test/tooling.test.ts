import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isNumber, isString, isObject } from './util';
import type { Record } from '../src';
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
  const res = await conn.tooling.completions('visualforce');
  assert.ok(isObject(res));
  assert.ok(isObject(res.completions));
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
    const record = await conn.tooling.create(
      'StaticResource',
      request,
      options,
    );
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

    const record = await conn.tooling.create(
      'StaticResource',
      request,
      options,
    );
    assert.ok(record.success);
  }
});

it('can download a static resource binary blob and properly interpret the results', async () => {
  if (isNodeJS()) {
    const base64bytes = fs
      .readFileSync('test/data/test.zip')
      .toString('base64');
    const request = createStaticResourceRequest(base64bytes);
    const result = await conn.tooling.create('StaticResource', request);
    assert.ok(result.success);

    const record = await conn.tooling.retrieve('StaticResource', result.id);
    assert.ok(isString(record.Body));

    const response = await conn.tooling.request<string>(record.Body, {
      encoding: 'base64',
    });
    assert.ok(response == base64bytes);
  }
});

function createStaticResourceRequest(body: string | Buffer) {
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
describe('single record crud', () => {
  let debugLevelId: string;
  let debugLevel: Record;

  //
  it('should create debuglevel and get created obj', async () => {
    const ret = await conn.tooling.sobject('DebugLevel').create({
      ApexCode: 'ERROR',
      ApexProfiling: 'ERROR',
      Callout: 'ERROR',
      Database: 'ERROR',
      DeveloperName: 'jsforce_testing',
      MasterLabel: 'jsforce Testing',
      Nba: 'ERROR',
      System: 'ERROR',
      Validation: 'ERROR',
      Visualforce: 'ERROR',
      Wave: 'ERROR',
      Workflow: 'ERROR',
    });
    assert.ok(ret.success);
    assert.ok(typeof ret.id === 'string');
    debugLevelId = ret.id ;
  });

  //
  it('should retrieve debuglevel and return a record', async () => {
    const record = await conn.tooling
      .sobject('DebugLevel')
      .retrieve(debugLevelId);
    assert.ok(typeof record.Id === 'string');
    assert.ok(isObject(record.attributes));
    debugLevel = record;
  });

  //
  it('should update debuglevel, get successful result, and retrieve the updated record', async () => {
    const ret = await conn.tooling
      .sobject('DebugLevel')
      .record(debugLevel.Id as string)
      .update({ ApexCode: 'WARN' });
    assert.ok(ret.success);
    const record = await conn.tooling
      .sobject('DebugLevel')
      .record(debugLevelId)
      .retrieve();
    assert.ok(record.ApexCode === 'WARN');
    assert.ok(isObject(record.attributes));
  });

  //
  it('should delete debuglevel, get successful results, and not get any records', async () => {
    const ret = await conn.tooling
      .sobject('DebugLevel')
      .record(debugLevelId)
      .destroy();
    assert.ok(ret.success);
    let record;
    let err;
    try {
      record = await conn.tooling.sobject('DebugLevel').retrieve(debugLevelId);
    } catch (error) {
      err = error as Error;
      assert.ok(record === undefined);
      assert.ok(err.name === 'NOT_FOUND');
    }
  });
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
