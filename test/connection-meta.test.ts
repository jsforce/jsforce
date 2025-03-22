import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isNumber, isUndefined } from './util';
import type { Record } from 'jsforce';

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
describe('describe sobject', () => {
  //
  it('should describe Account, get metadata information, and check the result is cached', async () => {
    const so = await conn.sobject('Account').describe();
    assert.ok(so.name === 'Account');
    assert.ok(Array.isArray(so.fields));
    const so2 = await conn.sobject('Account').describe$();
    assert.ok(so === so2);
    const so3 = conn.sobject('Account').describe$$();
    assert.ok(so === so3);
    const so4 = await conn.sobject('Account').describe();
    assert.ok(so !== so4);
    assert.ok(so4.name === 'Account');
    assert.ok(Array.isArray(so4.fields));
  });

  //
  it('should describe global, get information, and check the result is cached', async () => {
    const res = await conn.describeGlobal();
    assert.ok(Array.isArray(res.sobjects));
    assert.ok(isObject(res.sobjects[0]));
    assert.ok(isString(res.sobjects[0].name));
    assert.ok(isString(res.sobjects[0].label));
    assert.ok(isUndefined((res.sobjects[0] as any).fields));
    const res2 = await conn.describeGlobal$();
    assert.ok(res === res2);
    const res3 = conn.describeGlobal$$();
    assert.ok(res === res3);
    const res4 = await conn.describeGlobal();
    assert.ok(res !== res4);
    assert.ok(Array.isArray(res4.sobjects));
    assert.ok(isObject(res4.sobjects[0]));
    assert.ok(isString(res4.sobjects[0].name));
    assert.ok(isString(res4.sobjects[0].label));
    assert.ok(isUndefined((res4.sobjects[0] as any).fields));
  });
});

/**
 *
 */
describe('recent records', () => {
  //
  it('should access account records for view', async () => {
    await conn.query(
      'SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 2 FOR VIEW',
    );
  });

  //
  it('should get recently accessed records in all objects and get successfull results', async () => {
    const records = await conn.recent(2);
    assert.ok(Array.isArray(records));
    records.forEach((record: any) => {
      // TODO: remove any
      assert.ok(isString(record.Id));
      assert.ok(isString(record.Name));
      assert.ok(record.attributes.type === 'Account');
    });
  });

  //
  it('should get recently viewed accounts in Account object', async () => {
    const records = await conn.sobject('Account').recent();
    assert.ok(Array.isArray(records));
    records.forEach((record: any) => {
      // TODO: remove any
      assert.ok(isString(record.Id));
      assert.ok(isString(record.Name));
      assert.ok(record.attributes.type === 'Account');
    });
  });

  //
  it('should create, update, delete account records', async () => {
    const accs: Record[] = [{ Name: 'Hello' }, { Name: 'World' }];
    const rets = await conn.sobject('Account').create(accs);
    const id1 = rets[0].success ? rets[0].id : null;
    const id2 = rets[1].id ? rets[1].id : null;
    await Promise.all([
      conn
        .sobject('Account')
        .record(id1 as string)
        .update({ Name: 'Hello2' }),
      conn
        .sobject('Account')
        .record(id2 as string)
        .destroy(),
    ]);
    assert.ok(true);
  });

  //
  it('should get updated accounts and return updated accounts', async () => {
    const end = new Date();
    const start = new Date(end.getTime() - 1 * 60 * 1000); // 1 minute before
    const result = await conn.sobject('Account').updated(start, end);
    assert.ok(Array.isArray(result.ids));
  });

  //
  it('should get updated account (with string input) and return updated accounts', async () => {
    const end = new Date();
    const start = new Date(end.getTime() - 1 * 60 * 1000); // 1 minute before
    const result = await conn
      .sobject('Account')
      .updated(start.toString(), end.toString());
    assert.ok(Array.isArray(result.ids));
  });

  //
  it('should get deleted account and return deleted account object', async () => {
    const end = new Date();
    const start = new Date(end.getTime() - 1 * 60 * 1000); // 1 minute before
    const result = await conn.sobject('Account').deleted(start, end);
    assert.ok(Array.isArray(result.deletedRecords));
  });

  /**
   *
   */
  it('should get deleted account (with string input) and return deleted account object', async () => {
    const end = new Date();
    const start = new Date(end.getTime() - 1 * 60 * 1000); // 1 minute before
    const result = await conn
      .sobject('Account')
      .deleted(start.toString(), end.toString());
    assert.ok(Array.isArray(result.deletedRecords));
  });
});

/**
 *
 */
describe('identity', () => {
  //
  it('should get user identity information and return user identity information', async () => {
    const res = await conn.identity();
    assert.ok(isString(res.id) && res.id.startsWith('https://'));
    assert.ok(isString(res.user_id));
    assert.ok(isString(res.organization_id));
    assert.ok(isString(res.email));
    assert.ok(isObject(res.photos));
    assert.ok(isObject(res.urls));
  });
});

/**
 *
 */
describe('limit info', () => {
  //
  it('should get current limit information and check api usage and its limit in the org', () => {
    const limitInfo = conn.limitInfo;
    assert.ok(isObject(limitInfo.apiUsage));
    // TODO: delete if check when assertions in control flow analysis is introduced to TS
    if (limitInfo.apiUsage) {
      assert.ok(isNumber(limitInfo.apiUsage.used));
      assert.ok(isNumber(limitInfo.apiUsage.limit));
      assert.ok(limitInfo.apiUsage.used > 0);
      assert.ok(limitInfo.apiUsage.limit >= limitInfo.apiUsage.used);
    }
  });

  //
  it('should get system limits information from server limit info in the org', async () => {
    const limits = await conn.limits();
    assert.ok(isObject(limits));
    assert.ok(isObject(limits.DataStorageMB));
    assert.ok(limits.DataStorageMB.Remaining >= 0);
    assert.ok(limits.DataStorageMB.Max > 0);
    assert.ok(isObject(limits.FileStorageMB));
    assert.ok(limits.FileStorageMB.Remaining >= 0);
    assert.ok(limits.FileStorageMB.Max > 0);
    assert.ok(isObject(limits.DailyApiRequests));
    assert.ok(limits.DailyApiRequests.Remaining >= 0);
    assert.ok(limits.DailyApiRequests.Max > 0);
  });
});

/**
 *
 */
describe('misc metadata', () => {
  //
  it('should get tabs list information and return tabs info in the org', async () => {
    const tabs = await conn.tabs();
    assert.ok(Array.isArray(tabs));
    tabs.forEach((tab: any) => {
      // TODO: remove any
      assert.ok(isString(tab.label));
      assert.ok(isString(tab.name));
      assert.ok(isString(tab.url));
    });
  });

  //
  it('should get theme information and return theme info in the org', async () => {
    const theme = await conn.theme();
    assert.ok(isObject(theme));
    assert.ok(Array.isArray(theme.themeItems));
    theme.themeItems.forEach((th: any) => {
      // TODO: remove any
      assert.ok(isString(th.name));
      assert.ok(Array.isArray(th.colors) || th.colors === null);
      (th.colors || []).forEach((c: any) => {
        // TODO: remove any
        assert.ok(isString(c.color));
        assert.ok(isString(c.context));
        assert.ok(isString(c.theme));
      });
      assert.ok(Array.isArray(th.icons) || th.icons === null);
      (th.icons || []).forEach((ic: any) => {
        // TODO: remove any
        assert.ok(isString(ic.url));
        assert.ok(isNumber(ic.width));
        assert.ok(isNumber(ic.height));
        assert.ok(isString(ic.contentType));
      });
    });
  });
});
