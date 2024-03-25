import { EventEmitter } from 'events';
import { Duplex, Readable, Writable } from 'stream';
import fetch, { Response, RequestInit, FetchError } from 'node-fetch';
import AbortController from 'abort-controller';
import createHttpsProxyAgent from 'https-proxy-agent';
import {
  createHttpRequestHandlerStreams,
  executeWithTimeout,
  isRedirect,
  performRedirectRequest,
} from './request-helper';
import { HttpRequest, HttpRequestOptions } from './types';
import { getLogger } from './util/logger';

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
  const logger = getLogger('fetch');
  const { httpProxy, followRedirect } = options;
  const agent = httpProxy ? createHttpsProxyAgent(httpProxy) : undefined;
  const { url, body, ...rrequest } = request;
  const controller = new AbortController();

  let retryCount = 0;

  const retryOpts: Required<HttpRequestOptions['retry']> = {
    maxRetries: options.retry?.maxRetries ?? 5,
    errorCodes: options.retry?.errorCodes ?? [
      'ECONNRESET',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ENETDOWN',
      'ENETUNREACH',
      'EHOSTDOWN',
      'UND_ERR_SOCKET',
      'ETIMEDOUT',
      'EPIPE',
    ],
    methods: options.retry?.methods ?? [
      'GET',
      'PUT',
      'HEAD',
      'OPTIONS',
      'DELETE',
    ],
  };

  const fetchWithRetries = async (
    maxRetry = retryOpts?.maxRetries,
  ): Promise<Response> => {
    const fetchOpts: RequestInit = {
      ...rrequest,
      ...(input && /^(post|put|patch)$/i.test(request.method)
        ? { body: input }
        : {}),
      redirect: 'manual',
      signal: controller.signal,
      agent,
    };

    try {
      return await fetch(url, fetchOpts);
    } catch (err) {
      logger.debug(`Request failed`);
      const error = err as Error | FetchError;

      // request was canceled by consumer (AbortController), skip retry and rethrow.
      if (error.name === 'AbortError') {
        throw error;
      }

      const shouldRetry = (): boolean => {
        // only retry on operational errors
        if (error.name != 'FetchError') return false;
        if (retryCount === maxRetry) return false;

        if (!retryOpts?.methods?.includes(request.method)) return false;

        if (
          'code' in error &&
          error.code &&
          retryOpts?.errorCodes?.includes(error.code)
        )
          return true;

        return false;
      };

      if (shouldRetry()) {
        logger.debug(`retrying for the ${retryCount + 1} time`);
        logger.debug(`Error: ${error}`);

        // NOTE: this event is only used by tests and will be removed at any time.
        // jsforce may switch to node's fetch which doesn't emit this event on retries.
        emitter.emit('retry', retryCount);
        retryCount++;

        return await fetchWithRetries(maxRetry);
      }

      logger.debug('Skipping retry...');

      throw err;
    }
  };

  let res: Response;

  try {
    res = await executeWithTimeout(fetchWithRetries, options.timeout, () =>
      controller.abort(),
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
