/* @flow */
import type { Duplex } from 'stream';
import _request from 'request';
import jsonp from './browser/jsonp';
import canvas from './browser/canvas';

/**
 * Normarize Salesforce API host name
 * @private
 */
function normalizeApiHost(apiHost) {
  const m = /(\w+)\.(visual\.force|salesforce)\.com$/.exec(apiHost);
  if (m) {
    return `${m[1]}.salesforce.com`;
  }
  return apiHost;
}

// set options if defaults setting is available in request, which is not available in xhr module.
const request = _request.defaults ? (() => {
  const defaults: {
    followAllRedirects?: boolean,
    proxy?: string,
    timeout?: number,
  } = {
    followAllRedirects: true
  };
  if (process.env.HTTP_PROXY) {
    defaults.proxy = process.env.HTTP_PROXY;
  }
  const timeout = parseInt(process.env.HTTP_TIMEOUT, 10);
  if (timeout) {
    defaults.timeout = timeout;
  }
  return _request.defaults(defaults);
})() : _request;


const baseUrl =
  typeof window !== 'undefined' && window.location && window.location.host ?
    `https://${normalizeApiHost(window.location.host)}` :
    process.env.LOCATION_BASE_URL || '';


export type HttpRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  headers?: {[string]: string },
  body?: string
};

export type HttpResponse = {
  statusCode: number,
  headers: {[string]: string },
  body: string,
};

/* @private */
class HttpConnection {
  _params: HttpRequest;
  _streamFactory: HttpRequest => Duplex;
  _stream: ?Duplex;
  _response: ?Promise<HttpResponse>;

  constructor(params: HttpRequest, streamFactory: HttpRequest => Duplex) {
    this._params = params;
    this._streamFactory = streamFactory;
  }

  _invoke() {
    if (!this._stream || !this._response) {
      this._response = new Promise((resolve, reject) => {
        const stream = this._streamFactory(this._params);
        stream.on('complete', resolve);
        stream.on('error', reject);
        this._stream = stream;
      });
    }
    return this._response;
  }

  then<U>(
    onFulfill?: HttpResponse => Promise<U> | U,
    onReject?: any => Promise<U> | U
  ): Promise<U> {
    return this._invoke().then(onFulfill, onReject);
  }

  catch<U>(onReject?: any => Promise<U> | U): Promise<U> {
    return this.then(undefined, onReject);
  }

  stream(): Duplex {
    this._invoke();
    if (!this._stream) {
      throw new Error('creating http connection stream failed');
    }
    return this._stream;
  }
}


/**
 * Class for HTTP request transport
 *
 * @class
 * @protected
 */
export default class Transport {
  /**
   */
  httpRequest(params: HttpRequest) {
    return new HttpConnection(params, p => request(p, () => {}));
  }
}


/**
 * Class for JSONP request transport
 */
export class JsonpTransport extends Transport {
  static supprted: boolean = jsonp.supported;
  _jsonpParam: string;

  constructor(jsonpParam: string) {
    super();
    this._jsonpParam = jsonpParam;
  }

  httpRequest(params: HttpRequest) {
    return new HttpConnection(params, jsonp.createRequest(this._jsonpParam));
  }
}

/**
 * Class for Sfdc Canvas request transport
 */
export class CanvasTransport extends Transport {
  static supported: boolean = canvas.supported;
  _signedRequest: any;

  constructor(signedRequest: any) {
    super();
    this._signedRequest = signedRequest;
  }

  httpRequest(params: HttpRequest) {
    return new HttpConnection(params, canvas.createRequest(this._signedRequest));
  }
}


/**
 * Class for HTTP request transport using AJAX proxy service
 */
export class ProxyTransport extends Transport {
  _proxyUrl: string;

  constructor(proxyUrl: string) {
    super();
    this._proxyUrl = proxyUrl;
  }

  /**
   * Make HTTP request via AJAX proxy
   */
  httpRequest(params: HttpRequest) {
    let url = params.url;
    if (url.indexOf('/') === 0) {
      url = baseUrl + url;
    }
    const headers = { 'salesforceproxy-endpoint': url };
    if (params.headers) {
      for (const name of Object.keys(params.headers)) {
        headers[name] = params.headers[name];
      }
    }
    const nocache = `${Date.now()}.${String(Math.random()).substring(2)}`;
    const proxyParams: HttpRequest = {
      method: params.method,
      url: `${this._proxyUrl}?${nocache}`,
      headers,
    };
    if (params.body || params.body === '') {
      proxyParams.body = params.body;
    }
    return super.httpRequest(proxyParams);
  }
}

/**
 * Class for HTTP request transport using a proxy server
 */
export class HttpProxyTransport extends Transport {
  _httpProxy: string;

  constructor(httpProxy: string) {
    super();
    this._httpProxy = httpProxy;
  }

  /**
   * Make HTTP request via proxy server
   */
  httpRequest(params: HttpRequest) {
    const proxyParams = Object.assign({}, params, { proxy: this._httpProxy });
    return super.httpRequest(proxyParams);
  }
}
