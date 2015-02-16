/*global process */

var sf = require('../../../lib/jsforce');

require('../async-check');

/**
 *
 */
module.exports = {

  isNodeJS: true,

  createConnection: function(config) {
    return new sf.Connection({
      loginUrl: config.loginUrl,
      logLevel: config.logLevel
    });
  }

};
