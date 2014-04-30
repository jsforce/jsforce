/*global process */

var sf = require('../../../lib/jsforce');

require('../async-check');

/**
 *
 */
module.exports = {

  isBrowser: true,

  assert: require('power-assert'),

  createConnection: function(config) {
    var conn = new sf.Connection({
      loginUrl: config.loginUrl,
      proxyUrl: config.proxyUrl,
      logLevel: config.logLevel,
    });
    return conn;
  },

  establishConnection: function(conn, config, done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { throw err; }
      if (!conn.accessToken) { throw new Error("No access token. Invalid login."); }
    }.check(done));
  }

};