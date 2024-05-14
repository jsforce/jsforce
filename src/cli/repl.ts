/**
 * @file Creates REPL interface with built in Salesforce API objects and automatically resolves promise object
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 * @private
 */
import { EventEmitter } from 'events';
import { REPLServer, start as startRepl } from 'repl';
import { Transform } from 'stream';
import jsforce from '..';
import {
  isPromiseLike,
  isNumber,
  isFunction,
  isObject,
} from '../util/function';
import { Cli } from './cli';

/**
 * Intercept the evaled value returned from repl evaluator, convert and send back to output.
 * @private
 */
function injectBefore(
  replServer: REPLServer,
  method: string,
  beforeFn: Function,
) {
  const _orig: Function = (replServer as any)[method];
  (replServer as any)[method] = (...args: any[]) => {
    const callback = args.pop();
    beforeFn(
      ...args.concat((err: any, res: any) => {
        if (err || res) {
          callback(err, res);
        } else {
          _orig.apply(replServer, args.concat(callback));
        }
      }),
    );
  };
  return replServer;
}

/**
 * @private
 */
function injectAfter(
  replServer: REPLServer,
  method: string,
  afterFn: Function,
) {
  const _orig: Function = (replServer as any)[method];
  (replServer as any)[method] = (...args: any[]) => {
    const callback = args.pop();
    _orig.apply(
      replServer,
      args.concat((...args: any[]) => {
        try {
          afterFn(...args.concat(callback));
        } catch (e) {
          callback(e);
        }
      }),
    );
  };
  return replServer;
}

/**
 * When the result was "promise", resolve its value
 * @private
 */
function promisify(
  err: Error | null | undefined,
  value: any,
  callback: Function,
) {
  // callback immediately if no value passed
  if (!callback && isFunction(value)) {
    callback = value;
    return callback();
  }
  if (err) {
    throw err;
  }
  if (isPromiseLike(value)) {
    value.then(
      (v: any) => {
        callback(null, v);
      },
      (err: any) => {
        callback(err);
      },
    );
  } else {
    callback(null, value);
  }
}

/**
 * Output object to stdout in JSON representation
 * @private
 */
function outputToStdout(prettyPrint?: string | number) {
  if (prettyPrint && !isNumber(prettyPrint)) {
    prettyPrint = 4;
  }
  return (err: any, value: any, callback: Function) => {
    if (err) {
      console.error(err);
    } else {
      const str = JSON.stringify(value, null, prettyPrint);
      console.log(str);
    }
    callback(err, value);
  };
}

/**
 * define get accessor using Object.defineProperty
 * @private
 */
function defineProp(obj: Object, prop: string, getter: () => any) {
  if (Object.defineProperty) {
    Object.defineProperty(obj, prop, { get: getter });
  }
}

/**
 *
 */
export class Repl {
  _cli: Cli;
  _in: Transform;
  _out: Transform;
  _interactive: boolean = true;
  _paused: boolean = false;
  _replServer: REPLServer | undefined = undefined;

  constructor(cli: Cli) {
    this._cli = cli;
    this._in = new Transform();
    this._out = new Transform();
    this._in._transform = (chunk, encoding, callback) => {
      if (!this._paused) {
        this._in.push(chunk);
      }
      callback();
    };
    this._out._transform = (chunk, encoding, callback) => {
      if (!this._paused && this._interactive !== false) {
        this._out.push(chunk);
      }
      callback();
    };
  }

  /**
   *
   */
  start(
    options: {
      interactive?: boolean;
      prettyPrint?: string | number;
      evalScript?: string;
    } = {},
  ) {
    this._interactive = options.interactive !== false;

    process.stdin.resume();
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
    process.stdin.pipe(this._in);

    this._out.pipe(process.stdout);

    defineProp(this._out, 'columns', () => process.stdout.columns);

    this._replServer = startRepl({
      input: this._in,
      output: this._out,
      terminal: true,
    });

    this._defineAdditionalCommands();

    this._replServer = injectBefore(
      this._replServer,
      'completer',
      (line: string, callback: Function) => {
        this.complete(line)
          .then((rets) => {
            callback(null, rets);
          })
          .catch((err) => {
            callback(err);
          });
      },
    );
    this._replServer = injectAfter(this._replServer, 'eval', promisify);

    if (options.interactive === false) {
      this._replServer = injectAfter(
        this._replServer,
        'eval',
        outputToStdout(options.prettyPrint),
      );
      this._replServer = injectAfter(this._replServer, 'eval', function () {
        process.exit();
      });
    }
    this._replServer.on('exit', () => process.exit());

    this._defineBuiltinVars(this._replServer.context);

    if (options.evalScript) {
      this._in.write(options.evalScript + '\n', 'utf-8');
    }

    return this;
  }

  /**
   *
   */
  _defineAdditionalCommands() {
    const cli = this._cli;
    const replServer = this._replServer;
    if (!replServer) {
      return;
    }
    replServer.defineCommand('connections', {
      help: 'List currenty registered Salesforce connections',
      action: async () => {
        await cli.listConnections();
        replServer.displayPrompt();
      },
    });
    replServer.defineCommand('connect', {
      help: 'Connect to Salesforce instance',
      action: async (...args: string[]) => {
        const [name, password] = args;
        const params = password
          ? { connection: name, username: name, password: password }
          : { connection: name, username: name };
        try {
          await cli.connect(params);
        } catch (err) {
          if (err instanceof Error) {
            console.error(err.message);
          }
        }
        replServer.displayPrompt();
      },
    });
    replServer.defineCommand('disconnect', {
      help: 'Disconnect connection and erase it from registry',
      action: (name) => {
        cli.disconnect(name);
        replServer.displayPrompt();
      },
    });
    replServer.defineCommand('use', {
      help: 'Specify login server to establish connection',
      action: (loginServer) => {
        cli.setLoginServer(loginServer);
        replServer.displayPrompt();
      },
    });
    replServer.defineCommand('authorize', {
      help: 'Connect to Salesforce using OAuth2 authorization flow',
      action: async (clientName) => {
        try {
          await cli.authorize(clientName);
        } catch (err) {
          if (err instanceof Error) {
            console.error(err.message);
          }
        }
        replServer.displayPrompt();
      },
    });
    replServer.defineCommand('register', {
      help: 'Register OAuth2 client information',
      action: async (...args: string[]) => {
        const [
          clientName,
          clientId,
          clientSecret,
          redirectUri,
          loginUrl,
        ] = args;
        const config = { clientId, clientSecret, redirectUri, loginUrl };
        try {
          await cli.register(clientName, config);
        } catch (err) {
          if (err instanceof Error) {
            console.error(err.message);
          }
        }
        replServer.displayPrompt();
      },
    });
    replServer.defineCommand('open', {
      help: 'Open Salesforce web page using established connection',
      action: (url) => {
        cli.openUrlUsingSession(url);
        replServer.displayPrompt();
      },
    });
  }

  /**
   *
   */
  pause() {
    this._paused = true;
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(false);
    }
  }

  /**
   *
   */
  resume() {
    this._paused = false;
    process.stdin.resume();
    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }
  }

  /**
   *
   */
  async complete(line: string) {
    const tokens = line.replace(/^\s+/, '').split(/\s+/);
    const [command, keyword = ''] = tokens;
    if (command.startsWith('.') && tokens.length === 2) {
      let candidates: string[] = [];
      if (command === '.connect' || command === '.disconnect') {
        candidates = await this._cli.getConnectionNames();
      } else if (command === '.authorize') {
        candidates = await this._cli.getClientNames();
      } else if (command === '.use') {
        candidates = ['production', 'sandbox'];
      }
      candidates = candidates.filter((name) => name.startsWith(keyword));
      return [candidates, keyword];
    }
  }

  /**
   * Map all jsforce object to REPL context
   * @private
   */
  _defineBuiltinVars(context: { [varName: string]: any }) {
    const cli = this._cli;

    // define salesforce package root objects
    for (const key in jsforce) {
      if (
        Object.prototype.hasOwnProperty.call(jsforce, key) &&
        !(global as any)[key]
      ) {
        context[key] = (jsforce as any)[key];
      }
    }
    // expose jsforce package root object in context.
    context.jsforce = jsforce;

    function createProxyFunc(prop: string) {
      return (...args: any[]) => {
        const conn = cli.getCurrentConnection();
        return (conn as any)[prop](...args);
      };
    }

    function createProxyAccessor(prop: string) {
      return () => {
        const conn = cli.getCurrentConnection();
        return (conn as any)[prop];
      };
    }

    const conn = cli.getCurrentConnection();
    // list all props in connection instance, other than EventEmitter or object built-in methods
    const props: { [prop: string]: boolean } = {};
    let o: object = conn;
    while (o && o !== EventEmitter.prototype && o !== Object.prototype) {
      for (const p of Object.getOwnPropertyNames(o)) {
        if (p !== 'constructor') {
          props[p] = true;
        }
      }
      o = Object.getPrototypeOf(o);
    }
    for (const prop of Object.keys(props)) {
      if (typeof (global as any)[prop] !== 'undefined') {
        // avoid global override
        continue;
      }
      if (prop.startsWith('_')) {
        // ignore private
        continue;
      }
      if (isFunction((conn as any)[prop])) {
        context[prop] = createProxyFunc(prop);
      } else if (isObject((conn as any)[prop])) {
        defineProp(context, prop, createProxyAccessor(prop));
      }
    }

    // expose default connection as "$conn"
    defineProp(context, '$conn', () => {
      return cli.getCurrentConnection();
    });
  }
}

export default Repl;
