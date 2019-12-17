/**
 * @file Manages method call to SOAP endpoint
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import HttpApi from './http-api';
import Connection from './connection';
import { Schema, HttpResponse, HttpRequest } from './types';
import { isObject } from './util/function';

/**
 *
 */
function isMapObject(o: unknown): o is { [name: string]: unknown } {
  return isObject(o);
}

/**
 *
 */
function convertType(
  value: unknown,
  schema?: unknown,
): object | string | number | boolean | null {
  if (Array.isArray(value)) {
    return value.map((v) => convertType(v, schema && (schema as object[])[0]));
  } else if (isMapObject(value)) {
    if (isMapObject(value.$) && value.$['xsi:nil'] === 'true') {
      return null;
    } else if (Array.isArray(schema)) {
      return [convertType(value, schema[0])];
    } else {
      const o: { [key: string]: any } = {};
      for (const key of Object.keys(value)) {
        o[key] = convertType(
          value[key],
          schema && (schema as { [key: string]: any })[key],
        );
      }
      return o;
    }
  } else {
    if (Array.isArray(schema)) {
      return [convertType(value, schema[0])];
    } else if (isObject(schema)) {
      return {};
    } else {
      switch (schema) {
        case 'string':
          return String(value);
        case 'number':
          return Number(value);
        case 'boolean':
          return value === 'true';
        default:
          return value as any;
      }
    }
  }
}

/**
 * @private
 */
function lookupValue(obj: unknown, propRegExps: RegExp[]): unknown {
  const regexp = propRegExps.shift();
  if (!regexp) {
    return obj;
  }
  if (isMapObject(obj)) {
    for (const prop of Object.keys(obj)) {
      if (regexp.test(prop)) {
        return lookupValue(obj[prop], propRegExps);
      }
    }
    return null;
  }
}

/**
 * @private
 */
function toXML(name: object | string | null, value?: any): string {
  if (isObject(name)) {
    value = name;
    name = null;
  }
  if (Array.isArray(value)) {
    return value.map((v) => toXML(name, v)).join('');
  } else {
    const attrs = [];
    const elems = [];
    if (isMapObject(value)) {
      for (const k of Object.keys(value)) {
        const v = value[k];
        if (k[0] === '@') {
          const kk = k.substring(1);
          attrs.push(kk + '="' + v + '"');
        } else {
          elems.push(toXML(k, v));
        }
      }
      value = elems.join('');
    } else {
      value = String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
    const startTag = name
      ? '<' + name + (attrs.length > 0 ? ' ' + attrs.join(' ') : '') + '>'
      : '';
    const endTag = name ? '</' + name + '>' : '';
    return startTag + value + endTag;
  }
}

/**
 *
 */
export type SOAPOptions = {
  endpointUrl: string;
  xmlns?: string;
};

/**
 * Class for SOAP endpoint of Salesforce
 *
 * @protected
 * @class
 * @constructor
 * @param {Connection} conn - Connection instance
 * @param {Object} options - SOAP endpoint setting options
 * @param {String} options.endpointUrl - SOAP endpoint URL
 * @param {String} [options.xmlns] - XML namespace for method call (default is "urn:partner.soap.sforce.com")
 */
export default class SOAP<S extends Schema> extends HttpApi<S> {
  _endpointUrl: string;
  _xmlns: string;

  constructor(conn: Connection<S>, options: SOAPOptions) {
    super(conn, options);
    this._endpointUrl = options.endpointUrl;
    this._xmlns = options.xmlns || 'urn:partner.soap.sforce.com';
  }

  /**
   * Invoke SOAP call using method and arguments
   */
  async invoke(method: string, args: object, schema?: object) {
    const res = await this.request({
      method: 'POST',
      url: this._endpointUrl,
      headers: {
        'Content-Type': 'text/xml',
        SOAPAction: '""',
      },
      _message: { [method]: args },
    } as HttpRequest);
    return schema ? convertType(res, schema) : res;
  }

  /** @override */
  beforeSend(request: HttpRequest & { _message: object }) {
    return {
      ...request,
      body: this._createEnvelope(request._message),
    };
  }

  /** @override **/
  isSessionExpired(response: HttpResponse) {
    return (
      response.statusCode === 500 &&
      /<faultcode>[a-zA-Z]+:INVALID_SESSION_ID<\/faultcode>/.test(response.body)
    );
  }

  /** @override **/
  parseError(body: string) {
    const error = lookupValue(body, [/:Envelope$/, /:Body$/, /:Fault$/]) as {
      [name: string]: string | undefined;
    };
    return {
      errorCode: error.faultcode,
      message: error.faultstring,
    };
  }

  /** @override **/
  getResponseBody(response: HttpResponse) {
    const body = super.getResponseBody(response);
    return lookupValue(body, [/:Envelope$/, /:Body$/, /.+/]);
  }

  /**
   * @private
   */
  _createEnvelope(message: object) {
    const header: { [name: string]: any } = {};
    const conn = this._conn;
    if (conn.accessToken) {
      header.SessionHeader = { sessionId: conn.accessToken };
    }
    if (conn._callOptions) {
      header.CallOptions = conn._callOptions;
    }
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"',
      ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"',
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">',
      '<soapenv:Header xmlns="' + this._xmlns + '">',
      toXML(header),
      '</soapenv:Header>',
      '<soapenv:Body xmlns="' + this._xmlns + '">',
      toXML(message),
      '</soapenv:Body>',
      '</soapenv:Envelope>',
    ].join('');
  }
}
