require('dotenv').load();

var _ = require('underscore');
var Promise = require('../../lib/promise');

var testUtils = typeof window === 'undefined' ?
  require('./node/test-utils') :
  require('./browser/test-utils');

var locked = true;

module.exports = _.extend({
  
  assert: require('power-assert'),
 
  establishConnection: function(conn, config, done) {
    function tryLock(cnt, msec) {
      if (cnt === 0) { throw new Error('*** Timeout: cannot lock test user session ***'); }
      return conn.apex.post('/JSforceTestSession/', {}).then(function(result) {
        if (result.success) {
          return;
        } else {
          console.log("... waiting test user session lock to be released ...");
          var deferred = Promise.defer();
          setTimeout(function() { deferred.resolve(); }, msec);
          return deferred.promise.then(function() {
            return tryLock(cnt-1, msec);
          });
        }
      });
    }
    conn.login(config.username, config.password)
      .then(function() { 
        if (config.isolateTest) {
          locked = true;
          return tryLock(20, 30000);
        }
      }) // polling 30 sec x 20 times = 10 min
      .thenCall(done);
  },

  closeConnection: function(conn, done) {
    if (!locked) { return done(); }
    conn.apex.del('/JSforceTestSession/', function (err, result) {
      if (err || !result.success) { throw new Error('Failed to close test session'); }
    }.check(done));
  }

}, testUtils);