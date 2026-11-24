/**
 *
 */
import {createHash, randomBytes} from 'crypto';
import querystring from 'querystring';
import Transport, {HttpProxyTransport, XdProxyTransport} from './transport';
import {HttpRequest, HttpResponse, Optional} from './types';

const defaultOAuth2Config = {
  loginUrl: 'https://login.salesforce.com',
};

const appendPath = (base: string, segment: string): string => {
  const url = new URL(base);
  const basePath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
  url.pathname = `${basePath}/${segment}`;
  return url.href;
};

// Makes a nodejs base64 encoded string compatible with rfc4648 alternative encoding for urls.
// @param base64Encoded a nodejs base64 encoded string
function base64UrlEscape(base64Encoded: string): string {
  // builtin node js base 64 encoding is not 64 url compatible.
  // See https://toolsn.ietf.org/html/rfc4648#section-5
  return base64Encoded
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/*
 * DPoP (OAuth 2.0 Demonstrating Proof of Possession, RFC 9449)
 */

/**
 * Signer of DPoP proofs, so that the private key can stay in WebCrypto, a KMS or an HSM
 */
export type DPoPSigner = {
  readonly algorithm: 'ES256';
  /**
   * Format of the signature returned by `sign()`: r and s concatenated ('jose'), or DER
   */
  readonly format: 'jose' | 'der';
  readonly publicJwk: JsonWebKey;
  sign(signingInput: Uint8Array): Promise<Uint8Array>;
};

const ES256_KEY_ALGORITHM = { name: 'ECDSA', namedCurve: 'P-256' } as const;

function base64url(data: Uint8Array | string): string {
  // the Buffer used in the browser build does not support 'base64url'
  return base64UrlEscape(Buffer.from(data).toString('base64'));
}

function sha256(data: string): Uint8Array {
  return createHash('sha256').update(data).digest();
}

/**
 * Convert a DER encoded ECDSA signature to r and s concatenated (RFC 7518, Section 3.4)
 */
function derToJose(der: Uint8Array): Uint8Array {
  // SEQUENCE { INTEGER r, INTEGER s }
  const jose = new Uint8Array(64);
  let pos = 2;
  for (let i = 0; i < 2; i++) {
    const len = der[pos + 1];
    let int = der.subarray(pos + 2, pos + 2 + len);
    pos += 2 + len;
    // drop the leading zero byte of an INTEGER whose top bit is set
    while (int.length > 32 && int[0] === 0) {
      int = int.subarray(1);
    }
    jose.set(int, i * 32 + (32 - int.length));
  }
  return jose;
}

/**
 * DPoP configuration
 */
export type DPoPConfig = {
  signer: DPoPSigner;
};

/**
 * DPoP (RFC 9449) proofs made with a signer
 */
export class DPoP {
  readonly signer: DPoPSigner;

  /**
   * Create a signer from a WebCrypto key pair or a PKCS#8 PEM P-256 private key
   */
  static async createSigner(key: CryptoKeyPair | string): Promise<DPoPSigner> {
    const { subtle } = globalThis.crypto;
    let privateKey: CryptoKey;
    let publicJwk: JsonWebKey;
    if (typeof key === 'string') {
      const pkcs8 = new Uint8Array(
        Buffer.from(
          key.replace(/-----(BEGIN|END) PRIVATE KEY-----|\s/g, ''),
          'base64',
        ),
      );
      // imported as extractable only to read the public members
      const extractable = await subtle.importKey(
        'pkcs8',
        pkcs8,
        ES256_KEY_ALGORITHM,
        true,
        ['sign'],
      );
      publicJwk = await subtle.exportKey('jwk', extractable);
      privateKey = await subtle.importKey(
        'pkcs8',
        pkcs8,
        ES256_KEY_ALGORITHM,
        false,
        ['sign'],
      );
    } else {
      privateKey = key.privateKey;
      // a public key can be exported even when the private key cannot
      publicJwk = await subtle.exportKey('jwk', key.publicKey);
    }
    const { crv, kty, x, y } = publicJwk;
    return {
      algorithm: 'ES256',
      format: 'jose',
      publicJwk: { crv, kty, x, y },
      async sign(signingInput: Uint8Array) {
        const signature = await subtle.sign(
          { name: 'ECDSA', hash: 'SHA-256' },
          privateKey,
          new Uint8Array(signingInput),
        );
        return new Uint8Array(signature);
      },
    };
  }

  constructor(config: DPoPConfig) {
    this.signer = config.signer;
  }

  /**
   * JWK thumbprint (RFC 7638) of the signer's public key, used as `dpop_jkt`
   */
  get jwkThumbprint(): string {
    const { crv, kty, x, y } = this.signer.publicJwk;
    return base64url(sha256(JSON.stringify({ crv, kty, x, y })));
  }

  /**
   * Create a DPoP proof JWT (RFC 9449, Section 4.2) for a request.
   * `accessToken` is given for a request with the access token, and `nonce` when the server asks for one.
   */
  async createProof(params: {
    method: string;
    url: string;
    accessToken?: string;
    nonce?: string;
  }): Promise<string> {
    const url = new URL(params.url);
    if (url.protocol !== 'https:') {
      throw new Error(`DPoP requests can be sent only over HTTPS: ${params.url}`);
    }
    const { signer } = this;
    const { crv, kty, x, y } = signer.publicJwk;
    const header = {
      typ: 'dpop+jwt',
      alg: signer.algorithm,
      jwk: { crv, kty, x, y },
    };
    const payload = {
      jti: base64url(globalThis.crypto.getRandomValues(new Uint8Array(16))),
      htm: params.method.toUpperCase(),
      // without query and fragment
      htu: `${url.origin}${url.pathname}`,
      iat: Math.floor(Date.now() / 1000),
      ...(params.nonce ? { nonce: params.nonce } : {}),
      ...(params.accessToken
        ? { ath: base64url(sha256(params.accessToken)) }
        : {}),
    };
    const signingInput = `${base64url(JSON.stringify(header))}.${base64url(
      JSON.stringify(payload),
    )}`;
    const signature = await signer.sign(new TextEncoder().encode(signingInput));
    const jose = signer.format === 'der' ? derToJose(signature) : signature;
    return `${signingInput}.${base64url(jose)}`;
  }
}

/**
 * type defs
 */
export type OAuth2Config = {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  loginUrl?: string;
  authzServiceUrl?: string;
  tokenServiceUrl?: string;
  revokeServiceUrl?: string;
  proxyUrl?: string;
  httpProxy?: string;
  useVerifier?: boolean;
  dpop?: DPoPConfig | DPoP;
};

export type AuthzRequestParams = {
  scope?: string;
  state?: string;
  code_challenge?: string;
} & {
  [attr: string]: string;
};

export type TokenResponse = {
  token_type: 'Bearer' | 'DPoP';
  /**
   * Space-separated list of OAuth scopes associated with the access token
   *
   * For the OAuth 2.0 Web Server Flow, this can be a subset of the registered scopes if specified when requesting the auth code.
   *
   * See: https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_tokens_scopes.htm&type=5
   */
  scope: string;
  /**
   * Identity URL
   *
   * The format of the URL is https://login.salesforce.com/id/orgID/userID.
   */
  id: string;
  access_token: string;
  refresh_token?: string;
  signature: string;
  issued_at: string;
  instance_url: string;
  sfdc_community_url?: string;
  sfdc_community_id?: string;
  extra?: {
    proofNonce?: string;
  };
};

/**
 * OAuth2 class
 */
export class OAuth2 {
  loginUrl: string;
  authzServiceUrl: string;
  tokenServiceUrl: string;
  revokeServiceUrl: string;
  clientId: Optional<string>;
  clientSecret: Optional<string>;
  redirectUri: Optional<string>;
  codeVerifier: Optional<string>;
  dpop: Optional<DPoP>;

  _transport: Transport;

  /**
   *
   */
  constructor(config: OAuth2Config) {
    const {
      loginUrl,
      authzServiceUrl,
      tokenServiceUrl,
      revokeServiceUrl,
      clientId,
      clientSecret,
      redirectUri,
      proxyUrl,
      httpProxy,
      useVerifier,
      dpop,
    } = config;
    this.dpop = dpop instanceof DPoP ? dpop : dpop ? new DPoP(dpop) : undefined;
    if (authzServiceUrl && tokenServiceUrl) {
      this.loginUrl = new URL(authzServiceUrl).origin;
      this.authzServiceUrl = authzServiceUrl;
      this.tokenServiceUrl = tokenServiceUrl;
      this.revokeServiceUrl =
        revokeServiceUrl || appendPath(this.loginUrl, 'services/oauth2/revoke');
    } else {
      this.loginUrl = loginUrl ?? defaultOAuth2Config.loginUrl;
      this.authzServiceUrl = appendPath(this.loginUrl, 'services/oauth2/authorize');
      this.tokenServiceUrl = appendPath(this.loginUrl, 'services/oauth2/token');
      this.revokeServiceUrl = appendPath(this.loginUrl, 'services/oauth2/revoke');
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    if (proxyUrl) {
      this._transport = new XdProxyTransport(proxyUrl);
    } else if (httpProxy) {
      this._transport = new HttpProxyTransport(httpProxy);
    } else {
      this._transport = new Transport();
    }
    if (useVerifier) {
      // Set a code verifier string for OAuth authorization
      this.codeVerifier = base64UrlEscape(
        randomBytes(Math.ceil(128)).toString('base64'),
      );
    }
  }

  /**
   * Get Salesforce OAuth2 authorization page URL to redirect user agent.
   */
  getAuthorizationUrl(params: AuthzRequestParams = {}) {
    if (this.codeVerifier) {
      // code verifier must be a base 64 url encoded hash of 128 bytes of random data. Our random data is also
      // base 64 url encoded. See Connection.create();
      params.code_challenge = base64UrlEscape(
        createHash('sha256').update(this.codeVerifier).digest('base64'),
      );
    }

    if (this.dpop) {
      params.dpop_jkt = this.dpop.jwkThumbprint;
    }

    const _params = {
      ...params,
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    };
    return (
      this.authzServiceUrl +
      (this.authzServiceUrl.includes('?') ? '&' : '?') +
      querystring.stringify(_params as { [name: string]: any })
    );
  }

  /**
   * OAuth2 Refresh Token Flow
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    if (!this.clientId) {
      throw new Error('No OAuth2 client id information is specified');
    }
    const params: { [prop: string]: string } = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
    };
    if (this.clientSecret) {
      params.client_secret = this.clientSecret;
    }
    const ret = await this._postParams(params);
    return ret as TokenResponse;
  }

  /**
   * Send access token request to the token endpoint.
   * When a code (string) is passed in first argument, it will use Web Server Authentication Flow (Authorization Code Grant).
   * Otherwise, it will use the specified `grant_type` and pass parameters to the endpoint.
   */
  async requestToken(
    codeOrParams: string | { grant_type: string; [name: string]: string },
    params: { [prop: string]: string } = {},
  ): Promise<TokenResponse> {
    if (
      typeof codeOrParams === 'string' &&
      (!this.clientId || !this.redirectUri)
    ) {
      throw new Error(
        'No OAuth2 client id or redirect uri configuration is specified',
      );
    }
    const _params: { [prop: string]: string } = {
      ...params,
      ...(typeof codeOrParams === 'string'
        ? { grant_type: 'authorization_code', code: codeOrParams }
        : codeOrParams),
    };
    if (this.clientId) {
      _params.client_id = this.clientId;
    }
    if (this.clientSecret) {
      _params.client_secret = this.clientSecret;
    }
    if (this.redirectUri) {
      _params.redirect_uri = this.redirectUri;
    }
    const ret = await this._postParams(_params);
    return ret as TokenResponse;
  }

  /**
   * OAuth2 Username-Password Flow (Resource Owner Password Credentials)
   */
  async authenticate(
    username: string,
    password: string,
  ): Promise<TokenResponse> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('No valid OAuth2 client configuration set');
    }
    const ret = await this._postParams({
      grant_type: 'password',
      username,
      password,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
    return ret as TokenResponse;
  }

  /**
   * OAuth2 Revoke Session Token
   */
  async revokeToken(token: string): Promise<void> {
    const { response } = await this._postToEndpoint(
      'revoke',
      querystring.stringify({ token }),
    );
    if (response.statusCode >= 400) {
      let res: any = querystring.parse(response.body);
      if (!res || !res.error) {
        res = {
          error: `ERROR_HTTP_${response.statusCode}`,
          error_description: response.body,
        };
      }
      throw new (class extends Error {
        constructor({
          error,
          error_description,
        }: {
          error: string;
          error_description: string;
        }) {
          super(error_description);
          this.name = error;
        }
      })(res);
    }
  }

  /**
   * @private
   */
  async _postParams(params: { [name: string]: string }): Promise<any> {
    if (this.codeVerifier) params.code_verifier = this.codeVerifier;

    const { response, proofNonce } = await this._postToEndpoint(
      'token',
      querystring.stringify(params),
    );
    let res;
    try {
      res = JSON.parse(response.body);
    } catch (e) {
    }
    if (response.statusCode >= 400) {
      res = res || {
        error: `ERROR_HTTP_${response.statusCode}`,
        error_description: response.body,
      };
      throw new (class extends Error {
        constructor({
          error,
          error_description,
        }: {
          error: string;
          error_description: string;
        }) {
          super(error_description);
          this.name = error;
        }
      })(res);
    }
    if (this.dpop && res?.token_type?.toLowerCase() !== 'dpop') {
      throw new Error(
        `DPoP token was expected, but the token type returned was: ${res?.token_type}`,
      );
    }
    if (this.dpop && proofNonce) {
      res.extra = { proofNonce };
    }
    return res;
  }

  /**
   * POST to the token or revoke endpoint, with a DPoP proof when DPoP is used
   * @private
   */
  async _postToEndpoint(
    endpoint: 'token' | 'revoke',
    body: string,
  ): Promise<{ response: HttpResponse; proofNonce?: string }> {
    const url =
      endpoint === 'token' ? this.tokenServiceUrl : this.revokeServiceUrl;
    const request: HttpRequest = {
      method: 'POST',
      url,
      body,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    };
    const { dpop } = this;
    if (!dpop) {
      return { response: await this._transport.httpRequest(request) };
    }
    const send = async (nonce: string | undefined) => {
      const headers = {
        ...request.headers,
        DPoP: await dpop.createProof({ method: 'POST', url, nonce }),
      };
      return this._transport.httpRequest(
        { ...request, headers },
        {
          // a new proof for the redirected request
          followRedirect: async (redirectUrl: string) => ({
            method: 'GET',
            url: redirectUrl,
            headers: {
              ...headers,
              DPoP: await dpop.createProof({ method: 'GET', url: redirectUrl, nonce }),
            },
          }),
        },
      );
    };
    const response = await send(undefined);
    const nonce = response.headers['dpop-nonce'];
    // RFC 9449, Section 8
    if (nonce && (response.statusCode === 400 || response.statusCode === 401)) {
      const retried = await send(nonce);
      return {
        response: retried,
        proofNonce: retried.headers['dpop-nonce'] ?? nonce,
      };
    }
    return { response, proofNonce: nonce };
  }
}

export default OAuth2;
