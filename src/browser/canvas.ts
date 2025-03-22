/**
 *
 */
import { Transform } from 'stream';
import { HttpRequest, SignedRequestObject } from '../types';

declare let Sfdc: any;

type CanvasResponse = {
  status: string;
  responseHeaders: string;
  payload: any;
};

function parseHeaders(hs: string) {
  const headers: HttpRequest['headers'] = {};
  for (const line of hs.split(/\n/)) {
    const [name, value] = line.split(/\s*:\s*/);
    headers[name.toLowerCase()] = value;
  }
  return headers;
}

async function processCanvasRequest(
  params: HttpRequest,
  signedRequest: SignedRequestObject,
  requestBody: string,
) {
  const settings: any = {
    client: signedRequest.client,
    method: params.method,
    data: requestBody,
  };
  const paramHeaders = params.headers;
  if (paramHeaders) {
    settings.headers = {};
    for (const name of Object.keys(paramHeaders)) {
      if (name.toLowerCase() === 'content-type') {
        settings.contentType = paramHeaders[name];
      } else {
        settings.headers[name] = paramHeaders[name];
      }
    }
  }
  const data = await new Promise<CanvasResponse>((resolve, reject) => {
    settings.success = resolve;
    settings.failure = reject;
    Sfdc.canvas.client.ajax(params.url, settings);
  });
  const headers = parseHeaders(data.responseHeaders);
  let responseBody = data.payload;
  if (typeof responseBody !== 'string') {
    responseBody = JSON.stringify(responseBody);
  }
  return {
    statusCode: data.status,
    headers,
    body: responseBody as string,
  };
}

function createRequest(signedRequest: SignedRequestObject) {
  return (params: HttpRequest) => {
    const buf: string[] = [];
    const stream = new Transform({
      transform(chunk, encoding, callback) {
        buf.push(typeof chunk === 'string' ? chunk : chunk.toString('utf8'));
        callback();
      },
      flush() {
        (async () => {
          const body = buf.join('');
          const response = await processCanvasRequest(
            params,
            signedRequest,
            body,
          );
          stream.emit('response', response);
          stream.emit('complete', response);
          stream.push(response.body);
          stream.push(null);
        })();
      },
    });
    if (params.body) {
      stream.end(params.body);
    }
    return stream;
  };
}

export default {
  supported: typeof Sfdc === 'object' && typeof Sfdc.canvas !== 'undefined',
  createRequest,
};
