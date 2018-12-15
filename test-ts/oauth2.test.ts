import test from './util/ava/ext';
import { isString } from './util';
import { isNodeJS } from './helper/env';
import authorize from './helper/webauth';
import config from './config';
import { OAuth2 } from '..';


const oauth2 = new OAuth2(config);

/**
 *
 */
if (isNodeJS()) {
  test.group('web server flow', (test) => {
    let code: string
    let refreshToken: string;

    //
    test('start OAuth2 web server flow and receive authz code', async (t) => {
      const url = oauth2.getAuthorizationUrl({ state: 'hello' });
      const params = await authorize(url, config.username, config.password);
      t.true(isString(params.code));
      t.true(params.state === 'hello');
      code = params.code;
    });

    //
    test('request token from code and receive access/refresh token', async (t) => {
      const res = await oauth2.requestToken(code);
      t.true(isString(res.access_token));
      t.true(isString(res.refresh_token));
      refreshToken = res.refresh_token;
    });

    //
    test('refresh access token and get new access token', async (t) => {
      const res = await oauth2.refreshToken(refreshToken);
      t.true(isString(res.access_token));
    });
  });
}

/**
 *
 */
test.group('username password flow', (test) => {
  //
  test('start authenticate and receive access token', async (t) => {
    const res = await oauth2.authenticate(config.username, config.password);
    t.true(isString(res.access_token));
  });
});
