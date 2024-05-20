/**
 * @file Manages query for records in Salesforce
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { EventEmitter } from 'events';
import { Logger, getLogger } from './util/logger';
import RecordStream, { Serializable } from './record-stream';
import Connection from './connection';
import { createSOQL } from './soql-builder';
import { QueryConfig as SOQLQueryConfig, SortDir } from './soql-builder';
import {
  Record,
  Optional,
  Schema,
  SObjectNames,
  ChildRelationshipNames,
  ChildRelationshipSObjectName,
  FieldProjectionConfig,
  FieldPathSpecifier,
  FieldPathScopedProjection,
  SObjectRecord,
  SObjectInputRecord,
  SObjectUpdateRecord,
  SaveResult,
  DateString,
  SObjectChildRelationshipProp,
  SObjectFieldNames,
} from './types';
import { Readable } from 'stream';
import SfDate from './date';
import { IngestJobV2Results } from './api/bulk2';

/**
 *
 */
export type QueryField<
  S extends Schema,
  N extends SObjectNames<S>,
  FP extends FieldPathSpecifier<S, N> = FieldPathSpecifier<S, N>
> = FP | FP[] | string | string[] | { [field: string]: number | boolean };

/**
 *
 */
type CValue<T> = T extends DateString
  ? SfDate
  : T extends string | number | boolean
  ? T
  : never;

type CondOp<T> =
  | ['$eq', CValue<T> | null]
  | ['$ne', CValue<T> | null]
  | ['$gt', CValue<T>]
  | ['$gte', CValue<T>]
  | ['$lt', CValue<T>]
  | ['$lte', CValue<T>]
  | ['$like', T extends string ? T : never]
  | ['$nlike', T extends string ? T : never]
  | ['$in', Array<CValue<T>>]
  | ['$nin', Array<CValue<T>>]
  | ['$includes', T extends string ? T[] : never]
  | ['$excludes', T extends string ? T[] : never]
  | ['$exists', boolean];

type CondValueObj<T, Op = CondOp<T>[0]> = Op extends CondOp<T>[0]
  ? Op extends string
    ? { [K in Op]: Extract<CondOp<T>, [Op, any]>[1] }
    : never
  : never;

type CondValue<T> = CValue<T> | Array<CValue<T>> | null | CondValueObj<T>;

type ConditionSet<R extends Record> = {
  [K in keyof R]?: CondValue<R[K]>;
};

export type QueryCondition<S extends Schema, N extends SObjectNames<S>> =
  | {
      $or: Array<QueryCondition<S, N>>;
    }
  | {
      $and: Array<QueryCondition<S, N>>;
    }
  | ConditionSet<SObjectRecord<S, N>>;

export type QuerySort<
  S extends Schema,
  N extends SObjectNames<S>,
  R extends SObjectRecord<S, N> = SObjectRecord<S, N>
> =
  | {
      [K in keyof R]?: SortDir;
    }
  | Array<[keyof R, SortDir]>;

/**
 *
 */
export type QueryConfig<
  S extends Schema,
  N extends SObjectNames<S>,
  FP extends FieldPathSpecifier<S, N> = FieldPathSpecifier<S, N>
> = {
  fields?: QueryField<S, N, FP>;
  includes?: {
    [CRN in ChildRelationshipNames<S, N>]?: QueryConfig<
      S,
      ChildRelationshipSObjectName<S, N, CRN>
    >;
  };
  table?: string;
  conditions?: QueryCondition<S, N>;
  sort?: QuerySort<S, N>;
  limit?: number;
  offset?: number;
};

export type QueryOptions = {
  headers: { [name: string]: string };
  maxFetch: number;
  autoFetch: boolean;
  scanAll: boolean;
  responseTarget: QueryResponseTarget;
};

export type QueryResult<R extends Record> = {
  done: boolean;
  totalSize: number;
  records: R[];
  nextRecordsUrl?: string;
};

export type QueryExplainResult = {
  plans: Array<{
    cardinality: number;
    fields: string[];
    leadingOperationType: 'Index' | 'Other' | 'Sharing' | 'TableScan';
    notes: Array<{
      description: string;
      fields: string[];
      tableEnumOrId: string;
    }>;
    relativeCost: number;
    sobjectCardinality: number;
    sobjectType: string;
  }>;
};

const ResponseTargetValues = [
  'QueryResult',
  'Records',
  'SingleRecord',
  'Count',
] as const;

export type QueryResponseTarget = typeof ResponseTargetValues[number];

export const ResponseTargets: {
  [K in QueryResponseTarget]: K;
} = ResponseTargetValues.reduce(
  (values, target) => ({ ...values, [target]: target }),
  {} as {
    [K in QueryResponseTarget]: K;
  },
);

export type QueryResponse<
  R extends Record,
  QRT extends QueryResponseTarget = QueryResponseTarget
> = QRT extends 'QueryResult'
  ? QueryResult<R>
  : QRT extends 'Records'
  ? R[]
  : QRT extends 'SingleRecord'
  ? R | null
  : number; // QRT extends 'Count'

export type BulkApiVersion = 1 | 2;

export type QueryDestroyOptions = {
  allowBulk?: boolean;
  bulkThreshold?: number;
  bulkApiVersion?: BulkApiVersion;
};

export type QueryUpdateOptions = {
  allowBulk?: boolean;
  bulkThreshold?: number;
  bulkApiVersion?: BulkApiVersion;
};

/**
 *
 */
const DEFAULT_BULK_THRESHOLD = 200;
const DEFAULT_BULK_API_VERSION = 1;

/**
 * Query
 */
export class Query<
  S extends Schema,
  N extends SObjectNames<S>,
  R extends Record = Record,
  QRT extends QueryResponseTarget = QueryResponseTarget
> extends EventEmitter {
  static _logger = getLogger('query');

  _conn: Connection<S>;
  _logger: Logger;
  _soql: Optional<string>;
  _locator: Optional<string>;
  _config: SOQLQueryConfig = {};
  _children: Array<SubQuery<S, N, R, QRT, any, any, any>> = [];
  _options: QueryOptions;
  _executed: boolean = false;
  _finished: boolean = false;
  _chaining: boolean = false;
  _promise: Promise<QueryResponse<R, QRT>>;
  _stream: Serializable<R>;

  totalSize = 0;
  totalFetched = 0;
  records: R[] = [];

  /**
   *
   */
  constructor(
    conn: Connection<S>,
    config: string | QueryConfig<S, N> | { locator: string },
    options?: Partial<QueryOptions>,
  ) {
    super();
    this._conn = conn;
    this._logger = conn._logLevel
      ? Query._logger.createInstance(conn._logLevel)
      : Query._logger;
    if (typeof config === 'string') {
      this._soql = config;
      this._logger.debug(`config is soql: ${config}`);
    } else if (typeof (config as any).locator === 'string') {
      const locator: string = (config as any).locator;
      this._logger.debug(`config is locator: ${locator}`);
      this._locator = locator.includes('/')
        ? this.urlToLocator(locator)
        : locator;
    } else {
      this._logger.debug(`config is QueryConfig: ${JSON.stringify(config)}`);
      const { fields, includes, sort, ..._config } = config as QueryConfig<
        S,
        N
      >;
      this._config = _config;
      this.select(fields);
      if (includes) {
        this.includeChildren(includes);
      }
      if (sort) {
        this.sort(sort);
      }
    }
    this._options = {
      headers: {},
      maxFetch: 10000,
      autoFetch: false,
      scanAll: false,
      responseTarget: 'QueryResult',
      ...(options || {}),
    } as QueryOptions;
    // promise instance
    this._promise = new Promise((resolve, reject) => {
      this.on('response', resolve);
      this.on('error', reject);
    });
    this._stream = new Serializable();
    this.on('record', (record) => this._stream.push(record));
    this.on('end', () => this._stream.push(null));
    this.on('error', (err) => {
      try {
        this._stream.emit('error', err);
      } catch (e) {
        // eslint-disable-line no-empty
      }
    });
  }

  /**
   * Select fields to include in the returning result
   */
  select<
    R extends Record = Record,
    FP extends FieldPathSpecifier<S, N> = FieldPathSpecifier<S, N>,
    FPC extends FieldProjectionConfig = FieldPathScopedProjection<S, N, FP>,
    R2 extends SObjectRecord<S, N, FPC, R> = SObjectRecord<S, N, FPC, R>
  >(fields: QueryField<S, N, FP> = '*'): Query<S, N, R2, QRT> {
    if (this._soql) {
      throw Error(
        'Cannot set select fields for the query which has already built SOQL.',
      );
    }
    function toFieldArray(fields: QueryField<S, N, FP>): string[] {
      return typeof fields === 'string'
        ? fields.split(/\s*,\s*/)
        : Array.isArray(fields)
        ? (fields as Array<string | FP>)
            .map(toFieldArray)
            .reduce<string[]>((fs, f) => [...fs, ...f], [])
        : Object.entries(fields as { [name: string]: QueryField<S, N, FP> })
            .map(([f, v]) => {
              if (typeof v === 'number' || typeof v === 'boolean') {
                return v ? [f] : [];
              } else {
                return toFieldArray(v).map((p) => `${f}.${p}`);
              }
            })
            .reduce<string[]>((fs, f) => [...fs, ...f], []);
    }
    if (fields) {
      this._config.fields = toFieldArray(fields);
    }
    // force convert query record type without changing instance;
    return (this as any) as Query<S, N, R2, QRT>;
  }

  /**
   * Set query conditions to filter the result records
   */
  where(conditions: QueryCondition<S, N> | string) {
    if (this._soql) {
      throw Error(
        'Cannot set where conditions for the query which has already built SOQL.',
      );
    }
    this._config.conditions = conditions;
    return this;
  }

  /**
   * Limit the returning result
   */
  limit(limit: number) {
    if (this._soql) {
      throw Error(
        'Cannot set limit for the query which has already built SOQL.',
      );
    }
    this._config.limit = limit;
    return this;
  }

  /**
   * Skip records
   */
  skip(offset: number) {
    if (this._soql) {
      throw Error(
        'Cannot set skip/offset for the query which has already built SOQL.',
      );
    }
    this._config.offset = offset;
    return this;
  }

  /**
   * Synonym of Query#skip()
   */
  offset = this.skip;

  /**
   * Set query sort with direction
   */
  sort(sort: QuerySort<S, N>|string): this;
  sort(sort: SObjectFieldNames<S, N>|string, dir: SortDir): this;
  sort(
    sort: QuerySort<S, N> | SObjectFieldNames<S, N> | string,
    dir?: SortDir,
  ) {
    if (this._soql) {
      throw Error(
        'Cannot set sort for the query which has already built SOQL.',
      );
    }
    if (typeof sort === 'string' && typeof dir !== 'undefined') {
      this._config.sort = [[sort, dir]];
    } else {
      this._config.sort = sort as string | { [field: string]: SortDir };
    }
    return this;
  }

  /**
   * Synonym of Query#sort()
   */
  orderby: typeof Query.prototype.sort = this.sort;

  /**
   * Include child relationship query and move down to the child query context
   */
  include<
    CRN extends ChildRelationshipNames<S, N>,
    CN extends ChildRelationshipSObjectName<S, N, CRN>,
    CFP extends FieldPathSpecifier<S, CN> = FieldPathSpecifier<S, CN>,
    CFPC extends FieldProjectionConfig = FieldPathScopedProjection<S, CN, CFP>,
    CR extends Record = SObjectRecord<S, CN, CFPC>
  >(
    childRelName: CRN,
    conditions?: Optional<QueryCondition<S, CN>>,
    fields?: Optional<QueryField<S, CN, CFP>>,
    options?: { limit?: number; offset?: number; sort?: QuerySort<S, CN> },
  ): SubQuery<S, N, R, QRT, CRN, CN, CR>;
  include<
    CRN extends ChildRelationshipNames<S, N>,
    CN extends SObjectNames<S>,
    CR extends Record = SObjectRecord<S, CN>
  >(
    childRelName: string,
    conditions?: Optional<QueryCondition<S, CN>>,
    fields?: Optional<QueryField<S, CN>>,
    options?: { limit?: number; offset?: number; sort?: QuerySort<S, CN> },
  ): SubQuery<S, N, R, QRT, CRN, CN, CR>;

  include<
    CRN extends ChildRelationshipNames<S, N>,
    CN extends ChildRelationshipSObjectName<S, N, CRN>,
    CFP extends FieldPathSpecifier<S, CN> = FieldPathSpecifier<S, CN>,
    CFPC extends FieldProjectionConfig = FieldPathScopedProjection<S, CN, CFP>,
    CR extends Record = SObjectRecord<S, CN, CFPC>
  >(
    childRelName: CRN | string,
    conditions?: Optional<QueryCondition<S, CN>>,
    fields?: Optional<QueryField<S, CN, CFP>>,
    options: { limit?: number; offset?: number; sort?: QuerySort<S, CN> } = {},
  ): SubQuery<S, N, R, QRT, CRN, CN, CR> {
    if (this._soql) {
      throw Error(
        'Cannot include child relationship into the query which has already built SOQL.',
      );
    }
    const childConfig: QueryConfig<S, CN, CFP> = {
      fields: fields === null ? undefined : fields,
      table: childRelName,
      conditions: conditions === null ? undefined : conditions,
      limit: options.limit,
      offset: options.offset,
      sort: options.sort,
    };
    // eslint-disable-next-line no-use-before-define
    const childQuery = new SubQuery<S, N, R, QRT, CRN, CN, CR>(
      this._conn,
      childRelName as CRN,
      childConfig,
      this,
    );
    this._children.push(childQuery);
    return childQuery;
  }

  /**
   * Include child relationship queries, but not moving down to the children context
   */
  includeChildren(
    includes: {
      [CRN in ChildRelationshipNames<S, N>]?: QueryConfig<
        S,
        ChildRelationshipSObjectName<S, N, CRN>
      >;
    },
  ) {
    type CRN = ChildRelationshipNames<S, N>;
    if (this._soql) {
      throw Error(
        'Cannot include child relationship into the query which has already built SOQL.',
      );
    }
    for (const crname of Object.keys(includes) as CRN[]) {
      const { conditions, fields, ...options } = includes[
        crname
      ] as QueryConfig<S, ChildRelationshipSObjectName<S, N, CRN>>;
      this.include(crname, conditions, fields, options);
    }
    return this;
  }

  /**
   * Setting maxFetch query option
   */
  maxFetch(maxFetch: number) {
    this._options.maxFetch = maxFetch;
    return this;
  }

  /**
   * Switching auto fetch mode
   */
  autoFetch(autoFetch: boolean) {
    this._options.autoFetch = autoFetch;
    return this;
  }

  /**
   * Set flag to scan all records including deleted and archived.
   */
  scanAll(scanAll: boolean) {
    this._options.scanAll = scanAll;
    return this;
  }

  /**
   *
   */
  setResponseTarget<QRT1 extends QueryResponseTarget>(
    responseTarget: QRT1,
  ): Query<S, N, R, QRT1> {
    if (responseTarget in ResponseTargets) {
      this._options.responseTarget = responseTarget;
    }
    // force change query response target without changing instance
    return (this as Query<S, N, R>) as Query<S, N, R, QRT1>;
  }

  /**
   * Execute query and fetch records from server.
   */
  execute<QRT1 extends QueryResponseTarget = QRT>(
    options_: Partial<QueryOptions> & { responseTarget?: QRT1 } = {},
  ): Query<S, N, R, QRT1> {
    if (this._executed) {
      throw new Error('re-executing already executed query');
    }

    if (this._finished) {
      throw new Error('executing already closed query');
    }

    const options = {
      headers: options_.headers || this._options.headers,
      responseTarget: options_.responseTarget || this._options.responseTarget,
      autoFetch: options_.autoFetch || this._options.autoFetch,
      maxFetch: options_.maxFetch || this._options.maxFetch,
      scanAll: options_.scanAll || this._options.scanAll,
    };

    // collect fetched records in array
    // only when response target is Records and
    // either callback or chaining promises are available to this query.
    this.once('fetch', () => {
      if (
        options.responseTarget === ResponseTargets.Records &&
        this._chaining
      ) {
        this._logger.debug('--- collecting all fetched records ---');
        const records: Record[] = [];
        const onRecord = (record: Record) => records.push(record);
        this.on('record', onRecord);
        this.once('end', () => {
          this.removeListener('record', onRecord);
          this.emit('response', records, this);
        });
      }
    });

    // flag to prevent re-execution
    this._executed = true;

    (async () => {
      // start actual query
      this._logger.debug('>>> Query start >>>');
      try {
        await this._execute(options);
        this._logger.debug('*** Query finished ***');
      } catch (error) {
        this._logger.debug('--- Query error ---', error);
        this.emit('error', error);
      }
    })();

    // return Query instance for chaining
    return (this as Query<S, N, R>) as Query<S, N, R, QRT1>;
  }

  /**
   * Synonym of Query#execute()
   */
  exec = this.execute;

  /**
   * Synonym of Query#execute()
   */
  run = this.execute;

  private locatorToUrl() {
    return this._locator
      ? [this._conn._baseUrl(), '/query/', this._locator].join('')
      : '';
  }

  private urlToLocator(url: string) {
    return url.split('/').pop();
  }

  private constructResponse(
    rawDone: boolean,
    responseTarget: QueryResponseTarget[3],
  ): number;
  private constructResponse(
    rawDone: boolean,
    responseTarget: QueryResponseTarget[2],
  ): R;
  private constructResponse(
    rawDone: boolean,
    responseTarget: QueryResponseTarget[1],
  ): R[];
  private constructResponse(
    rawDone: boolean,
    responseTarget: QueryResponseTarget[0],
  ): QueryResult<R>;
  private constructResponse(
    rawDone: boolean,
    responseTarget: QueryResponseTarget,
  ): QueryResult<R> | R[] | number | R {
    switch (responseTarget) {
      case 'Count':
        return this.totalSize;
      case 'SingleRecord':
        return this.records?.[0] ?? null;
      case 'Records':
        return this.records;
      // QueryResult is default response target
      default:
        return {
          ...{
            records: this.records,
            totalSize: this.totalSize,
            done: rawDone ?? true, // when no records, done is omitted
          },
          ...(this._locator ? { nextRecordsUrl: this.locatorToUrl() } : {}),
        };
    }
  }
  /**
   * @private
   */
  async _execute(options: QueryOptions): Promise<QueryResponse<R>> {
    const { headers, responseTarget, autoFetch, maxFetch, scanAll } = options;
    this._logger.debug('execute with options', options);
    let url;
    if (this._locator) {
      url = this.locatorToUrl();
    } else {
      const soql = await this.toSOQL();
      this._logger.debug(`SOQL = ${soql}`);
      url = [
        this._conn._baseUrl(),
        '/',
        scanAll ? 'queryAll' : 'query',
        '?q=',
        encodeURIComponent(soql),
      ].join('');
    }
    const data = await this._conn.request<R>({ method: 'GET', url, headers });
    this.emit('fetch');
    this.totalSize = data.totalSize;
    this.records = this.records?.concat(
      maxFetch - this.records.length > data.records.length
        ? data.records
        : data.records.slice(0, maxFetch - this.records.length),
    );
    this._locator = data.nextRecordsUrl
      ? this.urlToLocator(data.nextRecordsUrl)
      : undefined;
    this._finished =
      this._finished ||
      data.done ||
      !autoFetch ||
      this.records.length === maxFetch ||
      // this is what the response looks like when there are no results
      (data.records.length === 0 && data.done === undefined);

    // streaming record instances
    const numRecords = data.records?.length ?? 0;
    let totalFetched = this.totalFetched;
    for (let i = 0; i < numRecords; i++) {
      if (totalFetched >= maxFetch) {
        this._finished = true;
        break;
      }
      const record = data.records[i];
      this.emit('record', record, totalFetched, this);
      totalFetched += 1;
    }
    this.totalFetched = totalFetched;

    if (this._finished) {
      const response = this.constructResponse(data.done, responseTarget);
      // only fire response event when it should be notified per fetch
      if (responseTarget !== ResponseTargets.Records) {
        this.emit('response', response, this);
      }
      this.emit('end');
      return response;
    } else {
      return this._execute(options);
    }
  }

  /**
   * Obtain readable stream instance
   */
  stream(type: 'record'): Serializable<R>;
  stream(type: 'csv'): Readable;
  stream(type: 'record' | 'csv' = 'csv') {
    if (!this._finished && !this._executed) {
      this.execute({ autoFetch: true });
    }
    return type === 'record' ? this._stream : this._stream.stream(type);
  }

  /**
   * Pipe the queried records to another stream
   * This is for backward compatibility; Query is not a record stream instance anymore in 2.0.
   * If you want a record stream instance, use `Query#stream('record')`.
   */
  pipe(stream: NodeJS.WritableStream) {
    return this.stream('record').pipe(stream);
  }

  /**
   * @protected
   */
  async _expandFields(sobject_?: string): Promise<void> {
    if (this._soql) {
      throw new Error(
        'Cannot expand fields for the query which has already built SOQL.',
      );
    }
    const { fields = [], table = '' } = this._config;
    const sobject = sobject_ || table;
    this._logger.debug(
      `_expandFields: sobject = ${sobject}, fields = ${fields.join(', ')}`,
    );
    const [efields] = await Promise.all([
      this._expandAsteriskFields(sobject, fields),
      ...this._children.map(async (childQuery) => {
        await childQuery._expandFields();
        return [] as string[];
      }),
    ]);
    this._config.fields = efields;
    this._config.includes = this._children
      .map((cquery) => {
        const cconfig = cquery._query._config;
        return [cconfig.table, cconfig] as [string, SOQLQueryConfig];
      })
      .reduce<{ [name: string]: SOQLQueryConfig }>(
        (includes, [ctable, cconfig]) => ({
          ...includes,
          [ctable]: cconfig,
        }),
        {},
      );
  }

  /**
   *
   */
  async _findRelationObject(relName: string): Promise<string> {
    const table = this._config.table;
    if (!table) {
      throw new Error('No table information provided in the query');
    }
    this._logger.debug(
      `finding table for relation "${relName}" in "${table}"...`,
    );
    const sobject = await this._conn.describe$(table);
    const upperRname = relName.toUpperCase();
    for (const cr of sobject.childRelationships) {
      if (
        (cr.relationshipName || '').toUpperCase() === upperRname &&
        cr.childSObject
      ) {
        return cr.childSObject;
      }
    }
    throw new Error(`No child relationship found: ${relName}`);
  }

  /**
   *
   */
  async _expandAsteriskFields(
    sobject: string,
    fields: string[],
  ): Promise<string[]> {
    const expandedFields = await Promise.all(
      fields.map(async (field) => this._expandAsteriskField(sobject, field)),
    );
    return expandedFields.reduce(
      (eflds: string[], flds: string[]): string[] => [...eflds, ...flds],
      [],
    );
  }

  /**
   *
   */
  async _expandAsteriskField(
    sobject: string,
    field: string,
  ): Promise<string[]> {
    this._logger.debug(`expanding field "${field}" in "${sobject}"...`);
    const fpath = field.split('.');
    if (fpath[fpath.length - 1] === '*') {
      const so = await this._conn.describe$(sobject);
      this._logger.debug(`table ${sobject} has been described`);
      if (fpath.length > 1) {
        const rname = fpath.shift();
        for (const f of so.fields) {
          if (
            f.relationshipName &&
            rname &&
            f.relationshipName.toUpperCase() === rname.toUpperCase()
          ) {
            const rfield = f;
            const referenceTo = rfield.referenceTo || [];
            const rtable = referenceTo.length === 1 ? referenceTo[0] : 'Name';
            const fpaths = await this._expandAsteriskField(
              rtable,
              fpath.join('.'),
            );
            return fpaths.map((fp) => `${rname}.${fp}`);
          }
        }
        return [];
      }
      return so.fields.map((f) => f.name);
    }
    return [field];
  }

  /**
   * Explain plan for executing query
   */
  async explain() {
    const soql = await this.toSOQL();
    this._logger.debug(`SOQL = ${soql}`);
    const url = `/query/?explain=${encodeURIComponent(soql)}`;
    return this._conn.request<QueryExplainResult>(url);
  }

  /**
   * Return SOQL expression for the query
   */
  async toSOQL() {
    if (this._soql) {
      return this._soql;
    }
    await this._expandFields();
    return createSOQL(this._config);
  }

  /**
   * Promise/A+ interface
   * http://promises-aplus.github.io/promises-spec/
   *
   * Delegate to deferred promise, return promise instance for query result
   */
  then<U, V>(
    onResolve?:
      | ((qr: QueryResponse<R, QRT>) => U | Promise<U>)
      | null
      | undefined,
    onReject?: ((err: Error) => V | Promise<V>) | null | undefined,
  ): Promise<U | V> {
    this._chaining = true;
    if (!this._finished && !this._executed) {
      this.execute();
    }
    if (!this._promise) {
      throw new Error(
        'invalid state: promise is not set after query execution',
      );
    }
    return this._promise.then(onResolve, onReject);
  }

  catch(
    onReject: (
      err: Error,
    ) => QueryResponse<R, QRT> | Promise<QueryResponse<R, QRT>>,
  ): Promise<QueryResponse<R, QRT>> {
    return this.then(null, onReject);
  }

  promise(): Promise<QueryResponse<R, QRT>> {
    // TODO(cristian): verify this is correct
    return Promise.resolve((this as unknown) as QueryResponse<R, QRT>);
  }

  /**
   * Bulk delete queried records
   */
  destroy(options?: QueryDestroyOptions): Promise<SaveResult[]>;
  destroy(type: N, options?: QueryDestroyOptions): Promise<SaveResult[]>;
  destroy(type?: N | QueryDestroyOptions, options?: QueryDestroyOptions) {
    if (typeof type === 'object' && type !== null) {
      options = type;
      type = undefined;
    }
    options = options || {};
    const type_: Optional<N> = type || (this._config.table as Optional<N>);
    if (!type_) {
      throw new Error(
        'SOQL based query needs SObject type information to bulk delete.',
      );
    }
    // Set the threshold number to pass to bulk API
    const thresholdNum =
      options.allowBulk === false
        ? -1
        : typeof options.bulkThreshold === 'number'
        ? options.bulkThreshold
        : // determine threshold if the connection version supports SObject collection API or not
        this._conn._ensureVersion(42)
        ? DEFAULT_BULK_THRESHOLD
        : this._conn._maxRequest / 2;

    const bulkApiVersion = options.bulkApiVersion ?? DEFAULT_BULK_API_VERSION;

    return new Promise((resolve, reject) => {
      const createBatch = () =>
        this._conn
          .sobject(type_)
          .deleteBulk()
          .on('response', resolve)
          .on('error', reject);
      let records: Record[] = [];
      let batch: ReturnType<typeof createBatch> | null = null;
      const handleRecord = (rec: Record) => {
        if (!rec.Id) {
          const err = new Error(
            'Queried record does not include Salesforce record ID.',
          );
          this.emit('error', err);
          return;
        }
        const record: Record = { Id: rec.Id };
        if (batch) {
          batch.write(record);
        } else {
          records.push(record);
          if (
            thresholdNum >= 0 &&
            records.length > thresholdNum &&
            bulkApiVersion === 1
          ) {
            // Use bulk delete instead of SObject REST API
            batch = createBatch();
            for (const record of records) {
              batch.write(record);
            }
            records = [];
          }
        }
      };
      const handleEnd = () => {
        if (batch) {
          batch.end();
        } else {
          const ids = records.map((record) => record.Id as string);
          if (records.length > thresholdNum && bulkApiVersion === 2) {
            this._conn.bulk2
              .loadAndWaitForResults({
                object: type_,
                operation: 'delete',
                input: records,
              })
              .then(
                (allResults) =>
                  resolve(this.mapBulkV2ResultsToSaveResults(allResults)),
                reject,
              );
          } else {
            this._conn
              .sobject(type_)
              .destroy(ids, { allowRecursive: true })
              .then(resolve, reject);
          }
        }
      };
      this.stream('record')
        .on('data', handleRecord)
        .on('end', handleEnd)
        .on('error', reject);
    });
  }

  /**
   * Synonym of Query#destroy()
   */
  delete = this.destroy;

  /**
   * Synonym of Query#destroy()
   */
  del = this.destroy;

  /**
   * Bulk update queried records, using given mapping function/object
   */
  update<UR extends SObjectInputRecord<S, N>>(
    mapping: ((rec: R) => UR) | UR,
    type: N,
    options?: QueryUpdateOptions,
  ): Promise<SaveResult[]>;
  update<UR extends SObjectInputRecord<S, N>>(
    mapping: ((rec: R) => UR) | UR,
    options?: QueryUpdateOptions,
  ): Promise<SaveResult[]>;
  update<UR extends SObjectInputRecord<S, N>>(
    mapping: ((rec: R) => UR) | UR,
    type?: N | QueryUpdateOptions,
    options?: QueryUpdateOptions,
  ) {
    if (typeof type === 'object' && type !== null) {
      options = type;
      type = undefined;
    }
    options = options || {};
    const type_: Optional<N> =
      type || (this._config && (this._config.table as Optional<N>));
    if (!type_) {
      throw new Error(
        'SOQL based query needs SObject type information to bulk update.',
      );
    }
    const updateStream =
      typeof mapping === 'function'
        ? RecordStream.map(mapping)
        : RecordStream.recordMapStream(mapping);
    // Set the threshold number to pass to bulk API
    const thresholdNum =
      options.allowBulk === false
        ? -1
        : typeof options.bulkThreshold === 'number'
        ? options.bulkThreshold
        : // determine threshold if the connection version supports SObject collection API or not
        this._conn._ensureVersion(42)
        ? DEFAULT_BULK_THRESHOLD
        : this._conn._maxRequest / 2;
    const bulkApiVersion = options.bulkApiVersion ?? DEFAULT_BULK_API_VERSION;
    return new Promise((resolve, reject) => {
      const createBatch = () =>
        this._conn
          .sobject(type_)
          .updateBulk()
          .on('response', resolve)
          .on('error', reject);
      let records: Array<SObjectUpdateRecord<S, N>> = [];
      let batch: ReturnType<typeof createBatch> | null = null;
      const handleRecord = (record: Record) => {
        if (batch) {
          batch.write(record);
        } else {
          records.push(record as SObjectUpdateRecord<S, N>);
        }
        if (
          thresholdNum >= 0 &&
          records.length > thresholdNum &&
          bulkApiVersion === 1
        ) {
          // Use bulk update instead of SObject REST API
          batch = createBatch();
          for (const record of records) {
            batch.write(record);
          }
          records = [];
        }
      };
      const handleEnd = () => {
        if (batch) {
          batch.end();
        } else {
          if (records.length > thresholdNum && bulkApiVersion === 2) {
            this._conn.bulk2
              .loadAndWaitForResults({
                object: type_,
                operation: 'update',
                input: records,
              })
              .then(
                (allResults) =>
                  resolve(this.mapBulkV2ResultsToSaveResults(allResults)),
                reject,
              );
          } else {
            this._conn
              .sobject(type_)
              .update(records, { allowRecursive: true })
              .then(resolve, reject);
          }
        }
      };
      this.stream('record')
        .on('error', reject)
        .pipe(updateStream)
        .on('data', handleRecord)
        .on('end', handleEnd)
        .on('error', reject);
    });
  }

  private mapBulkV2ResultsToSaveResults(
    bulkJobAllResults: IngestJobV2Results<S>,
  ): SaveResult[] {
    const successSaveResults: SaveResult[] = bulkJobAllResults.successfulResults.map(
      (r) => {
        const saveResult: SaveResult = {
          id: r.sf__Id,
          success: true,
          errors: [],
        };
        return saveResult;
      },
    );

    const failedSaveResults = bulkJobAllResults.failedResults.map((r) => {
      const saveResult: SaveResult = {
        success: false,
        errors: [
          {
            errorCode: r.sf__Error,
            message: r.sf__Error,
          },
        ],
      };
      return saveResult;
    });

    return [...successSaveResults, ...failedSaveResults];
  }
}

/*--------------------------------------------*/

/**
 * SubQuery object for representing child relationship query
 */
export class SubQuery<
  S extends Schema,
  PN extends SObjectNames<S>,
  PR extends Record,
  PQRT extends QueryResponseTarget,
  CRN extends ChildRelationshipNames<S, PN> = ChildRelationshipNames<S, PN>,
  CN extends SObjectNames<S> = ChildRelationshipSObjectName<S, PN, CRN>,
  CR extends Record = Record
> {
  _relName: CRN;
  _query: Query<S, CN, CR>;
  _parent: Query<S, PN, PR, PQRT>;

  /**
   *
   */
  constructor(
    conn: Connection<S>,
    relName: CRN,
    config: QueryConfig<S, CN>,
    parent: Query<S, PN, PR, PQRT>,
  ) {
    this._relName = relName;
    this._query = new Query(conn, config);
    this._parent = parent;
  }

  /**
   *
   */
  select<
    R extends Record = Record,
    FP extends FieldPathSpecifier<S, CN> = FieldPathSpecifier<S, CN>,
    FPC extends FieldProjectionConfig = FieldPathScopedProjection<S, CN, FP>
  >(
    fields: QueryField<S, CN, FP>,
  ): SubQuery<S, PN, PR, PQRT, CRN, CN, SObjectRecord<S, CN, FPC, R>> {
    // force convert query record type without changing instance
    this._query = this._query.select(fields) as any;
    return (this as any) as SubQuery<
      S,
      PN,
      PR,
      PQRT,
      CRN,
      CN,
      SObjectRecord<S, CN, FPC, R>
    >;
  }

  /**
   *
   */
  where(conditions: QueryCondition<S, CN> | string): this {
    this._query = this._query.where(conditions);
    return this;
  }

  /**
   * Limit the returning result
   */
  limit(limit: number) {
    this._query = this._query.limit(limit);
    return this;
  }

  /**
   * Skip records
   */
  skip(offset: number) {
    this._query = this._query.skip(offset);
    return this;
  }

  /**
   * Synonym of SubQuery#skip()
   */
  offset = this.skip;

  /**
   * Set query sort with direction
   */
  sort(sort: QuerySort<S, CN>): this;
  sort(sort: string| SObjectFieldNames<S, CN>, dir: SortDir): this;
  sort(
    sort: QuerySort<S, CN> | SObjectFieldNames<S, CN> | string,
    dir?: SortDir,
  ) {
    this._query = this._query.sort(sort as any, dir as SortDir);
    return this;
  }

  /**
   * Synonym of SubQuery#sort()
   */
  orderby: typeof SubQuery.prototype.sort = this.sort;

  /**
   *
   */
  async _expandFields() {
    const sobject = await this._parent._findRelationObject(this._relName);
    return this._query._expandFields(sobject);
  }

  /**
   * Back the context to parent query object
   */
  end<
    CRP extends SObjectChildRelationshipProp<
      CRN,
      CR
    > = SObjectChildRelationshipProp<CRN, CR>,
    PR1 extends Record = PR & CRP
  >(): Query<S, PN, PR1, PQRT> {
    return (this._parent as any) as Query<S, PN, PR1, PQRT>;
  }
}

export default Query;
