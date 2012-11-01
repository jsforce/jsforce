var _      = require('underscore'),
    Record = require('./record'),
    Query  = require('./query');

/**
 *
 */
var SObject = module.exports = function(type, conn) {
  this.type = type;
  this._conn = conn;
};

SObject.prototype.create = function(records, callback) {
  this._conn.create(this.type, records, callback);
};

SObject.prototype.retrieve = function(ids, callback) {
  this._conn.retrieve(this.type, ids, callback);
};

SObject.prototype.update = function(records, callback) {
  this._conn.update(this.type, records, callback);
};

SObject.prototype.upsert = function(records, extIdField, callback) {
  this._conn.upsert(this.type, records, extIdField, callback);
};

SObject.prototype.del =
SObject.prototype.destroy = function(ids, callback) {
  this._conn.destroy(this.type, ids, callback);
};

SObject.prototype.describe = function(callback) {
  this._conn.describe(this.type, callback);
};

SObject.prototype.record = function(id) {
  return new Record(id, this.type, this._conn);
};

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
  var query = {
    fields: fields,
    table: this._type,
    conditions: conditions,
    limit: options.limit,
    offset: options.offset || options.skip
  };
  var q = new Query(this._conn, query);
  q.setResponseFormat("Records");
  if (callback) { q.run(callback); }
  return q;
};

SObject.prototype.findOne = function(conditions, fields, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
    fields = null;
  } else if (typeof fields === 'function') {
    callback = fields;
    fields = null;
  }
  var q = this.find(conditions, fields, { limit : 1 });
  q.setResponseFormat("SingleRecord");
  if (callback) { q.run(callback); }
  return q;
};

SObject.prototype.count = function(conditions, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
  }
  var q = this.find(conditions, { "count()" : true });
  q.setResponseFormat("Count");
  if (callback) { q.run(callback); }
  return q;
};
