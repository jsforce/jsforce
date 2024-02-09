import { EventEmitter } from 'events';
import { Duplex, Readable, Writable } from 'stream';
import Connection from '../connection';
import { Serializable, Parsable } from '../record-stream';
import HttpApi from '../http-api';
import { StreamPromise } from '../util/promise';
import { registerModule } from '../jsforce';
import { BulkRequest } from './bulk';
// TODO: add more logging in bulk v2 class
// import { Logger } from '../util/logger';
import { concatStreamsAsDuplex } from '../util/stream';
import { HttpResponse, Record, Schema, Optional } from '../types';
import is from '@sindresorhus/is';

export type IngestOperation =
  | 'insert'
  | 'update'
  | 'upsert'
  | 'delete'
  | 'hardDelete';

export type QueryOperation = 'query' | 'queryAll';

export type JobStateV2 =
  | 'Open'
  | 'UploadComplete'
  | 'InProgress'
  | 'JobComplete'
  | 'Aborted'
  | 'Failed';

export type QueryJobInfoV2 = {
  id: string;
  operation: QueryOperation;
  object: string;
  createdById: string;
  createdDate: string;
  systemModstamp: string;
  state: 'UploadComplete' | 'InProgress' | 'Aborted' | 'JobComplete' | 'Failed';
  concurrencyMode: 'Parallel';
  contentType: 'CSV';
  apiVersion: string;
  jobType: 'V2Query';
  lineEnding: 'LF' | 'CRLF';
  columnDelimiter:
    | 'BACKQUOTE'
    | 'CARET'
    | 'COMMA'
    | 'PIPE'
    | 'SEMICOLON'
    | 'TAB';
  numberRecordsProcessed: string;
  retries: string;
  totalProcessingTime: string;
  isPkChunkingSupported?: boolean;
};

export type JobInfoV2 = {
  apiVersion: string;
  assignmentRuleId?: string;
  columnDelimiter:
    | 'BACKQUOTE'
    | 'CARET'
    | 'COMMA'
    | 'PIPE'
    | 'SEMICOLON'
    | 'TAB';
  concurrencyMode: 'Parallel';
  contentType: 'CSV';
  contentUrl: string;
  createdById: string;
  createdDate: string;
  errorMessage?: string;
  externalIdFieldName?: string;
  id: string;
  jobType: 'BigObjectIngest' | 'Classic' | 'V2Ingest';
  lineEnding: 'LF' | 'CRLF';
  object: string;
  operation: BulkV2Operation;
  state: JobStateV2;
  systemModstamp: string;
  numberRecordsProcessed?: number;
  numberRecordsFailed?: number;
};

export type BulkV2Operation =
  | 'insert'
  | 'delete'
  | 'hardDelete'
  | 'update'
  | 'upsert';

export type IngestJobV2SuccessfulResults<S extends Schema> = Array<
  {
    sf__Created: 'true' | 'false';
    sf__Id: string;
  } & S
>;

export type IngestJobV2FailedResults<S extends Schema> = Array<
  {
    sf__Error: string;
    sf__Id: string;
  } & S
>;

export type IngestJobV2UnprocessedRecords<S extends Schema> = Array<S>;

export type IngestJobV2Results<S extends Schema> = {
  successfulResults: IngestJobV2SuccessfulResults<S>;
  failedResults: IngestJobV2FailedResults<S>;
  unprocessedRecords: IngestJobV2UnprocessedRecords<S>;
};

type NewIngestJobOptions = Required<Pick<JobInfoV2, 'object' | 'operation'>> &
  Partial<
    Pick<JobInfoV2, 'assignmentRuleId' | 'externalIdFieldName' | 'lineEnding'>
  >;

type ExistingIngestJobOptions = Pick<JobInfoV2, 'id'>;

type CreateIngestJobV2Request = <T>(request: BulkRequest) => StreamPromise<T>;

type CreateIngestJobV2Options<S extends Schema> = {
  connection: Connection<S>;
  jobInfo: NewIngestJobOptions | ExistingIngestJobOptions;
  pollingOptions: BulkV2PollingOptions;
};

type CreateJobDataV2Options<S extends Schema, Opr extends IngestOperation> = {
  job: IngestJobV2<S, Opr>;
  createRequest: CreateIngestJobV2Request;
};

type CreateQueryJobV2Options<S extends Schema> = {
  connection: Connection<S>;
  pollingOptions: BulkV2PollingOptions;
  body: QueryJobBody;
};

type BulkV2PollingOptions = {
  pollInterval: number;
  pollTimeout: number;
};

class JobPollingTimeoutError extends Error {
  jobId: string;

  /**
   *
   */
  constructor(message: string, jobId: string) {
    super(message);
    this.name = 'JobPollingTimeout';
    this.jobId = jobId;
  }
}

class BulkApiV2<S extends Schema> extends HttpApi<S> {
  hasErrorInResponseBody(body: any) {
    return (
      Array.isArray(body) &&
      typeof body[0] === 'object' &&
      'errorCode' in body[0]
    );
  }

  isSessionExpired(response: HttpResponse): boolean {
    return (
      response.statusCode === 401 && /INVALID_SESSION_ID/.test(response.body)
    );
  }

  parseError(body: any) {
    return {
      errorCode: body[0].errorCode,
      message: body[0].message,
    };
  }
}

export class BulkV2<S extends Schema> {
  connection: Connection<S>;

  /**
   * Polling interval in milliseconds
   */
  pollInterval = 1000;

  /**
   * Polling timeout in milliseconds
   */
  pollTimeout = 10000;

  constructor(connection: Connection<S>) {
    this.connection = connection;
  }

  /**
   * Create an instance of an ingest job object.
   *
   * @params {NewIngestJobOptions} options object
   * @returns {IngestJobV2} An ingest job instance
   * @example
   * // Upsert records to the Account object.
   *
   * const job = connection.bulk2.createJob({
   *   operation: 'insert'
   *   object: 'Account',
   * });
   *
   * // create the job in the org
   * await job.open()
   *
   * // upload data
   * await job.uploadData(csvFile)
   *
   * // finished uploading data, mark it as ready for processing
   * await job.close()
   */
  public createJob<Opr extends IngestOperation>(
    options: NewIngestJobOptions,
  ): IngestJobV2<S, Opr> {
    return new IngestJobV2({
      connection: this.connection,
      jobInfo: options,
      pollingOptions: this,
    });
  }

  /**
   * Get an ingest job instance specified by a given job ID
   *
   * @param options Options object with a job ID
   * @returns IngestJobV2 An ingest job
   */
  public job<Opr extends IngestOperation>(
    options: ExistingIngestJobOptions,
  ): IngestJobV2<S, Opr> {
    return new IngestJobV2({
      connection: this.connection,
      jobInfo: options,
      pollingOptions: this,
    });
  }

  /**
   * Create, upload, and start bulkload job
   */
  async loadAndWaitForResults(
    options: NewIngestJobOptions &
      Partial<BulkV2PollingOptions> & {
        input: Record[] | Readable | string;
      },
  ): Promise<IngestJobV2Results<S>> {
    if (!options.pollTimeout) options.pollTimeout = this.pollTimeout;
    if (!options.pollInterval) options.pollInterval = this.pollInterval;

    const job = this.createJob(options);
    try {
      await job.open();
      await job.uploadData(options.input);
      await job.close();
      await job.poll(options.pollInterval, options.pollTimeout);
      return await job.getAllResults();
    } catch (error) {
      const err = error as Error;
      if (err.name !== 'JobPollingTimeoutError') {
        // fires off one last attempt to clean up and ignores the result | error
        job.delete().catch((ignored) => ignored);
      }
      throw err;
    }
  }

  /**
   * Execute bulk query and get a record stream.
   *
   * Default timeout: 10000ms
   *
   * @param soql SOQL query
   * @param BulkV2PollingOptions options object
   *
   * @returns {RecordStream} - Record stream, convertible to a CSV data stream
   */
  async query(
    soql: string,
    options?: Partial<BulkV2PollingOptions> & {
      scanAll?: boolean;
      columnDelimiter?: QueryJobInfoV2['columnDelimiter'];
      lineEnding?: QueryJobInfoV2['lineEnding'];
    },
  ): Promise<Parsable<Record>> {
    const queryJob = new QueryJobV2({
      connection: this.connection,
      body: {
        query: soql,
        operation: options?.scanAll ? 'queryAll' : 'query',
        columnDelimiter: options?.columnDelimiter,
        lineEnding: options?.lineEnding,
      },
      pollingOptions: this,
    });

    const recordStream = new Parsable();
    const dataStream = recordStream.stream('csv');

    try {
      await queryJob.open();
      await queryJob.poll(options?.pollInterval, options?.pollTimeout);

      const queryRecordsStream = await queryJob
        .result()
        .then((s) => s.stream());
      queryRecordsStream.pipe(dataStream);
    } catch (error) {
      const err = error as Error;
      if (err.name !== 'JobPollingTimeoutError') {
        // fires off one last attempt to clean up and ignores the result | error
        queryJob.delete().catch((ignored) => ignored);
      }

      recordStream.emit('error', err);
      throw err;
    }
    return recordStream;
  }
}

type QueryJobBody = {
  query: string;
  operation: QueryJobInfoV2['operation'];
  columnDelimiter?: QueryJobInfoV2['columnDelimiter'];
  lineEnding?: QueryJobInfoV2['lineEnding'];
};
export class QueryJobV2<S extends Schema> extends EventEmitter {
  readonly connection: Connection<S>;
  readonly body: QueryJobBody;
  readonly pollingOptions: BulkV2PollingOptions;
  error: Error | undefined;
  jobInfo: QueryJobInfoV2 | undefined;
  locator: Optional<string>;
  finished: boolean = false;

  constructor(options: CreateQueryJobV2Options<S>) {
    super();
    this.connection = options.connection;
    this.body = options.body;
    this.pollingOptions = options.pollingOptions;
    // default error handler to keep the latest error
    this.on('error', (error) => (this.error = error));
  }

  /**
   * Creates a query job
   *
   * @returns {Promise<QueryJobInfoV2>} job information.
   */
  async open(): Promise<QueryJobInfoV2> {
    try {
      this.jobInfo = await this.createQueryRequest<QueryJobInfoV2>({
        path: '',
        method: 'POST',
        body: JSON.stringify(this.body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'application/json',
      });
      this.emit('open');
    } catch (err) {
      this.emit('error', err);
      throw err;
    }

    return this.jobInfo;
  }

  /**
   * Abort the job
   *
   * The 'aborted' event is emitted when the job successfully aborts.
   * @returns {Promise<QueryJobInfoV2>} job information.
   */
  async abort(): Promise<QueryJobInfoV2> {
    try {
      const state: JobStateV2 = 'Aborted';
      this.jobInfo = await this.createQueryRequest<QueryJobInfoV2>({
        method: 'PATCH',
        path: `/${this.jobInfo?.id}`,
        body: JSON.stringify({ state }),
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        responseType: 'application/json',
      });
      return this.jobInfo;
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * Poll for the state of the processing for the job.
   *
   * @param interval Polling interval in milliseconds
   * @param timeout Polling timeout in milliseconds
   * @returns {Promise<Record[]>} A promise that resolves when the job finished being processed.
   */
  async poll(
    interval: number = this.pollingOptions.pollInterval,
    timeout: number = this.pollingOptions.pollTimeout,
  ): Promise<void> {
    const jobId = getJobId(this.jobInfo);
    const startTime = Date.now();

    while (startTime + timeout > Date.now()) {
      try {
        const res = await this.check();
        switch (res.state) {
          case 'Aborted':
            throw new Error('Job has been aborted');
          case 'UploadComplete':
          case 'InProgress':
            await delay(interval);
            break;
          case 'Failed':
            // unlike ingest jobs, the API doesn't return an error msg:
            // https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/query_get_one_job.htm
            throw new Error('Query job failed to complete');
          case 'JobComplete':
            this.emit('jobcomplete');
            return;
        }
      } catch (err) {
        this.emit('error', err);
        throw err;
      }
    }

    const timeoutError = new JobPollingTimeoutError(
      `Polling timed out after ${timeout}ms. Job Id = ${jobId}`,
      jobId,
    );
    this.emit('error', timeoutError);
    throw timeoutError;
  }

  /**
   * Check the latest job status
   *
   * @returns {Promise<QueryJobInfoV2>} job information.
   */
  async check(): Promise<QueryJobInfoV2> {
    try {
      const jobInfo = await this.createQueryRequest<QueryJobInfoV2>({
        method: 'GET',
        path: `/${getJobId(this.jobInfo)}`,
        responseType: 'application/json',
      });
      this.jobInfo = jobInfo;
      return jobInfo;
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * Get the results for a query job as a record stream
   *
   * This method assumes the job finished being processed
   * @returns {RecordStream} - Record stream, convertible to a CSV data stream
   */
  public async result(): Promise<Parsable<Record>> {
    const resultStream = new Parsable();
    const resultDataStream = resultStream.stream('csv');

    const resultsPath = `/${getJobId(this.jobInfo)}/results`;

    while (this.locator !== 'null') {
      const resPromise = this.createQueryRequest({
        method: 'GET',
        path: this.locator
          ? `${resultsPath}?locator=${this.locator}`
          : resultsPath,
        headers: {
          Accept: 'text/csv',
        },
      });

      resPromise.stream().pipe(resultDataStream);
      await resPromise;
    }

    return resultStream;
  }

  /**
   * Deletes a query job.
   */
  async delete(): Promise<void> {
    return this.createQueryRequest<void>({
      method: 'DELETE',
      path: `/${getJobId(this.jobInfo)}`,
    });
  }

  private createQueryRequest<T>(request: BulkRequest) {
    const { path, responseType } = request;
    const baseUrl = [
      this.connection.instanceUrl,
      'services/data',
      `v${this.connection.version}`,
      'jobs/query',
    ].join('/');

    const httpApi = new BulkApiV2(this.connection, { responseType });

    httpApi.on('response', (response: HttpResponse) => {
      this.locator = response.headers['sforce-locator'];
    });

    return httpApi.request<T>({
      ...request,
      url: path ? baseUrl + path : baseUrl,
    });
  }
}

/**
 * Class for Bulk API V2 Ingest Job
 */
export class IngestJobV2<
  S extends Schema,
  Opr extends IngestOperation
> extends EventEmitter {
  readonly connection: Connection<S>;
  readonly pollingOptions: BulkV2PollingOptions;
  readonly jobData: JobDataV2<S, Opr>;
  bulkJobSuccessfulResults: IngestJobV2SuccessfulResults<S> | undefined;
  bulkJobFailedResults: IngestJobV2FailedResults<S> | undefined;
  bulkJobUnprocessedRecords: IngestJobV2UnprocessedRecords<S> | undefined;
  error: Error | undefined;
  jobInfo: Partial<JobInfoV2>;

  /**
   *
   */
  constructor(options: CreateIngestJobV2Options<S>) {
    super();

    this.connection = options.connection;
    this.pollingOptions = options.pollingOptions;
    this.jobInfo = options.jobInfo;
    this.jobData = new JobDataV2<S, Opr>({
      createRequest: (request) => this.createIngestRequest(request),
      job: this,
    });
    // default error handler to keep the latest error
    this.on('error', (error) => (this.error = error));
  }

  get id() {
    return this.jobInfo.id;
  }

  /**
   * Create a job representing a bulk operation in the org
   *
   * @returns {Promise<QueryJobInfoV2>} job information.
   */
  async open(): Promise<Partial<JobInfoV2>> {
    try {
      this.jobInfo = await this.createIngestRequest<JobInfoV2>({
        method: 'POST',
        body: JSON.stringify({
          assignmentRuleId: this.jobInfo?.assignmentRuleId,
          externalIdFieldName: this.jobInfo?.externalIdFieldName,
          object: this.jobInfo?.object,
          operation: this.jobInfo?.operation,
          lineEnding: this.jobInfo?.lineEnding,
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'application/json',
      });
      this.emit('open');
    } catch (err) {
      this.emit('error', err);
      throw err;
    }

    return this.jobInfo;
  }

  /** Upload data for a job in CSV format
   *
   *  @param input CSV as a string, or array of records or readable stream
   */
  async uploadData(input: string | Record[] | Readable): Promise<void> {
    await this.jobData.execute(input);
  }

  async getAllResults(): Promise<IngestJobV2Results<S>> {
    const [
      successfulResults,
      failedResults,
      unprocessedRecords,
    ] = await Promise.all([
      this.getSuccessfulResults(),
      this.getFailedResults(),
      this.getUnprocessedRecords(),
    ]);
    return { successfulResults, failedResults, unprocessedRecords };
  }

  /**
   * Close opened job
   */
  async close(): Promise<void> {
    try {
      const state: JobStateV2 = 'UploadComplete';
      this.jobInfo = await this.createIngestRequest<JobInfoV2>({
        method: 'PATCH',
        path: `/${this.jobInfo.id}`,
        body: JSON.stringify({ state }),
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        responseType: 'application/json',
      });
      this.emit('uploadcomplete');
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * Set the status to abort
   */
  async abort(): Promise<void> {
    try {
      const state: JobStateV2 = 'Aborted';
      this.jobInfo = await this.createIngestRequest<JobInfoV2>({
        method: 'PATCH',
        path: `/${this.jobInfo.id}`,
        body: JSON.stringify({ state }),
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        responseType: 'application/json',
      });
      this.emit('aborted');
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * Poll for the state of the processing for the job.
   *
   * This method will only throw after a timeout. To capture a
   * job failure while polling you must set a listener for the
   * `failed` event before calling it:
   *
   * job.on('failed', (err) => console.error(err))
   * await job.poll()
   *
   * @param interval Polling interval in milliseconds
   * @param timeout Polling timeout in milliseconds
   * @returns {Promise<void>} A promise that resolves when the job finishes successfully
   */
  async poll(
    interval: number = this.pollingOptions.pollInterval,
    timeout: number = this.pollingOptions.pollTimeout,
  ): Promise<void> {
    const jobId = getJobId(this.jobInfo);
    const startTime = Date.now();

    while (startTime + timeout > Date.now()) {
      try {
        const res = await this.check();
        switch (res.state) {
          case 'Open':
            throw new Error('Job has not been started');
          case 'Aborted':
            throw new Error('Job has been aborted');
          case 'UploadComplete':
          case 'InProgress':
            await delay(interval);
            break;
          case 'Failed':
            throw new Error(
              `Ingest job failed to complete due to: ${res.errorMessage}`,
            );
          case 'JobComplete':
            this.emit('jobcomplete');
            return;
        }
      } catch (err) {
        this.emit('error', err);
        throw err;
      }
    }

    const timeoutError = new JobPollingTimeoutError(
      `Polling timed out after ${timeout}ms. Job Id = ${jobId}`,
      jobId,
    );
    this.emit('error', timeoutError);
    throw timeoutError;
  }

  /**
   * Check the latest batch status in server
   */
  async check(): Promise<JobInfoV2> {
    try {
      const jobInfo = await this.createIngestRequest<JobInfoV2>({
        method: 'GET',
        path: `/${getJobId(this.jobInfo)}`,
        responseType: 'application/json',
      });
      this.jobInfo = jobInfo;
      return jobInfo;
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }

  async getSuccessfulResults(): Promise<IngestJobV2SuccessfulResults<S>> {
    if (this.bulkJobSuccessfulResults) {
      return this.bulkJobSuccessfulResults;
    }

    const results = await this.createIngestRequest<
      IngestJobV2SuccessfulResults<S> | undefined
    >({
      method: 'GET',
      path: `/${getJobId(this.jobInfo)}/successfulResults`,
      responseType: 'text/csv',
    });

    this.bulkJobSuccessfulResults = results ?? [];

    return this.bulkJobSuccessfulResults;
  }

  async getFailedResults(): Promise<IngestJobV2FailedResults<S>> {
    if (this.bulkJobFailedResults) {
      return this.bulkJobFailedResults;
    }

    const results = await this.createIngestRequest<
      IngestJobV2FailedResults<S> | undefined
    >({
      method: 'GET',
      path: `/${getJobId(this.jobInfo)}/failedResults`,
      responseType: 'text/csv',
    });

    this.bulkJobFailedResults = results ?? [];

    return this.bulkJobFailedResults;
  }

  async getUnprocessedRecords(): Promise<IngestJobV2UnprocessedRecords<S>> {
    if (this.bulkJobUnprocessedRecords) {
      return this.bulkJobUnprocessedRecords;
    }

    const results = await this.createIngestRequest<
      IngestJobV2UnprocessedRecords<S> | undefined
    >({
      method: 'GET',
      path: `/${getJobId(this.jobInfo)}/unprocessedrecords`,
      responseType: 'text/csv',
    });

    this.bulkJobUnprocessedRecords = results ?? [];

    return this.bulkJobUnprocessedRecords;
  }

  /**
   * Deletes an ingest job.
   */
  async delete(): Promise<void> {
    return this.createIngestRequest<void>({
      method: 'DELETE',
      path: `/${getJobId(this.jobInfo)}`,
    });
  }

  private createIngestRequest<T>(request: BulkRequest) {
    const { path, responseType } = request;
    const baseUrl = [
      this.connection.instanceUrl,
      'services/data',
      `v${this.connection.version}`,
      'jobs/ingest',
    ].join('/');

    return new BulkApiV2(this.connection, { responseType }).request<T>({
      ...request,
      url: path ? baseUrl + path : baseUrl,
    });
  }
}

class JobDataV2<
  S extends Schema,
  Opr extends IngestOperation
> extends Writable {
  readonly job: IngestJobV2<S, Opr>;
  readonly uploadStream: Serializable;
  readonly downloadStream: Parsable;
  readonly dataStream: Duplex;
  result: any;

  /**
   *
   */
  constructor(options: CreateJobDataV2Options<S, Opr>) {
    super({ objectMode: true });

    const createRequest = options.createRequest;

    this.job = options.job;
    this.uploadStream = new Serializable();
    this.downloadStream = new Parsable();

    const converterOptions = { nullValue: '#N/A' };
    const uploadDataStream = this.uploadStream.stream('csv', converterOptions);
    const downloadDataStream = this.downloadStream.stream(
      'csv',
      converterOptions,
    );

    this.dataStream = concatStreamsAsDuplex(
      uploadDataStream,
      downloadDataStream,
    );

    this.on('finish', () => this.uploadStream.end());

    uploadDataStream.once('readable', () => {
      try {
        // pipe upload data to batch API request stream
        const req = createRequest({
          method: 'PUT',
          path: `/${this.job.jobInfo?.id}/batches`,
          headers: {
            'Content-Type': 'text/csv',
          },
          responseType: 'application/json',
        });

        (async () => {
          try {
            const res = await req;
            this.emit('response', res);
          } catch (err) {
            this.emit('error', err);
          }
        })();

        uploadDataStream.pipe(req.stream());
      } catch (err) {
        this.emit('error', err);
      }
    });
  }

  _write(record_: Record, enc: BufferEncoding, cb: () => void) {
    const { Id, type, attributes, ...rrec } = record_;
    let record;
    switch (this.job.jobInfo.operation) {
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
    this.uploadStream.write(record, enc, cb);
  }

  /**
   * Returns duplex stream which accepts CSV data input and batch result output
   */
  stream() {
    return this.dataStream;
  }

  /**
   * Execute batch operation
   */
  execute(input?: string | Record[] | Readable) {
    if (this.result) {
      throw new Error('Data can only be uploaded to a job once.');
    }

    this.result = new Promise<void>((resolve, reject) => {
      this.once('response', () => resolve());
      this.once('error', reject);
    });

    if (is.nodeStream(input)) {
      // if input has stream.Readable interface
      input.pipe(this.dataStream);
    } else {
      if (Array.isArray(input)) {
        for (const record of input) {
          for (const key of Object.keys(record)) {
            if (typeof record[key] === 'boolean') {
              record[key] = String(record[key]);
            }
          }
          this.write(record);
        }
        this.end();
      } else if (typeof input === 'string') {
        this.dataStream.write(input, 'utf8');
        this.dataStream.end();
      }
    }

    return this;
  }

  /**
   * Promise/A+ interface
   * Delegate to promise, return promise instance for batch result
   */
  then(onResolved: () => void, onReject: (err: any) => void) {
    if (this.result === undefined) {
      this.execute();
    }
    return this.result!.then(onResolved, onReject);
  }
}

function getJobId(
  jobInfo: Partial<JobInfoV2 | QueryJobInfoV2> | undefined,
): string {
  const jobId = jobInfo?.id;
  if (jobId === undefined) {
    throw new Error(
      'No job ID found. Ensure the job was created by calling the `await job.open()`.',
    );
  }
  return jobId;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('bulk2', (conn) => new BulkV2(conn));

export default BulkV2;
