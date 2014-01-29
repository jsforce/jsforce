/*global process */
/**
 *
 */
var fs = require('fs'),
    _  = require('underscore');

var homeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
var configDir = homeDir + "/.salesforce";
var configFile = configDir + "/config.json";

var defaultClient = {
  clientId: process.env.SF_OAUTH2_CLIENT_ID,
  clientSecret: process.env.SF_OAUTH2_CLIENT_SECRET,
  redirectUri: process.env.SF_OAUTH2_REDIRECT_URI
};

/**
 * @private
 */
var registryConfig = {};
try {
  var data = fs.readFileSync(configFile);
  registryConfig = JSON.parse(data);
} catch(e) {}

/**
 * @private
 */
function saveConfig() {
  var data = JSON.stringify(registryConfig, null, 4);
  try {
    fs.writeFileSync(configFile, data);
    fs.chmodSync(configFile, "600");
  } catch(e) {
    fs.mkdirSync(configDir);
    fs.chmodSync(configDir, "700");
    fs.writeFileSync(configFile, data);
    fs.chmodSync(configFile, "600");
  }
}

function getClients() {
  return registryConfig.clients || (registryConfig.clients = {});
}

function getConnections() {
  return registryConfig.connections || (registryConfig.connections = {});
}

function getConnection(name) {
  if (!name) { name = registryConfig["default"]; }
  var connections = getConnections();
  var connConfig = connections[name];
  if (connConfig) { 
    connConfig = _.clone(connConfig);
    if (connConfig.client) {
      connConfig.oauth2 = _.clone(getClient(connConfig.client));
    }
    delete connConfig.client;
  }
  return connConfig;
}

function saveConnection(name, connConfig) {
  var connections = getConnections();
  var clientId = connConfig.oauth2 && connConfig.oauth2.clientId;
  connConfig = _.clone(connConfig);
  connConfig.client = findClientNameById(clientId);
  delete connConfig.oauth2;
  connections[name] = connConfig;
  saveConfig();
}

function setDefaultConnection(name) {
  registryConfig["default"] = name;
  saveConfig();
}

function findClientNameById(clientId) {
  var clients = getClients();
  for (var name in clients) {
    var client = clients[name];
    if (client.clientId === clientId) {
      return name;
    }
  }
  return null;
}

function getClient(name) {
  if (!name) { return defaultClient; }
  var clientConfig = getClients()[name];
  return clientConfig && _.clone(clientConfig);
}

function registerClient(name, clientConfig) {
  var clients = getClients();
  clients[name] = clientConfig;
  saveConfig();
}


/**
 *
 */
module.exports = {
  getConnection: getConnection,
  saveConnection: saveConnection,
  setDefaultConnection: setDefaultConnection,
  findClientNameById: findClientNameById,
  getClient: getClient,
  registerClient: registerClient
};

