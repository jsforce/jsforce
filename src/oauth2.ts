/**
 *
 */
import querystring from 'querystring';
import Transport, { ProxyTransport, HttpProxyTransport } from './transport';
import { Optional } from './types';

const defaultOAuth2Config = {
  loginUrl: 'https://login.salesforce.com',
};

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
};

export type AuthzRequestParams = {
  scope?: string;
  state?: string;
} & {
  [attr: string]: string;
};

export type TokenResponse = {
  id: string;
  access_token: string;
  refresh_token: string;
  instance_url: string;
};

/**
 * OAuth2 class
 */
export default class OAuth2 {
  loginUrl: string;
  authzServiceUrl: string;
  tokenServiceUrl: string;
  revokeServiceUrl: string;
  clientId: Optional<string>;
  clientSecret: Optional<string>;
  redirectUri: Optional<string>;

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
    } = config;
    if (authzServiceUrl && tokenServiceUrl) {
      this.loginUrl = authzServiceUrl
        .split('/')
        .slice(0, 3)
        .join('/');
      this.authzServiceUrl = authzServiceUrl;
      this.tokenServiceUrl = tokenServiceUrl;
      this.revokeServiceUrl =
        revokeServiceUrl || `${this.loginUrl}/services/oauth2/revoke`;
    } else {
      this.loginUrl = loginUrl || defaultOAuth2Config.loginUrl;
      this.authzServiceUrl = `${this.loginUrl}/services/oauth2/authorize`;
      this.tokenServiceUrl = `${this.loginUrl}/services/oauth2/token`;
      this.revokeServiceUrl = `${this.loginUrl}/services/oauth2/revoke`;
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    if (proxyUrl) {
      this._transport = new ProxyTransport(proxyUrl);
    } else if (httpProxy) {
      this._transport = new HttpProxyTransport(httpProxy);
    } else {
      this._transport = new Transport();
    }
  }

  /**
   * Get Salesforce OAuth2 authorization page URL to redirect user agent.
   */
  getAuthorizationUrl(params: AuthzRequestParams = {}) {
    const _params = {
      ...params,
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    };
    return (
      this.authzServiceUrl +
      (this.authzServiceUrl.indexOf('?') >= 0 ? '&' : '?') +
      querystring.stringify(_params)
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
   * OAuth2 Web Server Authentication Flow (Authorization Code)
   * Access Token Request
   */
  async requestToken(
    code: string,
    params: { [prop: string]: string } = {},
  ): Promise<TokenResponse> {
    if (!this.clientId || !this.redirectUri) {
      throw new Error(
        'No OAuth2 client id or redirect uri configuration is specified',
      );
    }
    const _params: { [prop: string]: string } = {
      ...params,
      grant_type: 'authorization_code',
      code,
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    };
    if (this.clientSecret) {
      _params.client_secret = this.clientSecret;
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
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('No valid OAuth2 client configuration set');
    }
    const ret = await this._postParams({
      grant_type: 'password',
      username,
      password,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
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
