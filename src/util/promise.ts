/**
 *
 */
import { Duplex, Transform } from 'stream';

type SetStreamFunc = (stream: Duplex) => void;

/**
 *
 */
export type StreamPromiseBuilder<T> = (callback: SetStreamFunc) => Promise<T>;

/**
 *
 */
export class StreamPromise<T> extends Promise<T> {
  stream() {
    return new Duplex();
  } // dummy

  static create<T>(asyncFn: StreamPromiseBuilder<T>) {
    let streamCallback = (s: any) => {};
    const streamReady = new Promise<Duplex>((resolve) => {
      streamCallback = resolve;
    });
    const promise = asyncFn(streamCallback);
    const streamPromise = new StreamPromise<T>((resolve, reject) => {
      promise.then(resolve, reject);
    });
    streamPromise.stream = () =>
      new Transform({
        transform(data, encoding, cb) {
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
            stream
              .on('data', (data) => {
                this.push(data);
              })
              .on('end', () => {
                this.push(null);
                cb();
              });
          })();
        },
      });
    return streamPromise;
  }
}
