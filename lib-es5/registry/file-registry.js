var inherits = require('inherits');
var fs = require('fs');
var path = require('path');
var Registry = require('./registry');

/* ------------------------------------------------------------------------- */

var FileRegistry = function(configFilePath) {
  FileRegistry.super_.call(this);
  this._configFilePath = configFilePath || this._getDefaultConfigFilePath();
  try {
    var data = fs.readFileSync(this._configFilePath, 'utf-8');
    this._registryConfig = JSON.parse(data);
  } catch(e) {}
};

inherits(FileRegistry, Registry);

/**
 *
 */
FileRegistry.prototype._getDefaultConfigFilePath = function() {
  var homeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  var configDir = homeDir + "/.jsforce";
  return configDir + "/config.json";
};

/**
 * @private
 */
FileRegistry.prototype._saveConfig = function() {
  var data = JSON.stringify(this._registryConfig, null, 4);
  try {
    fs.writeFileSync(this._configFilePath, data);
    fs.chmodSync(this._configFilePath, "600");
  } catch(e) {
    var configDir = path.dirname(this._configFilePath);
    fs.mkdirSync(configDir);
    fs.chmodSync(configDir, "700");
    fs.writeFileSync(this._configFilePath, data);
    fs.chmodSync(this._configFilePath, "600");
  }
};

/**
 *
 */
module.exports = FileRegistry;
