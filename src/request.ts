import { EventEmitter } from 'events';
import { Duplex, Readable, Writable } from 'stream';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import createHttpsProxyAgent from 'https-proxy-agent';
import {
  createHttpRequestHandlerStreams,
  executeWithTimeout,
  isRedirect,
  performRedirectRequest,
} from './request-helper';
import { HttpRequest, HttpRequestOptions } from './types';

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
async function startFetchRequest(
  request: HttpRequest,
  options: HttpRequestOptions,
  input: Readable | undefined,
  output: Writable,
  emitter: EventEmitter,
  counter: number = 0,
) {
  const { httpProxy, followRedirect } = options;
  const agent = httpProxy ? createHttpsProxyAgent(httpProxy) : undefined;
  const { url, body, ...rrequest } = request;
  const controller = new AbortController();
  let res;
  try {
    res = await executeWithTimeout(
      () =>
        fetch(url, {
          ...rrequest,
          ...(input && /^(post|put|patch)$/i.test(request.method)
            ? { body: input }
            : {}),
          redirect: 'manual',
          signal: controller.signal,
          agent,
        }),
      options.timeout,
      () => controller.abort(),
    );
  } catch (err) {
    emitter.emit('error', err);
    return;
  }
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
  res.body.pipe(output);
}

/**
 *
 */
export default function request(
  req: HttpRequest,
  options_: HttpRequestOptions = {},
): Duplex {
  const options = { ...defaults, ...options_ };
  const { input, output, stream } = createHttpRequestHandlerStreams(
    req,
    options,
  );
  startFetchRequest(req, options, input, output, stream);
  return stream;
}
