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
import { randomUUID } from 'crypto';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
const testChannelName = '/u/JSforceTestChannel';

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);

  console.log('Creating streaming channel...');
  await conn.sobject('StreamingChannel').create({ Name: testChannelName });
  console.log('Streaming channel created!');
});

afterAll(async () => {
  console.log('Destroying streaming channel...');
  await conn
    .sobject('StreamingChannel')
    .find({ Name: testChannelName })
    .destroy();
  console.log('Streaming channel destroyed.');
})

if (isNodeJS()) {
  /**
   *
   */
  it.skip('should subscribe to topic, create account, and receive event of account has been created', async () => {
    type Account = { Id: string; Name: string };

    const id = Date.now();

    const accountName = `My New Account #${id}`;

    const pushTopicName = `Topic-${id}`;

    await conn.sobject('PushTopic').create({
      Name: pushTopicName,
      Query: `SELECT Id, Name FROM Account WHERE Name='${accountName}'`,
      ApiVersion: '54.0',
      NotifyForFields: 'Referenced',
      NotifyForOperationCreate: true,
      NotifyForOperationUpdate: true,
      NotifyForOperationDelete: false,
      NotifyForOperationUndelete: false,
    });

    let subscr: Subscription | undefined;
    const msgArrived = new Promise<StreamingMessage<Account>>((resolve) => {
      subscr = conn.streaming.topic<Account>(pushTopicName).subscribe(resolve);
    });

    await conn.sobject('Account').create({ Name: accountName });

    const msg = await msgArrived;

    try {
      assert.ok(isObject(msg.sobject));
      assert.ok(msg.sobject.Name === accountName);

      assert.ok(isObject(msg.event));
      assert.ok(msg.event.type === 'created');
      assert.ok(isObject(msg.sobject));
      assert.ok(isString(msg.sobject.Name));
      assert.ok(isString(msg.sobject.Id));
    } finally {
      await conn.sobject('Account').findOne({ Name: accountName }).delete();
    }

    if (subscr) {
      subscr.cancel();
    }

    await conn.sobject('PushTopic').findOne({ Name: pushTopicName }).delete();
  });

  it('should subscribe to generic streaming channel and recieve custom streaming event (replay id defaults to -1 internally)', async () => {
    let subscr: Subscription | undefined;
    const msgArrived = new Promise<GenericStreamingMessage>((resolve) => {
      const streamingChannel = conn.streaming.channel(testChannelName);
      subscr = streamingChannel.subscribe(resolve);
    });
    await delay(5000);
    const payloadMessage = randomUUID();
    const res = await conn.streaming.channel(testChannelName).push({
      payload: payloadMessage,
      userIds: [],
    });
    // console.log(res);
    assert.ok(res.fanoutCount === -1);
    assert.ok(isObject(res.userOnlineStatus));
    const msg = await msgArrived;
    assert.ok(msg.payload === payloadMessage);

    if (subscr) {
      subscr.cancel();
    }
  });

  it('should subscribe to generic streaming channel and recieve custom streaming event (specific replay id)', async () => {
    let subscr: Subscription | undefined;
    const msgArrived = new Promise<GenericStreamingMessage>((resolve) => {
      const streamingChannel = conn.streaming.channel(testChannelName);
      subscr = streamingChannel.subscribe(resolve, 1);
    });
    await delay(5000);
    const payloadMessage = randomUUID();
    const res = await conn.streaming.channel(testChannelName).push({
      payload: payloadMessage,
      userIds: [],
    });
    // console.log(res);
    assert.ok(res.fanoutCount === -1);
    assert.ok(isObject(res.userOnlineStatus));
    const msg = await msgArrived;
    assert.ok(msg.payload === payloadMessage);

    if (subscr) {
      subscr.cancel();
    }
  });

  // tests using the replay id -1 and -2
  // see: https://developer.salesforce.com/docs/atlas.en-us.api_streaming.meta/api_streaming/using_streaming_api_durability.htm

  it('should subscribe to generic streaming channel and recieve custom streaming event (with replay id -1)', async () => {
    let subscr: Subscription | undefined;
    const msgArrived = new Promise<GenericStreamingMessage>((resolve) => {
      const streamingChannel = conn.streaming.channel(testChannelName);
      subscr = streamingChannel.subscribe(resolve, -1);
    });
    await delay(5000);
    const payloadMessage = randomUUID();
    const res = await conn.streaming.channel(testChannelName).push({
      payload: payloadMessage,
      userIds: [],
    });
    assert.ok(res.fanoutCount === -1);
    assert.ok(isObject(res.userOnlineStatus));
    const msg = await msgArrived;
    assert.ok(msg.payload === payloadMessage);

    if (subscr) {
      subscr.cancel();
    }
  });

  it('should subscribe to generic streaming channel and receive only new events after subscribing (replayId -1)', async () => {
    let subscr: Subscription | undefined;
    // Publish an event BEFORE subscribing
    const payloadMessageBefore = randomUUID();
    const resBefore = await conn.streaming.channel(testChannelName).push({
      payload: payloadMessageBefore,
      userIds: [],
    });
    assert.ok(resBefore.fanoutCount === 0);
    assert.ok(isObject(resBefore.userOnlineStatus));

    // Now subscribe (replayId -1 means only new events after this point)
    const msgArrived = new Promise<GenericStreamingMessage>((resolve) => {
      const streamingChannel = conn.streaming.channel(testChannelName);
      subscr = streamingChannel.subscribe(resolve, -1);
    });
    await delay(5000);
    // Publish an event AFTER subscribing
    const payloadMessageAfter = randomUUID();
    const resAfter = await conn.streaming.channel(testChannelName).push({
      payload: payloadMessageAfter,
      userIds: [],
    });
    assert.ok(resAfter.fanoutCount === -1);
    assert.ok(isObject(resAfter.userOnlineStatus));
    const msg = await msgArrived;
    // Assert that only the event published after subscribing is received
    assert.ok(msg.payload === payloadMessageAfter);
    // Optionally, check that the replayId is present
    assert.ok(typeof msg.event.replayId === 'number');

    if (subscr) {
      subscr.cancel();
    }
  });
}
