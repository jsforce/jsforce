var _      = require('underscore'),
    Record = require('./record'),
    Query  = require('./query');

/**
 * SObject
 */
var SObject = module.exports = function(conn, type) {
  this._conn = conn;
  this.type = type;
};

/**
 * Creating records
 */
SObject.prototype.create =
SObject.prototype.insert = function(records, callback) {
  this._conn.create(this.type, records, callback);
};

/**
 * Retrieve records by given ids
 */
SObject.prototype.retrieve = function(ids, callback) {
  this._conn.retrieve(this.type, ids, callback);
};

/**
 * Update records
 */
SObject.prototype.update = function(records, callback) {
  this._conn.update(this.type, records, callback);
};

/**
 * Upsert records. Should specify external id field information.
 */
SObject.prototype.upsert = function(records, extIdField, callback) {
  this._conn.upsert(this.type, records, extIdField, callback);
};

/**
 * Delete records by given ids
 */
SObject.prototype.del =
SObject.prototype.destroy = function(ids, callback) {
  this._conn.destroy(this.type, ids, callback);
};

/**
 * Describe SObject metadata information
 */
SObject.prototype.describe = function(callback) {
  this._conn.describe(this.type, callback);
};

/**
 * Get record representation instance by given id
 */
SObject.prototype.record = function(id) {
  return new Record(this._conn, this.type, id);
};

/**
 * Find and fetch records which matches given conditions
 */
SObject.prototype.find = function(conditions, fields, options, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
    fields = null;
    options = null;
  } else if (typeof fields === 'function') {
    callback = fields;
    fields = null;
    options = null;
  } else if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  fields = fields || [ 'Id' ];
  if (_.isObject(fields) && !_.isFunction(fields.pop)) {
    var _fields =  [];
    for (var k in fields) {
      if (fields[k]) { _fields.push(k); }
    }
    fields = _fields;
  }
  options = options || {};
  var config = {
    fields: fields,
    table: this.type,
    conditions: conditions,
    limit: options.limit,
    offset: options.offset || options.skip
  };
  var query = new Query(this._conn, config);
  query.setResponseTarget(Query.ResponseTargets.Records);
  if (callback) { query.run(callback); }
  return query;
};

/**
 * Fetch one record which matches given conditions
 */
SObject.prototype.findOne = function(conditions, fields, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
    fields = null;
  } else if (typeof fields === 'function') {
    callback = fields;
    fields = null;
  }
  var query = this.find(conditions, fields, { limit : 1 });
  query.setResponseTarget(Query.ResponseTargets.SingleRecord);
  if (callback) { query.run(callback); }
  return query;
};

/**
 * Count num of records which matches given conditions
 */
SObject.prototype.count = function(conditions, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
  }
  var query = this.find(conditions, { "count()" : true });
  query.setResponseTarget("Count");
  if (callback) { query.run(callback); }
  return query;
};


/**
 * Call Bulk#load() to execute bulkload, returning batch object
 */
SObject.prototype.bulkload = function(operation, input, callback) {
  return this._conn.bulk.load(this.type, operation, input, callback);
};

/**
 *
 */
SObject.prototype.createBulk =
SObject.prototype.insertBulk = function(input, callback) {
  return this.bulkload("insert", input, callback);
};

/**
 *
 */
SObject.prototype.updateBulk = function(input, callback) {
  return this.bulkload("update", input, callback);
};

/**
 *
 */
SObject.prototype.upsertBulk = function(input, callback) {
  return this.bulkload("upsert", input, callback);
};

/**
 *
 */
SObject.prototype.deleteBulk = function(input, callback) {
  return this.bulkload("delete", input, callback);
};

/**
 *
 */
SObject.prototype.deleteHardBulk = function(input, callback) {
  return this.bulkload("hardDelete", input, callback);
};
