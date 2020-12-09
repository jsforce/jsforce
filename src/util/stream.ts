import { Duplex, Readable, Writable } from 'stream';

class MemoryWriteStream extends Writable {
  _buf: Buffer;

  constructor() {
    super();
    this._buf = Buffer.alloc(0);
  }

  _writev(data: Array<{ chunk: Buffer; encoding: any }>, callback: any) {
    this._buf = Buffer.concat([this._buf, ...data.map(({ chunk }) => chunk)]);
    callback();
  }

  toString() {
    return this._buf.toString();
  }
}

export async function readAll(rs: Readable) {
  return new Promise<string>((resolve, reject) => {
    const ws = new MemoryWriteStream();
    rs.on('error', reject)
      .pipe(ws)
      .on('finish', () => resolve(ws.toString()));
  });
}

function readStream(srcs: Readable, dsts: Readable, n: number) {
  let chunk;
  while (null !== (chunk = srcs.read(n))) {
    const ret = dsts.push(chunk);
    if (!ret) {
      break;
    }
  }
}

function connectStream(srcs: Readable, dsts: Readable, n: number) {
  srcs
    .on('readable', () => readStream(srcs, dsts, n))
    .on('end', () => dsts.push(null));
}

export function concatStreamsAsDuplex(ins: Writable, outs: Readable): Duplex {
  let outsConnected = false;
  return new Duplex({
    write(chunk, encoding, callback) {
      return ins.write(chunk, encoding, callback);
    },
    final(callback) {
      return ins.end(callback);
    },
    read(n) {
      if (!outsConnected) {
        outsConnected = true;
        connectStream(outs, this, n);
        return;
      }
      readStream(outs, this, n);
    },
  });
}
