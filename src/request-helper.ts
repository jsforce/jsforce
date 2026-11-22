import { PassThrough } from 'stream';
import { concatStreamsAsDuplex, readAll } from './util/stream';
import { HttpRequest, HttpRequestOptions, HttpResponse } from './types';
import FormData from 'form-data';
import { getLogger } from './util/logger';

const logger = getLogger('request-helper');

/**
 *
 */
export function createHttpRequestHandlerStreams(
  req: HttpRequest,
  options: HttpRequestOptions = {},
) {
  const { body: reqBody } = req;
  const input = new PassThrough();
  const output = new PassThrough();
  const duplex = concatStreamsAsDuplex(input, output);

  if (typeof reqBody !== 'undefined') {
    setTimeout(() => {
      if (reqBody instanceof FormData) {
        duplex.end(reqBody.getBuffer());
      } else {
        duplex.end(reqBody, 'utf8');
      }
    }, 0);
  }
  duplex.on('response', async (res) => {
    if (duplex.listenerCount('complete') > 0) {
      logger.debug('Processing response');
      const start = Date.now();

      const resBody = await readAll(duplex, options.encoding);

      logger.debug(
        `Response body read: ${(resBody.length / 1024 / 1024).toFixed(1)}MB ` +
          `in ${Date.now() - start}ms`,
      );

      duplex.emit('complete', {
        ...res,
        body: resBody,
      });
    }
  });
  return { input, output, stream: duplex };
}

const redirectStatuses = new Set([301, 302, 303, 307, 308]);

/**
 *
 */
export function isRedirect(status: number) {
  return redirectStatuses.has(status);
}

/**
 * Turn a redirect that the AJAX proxy reported in headers of a 200 response
 * back into the redirect response, when the request asked for it with `SalesforceProxy-Redirect: report`
 */
export function restoreReportedRedirect<R extends Omit<HttpResponse, 'body'>>(
  request: HttpRequest,
  response: R,
): R {
  if (getHeader(request.headers, 'salesforceproxy-redirect') !== 'report') {
    return response;
  }
  const status = Number(response.headers['salesforceproxy-redirect-status']);
  const location = response.headers['salesforceproxy-redirect-location'];
  if (response.statusCode !== 200 || !isRedirect(status) || typeof location !== 'string') {
    return response;
  }
  const {
    'salesforceproxy-redirect-status': _status,
    'salesforceproxy-redirect-location': _location,
    ...headers
  } = response.headers;
  return { ...response, statusCode: status, headers: { ...headers, location } };
}

/**
 * Whether the URL is an HTTPS URL
 */
export function isHttpsUrl(url: string) {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * The value of a header, with the name matched case-insensitively
 */
export function getHeader(
  headers: { [name: string]: string } | undefined,
  name: string,
): string | undefined {
  const lowerName = name.toLowerCase();
  const key = Object.keys(headers ?? {}).find(
    (k) => k.toLowerCase() === lowerName,
  );
  return key === undefined ? undefined : headers?.[key];
}

/**
 * The headers without a header, with the name matched case-insensitively
 */
export function withoutHeader(
  headers: { [name: string]: string } | undefined,
  name: string,
): { [name: string]: string } {
  const lowerName = name.toLowerCase();
  return Object.fromEntries(
    Object.entries(headers ?? {}).filter(
      ([key]) => key.toLowerCase() !== lowerName,
    ),
  );
}

/**
 *
 */
const MAX_REDIRECT_COUNT = 10;

/**
 *
 */
export async function performRedirectRequest(
  req: HttpRequest,
  res: Omit<HttpResponse, 'body'>,
  followRedirect: NonNullable<HttpRequestOptions['followRedirect']>,
  counter: number,
  redirectCallback: (req: HttpRequest) => void | Promise<void>,
) {
  if (counter >= MAX_REDIRECT_COUNT) {
    throw new Error('Reached to maximum redirect count');
  }
  const redirectUrl = res.headers['location'];
  if (!redirectUrl) {
    throw new Error('No redirect URI found');
  }
  const getRedirectRequest =
    typeof followRedirect === 'function'
      ? followRedirect
      : () => ({
          method: 'GET' as const,
          url: redirectUrl,
          headers: req.headers,
        });
  const nextReqParams = await getRedirectRequest(redirectUrl);
  if (!nextReqParams) {
    throw new Error('Cannot handle redirect for ' + redirectUrl);
  }
  // wait for the redirected request, so that its failure reaches the caller
  await redirectCallback(nextReqParams);
}

/**
 *
 */
export async function executeWithTimeout<T>(
  execFn: () => Promise<T>,
  msec: number | undefined,
  cancelCallback?: () => void,
): Promise<T> {
  let timeout = false;
  const pid =
    msec != null
      ? setTimeout(() => {
          timeout = true;
          cancelCallback?.();
        }, msec)
      : undefined;
  let res;
  try {
    res = await execFn();
  } finally {
    if (pid) {
      clearTimeout(pid);
    }
  }
  if (timeout) {
    throw new Error('Request Timeout');
  }
  return res;
}
