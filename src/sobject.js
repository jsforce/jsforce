/* @flow */
import { Logger, getLogger } from './util/logger';
import type { Record, UnsavedRecord } from './types';
import Connection from './connection';

/**
 * A class for organizing all SObject access
 */
export default class SObject {
  static _logger = getLogger('sobject');

  type: string;
  _conn: Connection;
  _logger: Logger;

  /**
   *
   */
  constructor(conn: Connection, type: string) {
    this.type = type;
    this._conn = conn;
    this._logger =
      conn._logLevel ? SObject._logger.createInstance(conn._logLevel) : SObject._logger;
    /* TODO
    let cacheOptions = { key: "describe." + this.type };
    this.describe$ = conn.cache.makeCacheable(this.describe, this, cacheOptions);
    this.describe = conn.cache.makeResponseCacheable(this.describe, this, cacheOptions);

    cacheOptions = { key: "layouts." + this.type };
    this.layouts$ = conn.cache.makeCacheable(this.layouts, this, cacheOptions);
    this.layouts = conn.cache.makeResponseCacheable(this.layouts, this, cacheOptions);

    cacheOptions = { key: "compactLayouts." + this.type };
    this.compactLayouts$ = conn.cache.makeCacheable(this.compactLayouts, this, cacheOptions);
    this.compactLayouts = conn.cache.makeResponseCacheable(this.compactLayouts, this, cacheOptions);

    cacheOptions = { key: "approvalLayouts." + this.type };
    this.approvalLayouts$ = conn.cache.makeCacheable(this.approvalLayouts, this, cacheOptions);
    this.approvalLayouts =
      conn.cache.makeResponseCacheable(this.approvalLayouts, this, cacheOptions);
    */
  }

  /**
   * Create records
   */
  async create(records: UnsavedRecord | UnsavedRecord[], options?: Object) {
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
}

// TODO: find, recent, listview....
