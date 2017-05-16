/* @flow */
import { getLogger, Logger } from './util/logger';
import type { Callback } from './types';
import Connection from './connection';

/**
 *
 */
export default class SessionRefreshDelegate {
  static _logger: Logger = getLogger('session-refresh-delegate');

  _refreshFn: (Connection, Callback<string>) => any;
  _conn: Connection;
  _logger: Logger;
  _lastRefreshedAt: ?number;
  _refreshPromise: ?Promise<void>;

  constructor(conn: Connection, refreshFn: (Connection, Callback<string>) => any) {
    this._conn = conn;
    this._logger =
      conn._logLevel ?
      SessionRefreshDelegate._logger.createInstance(conn._logLevel) :
      SessionRefreshDelegate._logger;
    this._refreshFn = refreshFn;
  }

  /**
   * Refresh access token
   * @private
   */
  async refresh(since: number) {
    // Callback immediately When refreshed after designated time
    if (this._lastRefreshedAt && this._lastRefreshedAt > since) { return; }
    if (this._refreshPromise) {
      await this._refreshPromise;
      return;
    }
    try {
      this._logger.info('<refresh token>');
      this._refreshPromise = new Promise((resolve, reject) => {
        this._refreshFn(this._conn, (err, accessToken, res) => {
          if (!err) {
            this._logger.debug('Connection refresh completed.');
            this._conn.accessToken = accessToken;
            this._conn.emit('refresh', accessToken, res);
            resolve();
          } else {
            reject(err);
          }
        });
      });
      await this._refreshPromise;
      this._logger.info('<refresh complete>');
    } finally {
      this._refreshPromise = undefined;
      this._lastRefreshedAt = Date.now();
    }
  }

  isRefreshing(): boolean {
    return !!this._refreshPromise;
  }

  async waitRefresh() {
    return this._refreshPromise;
  }
}
