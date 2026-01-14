import { Duplex, PassThrough, Readable, Writable } from 'stream';
import { getLogger } from './logger';

const logger = getLogger('stream');

export function createLazyStream() {
  const ins = new PassThrough();
  const outs = new PassThrough();
  const stream = concatStreamsAsDuplex(ins, outs);
  let piped = false;
  const setStream = (str: Duplex) => {
    if (piped) {
      throw new Error('stream is already piped to actual stream');
    }
    piped = true;
    ins.pipe(str).pipe(outs);
  };
  return { stream, setStream };
}

class MemoryWriteStream extends Writable {
  _chunks: Buffer[];
  _totalBytes: number;

  constructor() {
    super();
    this._chunks = [];
    this._totalBytes = 0;
  }

  _write(chunk: Buffer, encoding: string, callback: Function) {
    this._chunks.push(chunk);
    this._totalBytes += chunk.length;

    // Log progress every 10MB
    if (this._totalBytes % (10 * 1024 * 1024) < chunk.length) {
      logger.debug(
        `MemoryWriteStream: received ${this._chunks.length} chunks, ` +
          `${(this._totalBytes / 1024 / 1024).toFixed(1)}MB total`,
      );
    }
    callback();
  }

  _writev(
    data: Array<{ chunk: Buffer; encoding: string }>,
    callback: Function,
  ) {
    for (const { chunk } of data) {
      this._chunks.push(chunk);
      this._totalBytes += chunk.length;
    }
    logger.debug(
      `MemoryWriteStream._writev: received ${data.length} chunks in batch`,
    );
    callback();
  }

  toString(encoding: BufferEncoding = 'utf-8') {
    logger.debug(
      `MemoryWriteStream.toString: concatenating ${this._chunks.length} chunks, ` +
        `${(this._totalBytes / 1024 / 1024).toFixed(1)}MB`,
    );
    const start = Date.now();
    const result = Buffer.concat(this._chunks).toString(encoding);
    logger.debug(
      `MemoryWriteStream.toString: completed in ${Date.now() - start}ms`,
    );
    return result;
  }
}

export async function readAll(
  rs: Readable,
  encoding: BufferEncoding = 'utf-8',
) {
  logger.debug('readAll: starting to read stream');
  const start = Date.now();

  return new Promise<string>((resolve, reject) => {
    const ws = new MemoryWriteStream();
    rs.on('error', (err) => {
      logger.error(`readAll: stream error: ${(err as Error).message}`);
      reject(err);
    })
      .pipe(ws)
      .on('finish', () => {
        logger.debug(`readAll: stream finished in ${Date.now() - start}ms`);
        resolve(ws.toString(encoding));
      });
  });
}

class DuplexifiedStream extends Duplex {
  _writable: Writable;
  _readable: Readable;

  constructor(
    ws: Writable,
    rs: Readable,
    opts: { writableObjectMode?: boolean; readableObjectMode?: boolean } = {},
  ) {
    super({
      writableObjectMode: opts.writableObjectMode ?? ws.writableObjectMode,
      readableObjectMode: opts.readableObjectMode ?? rs.readableObjectMode,
    });
    this._writable = ws;
    this._readable = rs;
    ws.once('finish', () => {
      this.end();
    });
    this.once('finish', () => {
      ws.end();
    });
    rs.on('readable', () => {
      this._readStream();
    });
    rs.once('end', () => {
      this.push(null);
    });
    ws.on('error', (err) => this.emit('error', err));
    rs.on('error', (err) => this.emit('error', err));
  }

  _write(chunk: any, encoding: any, callback: any) {
    this._writable.write(chunk, encoding, callback);
  }

  _read(n: number) {
    this._readStream(n);
  }

  _readStream(n?: number) {
    let data;
    while ((data = this._readable.read(n)) !== null) {
      this.push(data);
    }
  }
}

export function concatStreamsAsDuplex(
  ws: Writable,
  rs: Readable,
  opts?: { writableObjectMode?: boolean; readableObjectMode?: boolean },
): Duplex {
  return new DuplexifiedStream(ws, rs, opts);
}
