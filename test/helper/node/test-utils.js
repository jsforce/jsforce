/*global process */

var sf = require('../../../lib/salesforce');
/**
 * Supporting power-assert
 */
require('espower-loader')({
  // directory where match starts with
  cwd: process.cwd(),
  // glob pattern using minimatch module
  pattern: 'test/**/*.test.js'
});

require('../async-check');

/**
 *
 */
module.exports = {

  isNodeJS: true,

  assert: require('power-assert'),

  createConnection: function(config) {
    return new sf.Connection({
      loginUrl: config.loginUrl,
      logLevel: config.logLevel
    });
  },

  establishConnection: function(conn, config, done) {
    conn.login(config.username, config.password, function(err, result) {
      if (err) { throw err; }
      if (!conn.accessToken) { throw new Error("No access token. Invalid login."); }
    }.check(done));
  }

};
