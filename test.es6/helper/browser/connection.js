export function getConnectionConfig(config) {
  return {
    loginUrl: config.loginUrl,
    proxyUrl: config.proxyUrl,
    logLevel: config.logLevel,
  };
}
