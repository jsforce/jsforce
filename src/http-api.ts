/**
 *
 */
import { EventEmitter } from 'events';
import xml2js from 'xml2js';
import { Logger, getLogger } from './util/logger';
import { StreamPromise } from './util/promise';
import Connection from './connection';
import Transport from './transport';
import { parseCSV } from './csv';
import {
  HttpRequest,
  HttpRequestOptions,
  HttpResponse,
  Optional,
  Schema,
} from './types';
import { createLazyStream } from './util/stream';
import { getBodySize } from './util/get-body-size';

/** @private */
function parseJSON(str: string) {
  return JSON.parse(str);
}

/** @private */
async function parseXML(str: string) {
  return xml2js.parseStringPromise(str, { explicitArray: false });
}

/** @private */
function parseText(str: string) {
  return str;
}

/**
 * HTTP based API class with authorization hook
 */
export class HttpApi<S extends Schema> extends EventEmitter {
  static _logger = getLogger('http-api');

  _conn: Connection<S>;
  _logger: Logger;
  _transport: Transport;
  _responseType: string | void;
  _noContentResponse: string | void;
  _options: HttpRequestOptions;

  constructor(conn: Connection<S>, options: any) {
    super();
    this._conn = conn;
    this._logger = conn._logLevel
      ? HttpApi._logger.createInstance(conn._logLevel)
      : HttpApi._logger;
    this._responseType = options.responseType;
    this._transport = options.transport || conn._transport;
    this._noContentResponse = options.noContentResponse;
    this._options = options;
  }

  /**
   * Callout to API endpoint using http
   */
  request<R = unknown>(request: HttpRequest): StreamPromise<R> {
    return StreamPromise.create<R>(() => {
      const { stream, setStream } = createLazyStream();
      const promise = (async () => {
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
        this._logger.debug(
          `<request> method=${request.method}, url=${request.url}`,
        );
        const requestTime = Date.now();
        const requestPromise = this._transport.httpRequest(
          request,
          this._options,
        );

        setStream(requestPromise.stream());

        let response: HttpResponse | void;
        try {
          response = await requestPromise;
        } catch (err) {
          this._logger.error(err);
          throw err;
        } finally {
          const responseTime = Date.now();
          this._logger.debug(
            `elapsed time: ${responseTime - requestTime} msec`,
          );
        }
        if (!response) {
          return;
        }
        this._logger.debug(
          `<response> status=${String(response.statusCode)}, url=${
            request.url
          }`,
        );
        this.emit('response', response);
        // Refresh token if session has been expired and requires authentication
        // when session refresh delegate is available
        if (this.isSessionExpired(response) && refreshDelegate) {
          await refreshDelegate.refresh(requestTime);
          /* remove the `content-length` header after token refresh
           *
           * SOAP requests include the access token their the body,
           * if the first req had an invalid token and jsforce successfully
           * refreshed it we need to remove the `content-length` header
           * so that it get's re-calculated again with the new body.
           *
           * REST request aren't affected by this because the access token
           * is sent via HTTP headers
           *
           * `_message` is only present in SOAP requests
           */
          if (
            '_message' in request &&
            request.headers &&
            'content-length' in request.headers
          ) {
            delete request.headers['content-length'];
          }
          return this.request(request);
        }
        if (this.isErrorResponse(response)) {
          const err = await this.getError(response);
          throw err;
        }
        const body = await this.getResponseBody(response);
        return body;
      })();
      return { stream, promise };
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

    const bodySize = getBodySize(request.body, headers);

    const cannotHaveBody = ['GET', 'HEAD', 'OPTIONS'].includes(request.method);

    if (
      !cannotHaveBody &&
      !!request.body &&
      !('transfer-encoding' in headers) &&
      !('content-length' in headers) &&
      !!bodySize
    ) {
      this._logger.debug(
        `missing 'content-length' header, setting it to: ${bodySize}`,
      );
      headers['content-length'] = String(bodySize);
    }
    request.headers = headers;
  }

  /**
   * Detect response content mime-type
   * @protected
   */
  getResponseContentType(response: HttpResponse): Optional<string> {
    return (
      this._responseType ||
      (response.headers && response.headers['content-type'])
    );
  }

  /**
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async parseResponseBody(response: HttpResponse) {
    const contentType = this.getResponseContentType(response) || '';
    const parseBody = /^(text|application)\/xml(;|$)/.test(contentType)
      ? parseXML
      : /^application\/json(;|$)/.test(contentType)
      ? parseJSON
      : /^text\/csv(;|$)/.test(contentType)
      ? parseCSV
      : parseText;
    try {
      return parseBody(response.body);
    } catch (e) {
      // TODO(next major): we could throw a new "invalid response body" error instead.
      this._logger.debug(`Failed to parse body of content-type: ${contentType}. Error: ${(e as Error).message}`)
      return response.body;
    }
  }

  /**
   * Get response body
   * @protected
   */
  async getResponseBody(response: HttpResponse) {
    if (response.statusCode === 204) {
      // No Content
      return this._noContentResponse;
    }
    const body = await this.parseResponseBody(response);
    let err;
    if (this.hasErrorInResponseBody(body)) {
      err = await this.getError(response, body);
      throw err;
    }
    if (response.statusCode === 300) {
      // Multiple Choices
      throw new HttpApiError(
        'Multiple records found',
        'MULTIPLE_CHOICES',
        body,
      );
    }
    return body;
  }

  /**
   * Detect session expiry
   * @protected
   */
  isSessionExpired(response: HttpResponse) {
    // TODO:
    // The connected app msg only applies to Agent API requests, we should move this to a separate SFAP/Agent API class later.
    return response.statusCode === 401 && !response.body.includes('Connected app is not attached to Agent')
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
  hasErrorInResponseBody(_body: Optional<string>) {
    return false;
  }

  /**
   * Parsing error message in response
   * @protected
   */
  parseError(body: any) {
    const errors = body;

    // XML response
    if (errors.Errors) {
      return errors.Errors.Error;
    }

    return errors;
  }

  /**
   * Get error message in response
   * @protected
   */
  async getError(response: HttpResponse, body?: any): Promise<Error> {
    let error;
    try {
      error = this.parseError(body || (await this.parseResponseBody(response)));
    } catch (e) {
      // eslint-disable no-empty
    }
    
    if (Array.isArray(error)) {
      if (error.length === 1){
        error = error[0]
      } else {
        return new HttpApiError(
          `Multiple errors returned.
  Check \`error.data\` for the error details`, 'MULTIPLE_API_ERRORS', error)   
      }
    }

    error =
      typeof error === 'object' &&
      error !== null &&
      typeof error.message === 'string'
        ? error
        : {
            errorCode: `ERROR_HTTP_${response.statusCode}`,
            message: response.body,
          };

    if (response.headers['content-type'] === 'text/html') {
      this._logger.debug(`html response.body: ${response.body}`);
      return new HttpApiError(
        `HTTP response contains html content.
Check that the org exists and can be reached.
See \`error.data\` for the full html response.`,
        error.errorCode,
        error.message,
      );
    }

    return error instanceof HttpApiError ? error : new HttpApiError(error.message, error.errorCode, error);
  }
}

/**
 *
 */
class HttpApiError extends Error {
  /**
   * This contains error-specific details, usually returned from the API.
   */
  data: any
  errorCode: string;

  constructor(message: string, errorCode?: string | undefined, data?: any) {
    super(message);
    this.name = errorCode || this.name;
    this.errorCode = this.name;
    this.data = data;
  }

  /**
   * This will be removed in the next major (v4)
   *
   * @deprecated use `error.data` instead
   */
  get content() {
    return this.data;
  }
}

export default HttpApi;
