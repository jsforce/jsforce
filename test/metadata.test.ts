import path from 'path';
import assert from 'assert';
import fs from './helper/fs';
import { Connection } from 'jsforce';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';
import { isNodeJS } from './helper/env';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.metadata.pollTimeout = 40 * 1000; // adjust poll timeout to test timeout.

// TODO: remove the overriding of connection version when updated the default API version.
// At least ver 45.0 is needed to pass rename test, otherwise it fails `enableLicensing` not valid error.
conn.version = '45.0';

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 * Synchronous CRUD call tests (create, read, update, upsert, rename, delete)
 */
describe('CRUD based call', () => {
  const metadata = [
    {
      fullName: 'JSforceTestObjectSync1__c',
      label: 'Test Object Sync 1',
      pluralLabel: 'Test Object Sync 1',
      nameField: {
        type: 'Text',
        label: 'Test Object Name',
      },
      description: 'This is a test #1 object for JSforce test',
      deploymentStatus: 'Deployed',
      sharingModel: 'ReadWrite',
    },
    {
      fullName: 'JSforceTestObjectSync2__c',
      label: 'Test Object Sync 2',
      pluralLabel: 'Test Object 2',
      nameField: {
        type: 'AutoNumber',
        label: 'Test Object #',
      },
      description: 'This is a test #2 object for JSforce test',
      deploymentStatus: 'InDevelopment',
      sharingModel: 'Private',
    },
  ];
  let fullNames = metadata.map((meta) => meta.fullName);

  /**
   *
   */
  it('should create metadata synchronously and create custom objects', async () => {
    const results = await conn.metadata.create('CustomObject', metadata);
    assert.ok(Array.isArray(results));
    assert.ok(results.length === metadata.length);
    for (const result of results) {
      assert.ok(result.success === true);
      assert.ok(isString(result.fullName));
    }
  });

  let rmetadata: any = null;

  /**
   *
   */
  it('should read metadata synchronously and return custom objects metadata', async () => {
    const results = await conn.metadata.read('CustomObject', fullNames);
    assert.ok(Array.isArray(results));
    assert.ok(results.length === fullNames.length);
    for (const result of results) {
      assert.ok(isString(result.fullName));
      assert.ok(isObject(result.nameField));
      assert.ok(isString(result.nameField.label)); // TODO: remove "!" when assertion function is introduced
    }
    rmetadata = results;
  });

  /**
   *
   */
  it('should update metadata synchronously return updated custom object metadata', async () => {
    rmetadata[0].label = 'Updated Test Object Sync 2';
    rmetadata[0].description = null;
    rmetadata[1].deploymentStatus = 'Deployed';
    const results = await conn.metadata.update('CustomObject', rmetadata);
    assert.ok(Array.isArray(results));
    assert.ok(results.length === fullNames.length);
    for (const result of results) {
      assert.ok(result.success === true);
      assert.ok(isString(result.fullName));
    }
    const objMeta = await conn.metadata.read('CustomObject', fullNames);
    assert.ok(objMeta[0].label === 'Updated Test Object Sync 2');
    assert.ok(objMeta[0].description == null);
    assert.ok(objMeta[1].deploymentStatus === 'Deployed');
    rmetadata = results; // eslint-disable-line require-atomic-updates
  });

  /**
   *
   */
  it('should upsert metadata synchronously and upsert custom objects', async () => {
    const umetadata = [
      {
        fullName: 'JSforceTestObjectSync2__c',
        label: 'Upserted Object Sync 2',
        pluralLabel: 'Upserted Object Sync 2',
        nameField: {
          type: 'Text',
          label: 'Test Object Name',
        },
        deploymentStatus: 'Deployed',
        sharingModel: 'ReadWrite',
      },
      {
        fullName: 'JSforceTestObjectSync3__c',
        label: 'Upserted Object Sync 3',
        pluralLabel: 'Upserted Object Sync 3',
        nameField: {
          type: 'Text',
          label: 'Test Object Name',
        },
        deploymentStatus: 'Deployed',
        sharingModel: 'ReadWrite',
      },
    ];
    const results = await conn.metadata.upsert('CustomObject', umetadata);
    assert.ok(Array.isArray(results));
    assert.ok(results.length === umetadata.length);
    for (const [i, result] of results.entries()) {
      assert.ok(result.success === true);
      assert.ok(
        result.created === (result.fullName === 'JSforceTestObjectSync3__c'),
      );
      assert.ok(result.fullName === umetadata[i].fullName);
    }
  });

  /**
   *
   */
  it('should rename metadata synchronously and rename a custom object', async () => {
    const oldName = fullNames[0];
    const newName = oldName.replace(/__c$/, 'Updated__c');
    // Rename operation is not working before API version 35.0
    // because of the "enableSearch" property introduced in API 35.0.
    const origVersion = conn.version;
    if (parseFloat(conn.version) < 35) {
      conn.version = '35.0';
    }
    try {
      const result = await conn.metadata.rename(
        'CustomObject',
        oldName,
        newName,
      );
      assert.ok(result.success === true);
      assert.ok(isString(result.fullName));
      assert.ok(result.fullName === oldName);
      const co = await conn.metadata.read('CustomObject', newName);
      assert.ok(isString(co.fullName));
      assert.ok(co.fullName === newName);
    } finally {
      conn.version = origVersion; // eslint-disable-line require-atomic-updates
    }
  });

  /**
   *
   */
  it('should list metadata synchronously and list custom objects', async () => {
    const results = await conn.metadata.list({ type: 'CustomObject' });
    assert.ok(Array.isArray(results));
    for (const result of results) {
      assert.ok(result.type === 'CustomObject');
      assert.ok(isString(result.id));
      assert.ok(isString(result.fullName));
    }
    fullNames = results
      .filter((m) => m.fullName.match(/^JSforceTestObject.+__c$/))
      .map((m) => m.fullName);
  });

  /**
   *
   */
  it('should delete metadata synchronously and delete custom objects', async () => {
    const results = await conn.metadata.delete('CustomObject', fullNames);
    assert.ok(Array.isArray(results));
    assert.ok(results.length === fullNames.length);
    for (const result of results) {
      assert.ok(result.success === true);
      assert.ok(isString(result.fullName));
    }
  });
}); // end of CRUD based call tests

/*------------------------------------------------------------------------*/

if (isNodeJS()) {
  /**
   * Test metadata rest api with form data from zip file
   */
  describe('REST API deploy', () => {
    it('should deploy metadata in packaged file and deploy package', async () => {
      const zipBuffer = await fs.promises.readFile(
        path.join(__dirname, '/data/MyPackage.zip'),
      );
      const result = await conn.metadata
        .deployRest(zipBuffer, {
          testLevel: 'RunSpecifiedTests',
          runTests: ['MyApexTriggerTest'],
        })
        .complete();
      assert.ok(result.done === true);
      assert.ok(result.success === true);
      assert.ok(result.status === 'Succeeded');
      assert.ok(result.numberComponentErrors === 0);
      assert.ok(
        result.numberComponentsDeployed === result.numberComponentsTotal,
      );
      assert.ok(result.numberTestsCompleted === 1);
    });
  });
}

if (isNodeJS()) {
  describe('deployRecentValidation', () => {
    it('deployRecentValidation() should return string, and different id (REST)', async () => {
      const zipBuffer = await fs.promises.readFile(
        path.join(__dirname, '/data/MyPackage.zip'),
      );
      const deploy = await conn.metadata
        .deployRest(zipBuffer, {
          testLevel: 'RunAllTestsInOrg',
          checkOnly: true,
        })
        .complete();
      const result = await conn.metadata.deployRecentValidation({
        id: deploy.id,
        rest: true,
      });
      assert.ok(typeof result === 'string');
      assert.ok(result !== deploy.id);
    });

    it('deployRecentValidation() should return string, and different id (SOAP)', async () => {
      const zipBuffer = await fs.promises.readFile(
        path.join(__dirname, '/data/MyPackage.zip'),
      );
      const deploy = await conn.metadata
        .deploy(zipBuffer, {
          testLevel: 'RunAllTestsInOrg',
          checkOnly: true,
        })
        .complete();
      const result = await conn.metadata.deployRecentValidation({
        id: deploy.id,
        rest: false,
      });
      assert.ok(typeof result === 'string');
      assert.ok(result !== deploy.id);
    });
  });
}
/**
 *
 */
describe('file based call', () => {
  /**
   *
   */
  if (isNodeJS()) {
    it('should deploy metadata in packaged file and deploy package', async () => {
      const zipStream = fs.createReadStream(
        path.join(__dirname, '/data/MyPackage.zip'),
      );
      const result = await conn.metadata
        .deploy(zipStream, {
          testLevel: 'RunSpecifiedTests',
          runTests: ['MyApexTriggerTest'],
        })
        .complete();
      assert.ok(result.done === true);
      assert.ok(result.success === true);
      assert.ok(result.status === 'Succeeded');
      assert.ok(result.numberComponentErrors === 0);
      assert.ok(
        result.numberComponentsDeployed === result.numberComponentsTotal,
      );
      assert.ok(result.numberTestsCompleted === 1);
    });
  }

  /**
   *
   */
  it('should retrieve metadata in packaged file and retrieve package', async () => {
    // increase default timeout of 10s to 30s
    conn.metadata.pollTimeout = 30000;

    const bufs: any[] = [];
    await new Promise((resolve, reject) => {
      const stream = conn.metadata
        .retrieve({ packageNames: ['My Test Package'] })
        .stream();
      stream
        .on('readable', () => bufs.push(stream.read()))
        .on('end', resolve)
        .on('error', reject);
    });
    assert.ok(bufs.length > 0);
  });
});

/*------------------------------------------------------------------------*/

/**
 *
 */
describe('session refresh', () => {
  /**
   *
   */
  it('should refresh metadata API session and list metadata even if the session has been expired', async () => {
    let refreshCalled = false;
    const conn2 = new Connection({
      // TODO: remove any
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
    assert.ok(refreshCalled);
    assert.ok(Array.isArray(results));
  });
});
