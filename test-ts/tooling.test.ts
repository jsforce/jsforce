import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection(); // TODO: remove any


/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});


/**
 *
 */
test('execute anonymous apex and execute successfully', async (t) => {
  const body = [
    "System.debug('Hello, World');"
  ].join('\n');
  const res = await conn.tooling.executeAnonymous(body);
  t.true(res.compiled === true);
  t.true(res.success === true);
});

/**
 *
 */
/**
 * exclude this test till Tooling API service can correctly handle w/o content-type request header
 *
test('get completions and return completions', async (t) => {
  const res = await conn.tooling.completions('apex');
  t.true(isObject(res));
  t.true(isObject(res.publicDeclarations));
});

/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
