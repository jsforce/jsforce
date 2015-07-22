var jsforce = require('../../lib/jsforce');

/**
 *
 */
var UserPool = function(config, factory) {
  this._config = config;
  this._factory = factory;
  var poolUsername = config.poolUsername;
  var poolPassword = config.poolPassword;
  if (poolUsername && poolPassword) {
    this._conn = factory.createConnection();
    this._login = this._conn.login(poolUsername, poolPassword);
  }
};

UserPool.prototype.checkout = function() {
  var _this = this;
  var config = this._config;
  var conn = this._conn;
  return this._login.then(function() {
    return conn.apex.post('/JSforceTestUserPool/', { clientName: config.poolClient }).then(function(res) {
      return res.username;
    });
  });
};

UserPool.prototype.checkin = function(username) {
  return this._conn.apex.delete('/JSforceTestUserPool/' + username);
};

module.exports = UserPool;
