/* @flow */
import EventEmitter from 'events';
import Transport, { ProxyTransport, HttpProxyTransport } from './transport';
import { Logger, getLogger } from './util/logger';
import type { LogLevelConfig } from './util/logger';


/**
 * type definitions
 */
export type ConnectionConfig = {
  version?: string,
  loginUrl?: string,
  accessToken?: string,
  refreshToken?: string,
  instanceUrl?: string,
  sessionId?: string,
  serverUrl?: string,
  signedRequest?: string,
  logLevel?: LogLevelConfig,
};

export type UserInfo = {
  id: string,
  organizationId: string,
  url: string,
};

export type ConnectionEstablishOptions = {
  accessToken?: string,
  refreshToken?: string,
  instanceUrl?: string,
  sessionId?: string,
  serverUrl?: string,
  signedRequest?: string|Object,
  userInfo?: UserInfo,
};


/**
 *
 */
const defaultConnectionConfig: {
  loginUrl: string,
  instanceUrl: string,
  version: string,
  logLevel: LogLevelConfig,
} = {
  loginUrl: 'https://login.salesforce.com',
  instanceUrl: '',
  version: '39.0',
  logLevel: 'NONE',
};

/**
 *
 */
function esc(str: ?string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 *
 */
function parseSignedRequest(sr: string | Object): Object {
  if (typeof sr === 'string') {
    if (sr[0] === '{') { // might be JSON
      return JSON.parse(sr);
    }  // might be original base64-encoded signed request
    const msg = sr.split('.').pop(); // retrieve latter part
    const json = new Buffer(msg, 'base64').toString('utf-8');
    return JSON.parse(json);
  }
  return sr;
}


/**
 *
 */
export default class Connection extends EventEmitter {
  static _logger = getLogger('connection');
  version: string;
  loginUrl: string;
  instanceUrl: string;
  accessToken: ?string;
  refreshToken: ?string;
  userInfo: ?UserInfo;
  limitInfo: ?Object;
  sobjects: { [string]: any };
  _cache: any;
  _logger: Logger;
  _transport: any;
  _sessionType: ?('soap' | 'oauth2');

  /**
   *
   */
  constructor(config?: ConnectionConfig = {}) {
    super();
    this.loginUrl = config.loginUrl || defaultConnectionConfig.loginUrl;
    this.instanceUrl = config.instanceUrl || defaultConnectionConfig.instanceUrl;
    this.version = config.version || defaultConnectionConfig.version;
    this._logger =
      config.logLevel ? Connection._logger.createInstance(config.logLevel) : Connection._logger;
    this._transport =
      config.proxyUrl ? new ProxyTransport(config.proxyUrl) :
      config.httpProxy ? new HttpProxyTransport(config.httpProxy) :
      new Transport();
    const { accessToken, refreshToken, instanceUrl, sessionId, serverUrl, signedRequest } = config;
    this._establish({
      accessToken, refreshToken, instanceUrl, sessionId, serverUrl, signedRequest,
    });
  }

  /* @private */
  _establish(options: ConnectionEstablishOptions) {
    this._resetInstance();
    this.instanceUrl =
      options.serverUrl ? options.serverUrl.split('/').slice(0, 3).join('/') :
      options.instanceUrl ? options.instanceUrl :
      this.instanceUrl;
    this.accessToken = options.sessionId || options.accessToken || this.accessToken;
    this.refreshToken = options.refreshToken || this.refreshToken;
    if (this.refreshToken && !this._refreshDelegate) {
      throw new Error('Refresh token is specified without oauth2 client information or refresh function');
    }
    const signedRequest = options.signedRequest && parseSignedRequest(options.signedRequest);
    if (signedRequest) {
      this.accessToken = signedRequest.client.oauthToken;
    /*
      if (Transport.CanvasTransport.supported) {
        this._transport = new Transport.CanvasTransport(this.signedRequest);
      }
    */
    }
    this.userInfo = options.userInfo || this.userInfo;
    this._sessionType = options.sessionId ? 'soap' : 'oauth2';
  }

  /* @priveate */
  _resetInstance() {
    this.accessToken = null;
    this.userInfo = null;
    this.refreshToken = null;
    this.instanceUrl = defaultConnectionConfig.instanceUrl;
    this.limitInfo = {};
    this.sobjects = {};
    /*
    this._cache.clear();
    this._cache.get('describeGlobal').on('value', (res) => {
      if (res.result) {
        for (const so of res.result.sobjects) {
          this.sobject(so.name);
        }
      }
    });
    */
    /*
    if (this.tooling) {
      this.tooling._resetInstance();
    }
    */
  }

  /**
   *
   */
  async login(username: string, password: string): Promise<UserInfo> {
    return this.loginBySoap(username, password);
  }

  /**
   *
   */
  async loginBySoap(username: string, password: string): Promise<UserInfo> {
    if (!username || !password) {
      return Promise.reject(new Error('no username password given'));
    }
    const body = [
      '<se:Envelope xmlns:se="http://schemas.xmlsoap.org/soap/envelope/">',
      '<se:Header/>',
      '<se:Body>',
      '<login xmlns="urn:partner.soap.sforce.com">',
      `<username>${esc(username)}</username>`,
      `<password>${esc(password)}</password>`,
      '</login>',
      '</se:Body>',
      '</se:Envelope>'
    ].join('');

    const soapLoginEndpoint = [this.loginUrl, 'services/Soap/u', this.version].join('/');
    const response = await this._transport.httpRequest({
      method: 'POST',
      url: soapLoginEndpoint,
      body,
      headers: {
        'Content-Type': 'text/xml',
        SOAPAction: '""'
      }
    });
    let m;
    if (response.statusCode >= 400) {
      m = response.body.match(/<faultstring>([^<]+)<\/faultstring>/);
      const faultstring = m && m[1];
      throw new Error(faultstring || response.body);
    }
    this._logger.debug(`SOAP response = ${response.body}`);
    m = response.body.match(/<serverUrl>([^<]+)<\/serverUrl>/);
    const serverUrl = m && m[1];
    m = response.body.match(/<sessionId>([^<]+)<\/sessionId>/);
    const sessionId = m && m[1];
    m = response.body.match(/<userId>([^<]+)<\/userId>/);
    const userId = m && m[1];
    m = response.body.match(/<organizationId>([^<]+)<\/organizationId>/);
    const organizationId = m && m[1];
    const idUrl = [this.loginUrl, 'id', organizationId, userId].join('/');
    const userInfo = { id: userId, organizationId, url: idUrl };
    this._establish({
      serverUrl: serverUrl.split('/').slice(0, 3).join('/'),
      sessionId,
      userInfo
    });
    this._logger.debug(`<login> completed. user id = ${userId}, org id = ${organizationId}`);
    return userInfo;
  }

  /**
   *
   */
  async logoutBySoap(): Promise<void> {
    const body = [
      '<se:Envelope xmlns:se="http://schemas.xmlsoap.org/soap/envelope/">',
      '<se:Header>',
      '<SessionHeader xmlns="urn:partner.soap.sforce.com">',
      `<sessionId>${esc(this.accessToken)}</sessionId>`,
      '</SessionHeader>',
      '</se:Header>',
      '<se:Body>',
      '<logout xmlns="urn:partner.soap.sforce.com"/>',
      '</se:Body>',
      '</se:Envelope>'
    ].join('');
    const response = await this._transport.httpRequest({
      method: 'POST',
      url: [this.instanceUrl, 'services/Soap/u', this.version].join('/'),
      body,
      headers: {
        'Content-Type': 'text/xml',
        SOAPAction: '""'
      }
    });
    this._logger.debug(`SOAP statusCode = ${response.statusCode}, response = ${response.body}`);
    if (response.statusCode >= 400) {
      const m = response.body.match(/<faultstring>([^<]+)<\/faultstring>/);
      const faultstring = m && m[1];
      throw new Error(faultstring || response.body);
    }
    // Destroy the session bound to this connection
    this._resetInstance();
  }
}
