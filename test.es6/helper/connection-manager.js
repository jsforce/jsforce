import jsforce from '../..';
import UserPool from './user-pool';
import { getConnectionConfig as getNodeConnectionConfig } from './node/connection';
import { getConnectionConfig as getBrowserConnectionConfig } from './browser/connection';
import { isNodeJS } from './env';

const getConnectionConfig =
  isNodeJS() ? getNodeConnectionConfig : getBrowserConnectionConfig;

/**
 *
 */
export default class ConnectionManager {
  constructor(config) {
    this._config = config;
    if (config.poolUsername && config.poolPassword) {
      this._userPool = new UserPool(config, this._factory);
    }
    this._idmap = {};
  }

  createConnection() {
    return new jsforce.Connection(getConnectionConfig(this._config));
  }

  async establishConnection(conn) {
    const userPool = this._userPool;
    const config = this._config;
    const username = await (userPool ? userPool.checkout() : config.username);
    // eslint-disable-next-line no-param-reassign
    conn.__username = username; // for later checkin
    await conn.login(username, config.password);
  }

  async closeConnection(conn) {
    const userPool = this._userPool;
    await conn.apex.delete('/JSforceTestData/');
    await (userPool ? userPool.checkin(conn.__username) : null);
    // eslint-disable-next-line no-param-reassign
    delete conn.__username;
  }
}
