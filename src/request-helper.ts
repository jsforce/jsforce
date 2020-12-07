import { PassThrough } from 'stream';
import { concatStreamsAsDuplex, readAll } from './util/stream';
import { HttpRequest } from './types';

/**
 *
 */
export function createHttpRequestHandlerStreams(req: HttpRequest) {
  const { body: reqBody } = req;
  const input = new PassThrough();
  const output = new PassThrough();
  const duplex = concatStreamsAsDuplex(input, output);
  if (reqBody) {
    setTimeout(() => {
      duplex.end(reqBody, 'utf8');
    }, 0);
  }
  duplex.on('response', async (res) => {
    if (duplex.listenerCount('complete') > 0) {
      const resBody = await readAll(duplex);
      duplex.emit('complete', {
        ...res,
        body: resBody,
      });
    }
  });
  return { input, output, stream: duplex };
}
