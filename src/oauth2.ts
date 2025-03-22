/**
 *
 */
import {createHash, randomBytes} from 'crypto';
import querystring from 'querystring';
import Transport, {HttpProxyTransport, XdProxyTransport} from './transport';
import {Optional} from './types';

const defaultOAuth2Config = {
  loginUrl: 'https://login.salesforce.com',
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
};

export type AuthzRequestParams = {
  scope?: string;
  state?: string;
  code_challenge?: string;
} & {
  [attr: string]: string;
};

export type TokenResponse = {
  token_type: 'Bearer';
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
    } = config;
    if (authzServiceUrl && tokenServiceUrl) {
      this.loginUrl = authzServiceUrl.split('/').slice(0, 3).join('/');
      this.authzServiceUrl = authzServiceUrl;
      this.tokenServiceUrl = tokenServiceUrl;
      this.revokeServiceUrl =
        revokeServiceUrl || `${this.loginUrl}/services/oauth2/revoke`;
    } else {
      this.loginUrl = loginUrl ?? defaultOAuth2Config.loginUrl

      const maybeSlash = this.loginUrl.endsWith('/') ? '' : '/'

      this.authzServiceUrl = `${this.loginUrl}${maybeSlash}services/oauth2/authorize`
      this.tokenServiceUrl = `${this.loginUrl}${maybeSlash}services/oauth2/token`
      this.revokeServiceUrl = `${this.loginUrl}${maybeSlash}services/oauth2/revoke`
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
    const response = await this._transport.httpRequest({
      method: 'POST',
      url: this.revokeServiceUrl,
      body: querystring.stringify({ token }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
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

    const response = await this._transport.httpRequest({
      method: 'POST',
      url: this.tokenServiceUrl,
      body: querystring.stringify(params),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    let res;
    try {
      res = JSON.parse(response.body);
    } catch (e) {
      /* eslint-disable no-empty */
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
    return res;
  }
}

export default OAuth2;
