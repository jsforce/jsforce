/**
 * @file Manages method call to SOAP endpoint
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import HttpApi from './http-api';
import Connection from './connection';
import { Schema, HttpResponse, HttpRequest, SoapSchemaDef } from './types';
import { isMapObject, isObject } from './util/function';

/**
 *
 */
export function convertTypeUsingSchema(
  value: unknown,
  schema?: SoapSchemaDef,
): any {
  if (Array.isArray(schema)) {
    const nillable = schema.length === 2 && schema[0] === '?';
    const schema_ = nillable ? schema[1] : schema[0];
    if (value == null) {
      return nillable ? null : [];
    }
    return (Array.isArray(value) ? value : [value]).map((v) =>
      convertTypeUsingSchema(v, schema_),
    );
  } else if (isMapObject(schema)) {
    const nillable = '?' in schema;
    const schema_ =
      '?' in schema ? (schema['?'] as { [key: string]: any }) : schema;
    if (
      nillable &&
      (value == null ||
        (isMapObject(value) &&
          isMapObject(value.$) &&
          value.$['xsi:nil'] === 'true'))
    ) {
      return null;
    }
    const obj = isMapObject(value) ? value : {};
    return Object.keys(schema_).reduce(
      (o, k) => ({
        ...o,
        [k]: convertTypeUsingSchema(obj[k], schema_[k]),
      }),
      obj,
    );
  } else {
    const nillable = typeof schema === 'string' && schema[0] === '?';
    switch (schema) {
      case 'string':
      case '?string':
        return value != null ? String(value) : nillable ? null : '';
      case 'number':
      case '?number':
        return value != null ? Number(value) : nillable ? null : 0;
      case 'boolean':
      case '?boolean':
        return value != null ? value === 'true' : nillable ? null : false;
      default:
        return value as any;
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
  async invoke(method: string, args: object, schema?: SoapSchemaDef) {
    const res = await this.request({
      method: 'POST',
      url: this._endpointUrl,
      headers: {
        'Content-Type': 'text/xml',
        SOAPAction: '""',
      },
      _message: { [method]: args },
    } as HttpRequest);
    return schema ? convertTypeUsingSchema(res, schema) : res;
  }

  /** @override */
  beforeSend(request: HttpRequest & { _message: object }) {
    const body = this._createEnvelope(request._message);
    delete request._message;
    request.body = body;
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
  async getResponseBody(response: HttpResponse) {
    const body = await super.getResponseBody(response);
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
