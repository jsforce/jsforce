import test from './util/ava/ext';
import { delay } from './util';
import authorize from './helper/webauth';
import config from './config';
import { Connection } from '..';


/**
 *
 */
test.group('login', (test) => {
  let conn: any; // TODO: remove any

  //
  test('login by username and password', async (t) => {
    conn = new Connection({ logLevel: config.logLevel, proxyUrl: config.proxyUrl });
    const userInfo = await conn.login(config.username, config.password);
    t.true(typeof conn.accessToken === 'string');
    t.true(typeof userInfo.id === 'string');
    t.true(typeof userInfo.organizationId === 'string');
    t.true(typeof userInfo.url === 'string');
  });

  //
  test('execute query and return some records', async (t) => {
    const res = await conn.query('SELECT Id FROM User');
    t.true(Array.isArray(res.records));
  });

  //
  test('catch/handle bad access token', async (t) => {
    let newAccessToken;
    let refreshCount = 0;
    conn.accessToken = 'invalid access token';
    conn.removeAllListeners('refresh');
    conn.on('refresh', (at: any) => {
      newAccessToken = at;
      refreshCount += 1;
    });
    const res = await conn.query('SELECT Id FROM User LIMIT 5');
    t.true(refreshCount === 1);
    t.true(typeof newAccessToken === 'string');
    t.true(Array.isArray(res.records));
  });
});

/**
 *
 */
test.group('logout', (test) => {
  let sessionInfo: any; // TODO: remove any

  //
  test('logout from soap session', async (t) => {
    const conn1 = new Connection({ logLevel: config.logLevel, proxyUrl: config.proxyUrl });
    await conn1.loginBySoap(config.username, config.password);
    sessionInfo = {
      sessionId: conn1.accessToken,
      serverUrl: conn1.instanceUrl,
    };
    await conn1.logout();
    t.true(conn1.accessToken === null);
  });

  //
  test('connect with previous session info to raise auth error', async (t) => {
    const conn2 = new Connection({
      sessionId: sessionInfo.sessionId,
      serverUrl: sessionInfo.serverUrl,
      logLevel: config.logLevel,
      proxyUrl: config.proxyUrl,
    });
    await delay(10000);
    try {
      await conn2.query('SELECT Id FROM User');
      t.fail();
    } catch (err) {
      t.true(err && typeof err.message === 'string');
    }
  });
});

/**
 *
 */
test.group('oauth2 session', (test) => {
  let sessionInfo: any; // TODO: remove any

  //
  test('logout oauth2 session', async (t) => {
    const conn = new Connection({
      oauth2: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
      },
      logLevel: config.logLevel,
    });
    await conn.loginByOAuth2(config.username, config.password);
    sessionInfo = {
      accessToken: conn.accessToken,
      instanceUrl: conn.instanceUrl,
    };
    await conn.logout();
    t.true(conn.accessToken === null);
  });

  //
  test('connect with previous session info and raise auth error', async (t) => {
    const conn = new Connection({
      accessToken: sessionInfo.accessToken,
      instanceUrl: sessionInfo.instanceUrl,
      logLevel: config.logLevel,
    });
    await delay(10000);
    try {
      await conn.query('SELECT Id FROM User');
      t.fail();
    } catch (err) {
      t.true(err && typeof err.message === 'string');
    }
  });
});

/**
 *
 */
test.group('oauth2 refresh', (test) => {
  let conn: any; // TODO: remove any

  //
  test('authorize web server flow to get access tokens', async (t) => {
    conn = new Connection({
      oauth2: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
      },
      logLevel: config.logLevel,
    });
    const authzUrl = conn.oauth2.getAuthorizationUrl();
    const params = await authorize(authzUrl, config.username, config.password);
    const userInfo = await conn.authorize(params.code);
    t.true(typeof userInfo.id === 'string');
    t.true(typeof userInfo.organizationId === 'string');
    t.true(typeof userInfo.url === 'string');
    t.true(typeof conn.accessToken === 'string');
    t.true(typeof conn.refreshToken === 'string');
    const res = await conn.query('SELECT Id FROM User');
    t.true(Array.isArray(res.records));
  });

  //
  test('make access token invalid and return responses', async (t) => {
    let accessToken;
    let refreshCount = 0;
    conn.accessToken = 'invalid access token';
    conn.removeAllListeners('refresh');
    conn.on('refresh', (at: any) => { // TODO: remove any
      accessToken = at;
      refreshCount += 1;
    });
    const res = await conn.query('SELECT Id FROM User');
    t.true(refreshCount === 1);
    t.true(typeof accessToken === 'string');
    t.true(Array.isArray(res.records));
  });

  //
  test('make access token invalid and call in parallel and return responses', async (t) => {
    let accessToken;
    let refreshCount = 0;
    conn.accessToken = 'invalid access token';
    conn.removeAllListeners('refresh');
    conn.on('refresh', (at: any) => { // TODO: remove any
      accessToken = at;
      refreshCount += 1;
    });
    const results = await Promise.all([
      conn.query('SELECT Id FROM User'),
      conn.describeGlobal(),
      conn.sobject('User').describe(),
    ]);
    t.true(refreshCount === 1);
    t.true(typeof accessToken === 'string');
    t.true(Array.isArray(results));
    t.true(Array.isArray(results[0].records));
    t.true(Array.isArray(results[1].sobjects));
    t.true(Array.isArray(results[2].fields));
  });

  //
  test('expire both access token and refresh token and return error', async (t) => {
    conn.accessToken = 'invalid access token';
    conn.refreshToken = 'invalid refresh token';
    try {
      await conn.query('SELECT Id FROM User');
      t.fail();
    } catch (err) {
      t.true(err instanceof Error);
      t.true(err.name === 'invalid_grant');
    }
  });
});
