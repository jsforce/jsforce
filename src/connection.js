/* @flow */
import EventEmitter from 'events';
import type { HttpRequest, Callback, Record, UnsavedRecord, SaveResult } from './types';
import { StreamPromise } from './util/promise';
import Transport, { CanvasTransport, ProxyTransport, HttpProxyTransport } from './transport';
import { Logger, getLogger } from './util/logger';
import type { LogLevelConfig } from './util/logger';
import OAuth2 from './oauth2';
import type { OAuth2Config } from './oauth2';
import HttpApi from './http-api';
import SessionRefreshDelegate from './session-refresh-delegate';


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
  oauth2?: OAuth2 | OAuth2Config,
  maxRequest?: number,
  proxyUrl?: string,
  httpProxy?: string,
  logLevel?: LogLevelConfig,
  callOptions?: { [string]: string },
  refreshFn?: (Connection, Callback<string>) => any, // eslint-disable-line no-use-before-define
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
  maxRequest: number,
} = {
  loginUrl: 'https://login.salesforce.com',
  instanceUrl: '',
  version: '39.0',
  logLevel: 'NONE',
  maxRequest: 10,
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

/** @private **/
function parseIdUrl(url: string) {
  const [organizationId, id] = url.split('/').slice(-2);
  return { id, organizationId, url };
}

/**
 * Session Refresh delegate function for OAuth2 authz code flow
 * @private
 */
async function oauthRefreshFn(conn, callback) {
  try {
    if (!conn.refreshToken) { throw new Error('No refresh token found in the connection'); }
    const res = await conn.oauth2.refreshToken(conn.refreshToken);
    const userInfo = parseIdUrl(res.id);
    conn._establish({
      instanceUrl: res.instance_url,
      accessToken: res.access_token,
      userInfo
    });
    callback(null, res.access_token, res);
  } catch (err) {
    callback(err);
  }
}

/**
 * Session Refresh delegate function for username/password login
 * @private
 */
function createUsernamePasswordRefreshFn(username, password) {
  return async (conn, callback) => {
    try {
      await conn.login(username, password);
      callback(null, conn.accessToken);
    } catch (err) {
      callback(err);
    }
  };
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
  oauth2: OAuth2;
  sobjects: { [string]: any };
  _callOptions: ?{ [string]: string };
  _cache: any;
  _maxRequest: number;
  _logger: Logger;
  _logLevel: ?LogLevelConfig;
  _transport: Transport;
  _sessionType: ?('soap' | 'oauth2');
  _refreshDelegate: ?SessionRefreshDelegate;

  /**
   *
   */
  constructor(config?: ConnectionConfig = {}) {
    super();
    const {
      loginUrl, instanceUrl, version, oauth2, maxRequest, logLevel, proxyUrl, httpProxy,
    } = config;
    this.loginUrl = loginUrl || defaultConnectionConfig.loginUrl;
    this.instanceUrl = instanceUrl || defaultConnectionConfig.instanceUrl;
    this.version = version || defaultConnectionConfig.version;
    this.oauth2 =
      oauth2 ?
        (oauth2 instanceof OAuth2 ? oauth2 : new OAuth2(oauth2)) :
        new OAuth2({ loginUrl: this.loginUrl });
    let refreshFn = config.refreshFn;
    if (!refreshFn && this.oauth2.clientId && this.oauth2.clientSecret) {
      refreshFn = oauthRefreshFn;
    }
    if (refreshFn) {
      this._refreshDelegate = new SessionRefreshDelegate(this, refreshFn);
    }
    this._maxRequest = maxRequest || defaultConnectionConfig.maxRequest;
    this._logger =
      logLevel ? Connection._logger.createInstance(logLevel) : Connection._logger;
    this._logLevel = logLevel;
    this._transport =
      proxyUrl ? new ProxyTransport(proxyUrl) :
      httpProxy ? new HttpProxyTransport(httpProxy) :
      new Transport();
    this._callOptions = config.callOptions;
    const { accessToken, refreshToken, sessionId, serverUrl, signedRequest } = config;
    this._establish({
      accessToken, refreshToken, instanceUrl, sessionId, serverUrl, signedRequest,
    });
  }

  /* @private */
  _establish(options: ConnectionEstablishOptions) {
    const {
      accessToken, refreshToken, instanceUrl, sessionId, serverUrl, signedRequest, userInfo,
    } = options;
    this._resetInstance();
    this.instanceUrl =
      serverUrl ? serverUrl.split('/').slice(0, 3).join('/') : instanceUrl || this.instanceUrl;
    this.accessToken = sessionId || accessToken || this.accessToken;
    this.refreshToken = refreshToken || this.refreshToken;
    if (this.refreshToken && !this._refreshDelegate) {
      throw new Error('Refresh token is specified without oauth2 client information or refresh function');
    }
    const signedRequestObject = signedRequest && parseSignedRequest(signedRequest);
    if (signedRequestObject) {
      this.accessToken = signedRequestObject.client.oauthToken;
      if (CanvasTransport.supported) {
        this._transport = new CanvasTransport(signedRequestObject);
      }
    }
    this.userInfo = userInfo || this.userInfo;
    this._sessionType = sessionId ? 'soap' : 'oauth2';
  }

  /* @priveate */
  _resetInstance() {
    this.accessToken = null;
    this.userInfo = null;
    this.refreshToken = null;
    this.instanceUrl = defaultConnectionConfig.instanceUrl;
    this.limitInfo = {};
    this.sobjects = {};
    // TODO impl cache
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
   * Authorize (using oauth2 web server flow)
   */
  async authorize(code: string): Promise<UserInfo> {
    const res = await this.oauth2.requestToken(code);
    const userInfo = parseIdUrl(res.id);
    this._establish({
      instanceUrl: res.instance_url,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      userInfo,
    });
    this._logger.debug(`<login> completed. user id = ${userInfo.id}, org id = ${userInfo.organizationId}`);
    return userInfo;
  }

  /**
   *
   */
  async login(username: string, password: string): Promise<UserInfo> {
    this._refreshDelegate =
      new SessionRefreshDelegate(this, createUsernamePasswordRefreshFn(username, password));
    if (this.oauth2 && this.oauth2.clientId && this.oauth2.clientSecret) {
      return this.loginByOAuth2(username, password);
    }
    return this.loginBySoap(username, password);
  }

  /**
   * Login by OAuth2 username & password flow
   */
  async loginByOAuth2(username: string, password: string): Promise<UserInfo> {
    const res = await this.oauth2.authenticate(username, password);
    const userInfo = parseIdUrl(res.id);
    this._establish({
      instanceUrl: res.instance_url,
      accessToken: res.access_token,
      userInfo,
    });
    this._logger.info(`<login> completed. user id = ${userInfo.id}, org id = ${userInfo.organizationId}`);
    return userInfo;
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
    this._logger.info(`<login> completed. user id = ${userId}, org id = ${organizationId}`);
    return userInfo;
  }

  /**
   * Logout the current session
   */
  async logout(): Promise<void> {
    this._refreshDelegate = undefined;
    if (this._sessionType === 'oauth2') {
      return this.logoutByOAuth2();
    }
    return this.logoutBySoap();
  }

  /**
   * Logout the current session by revoking access token via OAuth2 session revoke
   */
  async logoutByOAuth2(): Promise<void> {
    if (this.accessToken) {
      await this.oauth2.revokeToken(this.accessToken);
    }
    // Destroy the session bound to this connection
    this._resetInstance();
  }

  /**
   * Logout the session by using SOAP web service API
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

  /**
   *
   */
  query(soql: string /* , options */) {
    return this.request(`/query?q=${encodeURIComponent(soql)}`);
  }

  /**
   * Send REST API request with given HTTP request info, with connected session information.
   *
   * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
   * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
   * , or relative path from version root ('/sobjects/Account/describe').
   */
  request(request: string | HttpRequest, options: Object = {}): StreamPromise<any> {
    // if request is simple string, regard it as url in GET method
    let _request: HttpRequest =
      typeof request === 'string' ? { method: 'GET', url: request } : request;
    // if url is given in relative path, prepend base url or instance url before.
    _request = Object.assign({}, _request, { url: this._normalizeUrl(_request.url) });
    const httpApi = new HttpApi(this, options);
    // log api usage and its quota
    // TODO : limitInfo
    /*
    httpApi.on('response', (response: HttpResponse) => {
      if (response.headers && response.headers["sforce-limit-info"]) {
        var apiUsage = response.headers["sforce-limit-info"].match(/api\-usage=(\d+)\/(\d+)/);
        if (apiUsage) {
          self.limitInfo = {
            apiUsage: {
              used: parseInt(apiUsage[1], 10),
              limit: parseInt(apiUsage[2], 10)
            }
          };
        }
      }
    });
    */
    return httpApi.request(_request);
  }

  /**
   * Send HTTP GET request
   *
   * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
   * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
   * , or relative path from version root ('/sobjects/Account/describe').
   */
  requestGet(url: string, options?: Object) {
    const request = { method: 'GET', url };
    return this.request(request, options);
  }


  /**
   * Send HTTP POST request with JSON body, with connected session information
   *
   * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
   * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
   * , or relative path from version root ('/sobjects/Account/describe').
   */
  requestPost(url: string, body: Object, options?: Object) {
    const request = {
      method: 'POST',
      url,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    };
    return this.request(request, options);
  }

  /**
   * Send HTTP PUT request with JSON body, with connected session information
   *
   * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
   * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
   * , or relative path from version root ('/sobjects/Account/describe').
   */
  requestPut(url: string, body: Object, options?: Object) {
    const request = {
      method: 'PUT',
      url,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    };
    return this.request(request, options);
  }

  /**
   * Send HTTP PATCH request with JSON body
   *
   * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
   * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
   * , or relative path from version root ('/sobjects/Account/describe').
   */
  requestPatch(url: string, body: Object, options?: Object) {
    const request = {
      method: 'PATCH',
      url,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    };
    return this.request(request, options);
  }

  /**
   * Send HTTP DELETE request
   *
   * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
   * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
   * , or relative path from version root ('/sobjects/Account/describe').
   */
  requestDelete(url: string, options?: Object) {
    const request = { method: 'DELETE', url };
    return this.request(request, options);
  }

  /** @private **/
  _baseUrl() {
    return [this.instanceUrl, 'services/data', `v${this.version}`].join('/');
  }

  /**
   * Convert path to absolute url
   * @private
   */
  _normalizeUrl(url: string) {
    if (url[0] === '/') {
      if (url.indexOf('/services/') === 0) {
        return this.instanceUrl + url;
      }
      return this._baseUrl() + url;
    }
    return url;
  }


  /**
   * Retrieve specified records
   */
  async retrieve(
    type: string,
    ids: string | string[],
    options?: Object = {}
  ): Promise<Record | Record[]> {
    const _ids: string[] = Array.isArray(ids) ? ids : [ids];
    if (_ids.length > this._maxRequest) {
      throw new Error('Exceeded max limit of concurrent call');
    }
    const records = await Promise.all(
      _ids.map(async (id) => {
        if (!id) {
          throw new Error('Invalid record ID. Specify valid record ID value');
        }
        const url = [this._baseUrl(), 'sobjects', type, id].join('/');
        const record = await self.request({ method: 'GET', url, headers: options.headers });
        return (record : Record);
      })
    );
    return Array.isArray(ids) ? records : records[0];
  }

  /**
   * Create records
   */
  async create(
    type: string,
    records: UnsavedRecord | UnsavedRecord[],
    options?: Object = {}
  ): Promise<SaveResult | SaveResult[]> {
    const _records = Array.isArray(records) ? records : [records];
    if (records.length > this._maxRequest) {
      throw new Error('Exceeded max limit of concurrent call');
    }
    const results = await Promise.all(
      _records.map(async (record) => {
        const _record = Object.assign({}, record);
        delete _record.Id;
        delete _record.type;
        delete _record.attributes;
        const url = [this._baseUrl(), 'sobjects', type].join('/');
        return this.request({
          method: 'POST',
          url,
          body: JSON.stringify(record),
          headers: Object.assign({
            'content-type': 'application/json'
          }, options.headers),
        });
      })
    );
    return Array.isArray(records) ? results : results[0];
  }

  /**
   * Synonym of Connection#create()
   */
  insert = this.create;


  /**
   * Update records
   */
  async update(
    type: string,
    records: Record | Record[],
    options?: Object = {}
  ): Promise<SaveResult | SaveResult[]> {
    const _records = Array.isArray(records) ? records : [records];
    if (records.length > this._maxRequest) {
      throw new Error('Exceeded max limit of concurrent call');
    }
    const results = await Promise.all(
      _records.map((record) => {
        const id = record.Id;
        const _record = Object.assign({}, record);
        delete _record.Id;
        delete _record.type;
        delete _record.attributes;
        const url = [self._baseUrl(), 'sobjects', type, id].join('/');
        return self.request({
          method: 'PATCH',
          url,
          body: JSON.stringify(record),
          headers: Object.assign({
            'content-type': 'application/json'
          }, options.headers),
        }, {
          noContentResponse: { id, success: true, errors: [] }
        });
      })
    );
    return Array.isArray(records) ? results : results[0];
  }

  /**
   * Upsert records
   */
  async upsert(
    type: string,
    records: Record | Record[],
    extIdField: string,
    options?: Object = {}
  ): Promise<SaveResult | SaveResult[]> {
    const _records = Array.isArray(records) ? records : [records];
    if (records.length > this._maxRequest) {
      throw new Error('Exceeded max limit of concurrent call');
    }
    const results = await Promise.all(
      _records.map((record) => {
        const extId = record[extIdField];
        const _record = Object.assign({}, record);
        delete _record[extIdField];
        delete _record.type;
        delete _record.attributes;
        const url = [this._baseUrl(), 'sobjects', type, extIdField, extId].join('/');
        return self.request({
          method: 'PATCH',
          url,
          body: JSON.stringify(record),
          headers: Object.assign({
            'content-type': 'application/json'
          }, options.headers),
        }, {
          noContentResponse: { success: true, errors: [] }
        });
      })
    );
    return Array.isArray(records) ? results : results[0];
  }

  /**
   * Synonym of Connection#destroy()
   *
   * @method Connection#delete
   * @param {String} type - SObject Type
   * @param {String|Array.<String>} ids - A ID or array of IDs to delete
   * @param {Object} [options] - Options for rest api.
   * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
   * @returns {Promise.<RecordResult|Array.<RecordResult>>}
   */
  /**
   * Synonym of Connection#destroy()
   *
   * @method Connection#del
   * @param {String} type - SObject Type
   * @param {String|Array.<String>} ids - A ID or array of IDs to delete
   * @param {Object} [options] - Options for rest api.
   * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
   * @returns {Promise.<RecordResult|Array.<RecordResult>>}
   */
  /**
   * Delete records
   *
   * @method Connection#destroy
   * @param {String} type - SObject Type
   * @param {String|Array.<String>} ids - A ID or array of IDs to delete
   * @param {Object} [options] - Options for rest api.
   * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
   * @returns {Promise.<RecordResult|Array.<RecordResult>>}
   */
  async destroy(
    type: string,
    ids: string | string[],
    options?: Object = {}
  ): Promise<SaveResult | SaveResult[]> {
    const _ids = Array.isArray(ids) ? ids : [ids];
    if (ids.length > this._maxRequest) {
      throw new Error('Exceeded max limit of concurrent call');
    }
    const results = await Promise.all(
      _ids.map((id) => {
        const url = [this._baseUrl(), 'sobjects', type, id].join('/');
        return self.request({
          method: 'DELETE',
          url,
          headers: options.headers || {}
        }, {
          noContentResponse: { id, success: true, errors: [] }
        });
      })
    );
    return Array.isArray(ids) ? results : results[0];
  }

  /**
   * Synonym of Connection#destroy()
   */
  delete = this.destroy;

  /**
   * Synonym of Connection#destroy()
   */
  del = this.destroy;

  /**
   * Describe SObject metadata
   */
  describe(type: string) {
    const url = [this._baseUrl(), 'sobjects', type, 'describe'].join('/');
    return this.request(url);
  }

  /**
   * Synonym of Connection#describe()
   */
  describeSObject = this.describe;

  /**
   * Describe global SObjects
   */
  describeGlobal() {
    const url = `${this._baseUrl()}/sobjects`;
    return this.request(url);
  }
}
