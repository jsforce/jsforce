var events     = require('events')
  , request    = require('request')
  , async      = require('async')
  , _          = require('underscore')._
  , Faye       = require('faye')
  , Connection = require('./connection')
  , Topic      = require('./topic')
  ;

/**
 * Get named topic
 */
Connection.prototype.topic = function(name) {
  this._topics = this._topics || {};
  var topic = this._topics[name] = 
    this._topics[name] || new Topic(name, this);
  return topic;
};

/**
 * Subscribe topic
 */
Connection.prototype.subscribe = function(name, listener) {
  if (!this._fayeClient) {
    Faye.Transport.NodeHttp.prototype.batching = false // prevent streaming API server error
    this._fayeClient = new Faye.Client(this.urls.streaming.base, {});
    this._fayeClient.setHeader('Authorization', 'OAuth '+this.accessToken);
  }
  this._fayeClient.subscribe("/topic/"+name, listener);
  return this;
};

