import { EventEmitter } from 'events';
import { Readable, Writable } from 'stream';
import {
  createHttpRequestHandlerStreams,
  isRedirect,
  performRedirectRequest,
} from '../request-helper';
import { readAll } from '../util/stream';
import { HttpRequest, HttpRequestOptions } from '../types';

/**
 *
 */
const supportsReadableStream = (() => {
  try {
    if (
      typeof Request !== 'undefined' &&
      typeof ReadableStream !== 'undefined'
    ) {
      return !new Request('', {
        body: new ReadableStream(),
        method: 'POST',
      }).headers.has('Content-Type');
    }
  } catch (e) {
    return false;
  }
  return false;
})();

/**
 *
 */
function toWhatwgReadableStream(ins: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      ins.on('data', (chunk) => controller.enqueue(chunk));
      ins.on('end', () => controller.close());
    },
  });
}

/**
 *
 */
async function readWhatwgReadableStream(rs: ReadableStream, outs: Writable) {
  const reader = rs.getReader();
  async function readAndWrite() {
    const { done, value } = await reader.read();
    if (done) {
      outs.end();
      return false;
    }
    outs.write(value);
    return true;
  }
  while (await readAndWrite());
}

/**
 *
 */
async function startFetchRequest(
  request: HttpRequest,
  options: HttpRequestOptions,
  input: Readable | undefined,
  output: Writable,
  emitter: EventEmitter,
  counter: number = 0,
) {
  const { followRedirect } = options;
  const { url, body: reqBody, ...rreq } = request;
  const body =
    input && /^(post|put|patch)$/i.test(request.method)
      ? supportsReadableStream
        ? toWhatwgReadableStream(input)
        : await readAll(input)
      : undefined;
  const res = await fetch(url, {
    ...rreq,
    ...(body ? { body } : {}),
    redirect: 'manual',
    ...({ allowHTTP1ForStreamingUpload: true } as any), // Chrome allows request stream only in HTTP2/QUIC unless this opt-in flag
  });
  const headers: { [key: string]: any } = {};
  for (const headerName of res.headers.keys()) {
    headers[headerName.toLowerCase()] = res.headers.get(headerName);
  }
  const response = {
    statusCode: res.status,
    headers,
  };
  if (followRedirect && isRedirect(response.statusCode)) {
    try {
      performRedirectRequest(
        request,
        response,
        followRedirect,
        counter,
        (req) =>
          startFetchRequest(
            req,
            options,
            undefined,
            output,
            emitter,
            counter + 1,
          ),
      );
    } catch (err) {
      emitter.emit('error', err);
    }
    return;
  }
  emitter.emit('response', response);
  if (res.body) {
    readWhatwgReadableStream(res.body, output);
  } else {
    output.end();
  }
}

/**
 *
 */
function getResponseHeaderNames(xhr: XMLHttpRequest) {
  const headerLines = (xhr.getAllResponseHeaders() || '').split(/[\r\n]+/);
  return headerLines.map((headerLine) =>
    headerLine.split(/\s*:/)[0].toLowerCase(),
  );
}

/**
 *
 */
async function startXmlHttpRequest(
  request: HttpRequest,
  options: HttpRequestOptions,
  input: Readable | undefined,
  output: Writable,
  emitter: EventEmitter,
  counter: number = 0,
) {
  const { method, url, headers } = request;
  const { followRedirect } = options;
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  if (headers) {
    for (const header in request.headers) {
      xhr.setRequestHeader(header, request.headers[header]);
    }
  }
  const body =
    input && /^(post|put|patch)$/.test(method) ? await readAll(input) : null;
  xhr.send(body);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const headerNames = getResponseHeaderNames(xhr);
      const headers = headerNames.reduce(
        (headers, headerName) => ({
          ...headers,
          [headerName]: xhr.getResponseHeader(headerName) || '',
        }),
        {} as { [name: string]: string },
      );
      const response = {
        statusCode: xhr.status,
        headers: headers,
      };
      if (followRedirect && isRedirect(response.statusCode)) {
        try {
          performRedirectRequest(
            request,
            response,
            followRedirect,
            counter,
            (req) =>
              startXmlHttpRequest(
                req,
                options,
                undefined,
                output,
                emitter,
                counter + 1,
              ),
          );
        } catch (err) {
          emitter.emit('error', err);
        }
        return;
      }
      let body = xhr.response;
      if (!response.statusCode) {
        response.statusCode = 400;
        body = 'Access Declined';
      }
      emitter.emit('response', response);
      output.write(body);
      output.end();
    }
  };
}

/**
 *
 */
let defaults: HttpRequestOptions = {};

/**
 *
 */
export function setDefaults(defaults_: HttpRequestOptions) {
  defaults = defaults_;
}

/**
 *
 */
export default function request(
  req: HttpRequest,
  options_: HttpRequestOptions = {},
) {
  const options = { ...defaults, ...options_ };
  const { input, output, stream } = createHttpRequestHandlerStreams(req);
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    startFetchRequest(req, options, input, output, stream);
  } else {
    startXmlHttpRequest(req, options, input, output, stream);
  }
  return stream;
}
