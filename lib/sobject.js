/**
 *
 */
var SObjectCollection = module.exports = function(type, conn) {
  this.type = type;
  this._conn = conn;
};

SObjectCollection.prototype.create = function(records, callback) {
  this._conn.create(this.type, records, callback);
};

SObjectCollection.prototype.retrieve = function(ids, callback) {
  this._conn.retrieve(this.type, ids, callback);
};

SObjectCollection.prototype.update = function(records, callback) {
  this._conn.update(this.type, records, callback);
};

SObjectCollection.prototype.del =
SObjectCollection.prototype.destroy = function(ids, callback) {
  this._conn.del(this.type, ids, callback);
};
