/*global process */

var jsforce = require('../../..');

/**
 *
 */
function ConnectionFactory(config) {
  this._config = config;
}

ConnectionFactory.prototype.createConnection = function() {
  return new jsforce.Connection({
    loginUrl: this._config.loginUrl,
    proxyUrl: this._config.proxyUrl,
    logLevel: this._config.logLevel
  });
};

module.exports = ConnectionFactory;
