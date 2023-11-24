import fs from 'fs';
import path from 'path';
import { BaseRegistry } from './base';

/**
 *
 */
function getDefaultConfigFilePath() {
  const homeDir =
    process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
  if (!homeDir) {
    throw new Error(
      'cannot find user home directory to store configuration files',
    );
  }
  return path.join(homeDir, '.jsforce', 'config.json');
}

/**
 *
 */
export class FileRegistry extends BaseRegistry {
  _configFilePath: string;

  constructor({ configFilePath }: { configFilePath?: string }) {
    super();
    this._configFilePath = configFilePath || getDefaultConfigFilePath();
    try {
      const data = fs.readFileSync(this._configFilePath, 'utf-8');
      this._registryConfig = JSON.parse(data);
    } catch (e) {
      //
    }
  }

  _saveConfig() {
    const data = JSON.stringify(this._registryConfig, null, 4);
    try {
      fs.writeFileSync(this._configFilePath, data);
      fs.chmodSync(this._configFilePath, '600');
    } catch (e) {
      const configDir = path.dirname(this._configFilePath);
      fs.mkdirSync(configDir);
      fs.chmodSync(configDir, '700');
      fs.writeFileSync(this._configFilePath, data);
      fs.chmodSync(this._configFilePath, '600');
    }
  }
}
