import { PassThrough } from 'stream';
import { concatStreamsAsDuplex, readAll } from './util/stream';
import { HttpRequest, HttpRequestOptions, HttpResponse } from './types';
import FormData from 'form-data';

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
      const resBody = await readAll(duplex, options.encoding);
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
 *
 */
const MAX_REDIRECT_COUNT = 10;

/**
 *
 */
export function performRedirectRequest(
  req: HttpRequest,
  res: Omit<HttpResponse, 'body'>,
  followRedirect: NonNullable<HttpRequestOptions['followRedirect']>,
  counter: number,
  redirectCallback: (req: HttpRequest) => void,
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
  const nextReqParams = getRedirectRequest(redirectUrl);
  if (!nextReqParams) {
    throw new Error('Cannot handle redirect for ' + redirectUrl);
  }
  redirectCallback(nextReqParams);
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
