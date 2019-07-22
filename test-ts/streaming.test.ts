import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, delay } from './util';

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
test('subscribe to topic, create account, and receive event of account has been created', async (t) => {
  let subscr: any; // TODO: remove any
  const msgArrived = new Promise<any>((resolve) => {
    // TODO: remove any
    subscr = conn.streaming
      .topic('JSforceTestAccountUpdates')
      .subscribe(resolve);
  });
  await delay(5000);
  await conn
    .sobject('Account')
    .create({ Name: `My New Account #${Date.now()}` });
  const msg = await msgArrived;
  t.true(isObject(msg.event));
  t.true(msg.event.type === 'created');
  t.true(isObject(msg.sobject));
  t.true(isString(msg.sobject.Name));
  t.true(isString(msg.sobject.Id));

  if (subscr) {
    subscr.cancel();
  }
});

/**
 *
 */
test('subscribe to generic streaming channel and recieve custom streaming event', async (t) => {
  const channelName = '/u/JSforceTestChannel';
  await conn.sobject('StreamingChannel').create({ Name: channelName });

  let subscr: any; // TODO: remove any
  const msgArrived = new Promise<any>((resolve) => {
    // TODO: remove any
    subscr = conn.streaming.channel(channelName).subscribe(resolve);
  });
  await delay(5000);
  const res = await conn.streaming.channel(channelName).push({
    payload: 'hello, world',
    userIds: [],
  });
  t.true(res.fanoutCount === -1);
  t.true(isObject(res.userOnlineStatus));
  const msg = await msgArrived;
  t.true(msg.payload === 'hello, world');

  if (subscr) {
    subscr.cancel();
  }
  await conn
    .sobject('StreamingChannel')
    .find({ Name: channelName })
    .destroy();
});

/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
