/**
 * @file Manages Salesforce Apex REST endpoint calls
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import jsforce from '../core';
import Connection from '../connection';
import { HttpRequest, HttpMethods } from '../types';

/**
 * API class for Apex REST endpoint call
 */
export default class Apex {
  _conn: Connection;

  /**
   *
   */
  constructor(conn: Connection) {
    this._conn = conn;
  }

  /* @private */
  _baseUrl() {
    return `${this._conn.instanceUrl}/services/apexrest`;
  }

  /**
   * @private
   */
  _createRequestParams(
    method: HttpMethods,
    path: string,
    body?: Object,
    options: { headers?: HttpRequest['headers'] } = {}
  ): HttpRequest {
    const headers: HttpRequest['headers'] = typeof options.headers === 'object' ? options.headers : {};
    if (!/^(GET|DELETE)$/i.test(method)) {
      headers['content-type'] = 'application/json';
    }
    const params: HttpRequest = {
      method,
      url: this._baseUrl() + path,
      headers,
    };
    if (body) {
      params.body = JSON.stringify(body);
    }
    return params;
  }

  /**
   * Call Apex REST service in GET request
   */
  get(path: string, options?: Object) {
    return this._conn.request(this._createRequestParams('GET', path, undefined, options));
  }

  /**
   * Call Apex REST service in POST request
   */
  post(path: string, body?: Object, options?: Object) {
    const params = this._createRequestParams('POST', path, body, options);
    return this._conn.request(params);
  }

  /**
   * Call Apex REST service in PUT request
   */
  put(path: string, body?: Object, options?: Object) {
    const params = this._createRequestParams('PUT', path, body, options);
    return this._conn.request(params);
  }

  /**
   * Call Apex REST service in PATCH request
   */
  patch(path: string, body?: Object, options?: Object) {
    const params = this._createRequestParams('PATCH', path, body, options);
    return this._conn.request(params);
  }

  /**
   * Call Apex REST service in DELETE request
   */
  delete(path: string, options?: Object) {
    return this._conn.request(this._createRequestParams('DELETE', path, undefined, options));
  }

  /**
   * Synonym of Apex#delete()
   */
  del = this.delete;
}


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', (conn) => {
  conn.apex = new Apex(conn); // eslint-disable-line no-param-reassign
});
