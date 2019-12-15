import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection(); // TODO: remove any

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
test('execute anonymous apex and execute successfully', async () => {
  const body = ["System.debug('Hello, World');"].join('\n');
  const res = await conn.tooling.executeAnonymous(body);
  assert.ok(res.compiled === true);
  assert.ok(res.success === true);
});

/**
 *
 */
/**
 * exclude this test till Tooling API service can correctly handle w/o content-type request header
 *
test('get completions and return completions', async () => {
  const res = await conn.tooling.completions('apex');
  assert.ok(isObject(res));
  assert.ok(isObject(res.publicDeclarations));
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
