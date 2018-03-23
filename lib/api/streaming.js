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
 * Subscribe to hannel
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
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.streaming = new Streaming(conn);
});


module.exports = Streaming;
