import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, delay } from './util';
import type {
  StreamingMessage,
  GenericStreamingMessage,
  Subscription,
} from 'jsforce/api/streaming';
import { isNodeJS } from './helper/env';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

if (isNodeJS()) {
  /**
   *
   */
  it('should subscribe to topic, create account, and receive event of account has been created', async () => {
    type Account = { Id: string; Name: string };
    let subscr: Subscription | undefined;
    const msgArrived = new Promise<StreamingMessage<Account>>((resolve) => {
      subscr = conn.streaming
        .topic<Account>('JSforceTestAccountUpdates')
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
  it('should subscribe to generic streaming channel and recieve custom streaming event', async () => {
    const channelName = '/u/JSforceTestChannel';
    try {
      await conn.sobject('StreamingChannel').create({ Name: channelName });

      let subscr: Subscription | undefined;
      const msgArrived = new Promise<GenericStreamingMessage>((resolve) => {
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
}

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
