import { Duplex } from 'stream';
import { HttpRequest, HttpResponse } from '../types';

/**
 *
 */
export default function request(
  params: HttpRequest,
  callback: (
    err: Error | null | undefined,
    response: HttpResponse,
    body: string,
  ) => any,
) {
  const xhr = new XMLHttpRequest();
  xhr.open(params.method, params.url);
  if (params.headers) {
    for (const header in params.headers) {
      xhr.setRequestHeader(header, params.headers[header]);
    }
  }
  xhr.setRequestHeader('Accept', '*/*');
  let response: HttpResponse;
  const str = new Duplex();
  str._read = (_size) => {
    if (response) {
      str.push(response.body);
    }
  };
  const bufs: any[] = [];
  var sent = false;
  str._write = (chunk, encoding, callback) => {
    bufs.push(chunk.toString(encoding === 'buffer' ? 'binary' : encoding));
    callback();
  };
  str.on('finish', () => {
    if (!sent) {
      xhr.send(bufs.join(''));
      sent = true;
    }
  });
  if (
    params.body ||
    params.body === '' ||
    !/^(put|post|patch)$/i.test(params.method)
  ) {
    xhr.send(params.body);
    sent = true;
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const headerNames = getResponseHeaderNames(xhr);
      const headers = headerNames.reduce(
        (headers, headerName) => ({
          ...headers,
          [headerName]: xhr.getResponseHeader(headerName) || '',
        }),
        {} as { [name: string]: string },
      );
      response = {
        statusCode: xhr.status,
        headers: headers,
        body: xhr.response,
      };
      if (!response.statusCode) {
        response.statusCode = 400;
        response.body = 'Access Declined';
      }
      if (callback) {
        callback(null, response, response.body);
      }
      str.emit('response', response);
      str.emit('complete', response);
      str.end();
    }
  };
  return str;
}

function getResponseHeaderNames(xhr: XMLHttpRequest) {
  const headerLines = (xhr.getAllResponseHeaders() || '').split(/[\r\n]+/);
  return headerLines.map((headerLine) =>
    headerLine.split(/\s*:/)[0].toLowerCase(),
  );
}
