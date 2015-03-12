/**
 * @file Represents Salesforce record information
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var _ = require('underscore')._;

/**
 * A simple hash object including record field information
 *
 * @typedef {Object} Record
 */

/**
 * Remote reference to record information
 *
 * @protected
 * @class
 * @constructor
 * @param {Connection} conn - Connection object
 * @param {String} type - SObject type
 * @param {String} id - Record ID
 */
var RecordReference = module.exports = function(conn, type, id) {
  this._conn = conn;
  this.type = type;
  this.id = id;
};

/**
 * Retrieve record field information
 *
 * @param {Object} [options] - Options for rest api.
 * @param {Callback.<Record>} [callback] - Callback function
 * @returns {Promise.<Record>}
 */
RecordReference.prototype.retrieve = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return this._conn.retrieve(this.type, this.id, options, callback);
};

/**
 * Update record field information
 *
 * @param {Record} record - A Record which includes fields to update
 * @param {Object} [options] - Options for rest api.
 * @param {Callback.<RecordResult>} [callback] - Callback function
 * @returns {Promise.<RecordResult>}
 */
RecordReference.prototype.update = function(record, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  record = _.clone(record);
  record.Id = this.id;
  return this._conn.update(this.type, record, options, callback);
};

/**
 * Synonym of Record#destroy()
 *
 * @method RecordReference#delete
 * @param {Object} [options] - Options for rest api.
 * @param {Callback.<RecordResult>} [callback] - Callback function
 * @returns {Promise.<RecordResult>}
 */
RecordReference.prototype["delete"] =
/**
 * Synonym of Record#destroy()
 *
 * @method RecordReference#del
 * @param {Callback.<RecordResult>} [callback] - Callback function
 * @returns {Promise.<RecordResult>}
 */
RecordReference.prototype.del =
/**
 * Delete record field
 *
 * @method RecordReference#destroy
 * @param {Object} [options] - Options for rest api.
 * @param {Callback.<RecordResult>} [callback] - Callback function
 * @returns {Promise.<RecordResult>}
 */
RecordReference.prototype.destroy = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  return this._conn.destroy(this.type, this.id, options, callback);
};

/**
 * Get blob field as stream
 *
 * @param {String} fieldName - Blob field name
 * @returns {stream.Stream}
 */
RecordReference.prototype.blob = function(fieldName) {
  var url = [ this._conn._baseUrl(), 'sobjects', this.type, this.id, fieldName ].join('/');
  return this._conn.request(url).stream();
};

