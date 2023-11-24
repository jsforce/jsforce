import { Duplex, PassThrough, Readable, Writable } from 'stream';

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
  _buf: Buffer;

  constructor() {
    super();
    this._buf = Buffer.alloc(0);
  }

  _write(chunk: Buffer, encoding: string, callback: Function) {
    this._buf = Buffer.concat([this._buf, chunk]);
    callback();
  }

  _writev(
    data: Array<{ chunk: Buffer; encoding: string }>,
    callback: Function,
  ) {
    this._buf = Buffer.concat([this._buf, ...data.map(({ chunk }) => chunk)]);
    callback();
  }

  toString(encoding: BufferEncoding = 'utf-8') {
    return this._buf.toString(encoding);
  }
}

export async function readAll(
  rs: Readable,
  encoding: BufferEncoding = 'utf-8',
) {
  return new Promise<string>((resolve, reject) => {
    const ws = new MemoryWriteStream();
    rs.on('error', reject)
      .pipe(ws)
      .on('finish', () => resolve(ws.toString(encoding)));
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
