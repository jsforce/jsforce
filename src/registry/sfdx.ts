import { exec } from 'child_process';
import { stripVTControlCharacters } from 'util';
import Connection from '../connection';
import { Registry, ConnectionConfig, ClientConfig } from './types';
import { Schema } from '../types';

type SfdxCommandOutput = {
  status: number;
  name?: string;
  message?: string;
  result?: any;
};

type SfdxOrgList = {
  nonScratchOrgs: SfdxOrgInfo[];
  scratchOrgs: SfdxOrgInfo[];
};

type SfdxOrgInfo = {
  orgId: string;
  accessToken: string;
  instanceUrl: string;
  loginUrl: string;
  username: string;
  clientId: string;
  isDevHub: boolean;
  connectedStatus: string;
  lastUsed: string;
  alias?: string;
};

function isNotNullOrUndefined<T>(v: T | null | undefined): v is T {
  return v != null;
}

/**
 *
 */
export class SfdxRegistry implements Registry {
  _cliPath: string | undefined;
  _orgList: Promise<SfdxOrgList> | undefined;
  _orgInfoMap: { [name: string]: Promise<SfdxOrgInfo> } = {};
  _defaultOrgInfo: Promise<SfdxOrgInfo> | undefined;

  constructor({ cliPath }: { cliPath?: string }) {
    this._cliPath = cliPath;
  }

  _createCommand(
    command: string,
    options: { [option: string]: any } = {},
    args: string[] = [],
  ) {
    return `${
      this._cliPath ? this._cliPath + '/' : ''
    }sfdx ${command} ${Object.keys(options)
      .map(
        (option) =>
          `${option.length > 1 ? '--' : '-'}${option}${
            options[option] != null ? ' ' + options[option] : ''
          }`,
      )
      .join(' ')} --json ${args.join(' ')}`;
  }

  async _execCommand<T>(
    command: string,
    options: { [option: string]: any } = {},
    args: string[] = [],
  ) {
    const cmd = this._createCommand(command, options, args);
    const buf = await new Promise<string>((resolve, reject) => {
      exec(cmd, (err, ret) => {
        if (err && !ret) {
          reject(err);
        } else {
          resolve(ret);
        }
      });
    });
    const body = stripVTControlCharacters(buf.toString());
    let ret: SfdxCommandOutput;
    try {
      ret = JSON.parse(body) as SfdxCommandOutput;
    } catch (e) {
      throw new Error(`Unexpectedd output from Sfdx cli: ${body}`);
    }
    if (ret.status === 0 && ret.result) {
      return ret.result as T;
    } else {
      const err = new Error(ret.message as string);
      err.name = ret.name as string;
      throw err;
    }
  }

  async _getOrgList() {
    if (!this._orgList) {
      this._orgList = this._execCommand<SfdxOrgList>('force:org:list');
    }
    return this._orgList;
  }

  async getConnectionNames() {
    const { nonScratchOrgs, scratchOrgs } = await this._getOrgList();
    return [
      ...nonScratchOrgs.map((o) => o.alias).filter(isNotNullOrUndefined),
      ...scratchOrgs.map((o) => o.alias).filter(isNotNullOrUndefined),
      ...nonScratchOrgs.map((o) => o.username),
      ...scratchOrgs.map((o) => o.username),
    ];
  }

  async getConnection<S extends Schema = Schema>(name?: string) {
    const config = await this.getConnectionConfig(name);
    return config ? new Connection<S>(config) : null;
  }

  async _getOrgInfo(username?: string) {
    const options = username ? { u: username } : {};
    if (!username || !this._orgInfoMap[username]) {
      const pOrgInfo = this._execCommand<SfdxOrgInfo>(
        'force:org:display',
        options,
      );
      this._memoOrgInfo(pOrgInfo, username);
    }
    const orgInfo = username
      ? this._orgInfoMap[username]
      : this._defaultOrgInfo;
    if (!orgInfo) {
      throw new Error('no orginfo found');
    }
    return orgInfo;
  }

  _memoOrgInfo(pOrgInfo: Promise<SfdxOrgInfo>, username?: string) {
    const pOrgInfo_ = pOrgInfo.then((orgInfo) => {
      this._orgInfoMap[orgInfo.username] = pOrgInfo_;
      if (orgInfo.alias) {
        this._orgInfoMap[orgInfo.alias] = pOrgInfo_;
      }
      return orgInfo;
    });
    if (username) {
      this._orgInfoMap[username] = pOrgInfo_;
    } else {
      this._defaultOrgInfo = pOrgInfo_;
    }
  }

  async getConnectionConfig(name?: string) {
    const orgInfo = await this._getOrgInfo(name);
    if (!orgInfo) {
      return null;
    }
    const { accessToken, instanceUrl, loginUrl } = orgInfo;
    return { accessToken, instanceUrl, loginUrl };
  }

  async saveConnectionConfig(_name: string, _connConfig: ConnectionConfig) {
    // nothing to do
  }

  async setDefaultConnection(_name: string) {
    // nothing to do
  }

  async removeConnectionConfig(name: string) {
    await this._execCommand('force:org:delete', { u: name });
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async getClientConfig(_name: string) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getClientNames() {
    return [];
  }

  async registerClientConfig(_name: string, _clientConfig: ClientConfig) {
    // nothing to do
  }
}
