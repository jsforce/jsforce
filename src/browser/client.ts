/**
 * @file Browser client connection management class
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { EventEmitter } from 'events';
import Connection, { ConnectionConfig } from '../connection';
import OAuth2, { TokenResponse } from '../oauth2';

/**
 * @private
 */
function popupWin(url: string, w: number, h: number) {
  const left = screen.width / 2 - w / 2;
  const top = screen.height / 2 - h / 2;
  return window.open(
    url,
    undefined,
    `location=yes,toolbar=no,status=no,menubar=no,width=${w},height=${h},top=${top},left=${left}`,
  );
}

/**
 * @private
 */
function handleCallbackResponse() {
  const res = checkCallbackResponse();
  const state = localStorage.getItem('jsforce_state');
  if (res && state && res.body.get('state') === state) {
    localStorage.removeItem('jsforce_state');
    const [prefix, promptType] = state.split('.');
    const cli = new BrowserClient(prefix);
    if (res.success) {
      cli._storeTokens(Object.fromEntries(res.body) as TokenResponse);
      location.hash = '';
    } else {
      cli._storeError(res.body);
    }
    if (promptType === 'popup') {
      window.close();
    }
    return true;
  }
}

/**
 * @private
 */
function checkCallbackResponse() {
  let params;
  if (window.location.hash) {
    params = new URLSearchParams(window.location.hash.substring(1));
    if (params.get('access_token')) {
      return { success: true, body: params };
    }
  } else if (window.location.search) {
    params = new URLSearchParams(window.location.search.substring(1));
    if (params.get('error')) {
      return { success: false, body: params };
    }
  }
}

/**
 *
 */
export type LoginOptions = {
  scope?: string;
  size?: { width: number; height: number };
};

/**
 *
 */
const DEFAULT_POPUP_WIN_WIDTH = 912;
const DEFAULT_POPUP_WIN_HEIGHT = 513;

/** @private **/
let clientIdx = 0;

/**
 *
 */
export class BrowserClient extends EventEmitter {
  _prefix: string;
  _config: ConnectionConfig | undefined;
  _connection: Connection | undefined;

  /**
   *
   */
  constructor(prefix?: string) {
    super();
    this._prefix = prefix || 'jsforce' + clientIdx++;
  }

  get connection(): Connection {
    if (!this._connection) {
      this._connection = new Connection(this._config);
    }
    return this._connection;
  }

  /**
   *
   */
  init(config: ConnectionConfig) {
    if (handleCallbackResponse()) {
      return;
    }
    this._config = config;
    const tokens = this._getTokens();
    if (tokens) {
      this.connection._establish(tokens);
      setTimeout(() => {
        this.emit('connect', this.connection);
      }, 10);
    }
  }

  /**
   *
   */
  login(options: LoginOptions = {}) {
    const { scope, size } = options;
    const oauth2 = new OAuth2(this._config ?? {});
    const rand = Math.random().toString(36).substring(2);
    const state = [this._prefix, 'popup', rand].join('.');
    localStorage.setItem('jsforce_state', state);
    const authzUrl = oauth2.getAuthorizationUrl({
      response_type: 'token',
      state,
      ...(scope ? { scope } : {}),
    });
    const pw = popupWin(
      authzUrl,
      size?.width ?? DEFAULT_POPUP_WIN_WIDTH,
      size?.height ?? DEFAULT_POPUP_WIN_HEIGHT,
    );
    return new Promise<{ status: string }>((resolve, reject) => {
      if (!pw) {
        const state = [this._prefix, 'redirect', rand].join('.');
        localStorage.setItem('jsforce_state', state);
        const authzUrl = oauth2.getAuthorizationUrl({
          response_type: 'token',
          state,
          ...(scope ? { scope } : {}),
        });
        location.href = authzUrl;
        return;
      }
      this._removeTokens();
      const pid = setInterval(() => {
        try {
          if (!pw || pw.closed) {
            clearInterval(pid);
            const tokens = this._getTokens();
            if (tokens) {
              this.connection._establish(tokens);
              this.emit('connect', this.connection);
              resolve({ status: 'connect' });
            } else {
              const err = this._getError();
              if (err) {
                reject(new Error(err.error + ': ' + err.error_description));
              } else {
                resolve({ status: 'cancel' });
              }
            }
          }
        } catch (e) {
          //
        }
      }, 1000);
    });
  }

  /**
   *
   */
  isLoggedIn() {
    return !!this.connection.accessToken;
  }

  /**
   *
   */
  logout() {
    this.connection.logout();
    this._removeTokens();
    this.emit('disconnect');
  }

  /**
   * @private
   */
  _getTokens() {
    const regexp = new RegExp(
      '(^|;\\s*)' + this._prefix + '_loggedin=true(;|$)',
    );
    if (document.cookie.match(regexp)) {
      const issuedAt = Number(
        localStorage.getItem(this._prefix + '_issued_at'),
      );
      // 2 hours
      if (Date.now() < issuedAt + 2 * 60 * 60 * 1000) {
        let userInfo;
        const idUrl = localStorage.getItem(this._prefix + '_id');
        if (idUrl) {
          const [id, organizationId] = idUrl.split('/').reverse();
          userInfo = { id, organizationId, url: idUrl };
        }
        return {
          accessToken: localStorage.getItem(this._prefix + '_access_token'),
          instanceUrl: localStorage.getItem(this._prefix + '_instance_url'),
          userInfo,
        };
      }
    }
    return null;
  }

  /**
   * @private
   */
  _storeTokens(params: TokenResponse) {
    localStorage.setItem(this._prefix + '_access_token', params.access_token);
    localStorage.setItem(this._prefix + '_instance_url', params.instance_url);
    localStorage.setItem(this._prefix + '_issued_at', params.issued_at);
    localStorage.setItem(this._prefix + '_id', params.id);
    document.cookie = this._prefix + '_loggedin=true;';
  }

  /**
   * @private
   */
  _removeTokens() {
    localStorage.removeItem(this._prefix + '_access_token');
    localStorage.removeItem(this._prefix + '_instance_url');
    localStorage.removeItem(this._prefix + '_issued_at');
    localStorage.removeItem(this._prefix + '_id');
    document.cookie = this._prefix + '_loggedin=';
  }

  /**
   * @private
   */
  _getError() {
    try {
      const err = JSON.parse(
        localStorage.getItem(this._prefix + '_error') ?? '',
      );
      localStorage.removeItem(this._prefix + '_error');
      return err;
    } catch (e) {
      //
    }
  }

  /**
   * @private
   */
  _storeError(err: any) {
    localStorage.setItem(this._prefix + '_error', JSON.stringify(err));
  }
}

/**
 *
 */
const client = new BrowserClient();

export default client;
