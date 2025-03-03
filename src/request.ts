import { EventEmitter } from 'events';
import { Duplex, Readable, Writable } from 'stream';
import fetch, { Response, RequestInit, FetchError } from 'node-fetch';
import createHttpsProxyAgent from 'https-proxy-agent';
import {
  createHttpRequestHandlerStreams,
  executeWithTimeout,
  isRedirect,
  performRedirectRequest,
} from './request-helper';
import { HttpRequest, HttpRequestOptions } from './types';
import { getLogger } from './util/logger';
import is from '@sindresorhus/is';

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
    statusCodes: options.retry?.statusCodes ?? [420, 429, 500, 502, 503, 504],
    maxRetries: options.retry?.maxRetries ?? 5,
    minTimeout: options.retry?.minTimeout ?? 500,
    timeoutFactor: options.retry?.timeoutFactor ?? 2,
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

  const shouldRetryRequest = (
    maxRetry: number,
    resOrErr: Response | Error | FetchError,
  ): boolean => {
    if (!retryOpts.methods.includes(request.method)) return false;

    if (resOrErr instanceof Response) {
      if (retryOpts.statusCodes.includes(resOrErr.status)) {
        if (maxRetry === retryCount) {
          return false
        } else {
          return true;
        }
      }
      return false;
    } else {
      if (maxRetry === retryCount) return false;

      // only retry on operational errors
      // https://github.com/node-fetch/node-fetch/blob/2.x/ERROR-HANDLING.md#error-handling-with-node-fetch
      if (resOrErr.name != 'FetchError') return false;

      if (is.nodeStream(body) && Readable.isDisturbed(body)) {
        logger.debug('Body of type stream was read, unable to retry request.');
        return false;
      }

      if (
        'code' in resOrErr &&
        resOrErr.code &&
        retryOpts?.errorCodes?.includes(resOrErr.code)
      )
        return true;

      return false;
    }
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
      const res = await fetch(url, fetchOpts);
      if (shouldRetryRequest(retryOpts.maxRetries, res)) {
        logger.debug(`retrying for the ${retryCount + 1} time`);
        logger.debug('reason: statusCode match');

        await sleep(
          retryCount === 0
            ? retryOpts.minTimeout
            : retryOpts.minTimeout * retryOpts.timeoutFactor ** retryCount,
        );

        // NOTE: this event is only used by tests and will be removed at any time.
        // jsforce may switch to node's fetch which doesn't emit this event on retries.
        emitter.emit('retry', retryCount);
        retryCount++;

        return await fetchWithRetries(maxRetry);
      }
      // should we throw here if the maxRetry already happened and still got the same statusCode?
      return res;
    } catch (err) {
      logger.debug('Request failed');
      const error = err as Error | FetchError;

      // request was canceled by consumer (AbortController), skip retry and rethrow.
      if (error.name === 'AbortError') {
        throw error;
      }

      if (shouldRetryRequest(retryOpts.maxRetries, error)) {
        logger.debug(`retrying for the ${retryCount + 1} time`);
        logger.debug(`Error: ${(err as Error).message}`);

        await sleep(
          retryCount === 0
            ? retryOpts.minTimeout
            : retryOpts.minTimeout * retryOpts.timeoutFactor ** retryCount,
        );

        // NOTE: this event is only used by tests and will be removed at any time.
        // jsforce may switch to node's fetch which doesn't emit this event on retries.
        emitter.emit('retry', retryCount);
        retryCount++;

        return fetchWithRetries(maxRetry);
      }

      logger.debug('Skipping retry...');

      if (maxRetry === retryCount) {
        throw err;
      } else {
        throw err;
      }
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
