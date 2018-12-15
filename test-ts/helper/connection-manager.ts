import { Connection } from '../..';
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
  _config: any; // TODO: remove any
  _userPool: UserPool | void;
  _idmap: { [id:string]: string };

  constructor(config: any) { // TODO: remove any
    this._config = config;
    if (config.poolUsername && config.poolPassword) {
      const conn = this.createConnection();
      this._userPool = new UserPool(config, conn);
    }
    this._idmap = {};
  }

  createConnection() {
    return new Connection(getConnectionConfig(this._config));
  }

  async establishConnection(conn: Connection) {
    const userPool = this._userPool;
    const config = this._config;
    const username = await (userPool ? userPool.checkout() : config.username);
    // eslint-disable-next-line no-param-reassign
    (conn as any).__username = username; // for later checkin
    await conn.login(username, config.password);
  }

  async closeConnection(conn: Connection) {
    const userPool = this._userPool;
    try {
      await conn.apex.delete('/JSforceTestData/');
      await (userPool ? userPool.checkin((conn as any).__username) : null);
      // eslint-disable-next-line no-param-reassign
      delete (conn as any).__username;
    } catch (e) {
      //
    }
  }
}
