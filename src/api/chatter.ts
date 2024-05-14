/**
 * @file Manages Salesforce Chatter REST API calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { registerModule } from '../jsforce';
import Connection from '../connection';
import { HttpRequest, Schema } from '../types';
import { isObject } from '../util/function';

/**
 *
 */
export type ChatterRequestParams = Omit<HttpRequest, 'body'> & {
  body?: string | object | null;
};

export type BatchRequestParams = {
  method: string;
  url: string;
  richInput?: any;
};

type BatchRequestTupple<S extends Schema, RT extends any[]> = {
  [K in keyof RT]: Request<S, RT[K]>;
};

type BatchResultTupple<RT extends any[]> = {
  [K in keyof RT]: {
    statusCode: number;
    result: RT[K];
  };
};

export type BatchResponse<RT extends any[]> = {
  hasErrors: boolean;
  results: BatchResultTupple<RT>;
};

/*--------------------------------------------*/
/**
 * A class representing chatter API request
 */
class Request<S extends Schema, R> {
  _chatter: Chatter<S>;
  _request: ChatterRequestParams;
  _promise: Promise<R> | undefined;

  constructor(chatter: Chatter<S>, request: ChatterRequestParams) {
    this._chatter = chatter;
    this._request = request;
  }

  /**
   * Retrieve parameters in batch request form
   */
  batchParams() {
    const { method, url, body } = this._request;
    return {
      method,
      url: this._chatter._normalizeUrl(url),
      ...(typeof body !== 'undefined' ? { richInput: body } : {}),
    };
  }

  /**
   * Retrieve parameters in batch request form
   *
   * @method Chatter~Request#promise
   * @returns {Promise.<Chatter~RequestResult>}
   */
  promise() {
    return (
      this._promise || (this._promise = this._chatter._request(this._request))
    );
  }

  /**
   * Returns Node.js Stream object for request
   *
   * @method Chatter~Request#stream
   * @returns {stream.Stream}
   */
  stream() {
    return this._chatter._request<R>(this._request).stream();
  }

  /**
   * Promise/A+ interface
   * http://promises-aplus.github.io/promises-spec/
   *
   * Delegate to deferred promise, return promise instance for batch result
   */
  then<U>(
    onResolve?: (value: R) => U | PromiseLike<U>,
    onReject?: (e: any) => U | PromiseLike<U>,
  ) {
    return this.promise().then(onResolve, onReject);
  }
}

function apppendQueryParamsToUrl(
  url: string,
  queryParams?: { [name: string]: string | number | boolean | null } | null,
) {
  if (queryParams) {
    const qstring = Object.keys(queryParams)
      .map(
        (name) =>
          `${name}=${encodeURIComponent(String(queryParams[name] ?? ''))}`,
      )
      .join('&');
    url += (url.indexOf('?') > 0 ? '&' : '?') + qstring;
  }
  return url;
}

/*------------------------------*/
export class Resource<S extends Schema, R> extends Request<S, R> {
  _url: string;

  /**
   *
   */
  constructor(
    chatter: Chatter<S>,
    url: string,
    queryParams?: { [name: string]: string | number | boolean | null } | null,
  ) {
    super(chatter, {
      method: 'GET',
      url: apppendQueryParamsToUrl(url, queryParams),
    });
    this._url = this._request.url;
  }

  /**
   * Create a new resource
   */
  create<R1 = any>(data: string | object | null) {
    return this._chatter.request<R1>({
      method: 'POST',
      url: this._url,
      body: data,
    });
  }

  /**
   * Retrieve resource content
   */
  retrieve<R1 = R>() {
    return this._chatter.request<R1>({
      method: 'GET',
      url: this._url,
    });
  }

  /**
   * Update specified resource
   */
  update<R1 = any>(data: object) {
    return this._chatter.request<R1>({
      method: 'POST',
      url: this._url,
      body: data,
    });
  }

  /**
   * Delete specified resource
   */
  destroy() {
    return this._chatter.request<void>({
      method: 'DELETE',
      url: this._url,
    });
  }

  /**
   * Synonym of Resource#destroy()
   */
  delete = this.destroy;

  /**
   * Synonym of Resource#destroy()
   */
  del = this.destroy;
}

/*------------------------------*/
/**
 * API class for Chatter REST API call
 */
export class Chatter<S extends Schema> {
  _conn: Connection<S>;

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * Sending request to API endpoint
   * @private
   */
  _request<R>(req_: ChatterRequestParams) {
    const { method, url: url_, headers: headers_, body: body_ } = req_;
    let headers = headers_ ?? {};
    let body;
    if (/^(put|post|patch)$/i.test(method)) {
      if (isObject(body_)) {
        headers = {
          ...headers_,
          'Content-Type': 'application/json',
        };
        body = JSON.stringify(body_);
      } else {
        body = body_;
      }
    }
    const url = this._normalizeUrl(url_);
    return this._conn.request<R>({
      method,
      url,
      headers,
      body,
    });
  }

  /**
   * Convert path to site root relative url
   * @private
   */
  _normalizeUrl(url: string) {
    if (url.startsWith('/chatter/') || url.startsWith('/connect/')) {
      return '/services/data/v' + this._conn.version + url;
    } else if (/^\/v[\d]+\.[\d]+\//.test(url)) {
      return '/services/data' + url;
    } else if (!url.startsWith('/services/') && url.startsWith('/')) {
      return '/services/data/v' + this._conn.version + '/chatter' + url;
    } else {
      return url;
    }
  }

  /**
   * Make a request for chatter API resource
   */
  request<R = unknown>(req: ChatterRequestParams) {
    return new Request<S, R>(this, req);
  }

  /**
   * Make a resource request to chatter API
   */
  resource<R = unknown>(
    url: string,
    queryParams?: { [name: string]: string | number | boolean | null } | null,
  ) {
    return new Resource<S, R>(this, url, queryParams);
  }

  /**
   * Make a batch request to chatter API
   */
  async batch<RT extends any[]>(
    requests: BatchRequestTupple<S, RT>,
  ): Promise<BatchResponse<RT>> {
    const deferreds = requests.map((request) => {
      const deferred = defer();
      request._promise = deferred.promise;
      return deferred;
    });
    const res = await this.request<BatchResponse<RT>>({
      method: 'POST',
      url: this._normalizeUrl('/connect/batch'),
      body: {
        batchRequests: requests.map((request) => request.batchParams()),
      },
    });
    res.results.forEach((result, i) => {
      const deferred = deferreds[i];
      if (result.statusCode >= 400) {
        deferred.reject(result.result);
      } else {
        deferred.resolve(result.result);
      }
    });
    return res;
  }
}

function defer<T>() {
  let resolve_: (r: T | PromiseLike<T>) => void = () => {};
  let reject_: (e: any) => void = () => {};
  const promise = new Promise<T>((resolve, reject) => {
    resolve_ = resolve;
    reject_ = reject;
  });
  return {
    promise,
    resolve: resolve_,
    reject: reject_,
  };
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('chatter', (conn) => new Chatter(conn));

export default Chatter;
