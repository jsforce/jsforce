/**
 * @file Manages query for records in Salesforce
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import EventEmitter from 'events';
import { Logger, getLogger } from './util/logger';
import RecordStream, { Serializable } from './record-stream';
import Connection from './connection';
import { createSOQL } from './soql-builder';
import { QueryConfig, QueryCondition, SortConfig, SortDir } from './soql-builder';
import { Record, Optional } from './types';
import { identityFunc } from './util/function';

/**
 * type defs
 */
export type QueryFieldsParam = string | string[] | { [name: string]: boolean | number };

export type SubQueryConfigParam = {
  fields?: QueryFieldsParam,
  conditions?: QueryCondition,
  sort?: SortConfig,
  limit?: number,
  offset?: number,
}

export type QueryConfigParam = {
  fields?: QueryFieldsParam,
  includes?: { [name: string]: SubQueryConfigParam },
  table?: string,
  conditions?: QueryCondition,
  sort?: SortConfig,
  limit?: number,
  offset?: number,
};

export type QueryResponseTarget =
  'QueryResult' | 'Records' | 'SingleRecord' | 'Count';

export type QueryOptions = {
  headers: { [name: string]: string },
  maxFetch: number;
  autoFetch: boolean;
  scanAll: boolean;
  responseTarget: QueryResponseTarget;
};

export type QueryResult = {
  size: number,
  records: Record[],
};

export type QueryResponse =
  QueryResult | Record[] | Record | number;

export type QueryDestroyOptions = {
  allowBulk?: boolean,
  bulkThreshold?: number,
};

export type QueryUpdateOptions = {
  allowBulk?: boolean,
  bulkThreshold?: number,
};

/**
 *
 */
export const ResponseTargets: { [K in QueryResponseTarget]: QueryResponseTarget } = {
  QueryResult: 'QueryResult',
  Records: 'Records',
  SingleRecord: 'SingleRecord',
  Count: 'Count',
};

/**
 * 
 */
const DEFAULT_BULK_THRESHOLD = 200;

/**
 * Query
 */
export default class Query extends EventEmitter {
  static _logger = getLogger('query');

  _conn: Connection;
  _logger: Logger;
  _soql: Optional<string>;
  _locator: Optional<string>;
  _config: QueryConfig = {};
  _children: SubQuery[] = [];
  _options: QueryOptions;
  _executed: boolean = false;
  _finished: boolean = false;
  _chaining: boolean = false;
  _promise: Promise<QueryResponse>;
  _stream: Serializable;
  _parent: Optional<Query>;

  totalSize: Optional<number>;
  totalFetched: Optional<number>;

  /**
   *
   */
  constructor(
    conn: Connection,
    config: string | QueryConfigParam | { locator: string },
    parent?: Optional<Query>,
    options?: Partial<QueryOptions>,
  ) {
    super();
    this._conn = conn;
    this._logger =
      conn._logLevel ? Query._logger.createInstance(conn._logLevel) : Query._logger;
    if (typeof config === 'string') {
      this._soql = config;
    } else if (typeof (config as any).locator === 'string') {
      const locator: string = (config as any).locator;
      if (locator.indexOf('/') >= 0) {
        this._locator = locator.split('/').pop();
      }
    } else {
      const { fields, includes, sort, ..._config } = ((config as any) as QueryConfigParam);
      this._config = _config;
      this.select(fields);
      if (includes) {
        this.includeChildren(includes);
      }
      if (sort) {
        this.sort(sort);
      }
    }
    this._parent = parent;
    this._options = ({
      ...(options || {}),
      headers: {},
      maxFetch: 10000,
      autoFetch: false,
      scanAll: false,
      responseTarget: 'QueryResult',
    } as QueryOptions);
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
      } catch (e) {}
    });
  }


  /**
   * Select fields to include in the returning result
   */
  select(fields: QueryFieldsParam = '*') {
    if (this._soql) {
      throw Error('Cannot set select fields for the query which has already built SOQL.');
    }
    this._config.fields = (
      typeof fields === 'string' ? fields.split(/\s*,\s*/) :
      Array.isArray(fields) ? fields :
      // eslint-disable-next-line no-unused-vars
      Object.entries(fields).filter(([f, v]) => v).map(([f]) => f)
    );
    return this;
  }

  /**
   * Set query conditions to filter the result records
   */
  where(conditions: QueryCondition) {
    if (this._soql) {
      throw Error('Cannot set where conditions for the query which has already built SOQL.');
    }
    this._config.conditions = conditions;
    return this;
  }

  /**
   * Limit the returning result
   */
  limit(limit: number) {
    if (this._soql) {
      throw Error('Cannot set limit for the query which has already built SOQL.');
    }
    this._config.limit = limit;
    return this;
  }

  /**
   * Skip records
   */
  skip(offset: number) {
    if (this._soql) {
      throw Error('Cannot set skip/offset for the query which has already built SOQL.');
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
  sort(sort: SortConfig, dir?: SortDir) {
    if (this._soql) {
      throw Error('Cannot set sort for the query which has already built SOQL.');
    }
    if (typeof sort === 'string' && typeof dir !== 'undefined') {
      // eslint-disable-next-line no-param-reassign
      sort = [[sort, dir]];
    }
    this._config.sort = sort;
    return this;
  }

  /**
   * Synonym of Query#sort()
   */
  orderby = this.sort;

  /**
   * Include child relationship query and move down to the child query context
   */
  include(
    childRelName: string,
    conditions?: Optional<QueryCondition>,
    fields?: Optional<QueryFieldsParam>,
    options: { limit?: number, offset?: number, sort?: SortConfig } = {}
  ): SubQuery {
    if (this._soql) {
      throw Error('Cannot include child relationship into the query which has already built SOQL.');
    }
    const childConfig: QueryConfigParam = {
      fields: fields === null ? undefined : fields,
      table: childRelName,
      conditions: conditions === null ? undefined : conditions,
      limit: options.limit,
      offset: options.offset,
      sort: options.sort,
    };
    // eslint-disable-next-line no-use-before-define
    const childQuery = new SubQuery(this._conn, childConfig, this);
    this._children.push(childQuery);
    return childQuery;
  }

  /**
   * Include child relationship queryies, but not moving down to the children context
   */
  includeChildren(includes: { [name: string]: SubQueryConfigParam }) {
    if (this._soql) {
      throw Error('Cannot include child relationship into the query which has already built SOQL.');
    }
    for (const crname of Object.keys(includes)) {
      const { conditions, fields, ...options } = includes[crname];
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
  setResponseTarget(responseTarget: QueryResponseTarget) {
    if (responseTarget in ResponseTargets) {
      this._options.responseTarget = responseTarget;
    }
    return this;
  }

  /**
   * Execute query and fetch records from server.
   */
  execute(_options: Partial<QueryOptions> = {}): Query {
    if (this._executed) {
      throw new Error('re-executing already executed query');
    }

    if (this._finished) {
      throw new Error('executing already closed query');
    }

    const options = {
      headers: _options.headers || this._options.headers,
      responseTarget: _options.responseTarget || this._options.responseTarget,
      autoFetch: _options.autoFetch || this._options.autoFetch,
      maxFetch: _options.maxFetch || this._options.maxFetch,
      scanAll: _options.scanAll || this._options.scanAll
    };

    // collect fetched records in array
    // only when response target is Records and
    // either callback or chaining promises are available to this query.
    this.once('fetch', () => {
      if (options.responseTarget === ResponseTargets.Records && this._chaining) {
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
    return this;
  }

  /**
   * Synonym of Query#execute()
   */
  exec = this.execute;

  /**
   * Synonym of Query#execute()
   */
  run = this.execute;

  /**
   * @private
   */
  async _execute(options: QueryOptions): Promise<QueryResponse> {
    const { headers, responseTarget, autoFetch, maxFetch, scanAll } = options;
    let url = '';
    if (this._locator) {
      url = [this._conn._baseUrl(), '/query/', this._locator].join('');
    } else {
      const soql = await this.toSOQL();
      this.totalFetched = 0;
      this._logger.debug(`SOQL = ${soql}`);
      url = [this._conn._baseUrl(), '/', (scanAll ? 'queryAll' : 'query'), '?q=', encodeURIComponent(soql)].join('');
    }
    const data = await this._conn.request({ method: 'GET', url, headers });
    this.emit('fetch');
    this.totalSize = data.totalSize;
    let res;
    switch (responseTarget) {
      case ResponseTargets.SingleRecord:
        res = data.records && data.records.length > 0 ? data.records[0] : null;
        break;
      case ResponseTargets.Records:
        res = data.records;
        break;
      case ResponseTargets.Count:
        res = data.totalSize;
        break;
      default:
        res = data;
    }
    // only fire response event when it should be notified per fetch
    if (responseTarget !== ResponseTargets.Records) {
      this.emit('response', res, this);
    }

    // streaming record instances
    const numRecords = (data.records && data.records.length) || 0;
    let totalFetched = this.totalFetched || 0;
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
    if (data.nextRecordsUrl) {
      this._locator = data.nextRecordsUrl.split('/').pop();
    }
    this._finished = this._finished || data.done || !autoFetch;
    if (this._finished) {
      this.emit('end');
    } else {
      this._execute(options);
    }
    return res;
  }

  /**
   * Obtain readable stream instance
   */
  stream(type: 'record' | 'csv') {
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
  async _expandFields(): Promise<void> {
    if (this._soql) {
      throw new Error('Cannot expand fields for the query which has already built SOQL.');
    }
    const { fields = [], table = '' } = this._config;
    this._logger.debug(`_expandFields: table = ${table}, fields = ${fields.join(', ')}`);
    const [efields] = await Promise.all([
      this._expandAsteriskFields(table, fields),
      ...this._children.map(async (childQuery) => {
        await childQuery._expandFields();
        return [] as string[];
      }),
    ]);
    this._config.fields = efields;
    this._config.includes = this._children.map((cquery) => {
      const cconfig = cquery._query._config;
      return [cconfig.table, cconfig] as [string, QueryConfig];
    })
    .reduce((includes: { [name: string]: QueryConfig }, [ctable, cconfig]) => {
      includes[ctable] = cconfig; // eslint-disable-line no-param-reassign
      return includes;
    }, {});
  }

  /**
   *
   */
  async _expandAsteriskFields(_table: string, fields: string[]): Promise<string[]> {
    const table = await this._getSObjectName(_table);
    const expandedFields = await Promise.all(
      fields.map(async field => this._expandAsteriskField(table, field))
    );
    return expandedFields.reduce((eflds: string[], flds: string[]): string[] => (
      [...eflds, ...flds]
    ), []);
    // return expandedFields.reduce((efields, fs) => [...efields, ...fs], []);
    // return [];
  }

  /**
   *
   */
  async _getSObjectName(table: string): Promise<string> {
    return this._parent ? this._parent._findRelationObject(table) : table;
  }

  /**
   *
   */
  async _findRelationObject(relName: string): Promise<string> {
    const table = this._config.table;
    if (!table) {
      throw new Error('No table information provided in the query');
    }
    this._logger.debug(`finding table for relation "${relName}" in "${table}"...`);
    const sobject = await this._conn.describe$(table);
    const upperRname = relName.toUpperCase();
    for (const cr of sobject.childRelationships) {
      if ((cr.relationshipName || '').toUpperCase() === upperRname && cr.childSObject) {
        return cr.childSObject;
      }
    }
    throw new Error(`No child relationship found: ${relName}`);
  }

  /**
   *
   */
  async _expandAsteriskField(table: string, field: string): Promise<string[]> {
    this._logger.debug(`expanding field "${field}" in "${table}"...`);
    const fpath = field.split('.');
    if (fpath[fpath.length - 1] === '*') {
      const sobject = await this._conn.describe$(table);
      this._logger.debug(`table ${table} has been described`);
      if (fpath.length > 1) {
        const rname = fpath.shift();
        for (const f of sobject.fields) {
          if (f.relationshipName && rname &&
              f.relationshipName.toUpperCase() === rname.toUpperCase()) {
            const rfield = f;
            const referenceTo = rfield.referenceTo || [];
            const rtable = referenceTo.length === 1 ? referenceTo[0] : 'Name';
            const fpaths = await this._expandAsteriskField(rtable, fpath.join('.'));
            return fpaths.map(fp => `${rname}.${fp}`);
          }
        }
        return [];
      }
      return sobject.fields.map(f => f.name);
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
    return this._conn.request(url);
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
  then<U>(
    onResolve: (qr: QueryResponse) => U | Promise<U>,
    onReject?: (err: any) => U | Promise<U>
  ): Promise<U> {
    this._chaining = true;
    if (!this._finished && !this._executed) {
      this.execute();
    }
    if (!this._promise) {
      throw new Error('invalid state: promise is not set after query execution');
    }
    return this._promise.then(onResolve, onReject);
  }

  catch(
    onReject: (err: any) => QueryResponse | Promise<QueryResponse>
  ): Promise<QueryResponse> {
    return this.then(identityFunc, onReject);
  }

  /**
   * Bulk delete queried records
   */
  destroy(type?: string, options?: QueryDestroyOptions) {
    if (typeof type === 'object' && type !== null) {
      options = type;
      type = undefined;
    }
    options = options || {};
    const type_ = type || (this._config && this._config.table);
    if (!type_) {
      throw new Error("SOQL based query needs SObject type information to bulk delete.");
    }
    // Set the threshold number to pass to bulk API
    const thresholdNum =
      options.allowBulk === false ?
        -1 :
      typeof options.bulkThreshold === 'number' ?
        options.bulkThreshold :
        // determine threshold if the connection version supports SObject collection API or not
        (this._conn._ensureVersion(42) ? DEFAULT_BULK_THRESHOLD : this._conn._maxRequest / 2);
    return new Promise((resolve, reject) => {
      const records: Record[] = [];
      // let batch = null;
      const handleRecord = (rec: Record) => {
        if (!rec.Id) {
          const err = new Error('Queried record does not include Salesforce record ID.');
          this.emit('error', err);
          return;
        }
        const record: Record = { Id: rec.Id };
        // TODO: enable batch switch
        /*
        if (batch) {
          batch.write(record);
        } else {
        */
        records.push(record);
        /*
          if (thresholdNum < 0 || records.length > thresholdNum) {
            // Use bulk delete instead of SObject REST API
            batch =
              self._conn.sobject(type).deleteBulk()
                .on('response', resolve)
                .on('error', reject);
            records.forEach(function(record) {
              batch.write(record);
            });
            records = [];
          }
        }
        */
      };
      const handleEnd = () => {
        /*
        if (batch) {
          batch.end();
        } else {
        */
        const ids = records.map((record) => record.Id);
        this._conn.sobject(type_).destroy(ids, { allowRecursive: true }).then(resolve, reject);
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
  update(mapping: ((rec:Record) => Record) | Record, type?: string, options?: QueryUpdateOptions) {
    if (typeof type === 'object' && type !== null) {
      options = type;
      type = undefined;
    }
    options = options || {};
    const type_ = type || (this._config && this._config.table);
    if (!type_) {
      throw new Error("SOQL based query needs SObject type information to bulk update.");
    }
    const updateStream =
      typeof mapping === 'function' ? RecordStream.map(mapping) : RecordStream.recordMapStream(mapping);
    // Set the threshold number to pass to bulk API
    const thresholdNum =
      options.allowBulk === false ?
        -1 :
      typeof options.bulkThreshold === 'number' ?
        options.bulkThreshold :
        // determine threshold if the connection version supports SObject collection API or not
        (this._conn._ensureVersion(42) ? DEFAULT_BULK_THRESHOLD : this._conn._maxRequest / 2);
    return new Promise((resolve, reject) => {
      const records: Record[] = [];
      // let batch = null;
      const handleRecord = (record: Record) => {
        // TODO: enable batch switch
        /*
        if (batch) {
          batch.write(record);
        } else {
        */
        records.push(record);
        /*
        if (thresholdNum < 0 || records.length > thresholdNum) {
          // Use bulk update instead of SObject REST API
          batch =
            self._conn.sobject(type).updateBulk()
              .on('response', resolve)
              .on('error', reject);
          records.forEach(function(record) {
            batch.write(record);
          });
          records = [];
        }
      }
        */
      };
      const handleEnd = () => {
        /*
        if (batch) {
          batch.end();
        } else {
        */
        this._conn.sobject(type_).update(records, { allowRecursive: true }).then(resolve, reject);
        /*
        }
        */
      };
      this.stream('record')
        .on('error', reject)
        .pipe(updateStream)
        .on('data', handleRecord)
        .on('end', handleEnd)
        .on('error', reject);
    });
  }
}


/*--------------------------------------------*/

/**
 * SubQuery object for representing child relationship query
 */
export class SubQuery {
  _query: Query;
  _parent: Query;

  /**
   *
   */
  constructor(conn: Connection, config: QueryConfigParam, parent: Query) {
    this._query = new Query(conn, config, parent);
    this._parent = parent;
  }

  /**
   *
   */
  select(fields?: QueryFieldsParam): this {
    this._query.select(fields);
    return this;
  }

  /**
   *
   */
  where(conditions: QueryCondition): this {
    this._query.where(conditions);
    return this;
  }

  /**
   * Limit the returning result
   */
  limit(limit: number) {
    this._query.limit(limit);
    return this;
  }

  /**
   * Skip records
   */
  skip(offset: number) {
    this._query.skip(offset);
    return this;
  }

  /**
   * Synonym of SubQuery#skip()
   */
  offset = this.skip;

  /**
   * Set query sort with direction
   */
  sort(sort: SortConfig, dir?: SortDir) {
    this._query.sort(sort, dir);
    return this;
  }

  /**
   * Synonym of SubQuery#sort()
   */
  orderby = this.sort;

  /**
   *
   */
  _expandFields() {
    return this._query._expandFields();
  }

  /**
   * Back the context to parent query object
   */
  end() {
    return this._parent;
  }
}
