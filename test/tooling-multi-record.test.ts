import assert from 'assert';
import { Connection } from 'jsforce';

/**
 * The Tooling API has no sObject Collections resource (/composite/sobjects),
 * so multi-record create/update/destroy must issue one request per record.
 * These tests stub the request layer, so no org is needed.
 */
const createConnection = () => {
  const conn = new Connection({
    instanceUrl: 'https://example.my.salesforce.com',
    accessToken: 'dummy',
    version: '65.0',
  });
  const requests: { method: string; url: string }[] = [];
  conn.tooling.request = ((req: { method: string; url: string }) => {
    requests.push({ method: req.method, url: req.url });
    return Promise.resolve({ id: 'id', success: true, errors: [] });
  }) as any;
  return { conn, requests };
};

it('should destroy an array of ids with one request per id', async () => {
  const { conn, requests } = createConnection();
  const ids = ['301000000000001AAA', '301000000000002AAA'];
  const rets = await conn.tooling.destroy('Flow', ids, { allOrNone: false });
  assert.ok(Array.isArray(rets));
  assert.strictEqual(requests.length, 2);
  for (const [i, req] of requests.entries()) {
    assert.strictEqual(req.method, 'DELETE');
    assert.ok(req.url.endsWith(`/tooling/sobjects/Flow/${ids[i]}`));
    assert.ok(!req.url.includes('composite'));
  }
});

it('should create an array of records with one request per record', async () => {
  const { conn, requests } = createConnection();
  const rets = await conn.tooling.create('ApexClass', [
    { Name: 'A', Body: 'public class A {}' },
    { Name: 'B', Body: 'public class B {}' },
  ]);
  assert.ok(Array.isArray(rets));
  assert.strictEqual(requests.length, 2);
  for (const req of requests) {
    assert.strictEqual(req.method, 'POST');
    assert.ok(req.url.endsWith('/tooling/sobjects/ApexClass'));
  }
});

it('should update an array of records with one request per record', async () => {
  const { conn, requests } = createConnection();
  const rets = await conn.tooling.update('ApexClass', [
    { Id: '01p000000000001AAA', Name: 'A' },
    { Id: '01p000000000002AAA', Name: 'B' },
  ]);
  assert.ok(Array.isArray(rets));
  assert.strictEqual(requests.length, 2);
  for (const req of requests) {
    assert.strictEqual(req.method, 'PATCH');
    assert.ok(!req.url.includes('composite'));
  }
});
