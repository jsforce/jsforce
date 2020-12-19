import { ConnectionManagerConfig } from '../connection-manager';

export function getConnectionConfig(config: ConnectionManagerConfig) {
  return {
    loginUrl: config.loginUrl,
    logLevel: config.logLevel,
  };
}
