/**
 * @file Command line interface for JSforce
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import http from 'http';
import url from 'url';
import crypto from 'crypto';
import openUrl from 'open';
import { Command } from 'commander';
import inquirer from 'inquirer';
import request from '../request';
import base64url from 'base64url';
import Repl from './repl';
import jsforce, { Connection, OAuth2 } from '..';
import version from '../VERSION';
import { Optional } from '../types';
import { ClientConfig } from '../registry/types';

const registry = jsforce.registry;

type CliCommand = {
  connection?: string;
  username?: string;
  password?: string;
  loginUrl?: string;
  sandbox?: boolean;
  evalScript?: string;
} & Command

/**
 *
 */
export class Cli {
  _repl: Repl = new Repl(this);
  _conn: Connection = new Connection();
  _connName: string | undefined = undefined;
  _outputEnabled: boolean = true;
  _defaultLoginUrl: string | undefined = undefined;

  /**
   *
   */
  readCommand(): CliCommand {
    return new Command()
      .option('-u, --username [username]', 'Salesforce username')
      .option(
        '-p, --password [password]',
        'Salesforce password (and security token, if available)',
      )
      .option(
        '-c, --connection [connection]',
        'Connection name stored in connection registry',
      )
      .option('-l, --loginUrl [loginUrl]', 'Salesforce login url')
      .option('--sandbox', 'Login to Salesforce sandbox')
      .option('-e, --evalScript [evalScript]', 'Script to evaluate')
      .version(version)
      .parse(process.argv);
  }

  async start() {
    const program = this.readCommand();
    this._outputEnabled = !program.evalScript;
    try {
      await this.connect(program);
      if (program.evalScript) {
        this._repl.start({
          interactive: false,
          evalScript: program.evalScript,
        });
      } else {
        this._repl.start();
      }
    } catch (err) {
      console.error(err);
      process.exit();
    }
  }

  getCurrentConnection() {
    return this._conn;
  }

  print(...args: any[]) {
    if (this._outputEnabled) {
      console.log(...args);
    }
  }

  saveCurrentConnection() {
    if (this._connName) {
      const conn = this._conn;
      const connName = this._connName;
      const connConfig = {
        oauth2: conn.oauth2
          ? {
              clientId: conn.oauth2.clientId || undefined,
              clientSecret: conn.oauth2.clientSecret || undefined,
              redirectUri: conn.oauth2.redirectUri || undefined,
              loginUrl: conn.oauth2.loginUrl || undefined,
            }
          : undefined,
        accessToken: conn.accessToken || undefined,
        instanceUrl: conn.instanceUrl || undefined,
        refreshToken: conn.refreshToken || undefined,
      };
      registry.saveConnectionConfig(connName, connConfig);
    }
  }

  setLoginServer(loginServer: Optional<string>) {
    if (!loginServer) {
      return;
    }
    if (loginServer === 'production') {
      this._defaultLoginUrl = 'https://login.salesforce.com';
    } else if (loginServer === 'sandbox') {
      this._defaultLoginUrl = 'https://test.salesforce.com';
    } else if (!loginServer.startsWith('https://')) {
      this._defaultLoginUrl = 'https://' + loginServer;
    } else {
      this._defaultLoginUrl = loginServer;
    }
    this.print(`Using "${this._defaultLoginUrl}" as default login URL.`);
  }

  /**
   *
   */
  async connect(options: {
    username?: string;
    password?: string;
    connection?: string;
    loginUrl?: string;
    sandbox?: boolean;
  }) {
    const loginServer = options.loginUrl
      ? options.loginUrl
      : options.sandbox
      ? 'sandbox'
      : null;
    this.setLoginServer(loginServer);
    this._connName = options.connection;
    let connConfig = await registry.getConnectionConfig(options.connection);
    let username = options.username;
    if (!connConfig) {
      connConfig = {};
      if (this._defaultLoginUrl) {
        connConfig.loginUrl = this._defaultLoginUrl;
      }
      username = username || options.connection;
    }
    this._conn = new Connection(connConfig);
    const password = options.password;
    if (username) {
      await this.startPasswordAuth(username, password);
      this.saveCurrentConnection();
    } else {
      if (this._connName && this._conn.accessToken) {
        this._conn.on('refresh', () => {
          this.print('Refreshing access token ... ');
          this.saveCurrentConnection();
        });
        try {
          const identity = await this._conn.identity();
          this.print(`Logged in as : ${identity.username}`);
        } catch (err) {
          if (err instanceof Error) {
            this.print(err.message);
          }
          if (this._conn.oauth2) {
            throw new Error('Please re-authorize connection.');
          } else {
            await this.startPasswordAuth(this._connName);
          }
        }
      }
    }
  }

  /**
   *
   */
  async startPasswordAuth(username: string, password?: string) {
    try {
      await this.loginByPassword(username, password, 2);
    } catch (err) {
      if (err instanceof Error && err.message === 'canceled') {
        console.error('Password authentication canceled: Not logged in');
      } else {
        throw err;
      }
    }
  }

  /**
   *
   */
  async loginByPassword(
    username: string,
    password: string | undefined,
    retryCount: number,
  ): Promise<{ id: string }> {
    if (password === '') {
      throw new Error('canceled');
    }
    if (password == null) {
      const pass = await this.promptPassword('Password: ');
      return this.loginByPassword(username, pass, retryCount);
    }
    try {
      const result = await this._conn.login(username, password);
      this.print(`Logged in as : ${username}`);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      if (retryCount > 0) {
        return this.loginByPassword(username, undefined, retryCount - 1);
      } else {
        throw new Error('canceled');
      }
    }
  }

  /**
   *
   */
  async disconnect(connName?: string) {
    const name = connName || this._connName;
    if (name && (await registry.getConnectionConfig(name))) {
      await registry.removeConnectionConfig(name);
      this.print(`Disconnect connection '${name}'`);
    }
    this._connName = undefined;
    this._conn = new Connection();
  }

  /**
   *
   */
  async authorize(clientName: string) {
    const name = clientName || 'default';
    const oauth2Config = await registry.getClientConfig(name);
    if (!oauth2Config?.clientId) {
      if (name === 'default' || name === 'sandbox') {
        this.print(
          'No client information registered. Downloading JSforce default client information...',
        );
        return this.downloadDefaultClientInfo(name);
      }
      throw new Error(
        `No OAuth2 client information registered : '${name}'. Please register client info first.`,
      );
    }
    const oauth2 = new OAuth2(oauth2Config);
    const verifier = base64url.encode(crypto.randomBytes(32));
    const challenge = base64url.encode(
      crypto.createHash('sha256').update(verifier).digest(),
    );
    const state = base64url.encode(crypto.randomBytes(32));
    const authzUrl = oauth2.getAuthorizationUrl({
      code_challenge: challenge,
      state,
    });
    this.print('Opening authorization page in browser...');
    this.print(`URL: ${authzUrl}`);
    this.openUrl(authzUrl);
    const params = await this.waitCallback(oauth2Config.redirectUri, state);
    if (!params.code) {
      throw new Error('No authorization code returned.');
    }
    if (params.state !== state) {
      throw new Error('Invalid state parameter returned.');
    }
    this._conn = new Connection({ oauth2 });
    this.print(
      'Received authorization code. Please close the opened browser window.',
    );
    await this._conn.authorize(params.code, { code_verifier: verifier });
    this.print('Authorized. Fetching user info...');
    const identity = await this._conn.identity();
    this.print(`Logged in as : ${identity.username}`);
    this._connName = identity.username;
    this.saveCurrentConnection();
  }

  /**
   *
   */
  async downloadDefaultClientInfo(clientName: string): Promise<void> {
    const configUrl = 'https://jsforce.github.io/client-config/default.json';
    const res: { body: string } = await new Promise((resolve, reject) => {
      request({ method: 'GET', url: configUrl })
        .on('complete', resolve)
        .on('error', reject);
    });
    const clientConfig = JSON.parse(res.body);
    if (clientName === 'sandbox') {
      clientConfig.loginUrl = 'https://test.salesforce.com';
    }
    await registry.registerClientConfig(clientName, clientConfig);
    this.print('Client information downloaded successfully.');
    return this.authorize(clientName);
  }

  async waitCallback(
    serverUrl: string | undefined,
    state: string,
  ): Promise<{ code: string; state: string }> {
    if (serverUrl && serverUrl.startsWith('http://localhost:')) {
      return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
          if (!req.url) {
            return;
          }
          const qparams = url.parse(req.url, true).query;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(
            '<html><script>location.href="about:blank";</script></html>',
          );
          res.end();
          if (qparams.error) {
            reject(new Error(qparams.error as string));
          } else {
            resolve(qparams as { code: string; state: string });
          }
          server.close();
          req.connection.end();
          req.connection.destroy();
        });
        const port = Number(url.parse(serverUrl).port);
        server.listen(port, 'localhost');
      });
    } else {
      const code = await this.promptMessage(
        'Copy & paste authz code passed in redirected URL: ',
      );
      return { code: decodeURIComponent(code), state };
    }
  }

  /**
   *
   */
  async register(clientName: string | undefined, clientConfig: ClientConfig) {
    const name = clientName || 'default';
    const prompts = {
      clientId: 'Input client ID : ',
      clientSecret: 'Input client secret (optional) : ',
      redirectUri: 'Input redirect URI : ',
      loginUrl: 'Input login URL (default is https://login.salesforce.com) : ',
    };
    const registered = await registry.getClientConfig(name);
    if (registered) {
      const msg = `Client '${name}' is already registered. Are you sure you want to override ? [yN] : `;
      const ok = await this.promptConfirm(msg);
      if (!ok) {
        throw new Error('Registration canceled.');
      }
    }
    clientConfig = await Object.keys(prompts).reduce(async (promise, name) => {
      const cconfig = await promise;
      const promptName = name as keyof typeof prompts;
      const message = prompts[promptName];
      if (!cconfig[promptName]) {
        const value = await this.promptMessage(message);
        if (value) {
          return {
            ...cconfig,
            [promptName]: value,
          };
        }
      }
      return cconfig;
    }, Promise.resolve(clientConfig));
    await registry.registerClientConfig(name, clientConfig);
    this.print('Client registered successfully.');
  }

  /**
   *
   */
  async listConnections() {
    const names = await registry.getConnectionNames();
    for (const name of names) {
      this.print((name === this._connName ? '* ' : '  ') + name);
    }
  }

  /**
   *
   */
  async getConnectionNames() {
    return registry.getConnectionNames();
  }

  /**
   *
   */
  async getClientNames() {
    return registry.getClientNames();
  }

  /**
   *
   */
  async prompt(type: string, message: string) {
    this._repl.pause();
    const answer: { value: string } = await inquirer.prompt([
      {
        type,
        name: 'value',
        message,
      },
    ]);
    this._repl.resume();
    return answer.value;
  }

  /**
   *
   */
  async promptMessage(message: string) {
    return this.prompt('input', message);
  }

  async promptPassword(message: string) {
    return this.prompt('password', message);
  }

  /**
   *
   */
  async promptConfirm(message: string) {
    return this.prompt('confirm', message);
  }

  /**
   *
   */
  openUrl(url: string) {
    openUrl(url);
  }

  /**
   *
   */
  openUrlUsingSession(url?: string) {
    let frontdoorUrl = `${this._conn.instanceUrl}/secur/frontdoor.jsp?sid=${this._conn.accessToken}`;
    if (url) {
      frontdoorUrl += '&retURL=' + encodeURIComponent(url);
    }
    this.openUrl(frontdoorUrl);
  }
}

/* ------------------------------------------------------------------------- */

const cli = new Cli();

export default cli;
