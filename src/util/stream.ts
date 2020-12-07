import { Duplex, Readable, Writable } from 'stream';

export async function readAll(r: Readable) {
  const bufs: string[] = [];
  return new Promise<string>((resolve, reject) => {
    r.on('data', (data) => bufs.push(data));
    r.on('end', () => resolve(bufs.join('')));
    r.on('error', (err) => reject(err));
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
