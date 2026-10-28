import assert from 'assert';
import { OAuth2 } from 'jsforce';
import { isString } from './util';
import { isNodeJS } from './helper/env';
import authorize from './helper/webauth';
import config from './config';

const oauth2 = new OAuth2(config);

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
  describe.skip('web server flow', () => {
    let code: string;
    let refreshToken: string;

    //
    it('should start OAuth2 web server flow and receive authz code', async () => {
      const url = oauth2.getAuthorizationUrl({ state: 'hello' });
      const params = await authorize(url, config.username, config.password);
      assert.ok(isString(params.code));
      assert.ok(params.state === 'hello');
      code = params.code;
    });

    //
    it('should request token from code and receive access/refresh token', async () => {
      const res = await oauth2.requestToken(code);
      assert.ok(isString(res.access_token));
      assert.ok(isString(res.refresh_token));
      refreshToken = res.refresh_token;
    });

    //
    it('should refresh access token and get new access token', async () => {
      const res = await oauth2.refreshToken(refreshToken);
      assert.ok(isString(res.access_token));
    });
  });
}

// NOTE:
// This test started to fail due to IP range restrictions with the device activation changes:
// https://help.salesforce.com/s/articleView?id=005220394&type=1
//
// We could re-enable this test by creating a connected app in our hub that relax IP restrictions:
// https://help.salesforce.com/s/articleView?id=xcloud.connected_app_continuous_ip.htm&type=5
if (isNodeJS()) {
  describe.skip('username password flow', () => {
    //
    it('should start authenticate and receive access token', async () => {
      const res = await oauth2.authenticate(config.username, config.password);
      assert.ok(isString(res.access_token));
    });
  });
}

describe('endpoints', () => {
  it('sets valid oauth endpoints', () => {
    const instanceUrl =
      'https://innovation-momentum-8840-dev-ed.scratch.my.salesforce.com';

    const oauth2 = new OAuth2({
      loginUrl: instanceUrl,
      clientId: '1234test',
      redirectUri: 'http://localhost:8080/oauthredirect',
    });

    assert.equal(
      oauth2.authzServiceUrl,
      `${instanceUrl}/services/oauth2/authorize`,
    );
    assert.equal(
      oauth2.tokenServiceUrl,
      `${instanceUrl}/services/oauth2/token`,
    );
    assert.equal(
      oauth2.revokeServiceUrl,
      `${instanceUrl}/services/oauth2/revoke`,
    );
    assert.equal(
      oauth2.getAuthorizationUrl(),
      `${instanceUrl}/services/oauth2/authorize?response_type=code&client_id=${oauth2.clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauthredirect`,
    );
  });

  it('does not strip URL path', () => {
    const instanceUrl =
      'https://innovation-momentum-8840-dev-ed.scratch.my.salesforce.com/AppCentral';

    const oauth2 = new OAuth2({
      loginUrl: instanceUrl,
      clientId: '1234test',
      redirectUri: 'http://localhost:8080/oauthredirect',
    });

    assert.equal(
      oauth2.authzServiceUrl,
      `${instanceUrl}/services/oauth2/authorize`,
    );
    assert.equal(oauth2.tokenServiceUrl, `${instanceUrl}/services/oauth2/token`);
    assert.equal(
      oauth2.revokeServiceUrl,
      `${instanceUrl}/services/oauth2/revoke`,
    );
    assert.equal(
      oauth2.getAuthorizationUrl(),
      `${instanceUrl}/services/oauth2/authorize?response_type=code&client_id=${oauth2.clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauthredirect`,
    );

  })

  it('handles trailing slash in instanceUrl', () => {
    const instanceUrl =
      'https://innovation-momentum-8840-dev-ed.scratch.my.salesforce.com';

    const oauth2 = new OAuth2({
      loginUrl: instanceUrl + '/',
      clientId: '1234test',
      redirectUri: 'http://localhost:8080/oauthredirect',
    });

    assert.equal(
      oauth2.authzServiceUrl,
      `${instanceUrl}/services/oauth2/authorize`,
    );
    assert.equal(oauth2.tokenServiceUrl, `${instanceUrl}/services/oauth2/token`);
    assert.equal(
      oauth2.revokeServiceUrl,
      `${instanceUrl}/services/oauth2/revoke`,
    );
    assert.equal(
      oauth2.getAuthorizationUrl(),
      `${instanceUrl}/services/oauth2/authorize?response_type=code&client_id=${oauth2.clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauthredirect`,
    );
  });

  it('percent-encodes injection characters in loginUrl path', () => {
    const loginUrl = 'https://login.salesforce.com/";calc;"';
    const encodedBase = 'https://login.salesforce.com/%22;calc;%22';

    const oauth2 = new OAuth2({
      loginUrl,
      clientId: '1234test',
      redirectUri: 'http://localhost:8080/oauthredirect',
    });

    assert.equal(oauth2.loginUrl, loginUrl);
    assert.equal(
      oauth2.authzServiceUrl,
      `${encodedBase}/services/oauth2/authorize`,
    );
    assert.equal(
      oauth2.tokenServiceUrl,
      `${encodedBase}/services/oauth2/token`,
    );
    assert.equal(
      oauth2.revokeServiceUrl,
      `${encodedBase}/services/oauth2/revoke`,
    );
    assert.equal(
      oauth2.getAuthorizationUrl(),
      `${encodedBase}/services/oauth2/authorize?response_type=code&client_id=${oauth2.clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauthredirect`,
    );
  });

  it('does not double-encode already-encoded loginUrl paths', () => {
    const instanceUrl = 'https://login.salesforce.com/a%20b';

    const oauth2 = new OAuth2({
      loginUrl: instanceUrl,
      clientId: '1234test',
      redirectUri: 'http://localhost:8080/oauthredirect',
    });

    assert.equal(
      oauth2.authzServiceUrl,
      `${instanceUrl}/services/oauth2/authorize`,
    );
    assert.equal(oauth2.tokenServiceUrl, `${instanceUrl}/services/oauth2/token`);
    assert.equal(
      oauth2.revokeServiceUrl,
      `${instanceUrl}/services/oauth2/revoke`,
    );
  });

  it('derives loginUrl origin and revoke URL from authz/token service URLs', () => {
    const origin = 'https://login.salesforce.com';
    const oauth2 = new OAuth2({
      authzServiceUrl: `${origin}/services/oauth2/authorize`,
      tokenServiceUrl: `${origin}/services/oauth2/token`,
      clientId: '1234test',
      redirectUri: 'http://localhost:8080/oauthredirect',
    });

    assert.equal(oauth2.loginUrl, origin);
    assert.equal(
      oauth2.authzServiceUrl,
      `${origin}/services/oauth2/authorize`,
    );
    assert.equal(oauth2.tokenServiceUrl, `${origin}/services/oauth2/token`);
    assert.equal(
      oauth2.revokeServiceUrl,
      `${origin}/services/oauth2/revoke`,
    );
  });

  it('uses default loginUrl when omitted', () => {
    const oauth2 = new OAuth2({
      clientId: '1234test',
      redirectUri: 'http://localhost:8080/oauthredirect',
    });

    assert.equal(oauth2.loginUrl, 'https://login.salesforce.com');
    assert.equal(
      oauth2.authzServiceUrl,
      'https://login.salesforce.com/services/oauth2/authorize',
    );
  });

  it('throws Invalid URL for scheme-less loginUrl', () => {
    assert.throws(
      () =>
        new OAuth2({
          loginUrl: 'test.salesforce.com',
          clientId: '1234test',
          redirectUri: 'http://localhost:8080/oauthredirect',
        }),
      { name: 'TypeError', message: /Invalid URL/ },
    );
  });
});
