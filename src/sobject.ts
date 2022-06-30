/**
 *
 */
import { Logger, getLogger } from './util/logger';
import {
  Record,
  DescribeLayoutResult,
  DescribeCompactLayoutsResult,
  DescribeApprovalLayoutsResult,
  Optional,
  DmlOptions,
  SaveResult,
  UpsertResult,
  RetrieveOptions,
  Schema,
  SObjectNames,
  SObjectRecord,
  SObjectInputRecord,
  SObjectUpdateRecord,
  SObjectFieldNames,
  FieldProjectionConfig,
  FieldPathSpecifier,
  FieldPathScopedProjection,
} from './types';
import Connection from './connection';
import RecordReference from './record-reference';
import Query, {
  ResponseTargets,
  QueryOptions,
  QueryField,
  QueryCondition,
  QueryConfig,
} from './query';
import QuickAction from './quick-action';
import { CachedFunction } from './cache';
import { Readable } from 'stream';

export type FindOptions<S extends Schema, N extends SObjectNames<S>> = Partial<
  QueryOptions &
    Pick<QueryConfig<S, N>, 'sort' | 'includes'> & {
      limit: number;
      offset: number;
    }
>;

/**
 * A class for organizing all SObject access
 */
export class SObject<
  S extends Schema,
  N extends SObjectNames<S>,
  FieldNames extends SObjectFieldNames<S, N> = SObjectFieldNames<S, N>,
  RetrieveRecord extends SObjectRecord<S, N, '*'> = SObjectRecord<S, N, '*'>,
  InputRecord extends SObjectInputRecord<S, N> = SObjectInputRecord<S, N>,
  UpdateRecord extends SObjectUpdateRecord<S, N> = SObjectUpdateRecord<S, N>
> {
  static _logger = getLogger('sobject');

  type: N;
  _conn: Connection<S>;
  _logger: Logger;

  // layouts: (ln?: string) => Promise<DescribeLayoutResult>;
  layouts$: CachedFunction<(ln?: string) => Promise<DescribeLayoutResult>>;
  layouts$$: CachedFunction<(ln?: string) => DescribeLayoutResult>;
  // compactLayouts: () => Promise<DescribeCompactLayoutsResult>;
  compactLayouts$: CachedFunction<() => Promise<DescribeCompactLayoutsResult>>;
  compactLayouts$$: CachedFunction<() => DescribeCompactLayoutsResult>;
  // approvalLayouts: () => Promise<DescribeApprovalLayoutsResult>;
  approvalLayouts$: CachedFunction<
    () => Promise<DescribeApprovalLayoutsResult>
  >;
  approvalLayouts$$: CachedFunction<() => DescribeApprovalLayoutsResult>;

  /**
   *
   */
  constructor(conn: Connection<S>, type: N) {
    this.type = type;
    this._conn = conn;
    this._logger = conn._logLevel
      ? SObject._logger.createInstance(conn._logLevel)
      : SObject._logger;
    const cache = this._conn.cache;
    const layoutCacheKey = (layoutName: string) =>
      layoutName
        ? `layouts.namedLayouts.${layoutName}`
        : `layouts.${this.type}`;
    const layouts = SObject.prototype.layouts;
    this.layouts = cache.createCachedFunction(layouts, this, {
      key: layoutCacheKey,
      strategy: 'NOCACHE',
    });
    this.layouts$ = cache.createCachedFunction(layouts, this, {
      key: layoutCacheKey,
      strategy: 'HIT',
    });
    this.layouts$$ = cache.createCachedFunction(layouts, this, {
      key: layoutCacheKey,
      strategy: 'IMMEDIATE',
    }) as any;
    const compactLayoutCacheKey = `compactLayouts.${this.type}`;
    const compactLayouts = SObject.prototype.compactLayouts;
    this.compactLayouts = cache.createCachedFunction(compactLayouts, this, {
      key: compactLayoutCacheKey,
      strategy: 'NOCACHE',
    });
    this.compactLayouts$ = cache.createCachedFunction(compactLayouts, this, {
      key: compactLayoutCacheKey,
      strategy: 'HIT',
    });
    this.compactLayouts$$ = cache.createCachedFunction(compactLayouts, this, {
      key: compactLayoutCacheKey,
      strategy: 'IMMEDIATE',
    }) as any;
    const approvalLayoutCacheKey = `approvalLayouts.${this.type}`;
    const approvalLayouts = SObject.prototype.approvalLayouts;
    this.approvalLayouts = cache.createCachedFunction(approvalLayouts, this, {
      key: approvalLayoutCacheKey,
      strategy: 'NOCACHE',
    });
    this.approvalLayouts$ = cache.createCachedFunction(approvalLayouts, this, {
      key: approvalLayoutCacheKey,
      strategy: 'HIT',
    });
    this.approvalLayouts$$ = cache.createCachedFunction(approvalLayouts, this, {
      key: approvalLayoutCacheKey,
      strategy: 'IMMEDIATE',
    }) as any;
  }

  /**
   * Create records
   */
  create(records: InputRecord[], options?: DmlOptions): Promise<SaveResult[]>;
  create(records: InputRecord, options?: DmlOptions): Promise<SaveResult>;
  create(
    records: InputRecord | InputRecord[],
    options?: DmlOptions,
  ): Promise<SaveResult | SaveResult[]>;
  create(records: InputRecord | InputRecord[], options?: DmlOptions) {
    return this._conn.create(this.type, records, options);
  }

  /**
   * Synonym of SObject#create()
   */
  insert = this.create;

  /**
   * Retrieve specified records
   */
  retrieve(ids: string[], options?: RetrieveOptions): Promise<RetrieveRecord[]>;
  retrieve(ids: string, options?: RetrieveOptions): Promise<RetrieveRecord>;
  retrieve(
    ids: string | string[],
    options?: RetrieveOptions,
  ): Promise<RetrieveRecord | RetrieveRecord[]>;
  retrieve(ids: string | string[], options?: RetrieveOptions) {
    return this._conn.retrieve(this.type, ids, options);
  }

  /**
   * Update records
   */
  update(records: UpdateRecord[], options?: DmlOptions): Promise<SaveResult[]>;
  update(records: UpdateRecord, options?: DmlOptions): Promise<SaveResult>;
  update(
    records: UpdateRecord | UpdateRecord[],
    options?: DmlOptions,
  ): Promise<SaveResult | SaveResult[]>;
  update(records: UpdateRecord | UpdateRecord[], options?: DmlOptions) {
    return this._conn.update(this.type, records, options);
  }

  /**
   * Upsert records
   */
  upsert(
    records: InputRecord[],
    extIdField: FieldNames,
    options?: DmlOptions,
  ): Promise<UpsertResult[]>;
  upsert(
    records: InputRecord,
    extIdField: FieldNames,
    options?: DmlOptions,
  ): Promise<UpsertResult>;
  upsert(
    records: InputRecord | InputRecord[],
    extIdField: FieldNames,
    options?: DmlOptions,
  ): Promise<UpsertResult | UpsertResult[]>;
  upsert(
    records: InputRecord | InputRecord[],
    extIdField: FieldNames,
    options?: DmlOptions,
  ) {
    return this._conn.upsert(this.type, records, extIdField, options);
  }

  /**
   * Delete records
   */
  destroy(ids: string[], options?: DmlOptions): Promise<SaveResult[]>;
  destroy(ids: string, options?: DmlOptions): Promise<SaveResult>;
  destroy(
    ids: string | string[],
    options?: DmlOptions,
  ): Promise<SaveResult | SaveResult[]>;
  destroy(ids: string | string[], options?: DmlOptions) {
    return this._conn.destroy(this.type, ids, options);
  }

  /**
   * Synonym of SObject#destroy()
   */
  delete = this.destroy;

  /**
   * Synonym of SObject#destroy()
   */
  del = this.destroy;

  /**
   * Call Bulk#load() to execute bulkload, returning batch object
   */
  bulkload(
    operation: 'insert' | 'update' | 'upsert' | 'delete' | 'hardDelete',
    optionsOrInput?: Object | Record[] | Readable | string,
    input?: Record[] | Readable | string,
  ) {
    return this._conn.bulk.load(this.type, operation, optionsOrInput, input);
  }

  /**
   * Bulkly insert input data using bulk API
   */
  createBulk(input?: Record[] | Readable | string) {
    return this.bulkload('insert', input);
  }

  /**
   * Synonym of SObject#createBulk()
   */
  insertBulk = this.createBulk;

  /**
   * Bulkly update records by input data using bulk API
   */
  updateBulk(input?: Record[] | Readable | string) {
    return this.bulkload('update', input);
  }

  /**
   * Bulkly upsert records by input data using bulk API
   */
  upsertBulk(input?: Record[] | Readable | string, extIdField?: string) {
    return this.bulkload('upsert', { extIdField }, input);
  }

  /**
   * Bulkly delete records specified by input data using bulk API
   */
  destroyBulk(input?: Record[] | Readable | string) {
    return this.bulkload('delete', input);
  }

  /**
   * Synonym of SObject#destroyBulk()
   */
  deleteBulk = this.destroyBulk;

  /**
   * Bulkly hard delete records specified in input data using bulk API
   */
  destroyHardBulk(input: Record[] | Readable) {
    return this.bulkload('hardDelete', input);
  }

  /**
   * Synonym of SObject#destroyHardBulk()
   */
  deleteHardBulk = this.destroyHardBulk;

  /**
   * Describe SObject metadata
   */
  describe() {
    return this._conn.describe(this.type);
  }

  /**
   *
   */
  describe$() {
    return this._conn.describe$(this.type);
  }

  /**
   *
   */
  describe$$() {
    return this._conn.describe$$(this.type);
  }

  /**
   * Get record representation instance by given id
   */
  record(id: string): RecordReference<S, N> {
    return new RecordReference(this._conn, this.type, id);
  }

  /**
   * Retrieve recently accessed records
   */
  recent() {
    return this._conn.recent(this.type);
  }

  /**
   * Retrieve the updated records
   */
  updated(start: string | Date, end: string | Date) {
    return this._conn.updated(this.type, start, end);
  }

  /**
   * Retrieve the deleted records
   */
  deleted(start: string | Date, end: string | Date) {
    return this._conn.deleted(this.type, start, end);
  }

  /**
   * Describe layout information for SObject
   */
  async layouts(layoutName?: string): Promise<DescribeLayoutResult> {
    const url = `/sobjects/${this.type}/describe/${
      layoutName ? `namedLayouts/${layoutName}` : 'layouts'
    }`;
    const body = await this._conn.request(url);
    return body as DescribeLayoutResult;
  }

  /**
   * @typedef {Object} CompactLayoutInfo
   * @prop {Array.<Object>} compactLayouts - Array of compact layouts
   * @prop {String} defaultCompactLayoutId - ID of default compact layout
   * @prop {Array.<Object>} recordTypeCompactLayoutMappings - Array of record type mappings
   */
  /**
   * Describe compact layout information defined for SObject
   *
   * @param {Callback.<CompactLayoutInfo>} [callback] - Callback function
   * @returns {Promise.<CompactLayoutInfo>}
   */
  async compactLayouts(): Promise<DescribeCompactLayoutsResult> {
    const url = `/sobjects/${this.type}/describe/compactLayouts`;
    const body = await this._conn.request(url);
    return body as DescribeCompactLayoutsResult;
  }

  /**
   * Describe compact layout information defined for SObject
   *
   * @param {Callback.<ApprovalLayoutInfo>} [callback] - Callback function
   * @returns {Promise.<ApprovalLayoutInfo>}
   */
  async approvalLayouts(): Promise<DescribeApprovalLayoutsResult> {
    const url = `/sobjects/${this.type}/describe/approvalLayouts`;
    const body = await this._conn.request(url);
    return body as DescribeApprovalLayoutsResult;
  }

  /**
   * Find and fetch records which matches given conditions
   */
  find<R extends Record = Record>(
    conditions?: Optional<QueryCondition<S, N>>,
  ): Query<S, N, SObjectRecord<S, N, '*', R>, 'Records'>;
  find<
    R extends Record = Record,
    FP extends FieldPathSpecifier<S, N> = FieldPathSpecifier<S, N>,
    FPC extends FieldProjectionConfig = FieldPathScopedProjection<S, N, FP>
  >(
    conditions: Optional<QueryCondition<S, N>>,
    fields?: Optional<QueryField<S, N, FP>>,
    options?: FindOptions<S, N>,
  ): Query<S, N, SObjectRecord<S, N, FPC, R>, 'Records'>;
  find(
    conditions?: Optional<QueryCondition<S, N>>,
    fields?: Optional<QueryField<S, N, FieldPathSpecifier<S, N>>>,
    options: FindOptions<S, N> = {},
  ): Query<S, N, any, 'Records'> {
    const { sort, limit, offset, ...qoptions } = options;
    const config: QueryConfig<S, N> = {
      fields: fields == null ? undefined : fields,
      includes: options.includes,
      table: this.type,
      conditions: conditions == null ? undefined : conditions,
      sort,
      limit,
      offset,
    };
    const query = new Query<S, N>(this._conn, config, qoptions);
    return query.setResponseTarget(ResponseTargets.Records);
  }

  /**
   * Fetch one record which matches given conditions
   */
  findOne<R extends Record = Record>(
    conditions?: Optional<QueryCondition<S, N>>,
  ): Query<S, N, SObjectRecord<S, N, '*', R>, 'SingleRecord'>;
  findOne<
    R extends Record = Record,
    FP extends FieldPathSpecifier<S, N> = FieldPathSpecifier<S, N>,
    FPC extends FieldProjectionConfig = FieldPathScopedProjection<S, N, FP>
  >(
    conditions: Optional<QueryCondition<S, N>>,
    fields?: Optional<QueryField<S, N, FP>>,
    options?: FindOptions<S, N>,
  ): Query<S, N, SObjectRecord<S, N, FPC, R>, 'SingleRecord'>;
  findOne(
    conditions?: Optional<QueryCondition<S, N>>,
    fields?: Optional<QueryField<S, N, FieldPathSpecifier<S, N>>>,
    options: FindOptions<S, N> = {},
  ): Query<S, N, any, 'SingleRecord'> {
    const query = this.find(conditions, fields, { ...options, limit: 1 });
    return query.setResponseTarget(ResponseTargets.SingleRecord);
  }

  /**
   * Find and fetch records only by specifying fields to fetch.
   */
  select<
    R extends Record = Record,
    FP extends FieldPathSpecifier<S, N> = FieldPathSpecifier<S, N>,
    FPC extends FieldProjectionConfig = FieldPathScopedProjection<S, N, FP>
  >(
    fields: QueryField<S, N, FP>,
  ): Query<S, N, SObjectRecord<S, N, FPC, R>, 'Records'> {
    return this.find(null, fields);
  }

  /**
   * Count num of records which matches given conditions
   */
  count(conditions?: Optional<QueryCondition<S, N>>) {
    const query = this.find(conditions, 'count()');
    return query.setResponseTarget(ResponseTargets.Count);
  }

  /**
   * Returns the list of list views for the SObject
   *
   * @param {Callback.<ListViewsInfo>} [callback] - Callback function
   * @returns {Promise.<ListViewsInfo>}
   */
  listviews() {
    const url = `${this._conn._baseUrl()}/sobjects/${this.type}/listviews`;
    return this._conn.request(url);
  }

  /**
   * Returns the list view info in specifed view id
   *
   * @param {String} id - List view ID
   * @returns {ListView}
   */
  listview(id: string) {
    return new ListView(this._conn, this.type, id); // eslint-disable-line no-use-before-define
  }

  /**
   * Returns all registered quick actions for the SObject
   *
   * @param {Callback.<Array.<QuickAction~QuickActionInfo>>} [callback] - Callback function
   * @returns {Promise.<Array.<QuickAction~QuickActionInfo>>}
   */
  quickActions() {
    return this._conn.request(`/sobjects/${this.type}/quickActions`);
  }

  /**
   * Get reference for specified quick aciton in the SObject
   *
   * @param {String} actionName - Name of the quick action
   * @returns {QuickAction}
   */
  quickAction(actionName: string) {
    return new QuickAction(
      this._conn,
      `/sobjects/${this.type}/quickActions/${actionName}`,
    );
  }
}

/**
 * A class for organizing list view information
 *
 * @protected
 * @class ListView
 * @param {Connection} conn - Connection instance
 * @param {SObject} type - SObject type
 * @param {String} id - List view ID
 */
class ListView {
  _conn: Connection;
  type: string;
  id: string;

  /**
   *
   */
  constructor(conn: Connection, type: string, id: string) {
    this._conn = conn;
    this.type = type;
    this.id = id;
  }

  /**
   * Executes query for the list view and returns the resulting data and presentation information.
   */
  results() {
    const url = `${this._conn._baseUrl()}/sobjects/${this.type}/listviews/${
      this.id
    }/results`;
    return this._conn.request(url);
  }

  /**
   * Returns detailed information about a list view
   */
  describe(options: { headers?: { [name: string]: string } } = {}) {
    const url = `${this._conn._baseUrl()}/sobjects/${this.type}/listviews/${
      this.id
    }/describe`;
    return this._conn.request({ method: 'GET', url, headers: options.headers });
  }

  /**
   * Explain plan for executing list view
   */
  explain() {
    const url = `/query/?explain=${this.id}`;
    return this._conn.request<any>(url);
  }
}

export default SObject;

// TODO Bulk
