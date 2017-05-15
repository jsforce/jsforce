/* @flow */
import { Logger, getLogger } from './util/logger';
import type {
  Record, UnsavedRecord,
  DescribeLayoutResult, DescribeCompactLayoutsResult, DescribeApprovalLayoutsResult,
} from './types';
import Connection from './connection';
import RecordReference from './record-reference';

/**
 * A class for organizing all SObject access
 */
export default class SObject {
  static _logger = getLogger('sobject');

  type: string;
  _conn: Connection;
  _logger: Logger;

  layouts: (ln?: string) => Promise<DescribeLayoutResult>;
  layouts$: (ln?: string) => Promise<DescribeLayoutResult>;
  layouts$$: (ln?: string) => DescribeLayoutResult;
  compactLayouts: () => Promise<DescribeCompactLayoutsResult>;
  compactLayouts$: () => Promise<DescribeCompactLayoutsResult>;
  compactLayouts$$: () => DescribeCompactLayoutsResult;
  approvalLayouts: () => Promise<DescribeApprovalLayoutsResult>;
  approvalLayouts$: () => Promise<DescribeApprovalLayoutsResult>;
  approvalLayouts$$: () => DescribeCompactLayoutsResult;

  /**
   *
   */
  constructor(conn: Connection, type: string) {
    this.type = type;
    this._conn = conn;
    this._logger =
      conn._logLevel ? SObject._logger.createInstance(conn._logLevel) : SObject._logger;
    const cache = this._conn.cache;
    const layoutCacheKey = layoutName => (layoutName ? `layouts.namedLayouts.${layoutName}` : `layouts.${this.type}`);
    const layouts = this.layouts;
    this.layouts = (
      cache.createCachedFunction(layouts, this, { key: layoutCacheKey, strategy: 'NOCACHE' }) : any
    );
    this.layouts$ = (
      cache.createCachedFunction(layouts, this, { key: layoutCacheKey, strategy: 'HIT' }) : any
    );
    this.layouts$$ = (
      cache.createCachedFunction(layouts, this, { key: layoutCacheKey, strategy: 'IMMEDIATE' }) : any
    );
    const compactLayoutCacheKey = `compactLayouts.${this.type}`;
    const compactLayouts = this.compactLayouts;
    this.compactLayouts = (
      cache.createCachedFunction(compactLayouts, this, { key: compactLayoutCacheKey, strategy: 'NOCACHE' }) : any
    );
    this.compactLayouts$ = (
      cache.createCachedFunction(compactLayouts, this, { key: compactLayoutCacheKey, strategy: 'HIT' }) : any
    );
    this.compactLayouts$$ = (
      cache.createCachedFunction(compactLayouts, this, { key: compactLayoutCacheKey, strategy: 'IMMEDIATE' }) : any
    );
    const approvalLayoutCacheKey = `approvalLayouts.${this.type}`;
    const approvalLayouts = this.approvalLayouts;
    this.approvalLayouts = (
      cache.createCachedFunction(approvalLayouts, this, { key: approvalLayoutCacheKey, strategy: 'NOCACHE' }) : any
    );
    this.approvalLayouts$ = (
      cache.createCachedFunction(approvalLayouts, this, { key: approvalLayoutCacheKey, strategy: 'HIT' }) : any
    );
    this.approvalLayouts$$ = (
      cache.createCachedFunction(approvalLayouts, this, { key: approvalLayoutCacheKey, strategy: 'IMMEDIATE' }) : any
    );
  }

  /**
   * Create records
   */
  create(records: UnsavedRecord | UnsavedRecord[], options?: Object) {
    return this._conn.create(this.type, records, options);
  }

  /**
   * Synonym of SObject#create()
   */
  insert = this.create;

  /**
   * Retrieve specified records
   */
  retrieve(ids: string | string[], options?: Object) {
    return this._conn.retrieve(this.type, ids, options);
  }

  /**
   * Update records
   */
  update(records: Record | Record[], options?: Object) {
    return this._conn.update(this.type, records, options);
  }

  /**
   * Upsert records
   */
  upsert(records: Record | Record[], extIdField: string, options?: Object) {
    return this._conn.upsert(this.type, records, extIdField, options);
  }

  /**
   * Delete records
   */
  destroy(ids: string | string[], options?: Object) {
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
  record(id: string) {
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
    const url = `/sobjects/${this.type}/describe/${layoutName ? `namedLayouts/${layoutName}` : 'layouts'}`;
    const body: any = await this._conn.request(url);
    return (body : DescribeLayoutResult);
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
    const body: any = await this._conn.request(url);
    return (body : DescribeCompactLayoutsResult);
  }

  /**
   * Describe compact layout information defined for SObject
   *
   * @param {Callback.<ApprovalLayoutInfo>} [callback] - Callback function
   * @returns {Promise.<ApprovalLayoutInfo>}
   */
  async approvalLayouts(): Promise<DescribeApprovalLayoutsResult> {
    const url = `/sobjects/${this.type}/describe/approvalLayouts`;
    const body: any = await this._conn.request(url);
    return (body : DescribeApprovalLayoutsResult);
  }
}

// TODO: find, recent, listview....
