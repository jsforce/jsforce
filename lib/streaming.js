var events     = require('events'),
    util       = require('util'),
    request    = require('request'),
    async      = require('async'),
    _          = require('underscore')._,
    Faye       = require('faye');

/**
 *
 */
var Topic = module.exports = function(streaming, name) {
  this._streaming = streaming;
  this.name = name;
};

Topic.prototype.subscribe = function(listener) {
  this._streaming.subscribe(this.name, listener);
  return this;
};

/*--------------------------------------------*/

/**
 * Streaming API class
 */
var Streaming = function(conn) {
  this._conn = conn;
};

util.inherits(Streaming, events.EventEmitter);

/**
 * Get named topic
 */
Streaming.prototype.topic = function(name) {
  this._topics = this._topics || {};
  var topic = this._topics[name] = 
    this._topics[name] || new Topic(this, name);
  return topic;
};

/**
 * Subscribe topic
 */
Streaming.prototype.subscribe = function(name, listener) {
  if (!this._fayeClient) {
    Faye.Transport.NodeHttp.prototype.batching = false; // prevent streaming API server error
    this._fayeClient = new Faye.Client(this._conn.urls.streaming.base, {});
    this._fayeClient.setHeader('Authorization', 'OAuth '+this._conn.accessToken);
  }
  this._fayeClient.subscribe("/topic/"+name, listener);
  return this;
};

/**
 *
 */
module.exports = Streaming;
