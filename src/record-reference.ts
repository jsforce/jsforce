/**
 *
 */
import Connection from './connection';
import {
  RetrieveOptions,
  DmlOptions,
  Schema,
  SObjectNames,
  SObjectInputRecord,
  SObjectUpdateRecord,
} from './types';

/**
 * Remote reference to record information
 */
export class RecordReference<
  S extends Schema,
  N extends SObjectNames<S>,
  InputRecord extends SObjectInputRecord<S, N> = SObjectInputRecord<S, N>,
  RetrieveRecord extends SObjectUpdateRecord<S, N> = SObjectUpdateRecord<S, N>
> {
  type: N;
  id: string;
  _conn: Connection<S>;

  /**
   *
   */
  constructor(conn: Connection<S>, type: N, id: string) {
    this._conn = conn;
    this.type = type;
    this.id = id;
  }

  /**
   * Retrieve record field information
   */
  async retrieve(options?: RetrieveOptions) {
    const rec = await this._conn.retrieve(this.type, this.id, options);
    return rec as RetrieveRecord;
  }

  /**
   * Update record field information
   */
  async update(record: InputRecord, options?: DmlOptions) {
    const record_ = { ...record, Id: this.id };
    return this._conn.update(this.type, record_, options);
  }

  /**
   * Delete record field
   */
  destroy(options?: DmlOptions) {
    return this._conn.destroy(this.type, this.id, options);
  }

  /**
   * Synonym of Record#destroy()
   */
  delete = this.destroy;

  /**
   * Synonym of Record#destroy()
   */
  del = this.destroy;

  /**
   * Get blob field as stream
   *
   * @param {String} fieldName - Blob field name
   * @returns {stream.Stream}
   */
  blob(fieldName: string) {
    const url = [
      this._conn._baseUrl(),
      'sobjects',
      this.type,
      this.id,
      fieldName,
    ].join('/');
    return this._conn.request(url).stream();
  }
}

export default RecordReference;
