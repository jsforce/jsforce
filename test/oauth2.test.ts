import assert from 'assert';
import { OAuth2 } from 'jsforce';
import {jest} from '@jest/globals';
import { isString } from './util';
import { isNodeJS } from './helper/env';
import authorize from './helper/webauth';
import config from './config';

const oauth2 = new OAuth2(config);

jest.retryTimes(2)

/**
 *
 */
if (isNodeJS()) {
  describe('web server flow', () => {
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
describe('username password flow', () => {
  //
  it('should start authenticate and receive access token', async () => {
    const res = await oauth2.authenticate(config.username, config.password);
    assert.ok(isString(res.access_token));
  });
});
