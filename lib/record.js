var _ = require('underscore')._;

/**
 *
 */
var Record = module.exports = function(conn, type, id) {
  this._conn = conn;
  this.type = type;
  this.id = id;
};

Record.prototype.retrieve = function(callback) {
  this._conn.retrieve(this.type, this.id, callback);
};

Record.prototype.update = function(record, callback) {
  record = _.clone(record);
  record.Id = this.id;
  this._conn.update(this.type, record, callback);
};

Record.prototype.del =
Record.prototype.destroy = function(callback) {
  this._conn.destroy(this.type, this.id, callback);
};

