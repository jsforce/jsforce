/*global process */

var sf = require('../../../lib/jsforce');

require('../async-check');

/**
 *
 */
module.exports = {

  isBrowser: true,

  createConnection: function(config) {
    var conn = new sf.Connection({
      loginUrl: config.loginUrl,
      proxyUrl: config.proxyUrl,
      logLevel: config.logLevel,
    });
    return conn;
  }
};