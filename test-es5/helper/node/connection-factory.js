 /*global process */

 var jsforce = require('../../../lib/jsforce');

 /**
  *
  */
 function ConnectionFactory(config) {
   this._config = config;
 }

 ConnectionFactory.prototype.createConnection = function() {
   return new jsforce.Connection({
     loginUrl: this._config.loginUrl,
     logLevel: this._config.logLevel
   });
 };

 module.exports = ConnectionFactory;
