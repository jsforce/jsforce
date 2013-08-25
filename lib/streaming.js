var events     = require('events'),
    util       = require('util'),
    request    = require('request'),
    async      = require('async'),
    _          = require('underscore')._,
    Faye       = require('faye');

/**
 * Streaming API topic class
 *
 * @class
 * @constructor
 * @param {Streaming} steaming - Streaming API object
 * @param {String} name - Topic name
 */
var Topic = module.exports = function(streaming, name) {
  this._streaming = streaming;
  this.name = name;
};

/**
 * @typedef StreamingMessage
 * @prop {Object} event
 * @prop {Object} event.type - Event type
 * @prop {Record} sobject - Record information
 */
/**
 * Subscribe listener to topic
 *
 * @param {Callback.<StreamingMesasge>} listener - Streaming message listener
 * @returns {Topic}
 */
Topic.prototype.subscribe = function(listener) {
  this._streaming.subscribe(this.name, listener);
  return this;
};

/*--------------------------------------------*/

/**
 * Streaming API class
 *
 * @class
 * @constructor
 * @extends events.EventEmitter
 * @param {Connection} conn - Connection object
 */
var Streaming = function(conn) {
  this._conn = conn;
};

util.inherits(Streaming, events.EventEmitter);

/** @private **/
Streaming.prototype._baseUrl = function(name) {
  return [ this._conn.instanceUrl, "cometd", this._conn.version ].join('/');
};

/**
 * Get named topic
 *
 * @param {String} name - Topic name
 * @returns {Topic}
 */
Streaming.prototype.topic = function(name) {
  this._topics = this._topics || {};
  var topic = this._topics[name] = 
    this._topics[name] || new Topic(this, name);
  return topic;
};

/**
 * Subscribe topic
 *
 * @param {String} name - Topic name
 * @param {Callback.<StreamingMessage>} listener - Streaming message listener
 * @returns {Streaming}
 */
Streaming.prototype.subscribe = function(name, listener) {
  if (!this._fayeClient) {
    Faye.Transport.NodeHttp.prototype.batching = false; // prevent streaming API server error
    this._fayeClient = new Faye.Client(this._baseUrl(), {});
    this._fayeClient.setHeader('Authorization', 'OAuth '+this._conn.accessToken);
  }
  this._fayeClient.subscribe("/topic/"+name, listener);
  return this;
};

module.exports = Streaming;
