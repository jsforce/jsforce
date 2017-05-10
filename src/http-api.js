/* @flow */
import EventEmitter from 'events';
import { Logger, getLogger } from './util/logger';
import { StreamPromise } from './util/promise';
import Connection from './connection';
import Transport from './transport';
import type { HttpRequest, HttpResponse } from './types';


/** @private */
function parseJSON(str) {
  return JSON.parse(str);
}

/** @private */
function parseXML(str: string) {
  // TODO xml impl
  /*
  var ret = {};
  require('xml2js').parseString(str, { explicitArray: false }, function(err, result) {
    ret = { error: err, result : result };
  });
  if (ret.error) { throw ret.error; }
  return ret.result;
  */
  return str;
}

/** @private */
function parseCSV(str: string) {
  // TODO csv impl
  // return require('./csv').parseCSV(str);
  return str;
}

/** @private */
function parseText(str: string) { return str; }

/**
 * HTTP based API class with authorization hook
 */
export default class HttpApi extends EventEmitter {
  static _logger = getLogger('http-api');

  _conn: Connection;
  _logger: Logger;
  _transport: Transport;
  _responseType: ?string;
  _noContentResponse: ?string;

  constructor(conn: Connection, options: any) {
    super();
    this._conn = conn;
    this._logger =
      conn._logLevel ? HttpApi._logger.createInstance(conn._logLevel) : HttpApi._logger;
    this._responseType = options.responseType;
    this._transport = options.transport || conn._transport;
    this._noContentResponse = options.noContentResponse;
  }

  /**
   * Callout to API endpoint using http
   */
  request(request: HttpRequest): StreamPromise<any> {
    return new StreamPromise(async (setStream) => {
      const refreshDelegate = this.getRefreshDelegate();
      /* TODO decide remove or not this section */
      /*
      // remember previous instance url in case it changes after a refresh
      const lastInstanceUrl = conn.instanceUrl;

      // check to see if the token refresh has changed the instance url
      if(lastInstanceUrl !== conn.instanceUrl){
        // if the instance url has changed
        // then replace the current request urls instance url fragment
        // with the updated instance url
        request.url = request.url.replace(lastInstanceUrl,conn.instanceUrl);
      }
      */
      if (refreshDelegate && refreshDelegate.isRefreshing()) {
        await refreshDelegate.waitRefresh();
        const bodyPromise = this.request(request);
        setStream(bodyPromise.stream());
        const body = await bodyPromise;
        return body;
      }

      // hook before sending
      this.beforeSend(request);

      this.emit('request', request);
      this._logger.debug(`<request> method=${request.method}, url=${request.url}`);
      const requestTime = Date.now();
      const requestPromise = this._transport.httpRequest(request);

      setStream(requestPromise.stream());

      let response: ?HttpResponse;
      try {
        response = await requestPromise;
      } catch (err) {
        this._logger.error(err);
        throw err;
      } finally {
        const responseTime = Date.now();
        this._logger.debug(`elappsed time: ${responseTime - requestTime} msec`);
      }
      this._logger.debug(`<response> status=${String(response.statusCode)}, url=${request.url}`);
      this.emit('response', response);
      // Refresh token if session has been expired and requires authentication
      // when session refresh delegate is available
      if (this.isSessionExpired(response) && refreshDelegate) {
        await refreshDelegate.refresh(requestTime);
        return this.request(request);
      }
      if (this.isErrorResponse(response)) {
        const err = this.getError(response);
        throw err;
      }
      return this.getResponseBody(response);
    });
  }

  /**
   * @protected
   */
  getRefreshDelegate() {
    return this._conn._refreshDelegate;
  }

  /**
   * @protected
   */
  beforeSend(request: HttpRequest) {
    /* eslint-disable no-param-reassign */
    const headers = request.headers || {};
    if (this._conn.accessToken) {
      headers.Authorization = `Bearer ${this._conn.accessToken}`;
    }
    if (this._conn._callOptions) {
      const callOptions = [];
      for (const name of Object.keys(this._conn._callOptions)) {
        callOptions.push(`${name}=${this._conn._callOptions[name]}`);
      }
      headers['Sforce-Call-Options'] = callOptions.join(', ');
    }
    request.headers = headers;
  }

  /**
   * Detect response content mime-type
   * @protected
   */
  getResponseContentType(response: HttpResponse): ?string {
    return this._responseType || (response.headers && response.headers['content-type']);
  }

  /**
   * @private
   */
  parseResponseBody(response: HttpResponse) {
    const contentType = this.getResponseContentType(response) || '';
    const parseBody = /^(text|application)\/xml(;|$)/.test(contentType) ? parseXML :
           /^application\/json(;|$)/.test(contentType) ? parseJSON :
           /^text\/csv(;|$)/.test(contentType) ? parseCSV :
           parseText;
    try {
      return parseBody(response.body);
    } catch (e) {
      return response.body;
    }
  }

  /**
   * Get response body
   * @protected
   */
  getResponseBody(response: HttpResponse) {
    if (response.statusCode === 204) { // No Content
      return this._noContentResponse;
    }
    const body = this.parseResponseBody(response);
    let err;
    if (this.hasErrorInResponseBody(body)) {
      err = this.getError(response, body);
      throw err;
    }
    if (response.statusCode === 300) { // Multiple Choices
      throw new (class extends Error {
        content: ?any;
        constructor(name, message, content) {
          super(message);
          this.name = name;
          this.content = content;
        }
      })('MULTIPLE_CHOICES', 'Multiple records found', body);
    }
    return body;
  }

  /**
   * Detect session expiry
   * @protected
   */
  isSessionExpired(response: HttpResponse) {
    return response.statusCode === 401;
  }

  /**
   * Detect error response
   * @protected
   */
  isErrorResponse(response: HttpResponse) {
    return response.statusCode >= 400;
  }

  /**
   * Detect error in response body
   * @protected
   */
  hasErrorInResponseBody(/* body */) {
    return false;
  }

  /**
   * Parsing error message in response
   * @protected
   */
  parseError(body: any) {
    const errors = body;
    return Array.isArray(errors) ? errors[0] : errors;
  }

  /**
   * Get error message in response
   * @protected
   */
  getError(response: HttpResponse, body: any): Error {
    let error;
    try {
      error = this.parseError(body || this.parseResponseBody(response));
    } catch (e) {
      // eslint-disable no-empty
    }
    error =
      typeof error === 'object' && error !== null && typeof error.message === 'string' ?
      error :
      { errorCode: `ERROR_HTTP_${response.statusCode}`, message: response.body };
    return new (class extends Error {
      constructor({ message, errorCode }) {
        super(message);
        this.name = errorCode || this.name;
      }
    })(error);
  }
}
