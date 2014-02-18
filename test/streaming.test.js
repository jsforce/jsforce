/*global describe, it, before */
var testUtils = require('./helper/test-utils'),
    assert = testUtils.assert;

var _      = require('underscore'),
    sf     = require('../lib/jsforce'),
    config = require('./config/streaming');


/**
 *
 */
describe("streaming", function() {

  this.timeout(40000); // set timeout to 40 sec.

/*------------------------------------------------------------------------*/
if (testUtils.isNodeJS) {
  
  var conn = new testUtils.createConnection(config);

  /**
   *
   */
  before(function(done) {
    testUtils.establishConnection(conn, config, done);
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
}
/*------------------------------------------------------------------------*/

});

