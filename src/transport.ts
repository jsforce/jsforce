/**
 *
 */
import { Duplex } from 'stream';
import request, { setDefaults } from './request';
import { HttpRequest, HttpRequestOptions, HttpResponse } from './types';
import { StreamPromise } from './util/promise';
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

setDefaults({
  httpProxy: process.env.https_proxy ?? process.env.http_proxy ?? process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY ?? undefined,
  timeout: process.env.HTTP_TIMEOUT
    ? parseInt(process.env.HTTP_TIMEOUT, 10)
    : undefined,
  followRedirect: true,
});

const baseUrl =
  typeof window !== 'undefined' && window.location && window.location.host
    ? `https://${normalizeApiHost(window.location.host)}`
    : process.env.LOCATION_BASE_URL || '';

/**
 * Class for HTTP request transport
 *
 * @class
 * @protected
 */
export class Transport {
  /**
   */
  httpRequest(
    req: HttpRequest,
    options: HttpRequestOptions = {},
  ): StreamPromise<HttpResponse> {
    return StreamPromise.create(() => {
      const createStream = this.getRequestStreamCreator();
      const stream = createStream(req, options);
      const promise = new Promise<HttpResponse>((resolve, reject) => {
        stream
          .on('complete', (res: HttpResponse) => resolve(res))
          .on('error', reject);
      });
      return { stream, promise };
    });
  }

  /**
   * @protected
   */
  getRequestStreamCreator(): (
    req: HttpRequest,
    options: HttpRequestOptions,
  ) => Duplex {
    return request;
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

  getRequestStreamCreator(): (
    req: HttpRequest,
    options: HttpRequestOptions,
  ) => Duplex {
    const jsonpRequest = jsonp.createRequest(this._jsonpParam);
    return (params) => jsonpRequest(params);
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

  getRequestStreamCreator(): (
    req: HttpRequest,
    options: HttpRequestOptions,
  ) => Duplex {
    const canvasRequest = canvas.createRequest(this._signedRequest);
    return (params) => canvasRequest(params);
  }
}

/* @private */
function createXdProxyRequest(
  req: HttpRequest,
  proxyUrl: string,
  reportRedirect: boolean = false,
): HttpRequest {
  const headers: { [name: string]: string } = {
    'salesforceproxy-endpoint': req.url,
  };
  if (req.headers) {
    for (const name of Object.keys(req.headers)) {
      headers[name] = req.headers[name];
    }
  }
  if (reportRedirect) {
    // browsers cannot read a redirect response, so the proxy reports it in headers
    headers['salesforceproxy-redirect'] = 'report';
  }
  const nocache = `${Date.now()}.${String(Math.random()).substring(2)}`;
  return {
    method: req.method,
    url: `${proxyUrl}?${nocache}`,
    headers,
    ...(req.body != null ? { body: req.body } : {}),
  };
}

/**
 * Class for HTTP request transport using cross-domain AJAX proxy service
 */
export class XdProxyTransport extends Transport {
  _xdProxyUrl: string;

  constructor(xdProxyUrl: string) {
    super();
    this._xdProxyUrl = xdProxyUrl;
  }

  /**
   * Make HTTP request via AJAX proxy
   */
  httpRequest(req: HttpRequest, options: HttpRequestOptions = {}) {
    const xdProxyUrl = this._xdProxyUrl;
    const { url, body, ...rreq } = req;
    const canonicalUrl = url.startsWith('/') ? baseUrl + url : url;
    const reportRedirect = typeof options.followRedirect === 'function';
    const xdProxyReq = createXdProxyRequest(
      { ...rreq, url: canonicalUrl, body },
      xdProxyUrl,
      reportRedirect,
    );
    return super.httpRequest(xdProxyReq, {
      ...options,
      followRedirect:
        options.followRedirect === false
          ? false
          : async (redirectUrl) => {
              const { followRedirect } = options;
              const redirectReq =
                typeof followRedirect === 'function'
                  ? await followRedirect(redirectUrl)
                  : { ...rreq, method: 'GET' as const, url: redirectUrl };
              return redirectReq
                ? createXdProxyRequest(redirectReq, xdProxyUrl, reportRedirect)
                : null;
            },
    });
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
  httpRequest(req: HttpRequest, options_: HttpRequestOptions = {}) {
    const options = { ...options_, httpProxy: this._httpProxy };
    return super.httpRequest(req, options);
  }
}

export default Transport;
