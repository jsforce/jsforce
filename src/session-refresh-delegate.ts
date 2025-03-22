/**
 *
 */
import { getLogger, Logger } from './util/logger';
import { Callback, Schema } from './types';
import Connection from './connection';
import { TokenResponse } from './oauth2';

/**
 *
 */
export type SessionRefreshFunc<S extends Schema> = (
  conn: Connection<S>,
  callback: Callback<string, TokenResponse>,
) => void;

/**
 *
 */
export class SessionRefreshDelegate<S extends Schema> {
  static _logger: Logger = getLogger('session-refresh-delegate');

  private _refreshFn: SessionRefreshFunc<S>;
  private _conn: Connection<S>;
  private _logger: Logger;
  private _lastRefreshedAt: number | void = undefined;
  private _refreshPromise: Promise<void> | void = undefined;

  constructor(conn: Connection<S>, refreshFn: SessionRefreshFunc<S>) {
    this._conn = conn;
    this._logger = conn._logLevel
      ? SessionRefreshDelegate._logger.createInstance(conn._logLevel)
      : SessionRefreshDelegate._logger;
    this._refreshFn = refreshFn;
  }

  /**
   * Refresh access token
   * @private
   */
  async refresh(since: number) {
    // Callback immediately When refreshed after designated time
    if (this._lastRefreshedAt && this._lastRefreshedAt > since) {
      return;
    }
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
    } catch(err) {
      throw new Error(`Unable to refresh session due to: ${(err as Error).message}`)
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

export default SessionRefreshDelegate;
