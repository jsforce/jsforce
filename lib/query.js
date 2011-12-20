var util   = require('util')
  , events = require('events')
  , _      = require('underscore')._
  ;

/**
 * Query
 */
var Query = module.exports = function(conn, soql, locator) {
  this._conn = conn;
  this._soql = soql;
  if (locator && locator.indexOf("/") >= 0) {
    locator = locator.split("/").pop();
  }
  this._locator = locator;
};

util.inherits(Query, events.EventEmitter);

/**
 *
 */
Query.prototype._maxFetch = 10000;
Query.prototype.maxFetch = function(maxFetch) {
  this._maxFetch = maxFetch;
  return this;
};

/**
 *
 */
Query.prototype._autoFetch = false;
Query.prototype.autoFetch = function(autoFetch) {
  this._autoFetch = autoFetch;
  return this;
};


/**
 *
 */
Query.prototype.run = 
Query.prototype.exec = 
Query.prototype.execute = function(options, callback) {
  options = options || {};
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (typeof callback === "function") {
    this.once('response', function(res) { callback(null, res); });
  }
  var self = this;
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  if (!self._locator) { self.totalFetched = 0; }

  var url = self._locator ?
            self._conn.urls.rest.query + "/" + self._locator :
            self._conn.urls.rest.query + "?q=" + encodeURIComponent(self._soql);

  self._conn._request({
    method : 'GET',
    url : url
  }, function(err, data) {
    if (err) {
      self.emit("error", err);
      return;
    }
    self.emit("response", data, self);
    self.totalSize = data.totalSize;
    _.forEach(data.records, function(record, i) {
      if (!self._stop) {
        self.emit('record', record, i, self.totalFetched++, self);
        self._stop = self.totalFetched >= maxFetch;
      }
    });
    if (!data.done && autoFetch && !self._stop) {
      self._locator = data.nextRecordsUrl.split('/').pop();
      self.execute(options, callback);
    } else {
      self._stop = true;
      self.emit('end', self);
    }
  });
};


