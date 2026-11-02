import assert from 'assert';
import { createServer } from 'net';
import request from '../src/browser/request';

const closedPort = (): Promise<number> =>
  new Promise((resolve) => {
    const server = createServer().listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });

describe('browser request', () => {
  it('emits error when fetch rejects', async () => {
    const port = await closedPort();
    const stream = request({ method: 'GET', url: `http://127.0.0.1:${port}/` });

    let timer: NodeJS.Timeout | undefined;
    const outcome = await new Promise<string>((resolve) => {
      stream.on('error', () => resolve('error'));
      stream.on('complete', () => resolve('complete'));
      timer = setTimeout(() => resolve('pending'), 5000);
    });
    clearTimeout(timer);

    assert.strictEqual(outcome, 'error');
  });
});
