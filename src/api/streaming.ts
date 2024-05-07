/**
 * @file Manages Streaming APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { EventEmitter } from 'events';
import { Client, Subscription } from 'faye';
import { registerModule } from '../jsforce';
import Connection from '../connection';
import { Record, Schema } from '../types';
import * as StreamingExtension from './streaming/extension';

/**
 *
 */
export type StreamingMessage<R extends Record> = {
  event: {
    type: string;
    createdDate: string;
    replayId: number;
  };
  sobject: R;
};

export type GenericStreamingMessage = {
  event: {
    createdDate: string;
    replayId: number;
  };
  payload: string;
};

export type PushEvent = {
  payload: string;
  userIds: string[];
};

export type PushEventResult = {
  fanoutCount: number;
  userOnlineStatus: {
    [userId: string]: boolean;
  };
};

export { Client, Subscription };

/*--------------------------------------------*/
/**
 * Streaming API topic class
 */
class Topic<S extends Schema, R extends Record> {
  _streaming: Streaming<S>;
  name: string;

  constructor(streaming: Streaming<S>, name: string) {
    this._streaming = streaming;
    this.name = name;
  }

  /**
   * Subscribe listener to topic
   */
  subscribe(listener: (message: StreamingMessage<R>) => void): Subscription {
    return this._streaming.subscribe(this.name, listener);
  }

  /**
   * Unsubscribe listener from topic
   */
  unsubscribe(subscr: Subscription) {
    this._streaming.unsubscribe(this.name, subscr);
    return this;
  }
}

/*--------------------------------------------*/
/**
 * Streaming API Generic Streaming Channel
 */
class Channel<S extends Schema> {
  _streaming: Streaming<S>;
  _id: Promise<string | undefined> | undefined;
  name: string;

  constructor(streaming: Streaming<S>, name: string) {
    this._streaming = streaming;
    this.name = name;
  }

  /**
   * Subscribe to channel
   */
  subscribe(listener: Function): Subscription {
    return this._streaming.subscribe(this.name, listener);
  }

  unsubscribe(subscr: Subscription) {
    this._streaming.unsubscribe(this.name, subscr);
    return this;
  }

  push(events: PushEvent): Promise<PushEventResult>;
  push(events: PushEvent): Promise<PushEventResult[]>;
  async push(events: PushEvent | PushEvent[]) {
    const isArray = Array.isArray(events);
    const pushEvents = Array.isArray(events) ? events : [events];
    const conn: Connection = (this._streaming._conn as unknown) as Connection;
    if (!this._id) {
      this._id = conn
        .sobject('StreamingChannel')
        .findOne({ Name: this.name }, ['Id'])
        .then((rec) => rec?.Id);
    }
    const id = await this._id;
    if (!id) {
      throw new Error(`No streaming channel available for name: ${this.name}`);
    }
    const channelUrl = `/sobjects/StreamingChannel/${id}/push`;
    const rets = await conn.requestPost<PushEventResult[]>(channelUrl, {
      pushEvents,
    });
    return isArray ? rets : rets[0];
  }
}

/*--------------------------------------------*/
/**
 * Streaming API class
 */
export class Streaming<S extends Schema> extends EventEmitter {
  _conn: Connection<S>;
  _topics: { [name: string]: Topic<S, Record> } = {};
  _fayeClients: { [clientType: string]: Client } = {};

  /**
   *
   */
  constructor(conn: Connection<S>) {
    super();
    this._conn = conn;
  }

  /* @private */
  _createClient(forChannelName?: string | null, extensions?: any[]) {
    // forChannelName is advisory, for an API workaround. It does not restrict or select the channel.
    const needsReplayFix =
      typeof forChannelName === 'string' && forChannelName.startsWith('/u/');
    const endpointUrl = [
      this._conn.instanceUrl,
      // special endpoint "/cometd/replay/xx.x" is only available in 36.0.
      // See https://releasenotes.docs.salesforce.com/en-us/summer16/release-notes/rn_api_streaming_classic_replay.htm
      'cometd' +
        (needsReplayFix && this._conn.version === '36.0'
          ? '/replay'
          : ''),
      this._conn.version,
    ].join('/');
    const fayeClient = new Client(endpointUrl, {});
    fayeClient.setHeader('Authorization', 'OAuth ' + this._conn.accessToken);
    if (Array.isArray(extensions)) {
      for (const extension of extensions) {
        fayeClient.addExtension(extension);
      }
    }
    // prevent streaming API server error
    const dispatcher = (fayeClient as any)._dispatcher;
    if (dispatcher.getConnectionTypes().indexOf('callback-polling') === -1) {
      dispatcher.selectTransport('long-polling');
      dispatcher._transport.batching = false;
    }
    return fayeClient;
  }

  /** @private **/
  _getFayeClient(channelName: string) {
    const isGeneric = channelName.startsWith('/u/');
    const clientType = isGeneric ? 'generic' : 'pushTopic';
    if (!this._fayeClients[clientType]) {
      this._fayeClients[clientType] = this._createClient(channelName);
    }
    return this._fayeClients[clientType];
  }

  /**
   * Get named topic
   */
  topic<R extends Record = Record>(name: string): Topic<S, R> {
    this._topics = this._topics || {};
    const topic = (this._topics[name] =
      this._topics[name] || new Topic<S, R>(this, name));
    return topic as Topic<S, R>;
  }

  /**
   * Get channel for channel name
   */
  channel(name: string) {
    return new Channel(this, name);
  }

  /**
   * Subscribe topic/channel
   */
  subscribe(name: string, listener: Function): Subscription {
    const channelName = name.startsWith('/') ? name : '/topic/' + name;
    const fayeClient = this._getFayeClient(channelName);
    return fayeClient.subscribe(channelName, listener);
  }

  /**
   * Unsubscribe topic
   */
  unsubscribe(name: string, subscription: Subscription) {
    const channelName = name.startsWith('/') ? name : '/topic/' + name;
    const fayeClient = this._getFayeClient(channelName);
    fayeClient.unsubscribe(channelName, subscription);
    return this;
  }

  /**
   * Create a Streaming client, optionally with extensions
   *
   * See Faye docs for implementation details: https://faye.jcoglan.com/browser/extensions.html
   *
   * Example usage:
   *
   * ```javascript
   * const jsforce = require('jsforce');
   *
   * // Establish a Salesforce connection. (Details elided)
   * const conn = new jsforce.Connection({ … });
   *
   * const fayeClient = conn.streaming.createClient();
   *
   * const subscription = fayeClient.subscribe(channel, data => {
   *   console.log('topic received data', data);
   * });
   *
   * subscription.cancel();
   * ```
   *
   * Example with extensions, using Replay & Auth Failure extensions in a server-side Node.js app:
   *
   * ```javascript
   * const jsforce = require('jsforce');
   * const { StreamingExtension } = require('jsforce/api/streaming');
   *
   * // Establish a Salesforce connection. (Details elided)
   * const conn = new jsforce.Connection({ … });
   *
   * const channel = "/event/My_Event__e";
   * const replayId = -2; // -2 is all retained events
   *
   * const exitCallback = () => process.exit(1);
   * const authFailureExt = new StreamingExtension.AuthFailure(exitCallback);
   *
   * const replayExt = new StreamingExtension.Replay(channel, replayId);
   *
   * const fayeClient = conn.streaming.createClient([
   *   authFailureExt,
   *   replayExt
   * ]);
   *
   * const subscription = fayeClient.subscribe(channel, data => {
   *   console.log('topic received data', data);
   * });
   *
   * subscription.cancel();
   * ```
   */
  createClient(extensions: any[]) {
    return this._createClient(null, extensions);
  }
}

export { StreamingExtension };

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('streaming', (conn) => new Streaming(conn));

export default Streaming;
