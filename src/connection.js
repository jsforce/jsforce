/* @flow */
import EventEmitter from 'events';

/**
 * type definitions
 */
export type ConnectionConfig = {
  loginUrl?: string,
  accessToken?: string,
  instanceUrl?: string,
  version?: string,
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
} = {
  loginUrl: 'https://login.salesforce.com',
  instanceUrl: '',
  version: '39.0',
};

/**
 *
 */
export default class Connection extends EventEmitter {
  loginUrl: string;
  instanceUrl: string;
  version: string;
  accessToken: ?string;

  /**
   *
   */
  constructor(config?: ConnectionConfig = {}) {
    super();
    this.loginUrl = config.loginUrl || defaultConnectionConfig.loginUrl;
    this.instanceUrl = config.instanceUrl || defaultConnectionConfig.instanceUrl;
    this.version = config.version || defaultConnectionConfig.version;
    this.accessToken = config.accessToken;
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
