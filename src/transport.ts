/**
 *
 */
import { Duplex } from 'stream';
import request, { setDefaults } from './request';
import { HttpRequest, HttpRequestOptions, HttpResponse } from './types';
import { StreamPromise } from './util/promise';
import { isRedirect } from './request-helper';
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
 * The location of a redirect that the proxy reported in headers
 * @private
 */
function getReportedRedirectLocation(res: HttpResponse): string | undefined {
  const status = Number(res.headers['salesforceproxy-redirect-status']);
  const location = res.headers['salesforceproxy-redirect-location'];
  return res.statusCode === 200 && isRedirect(status) ? location : undefined;
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
  httpRequest(
    req: HttpRequest,
    options: HttpRequestOptions = {},
  ): StreamPromise<HttpResponse> {
    const xdProxyUrl = this._xdProxyUrl;
    const { url, body, ...rreq } = req;
    const canonicalUrl = url.startsWith('/') ? baseUrl + url : url;
    const { followRedirect } = options;
    // browsers cannot read a redirect response, so with a followRedirect function,
    // the proxy is asked to report it in headers, and the reported redirect is followed here
    const reportRedirect = typeof followRedirect === 'function';
    const send = (proxiedReq: HttpRequest) =>
      super.httpRequest(
        createXdProxyRequest(proxiedReq, xdProxyUrl, reportRedirect),
        {
          ...options,
          followRedirect:
            followRedirect === false
              ? false
              : async (redirectUrl) => {
                  const redirectReq =
                    typeof followRedirect === 'function'
                      ? await followRedirect(redirectUrl)
                      : { ...rreq, method: 'GET' as const, url: redirectUrl };
                  return redirectReq
                    ? createXdProxyRequest(redirectReq, xdProxyUrl, reportRedirect)
                    : null;
                },
        },
      );
    const first = send({ ...rreq, url: canonicalUrl, body });
    if (typeof followRedirect !== 'function') {
      return first;
    }
    const promise = first.then(async (res) => {
      const location = getReportedRedirectLocation(res);
      if (!location) {
        return res;
      }
      const redirectReq = await followRedirect(location);
      if (!redirectReq) {
        throw new Error('Cannot handle redirect for ' + location);
      }
      return this.httpRequest(redirectReq, options);
    });
    return StreamPromise.create(() => ({ stream: first.stream(), promise }));
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
