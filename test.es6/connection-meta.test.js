import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isNumber, isUndefined } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
test.group('describe sobject', (test) => {
  //
  test('describe Account, get metadata information, and check the result is cached', async (t) => {
    const so = await conn.sobject('Account').describe();
    t.true(so.name === 'Account');
    t.true(Array.isArray(so.fields));
    const so2 = await conn.sobject('Account').describe$();
    t.true(so === so2);
    const so3 = conn.sobject('Account').describe$$();
    t.true(so === so3);
    const so4 = await conn.sobject('Account').describe();
    t.true(so !== so4);
    t.true(so4.name === 'Account');
    t.true(Array.isArray(so4.fields));
  });

  //
  test('describe global, get information, and check the result is cached', async (t) => {
    const res = await conn.describeGlobal();
    t.true(Array.isArray(res.sobjects));
    t.true(isObject(res.sobjects[0]));
    t.true(isString(res.sobjects[0].name));
    t.true(isString(res.sobjects[0].label));
    t.true(isUndefined(res.sobjects[0].fields));
    const res2 = await conn.describeGlobal$();
    t.true(res === res2);
    const res3 = conn.describeGlobal$$();
    t.true(res === res3);
    const res4 = await conn.describeGlobal();
    t.true(res !== res4);
    t.true(Array.isArray(res4.sobjects));
    t.true(isObject(res4.sobjects[0]));
    t.true(isString(res4.sobjects[0].name));
    t.true(isString(res4.sobjects[0].label));
    t.true(isUndefined(res4.sobjects[0].fields));
  });
});

/**
 *
 */
test.group('recent records', (test) => {
  //
  test('access account records for view', async (t) => {
    await conn.query('SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 2 FOR VIEW');
    t.pass();
  });

  //
  test('get recently accessed records in all objects and get successfull results', async (t) => {
    const records = await conn.recent(2);
    t.true(Array.isArray(records));
    records.forEach((record) => {
      t.true(isString(record.Id));
      t.true(isString(record.Name));
      t.true(record.attributes.type === 'Account');
    });
  });

  //
  test('get recently viewed accounts in Account object', async (t) => {
    const records = await conn.sobject('Account').recent();
    t.true(Array.isArray(records));
    records.forEach((record) => {
      t.true(isString(record.Id));
      t.true(isString(record.Name));
      t.true(record.attributes.type === 'Account');
    });
  });

  //
  test('create, update, delete account records', async (t) => {
    const accs = [{ Name: 'Hello' }, { Name: 'World' }];
    const rets = await conn.sobject('Account').create(accs);
    const id1 = rets[0].id;
    const id2 = rets[1].id;
    await Promise.all([
      conn.sobject('Account').record(id1).update({ Name: 'Hello2' }),
      conn.sobject('Account').record(id2).destroy(),
    ]);
    t.pass();
  });

  //
  test('get updated accounts and return updated accounts', async (t) => {
    const end = new Date();
    const start = new Date(end.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1 day before
    const result = await conn.sobject('Account').updated(start, end);
    t.true(Array.isArray(result.ids));
  });

  //
  test('get updated account (with string input) and return updated accounts', async (t) => {
    const end = new Date();
    const start = new Date(end.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1 day before
    const result = await conn.sobject('Account').updated(start.toString(), end.toString());
    t.true(Array.isArray(result.ids));
  });

  //
  test('get deleted account and return deleted account object', async (t) => {
    const end = new Date();
    const start = new Date(end.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1 day before
    const result = await conn.sobject('Account').deleted(start, end);
    t.true(Array.isArray(result.deletedRecords));
  });

  /**
   *
   */
  test('get deleted account (with string input) and return deleted account object', async (t) => {
    const end = new Date();
    const start = new Date(end.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1 day before
    const result = await conn.sobject('Account').deleted(start.toString(), end.toString());
    t.true(Array.isArray(result.deletedRecords));
  });
});


/**
 *
 */
test.group('identity', (test) => {
  //
  test('get user identity information and return user identity information', async (t) => {
    const res = await conn.identity();
    t.true(isString(res.id) && res.id.indexOf('https://') === 0);
    t.true(isString(res.user_id));
    t.true(isString(res.organization_id));
    t.true(isString(res.email));
    t.true(isObject(res.photos));
    t.true(isObject(res.urls));
  });
});

/**
 *
 */
test.group('limit info', (test) => {
  //
  test('get current limit information and check api usage and its limit in the org', (t) => {
    const limitInfo = conn.limitInfo;
    t.true(isObject(limitInfo.apiUsage));
    t.true(isNumber(limitInfo.apiUsage.used));
    t.true(isNumber(limitInfo.apiUsage.limit));
    t.true(limitInfo.apiUsage.used > 0);
    t.true(limitInfo.apiUsage.limit >= limitInfo.apiUsage.used);
  });

  //
  test('get system limits information from server limit info in the org', async (t) => {
    const limits = await conn.limits();
    t.true(isObject(limits));
    t.true(isObject(limits.DataStorageMB));
    t.true(limits.DataStorageMB.Remaining >= 0);
    t.true(limits.DataStorageMB.Max > 0);
    t.true(isObject(limits.FileStorageMB));
    t.true(limits.FileStorageMB.Remaining >= 0);
    t.true(limits.FileStorageMB.Max > 0);
    t.true(isObject(limits.DailyApiRequests));
    t.true(limits.DailyApiRequests.Remaining >= 0);
    t.true(limits.DailyApiRequests.Max > 0);
  });
});


/**
 *
 */
test.group('misc metadata', (test) => {
  //
  test('get tabs list information and return tabs info in the org', async (t) => {
    const tabs = await conn.tabs();
    t.true(Array.isArray(tabs));
    tabs.forEach((tab) => {
      t.true(isString(tab.label));
      t.true(isString(tab.name));
      t.true(isString(tab.url));
    });
  });

  //
  test('get theme information and return theme info in the org', async (t) => {
    const theme = await conn.theme();
    t.true(isObject(theme));
    t.true(Array.isArray(theme.themeItems));
    theme.themeItems.forEach((th) => {
      t.true(isString(th.name));
      t.true(Array.isArray(th.colors) || th.colors === null);
      (th.colors || []).forEach((c) => {
        t.true(isString(c.color));
        t.true(isString(c.context));
        t.true(isString(c.theme));
      });
      t.true(Array.isArray(th.icons) || th.icons === null);
      (th.icons || []).forEach((ic) => {
        t.true(isString(ic.url));
        t.true(isNumber(ic.width));
        t.true(isNumber(ic.height));
        t.true(isString(ic.contentType));
      });
    });
  });
});

/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
