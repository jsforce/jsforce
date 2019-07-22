import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString } from './util';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection();

/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});

let accountId: string;

/**
 * Test data setup
 */
test.before(async () => {
  const ret = await conn
    .sobject('Account')
    .create({ Name: 'JSforce ProcessRule/ApprovalProcess Test' });
  accountId = ret.id;
});

/**
 *
 */
test.group('process rule', (test) => {
  /**
   *
   */
  test('retrieve all process rules and list process rules', async (t) => {
    const ruleSet = await conn.process.rule.list();
    for (const rules of Object.values(ruleSet)) {
      for (const rule of rules as any) {
        t.true(isString(rule.id));
        t.true(isString(rule.name));
        t.true(isString(rule.object));
      }
    }
  });

  /**
   *
   */
  test('trigger process rule and trigger process rules', async (t) => {
    const result = await conn.process.rule.trigger(accountId);
    t.true(result.success);
    t.true(result.errors === null);
  });
});

/**
 *
 */
test.group('approval process', (test) => {
  /**
   *
   */
  test('retrieve all approval process definitions and list approval process definitions', async (t) => {
    const defsSet = await conn.process.rule.list();
    for (const approvals of Object.values(defsSet)) {
      for (const approval of approvals as any) {
        t.true(isObject(approval));
        t.true(isString(approval.id));
        t.true(isString(approval.name));
        t.true(isString(approval.object));
        t.true(Array.isArray(approval.actions));
      }
    }
  });

  let workitemId: string;
  /**
   *
   */
  test('submit approval process and confirm approval request submitted', async (t) => {
    const result = await conn.process.approval.submit(
      accountId,
      'This is test approval request submission.',
    );
    t.true(result.success);
    t.true(result.errors === null);
    t.true(Array.isArray(result.actorIds));
    t.true(isString(result.entityId));
    t.true(isString(result.instanceId));
    t.true(result.instanceStatus === 'Pending');
    t.true(Array.isArray(result.newWorkitemIds));
    workitemId = result.newWorkitemIds[0];
  });

  /**
   *
   */
  test('approve requested approval request', async (t) => {
    const result = await conn.process.approval.approve(workitemId, 'Approved.');
    t.true(result.success);
    t.true(result.errors === null);
    t.true(Array.isArray(result.actorIds));
    t.true(isString(result.entityId));
    t.true(isString(result.instanceId));
    t.true(result.instanceStatus === 'Pending');
    t.true(Array.isArray(result.newWorkitemIds));
    workitemId = result.newWorkitemIds[0]; // eslint-disable-line require-atomic-updates
  });

  /**
   *
   */
  test('reject approval request', async (t) => {
    const result = await conn.process.approval.reject(workitemId, 'Rejected.');
    t.true(result.success);
    t.true(result.errors === null);
    t.true(result.actorIds === null);
    t.true(isString(result.entityId));
    t.true(isString(result.instanceId));
    t.true(result.instanceStatus === 'Rejected');
    t.true(Array.isArray(result.newWorkitemIds));
  });
});

/**
 * cleanup
 */
test.after(async () => {
  if (accountId) {
    await conn.sobject('Account').destroy(accountId);
  }
});

/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
