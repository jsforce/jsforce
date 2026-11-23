import assert from 'assert';
import { Connection, DPoP, OAuth2, type DPoPSigner } from 'jsforce';
import { isString } from './util';
import { isNodeJS } from './helper/env';
import { canSignJwt, signJwt } from './helper/jwt';
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

// the external client app in test/package/JSforceTestSuite, which has the certificate of SF_OAUTH2_JWT_KEY
const jwtClientId = 'JSforceTestJwtAppaa024177e4a75a4934eb4b3c339caaf2a41c00d4';

const jwtGrant = async () => ({
  grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  assertion: await signJwt({
    iss: jwtClientId,
    sub: config.username,
    aud: 'https://test.salesforce.com',
    exp: Math.floor(Date.now() / 1000) + 180,
  }),
});

// with the key file that scripts/org-setup.mjs writes from SF_OAUTH2_JWT_KEY
if (canSignJwt) {
  describe('JWT bearer flow', () => {
    //
    it('should request token with a JWT assertion and receive access token', async () => {
      const jwtOAuth2 = new OAuth2({ clientId: jwtClientId, loginUrl: config.loginUrl, proxyUrl: config.proxyUrl || undefined });
      const res = await jwtOAuth2.requestToken(await jwtGrant());
      assert.ok(isString(res.access_token));
      assert.ok(isString(res.instance_url));
      assert.equal(res.token_type, 'Bearer');
    });

    //
    it('should authorize a connection and call the API with the token', async () => {
      const conn = new Connection({
        oauth2: { clientId: jwtClientId, loginUrl: config.loginUrl },
        proxyUrl: config.proxyUrl || undefined,
      });
      await conn.authorize(await jwtGrant());
      const res = await conn.query('SELECT Id FROM User LIMIT 1');
      assert.equal(res.totalSize, 1);
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

/**
 * DPoP (RFC 9449).
 * The tests of proofs use only the Web Crypto API, so that they also run in the browser.
 *
 * Viewpoints:
 * 1. Signer: proofs made with a signer from DPoP.createSigner() (a PKCS#8 PEM key or a non-extractable
 *    WebCrypto key pair), or with a custom signer returning DER, verify against the signer's public key.
 * 2. Proof: the header and claims follow RFC 9449, Section 4.2. Only the public members of the key are
 *    sent, htu has no query, ath is only with an access token, and every proof has a new jti.
 * 3. dpop_jkt: the JWK thumbprint (RFC 7638) of the key is added to the authorization URL.
 * 4. Org: with a token from the JWT bearer flow, the token is bound to the key, an invalid token is
 *    refreshed once, a saved nonce lets another connection use the token without refreshing, and logout
 *    revokes the token. Only with the key file that scripts/org-setup.mjs writes from SF_OAUTH2_JWT_KEY.
 */
describe('DPoP', () => {
  const loginUrl = 'https://login.salesforce.com';
  const url = 'https://example.my.salesforce.com/services/data/v62.0/query?q=SELECT+Id+FROM+Account';
  const P256 = { name: 'ECDSA', namedCurve: 'P-256' } as const;

  const toBase64url = (bytes: Uint8Array) =>
    btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const fromBase64url = (s: string) =>
    Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  const sha256 = async (s: string) =>
    toBase64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))));

  function decodeProof(proof: string) {
    const [h, p, s] = proof.split('.');
    const decode = (v: string) => JSON.parse(new TextDecoder().decode(fromBase64url(v)));
    return { header: decode(h), payload: decode(p), signingInput: `${h}.${p}`, signature: fromBase64url(s) };
  }

  async function verifyProof(proof: string, publicJwk: JsonWebKey) {
    const { signingInput, signature } = decodeProof(proof);
    const key = await crypto.subtle.importKey('jwk', publicJwk, P256, false, ['verify']);
    return crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, signature, new TextEncoder().encode(signingInput));
  }

  async function createPem() {
    const { privateKey } = await crypto.subtle.generateKey(P256, true, ['sign', 'verify']);
    const pkcs8 = new Uint8Array(await crypto.subtle.exportKey('pkcs8', privateKey));
    const base64 = btoa(String.fromCharCode(...pkcs8));
    return `-----BEGIN PRIVATE KEY-----\n${base64.replace(/(.{64})/g, '$1\n')}\n-----END PRIVATE KEY-----\n`;
  }

  // r and s concatenated -> ASN.1 DER, as a KMS returns
  function joseToDer(jose: Uint8Array) {
    const int = (b: Uint8Array) => {
      let i = 0;
      while (i < b.length - 1 && b[i] === 0) i++;
      const v = b.subarray(i);
      return v[0] & 0x80 ? [0x02, v.length + 1, 0, ...v] : [0x02, v.length, ...v];
    };
    const seq = [...int(jose.subarray(0, 32)), ...int(jose.subarray(32))];
    return new Uint8Array([0x30, seq.length, ...seq]);
  }

  async function createDerSigner(): Promise<DPoPSigner> {
    const { privateKey, publicKey } = await crypto.subtle.generateKey(P256, false, ['sign', 'verify']);
    const { kty, crv, x, y } = await crypto.subtle.exportKey('jwk', publicKey);
    return {
      algorithm: 'ES256',
      format: 'der',
      publicJwk: { kty, crv, x, y },
      sign: async (input) =>
        joseToDer(new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, new Uint8Array(input)))),
    };
  }

  const createSigner = async () => DPoP.createSigner(await createPem());

  describe('1. signer', () => {
    it('signs with a key from a PKCS#8 PEM P-256 private key', async () => {
      const signer = await createSigner();
      assert.equal(signer.algorithm, 'ES256');
      assert.equal(signer.format, 'jose');
      const proof = await new DPoP({ signer }).createProof({ method: 'GET', url });
      assert.ok(await verifyProof(proof, signer.publicJwk));
    });

    it('signs with a non-extractable WebCrypto key pair', async () => {
      const keyPair = await crypto.subtle.generateKey(P256, false, ['sign', 'verify']);
      const signer = await DPoP.createSigner(keyPair);
      const proof = await new DPoP({ signer }).createProof({ method: 'GET', url });
      assert.ok(await verifyProof(proof, signer.publicJwk));
    });

    it('converts a DER signature from a custom signer to 64 bytes', async () => {
      const signer = await createDerSigner();
      const proof = await new DPoP({ signer }).createProof({ method: 'GET', url });
      assert.equal(decodeProof(proof).signature.length, 64);
      assert.ok(await verifyProof(proof, signer.publicJwk));
    });
  });

  describe('2. proof', () => {
    it('has the header and claims of RFC 9449, with htu without query, ath and nonce', async () => {
      const dpop = new DPoP({ signer: await createSigner() });
      const proof = await dpop.createProof({ method: 'GET', url, accessToken: 'access-token', nonce: 'nonce' });
      const { header, payload } = decodeProof(proof);
      assert.equal(header.typ, 'dpop+jwt');
      assert.equal(header.alg, 'ES256');
      assert.deepEqual(Object.keys(header.jwk).sort(), ['crv', 'kty', 'x', 'y']);
      assert.equal(payload.htm, 'GET');
      assert.equal(payload.htu, 'https://example.my.salesforce.com/services/data/v62.0/query');
      assert.equal(payload.ath, await sha256('access-token'));
      assert.equal(payload.nonce, 'nonce');
      assert.equal(typeof payload.jti, 'string');
      assert.equal(typeof payload.iat, 'number');
    });

    it('has no ath and no nonce when they are not given', async () => {
      const dpop = new DPoP({ signer: await createSigner() });
      const { payload } = decodeProof(await dpop.createProof({ method: 'POST', url: `${loginUrl}/services/oauth2/token` }));
      assert.equal(payload.ath, undefined);
      assert.equal(payload.nonce, undefined);
    });

    it('has a new jti every time, even with the same method, URL, token and nonce', async () => {
      const dpop = new DPoP({ signer: await createSigner() });
      const params = { method: 'GET' as const, url, accessToken: 'access-token', nonce: 'nonce' };
      const first = decodeProof(await dpop.createProof(params)).payload;
      const second = decodeProof(await dpop.createProof(params)).payload;
      assert.notEqual(first.jti, second.jti);
    });
  });

  describe('3. dpop_jkt', () => {
    it('adds dpop_jkt, the JWK thumbprint of the key, to the authorization URL', async () => {
      const signer = await createSigner();
      const oauth2 = new OAuth2({ clientId: 'client-id', redirectUri: 'http://localhost/callback', loginUrl, dpop: { signer } });
      const { crv, kty, x, y } = signer.publicJwk;
      const authzUrl = new URL(oauth2.getAuthorizationUrl());
      assert.equal(authzUrl.searchParams.get('dpop_jkt'), await sha256(JSON.stringify({ crv, kty, x, y })));
    });
  });


  if (canSignJwt) {
    describe('4. org', () => {
      let signer: DPoPSigner;
      let refreshCount = 0;

      const createConnection = (options: { instanceUrl?: string; accessToken?: string; proofNonce?: string } = {}) =>
        new Connection({
          oauth2: { clientId: jwtClientId, loginUrl: config.loginUrl, dpop: { signer } },
          proxyUrl: config.proxyUrl || undefined,
          refreshFn: (conn, callback) => {
            refreshCount++;
            jwtGrant()
              .then((params) => conn.oauth2.requestToken(params))
              .then((res) => callback(null, res.access_token, res), callback);
          },
          ...options,
        });

      let conn: Connection;

      beforeAll(async () => {
        signer = await createSigner();
        conn = createConnection();
      });

      it('gets a token bound to the key, with the nonce from the token endpoint', async () => {
        await conn.authorize(await jwtGrant());
        assert.ok(conn.accessToken);
        assert.ok(conn.proofNonce);
        const bearer = new Connection({
          instanceUrl: conn.instanceUrl,
          accessToken: conn.accessToken,
          proxyUrl: config.proxyUrl || undefined,
        });
        await assert.rejects(async () => bearer.query('SELECT Id FROM User LIMIT 1'), { name: 'INVALID_SESSION_ID' });
      });

      it('refreshes an invalid token once, and sends the request again', async () => {
        const before = refreshCount;
        conn.accessToken = `${conn.accessToken!.slice(0, -4)}XXXX`;
        await conn.query('SELECT Id FROM User LIMIT 1');
        assert.equal(refreshCount, before + 1);
      });

      it('uses the token in another connection with the saved nonce, without refreshing', async () => {
        const before = refreshCount;
        const restored = createConnection({
          instanceUrl: conn.instanceUrl,
          accessToken: conn.accessToken!,
          proofNonce: conn.proofNonce!,
        });
        await restored.query('SELECT Id FROM User LIMIT 1');
        assert.equal(refreshCount, before);
      });

      it('revokes the token by logout', async () => {
        const { instanceUrl, accessToken } = conn;
        await conn.logout();
        const revoked = new Connection({
          oauth2: { clientId: jwtClientId, loginUrl: config.loginUrl, dpop: { signer } },
          proxyUrl: config.proxyUrl || undefined,
          instanceUrl,
          accessToken: accessToken!,
        });
        await assert.rejects(async () => revoked.query('SELECT Id FROM User LIMIT 1'));
      });
    });
  }
});
