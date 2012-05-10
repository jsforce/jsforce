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
  var client = new Faye.Client(this.urls.streaming.base, {});
  client.setHeader('Authorization', 'OAuth '+this.accessToken);
  client.subscribe("/topic/"+name, listener);
  return this;
};

