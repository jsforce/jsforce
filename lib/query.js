var util   = require('util')
  , events = require('events')
  , _      = require('underscore')._
  ;

/**
 * Query
 */
var Query = module.exports = function(conn, soql, locator) {
  this._conn = conn;
  this._logger = conn._logger;
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
  var self = this;
  var logger = this._conn._logger;

  options = options || {};
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (typeof callback === "function") {
    this.once('response', function(res) { callback(null, res); });
    this.once('error', function(err) { callback(err); });
  }
  var self = this;
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  var url;
  if (self._locator) {
    url = self._conn.urls.rest.base + "/query/" + self._locator;
  } else {
    self.totalFetched = 0;
    var soql = self._soql; // || Query.createSOQL(self._query);
    url = self._conn.urls.rest.base + "/query?q=" + encodeURIComponent(soql);
    logger.debug("SOQL = " + soql);
  }

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


