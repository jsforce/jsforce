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

/**
 *
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

/**
 *
 */
describe.skip('username password flow', () => {
  //
  it('should start authenticate and receive access token', async () => {
    const res = await oauth2.authenticate(config.username, config.password);
    assert.ok(isString(res.access_token));
  });
});

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
});
