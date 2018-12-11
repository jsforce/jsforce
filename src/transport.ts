/**
 * 
 */
import { Duplex } from 'stream';
import _request from 'request';
import { HttpRequest, HttpResponse } from './types';
import { StreamPromise, StreamPromiseBuilder } from './util/promise';
import jsonp from './browser/jsonp';
import canvas from './browser/canvas';

/**
 * Normarize Salesforce API host name
 * @private
 */
function normalizeApiHost(apiHost: string) {
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
  const timeout = parseInt(process.env.HTTP_TIMEOUT || '0', 10);
  if (timeout) {
    defaults.timeout = timeout;
  }
  return _request.defaults(defaults);
})() : _request;


const baseUrl =
  typeof window !== 'undefined' && window.location && window.location.host ?
    `https://${normalizeApiHost(window.location.host)}` :
    process.env.LOCATION_BASE_URL || '';


/**
 * Class for HTTP request transport
 *
 * @class
 * @protected
 */
export default class Transport {
  /**
   */
  httpRequest(params: HttpRequest): StreamPromise<HttpResponse> {
    const streamBuilder: StreamPromiseBuilder<HttpResponse> = async (setStream) => {
      const createStream = this.getRequestStreamCreator();
      const stream = createStream(params);
      setStream(stream);
      return new Promise<HttpResponse>((resolve, reject) => {
        stream.on('complete', (res: HttpResponse) => resolve(res)).on('error', reject);
      });
    };
    return StreamPromise.create(streamBuilder);
  }

  /**
   * @protected
   */
  getRequestStreamCreator(): (req: HttpRequest) => Duplex {
    return params => (request(params, () => {}) as any) as Duplex;
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

  getRequestStreamCreator(): (req: HttpRequest) => Duplex {
    const jsonpRequest = jsonp.createRequest(this._jsonpParam);
    return params => jsonpRequest(params);
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

  getRequestStreamCreator(): (req: HttpRequest) => Duplex {
    const canvasRequest = canvas.createRequest(this._signedRequest);
    return params => canvasRequest(params);
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
    const headers: { [name: string]: string } = { 'salesforceproxy-endpoint': url };
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
