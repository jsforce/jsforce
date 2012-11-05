/**
 *
 */
var Topic = module.exports = function(conn, name) {
  this._conn = conn;
  this.name = name;
};

Topic.prototype.subscribe = function(listener) {
  this._conn.subscribe(this.name, listener);
  return this;
};


