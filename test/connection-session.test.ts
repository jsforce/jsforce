import assert from 'assert';
import { Connection } from 'jsforce';
import { delay } from './util';
import config from './config';
import ConnectionManager from './helper/connection-manager';
import { isNodeJS } from './helper/env';

if (typeof jest !== 'undefined') {
  jest.retryTimes(2);
}

/*
 * SOAP login is deprecated will be retired in Summer '27:
 * https://help.salesforce.com/s/articleView?id=release-notes.rn_api_upcoming_retirement_258rn.htm&release=258&type=5
 *
 * Even thought it works today on API version <= 64.0, we can't use run these test in GHA due to Salesforce Device Activation:
 * https://help.salesforce.com/s/articleView?id=005220394&type=1
 *
 * Public GHA runners don't have static IPs so each test runs get asked for a 2FA code at at time (sent via email).
*/
if (isNodeJS()) {
  describe.skip('soap login', () => {
    let conn: Connection;

    it('should login by username and password', async () => {
      conn = new Connection({
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
      });
      const userInfo = await conn.login(config.username, config.password);
      assert.ok(typeof conn.accessToken === 'string');
      assert.ok(typeof userInfo.id === 'string');
      assert.ok(typeof userInfo.organizationId === 'string');
      assert.ok(typeof userInfo.url === 'string');
    });

    it('should execute query and return some records', async () => {
      const res = await conn.query('SELECT Id FROM User');
      assert.ok(Array.isArray(res.records));
    });

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
}

if (isNodeJS()) {
  describe.skip('soap logout', () => {
    let sessionInfo: { sessionId: string; serverUrl: string };

    it('should logout from soap session', async () => {
      const conn1 = new Connection({
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
      });
      await conn1.loginBySoap(config.username, config.password);
      sessionInfo = {
        sessionId: conn1.accessToken!,
        serverUrl: conn1.instanceUrl,
      };
      await conn1.logout();
      assert.ok(conn1.accessToken === null);
    });

    it('should connect with previous session info to raise auth error', async () => {
      const conn2 = new Connection({
        sessionId: sessionInfo.sessionId,
        serverUrl: sessionInfo.serverUrl,
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
      });
      await delay(10000);
      try {
        await conn2.query('SELECT Id FROM User');
        assert.fail();
      } catch (error) {
        const err = error as Error;
        assert.ok(err && typeof err.message === 'string');
      }
    });
  });
};

describe('urls', () => {
  let conn: Connection;

  it('should not allow a lightning URL as instance URL', () => {
    // .lightning
    try {
      conn = new Connection({
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
        instanceUrl: 'my-cool-url.lightning.force.com',
      });
      assert.fail('the above should throw for a lighting url');
    } catch (e) {
      assert.equal(
        (e as Error).message,
        'lightning URLs are not valid as instance URLs',
      );
    }
    // .mil
    try {
      conn = new Connection({
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
        instanceUrl: 'my-cool-url.lightning.crmforce.mil',
      });
      assert.fail('the above should throw for a lighting url');
    } catch (e) {
      assert.equal(
        (e as Error).message,
        'lightning URLs are not valid as instance URLs',
      );
    }
    // for china
    try {
      conn = new Connection({
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
        instanceUrl: 'my-cool-url.lightning.sfcrmapps.cn',
      });
      assert.fail('the above should throw for a lighting url');
    } catch (e) {
      assert.equal(
        (e as Error).message,
        'lightning URLs are not valid as instance URLs',
      );
    }
  })
})

// ditto about Device Activation/GHA IPs, can't run these oauth tests
//
// (config.clientId ? describe : describe.skip)('oauth2 session', () => {
if (isNodeJS()) {
  describe.skip('oauth2 session', () => {
    let sessionInfo: { accessToken: string; instanceUrl: string };

    it('should logout oauth2 session', async () => {
      const conn = new Connection({
        oauth2: {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          redirectUri: config.redirectUri,
        },
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
      });
      await conn.loginByOAuth2(config.username, config.password);
      sessionInfo = {
        accessToken: conn.accessToken!,
        instanceUrl: conn.instanceUrl,
      };
      await conn.logout();
      assert.ok(conn.accessToken === null);
    });

    it('should connect with previous session info and raise auth error', async () => {
      const conn = new Connection({
        accessToken: sessionInfo.accessToken,
        instanceUrl: sessionInfo.instanceUrl,
        logLevel: config.logLevel,
        proxyUrl: config.proxyUrl,
        loginUrl: config.loginUrl,
      });
      await delay(10000);
      try {
        await conn.query('SELECT Id FROM User');
        assert.fail();
      } catch (error) {
        const err = error as Error;
        assert.ok(err && typeof err.message === 'string');
      }
    });
  });
}

if (isNodeJS()) {
  (config.accessToken ? describe : describe.skip)('scratch org session', () => {
    it('should establish a connection from the CLI access token', async () => {
      const connMgr = new ConnectionManager(config);
      const conn = connMgr.createConnection();
      connMgr.establishConnection(conn);

      assert.ok(typeof conn.accessToken === 'string');
      assert.equal(conn.instanceUrl, config.loginUrl);

      const res = await conn.query('SELECT Id FROM User');
      assert.ok(Array.isArray(res.records));
    });
  });
}
