import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, delay } from './util';

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
test('subscribe to topic, create account, and receive event of account has been created', async () => {
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
  assert.ok(isObject(msg.event));
  assert.ok(msg.event.type === 'created');
  assert.ok(isObject(msg.sobject));
  assert.ok(isString(msg.sobject.Name));
  assert.ok(isString(msg.sobject.Id));

  if (subscr) {
    subscr.cancel();
  }
});

/**
 *
 */
test('subscribe to generic streaming channel and recieve custom streaming event', async () => {
  const channelName = '/u/JSforceTestChannel';
  try {
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
    assert.ok(res.fanoutCount === -1);
    assert.ok(isObject(res.userOnlineStatus));
    const msg = await msgArrived;
    assert.ok(msg.payload === 'hello, world');

    if (subscr) {
      console.log('canceling subscription...');
      subscr.cancel();
    }
  } finally {
    await conn
      .sobject('StreamingChannel')
      .find({ Name: channelName })
      .destroy();
  }
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
