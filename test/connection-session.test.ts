import assert from 'assert';
import { Connection } from 'jsforce';
import { delay } from './util';
import authorize from './helper/webauth';
import config from './config';
import { isNodeJS } from './helper/env';

/**
 *
 */
describe('login', () => {
  let conn: Connection;

  //
  it('should login by username and password', async () => {
    conn = new Connection({
      logLevel: config.logLevel,
      proxyUrl: config.proxyUrl,
    });
    const userInfo = await conn.login(config.username, config.password);
    assert.ok(typeof conn.accessToken === 'string');
    assert.ok(typeof userInfo.id === 'string');
    assert.ok(typeof userInfo.organizationId === 'string');
    assert.ok(typeof userInfo.url === 'string');
  });

  //
  it('should execute query and return some records', async () => {
    const res = await conn.query('SELECT Id FROM User');
    assert.ok(Array.isArray(res.records));
  });

  //
  it('should catch/handle bad access token', async () => {
    let newAccessToken;
    let refreshCount = 0;
    conn.accessToken = 'invalid access token';
    conn.removeAllListeners('refresh');
    conn.on('refresh', (at: any) => {
      newAccessToken = at;
      refreshCount += 1;
    });
    const res = await conn.query('SELECT Id FROM User LIMIT 5');
    assert.ok(refreshCount === 1);
    assert.ok(typeof newAccessToken === 'string');
    assert.ok(Array.isArray(res.records));
  });
});

/**
 *
 */
describe('logout', () => {
  let sessionInfo: { sessionId: string; serverUrl: string };

  //
  it('should logout from soap session', async () => {
    const conn1 = new Connection({
      logLevel: config.logLevel,
      proxyUrl: config.proxyUrl,
    });
    await conn1.loginBySoap(config.username, config.password);
    sessionInfo = {
      sessionId: conn1.accessToken!,
      serverUrl: conn1.instanceUrl,
    };
    await conn1.logout();
    assert.ok(conn1.accessToken === null);
  });

  //
  it('should connect with previous session info to raise auth error', async () => {
    const conn2 = new Connection({
      sessionId: sessionInfo.sessionId,
      serverUrl: sessionInfo.serverUrl,
      logLevel: config.logLevel,
      proxyUrl: config.proxyUrl,
    });
    await delay(10000);
    try {
      await conn2.query('SELECT Id FROM User');
      assert.fail();
    } catch (err) {
      assert.ok(err && typeof err.message === 'string');
    }
  });
});

/**
 *
 */
describe('oauth2 session', () => {
  let sessionInfo: { accessToken: string; instanceUrl: string };

  //
  it('should logout oauth2 session', async () => {
    const conn = new Connection({
      oauth2: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
      },
      logLevel: config.logLevel,
      proxyUrl: config.proxyUrl,
    });
    await conn.loginByOAuth2(config.username, config.password);
    sessionInfo = {
      accessToken: conn.accessToken!,
      instanceUrl: conn.instanceUrl,
    };
    await conn.logout();
    assert.ok(conn.accessToken === null);
  });

  //
  it('should connect with previous session info and raise auth error', async () => {
    const conn = new Connection({
      accessToken: sessionInfo.accessToken,
      instanceUrl: sessionInfo.instanceUrl,
      logLevel: config.logLevel,
      proxyUrl: config.proxyUrl,
    });
    await delay(10000);
    try {
      await conn.query('SELECT Id FROM User');
      assert.fail();
    } catch (err) {
      assert.ok(err && typeof err.message === 'string');
    }
  });
});

if (isNodeJS()) {
  /**
   *
   */
  describe('oauth2 refresh', () => {
    let conn: Connection;

    //
    it('should authorize web server flow to get access tokens', async () => {
      conn = new Connection({
        oauth2: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          redirectUri: config.redirectUri,
        },
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
      });
      const authzUrl = conn.oauth2.getAuthorizationUrl();
      const params = await authorize(
        authzUrl,
        config.username,
        config.password,
      );
      const userInfo = await conn.authorize(params.code);
      assert.ok(typeof userInfo.id === 'string');
      assert.ok(typeof userInfo.organizationId === 'string');
      assert.ok(typeof userInfo.url === 'string');
      assert.ok(typeof conn.accessToken === 'string');
      assert.ok(typeof conn.refreshToken === 'string');
      const res = await conn.query('SELECT Id FROM User');
      assert.ok(Array.isArray(res.records));
    });

    //
    it('should make access token invalid and return responses', async () => {
      let accessToken: string | undefined = undefined;
      let refreshCount = 0;
      conn.accessToken = 'invalid access token';
      conn.removeAllListeners('refresh');
      conn.on('refresh', (at: string) => {
        accessToken = at;
        refreshCount += 1;
      });
      const res = await conn.query('SELECT Id FROM User');
      assert.ok(refreshCount === 1);
      assert.ok(typeof accessToken === 'string');
      assert.ok(Array.isArray(res.records));
    });

    //
    it('should make access token invalid and call in parallel and return responses', async () => {
      let accessToken: string | undefined = undefined;
      let refreshCount = 0;
      conn.accessToken = 'invalid access token';
      conn.removeAllListeners('refresh');
      conn.on('refresh', (at: string) => {
        accessToken = at;
        refreshCount += 1;
      });
      const results = await Promise.all([
        Promise.resolve(conn.query('SELECT Id FROM User')),
        conn.describeGlobal(),
        conn.sobject('User').describe(),
      ]);
      assert.ok(refreshCount === 1);
      assert.ok(typeof accessToken === 'string');
      assert.ok(Array.isArray(results));
      assert.ok(Array.isArray(results[0].records));
      assert.ok(Array.isArray(results[1].sobjects));
      assert.ok(Array.isArray(results[2].fields));
    });

    //
    it('should expire both access token and refresh token and return error', async () => {
      conn.accessToken = 'invalid access token';
      conn.refreshToken = 'invalid refresh token';
      try {
        await conn.query('SELECT Id FROM User');
        assert.fail();
      } catch (err) {
        assert.ok(err instanceof Error);
        assert.ok(err.name === 'invalid_grant');
      }
    });
  });
}
