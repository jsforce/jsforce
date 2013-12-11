/*global describe, it, before */
var assert = require('power-assert'),
    _      = require('underscore'),
    sf     = require('../lib/salesforce'),
    config = require('./config/streaming');


/**
 *
 */
describe("streaming", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { done(err); }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
      done();
    });
  });

  /**
   *
   */
  describe("subscribe to topic and create account", function() {
    it("should receive event account created", function(done) {
      var listener = function(msg) {
        assert.equal("created", msg.event.type);
        assert.ok(typeof msg.sobject.Name === 'string');
        assert.ok(typeof msg.sobject.Id === 'string');
      }.check(done);
      conn.streaming.topic(config.pushTopicName).subscribe(listener);
      // wait 5 secs for subscription complete
      setTimeout(function() {
        conn.sobject('Account').create({
          Name: 'My New Account #'+Date.now()
        }, function() {});
      }, 5000);
    });
  });

});

