import { ConnectionManagerConfig } from '../connection-manager';

export function getConnectionConfig(config: ConnectionManagerConfig) {
  return {
    loginUrl: config.loginUrl,
    proxyUrl: config.proxyUrl,
    logLevel: config.logLevel,
  };
}
