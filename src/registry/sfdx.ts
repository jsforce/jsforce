import { execSync } from 'child_process';
import { Registry, ConnectionConfig, ClientConfig } from './types';
import { Connection } from '..';

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

  constructor({ cliPath }: { cliPath?: string }) {
    this._cliPath = cliPath;
  }

  _execCommand(
    command: string,
    options: { [option: string]: any } = {},
    args: string[] = [],
  ) {
    const cmd = `${
      this._cliPath ? this._cliPath + '/' : ''
    }sfdx ${command} ${Object.keys(options)
      .map(
        (option) =>
          `${option.length > 1 ? '--' : '-'}${option}${
            options[option] != null ? ' ' + options[option] : ''
          }`,
      )
      .join(' ')} --json ${args.join(' ')}`;
    const buf = execSync(cmd);
    const ret = JSON.parse(buf.toString()) as SfdxCommandOutput;
    if (ret.status === 0 && ret.result) {
      return ret.result;
    } else {
      const err = new Error(ret.message as string);
      err.name = ret.name as string;
      throw err;
    }
  }

  getConnectionNames() {
    const ret = this._execCommand('force:org:list') as SfdxOrgList;
    return [
      ...ret.nonScratchOrgs.map((o) => o.alias).filter(isNotNullOrUndefined),
      ...ret.scratchOrgs.map((o) => o.alias).filter(isNotNullOrUndefined),
      ...ret.nonScratchOrgs.map((o) => o.username),
      ...ret.scratchOrgs.map((o) => o.username),
    ];
  }

  getConnection(name?: string) {
    const connConfig = this.getConnectionConfig(name);
    return new Connection(connConfig);
  }

  getConnectionConfig(name?: string) {
    const { accessToken, instanceUrl, loginUrl } = this._execCommand(
      'force:org:display',
      name ? { u: name } : {},
    ) as SfdxOrgInfo;
    return { accessToken, instanceUrl, loginUrl };
  }

  saveConnectionConfig(_name: string, _connConfig: ConnectionConfig) {
    // nothing to do
  }

  setDefaultConnection(_name: string) {
    // nothing to do
  }

  removeConnectionConfig(name: string) {
    this._execCommand('force:org:delete', { u: name });
  }

  getClient(_name: string) {
    return null;
  }

  getClientNames() {
    return [];
  }

  registerClient(_name: string, _clientConfig: ClientConfig) {
    // nothing to do
  }
}
