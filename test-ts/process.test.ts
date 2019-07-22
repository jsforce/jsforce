import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

let accountId: string;

/**
 * Test data setup
 */
beforeAll(async () => {
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'JSforce ProcessRule/ApprovalProcess Test' });
  accountId = ret.id;
});

/**
 *
 */
describe('process rule', () => {
  /**
   *
   */
  test('retrieve all process rules and list process rules', async () => {
    const ruleSet = await conn.process.rule.list();
    for (const rules of Object.values(ruleSet)) {
      for (const rule of rules as any) {
        assert.ok(isString(rule.id));
        assert.ok(isString(rule.name));
        assert.ok(isString(rule.object));
      }
    }
  });

  /**
   *
   */
  test('trigger process rule and trigger process rules', async () => {
    const result = await conn.process.rule.trigger(accountId);
    assert.ok(result.success);
    assert.ok(result.errors === null);
  });
});

/**
 *
 */
describe('approval process', () => {
  /**
   *
   */
  test('retrieve all approval process definitions and list approval process definitions', async () => {
    const defsSet = await conn.process.rule.list();
    for (const approvals of Object.values(defsSet)) {
      for (const approval of approvals as any) {
        assert.ok(isObject(approval));
        assert.ok(isString(approval.id));
        assert.ok(isString(approval.name));
        assert.ok(isString(approval.object));
        assert.ok(Array.isArray(approval.actions));
      }
    }
  });

  let workitemId: string;
  /**
   *
   */
  test('submit approval process and confirm approval request submitted', async () => {
    const result = await conn.process.approval.submit(
      accountId,
      'This is test approval request submission.',
    );
    assert.ok(result.success);
    assert.ok(result.errors === null);
    assert.ok(Array.isArray(result.actorIds));
    assert.ok(isString(result.entityId));
    assert.ok(isString(result.instanceId));
    assert.ok(result.instanceStatus === 'Pending');
    assert.ok(Array.isArray(result.newWorkitemIds));
    workitemId = result.newWorkitemIds[0];
  });

  /**
   *
   */
  test('approve requested approval request', async () => {
    const result = await conn.process.approval.approve(workitemId, 'Approved.');
    assert.ok(result.success);
    assert.ok(result.errors === null);
    assert.ok(Array.isArray(result.actorIds));
    assert.ok(isString(result.entityId));
    assert.ok(isString(result.instanceId));
    assert.ok(result.instanceStatus === 'Pending');
    assert.ok(Array.isArray(result.newWorkitemIds));
    workitemId = result.newWorkitemIds[0]; // eslint-disable-line require-atomic-updates
  });

  /**
   *
   */
  test('reject approval request', async () => {
    const result = await conn.process.approval.reject(workitemId, 'Rejected.');
    assert.ok(result.success);
    assert.ok(result.errors === null);
    assert.ok(result.actorIds === null);
    assert.ok(isString(result.entityId));
    assert.ok(isString(result.instanceId));
    assert.ok(result.instanceStatus === 'Rejected');
    assert.ok(Array.isArray(result.newWorkitemIds));
  });
});

/**
 * cleanup
 */
afterAll(async () => {
  if (accountId) {
    await conn.sobject('Account').destroy(accountId);
  }
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
