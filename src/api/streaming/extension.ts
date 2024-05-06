/**
 * Faye Client extensions: https://faye.jcoglan.com/browser/extensions.html
 *
 * For use with Streaming.prototype.createClient()
 **/

/*-------------------------------------------*/
/**
 * Constructor for an auth failure detector extension
 *
 * Based on new feature released with Salesforce Spring '18:
 * https://releasenotes.docs.salesforce.com/en-us/spring18/release-notes/rn_messaging_cometd_auth_validation.htm?edition=&impact=
 *
 * Example triggering error message:
 *
 * ```
 * {
 *   "ext":{
 *     "sfdc":{"failureReason":"401::Authentication invalid"},
 *     "replay":true},
 *   "advice":{"reconnect":"none"},
 *   "channel":"/meta/handshake",
 *   "error":"403::Handshake denied",
 *   "successful":false
 * }
 * ```
 *
 * Example usage:
 *
 * ```javascript
 * const jsforce = require('jsforce');
 * const { StreamingExtension } = require('jsforce/api/streaming');
 *
 * const conn = new jsforce.Connection({ … });
 *
 * const channel = "/event/My_Event__e";
 *
 * // Exit the Node process when auth fails
 * const exitCallback = () => process.exit(1);
 * const authFailureExt = new StreamingExtension.AuthFailure(exitCallback);
 *
 * const fayeClient = conn.streaming.createClient([ authFailureExt ]);
 *
 * const subscription = fayeClient.subscribe(channel, data => {
 *   console.log('topic received data', data);
 * });
 *
 * subscription.cancel();
 * ```
 *
 * @param {Function} failureCallback - Invoked when authentication becomes invalid
 */
export class AuthFailure {
  _failureCallback: Function;

  constructor(failureCallback: Function) {
    this._failureCallback = failureCallback;
  }

  incoming(message: any, callback: Function) {
    if (
      (message.channel === '/meta/connect' ||
        message.channel === '/meta/handshake') &&
      message.advice &&
      message.advice.reconnect == 'none'
    ) {
      this._failureCallback(message);
    } else {
      callback(message);
    }
  }
}

/*-------------------------------------------*/
const REPLAY_FROM_KEY = 'replay';

/**
 * Constructor for a durable streaming replay extension
 *
 * Modified from original Salesforce demo source code:
 * https://github.com/developerforce/SalesforceDurableStreamingDemo/blob/3d4a56eac956f744ad6c22e6a8141b6feb57abb9/staticresources/cometdReplayExtension.resource
 *
 * Example usage:
 *
 * ```javascript
 * const jsforce = require('jsforce');
 * const { StreamingExtension } = require('jsforce/api/streaming');
 
 * const conn = new jsforce.Connection({ … });
 *
 * const channel = "/event/My_Event__e";
 * const replayId = -2; // -2 is all retained events
 *
 * const replayExt = new StreamingExtension.Replay(channel, replayId);
 *
 * const fayeClient = conn.streaming.createClient([ replayExt ]);
 *
 * const subscription = fayeClient.subscribe(channel, data => {
 *   console.log('topic received data', data);
 * });
 *
 * subscription.cancel();
 * ```
 */
export class Replay {
  _extensionEnabled: boolean;
  _replay: number | null | undefined;
  _channel: string;

  constructor(channel: string, replayId?: number | null) {
    this._extensionEnabled = replayId != null;
    this._channel = channel;
    this._replay = replayId;
  }

  setExtensionEnabled(extensionEnabled: boolean) {
    this._extensionEnabled = extensionEnabled;
  }

  setReplay(replay: string) {
    this._replay = parseInt(replay, 10);
  }

  setChannel(channel: string) {
    this._channel = channel;
  }

  incoming(message: any, callback: Function) {
    if (message.channel === '/meta/handshake') {
      if (message.ext && message.ext[REPLAY_FROM_KEY] == true) {
        this._extensionEnabled = true;
      }
    } else if (
      message.channel === this._channel &&
      message.data?.event?.replayId
    ) {
      this._replay = message.data.event.replayId;
    }
    callback(message);
  }

  outgoing(message: any, callback: Function) {
    if (message.channel === '/meta/subscribe') {
      if (this._extensionEnabled) {
        if (!message.ext) {
          message.ext = {};
        }
        const replayFromMap = {
          [this._channel]: this._replay,
        };
        // add "ext : { "replay" : { CHANNEL : REPLAY_VALUE }}" to subscribe message
        message.ext[REPLAY_FROM_KEY] = replayFromMap;
      }
    }
    callback(message);
  }
}
