import { Connection, ConnectionConfig, Schema } from '../../src/index';
import UserPool, { UserPoolConfig } from './user-pool';
import { getConnectionConfig } from './connection';

export type ConnectionManagerConfig = UserPoolConfig &
  ConnectionConfig & {
    username: string;
    password: string;
  };

/**
 *
 */
export default class ConnectionManager {
  _config: ConnectionManagerConfig;
  _userPool: UserPool | void;
  _idmap: { [id: string]: string };

  constructor(config: ConnectionManagerConfig) {
    this._config = config;
    if (config.poolUsername && config.poolPassword) {
      const conn = this.createConnection();
      this._userPool = new UserPool(config, conn);
    }
    this._idmap = {};
  }

  createConnection<S extends Schema = Schema>() {
    return new Connection<S>(getConnectionConfig(this._config));
  }

  async establishConnection<S extends Schema>(conn: Connection<S>) {
    const userPool = this._userPool;
    const config = this._config;
    const username = await (userPool ? userPool.checkout() : config.username);

    // eslint-disable-next-line no-param-reassign
    (conn as any).__username = username; // for later checkin
    if (username && config.password) {
      await conn.login(username, config.password);
    } else {
      throw new Error('Set SF_USERNAME and SF_PASSWORD.');
    }
  }

  async closeConnection<S extends Schema>(conn: Connection<S>) {
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
