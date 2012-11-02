var util   = require('util'),
    events = require('events'),
    _      = require('underscore')._,
    SfDate = require("./date"),
    SOQLBuilder = require("./soql-builder");

/**
 * Query
 */
var Query = module.exports = function(conn, query, locator) {
  this._conn = conn;
  if (_.isString(query)) { // if query is string, it is given in SOQL.
    this._soql = query;
  } else {
    this._query = query;
  }
  if (locator && locator.indexOf("/") >= 0) {
    locator = locator.split("/").pop();
  }
  this._locator = locator;
};

util.inherits(Query, events.EventEmitter);

/**
 *
 */
Query.prototype.limit = function(limit) {
  if (this._soql) {
    throw Error("SOQL is explicitly set in query");
  }
  this._query.limit = limit;
  return this;
};

/**
 *
 */
Query.prototype.skip =
Query.prototype.offset = function(offset) {
  if (this._soql) {
    throw new Error("SOQL is explicitly set in query");
  }
  this._query.offset = offset;
  return this;
};

/**
 *
 */
Query.prototype.sort = function(sort, dir) {
  if (this._soql) {
    throw new Error("SOQL is explicitly set in query");
  }
  if (_.isString(sort) && _.isString(dir)) {
    sort = [ [ sort, dir ] ];
  }
  this._query.sort = sort;
  return this;
};

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
var ResponseTargets = Query.ResponseTargets = {};
[ "QueryResult", "Records", "SingleRecord", "Count" ].forEach(function(f) {
  ResponseTargets[f] = f;
});

Query.prototype._responseTarget = ResponseTargets.QueryResult;
Query.prototype.setResponseTarget = function(responseTarget) {
  if (responseTarget in ResponseTargets) {
    this._responseTarget = responseTarget;
  }
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
  var responseTarget = options.responseTarget || self._responseTarget;
  if (typeof callback === "function") {
    this.once('response', function(res) {
      switch(responseTarget) {
        case ResponseTargets.SingleRecord:
          var rec = res.records && res.records.length > 0 ? res.records[0] : null;
          callback(null, rec);
          break;
        case ResponseTargets.Records:
          callback(null, res.records);
          break;
        case ResponseTargets.Count:
          callback(null, res.totalSize);
          break;
        default:
          callback(null, res);
      }
    });
    this.once('error', function(err) { callback(err); });
  }
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  var url;
  if (self._locator) {
    url = self._conn.urls.rest.base + "/query/" + self._locator;
  } else {
    self.totalFetched = 0;
    var soql = self._soql || SOQLBuilder.createSOQL(self._query);
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


