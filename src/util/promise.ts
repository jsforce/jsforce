/**
 *
 */
import { Duplex } from 'stream';

/**
 *
 */
export type StreamPromiseBuilder<T> = () => {
  stream: Duplex;
  promise: Promise<T>;
};

/**
 *
 */
export class StreamPromise<T> extends Promise<T> {
  stream() {
    // dummy
    return new Duplex();
  }

  static create<T>(builder: StreamPromiseBuilder<T>) {
    const { stream, promise } = builder();
    const streamPromise = new StreamPromise<T>((resolve, reject) => {
      promise.then(resolve, reject);
    });
    streamPromise.stream = () => stream;
    return streamPromise;
  }
}
