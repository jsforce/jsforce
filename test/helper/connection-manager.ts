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

    // Establish a connection using the access token from the env var (retrieved from sf CLI).
    //
    // There are some other OAuth flow availables but each has its own quirks:
    // * Client Credentials: requires an ECA to deploy when setting up scratch org
    // * Username-Password: this flows doesn't work when running tests in parallel because each new session ID request invalidates old ones
    // * Web Server: too flaky/slow for test runs in parallel
    conn._establish({
      accessToken: config.accessToken,
      instanceUrl: config.loginUrl,
    })
  }
}
