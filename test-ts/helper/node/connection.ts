export function getConnectionConfig(config: any) { // TODO: remove any
  return {
    loginUrl: config.loginUrl,
    logLevel: config.logLevel,
  };
}
