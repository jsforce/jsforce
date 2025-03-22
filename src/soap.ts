/**
 * @file Manages method call to SOAP endpoint
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import HttpApi from './http-api';
import Connection from './connection';
import {
  Schema,
  HttpResponse,
  HttpRequest,
  SoapSchema,
  SoapSchemaDef,
} from './types';
import { isMapObject, isObject } from './util/function';
import { getBodySize } from './util/get-body-size';

/**
 *
 */
function getPropsSchema(
  schema: SoapSchemaDef,
  schemaDict: { [name: string]: SoapSchemaDef },
): SoapSchemaDef['props'] {
  if (schema.extends && schemaDict[schema.extends]) {
    const extendSchema = schemaDict[schema.extends];
    return {
      ...getPropsSchema(extendSchema, schemaDict),
      ...schema.props,
    };
  }
  return schema.props;
}

function isNillValue(value: unknown) {
  return (
    value == null ||
    (isMapObject(value) &&
      isMapObject(value.$) &&
      value.$['xsi:nil'] === 'true')
  );
}

/**
 *
 */
export function castTypeUsingSchema(
  value: unknown,
  schema?: SoapSchema | SoapSchemaDef,
  schemaDict: { [name: string]: SoapSchemaDef } = {},
): any {
  if (Array.isArray(schema)) {
    const nillable = schema.length === 2 && schema[0] === '?';
    const schema_ = nillable ? schema[1] : schema[0];
    if (value == null) {
      return nillable ? null : [];
    }
    return (Array.isArray(value) ? value : [value]).map((v) =>
      castTypeUsingSchema(v, schema_, schemaDict),
    );
  } else if (isMapObject(schema)) {
    // if schema is Schema Definition, not schema element
    if ('type' in schema && 'props' in schema && isMapObject(schema.props)) {
      const props = getPropsSchema(schema as SoapSchemaDef, schemaDict);
      return castTypeUsingSchema(value, props, schemaDict);
    }
    const nillable = '?' in schema;
    const schema_ =
      '?' in schema ? (schema['?'] as { [key: string]: any }) : schema;
    if (nillable && isNillValue(value)) {
      return null;
    }
    const obj = isMapObject(value) ? value : {};
    return Object.keys(schema_).reduce((o, k) => {
      const s = schema_[k];
      const v = obj[k];
      const nillable =
        (Array.isArray(s) && s.length === 2 && s[0] === '?') ||
        (isMapObject(s) && '?' in s) ||
        (typeof s === 'string' && s.startsWith('?'));
      if (typeof v === 'undefined' && nillable) {
        return o;
      }
      return {
        ...o,
        [k]: castTypeUsingSchema(v, s, schemaDict),
      };
    }, obj);
  } else {
    const nillable = typeof schema === 'string' && schema.startsWith('?');
    const type =
      typeof schema === 'string'
        ? nillable
          ? schema.substring(1)
          : schema
        : 'any';
    switch (type) {
      case 'string':
        return isNillValue(value) ? (nillable ? null : '') : String(value);
      case 'number':
        return isNillValue(value) ? (nillable ? null : 0) : Number(value);
      case 'boolean':
        return isNillValue(value)
          ? nillable
            ? null
            : false
          : value === 'true';
      case 'null':
        return null;
      default: {
        if (schemaDict[type]) {
          const cvalue = castTypeUsingSchema(
            value,
            schemaDict[type],
            schemaDict,
          );
          const isEmpty =
            isMapObject(cvalue) && Object.keys(cvalue).length === 0;
          return isEmpty && nillable ? null : cvalue;
        }
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
    if (value === null) {
      attrs.push('xsi:nil="true"');
      value = '';
    } else if (isMapObject(value)) {
      const elems = [];
      for (const k of Object.keys(value)) {
        const v = value[k];
        if (k.startsWith('@')) {
          const kk = k.substring(1);
          attrs.push(`${kk}="${v as string}"`);
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
export class SOAP<S extends Schema> extends HttpApi<S> {
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
  async invoke(
    method: string,
    args: object,
    schema?: SoapSchema | SoapSchemaDef,
    schemaDict?: { [name: string]: SoapSchemaDef },
  ) {
    const res = await this.request({
      method: 'POST',
      url: this._endpointUrl,
      headers: {
        'Content-Type': 'text/xml',
        SOAPAction: '""',
      },
      _message: { [method]: args },
    } as HttpRequest);
    return schema ? castTypeUsingSchema(res, schema, schemaDict) : res;
  }

  /** @override */
  beforeSend(request: HttpRequest & { _message: object }) {
    request.body = this._createEnvelope(request._message);

    const headers = request.headers || {};

    const bodySize = getBodySize(request.body, request.headers);

    if (
      request.method === 'POST' &&
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

export default SOAP;
