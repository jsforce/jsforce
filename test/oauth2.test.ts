import assert from 'assert';
import { PassThrough } from 'stream';
import {
  Connection,
  DPoP,
  OAuth2,
  type DPoPSigner,
  type HttpRequest,
  type HttpRequestOptions,
  type HttpResponse,
} from 'jsforce';
import { performRedirectRequest } from '../lib/request-helper';
import { StreamPromise } from '../lib/util/promise';
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

/**
 * DPoP (RFC 9449): what jsforce sends, checked against a mock transport without an org.
 * Whether Salesforce accepts it is not checked here.
 * The tests use only the Web Crypto API, so that they also run in the browser.
 *
 * Viewpoints:
 * 1. Signer: proofs made with a signer from DPoP.createSigner() (a PKCS#8 PEM key or a non-extractable
 *    WebCrypto key pair), or with a custom signer returning DER, verify against the signer's public key.
 * 2. Proof: the header and claims follow RFC 9449, Section 4.2, on token, revoke and API requests.
 *    Only the public members of the key are sent, htu has no query, ath is only on API requests,
 *    and every request has a new jti.
 * 3. dpop_jkt: the JWK thumbprint (RFC 7638) of the key is added to the authorization URL.
 * 4. SOAP APIs (SOAP, Metadata): the proof is put in DpopProofHeader, in the same namespace as
 *    SessionHeader, instead of the DPoP HTTP header, with the access token the proof is made for in
 *    SessionHeader.
 */
describe('DPoP', () => {
  const loginUrl = 'https://login.salesforce.com';
  const instanceUrl = 'https://example.my.salesforce.com';
  const idUrl = `${loginUrl}/id/00Dxx0000000000AAA/005xx0000000000AAA`;
  const tokenUrl = `${loginUrl}/services/oauth2/token`;
  const P256 = { name: 'ECDSA', namedCurve: 'P-256' } as const;

  type Sent = { req: HttpRequest; options: HttpRequestOptions };
  type MockResponse = Partial<HttpResponse>;

  class MockTransport {
    sent: Sent[] = [];
    constructor(private responses: MockResponse[]) {}
    httpRequest(req: HttpRequest, options: HttpRequestOptions = {}) {
      this.sent.push({ req: { ...req, headers: { ...req.headers } }, options });
      const res = this.responses.shift();
      if (!res) {
        throw new Error(`unexpected request: ${req.method} ${req.url}`);
      }
      return StreamPromise.create<HttpResponse>(() => ({
        stream: new PassThrough(),
        promise: Promise.resolve({
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          body: '',
          ...res,
        } as HttpResponse),
      }));
    }
  }

  const toBase64url = (bytes: Uint8Array) =>
    btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const fromBase64url = (s: string) =>
    Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  const sha256 = async (s: string) =>
    toBase64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))));

  const tokenResponse: MockResponse = {
    body: JSON.stringify({
      token_type: 'DPoP',
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      instance_url: instanceUrl,
      id: idUrl,
    }),
  };

  function decodeProof(proof: string) {
    const [h, p, s] = proof.split('.');
    const decode = (v: string) => JSON.parse(new TextDecoder().decode(fromBase64url(v)));
    return { header: decode(h), payload: decode(p), signingInput: `${h}.${p}`, signature: fromBase64url(s) };
  }

  const proofOf = (sent: Sent) => decodeProof(sent.req.headers!.DPoP);

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

  function createOAuth2(signer: DPoPSigner, responses: MockResponse[]) {
    const oauth2 = new OAuth2({ clientId: 'client-id', redirectUri: 'http://localhost/callback', loginUrl, dpop: { signer } });
    const transport = new MockTransport(responses);
    oauth2._transport = transport as unknown as OAuth2['_transport'];
    return { oauth2, transport };
  }

  async function createConnection(apiResponses: MockResponse[]) {
    const signer = await createSigner();
    const conn = new Connection({
      oauth2: { clientId: 'client-id', redirectUri: 'http://localhost/callback', loginUrl, dpop: { signer } },
      instanceUrl,
      accessToken: 'access-token',
    });
    const api = new MockTransport(apiResponses);
    conn._transport = api as unknown as Connection['_transport'];
    return { conn, signer, api };
  }

  describe('1. signer', () => {
    it('signs with a key from a PKCS#8 PEM P-256 private key', async () => {
      const signer = await createSigner();
      assert.equal(signer.algorithm, 'ES256');
      assert.equal(signer.format, 'jose');
      const { oauth2, transport } = createOAuth2(signer, [tokenResponse]);
      await oauth2.requestToken('code');
      assert.ok(await verifyProof(transport.sent[0].req.headers!.DPoP, signer.publicJwk));
    });

    it('signs with a non-extractable WebCrypto key pair', async () => {
      const keyPair = await crypto.subtle.generateKey(P256, false, ['sign', 'verify']);
      const signer = await DPoP.createSigner(keyPair);
      const { oauth2, transport } = createOAuth2(signer, [tokenResponse]);
      await oauth2.requestToken('code');
      assert.ok(await verifyProof(transport.sent[0].req.headers!.DPoP, signer.publicJwk));
    });

    it('converts a DER signature from a custom signer to 64 bytes', async () => {
      const signer = await createDerSigner();
      const { oauth2, transport } = createOAuth2(signer, [tokenResponse]);
      await oauth2.requestToken('code');
      const proof = transport.sent[0].req.headers!.DPoP;
      assert.equal(decodeProof(proof).signature.length, 64);
      assert.ok(await verifyProof(proof, signer.publicJwk));
    });
  });

  describe('2. proof', () => {
    it('has the header and claims of token and revoke requests, without ath', async () => {
      const { oauth2, transport } = createOAuth2(await createSigner(), [tokenResponse, { statusCode: 200 }]);
      await oauth2.requestToken('code');
      await oauth2.revokeToken('refresh-token');
      const { header, payload } = proofOf(transport.sent[0]);
      assert.equal(header.typ, 'dpop+jwt');
      assert.equal(header.alg, 'ES256');
      assert.deepEqual(Object.keys(header.jwk).sort(), ['crv', 'kty', 'x', 'y']);
      assert.equal(payload.htm, 'POST');
      assert.equal(payload.htu, tokenUrl);
      assert.equal(typeof payload.jti, 'string');
      assert.equal(typeof payload.iat, 'number');
      assert.equal(payload.ath, undefined);
      const revoke = proofOf(transport.sent[1]).payload;
      assert.equal(revoke.htm, 'POST');
      assert.equal(revoke.htu, `${loginUrl}/services/oauth2/revoke`);
      assert.equal(revoke.ath, undefined);
    });

    it('has htu without query and ath of the access token in API requests', async () => {
      const { conn, api } = await createConnection([{ body: '{}' }]);
      await conn.request('/query?q=SELECT+Id+FROM+Account');
      assert.equal(api.sent[0].req.headers!.Authorization, 'DPoP access-token');
      const { payload } = proofOf(api.sent[0]);
      assert.equal(payload.htm, 'GET');
      assert.equal(payload.htu, `${instanceUrl}/services/data/v${conn.version}/query`);
      assert.equal(payload.ath, await sha256('access-token'));
    });

    it('has a new jti for every request, even with the same method, URL, token and nonce', async () => {
      const { conn, api } = await createConnection([{ body: '{}' }, { body: '{}' }]);
      await conn.request('/limits');
      await conn.request('/limits');
      assert.notEqual(proofOf(api.sent[0]).payload.jti, proofOf(api.sent[1]).payload.jti);
    });
  });

  describe('3. dpop_jkt', () => {
    it('adds dpop_jkt, the JWK thumbprint of the key, to the authorization URL', async () => {
      const signer = await createSigner();
      const { oauth2 } = createOAuth2(signer, []);
      const { crv, kty, x, y } = signer.publicJwk;
      const url = new URL(oauth2.getAuthorizationUrl());
      assert.equal(url.searchParams.get('dpop_jkt'), await sha256(JSON.stringify({ crv, kty, x, y })));
    });
  });

  describe('4. SOAP APIs', () => {
    const soapResponse = (body: string): MockResponse => ({
      headers: { 'content-type': 'text/xml' },
      body:
        '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        `<soapenv:Body>${body}</soapenv:Body></soapenv:Envelope>`,
    });
    const soapBodyOf = (sent: Sent) => {
      assert.equal(typeof sent.req.body, 'string');
      return sent.req.body as string;
    };
    const soapHeaderOf = (sent: Sent) => {
      const m = /<soapenv:Header xmlns="([^"]+)">(.*)<\/soapenv:Header>/.exec(soapBodyOf(sent));
      assert.ok(m, 'SOAP header is missing');
      return { xmlns: m[1], content: m[2] };
    };
    const soapProofOf = (sent: Sent) => {
      const m = /<DpopProofHeader><proof>([^<]+)<\/proof><\/DpopProofHeader>/.exec(soapHeaderOf(sent).content);
      assert.ok(m, 'DpopProofHeader is missing');
      return m[1];
    };

    it('puts a proof in DpopProofHeader next to SessionHeader, instead of the DPoP HTTP header', async () => {
      const { conn, signer, api } = await createConnection([
        soapResponse(
          '<getServerTimestampResponse><result><timestamp>2026-11-22T00:00:00.000Z</timestamp></result></getServerTimestampResponse>',
        ),
      ]);
      await conn.soap.getServerTimestamp();
      const [sent] = api.sent;
      const { xmlns, content } = soapHeaderOf(sent);
      assert.equal(xmlns, 'urn:partner.soap.sforce.com');
      assert.ok(content.includes('<SessionHeader><sessionId>access-token</sessionId></SessionHeader>'));
      assert.equal(sent.req.headers!.DPoP, undefined);
      const proof = soapProofOf(sent);
      assert.ok(await verifyProof(proof, signer.publicJwk));
      const { payload } = decodeProof(proof);
      assert.equal(payload.htm, 'POST');
      assert.equal(payload.htu, sent.req.url);
      assert.equal(payload.ath, await sha256('access-token'));
      const contentLength = sent.req.headers!['content-length'];
      if (contentLength !== undefined) {
        assert.equal(contentLength, String(new TextEncoder().encode(soapBodyOf(sent)).length));
      }
    });

    it('puts the proof in the Metadata API namespace for Metadata API requests', async () => {
      const { conn, api } = await createConnection([
        soapResponse('<describeMetadataResponse><result><organizationNamespace></organizationNamespace></result></describeMetadataResponse>'),
      ]);
      await conn.metadata.describe();
      assert.equal(soapHeaderOf(api.sent[0]).xmlns, 'http://soap.sforce.com/2006/04/metadata');
      assert.ok(soapProofOf(api.sent[0]));
    });
  });
});

/**
 * Redirects followed by the transport: a followRedirect function may return a promise, and through the AJAX proxy
 * the options are passed on, and a redirect the proxy reports in headers is turned back into the redirect response.
 */
describe('redirects followed by the transport', () => {
  const loginUrl = 'https://login.salesforce.com';
  const instanceUrl = 'https://example.my.salesforce.com';
  type RedirectHandler = (redirectUrl: string) => Promise<HttpRequest | null>;

  it('waits for a followRedirect function that returns a promise', async () => {
    const next: HttpRequest[] = [];
    await performRedirectRequest(
      { method: 'POST', url: `${loginUrl}/services/oauth2/revoke` },
      { statusCode: 302, headers: { location: `${instanceUrl}/services/oauth2/revoke` } },
      (redirectUrl) => Promise.resolve({ method: 'GET', url: redirectUrl }),
      0,
      (req) => {
        next.push(req);
      },
    );
    assert.deepEqual(next, [{ method: 'GET', url: `${instanceUrl}/services/oauth2/revoke` }]);
  });

  // replace the transport that XdProxyTransport hands the proxied request to
  const stubProxied = (responses: HttpResponse[]) => {
    const proxyTransport = new Connection({ proxyUrl: 'https://proxy.example.com/proxy/' })._transport;
    const base = Object.getPrototypeOf(Object.getPrototypeOf(proxyTransport));
    const original = base.httpRequest;
    const sent: Array<{ req: HttpRequest; options: HttpRequestOptions }> = [];
    base.httpRequest = (req: HttpRequest, options: HttpRequestOptions = {}) => {
      sent.push({ req, options });
      const res = responses.shift() ?? { statusCode: 200, headers: {}, body: '' };
      return StreamPromise.create<HttpResponse>(() => ({ stream: new PassThrough(), promise: Promise.resolve(res) }));
    };
    return { proxyTransport, sent, restore: () => (base.httpRequest = original) };
  };

  it('passes the options to the AJAX proxy, and makes the redirected request through it', async () => {
    const { proxyTransport, sent, restore } = stubProxied([]);
    const redirectUrl = `${instanceUrl}/services/data/v59.0/limits`;
    try {
      const req: HttpRequest = { method: 'GET', url: `${instanceUrl}/services/data` };
      await proxyTransport.httpRequest(req, { followRedirect: false, timeout: 1000 });
      await proxyTransport.httpRequest(req);
    } finally {
      restore();
    }
    assert.equal(sent[0].options.followRedirect, false);
    assert.equal(sent[0].options.timeout, 1000);
    assert.equal(sent[0].req.headers?.['salesforceproxy-redirect'], undefined);
    const byDefault = await (sent[1].options.followRedirect as RedirectHandler)(redirectUrl);
    assert.equal(byDefault?.method, 'GET');
    assert.equal(byDefault?.headers?.['salesforceproxy-endpoint'], redirectUrl);
  });

  it('follows a redirect that the AJAX proxy reported in headers, with a given followRedirect function', async () => {
    const location = `${instanceUrl}/services/oauth2/revoke`;
    const { proxyTransport, sent, restore } = stubProxied([
      {
        statusCode: 200,
        headers: { 'salesforceproxy-redirect-status': '302', 'salesforceproxy-redirect-location': location },
        body: '',
      },
      { statusCode: 200, headers: {}, body: 'ok' },
    ]);
    let res: HttpResponse;
    try {
      res = await proxyTransport.httpRequest(
        { method: 'POST', url: `${loginUrl}/services/oauth2/revoke`, body: 'token=t' },
        { followRedirect: (url) => Promise.resolve({ method: 'POST', url, body: 'token=t', headers: { DPoP: 'proof' } }) },
      );
    } finally {
      restore();
    }
    assert.equal(res.body, 'ok');
    assert.equal(sent.length, 2);
    assert.equal(sent[0].req.headers?.['salesforceproxy-redirect'], 'report');
    assert.equal(sent[1].req.headers?.['salesforceproxy-endpoint'], location);
    assert.equal(sent[1].req.headers?.DPoP, 'proof');
    assert.equal(sent[1].req.headers?.['salesforceproxy-redirect'], 'report');
  });
});
