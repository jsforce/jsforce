var vows   = require('vows'),
    assert = require('assert'),
    _      = require('underscore')._,
    Cache  = require('../lib/cache');

var cache = new Cache();
var getTime = function(callback) {
  setTimeout(function() {
    callback(null, Date.now());
  }, 1000);
};
var getTimeResCached, getTimeCached;
var t1, t2, t3, t4, t5;

vows.describe("cache").addBatch({

  "create and call response-cached function" : {
    topic : function() {
      getTimeResCached = cache.makeResponseCacheable(getTime, null, { key: 'getTime' });
      getTimeResCached(this.callback);
    },

    "should return the time" : function(t) {
      t1 = t;
      assert.ok(_.isNumber(t1));
    },

  ", then call response-cached function again" : {
    topic : function() {
      getTimeResCached(this.callback);
    },

    "should get different time" : function(t) {
      t2 = t;
      assert.ok(_.isNumber(t2));
      assert.ok(t1 < t2);
    },

  ", then create and call cached function" : {
    topic : function() {
      getTimeCached = cache.makeCacheable(getTime, null, { key: 'getTime' });
      getTimeCached(this.callback);
    },

    "should get time which equals to latest fn call result": function(t) {
      t3 = t;
      assert.ok(_.isNumber(t3));
      assert.equal(t3, t2);
    },

  ", then call cached function with no callback" : {
    topic : function() {
      return getTimeCached();
    },

    "should get same time which equals to latest fn call result": function(t) {
      t4 = t;
      assert.ok(_.isNumber(t4));
      assert.equal(t4, t3);
    },

  ", then clear cache and call cache-first function" : {
    topic : function() {
      cache.clear();
      getTimeCached(this.callback);
    },

    "should get time much newer than the latest." : function(t) {
      t5 = t;
      assert.ok(_.isNumber(t5));
      assert.ok(t4 < t5);
    }

  }}}}}

}).export(module);
