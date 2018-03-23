/*global process*/
/**
 * @file Manages query for records in Salesforce
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var inherits = require('inherits'),
    events = require('events'),
    stream = require('readable-stream'),
    _      = require('lodash/core'),
    Promise = require('./promise'),
    SfDate = require("./date"),
    SOQLBuilder = require("./soql-builder"),
    RecordStream = require("./record-stream");

/**
 * Query
 *
 * @protected
 * @class
 * @extends {stream.Readable}
 * @implements Promise.<T>
 * @template T
 * @param {Connection} conn - Connection object
 * @param {Object|String} config - Query config object or SOQL string
 * @param {Object} [options] - Default query options
 * @param {Boolean} [options.autoFetch] - Using auto fetch mode or not
 * @param {Number} [options.maxFetch] - Max fetching records in auto fetch mode
 * @param {Boolean} [options.scanAll] - Including deleted records for query target or not
 * @param {Object} [options.headers] - Additional HTTP request headers sent in query request
 */
var Query = module.exports = function(conn, config, options) {
  Query.super_.call(this, { objectMode: true });

  this._conn = conn;
  if (_.isString(config)) { // if query config is string, it is given in SOQL.
    this._soql = config;
  } else if (config.locator && config.locator.indexOf("/") >= 0) { // if locator given in url for next records
    this._locator = config.locator.split("/").pop();
  } else {
    this._config = config;
    this.select(config.fields);
    if (config.includes) {
      this.include(config.includes);
    }
  }
  this._options = _.defaults({
    maxFetch: 10000,
    autoFetch: false,
    scanAll: false,
    responseTarget: ResponseTargets.QueryResult
  }, options || {});
  this._executed = false;
  this._finished = false;
  this._chaining = false;

  this._deferred = Promise.defer();

  var self = this;
};

inherits(Query, stream.Readable);

/**
 * Select fields to include in the returning result
 *
 * @param {Object|Array.<String>|String} fields - Fields to fetch. Format can be in JSON object (MongoDB-like), array of field names, or comma-separated field names.
 * @returns {Query.<T>}
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
 *
 * @param {Object|String} conditions - Conditions in JSON object (MongoDB-like), or raw SOQL WHERE clause string.
 * @returns {Query.<T>}
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
 *
 * @param {Number} limit - Maximum number of records the query will return.
 * @returns {Query.<T>}
 */
Query.prototype.limit = function(limit) {
  if (this._soql) {
    throw Error("Cannot set limit for the query which has already built SOQL.");
  }
  this._config.limit = limit;
  return this;
};

/**
 * Synonym of Query#skip()
 *
 * @method Query#offset
 * @param {Number} offset - Offset number where begins returning results.
 * @returns {Query.<T>}
 */
/**
 * Skip records
 *
 * @method Query#offset
 * @param {Number} offset - Offset number where begins returning results.
 * @returns {Query.<T>}
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
 * Synonym of Query#sort()
 *
 * @memthod Query#orderby
 * @param {String|Object} sort - Sorting field or hash object with field name and sord direction
 * @param {String|Number} [dir] - Sorting direction (ASC|DESC|1|-1)
 * @returns {Query.<T>}
 */
/**
 * Set query sort with direction
 *
 * @method Query#sort
 * @param {String|Object} sort - Sorting field or hash object with field name and sord direction
 * @param {String|Number} [dir] - Sorting direction (ASC|DESC|1|-1)
 * @returns {Query.<T>}
 */
Query.prototype.sort =
Query.prototype.orderby = function(sort, dir) {
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
 *
 * @param {String} childRelName - Child relationship name to include in query result
 * @param {Object|String} [conditions] - Conditions in JSON object (MongoDB-like), or raw SOQL WHERE clause string.
 * @param {Object|Array.<String>|String} [fields] - Fields to fetch. Format can be in JSON object (MongoDB-like), array of field names, or comma-separated field names.
 * @param {Object} [options] - Optional query configulations.
 * @param {Number} [options.limit] - Maximum number of records the query will return.
 * @param {Number} [options.offset] - Offset number where begins returning results.
 * @param {Number} [options.skip] - Synonym of options.offset.
 * @returns {Query~SubQuery}
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
    offset: options && (options.offset || options.skip),
    sort: options && options.sort
  };
  if (!_.isArray(this._config.includes)) this._config.includes = [];
  this._config.includes.push(childConfig);
  var childQuery = new SubQuery(this._conn, this, childConfig);
  this._children = this._children || [];
  this._children.push(childQuery);
  return childQuery;
};


/**
 * Setting maxFetch query option
 *
 * @param {Number} maxFetch - Max fetching records in auto fetch mode
 * @returns {Query.<T>}
 */
Query.prototype.maxFetch = function(maxFetch) {
  this._options.maxFetch = maxFetch;
  return this;
};

/**
 * Switching auto fetch mode
 *
 * @param {Boolean} autoFetch - Using auto fetch mode or not
 * @returns {Query.<T>}
 */
Query.prototype.autoFetch = function(autoFetch) {
  this._options.autoFetch = autoFetch;
  return this;
};

/**
 * Set flag to scan all records including deleted and archived.
 *
 * @param {Boolean} scanAll - Flag whether include deleted/archived record or not. Default is false.
 * @returns {Query.<T>}
 */
Query.prototype.scanAll = function(scanAll) {
  this._options.scanAll = scanAll;
  return this;
};

/**
 * @private
 */
var ResponseTargets = Query.ResponseTargets = {};
[ "QueryResult", "Records", "SingleRecord", "Count" ].forEach(function(f) {
  ResponseTargets[f] = f;
});

/**
 * @protected
 * @param {String} responseTarget - Query response target
 * @returns {Query.<S>}
 */
Query.prototype.setResponseTarget = function(responseTarget) {
  if (responseTarget in ResponseTargets) {
    this._options.responseTarget = responseTarget;
  }
  return this;
};


/**
 * Synonym of Query#execute()
 *
 * @method Query#run
 * @param {Object} [options] - Query options
 * @param {Boolean} [options.autoFetch] - Using auto fetch mode or not
 * @param {Number} [options.maxFetch] - Max fetching records in auto fetch mode
 * @param {Boolean} [options.scanAll] - Including deleted records for query target or not
 * @param {Object} [options.headers] - Additional HTTP request headers sent in query request
 * @param {Callback.<T>} [callback] - Callback function
 * @returns {Query.<T>}
 */
Query.prototype.run =
/**
 * Synonym of Query#execute()
 *
 * @method Query#exec
 * @param {Object} [options] - Query options
 * @param {Boolean} [options.autoFetch] - Using auto fetch mode or not
 * @param {Number} [options.maxFetch] - Max fetching records in auto fetch mode
 * @param {Boolean} [options.scanAll] - Including deleted records for query target or not
 * @param {Object} [options.headers] - Additional HTTP request headers sent in query request
 * @param {Callback.<T>} [callback] - Callback function
 * @returns {Query.<T>}
 */
Query.prototype.exec =
/**
 * Execute query and fetch records from server.
 *
 * @method Query#execute
 * @param {Object} [options] - Query options
 * @param {Boolean} [options.autoFetch] - Using auto fetch mode or not
 * @param {Number} [options.maxFetch] - Max fetching records in auto fetch mode
 * @param {Boolean} [options.scanAll] - Including deleted records for query target or not
 * @param {Object} [options.headers] - Additional HTTP request headers sent in query request
 * @param {Callback.<T>} [callback] - Callback function
 * @returns {Query.<T>}
 */
Query.prototype.execute = function(options, callback) {
  var self = this;
  var logger = this._conn._logger;
  var deferred = this._deferred;

  if (this._executed) {
    deferred.reject(new Error("re-executing already executed query"));
    return this;
  }

  if (this._finished) {
    deferred.reject(new Error("executing already closed query"));
    return this;
  }

  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  options = options || {};
  options = {
    headers: options.headers || self._options.headers,
    responseTarget: options.responseTarget || self._options.responseTarget,
    autoFetch: options.autoFetch || self._options.autoFetch,
    maxFetch: options.maxFetch || self._options.maxFetch,
    scanAll: options.scanAll || self._options.scanAll
  };

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

  // collect fetched records in array
  // only when response target is Records and
  // either callback or chaining promises are available to this query.
  this.once('fetch', function() {
    if (options.responseTarget === ResponseTargets.Records && (self._chaining || callback)) {
      logger.debug('--- collecting all fetched records ---');
      var records = [];
      var onRecord = function(record) {
        records.push(record);
      };
      self.on('record', onRecord);
      self.once('end', function() {
        self.removeListener('record', onRecord);
        self.emit('response', records, self);
      });
    }
  });

  // flag to prevent re-execution
  this._executed = true;

  // start actual query
  logger.debug('>>> Query start >>>');
  this._execute(options).then(function() {
    logger.debug('*** Query finished ***');
  }).fail(function(err) {
    logger.debug('--- Query error ---');
    self.emit('error', err);
  });

  // return Query instance for chaining
  return this;
};

/**
 * @private
 */
Query.prototype._execute = function(options) {
  var self = this;
  var logger = this._conn._logger;
  var responseTarget = options.responseTarget;
  var autoFetch = options.autoFetch;
  var maxFetch = options.maxFetch;
  var scanAll = options.scanAll;

  return Promise.resolve(
    self._locator ?
    self._conn._baseUrl() + "/query/" + self._locator :
    self.toSOQL().then(function(soql) {
      self.totalFetched = 0;
      logger.debug("SOQL = " + soql);
      return self._conn._baseUrl() + "/" + (scanAll ? "queryAll" : "query") + "?q=" + encodeURIComponent(soql);
    })
  ).then(function(url) {
    return self._conn.request({
      method: 'GET',
      url: url,
      headers: options.headers
    });
  }).then(function(data) {
    self.emit("fetch");
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
    // only fire response event when it should be notified per fetch
    if (responseTarget !== ResponseTargets.Records) {
      self.emit("response", res, self);
    }

    // streaming record instances
    var numRecords = (data.records && data.records.length) || 0;
    for (var i=0; i<numRecords; i++) {
      if (self.totalFetched >= maxFetch) {
        self._finished = true;
        break;
      }
      var record = data.records[i];
      self.push(record);
      self.emit('record', record, self.totalFetched++, self);
    }
    if (data.nextRecordsUrl) {
      self._locator = data.nextRecordsUrl.split('/').pop();
    }
    self._finished = self._finished || data.done || !autoFetch;
    if (self._finished) {
      self.push(null);
    } else {
      self._execute(options);
    }
    return res;
  });
};

/**
 * Readable stream implementation
 *
 * @override
 * @private
 */
Query.prototype._read = function(size) {
  if (!this._finished && !this._executed) {
    this.execute({ autoFetch: true });
  }
};

/** @override **/
Query.prototype.on = function(e, fn) {
  if (e === 'record') {
    var self = this;
    this.on('readable', function() {
      while(self.read() !== null) {} // discard buffered records
    });
  }
  return Query.super_.prototype.on.call(this, e, fn);
};

/** @override **/
Query.prototype.addListener = Query.prototype.on;


/**
 * @private
 */
Query.prototype._expandFields = function() {
  if (this._soql) {
    return Promise.reject(new Error("Cannot expand fields for the query which has already built SOQL."));
  }
  var self = this;
  var logger = self._conn._logger;
  var conn = this._conn;
  var table = this._config.table;
  var fields = this._config.fields || [];

  logger.debug('_expandFields: table = ' + table + ', fields = ' + fields.join(', '));

  return Promise.all([
    Promise.resolve(self._parent ? findRelationTable(table) : table)
      .then(function(table) {
        return Promise.all(
          _.map(fields, function(field) { return expandAsteriskField(table, field); })
        ).then(function(expandedFields) {
          self._config.fields = _.flatten(expandedFields);
        });
      }),
    Promise.all(
      _.map(self._children || [], function(childQuery) {
        return childQuery._expandFields();
      })
    )
  ]);

  function findRelationTable(rname) {
    var ptable = self._parent._config.table;
    logger.debug('finding table for relation "' + rname + '" in "' + ptable + '"...');
    return describeCache(ptable).then(function(sobject) {
      var upperRname = rname.toUpperCase();
      var childRelation = _.find(sobject.childRelationships, function(cr) {
        return (cr.relationshipName || '').toUpperCase() === upperRname;
      });
      return childRelation ? childRelation.childSObject :
        Promise.reject(new Error("No child relationship found: " + rname ));
    });
  }

  function describeCache(table) {
    logger.debug('describe cache: '+table);
    var deferred = Promise.defer();
    conn.describe$(table, function(err, sobject) {
      logger.debug('... done.');
      if (err) { deferred.reject(err); }
      else { deferred.resolve(sobject); }
    });
    return deferred.promise;
  }

  function expandAsteriskField(table, field) {
    logger.debug('expanding field "'+ field + '" in "' + table + '"...');
    var fpath = field.split('.');
    return fpath[fpath.length - 1] === '*' ?
      describeCache(table).then(function(sobject) {
        logger.debug('table '+table+'has been described');
        if (fpath.length > 1) {
          var rname = fpath.shift();
          var rfield = _.find(sobject.fields, function(f) {
            return f.relationshipName &&
                   f.relationshipName.toUpperCase() === rname.toUpperCase();
          });
          if (rfield) {
            var rtable = rfield.referenceTo.length === 1 ? rfield.referenceTo[0] : 'Name';
            return expandAsteriskField(rtable, fpath.join('.')).then(function(fpaths) {
              return _.map(fpaths, function(fpath) { return rname + '.' + fpath; });
            });
          } else {
            return [];
          }
        } else {
          return _.map(sobject.fields, function(f) { return f.name; });
        }
      }) :
      Promise.resolve([ field ]);
  }
};

/**
 * Explain plan for executing query
 *
 * @param {Callback.<ExplainInfo>} [callback] - Callback function
 * @returns {Promise.<ExplainInfo>}
 */
Query.prototype.explain = function(callback) {
  var self = this;
  var logger = this._conn._logger;
  return self.toSOQL().then(function(soql) {
    logger.debug("SOQL = " + soql);
    var url = "/query/?explain=" + encodeURIComponent(soql);
    return self._conn.request(url);
  }).thenCall(callback);
};

/**
 * Return SOQL expression for the query
 *
 * @param {Callback.<String>} [callback] - Callback function
 * @returns {Promise.<String>}
 */
Query.prototype.toSOQL = function(callback) {
  var self = this;
  return Promise.resolve(self._soql ||
    self._expandFields().then(function() { return SOQLBuilder.createSOQL(self._config); })
  ).thenCall(callback);
};

/**
 * Create data stream of queried records.
 * Automatically resume query if paused.
 *
 * @param {String} [type] - Type of outgoing data format. Currently 'csv' is default value and the only supported.
 * @param {Object} [options] - Options passed to converter
 * @returns {stream.Readable}
 */
Query.prototype.stream = RecordStream.Serializable.prototype.stream;

/**
 * Get record stream of queried records applying the given mapping function
 *
 * @param {RecordMapFunction} fn - Record mapping function
 * @returns {RecordStream.Serializable}
 */
Query.prototype.map = RecordStream.prototype.map;

/**
 * Get record stream of queried records, applying the given filter function
 *
 * @param {RecordFilterFunction} fn - Record filtering function
 * @returns {RecordStream.Serializable}
 */
Query.prototype.filter = RecordStream.prototype.map;

/**
 * Synonym of Query#destroy()
 *
 * @method Query#delete
 * @param {String} [type] - SObject type. Required for SOQL based query object.
 * @param {Callback.<Array.<RecordResult>>} [callback] - Callback function
 * @returns {Bulk~Batch}
 */
/**
 * Synonym of Query#destroy()
 *
 * @method Query#del
 * @param {String} [type] - SObject type. Required for SOQL based query object.
 * @param {Callback.<Array.<RecordResult>>} [callback] - Callback function
 * @returns {Bulk~Batch}
 */
/**
 * Bulk delete queried records
 *
 * @method Query#destroy
 * @param {String} [type] - SObject type. Required for SOQL based query object.
 * @param {Callback.<Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<Array.<RecordResult>>}
 */
Query.prototype["delete"] =
Query.prototype.del =
Query.prototype.destroy = function(type, callback) {
  if (typeof type === 'function') {
    callback = type;
    type = null;
  }
  type = type || (this._config && this._config.table);
  if (!type) {
    throw new Error("SOQL based query needs SObject type information to bulk delete.");
  }
  var batch = this._conn.sobject(type).deleteBulk();
  var deferred = Promise.defer();
  var handleError = function(err) {
    if (err.name === 'ClientInputError') { deferred.resolve([]); } // if batch input receives no records
    else { deferred.reject(err); }
  };
  this.on('error', handleError)
    .pipe(batch)
    .on('response', function(res) { deferred.resolve(res); })
    .on('error', handleError);
  return deferred.promise.thenCall(callback);
};

/**
 * Bulk update queried records, using given mapping function/object
 *
 * @param {Record|RecordMapFunction} mapping - Mapping record or record mapping function
 * @param {String} [type] - SObject type. Required for SOQL based query object.
 * @param {Callback.<Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<Array.<RecordResult>>}
 */
Query.prototype.update = function(mapping, type, callback) {
  if (typeof type === 'function') {
    callback = type;
    type = null;
  }
  type = type || (this._config && this._config.table);
  if (!type) {
    throw new Error("SOQL based query needs SObject type information to bulk update.");
  }
  var updateStream = _.isFunction(mapping) ? RecordStream.map(mapping) : RecordStream.recordMapStream(mapping);
  var batch = this._conn.sobject(type).updateBulk();
  var deferred = Promise.defer();
  var handleError = function(err) {
    if (err.name === 'ClientInputError') { deferred.resolve([]); } // if batch input receives no records
    else { deferred.reject(err); }
  };
  this.on('error', handleError)
    .pipe(updateStream)
    .on('error', handleError)
    .pipe(batch)
    .on('response', function(res) { deferred.resolve(res); })
    .on('error', handleError);
  return deferred.promise.thenCall(callback);
};

/**
 * Promise/A+ interface
 * http://promises-aplus.github.io/promises-spec/
 *
 * Delegate to deferred promise, return promise instance for query result
 *
 * @param {FulfilledCallback.<T, S1>} [onFulfilled]
 * @param {RejectedCallback.<S2>} [onRejected]
 * @returns {Promise.<S1|S2>}
 */
Query.prototype.then = function(onResolved, onReject) {
  this._chaining = true;
  if (!this._finished && !this._executed) { this.execute(); }
  return this._deferred.promise.then.apply(this._deferred.promise, arguments);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 *
 * @param {Callback.<T>} [callback] - Callback function
 * @returns {Query}
 */
Query.prototype.thenCall = function(callback) {
  if (_.isFunction(callback)) {
    this.then(function(res) {
      process.nextTick(function() {
        callback(null, res);
      });
    }, function(err) {
      process.nextTick(function() {
        callback(err);
      });
    });
  }
  return this;
};

/*--------------------------------------------*/

/**
 * SubQuery object for representing child relationship query
 *
 * @protected
 * @class Query~SubQuery
 * @extends Query
 * @param {Connection} conn - Connection object
 * @param {Query} parent - Parent query object
 * @param {Object} config - Sub query configuration
 */
var SubQuery = function(conn, parent, config) {
  SubQuery.super_.call(this, conn, config);
  this._parent = parent;
};

inherits(SubQuery, Query);

/**
 * @method Query~SubQuery#include
 * @override
 */
SubQuery.prototype.include = function() {
  throw new Error("Not allowed to include another subquery in subquery.");
};

/**
 * Back the context to parent query object
 *
 * @method Query~SubQuery#end
 * @returns {Query}
 */
SubQuery.prototype.end = function() {
  return this._parent;
};

/**
 * If execute is called in subquery context, delegate it to parent query object
 *
 * @method Query~SubQuery#execute
 * @override
 */
SubQuery.prototype.run =
SubQuery.prototype.exec =
SubQuery.prototype.execute = function() {
  return this._parent.execute.apply(this._parent, arguments);
};
