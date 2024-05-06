/**
 *
 */
export const LogLevels: { [level: string]: number } = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5,
  NONE: 6,
};

const LogLevelLabels = ['', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'NONE'];

const globalLogLevelConfig = (() => {
  const globalLogLevelStr =
    process.env.JSFORCE_LOG_LEVEL ||
    (global as any).__JSFORCE_LOG_LEVEL__ ||
    'NONE';
  if (/^(DEBUG|INFO|WARN|ERROR|FATAL|NONE)$/i.test(globalLogLevelStr)) {
    return { '*': globalLogLevelStr };
  }
  try {
    return JSON.parse(globalLogLevelStr);
  } catch (e) {
    return { '*': 'NONE' };
  }
})();

export type LogLevelConfig =
  | string
  | number
  | { [name: string]: string | number };

function getModuleLogLevel(
  logLevelConfig: { [name: string]: string | number },
  moduleName: string,
) {
  const logLevel = logLevelConfig[moduleName] || logLevelConfig['*'];
  return typeof logLevel === 'number'
    ? logLevel
    : LogLevels[logLevel] || LogLevels.NONE;
}

/**
 *
 */
export class Logger {
  _moduleName: string;
  _logLevel: number;

  constructor(
    moduleName: string,
    logLevelConfig: LogLevelConfig = globalLogLevelConfig,
  ) {
    this._moduleName = moduleName;
    this._logLevel =
      typeof logLevelConfig === 'number'
        ? logLevelConfig
        : typeof logLevelConfig === 'string'
        ? LogLevels[logLevelConfig] || LogLevels.NONE
        : getModuleLogLevel(logLevelConfig, moduleName);
  }

  createInstance(logLevelConfig: LogLevelConfig = this._logLevel) {
    return new Logger(this._moduleName, logLevelConfig);
  }

  setLogLevel(logLevel: string | number) {
    if (typeof logLevel === 'string') {
      this._logLevel = LogLevels[logLevel] || LogLevels.NONE;
    } else {
      this._logLevel = logLevel;
    }
  }

  log(logLevel: number, ...messages: any[]) {
    if (this._logLevel <= logLevel) {
      const msgs = [
        `${LogLevelLabels[logLevel]}\t[${this._moduleName}] `,
        ...messages,
      ];
      if (logLevel < LogLevels.ERROR) {
        console.log(...msgs); // eslint-disable-line no-console
      } else {
        console.error(...msgs); // eslint-disable-line no-console
      }
    }
  }

  debug(...messages: any[]) {
    this.log(LogLevels.DEBUG, ...messages);
  }

  info(...messages: any[]) {
    this.log(LogLevels.INFO, ...messages);
  }

  warn(...messages: any[]) {
    this.log(LogLevels.WARN, ...messages);
  }

  error(...messages: any[]) {
    this.log(LogLevels.ERROR, ...messages);
  }

  fatal(...messages: any[]) {
    this.log(LogLevels.FATAL, ...messages);
  }
}

const loggers: { [name: string]: Logger } = {};

/**
 *
 */
export function getLogger(moduleName: string) {
  const logger = loggers[moduleName] || new Logger(moduleName);
  loggers[moduleName] = logger;
  return logger;
}
