import assert from 'assert';
import { Connection, type TokenResponse } from 'jsforce';

const instanceUrl = 'https://example.my.salesforce.com';
const idUrl = 'https://login.salesforce.com/id/00Dxx0000000000AAA/005xx0000000000AAA';

function createConnection() {
  return new Connection({
    oauth2: {
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'http://localhost/callback',
    },
    instanceUrl,
    accessToken: 'old-access-token',
    refreshToken: 'old-refresh-token',
  });
}

function stubRefreshResponse(conn: Connection, res: Partial<TokenResponse>) {
  const requestedTokens: string[] = [];
  conn.oauth2.refreshToken = (refreshToken: string) => {
    requestedTokens.push(refreshToken);
    return Promise.resolve({
      token_type: 'Bearer',
      id: idUrl,
      instance_url: instanceUrl,
      ...res,
    } as TokenResponse);
  };
  return requestedTokens;
}

async function refresh(conn: Connection) {
  assert.ok(conn._refreshDelegate);
  await conn._refreshDelegate.refresh(Date.now());
}

describe('session refresh with OAuth2 refresh token', () => {
  it('should keep the rotated refresh token in the connection', async () => {
    const conn = createConnection();
    const requestedTokens = stubRefreshResponse(conn, {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });
    await refresh(conn);
    assert.equal(conn.accessToken, 'new-access-token');
    assert.equal(conn.refreshToken, 'new-refresh-token');
    assert.deepEqual(requestedTokens, ['old-refresh-token']);
  });

  it('should pass the rotated refresh token to refresh event listeners', async () => {
    const conn = createConnection();
    stubRefreshResponse(conn, {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    });
    let received: TokenResponse | undefined;
    conn.on('refresh', (_accessToken: string, res: TokenResponse) => {
      received = res;
    });
    await refresh(conn);
    assert.equal(received?.refresh_token, 'new-refresh-token');
  });

  it('should keep the current refresh token when no new one is issued', async () => {
    const conn = createConnection();
    stubRefreshResponse(conn, { access_token: 'new-access-token' });
    await refresh(conn);
    assert.equal(conn.accessToken, 'new-access-token');
    assert.equal(conn.refreshToken, 'old-refresh-token');
  });
});
