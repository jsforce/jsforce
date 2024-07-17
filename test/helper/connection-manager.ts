import { Connection, ConnectionConfig, Schema } from 'jsforce';
import { getConnectionConfig } from './connection';

export type ConnectionManagerConfig = ConnectionConfig & {
  username: string;
  password: string;
};

/**
 *
 */
export default class ConnectionManager {
  _config: ConnectionManagerConfig;

  constructor(config: ConnectionManagerConfig) {
    this._config = config;
  }

  createConnection<S extends Schema = Schema>() {
    return new Connection<S>(getConnectionConfig(this._config));
  }

  async establishConnection<S extends Schema>(conn: Connection<S>) {
    const config = this._config;
    const username = config.username;

    if (username && config.password) {
      await conn.login(username, config.password);
    } else {
      throw new Error('Set SF_USERNAME and SF_PASSWORD.');
    }
  }
}
