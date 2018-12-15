import { Connection } from '../..';
import { delay } from '../util';

/**
 *
 */
export default class UserPool {
  _config: any; // TODO: remove any
  _conn: Connection;
  _login: Promise<any> | void;

  constructor(config: any, conn: Connection) { // TODO: remove any
    this._config = config;
    this._conn = conn;
    const { poolUsername, poolPassword } = config;
    if (poolUsername && poolPassword) {
      this._login = this._conn.login(poolUsername, poolPassword);
    }
  }

  async checkout(): Promise<void> {
    const config = this._config;
    const conn = this._conn;
    await this._login;
    const res = await conn.apex.post('/JSforceTestUserPool/', { clientName: config.poolClient });
    if (res.username) {
      console.log('Username:', res.username);
      return res.username;
    }
    console.log('... Waiting users available in UserPool...');
    await delay(30 * 1000);
    return this.checkout();
  }

  async checkin(username: string): Promise<any> {
    return this._conn.apex.delete(`/JSforceTestUserPool/${username}`);
  }
}
