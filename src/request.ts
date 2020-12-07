import EventEmitter from 'events';
import { Duplex, Readable, Writable } from 'stream';
import fetch from 'node-fetch';
import createHttpsProxyAgent from 'https-proxy-agent';
import { createHttpRequestHandlerStreams } from './request-helper';
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
const MAX_REDIRECT_COUNT = 10;

/**
 *
 */
async function startFetch(
  req: HttpRequest,
  options: HttpRequestOptions,
  input: Readable | undefined,
  output: Writable,
  emitter: EventEmitter,
  fetchCount: number = 0,
) {
  const { httpProxy, followRedirect } = options;
  const { url, body, ...rreq } = req;
  const agent = httpProxy ? createHttpsProxyAgent(httpProxy) : undefined;
  const res = await fetch(url, {
    ...rreq,
    ...(input && /^(post|put|patch)$/i.test(req.method) ? { body: input } : {}),
    redirect: 'manual',
    agent,
  });
  if (followRedirect && fetch.isRedirect(res.status)) {
    if (fetchCount >= MAX_REDIRECT_COUNT) {
      emitter.emit('error', new Error('Reached to maximum redirect count'));
      return;
    }
    const redirectUrl = res.headers.get('Location');
    if (!redirectUrl) {
      emitter.emit('error', new Error('No redirect URI found'));
      return;
    }
    const getRedirectRequest =
      typeof followRedirect === 'function'
        ? followRedirect
        : () => ({
            ...rreq,
            method: 'GET' as const,
            url: redirectUrl,
          });
    const nextReqParams = getRedirectRequest(redirectUrl);
    if (!nextReqParams) {
      emitter.emit(
        'error',
        new Error('Cannot handle redirect for ' + redirectUrl),
      );
      return;
    }
    startFetch(
      nextReqParams,
      options,
      undefined,
      output,
      emitter,
      fetchCount + 1,
    );
    return;
  }
  const headers: { [key: string]: any } = {};
  for (const headerName of res.headers.keys()) {
    headers[headerName] = res.headers.get(headerName);
  }
  const response = {
    statusCode: res.status,
    headers,
  };
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
  const { input, output, stream } = createHttpRequestHandlerStreams(req);
  startFetch(req, options, input, output, stream);
  return stream;
}
