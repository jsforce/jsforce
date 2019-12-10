/**
 * @file Registry for connection information, cached in local file system
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import Connection from '../connection';

export type ConnectionConfig = {
  instanceUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  loginUrl?: string;
  oauth2?: ClientConfig;
};

export type PersistConnectionConfig = {
  client?: string;
  instanceUrl?: string;
  accessToken?: string;
};

export type ClientConfig = {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  loginUrl?: string;
};

export type RegistryConfig = {
  default?: string;
  clients?: { [name: string]: ClientConfig };
  connections?: { [name: string]: PersistConnectionConfig };
};

/**
 *
 */
export interface Registry {
  getConnectionNames(): string[];
  getConnection(name?: string): Connection | null | undefined;
  getConnectionConfig(name?: string): ConnectionConfig | null | undefined;
  saveConnectionConfig(name: string, connConfig: ConnectionConfig): void;
  setDefaultConnection(name: string): void;
  removeConnectionConfig(name: string): void;
  getClient(name: string): ClientConfig | null | undefined;
  getClientNames(): string[];
  registerClient(name: string, clientConfig: ClientConfig): void;
}
