/* @flow */
import EventEmitter from 'events';
import { Logger, getLogger } from './util/logger';
import type { LogLevelConfig } from './util/logger';


/**
 * type definitions
 */
export type ConnectionConfig = {
  loginUrl?: string,
  accessToken?: string,
  instanceUrl?: string,
  version?: string,
  logLevel?: LogLevelConfig,
};

export type UserInfo = {
  id: string,
  organizationId: string,
  url: string,
};

/**
 *
 */
const defaultConnectionConfig: {
  loginUrl: string,
  instanceUrl: string,
  version: string,
  logLevel: LogLevelConfig,
} = {
  loginUrl: 'https://login.salesforce.com',
  instanceUrl: '',
  version: '39.0',
  logLevel: 'NONE',
};

/**
 *
 */
export default class Connection extends EventEmitter {
  static _logger = getLogger('connection');

  loginUrl: string;
  instanceUrl: string;
  version: string;
  accessToken: ?string;
  _logger: Logger;

  /**
   *
   */
  constructor(config?: ConnectionConfig = {}) {
    super();
    this.loginUrl = config.loginUrl || defaultConnectionConfig.loginUrl;
    this.instanceUrl = config.instanceUrl || defaultConnectionConfig.instanceUrl;
    this.version = config.version || defaultConnectionConfig.version;
    this.accessToken = config.accessToken;
    this._logger =
      config.logLevel ? Connection._logger.createInstance(config.logLevel) : Connection._logger;
  }

  /**
   *
   */
  async login(username: string, password: string): Promise<UserInfo> {
    return this.loginBySoap(username, password);
  }

  /**
   *
   */
  async loginBySoap(username: string, password: string): Promise<UserInfo> {
    if (!username || !password) {
      return Promise.reject(new Error('no username password given'));
    }
    return Promise.resolve({ id: 'test', organizationId: 'test', url: this.loginUrl });
  }
}
