var _ = require('lodash/core');
var Promise = require('../../lib/promise');

var ConnectionFactory = typeof window === 'undefined' ?
  require('./node/connection-factory') :
  require('./browser/connection-factory');

var UserPool = require('./user-pool');

require('./async-check');


/**
 *
 */
var TestEnv = module.exports = function(config) {
  this._config = config;
  this._factory = new ConnectionFactory(config);
  if (config.poolUsername && config.poolPassword) {
    this._userPool = new UserPool(config, this._factory);
  }
  this._idmap = {};
};

TestEnv.assert = require('power-assert');

TestEnv.isNodeJS = typeof window === 'undefined';

TestEnv.prototype.createConnection = function() {
  return this._factory.createConnection();
};

TestEnv.prototype.establishConnection = function(conn, done) {
  var userPool = this._userPool;
  var config = this._config;
  return (
    userPool ?
    userPool.checkout() :
    Promise.resolve(this._config.username)
  ).then(function(username) {
    conn.__username = username; // for later checkin
    return conn.login(username, config.password);
  }).thenCall(done);
};

TestEnv.prototype.closeConnection = function(conn, done) {
  var userPool = this._userPool;
  return conn.apex.delete('/JSforceTestData/').then(function() {
    return (
      userPool ?
      userPool.checkin(conn.__username) :
      Promise.resolve()
    ).then(function() {
      delete conn.__username;
      });
  }).thenCall(done);
};
