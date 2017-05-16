/* @flow */
import { Duplex, Transform } from 'stream';

/**
 *
 */
export class StreamPromise<T> extends Promise<T> {
  stream: () => Duplex;

  stream() { return new Duplex(); } // dummy

  static create(asyncFn: (Duplex => void) => Promise<T>) {
    let streamCallback = () => {};
    const streamReady = new Promise((resolve) => { streamCallback = resolve; });
    const promise = asyncFn(streamCallback);
    const streamPromise = new StreamPromise((resolve, reject) => {
      promise.then(resolve, reject);
    });
    streamPromise.stream = () => new Transform({
      tranform(data, encoding, cb) {
        (async () => {
          const stream = await streamReady;
          stream.write(data, encoding);
          cb();
        })();
      },
      flush(cb) {
        (async () => {
          const stream = await streamReady;
          stream.end();
          stream.on('data', (data) => {
            this.push(data);
          }).on('end', () => {
            this.push(null);
            cb();
          });
        })();
      }
    });
    return streamPromise;
  }
}
