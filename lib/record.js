/**
 *
 */
var Record = module.exports = function(id, type, conn) {
  this.id = id;
  this.type = type;
  this._conn = conn;
};

Record.prototype.retrieve = function(callback) {
  this._conn.retrieve(this.type, this.id, callback);
};

Record.prototype.update = function(record, callback) {
  record = JSON.parse(JSON.stringify(record));
  record.Id = this.id;
  this._conn.update(this.type, record, callback);
};

Record.prototype.del =
Record.prototype.destroy = function(callback) {
  this._conn.destroy(this.type, this.id, callback);
};

