/**
 * @file Manages Salesforce Metadata API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import { registerModule } from '../jsforce';
import Connection from '../connection';
import SOAP from '../soap';
import { isObject } from '../util/function';
import { Schema, SoapSchemaDef } from '../types';
import {
  ApiSchemas,
  ReadResult,
  SaveResult,
  UpsertResult,
  ListMetadataQuery,
  FileProperties,
  DescribeMetadataResult,
  RetrieveRequest,
  DeployOptions,
  RetrieveResult,
  DeployResult,
  AsyncResult,
} from './metadata/schema';

/**
 *
 */
type MetadataInfo = {
  fullName: string;
  [prop: string]: any;
};

/**
 *
 */
function convertToMetadataInfo(rec: any) {
  const { $, ...md } = rec;
  return md;
}

/**
 *
 */
function assignTypeWithMetadata(
  metadata: MetadataInfo | MetadataInfo[],
  type: string,
) {
  const convert = (md: MetadataInfo) => ({ ['@xsi:type']: type, ...md });
  return Array.isArray(metadata) ? metadata.map(convert) : convert(metadata);
}

/**
 * Class for Salesforce Metadata API
 */
export default class Metadata<S extends Schema> {
  _conn: Connection<S>;

  /**
   * Polling interval in milliseconds
   */
  pollInterval: number = 1000;

  /**
   * Polling timeout in milliseconds
   */
  pollTimeout: number = 10000;

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * Call Metadata API SOAP endpoint
   *
   * @private
   */
  async _invoke(method: string, message: object, schema?: SoapSchemaDef) {
    const soapEndpoint = new SOAP(this._conn, {
      xmlns: 'http://soap.sforce.com/2006/04/metadata',
      endpointUrl: `${this._conn.instanceUrl}/services/Soap/m/${this._conn.version}`,
    });
    const res = await soapEndpoint.invoke(
      method,
      message,
      schema ? { result: schema } : undefined,
    );
    return res.result;
  }

  /**
   * Add one or more new metadata components to the organization.
   */
  create(type: string, metadata: MetadataInfo[]): Promise<SaveResult[]>;
  create(type: string, metadata: MetadataInfo): Promise<SaveResult>;
  create(
    type: string,
    metadata: MetadataInfo | MetadataInfo[],
  ): Promise<SaveResult | SaveResult[]>;
  create(type: string, metadata: MetadataInfo | MetadataInfo[]) {
    const isArray = Array.isArray(metadata);
    metadata = assignTypeWithMetadata(metadata, type);
    const schema = isArray ? [ApiSchemas.SaveResult] : ApiSchemas.SaveResult;
    return this._invoke('createMetadata', { metadata }, schema);
  }

  /**
   * Read specified metadata components in the organization.
   */
  read(type: string, fullNames: string[]): Promise<MetadataInfo[]>;
  read(type: string, fullNames: string): Promise<MetadataInfo>;
  read(
    type: string,
    fullNames: string | string[],
  ): Promise<MetadataInfo | MetadataInfo[]>;
  async read(type: string, fullNames: string | string[]) {
    const res: ReadResult = await this._invoke(
      'readMetadata',
      { type, fullNames },
      ApiSchemas.ReadResult,
    );
    return Array.isArray(fullNames)
      ? res.records.map(convertToMetadataInfo)
      : convertToMetadataInfo(res.records[0]);
  }

  /**
   * Update one or more metadata components in the organization.
   */
  update(type: string, metadata: MetadataInfo[]): Promise<SaveResult[]>;
  update(type: string, metadata: MetadataInfo): Promise<SaveResult>;
  update(
    type: string,
    metadata: MetadataInfo | MetadataInfo[],
  ): Promise<SaveResult | SaveResult[]>;
  update(type: string, metadata: MetadataInfo | MetadataInfo[]) {
    const isArray = Array.isArray(metadata);
    metadata = assignTypeWithMetadata(metadata, type);
    const schema = isArray ? [ApiSchemas.SaveResult] : ApiSchemas.SaveResult;
    return this._invoke('updateMetadata', { metadata }, schema);
  }

  /**
   * Upsert one or more components in your organization's data.
   */
  upsert(type: string, metadata: MetadataInfo[]): Promise<UpsertResult[]>;
  upsert(type: string, metadata: MetadataInfo): Promise<UpsertResult>;
  upsert(
    type: string,
    metadata: MetadataInfo | MetadataInfo[],
  ): Promise<UpsertResult | UpsertResult[]>;
  upsert(type: string, metadata: MetadataInfo | MetadataInfo[]) {
    const isArray = Array.isArray(metadata);
    metadata = assignTypeWithMetadata(metadata, type);
    const schema = isArray
      ? [ApiSchemas.UpsertResult]
      : ApiSchemas.UpsertResult;
    return this._invoke('upsertMetadata', { metadata }, schema);
  }

  /**
   * Deletes specified metadata components in the organization.
   */
  delete(type: string, fullNames: string[]): Promise<SaveResult[]>;
  delete(type: string, fullNames: string): Promise<SaveResult>;
  delete(
    type: string,
    fullNames: string | string[],
  ): Promise<SaveResult | SaveResult[]>;
  delete(type: string, fullNames: string | string[]) {
    const schema = Array.isArray(fullNames)
      ? [ApiSchemas.SaveResult]
      : ApiSchemas.SaveResult;
    return this._invoke('deleteMetadata', { type, fullNames }, schema);
  }

  /**
   * Rename fullname of a metadata component in the organization
   */
  rename(
    type: string,
    oldFullName: string,
    newFullName: string,
  ): Promise<SaveResult> {
    return this._invoke(
      'renameMetadata',
      { type, oldFullName, newFullName },
      ApiSchemas.SaveResult,
    );
  }

  /**
   * Retrieves the metadata which describes your organization, including Apex classes and triggers,
   * custom objects, custom fields on standard objects, tab sets that define an app,
   * and many other components.
   */
  describe(asOfVersion?: string): Promise<DescribeMetadataResult> {
    if (!asOfVersion) {
      asOfVersion = this._conn.version;
    }
    return this._invoke(
      'describeMetadata',
      { asOfVersion },
      ApiSchemas.DescribeMetadataResult,
    );
  }

  /**
   * Retrieves property information about metadata components in your organization
   */
  list(
    queries: ListMetadataQuery | ListMetadataQuery[],
    asOfVersion?: string,
  ): Promise<FileProperties[]> {
    if (!asOfVersion) {
      asOfVersion = this._conn.version;
    }
    return this._invoke('listMetadata', { queries, asOfVersion }, [
      ApiSchemas.FileProperties,
    ]);
  }

  /**
   * Checks the status of asynchronous metadata calls
   */
  checkStatus(asyncProcessId: string) {
    const res = this._invoke(
      'checkStatus',
      { asyncProcessId },
      ApiSchemas.AsyncResult,
    );
    return new AsyncResultLocator(this, res);
  }

  /**
   * Retrieves XML file representations of components in an organization
   */
  retrieve(request: Partial<RetrieveRequest>) {
    const res = this._invoke(
      'retrieve',
      { request },
      ApiSchemas.RetrieveResult,
    );
    return new RetrieveResultLocator(this, res);
  }

  /**
   * Checks the status of declarative metadata call retrieve() and returns the zip file contents
   */
  checkRetrieveStatus(asyncProcessId: string): Promise<RetrieveResult> {
    return this._invoke(
      'checkRetrieveStatus',
      { asyncProcessId },
      ApiSchemas.RetrieveResult,
    );
  }

  /**
   * Deploy components into an organization using zipped file representations
   */
  deploy(
    zipInput: Readable | Buffer | string,
    options: Partial<DeployOptions> = {},
  ) {
    const res = (async () => {
      const zipContentB64 = await new Promise((resolve, reject) => {
        if (
          isObject(zipInput) &&
          'pipe' in zipInput &&
          typeof zipInput.pipe === 'function'
        ) {
          const bufs: Buffer[] = [];
          zipInput.on('data', (d) => bufs.push(d));
          zipInput.on('error', reject);
          zipInput.on('end', () => {
            resolve(Buffer.concat(bufs).toString('base64'));
          });
          // zipInput.resume();
        } else if (zipInput instanceof Buffer) {
          resolve(zipInput.toString('base64'));
        } else if (zipInput instanceof String || typeof zipInput === 'string') {
          resolve(zipInput);
        } else {
          throw 'Unexpected zipInput type';
        }
      });

      return this._invoke(
        'deploy',
        {
          ZipFile: zipContentB64,
          DeployOptions: options,
        },
        ApiSchemas.DeployResult,
      );
    })();

    return new DeployResultLocator(this, res);
  }

  /**
   * Checks the status of declarative metadata call deploy()
   */
  checkDeployStatus(
    asyncProcessId: string,
    includeDetails: boolean = false,
  ): Promise<DeployResult> {
    return this._invoke(
      'checkDeployStatus',
      {
        asyncProcessId,
        includeDetails,
      },
      ApiSchemas.DeployResult,
    );
  }
}

/*--------------------------------------------*/

/**
 * The locator class for Metadata API asynchronous call result
 */
export class AsyncResultLocator<
  S extends Schema,
  R extends {} = AsyncResult
> extends EventEmitter {
  _meta: Metadata<S>;
  _promise: Promise<AsyncResult>;
  _id: string | undefined;

  /**
   *
   */
  constructor(meta: Metadata<S>, promise: Promise<AsyncResult>) {
    super();
    this._meta = meta;
    this._promise = promise;
  }

  /**
   * Promise/A+ interface
   * http://promises-aplus.github.io/promises-spec/
   *
   * @method Metadata~AsyncResultLocator#then
   */
  then<U, V>(
    onResolve?: ((result: AsyncResult) => U | Promise<U>) | null | undefined,
    onReject?: ((err: Error) => V | Promise<V>) | null | undefined,
  ): Promise<U | V> {
    return this._promise.then(onResolve, onReject);
  }

  /**
   * Check the status of async request
   */
  async check() {
    const result = await this._promise;
    this._id = result.id;
    return await this._meta.checkStatus(result.id);
  }

  /**
   * Polling until async call status becomes complete or error
   */
  poll(interval: number, timeout: number) {
    const startTime = new Date().getTime();
    const poll = async () => {
      try {
        const now = new Date().getTime();
        if (startTime + timeout < now) {
          let errMsg = 'Polling time out.';
          if (this._id) {
            errMsg += ' Process Id = ' + this._id;
          }
          this.emit('error', new Error(errMsg));
          return;
        }
        const result = await this.check();
        if (result.done) {
          this.emit('complete', result);
        } else {
          this.emit('progress', result);
          setTimeout(poll, interval);
        }
      } catch (err) {
        this.emit('error', err);
      }
    };
    setTimeout(poll, interval);
  }

  /**
   * Check and wait until the async requests become in completed status
   */
  complete() {
    return new Promise<R>((resolve, reject) => {
      this.on('complete', resolve);
      this.on('error', reject);
      this.poll(this._meta.pollInterval, this._meta.pollTimeout);
    });
  }
}

/*--------------------------------------------*/
/**
 * The locator class to track retreive() Metadata API call result
 */
export class RetrieveResultLocator<S extends Schema> extends AsyncResultLocator<
  S,
  RetrieveResult
> {
  /**
   * Check and wait until the async request becomes in completed status,
   * and retrieve the result data.
   */
  async complete() {
    const result = await super.complete();
    return this._meta.checkRetrieveStatus(result.id);
  }

  /**
   * Change the retrieved result to Node.js readable stream
   */
  stream() {
    const resultStream = new Readable();
    let reading = false;
    resultStream._read = async () => {
      if (reading) {
        return;
      }
      reading = true;
      try {
        const result = await this.complete();
        resultStream.push(Buffer.from(result.zipFile, 'base64'));
        resultStream.push(null);
      } catch (e) {
        resultStream.emit('error', e);
      }
    };
    return resultStream;
  }
}

/*--------------------------------------------*/
/**
 * The locator class to track deploy() Metadata API call result
 *
 * @protected
 * @class Metadata~DeployResultLocator
 * @extends Metadata~AsyncResultLocator
 * @param {Metadata} meta - Metadata API object
 * @param {Promise.<Metadata~AsyncResult>} result - Promise object for async result of deploy() call
 */
export class DeployResultLocator<S extends Schema> extends AsyncResultLocator<
  S,
  DeployResult
> {
  /**
   * Check and wait until the async request becomes in completed status,
   * and retrieve the result data.
   */
  async complete(includeDetails?: boolean) {
    const result = await super.complete();
    return this._meta.checkDeployStatus(result.id, includeDetails);
  }
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('metadata', (conn) => new Metadata(conn));
