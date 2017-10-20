/**
 * @file Manages Streaming APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var events = require('events'),
    inherits = require('inherits'),
    _ = require('lodash/core'),
    Faye   = require('faye'),
    jsforce = require('../core');

/**
 * Streaming API topic class
 *
 * @class Streaming~Topic
 * @param {Streaming} steaming - Streaming API object
 * @param {String} name - Topic name
 */
var Topic = function(streaming, name) {
    this._streaming = streaming;
    this.name = name;
};

/**
 * @typedef {Object} Streaming~StreamingMessage
 * @prop {Object} event
 * @prop {Object} event.type - Event type
 * @prop {Record} sobject - Record information
 */
/**
 * Subscribe listener to topic
 *
 * @method Streaming~Topic#subscribe
 * @param {Callback.<Streaming~StreamingMesasge>} listener - Streaming message listener
 * @returns {Subscription} - Faye subscription object
 */
Topic.prototype.subscribe = function(listener) {
    return this._streaming.subscribe(this.name, listener);
};

/**
 * Unsubscribe listener from topic
 *
 * @method Streaming~Topic#unsubscribe
 * @param {Callback.<Streaming~StreamingMesasge>} listener - Streaming message listener
 * @returns {Streaming~Topic}
 */
Topic.prototype.unsubscribe = function(listener) {
    this._streaming.unsubscribe(this.name, listener);
    return this;
};

/*--------------------------------------------*/

/**
 * Streaming API PlatformEvent class
 *
 * @class Streaming~PlatformEvent
 * @param {Streaming} steaming - Streaming API object
 * @param {String} name - PlatformEvent name
 * @param {String} replay - parameter to specify replay settings for channel: -2 (ALL), -1 (NEW ONLY)
 */
var PlatformEvent = function (streaming, name, replay) {
    this._streaming = streaming;
    this.replay = replay;
    this.name = name;
};

PlatformEvent.prototype.subscribe = function (listener) {
    return this._streaming.subscribeEvent(this.name, listener);
};

PlatformEvent.prototype.unsubscribe = function (listener) {
    this._streaming.unsubscribeEvent(this.name, listener);
    return this;
};

/*--------------------------------------------*/

/**
 * Streaming API Generic Streaming Channel
 *
 * @class Streaming~Channel
 * @param {Streaming} steaming - Streaming API object
 * @param {String} name - Channel name (starts with "/u/")
 */
var Channel = function(streaming, name) {
    this._streaming = streaming;
    this._name = name;
};

/**
 * Subscribe to channel
 *
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Subscription} - Faye subscription object
 */
Channel.prototype.subscribe = function(listener) {
    return this._streaming.subscribe(this._name, listener);
};

Channel.prototype.unsubscribe = function(listener) {
    this._streaming.unsubscribe(this._name, listener);
    return this;
};

Channel.prototype.push = function(events, callback) {
    var isArray = _.isArray(events);
    events = isArray ? events : [ events ];
    var conn = this._streaming._conn;
    if (!this._id) {
        this._id = conn.sobject('StreamingChannel').findOne({ Name: this._name }, 'Id')
            .then(function(rec) { return rec.Id });
    }
    return this._id.then(function(id) {
        var channelUrl = '/sobjects/StreamingChannel/' + id + '/push';
        return conn.requestPost(channelUrl, { pushEvents: events });
    }).then(function(rets) {
        return isArray ? rets : rets[0];
    }).thenCall(callback);
};

/*--------------------------------------------*/

/**
 * CometdReplayExtension class
 *
 * @class
 * @param {String} replay - parameter to specify replay settings for channel: -2 (ALL), -1 (NEW ONLY)
 * @param {String} channel - url of channel
 */
var CometdReplayExtension = function (replay, channel) {
    this.REPLAY_FROM_KEY = "replay";
    this._extensionEnabled = false;
    this._replay = replay;
    this._channel = channel;
}

CometdReplayExtension.prototype.incoming = function (message, callback) {
    if (message.channel === '/meta/handshake') {
        if (message.ext && message.ext[this.REPLAY_FROM_KEY] == true) {
            this._extensionEnabled = true;
        }
    }
    callback(message);
}

CometdReplayExtension.prototype.outgoing = function (message, callback) {
    if (message.channel === '/meta/subscribe') {
        if (this._extensionEnabled) {
            if (!message.ext) {
                message.ext = {};
            }
            var replayFromMap = {};
            replayFromMap[this._channel] = this._replay;
            // add "ext : { "replay" : { CHANNEL : REPLAY_VALUE }}" to subscribe message
            message.ext[this.REPLAY_FROM_KEY] = replayFromMap;
        }
    }
    callback(message);
}

/*--------------------------------------------*/

/**
 * Streaming API class
 *
 * @class
 * @extends events.EventEmitter
 * @param {Connection} conn - Connection object
 */
var Streaming = function(conn) {
    this._conn = conn;
};

inherits(Streaming, events.EventEmitter);

/** @private **/
Streaming.prototype._createClient = function(replay) {
    var endpointUrl = [
        this._conn.instanceUrl,
        // special endpoint "/cometd/replay/xx.x" is only available in 36.0.
        // See https://releasenotes.docs.salesforce.com/en-us/summer16/release-notes/rn_api_streaming_classic_replay.htm
        "cometd" + (replay && this._conn.version === "36.0" ? "/replay" : ""),
        this._conn.version
    ].join('/');
    var fayeClient = new Faye.Client(endpointUrl, {});
    fayeClient.setHeader('Authorization', 'OAuth '+this._conn.accessToken);
    return fayeClient;
};

/** @private **/
Streaming.prototype._getFayeClient = function(channelName) {
    var isGeneric = channelName.indexOf('/u/') === 0;
    var clientType = isGeneric ? 'generic' : 'pushTopic';
    if (!this._fayeClients || !this._fayeClients[clientType]) {
        this._fayeClients = this._fayeClients || {};
        this._fayeClients[clientType] = this._createClient(isGeneric);
        if (this._fayeClients[clientType]._dispatcher.getConnectionTypes().indexOf('callback-polling') === -1) {
            // prevent streaming API server error
            this._fayeClients[clientType]._dispatcher.selectTransport('long-polling');
            this._fayeClients[clientType]._dispatcher._transport.batching = false;
        }
    }
    return this._fayeClients[clientType];
};


/**
 * Get named topic
 *
 * @param {String} name - Topic name
 * @returns {Streaming~Topic}
 */
Streaming.prototype.topic = function(name) {
    this._topics = this._topics || {};
    var topic = this._topics[name] =
        this._topics[name] || new Topic(this, name);
    return topic;
};

/**
 * Get Channel for Id
 * @param {String} channelId - Id of StreamingChannel object
 * @returns {Streaming~Channel}
 */
Streaming.prototype.channel = function(channelId) {
    return new Channel(this, channelId);
};

/**
 * Get named event
 *
 * @param {String} name - Event name
 * @returns {Streaming~Event}
 */
Streaming.prototype.event = function (name, replay) {
    this._events = this._events || {};
    var event = this._events[name] =
        this._events[name] || new PlatformEvent(this, name, replay);
    return event;
};

/**
 * Subscribe to Platform Events
 *
 * @param {String} name - Event name
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Subscription} - Faye subscription object
 */
Streaming.prototype.subscribeEvent = function (name, listener) {
    var platformEvent = this._events[name];
    var channelName = name.indexOf('/') === 0 ? name : '/event/' + name;
    var fayeClient = this._getFayeClient(channelName);
    var cometdReplayExtension = new CometdReplayExtension(platformEvent.replay, channelName);
    fayeClient.addExtension(cometdReplayExtension);
    return fayeClient.subscribe(channelName, listener);
};

/**
 * Unsubscribe Platform Events
 *
 * @param {String} name - Event name
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Streaming}
 */
Streaming.prototype.unsubscribeEvent = function (name, listener) {
    var channelName = name.indexOf('/') === 0 ? name : '/event/' + name;
    var fayeClient = this._getFayeClient(channelName);
    fayeClient.unsubscribe(channelName, listener);
    return this;
};

/**
 * Subscribe topic/channel
 *
 * @param {String} name - Topic name
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Subscription} - Faye subscription object
 */
Streaming.prototype.subscribe = function(name, listener) {
    var channelName = name.indexOf('/') === 0 ? name : '/topic/' + name;
    var fayeClient = this._getFayeClient(channelName);
    return fayeClient.subscribe(channelName, listener);
};

/**
 * Unsubscribe topic
 *
 * @param {String} name - Topic name
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Streaming}
 */
Streaming.prototype.unsubscribe = function(name, listener) {
    var channelName = name.indexOf('/') === 0 ? name : '/topic/' + name;
    var fayeClient = this._getFayeClient(channelName);
    fayeClient.unsubscribe(channelName, listener);
    return this;
};

/*--------------------------------------------*/

/**
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
    conn.streaming = new Streaming(conn);
});

module.exports = Streaming;
