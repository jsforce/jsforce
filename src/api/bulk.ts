/**
 * @file Manages Salesforce Bulk API related operations
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { EventEmitter } from 'events';
import { Duplex, Readable, Writable } from 'stream';
import joinStreams from 'multistream';
import Connection from '../connection';
import { Serializable, Parsable } from '../record-stream';
import HttpApi from '../http-api';
import { registerModule } from '../jsforce';
import { Logger } from '../util/logger';
import { concatStreamsAsDuplex } from '../util/stream';
import {
  HttpMethods,
  HttpRequest,
  HttpResponse,
  Record,
  Schema,
} from '../types';
import is from '@sindresorhus/is';

/*--------------------------------------------*/

export type BulkOperation =
  | 'insert'
  | 'update'
  | 'upsert'
  | 'delete'
  | 'hardDelete'
  | 'query'
  | 'queryAll';

export type BulkOptions = {
  extIdField?: string;
  concurrencyMode?: 'Serial' | 'Parallel';
  assignmentRuleId?: string;
};

export type JobState = 'Open' | 'Closed' | 'Aborted' | 'Failed' | 'Unknown' | 'NotProcessed';

// In `HttpApi.parseResponseBody` we use xml2js to parse the XML response,
// all these props are of type `string` due to how we convert XML -> JSON:
// https://github.com/Leonidas-from-XIV/node-xml2js/issues/108
//
// TODO: xml2js allows to define value processing functions, maybe do it for the next major release?
export type JobInfo = {
  id: string;
  object: string;
  operation: BulkOperation;
  state: JobState;
  createdById: string;
  createdDate: string;
  systemModstamp: string;
  concurrencyMode: string;
  contentType: string;
  numberBatchesQueued: string;
  numberBatchesInProgress: string;
  numberBatchesCompleted: string;
  numberBatchesFailed: string;
  numberBatchesTotal: string;
  numberRecordsProcessed: string;
  numberRetries: string;
  apiVersion: string;
  numberRecordsFailed: string;
  totalProcessingTime: string;
  apiActiveProcessingTime: string;
  apexProcessingTime: string;
};

type JobInfoResponse = {
  jobInfo: JobInfo;
};

export type BatchState =
  | 'Queued'
  | 'InProgress'
  | 'Completed'
  | 'Failed'
  | 'NotProcessed';

export type BatchInfo = {
  id: string;
  jobId: string;
  state: BatchState;
  stateMessage: string;
  numberRecordsProcessed: string;
  numberRecordsFailed: string;
  totalProcessingTime: string;
};

type BatchInfoResponse = {
  batchInfo: BatchInfo;
};

type BatchInfoListResponse = {
  batchInfoList: {
    batchInfo: BatchInfo | BatchInfo[];
  };
};

export type BulkQueryBatchResult = Array<{
  id: string;
  batchId: string;
  jobId: string;
}>;

export type BulkIngestBatchResult = Array<{
  id: string | null;
  success: boolean;
  created: boolean;
  errors: string[];
}>;

export type BatchResult<Opr extends BulkOperation> = Opr extends
  | 'query'
  | 'queryAll'
  ? BulkQueryBatchResult
  : BulkIngestBatchResult;

type BulkIngestResultResponse = Array<{
  Id: string;
  Success: string;
  Created: string;
  Error: string;
}>;

type BulkQueryResultResponse = {
  'result-list': {
    result: string | string[];
  };
};

export type BulkRequest = {
  method: HttpMethods;
  path?: string;
  body?: string;
  headers?: { [name: string]: string };
  responseType?: string;
};

/**
 * Class for Bulk API Job
 */
export class Job<
  S extends Schema,
  Opr extends BulkOperation
> extends EventEmitter {
  type: string | null;
  operation: Opr | null;
  options: BulkOptions;
  id: string | null;
  state: JobState;
  _bulk: Bulk<S>;
  _batches: { [id: string]: Batch<S, Opr> };
  _jobInfo: Promise<JobInfo> | undefined;
  _error: Error | undefined;

  /**
   *
   */
  constructor(
    bulk: Bulk<S>,
    type: string | null,
    operation: Opr | null,
    options: BulkOptions | null,
    jobId?: string,
  ) {
    super();
    this._bulk = bulk;
    this.type = type;
    this.operation = operation;
    this.options = options || {};
    this.id = jobId ?? null;
    this.state = this.id ? 'Open' : 'Unknown';
    this._batches = {};
    // default error handler to keep the latest error
    this.on('error', (error) => (this._error = error));
  }

  /**
   * Return latest jobInfo from cache
   */
  info() {
    // if cache is not available, check the latest
    if (!this._jobInfo) {
      this._jobInfo = this.check();
    }
    return this._jobInfo;
  }

  /**
   * Open new job and get jobinfo
   */
  open(): Promise<JobInfo> {
    const bulk = this._bulk;
    const options = this.options;

    // if sobject type / operation is not provided
    if (!this.type || !this.operation) {
      throw new Error('type / operation is required to open a new job');
    }

    // if not requested opening job
    if (!this._jobInfo) {
      let operation = this.operation.toLowerCase();
      if (operation === 'harddelete') {
        operation = 'hardDelete';
      }
      if (operation === 'queryall') {
        operation = 'queryAll';
      }
      const body = `
<?xml version="1.0" encoding="UTF-8"?>
<jobInfo  xmlns="http://www.force.com/2009/06/asyncapi/dataload">
  <operation>${operation}</operation>
  <object>${this.type}</object>
  ${
    options.extIdField
      ? `<externalIdFieldName>${options.extIdField}</externalIdFieldName>`
      : ''
  }
  ${
    options.concurrencyMode
      ? `<concurrencyMode>${options.concurrencyMode}</concurrencyMode>`
      : ''
  }
  ${
    options.assignmentRuleId
      ? `<assignmentRuleId>${options.assignmentRuleId}</assignmentRuleId>`
      : ''
  }
  <contentType>CSV</contentType>
</jobInfo>
      `.trim();

      this._jobInfo = (async () => {
        try {
          const res = await bulk._request<JobInfoResponse>({
            method: 'POST',
            path: '/job',
            body,
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
            },
            responseType: 'application/xml',
          });
          this.emit('open', res.jobInfo);
          this.id = res.jobInfo.id;
          this.state = res.jobInfo.state;
          return res.jobInfo;
        } catch (err) {
          this.emit('error', err);
          throw err;
        }
      })();
    }
    return this._jobInfo;
  }

  /**
   * Create a new batch instance in the job
   */
  createBatch(): Batch<S, Opr> {
    const batch = new Batch(this);
    batch.on('queue', () => {
      this._batches[batch.id!] = batch;
    });
    return batch;
  }

  /**
   * Get a batch instance specified by given batch ID
   */
  batch(batchId: string): Batch<S, Opr> {
    let batch = this._batches[batchId];
    if (!batch) {
      batch = new Batch(this, batchId);
      this._batches[batchId] = batch;
    }
    return batch;
  }

  /**
   * Check the latest job status from server
   */
  check() {
    const bulk = this._bulk;
    const logger = bulk._logger;

    this._jobInfo = (async () => {
      const jobId = await this.ready();
      const res = await bulk._request<JobInfoResponse>({
        method: 'GET',
        path: '/job/' + jobId,
        responseType: 'application/xml',
      });
      logger.debug(res.jobInfo);
      this.id = res.jobInfo.id;
      this.type = res.jobInfo.object;
      this.operation = res.jobInfo.operation as Opr;
      this.state = res.jobInfo.state;
      return res.jobInfo;
    })();

    return this._jobInfo;
  }

  /**
   * Wait till the job is assigned to server
   */
  ready(): Promise<string> {
    return this.id
      ? Promise.resolve(this.id)
      : this.open().then(({ id }) => id);
  }

  /**
   * List all registered batch info in job
   */
  async list() {
    const bulk = this._bulk;
    const logger = bulk._logger;
    const jobId = await this.ready();
    const res = await bulk._request<BatchInfoListResponse>({
      method: 'GET',
      path: '/job/' + jobId + '/batch',
      responseType: 'application/xml',
    });
    logger.debug(res.batchInfoList.batchInfo);
    const batchInfoList = Array.isArray(res.batchInfoList.batchInfo)
      ? res.batchInfoList.batchInfo
      : [res.batchInfoList.batchInfo];
    return batchInfoList;
  }

  /**
   * Close opened job
   */
  async close() {
    if (!this.id) {
      return;
    }
    try {
      const jobInfo = await this._changeState('Closed');
      this.id = null;
      this.emit('close', jobInfo);
      return jobInfo;
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * Set the status to abort
   */
  async abort() {
    if (!this.id) {
      return;
    }
    try {
      const jobInfo = await this._changeState('Aborted');
      this.id = null;
      this.emit('abort', jobInfo);
      return jobInfo;
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * @private
   */
  async _changeState(state: JobState) {
    const bulk = this._bulk;
    const logger = bulk._logger;

    this._jobInfo = (async () => {
      const jobId = await this.ready();
      const body = ` 
<?xml version="1.0" encoding="UTF-8"?>
  <jobInfo xmlns="http://www.force.com/2009/06/asyncapi/dataload">
  <state>${state}</state>
</jobInfo>
      `.trim();
      const res = await bulk._request<JobInfoResponse>({
        method: 'POST',
        path: '/job/' + jobId,
        body: body,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
        responseType: 'application/xml',
      });
      logger.debug(res.jobInfo);
      this.state = res.jobInfo.state;
      return res.jobInfo;
    })();
    return this._jobInfo;
  }
}

/*--------------------------------------------*/
class PollingTimeoutError extends Error {
  jobId: string;
  batchId: string;

  /**
   *
   */
  constructor(message: string, jobId: string, batchId: string) {
    super(message);
    this.name = 'PollingTimeout';
    this.jobId = jobId;
    this.batchId = batchId;
  }
}

/*--------------------------------------------*/
/**
 * Batch (extends Writable)
 */
export class Batch<
  S extends Schema,
  Opr extends BulkOperation
> extends Writable {
  job: Job<S, Opr>;
  id: string | undefined;
  _bulk: Bulk<S>;
  _uploadStream: Serializable;
  _downloadStream: Parsable;
  _dataStream: Duplex;
  _result: Promise<BatchResult<Opr>> | undefined;
  _error: Error | undefined;

  /**
   *
   */
  constructor(job: Job<S, Opr>, id?: string) {
    super({ objectMode: true });
    this.job = job;
    this.id = id;
    this._bulk = job._bulk;

    // default error handler to keep the latest error
    this.on('error', (error) => (this._error = error));

    //
    // setup data streams
    //
    const converterOptions = { nullValue: '#N/A' };
    const uploadStream = (this._uploadStream = new Serializable());
    const uploadDataStream = uploadStream.stream('csv', converterOptions);
    const downloadStream = (this._downloadStream = new Parsable());
    const downloadDataStream = downloadStream.stream('csv', converterOptions);

    this.on('finish', () => uploadStream.end());
    uploadDataStream.once('readable', async () => {
      try {
        // ensure the job is opened in server or job id is already assigned
        await this.job.ready();
        // pipe upload data to batch API request stream
        uploadDataStream.pipe(this._createRequestStream());
      } catch (err) {
        this.emit('error', err);
      }
    });

    // duplex data stream, opened access to API programmers by Batch#stream()
    this._dataStream = concatStreamsAsDuplex(
      uploadDataStream,
      downloadDataStream,
    );
  }

  /**
   * Connect batch API and create stream instance of request/response
   *
   * @private
   */
  _createRequestStream() {
    const bulk = this._bulk;
    const logger = bulk._logger;
    const req = bulk._request<BatchInfoResponse>({
      method: 'POST',
      path: '/job/' + this.job.id + '/batch',
      headers: {
        'Content-Type': 'text/csv',
      },
      responseType: 'application/xml',
    });
    (async () => {
      try {
        const res = await req;
        logger.debug(res.batchInfo);
        this.id = res.batchInfo.id;
        this.emit('queue', res.batchInfo);
      } catch (err) {
        this.emit('error', err);
      }
    })();
    return req.stream();
  }

  /**
   * Implementation of Writable
   */
  _write(record_: Record, enc: BufferEncoding, cb: () => void) {
    const { Id, type, attributes, ...rrec } = record_;
    let record;
    switch (this.job.operation) {
      case 'insert':
        record = rrec;
        break;
      case 'delete':
      case 'hardDelete':
        record = { Id };
        break;
      default:
        record = { Id, ...rrec };
    }
    this._uploadStream.write(record, enc, cb);
  }

  /**
   * Returns duplex stream which accepts CSV data input and batch result output
   */
  stream() {
    return this._dataStream;
  }

  /**
   * Execute batch operation
   */
  execute(input?: string | Record[] | Readable) {
    // if batch is already executed
    if (this._result) {
      throw new Error('Batch already executed.');
    }

    this._result = new Promise((resolve, reject) => {
      this.once('response', resolve);
      this.once('error', reject);
    });

    if (is.nodeStream(input)) {
      // if input has stream.Readable interface
      input.pipe(this._dataStream);
    } else {
      const recordData = structuredClone(input);

      if (Array.isArray(recordData)) {
        for (const record of recordData) {
          for (const key of Object.keys(record)) {
            if (typeof record[key] === 'boolean') {
              record[key] = String(record[key]);
            }
          }
          this.write(record);
        }
        this.end();
      } else if (typeof recordData === 'string') {
        this._dataStream.write(recordData, 'utf8');
        this._dataStream.end();
      }
    }

    // return Batch instance for chaining
    return this;
  }

  run = this.execute;

  exec = this.execute;

  /**
   * Promise/A+ interface
   * Delegate to promise, return promise instance for batch result
   */
  then(
    onResolved: (res: BatchResult<Opr>) => void,
    onReject: (err: any) => void,
  ) {
    if (!this._result) {
      this.execute();
    }
    return this._result!.then(onResolved, onReject);
  }

  /**
   * Check the latest batch status in server
   */
  async check() {
    const bulk = this._bulk;
    const logger = bulk._logger;
    const jobId = this.job.id;
    const batchId = this.id;

    if (!jobId || !batchId) {
      throw new Error('Batch not started.');
    }
    const res = await bulk._request<BatchInfoResponse>({
      method: 'GET',
      path: '/job/' + jobId + '/batch/' + batchId,
      responseType: 'application/xml',
    });
    logger.debug(res.batchInfo);
    return res.batchInfo;
  }

  /**
   * Polling the batch result and retrieve
   */
  poll(interval: number, timeout: number) {
    const jobId = this.job.id;
    const batchId = this.id;

    if (!jobId || !batchId) {
      throw new Error('Batch not started.');
    }
    const startTime = new Date().getTime();
    const endTime = startTime + timeout;

    if (timeout === 0) {
      throw new PollingTimeoutError(
        `Skipping polling because of timeout = 0ms. Job Id = ${jobId} | Batch Id = ${batchId}`,
        jobId,
        batchId,
      );
    }

    const poll = async () => {
      const now = new Date().getTime();
      if (endTime < now) {
        const err = new PollingTimeoutError(
          'Polling time out. Job Id = ' + jobId + ' , batch Id = ' + batchId,
          jobId,
          batchId,
        );
        this.emit('error', err);
        return;
      }
      let res;
      try {
        res = await this.check();
      } catch (err) {
        this.emit('error', err);
        return;
      }
      if (res.state === 'Failed') {
        if (parseInt(res.numberRecordsProcessed, 10) > 0) {
          this.retrieve();
        } else {
          this.emit('error', new Error(res.stateMessage));
        }
      } else if (res.state === 'Completed') {
        this.retrieve();
      } else if (res.state === 'NotProcessed') {
        this.emit('error', new Error('Job has been aborted'));
      } else {
        this.emit('inProgress', res);
        setTimeout(poll, interval);
      }
    };
    setTimeout(poll, interval);
  }

  /**
   * Retrieve batch result
   */
  async retrieve() {
    const bulk = this._bulk;
    const jobId = this.job.id;
    const job = this.job;
    const batchId = this.id;

    if (!jobId || !batchId) {
      throw new Error('Batch not started.');
    }

    try {
      const resp = await bulk._request<
        BulkIngestResultResponse | BulkQueryResultResponse
      >({
        method: 'GET',
        path: '/job/' + jobId + '/batch/' + batchId + '/result',
      });
      let results: BulkIngestBatchResult | BulkQueryBatchResult;
      if (job.operation === 'query' || job.operation === 'queryAll') {
        const res = resp as BulkQueryResultResponse;
        const resultId = res['result-list'].result;
        results = (Array.isArray(resultId)
          ? resultId
          : [resultId]
        ).map((id) => ({ id, batchId, jobId }));
      } else {
        const res = resp as BulkIngestResultResponse;
        results = res.map((ret) => ({
          id: ret.Id || null,
          success: ret.Success === 'true',
          created: ret.Created === 'true',
          errors: ret.Error ? [ret.Error] : [],
        }));
      }
      this.emit('response', results);
      return results;
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * Fetch query batch result as a record stream
   *
   * @param {String} resultId - Result id
   * @returns {RecordStream} - Record stream, convertible to CSV data stream
   */
  public result(resultId: string): Parsable<Record> {
    const jobId = this.job.id;
    const batchId = this.id;
    if (!jobId || !batchId) {
      throw new Error('Batch not started.');
    }
    const resultStream = new Parsable();
    const resultDataStream = resultStream.stream('csv');
    this._bulk
      ._request({
        method: 'GET',
        path: '/job/' + jobId + '/batch/' + batchId + '/result/' + resultId,
        responseType: 'application/octet-stream',
      })
      .stream()
      .pipe(resultDataStream);
    return resultStream;
  }
}

/*--------------------------------------------*/
/**
 *
 */
class BulkApi<S extends Schema> extends HttpApi<S> {
  beforeSend(request: HttpRequest) {
    request.headers = {
      ...request.headers,
      'X-SFDC-SESSION': this._conn.accessToken ?? '',
    };
  }

  isSessionExpired(response: HttpResponse) {
    return (
      response.statusCode === 400 &&
      response.body.includes('<exceptionCode>InvalidSessionId</exceptionCode>')
    );
  }

  hasErrorInResponseBody(body: any) {
    return !!body.error;
  }

  parseError(body: any) {
    return {
      errorCode: body.error.exceptionCode,
      message: body.error.exceptionMessage,
    };
  }
}

/*--------------------------------------------*/

/**
 * Class for Bulk API
 *
 * @class
 */
export class Bulk<S extends Schema> {
  private readonly _conn: Connection<S>;
  public readonly _logger: Logger;

  /**
   * Polling interval in milliseconds
   *
   * Default: 1000 (1 second)
   */
  public pollInterval = 1000;

  /**
   * Polling timeout in milliseconds
   *
   * Default: 30000 (30 seconds)
   */
  public pollTimeout = 30000;

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this._conn = conn;
    this._logger = conn._logger;
  }

  /**
   *
   */
  public _request<T>(request_: BulkRequest) {
    const conn = this._conn;
    const { path, responseType, ...rreq } = request_;
    const baseUrl = [conn.instanceUrl, 'services/async', conn.version].join(
      '/',
    );
    const request = {
      ...rreq,
      url: baseUrl + path,
    };
    return new BulkApi(this._conn, { responseType }).request<T>(request);
  }

  /**
   * Create and start bulkload job and batch
   *
   * This method will return a Batch instance (writable stream)
   * which you can write records into as a CSV string.
   *
   * Batch also implements the a promise interface so you can `await` this method to get the job results.
   *
   * @example
   * // Insert an array of records and get the job results
   *
   * const res = await connection.bulk.load('Account', 'insert', accounts)
   *
   * @example
   * // Insert records from a csv file using the returned batch stream
   *
   * const csvFile = fs.createReadStream('accounts.csv')
   *
   * const batch = conn.bulk.load('Account', 'insert')
   * 
   * // The `response` event is emitted when the job results are retrieved
   * batch.on('response', res => {
   *   console.log(res)
   * })

   * csvFile.pipe(batch.stream())
   *
   *
   */
  load<Opr extends BulkOperation>(
    type: string,
    operation: Opr,
    input?: Record[] | Readable | string,
  ): Batch<S, Opr>;
  load<Opr extends BulkOperation>(
    type: string,
    operation: Opr,
    optionsOrInput?: BulkOptions | Record[] | Readable | string,
    input?: Record[] | Readable | string,
  ): Batch<S, Opr>;
  load<Opr extends BulkOperation>(
    type: string,
    operation: Opr,
    optionsOrInput?: BulkOptions | Record[] | Readable | string,
    input?: Record[] | Readable | string,
  ) {
    let options: BulkOptions = {};
    if (
      typeof optionsOrInput === 'string' ||
      Array.isArray(optionsOrInput) ||
      is.nodeStream(optionsOrInput)
    ) {
      // when options is not plain hash object, it is omitted
      input = optionsOrInput;
    } else {
      options = optionsOrInput as BulkOptions;
    }
    const job = this.createJob(type, operation, options);
    const batch = job.createBatch();
    const cleanup = () => job.close();
    const cleanupOnError = (err: Error) => {
      if (err.name !== 'PollingTimeout') {
        cleanup();
      }
    };
    batch.on('response', cleanup);
    batch.on('error', cleanupOnError);
    batch.on('queue', () => {
      batch?.poll(this.pollInterval, this.pollTimeout);
    });
    return batch.execute(input);
  }

  /**
   * Execute bulk query and get record stream
   */
  public async query(soql: string): Promise<Parsable<Record>> {
    const m = soql.replace(/\([\s\S]+\)/g, '').match(/FROM\s+(\w+)/i);
    if (!m) {
      throw new Error(
        'No sobject type found in query, maybe caused by invalid SOQL.',
      );
    }
    const type = m[1];
    const recordStream = new Parsable();
    const dataStream = recordStream.stream('csv');

    const results = await this.load(type, 'query', soql);
    const streams = results.map((result) =>
      this.job(result.jobId).batch(result.batchId).result(result.id).stream(),
    );
    joinStreams(streams).pipe(dataStream);

    return recordStream;
  }

  /**
   * Create a new job instance
   */
  public createJob<Opr extends BulkOperation>(
    type: string,
    operation: Opr,
    options: BulkOptions = {},
  ) {
    return new Job(this, type, operation, options);
  }

  /**
   * Get a job instance specified by given job ID
   *
   * @param {String} jobId - Job ID
   * @returns {Bulk~Job}
   */
  public job<Opr extends BulkOperation>(jobId: string) {
    return new Job<S, Opr>(this, null, null, null, jobId);
  }
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('bulk', (conn) => new Bulk(conn));

export default Bulk;
