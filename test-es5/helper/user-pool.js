var jsforce = require('../../lib/jsforce');
var Promise = jsforce.Promise;

function wait(msec) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() { resolve(); }, msec);
  });
}

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
      if (res.username) {
        console.log('Username:', res.username);
        return res.username;
      } else {
        console.log('... Waiting users available in UserPool...');
        return wait(30*1000).then(function() {
          return _this.checkout();
        });
      }
    });
  });
};

UserPool.prototype.checkin = function(username) {
  return this._conn.apex.delete('/JSforceTestUserPool/' + username);
};

module.exports = UserPool;
