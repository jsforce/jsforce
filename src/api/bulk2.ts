import { EventEmitter } from 'events';
import { Duplex, Readable, Writable } from 'stream';
import Connection from '../connection';
import { Serializable, Parsable } from '../record-stream';
import HttpApi from '../http-api';
import { StreamPromise } from '../util/promise';
import { registerModule } from '../jsforce';
import { BulkRequest } from './bulk';
import { getLogger, Logger } from '../util/logger';
import { concatStreamsAsDuplex } from '../util/stream';
import { HttpResponse, Record, Schema, Optional } from '../types';
import is from '@sindresorhus/is';

export type IngestOperation =
  | 'insert'
  | 'update'
  | 'upsert'
  | 'delete'
  | 'hardDelete';

type BaseJobInfo = {
  id: string;
  object: string;
  createdById: string;
  createdDate: string;
  systemModstamp: string;
  apiVersion: number;
  lineEnding: 'LF' | 'CRLF';
  columnDelimiter:
    | 'BACKQUOTE'
    | 'CARET'
    | 'COMMA'
    | 'PIPE'
    | 'SEMICOLON'
    | 'TAB';
  concurrencyMode: 'Parallel';
  contentType: 'CSV';
  numberRecordsProcessed: number;
  retries: number;
  totalProcessingTime: number;
};

export type QueryJobInfoV2 = BaseJobInfo & {
  operation: 'query' | 'queryAll';
  state: 'UploadComplete' | 'InProgress' | 'Aborted' | 'JobComplete' | 'Failed';
  jobType: 'V2Query';
  isPkChunkingSupported: boolean;
};

export type JobInfoV2 = BaseJobInfo & {
  apexProcessingTime: number;
  apiActiveProcessingTime: number;
  assignmentRuleId?: string;
  contentUrl: string;
  errorMessage?: string;
  externalIdFieldName?: string;
  jobType: 'BigObjectIngest' | 'Classic' | 'V2Ingest';
  operation: IngestOperation;
  state:
    | 'Open'
    | 'UploadComplete'
    | 'InProgress'
    | 'JobComplete'
    | 'Aborted'
    | 'Failed';
  numberRecordsFailed: number;
};

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
    Pick<
      JobInfoV2,
      | 'assignmentRuleId'
      | 'columnDelimiter'
      | 'externalIdFieldName'
      | 'lineEnding'
      | 'contentType'
    >
  >;

type NewQueryJobOptions = {
  query: string;
  operation: QueryJobInfoV2['operation'];
} & Partial<Pick<QueryJobInfoV2, 'columnDelimiter' | 'lineEnding'>>;

type CreateIngestJobV2Options = {
  bodyParams: NewIngestJobOptions;
  pollingOptions: BulkV2PollingOptions;
};

type ExistingIngestJobOptions = {
  id: string;
  pollingOptions: BulkV2PollingOptions;
};

type CreateIngestJobV2Request = <T>(request: BulkRequest) => StreamPromise<T>;

type CreateJobDataV2Options<S extends Schema> = {
  job: IngestJobV2<S>;
  createRequest: CreateIngestJobV2Request;
};

type CreateQueryJobV2Options = {
  bodyParams: NewQueryJobOptions;
  pollingOptions: BulkV2PollingOptions;
};

type ExistingQueryJobV2Options = {
  id: string;
  pollingOptions: BulkV2PollingOptions;
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
  private connection: Connection<S>;
  private logger: Logger;

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
    this.logger = connection._logger;
    this.logger = this.connection._logLevel
      ? getLogger('bulk2').createInstance(this.connection._logLevel)
      : getLogger('bulk2');
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
  public createJob(options: NewIngestJobOptions): IngestJobV2<S> {
    return new IngestJobV2(this.connection, {
      bodyParams: options,
      pollingOptions: this,
    });
  }

  /**
   * Get an ingest or query job instance specified by a given job ID
   *
   * @param options Options object with a job ID
   * @returns IngestJobV2 An ingest job
   */
  public job(
    type: 'query',
    options: Pick<ExistingQueryJobV2Options, 'id'>,
  ): QueryJobV2<S>;
  public job(
    type: 'ingest',
    options: Pick<ExistingIngestJobOptions, 'id'>,
  ): IngestJobV2<S>;
  public job(
    type: 'ingest' | 'query' = 'ingest',
    options: ExistingIngestJobOptions | ExistingQueryJobV2Options,
  ): IngestJobV2<S> | QueryJobV2<S> {
    if (type === 'ingest') {
      return new IngestJobV2(this.connection, {
        id: options.id,
        pollingOptions: this,
      });
    } else {
      return new QueryJobV2(this.connection, {
        id: options.id,
        pollingOptions: this,
      });
    }
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

    const job = this.createJob({
      object: options.object,
      operation: options.operation,
    });
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
    const queryJob = new QueryJobV2(this.connection, {
      bodyParams: {
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

export class QueryJobV2<S extends Schema> extends EventEmitter {
  private readonly connection: Connection<S>;
  private readonly logger: Logger;
  private readonly id?: string;
  private readonly bodyParams?: NewQueryJobOptions;
  private readonly pollingOptions: BulkV2PollingOptions;
  private error: Error | undefined;
  private jobInfo?: QueryJobInfoV2;
  private locator: Optional<string>;

  constructor(conn: Connection<S>, options: ExistingQueryJobV2Options);
  constructor(conn: Connection<S>, options: CreateQueryJobV2Options);
  constructor(
    conn: Connection<S>,
    options: ExistingQueryJobV2Options | CreateQueryJobV2Options,
  ) {
    super();
    this.connection = conn;
    this.logger = this.connection._logLevel
      ? getLogger('bulk2:QueryJobV2').createInstance(this.connection._logLevel)
      : getLogger('bulk2:QueryJobV2');
    if ('id' in options) {
      this.id = options.id;
    } else {
      this.bodyParams = options.bodyParams;
    }
    this.pollingOptions = options.pollingOptions;
    // default error handler to keep the latest error
    this.on('error', (error) => (this.error = error));
  }

  /**
   * Get the query job ID.
   *
   * @returns {string} query job Id.
   */
  public getId(): string {
    return this.jobInfo ? this.jobInfo.id : (this.id as string);
  }

  /**
   * Get the query job info.
   *
   * @returns {Promise<QueryJobInfoV2>} query job information.
   */
  public getInfo(): QueryJobInfoV2 {
    if (this.jobInfo) {
      return this.jobInfo;
    }

    throw new Error(
      'No interal job info. Make sure to call `await job.check`.',
    );
  }

  /**
   * Creates a query job
   *
   * @returns {Promise<QueryJobInfoV2>} job information.
   */
  async open(): Promise<QueryJobInfoV2> {
    if (!this.bodyParams) {
      throw new Error('Missing required body params to open a new query job.');
    }
    try {
      this.jobInfo = await this.createQueryRequest<QueryJobInfoV2>({
        path: '',
        method: 'POST',
        body: JSON.stringify(this.bodyParams),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'application/json',
      });
      this.logger.debug(this.jobInfo);
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
      const state: QueryJobInfoV2['state'] = 'Aborted';
      this.jobInfo = await this.createQueryRequest<QueryJobInfoV2>({
        method: 'PATCH',
        path: `/${this.getId()}`,
        body: JSON.stringify({ state }),
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        responseType: 'application/json',
      });
      this.logger.debug(this.jobInfo);
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
    const jobId = this.getId();
    const startTime = Date.now();
    const endTime = startTime + timeout;

    this.logger.debug(`Job ID: ${jobId}`);
    this.logger.debug(
      `Polling options: timeout:${timeout}ms | interval: ${interval}ms.`,
    );

    while (endTime > Date.now()) {
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
            this.logger.debug(res);
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
        path: `/${this.getId()}`,
        responseType: 'application/json',
      });
      this.jobInfo = jobInfo;
      this.logger.debug(this.jobInfo);
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

    const resultsPath = `/${this.getId()}/results`;

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
      path: `/${this.getId()}`,
    });
  }

  private createQueryRequest<T>(request: BulkRequest) {
    const { path, responseType } = request;

    const basePath = `services/data/v${this.connection.version}/'jobs/query`;

    const url = new URL(
      path ? basePath + path : basePath,
      this.connection.instanceUrl,
    ).toString();

    const httpApi = new BulkApiV2(this.connection, { responseType });

    httpApi.on('response', (response: HttpResponse) => {
      this.locator = response.headers['sforce-locator'];
      this.logger.debug(`sforce-locator: ${this.locator}`);
    });

    return httpApi.request<T>({
      ...request,
      url,
    });
  }
}

/**
 * Class for Bulk API V2 Ingest Job
 */
export class IngestJobV2<S extends Schema> extends EventEmitter {
  private readonly connection: Connection<S>;
  private readonly logger: Logger;
  private readonly id?: string;
  private readonly bodyParams?: NewIngestJobOptions;
  private readonly jobData: JobDataV2<S>;
  private pollingOptions: BulkV2PollingOptions;
  private bulkJobSuccessfulResults?: IngestJobV2SuccessfulResults<S>;
  private bulkJobFailedResults?: IngestJobV2FailedResults<S>;
  private bulkJobUnprocessedRecords?: IngestJobV2UnprocessedRecords<S>;
  private error: Error | undefined;
  private jobInfo?: JobInfoV2;

  /**
   *
   */
  constructor(conn: Connection<S>, options: ExistingIngestJobOptions);
  constructor(conn: Connection<S>, options: CreateIngestJobV2Options);
  constructor(
    conn: Connection<S>,
    options: CreateIngestJobV2Options | ExistingIngestJobOptions,
  ) {
    super();

    this.connection = conn;
    this.logger = this.connection._logLevel
      ? getLogger('bulk2:IngestJobV2').createInstance(this.connection._logLevel)
      : getLogger('bulk2:IngestJobV2');
    this.pollingOptions = options.pollingOptions;
    if ('id' in options) {
      this.id = options.id;
    } else {
      this.bodyParams = options.bodyParams;
    }
    this.jobData = new JobDataV2<S>({
      createRequest: (request) => this.createIngestRequest(request),
      job: this,
    });
    // default error handler to keep the latest error
    this.on('error', (error) => (this.error = error));
  }

  /**
   * Get the query job ID.
   *
   * @returns {string} query job Id.
   */
  public getId(): string {
    return this.jobInfo ? this.jobInfo.id : (this.id as string);
  }

  /**
   * Get the query job info.
   *
   * @returns {Promise<QueryJobInfoV2>} ingest job information.
   */
  public getInfo(): JobInfoV2 {
    if (this.jobInfo) {
      return this.jobInfo;
    }

    throw new Error(
      'No interal job info. Make sure to call `await job.check`.',
    );
  }

  /**
   * Create a job representing a bulk operation in the org
   *
   * @returns {Promise<QueryJobInfoV2>} job information.
   */
  async open(): Promise<Partial<JobInfoV2>> {
    if (!this.bodyParams) {
      throw new Error('Missing required body params to open a new ingest job.');
    }

    try {
      this.jobInfo = await this.createIngestRequest<JobInfoV2>({
        method: 'POST',
        body: JSON.stringify(this.bodyParams),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'application/json',
      });
      this.logger.debug(this.jobInfo);
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
      const state: JobInfoV2['state'] = 'UploadComplete';
      this.jobInfo = await this.createIngestRequest<JobInfoV2>({
        method: 'PATCH',
        path: `/${this.getId()}`,
        body: JSON.stringify({ state }),
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        responseType: 'application/json',
      });
      this.logger.debug(this.jobInfo);
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
      const state: JobInfoV2['state'] = 'Aborted';
      this.jobInfo = await this.createIngestRequest<JobInfoV2>({
        method: 'PATCH',
        path: `/${this.getId()}`,
        body: JSON.stringify({ state }),
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        responseType: 'application/json',
      });
      this.logger.debug(this.jobInfo);
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
    const jobId = this.getId();
    const startTime = Date.now();
    const endTime = startTime + timeout;

    this.logger.debug(`Job ID: ${jobId}`);
    this.logger.debug(
      `Polling options: timeout:${timeout}ms | interval: ${interval}ms.`,
    );

    while (endTime > Date.now()) {
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
            this.logger.debug(res);
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
        path: `/${this.getId()}`,
        responseType: 'application/json',
      });
      this.jobInfo = jobInfo;
      this.logger.debug(this.jobInfo);
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
      path: `/${this.getId()}/successfulResults`,
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
      path: `/${this.getId()}/failedResults`,
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
      path: `/${this.getId()}/unprocessedrecords`,
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
      path: `/${this.getId()}`,
    });
  }

  private createIngestRequest<T>(request: BulkRequest) {
    const { path, responseType } = request;
    const basePath = `/services/data/v${this.connection.version}/jobs/ingest`;

    const url = new URL(
      path ? basePath + path : basePath,
      this.connection.instanceUrl,
    ).toString();

    return new BulkApiV2(this.connection, { responseType }).request<T>({
      ...request,
      url,
    });
  }
}

class JobDataV2<S extends Schema> extends Writable {
  readonly job: IngestJobV2<S>;
  readonly uploadStream: Serializable;
  readonly downloadStream: Parsable;
  readonly dataStream: Duplex;
  result: any;

  /**
   *
   */
  constructor(options: CreateJobDataV2Options<S>) {
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
          path: `/${this.job.getId()}/batches`,
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
    switch (this.job.getInfo().operation) {
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
