import { EventEmitter } from 'events';
import { Readable, Writable } from 'stream';
import {
  createHttpRequestHandlerStreams,
  executeWithTimeout,
  isRedirect,
  performRedirectRequest,
} from '../request-helper';
import { readAll } from '../util/stream';
import { HttpRequest, HttpRequestOptions } from '../types';

/**
 * As the request streming is not yet supported on major browsers,
 * it is set to false for now.
 */
const supportsReadableStream = false;

/*
(async () => {
  try {
    if (
      typeof fetch === 'function' &&
      typeof Request === 'function' &&
      typeof ReadableStream === 'function'
    ) {
      // this feature detection requires dummy POST request
      const req = new Request('data:text/plain,', {
        method: 'POST',
        body: new ReadableStream(),
      });
      // if it has content-type header it doesn't regard body as stream
      if (req.headers.has('Content-Type')) {
        return false;
      }
      await (await fetch(req)).text();
      return true;
    }
  } catch (e) {
    // error might occur in env with CSP without connect-src data:
    return false;
  }
  return false;
})();
*/

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
  const controller =
    typeof AbortController !== 'undefined' ? new AbortController() : undefined;
  const res = await executeWithTimeout(
    () =>
      fetch(url, {
        ...rreq,
        ...(body ? { body } : {}),
        redirect: 'manual',
        ...(controller ? { signal: controller.signal } : {}),
        ...({ allowHTTP1ForStreamingUpload: true } as any), // Chrome allows request stream only in HTTP2/QUIC unless this opt-in flag
      }),
    options.timeout,
    () => controller?.abort(),
  );
  const headers: { [key: string]: any } = {};
  // @ts-expect-error no .keys()?
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
  const { input, output, stream } = createHttpRequestHandlerStreams(
    req,
    options,
  );
  startFetchRequest(req, options, input, output, stream);
  return stream;
}
