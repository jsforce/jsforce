var util   = require('util'),
    events = require('events'),
    _      = require('underscore')._,
    async  = require('async'),
    Q      = require('q'),
    SfDate = require("./date"),
    SOQLBuilder = require("./soql-builder"),
    RecordStream = require("./record-stream");

/**
 * Query (extends RecordStream implements Receivable)
 */
var Query = module.exports = function(conn, config, locator) {
  Query.super_.apply(this);
  this.receivable = true;

  this._conn = conn;
  if (_.isString(config)) { // if query config is string, it is given in SOQL.
    this._soql = config;
  } else {
    this._config = config;
    this.select(config.fields);
    if (config.includes) {
      this.include(config.includes);
    }
  }
  if (locator && locator.indexOf("/") >= 0) { // if locator given in url for next records
    locator = locator.split("/").pop();
  }
  this._locator = locator;
  this._buffer = [];
  this._paused = true;
  this._closed = false;

  this._deferred = Q.defer();
};

util.inherits(Query, RecordStream);

/**
 * Select fields to include in the returning result
 */
Query.prototype.select = function(fields) {
  if (this._soql) {
    throw Error("Cannot set select fields for the query which has already built SOQL.");
  }
  fields = fields || '*';
  if (_.isString(fields)) {
    fields = fields.split(/\s*,\s*/);
  } else if (_.isObject(fields) && !_.isArray(fields)) {
    var _fields =  [];
    for (var k in fields) {
      if (fields[k]) { _fields.push(k); }
    }
    fields = _fields;
  }
  this._config.fields = fields;
  return this;
};

/**
 * Set query conditions to filter the result records
 */
Query.prototype.where = function(conditions) {
  if (this._soql) {
    throw Error("Cannot set where conditions for the query which has already built SOQL.");
  }
  this._config.conditions = conditions;
  return this;
};

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
 * Set query sort with direction
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
 * Include child relationship query
 */
Query.prototype.include = function(childRelName, conditions, fields, options) {
  if (this._soql) {
    throw Error("Cannot include child relationship into the query which has already built SOQL.");
  }
  if (_.isObject(childRelName)) {
    var includes = childRelName;
    for (var crname in includes) {
      var config = includes[crname];
      this.include(crname, config.conditions, config.fields, config);
    }
    return;
  }
  var childConfig = {
    table: childRelName,
    conditions: conditions,
    fields: fields,
    limit: options && options.limit,
    offset: options && (options.offset || options.skip)
  };
  this._config.includes = this._config.includes || [];
  this._config.includes.push(childConfig);
  var childQuery = new SubQuery(this._conn, this, childConfig);
  this._children = this._children || [];
  this._children.push(childQuery);
  return childQuery;
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
 * @override
 */
Query.prototype.pause = function() {
  this._paused = true;
};

/**
 * Resume record fetch and query execution
 * @override
 */
Query.prototype.resume = function() {
  if (this._closed) {
    throw new Error("resuming already closed stream");
  }
  if (!this._paused) { 
    return;
  } // do nothing if not paused
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
 * Running (or executing) query and fetch records from server.
 */
Query.prototype.run = 
Query.prototype.exec = 
Query.prototype.execute = function(options, callback) {
  var self = this;
  var logger = this._conn._logger;
  var deferred = this._deferred;

  if (this._closed) {
    deferred.reject(new Error("executing already closed query"));
    return this;
  }
  this._paused = false; // mark pause flag to false

  options = options || {};
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  var responseTarget = options.responseTarget || self._responseTarget;
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  // callback and promise resolution;
  var promiseCallback = function(err, res) {
    if (_.isFunction(callback)) {
      try {
        res = callback(err, res);
        err = null;
      } catch(e) {
        err = e;
      }
    }
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(res);
    }
  };
  this.once('response', function(res) {
    promiseCallback(null, res);
  });
  this.once('error', function(err) {
    promiseCallback(err);
  });

  async.waterfall([
    function(next) {
      if (self._locator) {
        var url = self._conn.urls.rest.base + "/query/" + self._locator;
        next(null, url);
      } else {
        self.totalFetched = 0;
        async.waterfall([
          function(next) {
            if (self._soql) {
              next();
            } else {
              self._expandFields(next);
            }
          },
          function(next) {
            var soql = self._soql || SOQLBuilder.createSOQL(self._config);
            logger.debug("SOQL = " + soql);
            var url = self._conn.urls.rest.base + "/query?q=" + encodeURIComponent(soql);
            next(null, url);
          }
        ], next);
      }
    },
    function(url, next) {
      // SOQL query request
      self._conn._request({
        method : 'GET',
        url : url
      }, next);
    }
  ], function(err, data) {
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

  // return Query instance for chaining
  return this;
};

/**
 * @private
 */
Query.prototype._expandFields = function(callback) {
  if (this._soql) {
    callback({ message: 'Cannot expand fields for the query which has already built SOQL.' });
  }
  var self = this;
  var conn = this._conn;
  var table = this._config.table;
  var fields = this._config.fields || [];
  async.parallel([
    function(cb) {
      async.waterfall([
        function(next) {
          if (self._parent) {
            findRelationTable(table, next);
          } else {
            next(null, table);
          }
        },
        function(table, next) {
          async.map(fields, function(field, cb) {
            expandAsteriskField(table, field, cb);
          }, next);
        },
        function(expandedFields, next) {
          self._config.fields = _.flatten(expandedFields);
          next();
        }
      ], cb);
    },
    function(cb) {
      async.forEach(self._children || [], function(childQuery, cb) {
        childQuery._expandFields(cb);
      }, cb);
    }
  ], function(err) {
    callback(err);
  });

  function findRelationTable(rname, callback) {
    var ptable = self._parent._config.table;
    async.waterfall([
      function(next) {
        self._conn.describe$(ptable, next);
      },
      function(sobject, next) {
        var childRelation = _.find(sobject.childRelationships, function(cr) {
          return (cr.relationshipName || '').toUpperCase() === rname.toUpperCase();
        });
        if (childRelation) {
          next(null, childRelation.childSObject);
        } else {
          next({ message: 'No child relationship found: ' + rname });
        }
      }
    ], callback);
  }

  function expandAsteriskField(table, field, callback) {
    var fpath = field.split('.');
    if (fpath[fpath.length - 1] === '*') {
      async.waterfall([
        function(next) {
          conn.describe$(table, next);
        },
        function(sobject, next) {
          if (fpath.length > 1) {
            var rname = fpath.shift();
            var rfield = _.find(sobject.fields, function(f) {
              return f.relationshipName &&
                     f.relationshipName.toUpperCase() === rname.toUpperCase();
            });
            if (rfield) {
              var rtable = rfield.referenceTo.length === 1 ? rfield.referenceTo[0] : 'Name';
              async.waterfall([
                function(next) {
                  expandAsteriskField(rtable, fpath.join('.'), next);
                },
                function(fpaths, next) {
                  next(null, _.map(fpaths, function(fpath) { return rname + '.' + fpath; }));
                }
              ], next);
            } else {
              next(null, []);
            }
          } else {
            var fields = _.map(sobject.fields, function(f) { return f.name; });
            next(null, fields);
          }
        }
      ], callback);
    } else {
      callback(null, [ field ]);
    }
  }
};

/**
 * Auto start query when pipe() is called.
 */
Query.prototype.pipe = function() {
  var dest = RecordStream.prototype.pipe.apply(this, arguments);
  this.resume();
  return dest;
};


/**
 * Promise/A+ interface
 * http://promises-aplus.github.io/promises-spec/
 *
 * Delegate to deferred promise, return promise instance for query result
 */
Query.prototype.then = function(onResolved, onReject) {
  if (!this._closed && this._paused) { this.execute({ autoFetch : false }); }
  return this._deferred.promise.then.apply(this._deferred.promise, arguments);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 */
Query.prototype.thenCall = function(callback) {
  return _.isFunction(callback) ? this.then(function(res) {
    return callback(null, res);
  }, function(err) {
    return callback(err);
  }) : this;
};

/**
 *
 */
var SubQuery = Query.SubQuery = function(conn, parent, config) {
  SubQuery.super_.call(this, conn, config);
  this._parent = parent;
};

util.inherits(SubQuery, Query);

/**
 *
 */
SubQuery.prototype.include = function() {
  throw new Error("Not allowed to include another subquery in subquery.");
};

/**
 * back the context to parent query object
 */
SubQuery.prototype.end = function() {
  return this._parent;
};

/**
 * If execute is called in subquery context, delegate it to parent query object
 */
SubQuery.prototype.run =
SubQuery.prototype.exec =
SubQuery.prototype.execute = function() {
  return this._parent.execute.apply(this._parent, arguments);
};
