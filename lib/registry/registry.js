/*global process */
/**
 * @file Registry for connection information, cached in local file system
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var _  = require('lodash/core');
var Connection = require('../connection');

/*  */
var Registry = function(configFilePath) {
  this._registryConfig = {};
};

/**
 * @private
 * @override
 */
Registry.prototype._saveConfig = function() {
  throw new Error('_saveConfig must be implemented in subclass');
};

Registry.prototype._getClients = function() {
  return this._registryConfig.clients || (this._registryConfig.clients = {});
};

Registry.prototype._getConnections = function() {
  return this._registryConfig.connections || (this._registryConfig.connections = {});
};

Registry.prototype.getConnectionNames = function() {
  return Object.keys(this._getConnections());
};

Registry.prototype.getConnection = function(name) {
  return new Connection(this.getConnectionConfig(name));
};

Registry.prototype.getConnectionConfig = function(name) {
  if (!name) { name = this._registryConfig["default"]; }
  var connections = this._getConnections();
  var connConfig = connections[name];
  if (connConfig) {
    connConfig = _.clone(connConfig);
    if (connConfig.client) {
      connConfig.oauth2 = _.clone(this.getClient(connConfig.client));
    }
    delete connConfig.client;
  }
  return connConfig;
};

Registry.prototype.saveConnectionConfig = function(name, connConfig) {
  var connections = this._getConnections();
  connConfig = _.clone(connConfig);
  if (connConfig.oauth2) {
    var clientName = this._findClientName(connConfig.oauth2);
    if (clientName) {
      connConfig.client = clientName;
    }
    delete connConfig.oauth2;
  }
  connections[name] = connConfig;
  this._saveConfig();
};

Registry.prototype._findClientName = function(clientConfig) {
  var clients = this._getClients();
  for (var name in clients) {
    var client = clients[name];
    if (client.clientId === clientConfig.clientId &&
        (client.loginUrl || 'https://login.salesforce.com') === clientConfig.loginUrl) {
      return name;
    }
  }
  return null;
};

Registry.prototype.setDefaultConnection = function(name) {
  this._registryConfig["default"] = name;
  this._saveConfig();
};

Registry.prototype.removeConnectionConfig = function(name) {
  var connections = this._getConnections();
  delete connections[name];
  this._saveConfig();
};

Registry.prototype.getClient = function(name) {
  var clientConfig = this._getClients()[name];
  return clientConfig && _.clone(clientConfig);
};

Registry.prototype.getClientNames = function() {
  return Object.keys(this._getClients());
};

Registry.prototype.registerClient = function(name, clientConfig) {
  var clients = this._getClients();
  clients[name] = clientConfig;
  this._saveConfig();
};



/* ------------------------------------------------------------------------- */

module.exports = Registry;
