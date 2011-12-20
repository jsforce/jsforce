var Record = require('./record')
  ;

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
