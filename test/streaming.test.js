/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('underscore'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("streaming", function() {

  this.timeout(40000); // set timeout to 40 sec.

/*------------------------------------------------------------------------*/
if (TestEnv.isNodeJS) {

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
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
      conn.streaming.topic('JSforceTestAccountUpdates').subscribe(listener);
      // wait 5 secs for subscription complete
      setTimeout(function() {
        conn.sobject('Account').create({
          Name: 'My New Account #'+Date.now()
        }, function() {});
      }, 5000);
    });
  });

  /**
   *
   */
  describe("subscribe to generic streaming channel", function() {
    var channelName = '/u/JSforceTestChannel';

    before(function(done) {
      conn.sobject('StreamingChannel').create({ Name: channelName }, done);
    });

    it("should receive custom streaming event", function(done) {
      var listener = function(msg) {
        assert(msg.payload === 'hello, world');
      }.check(done);
      conn.streaming.channel(channelName).subscribe(listener);

      // wait 5 secs for subscription complete
      setTimeout(function() {
        conn.streaming.channel(channelName).push({
          payload: 'hello, world',
          userIds: []
        }, function(err, res) {
          assert(res.fanoutCount === -1);
          assert(res.userOnlineStatus);
        });
      }, 5000);
    });

    after(function(done) {
      conn.sobject('StreamingChannel').find({ Name: channelName }).destroy(done);
    });
  });
}
/*------------------------------------------------------------------------*/

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
