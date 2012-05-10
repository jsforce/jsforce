/**
 *
 */
var Topic = module.exports = function(name, conn) {
  this.name = name;
  this._conn = conn;
};

Topic.prototype.subscribe = function(listener) {
  this._conn.subscribe(this.name, listener);
  return this;
};


