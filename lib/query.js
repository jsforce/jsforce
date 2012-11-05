var util   = require('util'),
    events = require('events'),
    _      = require('underscore')._,
    SfDate = require("./date"),
    SOQLBuilder = require("./soql-builder");

/**
 * Query
 */
var Query = module.exports = function(conn, config, locator) {
  this._conn = conn;
  if (_.isString(config)) { // if query config is string, it is given in SOQL.
    this._soql = config;
  } else {
    this._config = config;
  }
  if (locator && locator.indexOf("/") >= 0) { // if locator given in url for next records
    locator = locator.split("/").pop();
  }
  this._locator = locator;
  this._buffer = [];
  this._paused = false;
  this._closed = false;
};

util.inherits(Query, events.EventEmitter);

/**
 * Limit the returning result
 */
Query.prototype.limit = function(limit) {
  if (this._soql) {
    throw Error("Cannot set limit for the query which has already built SOQL.");
  }
  this._config.limit = limit;
  return this;
};

/**
 * Skip records
 */
Query.prototype.skip =
Query.prototype.offset = function(offset) {
  if (this._soql) {
    throw Error("Cannot set skip/offset for the query which has already built SOQL.");
  }
  this._config.offset = offset;
  return this;
};

/**
 *
 */
Query.prototype.sort = function(sort, dir) {
  if (this._soql) {
    throw Error("Cannot set sort for the query which has already built SOQL.");
  }
  if (_.isString(sort) && _.isString(dir)) {
    sort = [ [ sort, dir ] ];
  }
  this._config.sort = sort;
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
 * Pause record fetch
 */
Query.prototype.pause = function() {
  this._paused = true;
};

/**
 * Resume record fetch and query execution
 */
Query.prototype.resume = function() {
  if (this._closed) {
    console.log("error");
    throw new Error("resuming already closed stream");
  }
  this._paused = false;
  while (!this._paused && this._buffer.length > 0) {
    if (this.totalFetched >= this._maxFetch) {
      this.close();
      return;
    }
    var record = this._buffer.shift();
    this.emit('record', record, this.totalFetched++, this);
  }
  if (!this._paused) {
    if (this._finished) {
      this.close();
    } else {
      this.execute({ autoFetch : true });
    }
  }
};

/**
 * Closing query. No operation for query is allowed after closing.
 */
Query.prototype.close = function() {
  this.pause();
  this._closed = true;
  this.emit('end', this);
};


/**
 * Streaming pipe for record manipulation
 * Originally from Node.js's Stream#pipe 
 * https://github.com/joyent/node/blob/master/lib/stream.js
 */
Query.prototype.pipe = function (dest, options) {
  var source = this;

  var onRecord = function(record) {
    if (dest.send && false === dest.send(record)) { source.pause(); }
  };

  source.on('record', onRecord);

  var onDrain = function() { source.resume(); };

  dest.on('drain', onDrain);

  var didOnEnd = false;
  var onEnd = function() {
    if (didOnEnd) { return; }
    didOnEnd = true;
    dest.end();
  };

  var onClose = function() {
    if (didOnEnd) { return; }
    didOnEnd = true;
    if (typeof dest.destroy === 'function') { dest.destroy(); }
  };

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!options || options.end !== false) {
    source.on('end', onEnd);
    source.on('close', onClose);
  }

  // don't leave dangling pipes when there are errors.
  var onError = function(err) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw err; // Unhandled stream error in pipe.
    }
  };

  source.on('error', onError);
  dest.on('error', onError);

  // remove all the event listeners that were added.
  var cleanup = function() {
    source.removeListener('record', onRecord);
    dest.removeListener('drain', onDrain);

    source.removeListener('end', onEnd);
    source.removeListener('close', onClose);

    source.removeListener('error', onError);
    dest.removeListener('error', onError);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  };

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/**
 * Running (or executing) query and fetch records from server.
 */
Query.prototype.run = 
Query.prototype.exec = 
Query.prototype.execute = function(options, callback) {
  var self = this;
  var logger = this._conn._logger;

  if (self._closed) {
    throw new Error("executing already closed query");
  }

  options = options || {};
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  var responseTarget = options.responseTarget || self._responseTarget;
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  if (typeof callback === "function") {
    this.once('response', function(res) { callback(null, res); });
    this.once('error', function(err) { callback(err); });
  }

  var url;
  if (self._locator) {
    url = self._conn.urls.rest.base + "/query/" + self._locator;
  } else {
    self.totalFetched = 0;
    var soql = self._soql = self._soql || SOQLBuilder.createSOQL(self._config);
    url = self._conn.urls.rest.base + "/query?q=" + encodeURIComponent(soql);
    logger.debug("SOQL = " + soql);
  }

  // SOQL query request
  self._conn._request({
    method : 'GET',
    url : url
  }, function(err, data) {
    if (err) {
      self.emit("error", err);
      return;
    }
    self.totalSize = data.totalSize;
    var res;
    switch(responseTarget) {
      case ResponseTargets.SingleRecord:
        res = data.records && data.records.length > 0 ? data.records[0] : null;
        break;
      case ResponseTargets.Records:
        res = data.records;
        break;
      case ResponseTargets.Count:
        res = data.totalSize;
        break;
      default:
        res = data;
    }
    self.emit("response", res, self);

    // streaming record instances
    for (var i=0, l=data.records.length; i<l; i++) {
      if (self.totalFetched >= maxFetch) { break; }
      var record = data.records[i];
      if (self._paused) { 
        self._buffer.push(record);
      } else {
        self.emit('record', record, self.totalFetched++, self);
      }
    }
    self._finished = data.done;
    if (data.nextRecordsUrl) {
      self._locator = data.nextRecordsUrl.split('/').pop();
    }
    if (autoFetch && !self._finished) {
      if (!self._paused) { self.execute(options); }
    } else {
      if (!self._paused) { self.close(); }
    }
  });
};


