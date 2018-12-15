export function getConnectionConfig(config: any) { // TODO: remove any
  return {
    loginUrl: config.loginUrl,
    proxyUrl: config.proxyUrl,
    logLevel: config.logLevel,
  };
}
