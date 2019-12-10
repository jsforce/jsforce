import {
  RegistryConfig,
  Registry,
  ConnectionConfig,
  PersistConnectionConfig,
  ClientConfig,
} from './registry';
import { Connection } from '../core';

/**
 *
 */
export class BaseRegistry implements Registry {
  _registryConfig: RegistryConfig = {};

  _saveConfig() {
    throw new Error('_saveConfig must be implemented in subclass');
  }

  _getClients() {
    return this._registryConfig.clients || (this._registryConfig.clients = {});
  }

  _getConnections() {
    return (
      this._registryConfig.connections ||
      (this._registryConfig.connections = {})
    );
  }

  getConnectionNames() {
    return Object.keys(this._getConnections());
  }

  getConnection(name: string) {
    const config = this.getConnectionConfig(name);
    return config ? new Connection(config) : null;
  }

  getConnectionConfig(name?: string) {
    if (!name) {
      name = this._registryConfig['default'];
    }
    const connections = this._getConnections();
    const connConfig = name ? connections[name] : undefined;
    if (!connConfig) {
      return null;
    }
    const { client, ...connConfig_ } = connConfig;
    if (client) {
      return {
        ...connConfig_,
        oauth2: { ...this.getClient(client) },
      };
    }
    return connConfig_;
  }

  saveConnectionConfig(name: string, connConfig: ConnectionConfig) {
    const connections = this._getConnections();
    const { oauth2, ...connConfig_ } = connConfig;
    let persistConnConfig: PersistConnectionConfig = connConfig_;
    if (oauth2) {
      const clientName = this._findClientName(oauth2);
      if (clientName) {
        persistConnConfig = { ...persistConnConfig, client: clientName };
      }
      delete connConfig.oauth2;
    }
    connections[name] = persistConnConfig;
    this._saveConfig();
  }

  _findClientName({ clientId, loginUrl }: ClientConfig) {
    const clients = this._getClients();
    for (const name of Object.keys(clients)) {
      const client = clients[name];
      if (
        client.clientId === clientId &&
        (client.loginUrl || 'https://login.salesforce.com') === loginUrl
      ) {
        return name;
      }
    }
    return null;
  }

  setDefaultConnection(name: string) {
    this._registryConfig['default'] = name;
    this._saveConfig();
  }

  removeConnectionConfig(name: string) {
    const connections = this._getConnections();
    delete connections[name];
    this._saveConfig();
  }

  getClient(name: string) {
    const clients = this._getClients();
    const clientConfig = clients[name];
    return clientConfig && { ...clientConfig };
  }

  getClientNames() {
    return Object.keys(this._getClients());
  }

  registerClient(name: string, clientConfig: ClientConfig) {
    const clients = this._getClients();
    clients[name] = clientConfig;
    this._saveConfig();
  }
}
