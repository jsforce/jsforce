import fs from 'fs';
import path from 'path';
import test from './util/ava/ext';
import { Connection } from '..';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import { isNodeJS } from './helper/env';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection();
conn.metadata.pollTimeout = 40 * 1000; // adjust poll timeout to test timeout.


/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});


/**
 * Synchronous CRUD call tests (create, read, update, upsert, rename, delete)
 */
test.group('CRUD based call', (test) => {
  const metadata = [{
    fullName: 'JSforceTestObjectSync1__c',
    label: 'Test Object Sync 1',
    pluralLabel: 'Test Object Sync 1',
    nameField: {
      type: 'Text',
      label: 'Test Object Name'
    },
    deploymentStatus: 'Deployed',
    sharingModel: 'ReadWrite'
  }, {
    fullName: 'JSforceTestObjectSync2__c',
    label: 'Test Object Sync 2',
    pluralLabel: 'Test Object 2',
    nameField: {
      type: 'AutoNumber',
      label: 'Test Object #'
    },
    deploymentStatus: 'InDevelopment',
    sharingModel: 'Private'
  }];
  let fullNames = metadata.map(meta => meta.fullName);

  /**
   *
   */
  test('create metadata synchronously and create custom objects', async (t) => {
    const results = await conn.metadata.create('CustomObject', metadata);
    t.true(Array.isArray(results));
    t.true(results.length === metadata.length);
    for (const result of results) {
      t.true(result.success === true);
      t.true(isString(result.fullName));
    }
  });

  let rmetadata: any = null;

  /**
   *
   */
  test('read metadata synchronously and return custom objects metadata', async (t) => {
    const results = await conn.metadata.read('CustomObject', fullNames);
    t.true(Array.isArray(results));
    t.true(results.length === fullNames.length);
    for (const result of results) {
      t.true(isString(result.fullName));
      t.true(isObject(result.nameField));
      t.true(isString(result.nameField.label));
    }
    rmetadata = results;
  });

  /**
   *
   */
  test('update metadata synchronously return updated custom object metadata', async (t) => {
    rmetadata[0].label = 'Updated Test Object Sync 2';
    rmetadata[1].deploymentStatus = 'Deployed';
    const results = await conn.metadata.update('CustomObject', rmetadata);
    t.true(Array.isArray(results));
    t.true(results.length === fullNames.length);
    for (const result of results) {
      t.true(result.success === true);
      t.true(isString(result.fullName));
    }
    rmetadata = results;
  });

  /**
   *
   */
  test('upsert metadata synchronously and upsert custom objects', async (t) => {
    const umetadata = [{
      fullName: 'JSforceTestObjectSync2__c',
      label: 'Upserted Object Sync 2',
      pluralLabel: 'Upserted Object Sync 2',
      nameField: {
        type: 'Text',
        label: 'Test Object Name'
      },
      deploymentStatus: 'Deployed',
      sharingModel: 'ReadWrite'
    }, {
      fullName: 'JSforceTestObjectSync3__c',
      label: 'Upserted Object Sync 3',
      pluralLabel: 'Upserted Object Sync 3',
      nameField: {
        type: 'Text',
        label: 'Test Object Name'
      },
      deploymentStatus: 'Deployed',
      sharingModel: 'ReadWrite'
    }];
    const results = await conn.metadata.upsert('CustomObject', umetadata);
    t.true(Array.isArray(results));
    t.true(results.length === umetadata.length);
    for (const [i, result] of results.entries()) {
      t.true(result.success === true);
      t.true(result.created === (result.fullName === 'JSforceTestObjectSync3__c'));
      t.true(result.fullName === umetadata[i].fullName);
    }
  });

  /**
   *
   */
  test('rename metadata synchronously and rename a custom object', async (t) => {
    const oldName = fullNames[0];
    const newName = oldName.replace(/__c$/, 'Updated__c');
    // Rename operation is not working before API version 35.0
    // because of the "enableSearch" property introduced in API 35.0.
    const origVersion = conn.version;
    if (parseFloat(conn.version) < 35) {
      conn.version = '35.0';
    }
    try {
      let result = await conn.metadata.rename('CustomObject', oldName, newName);
      t.true(result.success === true);
      t.true(isString(result.fullName));
      t.true(result.fullName === oldName);
      result = await conn.metadata.read('CustomObject', newName);
      t.true(isString(result.fullName));
      t.true(result.fullName === newName);
    } finally {
      conn.version = origVersion;
    }
  });

  /**
   *
   */
  test('list metadata synchronously and list custom objects', async (t) => {
    const results = await conn.metadata.list({ type: 'CustomObject' });
    t.true(Array.isArray(results));
    for (const result of results) {
      t.true(result.type === 'CustomObject');
      t.true(isString(result.id));
      t.true(isString(result.fullName));
    }
    fullNames =
      results.filter((m: any) => m.fullName.match(/^JSforceTestObject.+__c$/))
        .map((m: any) => m.fullName);
  });

  /**
   *
   */
  test('delete metadata synchronously and delete custom objects', async (t) => {
    const results = await conn.metadata.delete('CustomObject', fullNames);
    t.true(Array.isArray(results));
    t.true(results.length === fullNames.length);
    for (const result of results) {
      t.true(result.success === true);
      t.true(isString(result.fullName));
    }
  });
}); // end of CRUD based call tests

/*------------------------------------------------------------------------*/

/**
 *
 */
test.group('file based call', (test) => {
  /**
   *
   */
  if (isNodeJS()) {
    test('deploy metadata in packaged file and deploy package', async (t) => {
      const zipStream = fs.createReadStream(path.join(__dirname, '/data/MyPackage.zip'));
      const result =
        await conn.metadata.deploy(zipStream, {
          testLevel: 'RunSpecifiedTests',
          runTests: ['MyApexTriggerTest'],
        })
        .complete();
      t.true(result.done === true);
      t.true(result.success === true);
      t.true(result.status === 'Succeeded');
      t.true(result.numberComponentErrors === 0);
      t.true(result.numberComponentsDeployed === result.numberComponentsTotal);
      t.true(result.numberTestsCompleted === 1);
    });
  }

  /**
   *
   */
  test('retrieve metadata in packaged file and retrieve package', async (t) => {
    const bufs: any[] = [];
    await new Promise((resolve, reject) => {
      conn.metadata.retrieve({ packageNames: ['My Test Package'] })
        .stream()
        .on('data', (d: any) => bufs.push(d))
        .on('end', resolve)
        .on('error', reject);
    });
    t.true(bufs.length > 0);
  });
});


/*------------------------------------------------------------------------*/

/**
 *
 */
test.group('session refresh', (test) => {
  /**
   *
   */
  test('refresh metadata API session and list metadata even if the session has been expired', async (t) => {
    let refreshCalled = false;
    const conn2: any = new Connection({ // TODO: remove any
      instanceUrl: conn.instanceUrl,
      accessToken: 'invalid_token',
      logLevel: config.logLevel,
      proxyUrl: config.proxyUrl,
      refreshFn: (c, callback) => {
        refreshCalled = true;
        setTimeout(() => callback(null, conn.accessToken || ''), 500);
      },
    });
    const results = await conn2.metadata.list({ type: 'CustomObject' });
    t.true(refreshCalled);
    t.true(Array.isArray(results));
  });
});

/*------------------------------------------------------------------------*/


/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
