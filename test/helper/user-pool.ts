import type { Connection, Schema } from 'jsforce';
import { delay } from '../util';

export type UserPoolConfig = {
  poolUsername?: string;
  poolPassword?: string;
  poolClient?: string;
};

/**
 *
 */
export default class UserPool<S extends Schema = Schema> {
  _config: UserPoolConfig;
  _conn: Connection<S>;
  _login: Promise<any> | void;

  constructor(config: UserPoolConfig, conn: Connection<S>) {
    this._config = config;
    this._conn = conn;
    const { poolUsername, poolPassword } = config;
    if (poolUsername && poolPassword) {
      this._login = this._conn.login(poolUsername, poolPassword);
    }
  }

  async checkout(): Promise<string> {
    const config = this._config;
    const conn = this._conn;
    await this._login;
    const res = await conn.apex.post('/JSforceTestUserPool/', {
      clientName: config.poolClient,
    });
    if (res.username) {
      console.log('Username:', res.username);
      return res.username;
    }
    console.log('... Waiting users available in UserPool...');
    await delay(30 * 1000);
    return this.checkout();
  }

  async checkin(username: string): Promise<void> {
    return this._conn.apex.delete(`/JSforceTestUserPool/${username}`);
  }
}
