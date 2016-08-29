(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Bulk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
/*global process*/
/**
 * @file Manages Salesforce Bulk API related operations
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var inherits     = window.jsforce.require('inherits'),
    stream       = window.jsforce.require('readable-stream'),
    Duplex       = stream.Duplex,
    events       = window.jsforce.require('events'),
    _            = window.jsforce.require('lodash/core'),
    joinStreams  = window.jsforce.require('multistream'),
    jsforce      = window.jsforce.require('./core'),
    RecordStream = window.jsforce.require('./record-stream'),
    Promise      = window.jsforce.require('./promise'),
    HttpApi      = window.jsforce.require('./http-api');

/*--------------------------------------------*/

/**
 * Class for Bulk API Job
 *
 * @protected
 * @class Bulk~Job
 * @extends events.EventEmitter
 *
 * @param {Bulk} bulk - Bulk API object
 * @param {String} [type] - SObject type
 * @param {String} [operation] - Bulk load operation ('insert', 'update', 'upsert', 'delete', or 'hardDelete')
 * @param {Object} [options] - Options for bulk loading operation
 * @param {String} [options.extIdField] - External ID field name (used when upsert operation).
 * @param {String} [options.concurrencyMode] - 'Serial' or 'Parallel'. Defaults to Parallel.
 * @param {String} [jobId] - Job ID (if already available)
 */
var Job = function(bulk, type, operation, options, jobId) {
  this._bulk = bulk;
  this.type = type;
  this.operation = operation;
  this.options = options || {};
  this.id = jobId;
  this.state = this.id ? 'Open' : 'Unknown';
  this._batches = {};
};

inherits(Job, events.EventEmitter);

/**
 * @typedef {Object} Bulk~JobInfo
 * @prop {String} id - Job ID
 * @prop {String} object - Object type name
 * @prop {String} operation - Operation type of the job
 * @prop {String} state - Job status
 */

/**
 * Return latest jobInfo from cache
 *
 * @method Bulk~Job#open
 * @param {Callback.<Bulk~JobInfo>} [callback] - Callback function
 * @returns {Promise.<Bulk~JobInfo>}
 */
Job.prototype.info = function(callback) {
  var self = this;
  // if cache is not available, check the latest
  if (!this._jobInfo) {
    this._jobInfo = this.check();
  }
  return this._jobInfo.thenCall(callback);
};

/**
 * Open new job and get jobinfo
 *
 * @method Bulk~Job#open
 * @param {Callback.<Bulk~JobInfo>} [callback] - Callback function
 * @returns {Promise.<Bulk~JobInfo>}
 */
Job.prototype.open = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

  // if not requested opening job
  if (!this._jobInfo) {
    var operation = this.operation.toLowerCase();
    if (operation === 'harddelete') { operation = 'hardDelete'; }
    var body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<jobInfo  xmlns="http://www.force.com/2009/06/asyncapi/dataload">',
        '<operation>' + operation + '</operation>',
        '<object>' + this.type + '</object>',
        (this.options.extIdField ?
         '<externalIdFieldName>'+this.options.extIdField+'</externalIdFieldName>' :
         ''),
        (this.options.concurrencyMode ?
         '<concurrencyMode>'+this.options.concurrencyMode+'</concurrencyMode>' :
         ''),
        (this.options.assignmentRuleId ?
          '<assignmentRuleId>' + this.options.assignmentRuleId + '</assignmentRuleId>' :
          ''),
        '<contentType>CSV</contentType>',
      '</jobInfo>'
    ].join('');

    this._jobInfo = bulk._request({
      method : 'POST',
      path : "/job",
      body : body,
      headers : {
        "Content-Type" : "application/xml; charset=utf-8"
      },
      responseType: "application/xml"
    }).then(function(res) {
      self.emit("open", res.jobInfo);
      self.id = res.jobInfo.id;
      self.state = res.jobInfo.state;
      return res.jobInfo;
    }, function(err) {
      self.emit("error", err);
      throw err;
    });
  }
  return this._jobInfo.thenCall(callback);
};

/**
 * Create a new batch instance in the job
 *
 * @method Bulk~Job#createBatch
 * @returns {Bulk~Batch}
 */
Job.prototype.createBatch = function() {
  var batch = new Batch(this);
  var self = this;
  batch.on('queue', function() {
    self._batches[batch.id] = batch;
  });
  return batch;
};

/**
 * Get a batch instance specified by given batch ID
 *
 * @method Bulk~Job#batch
 * @param {String} batchId - Batch ID
 * @returns {Bulk~Batch}
 */
Job.prototype.batch = function(batchId) {
  var batch = this._batches[batchId];
  if (!batch) {
    batch = new Batch(this, batchId);
    this._batches[batchId] = batch;
  }
  return batch;
};

/**
 * Check the latest job status from server
 *
 * @method Bulk~Job#check
 * @param {Callback.<Bulk~JobInfo>} [callback] - Callback function
 * @returns {Promise.<Bulk~JobInfo>}
 */
Job.prototype.check = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

  this._jobInfo = this._waitAssign().then(function() {
    return bulk._request({
      method : 'GET',
      path : "/job/" + self.id,
      responseType: "application/xml"
    });
  }).then(function(res) {
    logger.debug(res.jobInfo);
    self.id = res.jobInfo.id;
    self.type = res.jobInfo.object;
    self.operation = res.jobInfo.operation;
    self.state = res.jobInfo.state;
    return res.jobInfo;
  });
  return this._jobInfo.thenCall(callback);
};

/**
 * Wait till the job is assigned to server
 *
 * @method Bulk~Job#info
 * @param {Callback.<Bulk~JobInfo>} [callback] - Callback function
 * @returns {Promise.<Bulk~JobInfo>}
 */
Job.prototype._waitAssign = function(callback) {
  return (this.id ? Promise.resolve({ id: this.id }) : this.open()).thenCall(callback);
};


/**
 * List all registered batch info in job
 *
 * @method Bulk~Job#list
 * @param {Callback.<Array.<Bulk~BatchInfo>>} [callback] - Callback function
 * @returns {Promise.<Array.<Bulk~BatchInfo>>}
 */
Job.prototype.list = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

  return this._waitAssign().then(function() {
    return bulk._request({
      method : 'GET',
      path : "/job/" + self.id + "/batch",
      responseType: "application/xml"
    });
  }).then(function(res) {
    logger.debug(res.batchInfoList.batchInfo);
    var batchInfoList = res.batchInfoList;
    batchInfoList = _.isArray(batchInfoList.batchInfo) ? batchInfoList.batchInfo : [ batchInfoList.batchInfo ];
    return batchInfoList;
  }).thenCall(callback);

};

/**
 * Close opened job
 *
 * @method Bulk~Job#close
 * @param {Callback.<Bulk~JobInfo>} [callback] - Callback function
 * @returns {Promise.<Bulk~JobInfo>}
 */
Job.prototype.close = function() {
  var self = this;
  return this._changeState("Closed").then(function(jobInfo) {
    self.id = null;
    self.emit("close", jobInfo);
    return jobInfo;
  }, function(err) {
    self.emit("error", err);
    throw err;
  });
};

/**
 * Set the status to abort
 *
 * @method Bulk~Job#abort
 * @param {Callback.<Bulk~JobInfo>} [callback] - Callback function
 * @returns {Promise.<Bulk~JobInfo>}
 */
Job.prototype.abort = function() {
  var self = this;
  return this._changeState("Aborted").then(function(jobInfo) {
    self.id = null;
    self.emit("abort", jobInfo);
    return jobInfo;
  }, function(err) {
    self.emit("error", err);
    throw err;
  });
};

/**
 * @private
 */
Job.prototype._changeState = function(state, callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

  this._jobInfo = this._waitAssign().then(function() {
    var body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<jobInfo xmlns="http://www.force.com/2009/06/asyncapi/dataload">',
        '<state>' + state + '</state>',
      '</jobInfo>'
    ].join('');
    return bulk._request({
      method : 'POST',
      path : "/job/" + self.id,
      body : body,
      headers : {
        "Content-Type" : "application/xml; charset=utf-8"
      },
      responseType: "application/xml"
    });
  }).then(function(res) {
    logger.debug(res.jobInfo);
    self.state = res.jobInfo.state;
    return res.jobInfo;
  });
  return this._jobInfo.thenCall(callback);

};


/*--------------------------------------------*/

/**
 * Batch (extends RecordStream)
 *
 * @protected
 * @class Bulk~Batch
 * @extends {stream.Writable}
 * @implements {Promise.<Array.<RecordResult>>}
 * @param {Bulk~Job} job - Bulk job object
 * @param {String} [batchId] - Batch ID (if already available)
 */
var Batch = function(job, batchId) {
  Batch.super_.call(this, { objectMode: true });
  this.job = job;
  this.id = batchId;
  this._bulk = job._bulk;
  this._deferred = Promise.defer();
  this._setupDataStreams();
};

inherits(Batch, stream.Writable);


/**
 * @private
 */
Batch.prototype._setupDataStreams = function() {
  var batch = this;
  var converterOptions = { nullValue : '#N/A' };
  this._uploadStream = new RecordStream.Serializable();
  this._uploadDataStream = this._uploadStream.stream('csv', converterOptions);
  this._downloadStream = new RecordStream.Parsable();
  this._downloadDataStream = this._downloadStream.stream('csv', converterOptions);

  this.on('finish', function() {
    batch._uploadStream.end();
  });
  this._uploadDataStream.once('readable', function() {
    batch.job.open().then(function() {
      // pipe upload data to batch API request stream
      batch._uploadDataStream.pipe(batch._createRequestStream());
    });
  });

  // duplex data stream, opened access to API programmers by Batch#stream()
  var dataStream = this._dataStream = new Duplex();
  dataStream._write = function(data, enc, cb) {
    batch._uploadDataStream.write(data, enc, cb);
  };
  dataStream.on('finish', function() {
    batch._uploadDataStream.end();
  });

  this._downloadDataStream.on('readable', function() {
    dataStream.read(0);
  });
  this._downloadDataStream.on('end', function() {
    dataStream.push(null);
  });
  dataStream._read = function(size) {
    var chunk;
    while ((chunk = batch._downloadDataStream.read()) !== null) {
      dataStream.push(chunk);
    }
  };
};

/**
 * Connect batch API and create stream instance of request/response
 *
 * @private
 * @returns {stream.Duplex}
 */
Batch.prototype._createRequestStream = function() {
  var batch = this;
  var bulk = batch._bulk;
  var logger = bulk._logger;

  return bulk._request({
    method : 'POST',
    path : "/job/" + batch.job.id + "/batch",
    headers: {
      "Content-Type": "text/csv"
    },
    responseType: "application/xml"
  }, function(err, res) {
    if (err) {
      batch.emit('error', err);
    } else {
      logger.debug(res.batchInfo);
      batch.id = res.batchInfo.id;
      batch.emit('queue', res.batchInfo);
    }
  }).stream();
};

/**
 * Implementation of Writable
 *
 * @override
 * @private
 */
Batch.prototype._write = function(record, enc, cb) {
  record = _.clone(record);
  if (this.job.operation === "insert") {
    delete record.Id;
  } else if (this.job.operation === "delete") {
    record = { Id: record.Id };
  }
  delete record.type;
  delete record.attributes;
  this._uploadStream.write(record, enc, cb);
};

/**
 * Returns duplex stream which accepts CSV data input and batch result output
 *
 * @returns {stream.Duplex}
 */
Batch.prototype.stream = function() {
  return this._dataStream;
};

/**
 * Execute batch operation
 *
 * @method Bulk~Batch#execute
 * @param {Array.<Record>|stream.Stream|String} [input] - Input source for batch operation. Accepts array of records, CSV string, and CSV data input stream in insert/update/upsert/delete/hardDelete operation, SOQL string in query operation.
 * @param {Callback.<Array.<RecordResult>|Array.<BatchResultInfo>>} [callback] - Callback function
 * @returns {Bulk~Batch}
 */
Batch.prototype.run =
Batch.prototype.exec =
Batch.prototype.execute = function(input, callback) {
  var self = this;

  if (typeof input === 'function') { // if input argument is omitted
    callback = input;
    input = null;
  }

  // if batch is already executed
  if (this._result) {
    throw new Error("Batch already executed.");
  }

  var rdeferred = Promise.defer();
  this._result = rdeferred.promise;
  this._result.then(function(res) {
    self._deferred.resolve(res);
  }, function(err) {
    self._deferred.reject(err);
  });
  this.once('response', function(res) {
    rdeferred.resolve(res);
  });
  this.once('error', function(err) {
    rdeferred.reject(err);
  });

  if (_.isObject(input) && _.isFunction(input.pipe)) { // if input has stream.Readable interface
    input.pipe(this._dataStream);
  } else {
    var data;
    if (_.isArray(input)) {
      _.forEach(input, function(record) { self.write(record); });
      self.end();
    } else if (_.isString(input)){
      data = input;
      this._dataStream.write(data, 'utf8');
      this._dataStream.end();
    }
  }

  // return Batch instance for chaining
  return this.thenCall(callback);
};

/**
 * Promise/A+ interface
 * http://promises-aplus.github.io/promises-spec/
 *
 * Delegate to deferred promise, return promise instance for batch result
 *
 * @method Bulk~Batch#then
 */
Batch.prototype.then = function(onResolved, onReject, onProgress) {
  return this._deferred.promise.then(onResolved, onReject, onProgress);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 *
 * @method Bulk~Batch#thenCall
 */
Batch.prototype.thenCall = function(callback) {
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

/**
 * @typedef {Object} Bulk~BatchInfo
 * @prop {String} id - Batch ID
 * @prop {String} jobId - Job ID
 * @prop {String} state - Batch state
 * @prop {String} stateMessage - Batch state message
 */

/**
 * Check the latest batch status in server
 *
 * @method Bulk~Batch#check
 * @param {Callback.<Bulk~BatchInfo>} [callback] - Callback function
 * @returns {Promise.<Bulk~BatchInfo>}
 */
Batch.prototype.check = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;
  var jobId = this.job.id;
  var batchId = this.id;

  if (!jobId || !batchId) {
    throw new Error("Batch not started.");
  }
  return bulk._request({
    method : 'GET',
    path : "/job/" + jobId + "/batch/" + batchId,
    responseType: "application/xml"
  }).then(function(res) {
    logger.debug(res.batchInfo);
    return res.batchInfo;
  }).thenCall(callback);
};


/**
 * Polling the batch result and retrieve
 *
 * @method Bulk~Batch#poll
 * @param {Number} interval - Polling interval in milliseconds
 * @param {Number} timeout - Polling timeout in milliseconds
 */
Batch.prototype.poll = function(interval, timeout) {
  var self = this;
  var jobId = this.job.id;
  var batchId = this.id;

  if (!jobId || !batchId) {
    throw new Error("Batch not started.");
  }
  var startTime = new Date().getTime();
  var poll = function() {
    var now = new Date().getTime();
    if (startTime + timeout < now) {
      var err = new Error("Polling time out. Job Id = " + jobId + " , batch Id = " + batchId);
      err.name = 'PollingTimeout';
      self.emit('error', err);
      return;
    }
    self.check(function(err, res) {
      if (err) {
        self.emit('error', err);
      } else {
        if (res.state === "Failed") {
          if (parseInt(res.numberRecordsProcessed, 10) > 0) {
            self.retrieve();
          } else {
            self.emit('error', new Error(res.stateMessage));
          }
        } else if (res.state === "Completed") {
          self.retrieve();
        } else {
          self.emit('progress', res);
          setTimeout(poll, interval);
        }
      }
    });
  };
  setTimeout(poll, interval);
};

/**
 * @typedef {Object} Bulk~BatchResultInfo
 * @prop {String} id - Batch result ID
 * @prop {String} batchId - Batch ID which includes this batch result.
 * @prop {String} jobId - Job ID which includes this batch result.
 */

/**
 * Retrieve batch result
 *
 * @method Bulk~Batch#retrieve
 * @param {Callback.<Array.<RecordResult>|Array.<Bulk~BatchResultInfo>>} [callback] - Callback function
 * @returns {Promise.<Array.<RecordResult>|Array.<Bulk~BatchResultInfo>>}
 */
Batch.prototype.retrieve = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var jobId = this.job.id;
  var job = this.job;
  var batchId = this.id;

  if (!jobId || !batchId) {
    throw new Error("Batch not started.");
  }

  return job.info().then(function(jobInfo) {
    return bulk._request({
      method : 'GET',
      path : "/job/" + jobId + "/batch/" + batchId + "/result"
    });
  }).then(function(res) {
    var results;
    if (job.operation === 'query') {
      var conn = bulk._conn;
      var resultIds = res['result-list'].result;
      results = res['result-list'].result;
      results = _.map(_.isArray(results) ? results : [ results ], function(id) {
        return {
          id: id,
          batchId: batchId,
          jobId: jobId
        };
      });
    } else {
      results = _.map(res, function(ret) {
        return {
          id: ret.Id || null,
          success: ret.Success === "true",
          errors: ret.Error ? [ ret.Error ] : []
        };
      });
    }
    self.emit('response', results);
    return results;
  }).fail(function(err) {
    self.emit('error', err);
    throw err;
  }).thenCall(callback);
};

/**
 * Fetch query result as a record stream
 * @param {String} resultId - Result id
 * @returns {RecordStream} - Record stream, convertible to CSV data stream
 */
Batch.prototype.result = function(resultId) {
  var jobId = this.job.id;
  var batchId = this.id;
  if (!jobId || !batchId) {
    throw new Error("Batch not started.");
  }
  var resultStream = new RecordStream.Parsable();
  var resultDataStream = resultStream.stream('csv');
  var reqStream = this._bulk._request({
    method : 'GET',
    path : "/job/" + jobId + "/batch/" + batchId + "/result/" + resultId,
    responseType: "application/octet-stream"
  }).stream().pipe(resultDataStream);
  return resultStream;
};

/*--------------------------------------------*/
/**
 * @private
 */
var BulkApi = function() {
  BulkApi.super_.apply(this, arguments);
};

inherits(BulkApi, HttpApi);

BulkApi.prototype.beforeSend = function(request) {
  request.headers = request.headers || {};
  request.headers["X-SFDC-SESSION"] = this._conn.accessToken;
};

BulkApi.prototype.isSessionExpired = function(response) {
  return response.statusCode === 400 &&
    /<exceptionCode>InvalidSessionId<\/exceptionCode>/.test(response.body);
};

BulkApi.prototype.hasErrorInResponseBody = function(body) {
  return !!body.error;
};

BulkApi.prototype.parseError = function(body) {
  return {
    errorCode: body.error.exceptionCode,
    message: body.error.exceptionMessage
  };
};

/*--------------------------------------------*/

/**
 * Class for Bulk API
 *
 * @class
 * @param {Connection} conn - Connection object
 */
var Bulk = function(conn) {
  this._conn = conn;
  this._logger = conn._logger;
};

/**
 * Polling interval in milliseconds
 * @type {Number}
 */
Bulk.prototype.pollInterval = 1000;

/**
 * Polling timeout in milliseconds
 * @type {Number}
 */
Bulk.prototype.pollTimeout = 10000;

/** @private **/
Bulk.prototype._request = function(request, callback) {
  var conn = this._conn;
  request = _.clone(request);
  var baseUrl = [ conn.instanceUrl, "services/async", conn.version ].join('/');
  request.url = baseUrl + request.path;
  var options = { responseType: request.responseType };
  delete request.path;
  delete request.responseType;
  return new BulkApi(this._conn, options).request(request).thenCall(callback);
};

/**
 * Create and start bulkload job and batch
 *
 * @param {String} type - SObject type
 * @param {String} operation - Bulk load operation ('insert', 'update', 'upsert', 'delete', or 'hardDelete')
 * @param {Object} [options] - Options for bulk loading operation
 * @param {String} [options.extIdField] - External ID field name (used when upsert operation).
 * @param {String} [options.concurrencyMode] - 'Serial' or 'Parallel'. Defaults to Parallel.
 * @param {Array.<Record>|stream.Stream|String} [input] - Input source for bulkload. Accepts array of records, CSV string, and CSV data input stream in insert/update/upsert/delete/hardDelete operation, SOQL string in query operation.
 * @param {Callback.<Array.<RecordResult>|Array.<Bulk~BatchResultInfo>>} [callback] - Callback function
 * @returns {Bulk~Batch}
 */
Bulk.prototype.load = function(type, operation, options, input, callback) {
  var self = this;
  if (!type || !operation) {
    throw new Error("Insufficient arguments. At least, 'type' and 'operation' are required.");
  }
  if (!_.isObject(options) || options.constructor !== Object) { // when options is not plain hash object, it is omitted
    callback = input;
    input = options;
    options = null;
  }
  var job = this.createJob(type, operation, options);
  job.once('error', function (error) {
    if (batch) {
      batch.emit('error', error); // pass job error to batch
    }
  });
  var batch = job.createBatch();
  var cleanup = function() {
    batch = null;
    job.close();
  };
  var cleanupOnError = function(err) {
    if (err.name !== 'PollingTimeout') {
      cleanup();
    }
  };
  batch.on('response', cleanup);
  batch.on('error', cleanupOnError);
  batch.on('queue', function() { batch.poll(self.pollInterval, self.pollTimeout); });
  return batch.execute(input, callback);
};

/**
 * Execute bulk query and get record stream
 *
 * @param {String} soql - SOQL to execute in bulk job
 * @returns {RecordStream.Parsable} - Record stream, convertible to CSV data stream
 */
Bulk.prototype.query = function(soql) {
  var m = soql.replace(/\([\s\S]+\)/g, '').match(/FROM\s+(\w+)/i);
  if (!m) {
    throw new Error("No sobject type found in query, maybe caused by invalid SOQL.");
  }
  var type = m[1];
  var self = this;
  var recordStream = new RecordStream.Parsable();
  var dataStream = recordStream.stream('csv');
  this.load(type, "query", soql).then(function(results) {
    var streams = results.map(function(result) {
      return self
        .job(result.jobId)
        .batch(result.batchId)
        .result(result.id)
        .stream();
    });

    joinStreams(streams).pipe(dataStream);
  }).fail(function(err) {
    recordStream.emit('error', err);
  });
  return recordStream;
};


/**
 * Create a new job instance
 *
 * @param {String} type - SObject type
 * @param {String} operation - Bulk load operation ('insert', 'update', 'upsert', 'delete', 'hardDelete', or 'query')
 * @param {Object} [options] - Options for bulk loading operation
 * @returns {Bulk~Job}
 */
Bulk.prototype.createJob = function(type, operation, options) {
  return new Job(this, type, operation, options);
};

/**
 * Get a job instance specified by given job ID
 *
 * @param {String} jobId - Job ID
 * @returns {Bulk~Job}
 */
Bulk.prototype.job = function(jobId) {
  return new Job(this, null, null, null, jobId);
};


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.bulk = new Bulk(conn);
});


module.exports = Bulk;

}).call(this,require('_process'))

},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
    try {
        cachedSetTimeout = setTimeout;
    } catch (e) {
        cachedSetTimeout = function () {
            throw new Error('setTimeout is not defined');
        }
    }
    try {
        cachedClearTimeout = clearTimeout;
    } catch (e) {
        cachedClearTimeout = function () {
            throw new Error('clearTimeout is not defined');
        }
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL2J1bGsuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypnbG9iYWwgcHJvY2VzcyovXG4vKipcbiAqIEBmaWxlIE1hbmFnZXMgU2FsZXNmb3JjZSBCdWxrIEFQSSByZWxhdGVkIG9wZXJhdGlvbnNcbiAqIEBhdXRob3IgU2hpbmljaGkgVG9taXRhIDxzaGluaWNoaS50b21pdGFAZ21haWwuY29tPlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzICAgICA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJ2luaGVyaXRzJyksXG4gICAgc3RyZWFtICAgICAgID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgncmVhZGFibGUtc3RyZWFtJyksXG4gICAgRHVwbGV4ICAgICAgID0gc3RyZWFtLkR1cGxleCxcbiAgICBldmVudHMgICAgICAgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdldmVudHMnKSxcbiAgICBfICAgICAgICAgICAgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdsb2Rhc2gvY29yZScpLFxuICAgIGpvaW5TdHJlYW1zICA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJ211bHRpc3RyZWFtJyksXG4gICAganNmb3JjZSAgICAgID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9jb3JlJyksXG4gICAgUmVjb3JkU3RyZWFtID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9yZWNvcmQtc3RyZWFtJyksXG4gICAgUHJvbWlzZSAgICAgID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9wcm9taXNlJyksXG4gICAgSHR0cEFwaSAgICAgID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9odHRwLWFwaScpO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG4gKiBDbGFzcyBmb3IgQnVsayBBUEkgSm9iXG4gKlxuICogQHByb3RlY3RlZFxuICogQGNsYXNzIEJ1bGt+Sm9iXG4gKiBAZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyXG4gKlxuICogQHBhcmFtIHtCdWxrfSBidWxrIC0gQnVsayBBUEkgb2JqZWN0XG4gKiBAcGFyYW0ge1N0cmluZ30gW3R5cGVdIC0gU09iamVjdCB0eXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wZXJhdGlvbl0gLSBCdWxrIGxvYWQgb3BlcmF0aW9uICgnaW5zZXJ0JywgJ3VwZGF0ZScsICd1cHNlcnQnLCAnZGVsZXRlJywgb3IgJ2hhcmREZWxldGUnKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIE9wdGlvbnMgZm9yIGJ1bGsgbG9hZGluZyBvcGVyYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5leHRJZEZpZWxkXSAtIEV4dGVybmFsIElEIGZpZWxkIG5hbWUgKHVzZWQgd2hlbiB1cHNlcnQgb3BlcmF0aW9uKS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb25jdXJyZW5jeU1vZGVdIC0gJ1NlcmlhbCcgb3IgJ1BhcmFsbGVsJy4gRGVmYXVsdHMgdG8gUGFyYWxsZWwuXG4gKiBAcGFyYW0ge1N0cmluZ30gW2pvYklkXSAtIEpvYiBJRCAoaWYgYWxyZWFkeSBhdmFpbGFibGUpXG4gKi9cbnZhciBKb2IgPSBmdW5jdGlvbihidWxrLCB0eXBlLCBvcGVyYXRpb24sIG9wdGlvbnMsIGpvYklkKSB7XG4gIHRoaXMuX2J1bGsgPSBidWxrO1xuICB0aGlzLnR5cGUgPSB0eXBlO1xuICB0aGlzLm9wZXJhdGlvbiA9IG9wZXJhdGlvbjtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5pZCA9IGpvYklkO1xuICB0aGlzLnN0YXRlID0gdGhpcy5pZCA/ICdPcGVuJyA6ICdVbmtub3duJztcbiAgdGhpcy5fYmF0Y2hlcyA9IHt9O1xufTtcblxuaW5oZXJpdHMoSm9iLCBldmVudHMuRXZlbnRFbWl0dGVyKTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBCdWxrfkpvYkluZm9cbiAqIEBwcm9wIHtTdHJpbmd9IGlkIC0gSm9iIElEXG4gKiBAcHJvcCB7U3RyaW5nfSBvYmplY3QgLSBPYmplY3QgdHlwZSBuYW1lXG4gKiBAcHJvcCB7U3RyaW5nfSBvcGVyYXRpb24gLSBPcGVyYXRpb24gdHlwZSBvZiB0aGUgam9iXG4gKiBAcHJvcCB7U3RyaW5nfSBzdGF0ZSAtIEpvYiBzdGF0dXNcbiAqL1xuXG4vKipcbiAqIFJldHVybiBsYXRlc3Qgam9iSW5mbyBmcm9tIGNhY2hlXG4gKlxuICogQG1ldGhvZCBCdWxrfkpvYiNvcGVuXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxCdWxrfkpvYkluZm8+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxCdWxrfkpvYkluZm8+fVxuICovXG5Kb2IucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIC8vIGlmIGNhY2hlIGlzIG5vdCBhdmFpbGFibGUsIGNoZWNrIHRoZSBsYXRlc3RcbiAgaWYgKCF0aGlzLl9qb2JJbmZvKSB7XG4gICAgdGhpcy5fam9iSW5mbyA9IHRoaXMuY2hlY2soKTtcbiAgfVxuICByZXR1cm4gdGhpcy5fam9iSW5mby50aGVuQ2FsbChjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIE9wZW4gbmV3IGpvYiBhbmQgZ2V0IGpvYmluZm9cbiAqXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI29wZW5cbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEJ1bGt+Sm9iSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMge1Byb21pc2UuPEJ1bGt+Sm9iSW5mbz59XG4gKi9cbkpvYi5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGJ1bGsgPSB0aGlzLl9idWxrO1xuICB2YXIgbG9nZ2VyID0gYnVsay5fbG9nZ2VyO1xuXG4gIC8vIGlmIG5vdCByZXF1ZXN0ZWQgb3BlbmluZyBqb2JcbiAgaWYgKCF0aGlzLl9qb2JJbmZvKSB7XG4gICAgdmFyIG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gJ2hhcmRkZWxldGUnKSB7IG9wZXJhdGlvbiA9ICdoYXJkRGVsZXRlJzsgfVxuICAgIHZhciBib2R5ID0gW1xuICAgICAgJzw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/PicsXG4gICAgICAnPGpvYkluZm8gIHhtbG5zPVwiaHR0cDovL3d3dy5mb3JjZS5jb20vMjAwOS8wNi9hc3luY2FwaS9kYXRhbG9hZFwiPicsXG4gICAgICAgICc8b3BlcmF0aW9uPicgKyBvcGVyYXRpb24gKyAnPC9vcGVyYXRpb24+JyxcbiAgICAgICAgJzxvYmplY3Q+JyArIHRoaXMudHlwZSArICc8L29iamVjdD4nLFxuICAgICAgICAodGhpcy5vcHRpb25zLmV4dElkRmllbGQgP1xuICAgICAgICAgJzxleHRlcm5hbElkRmllbGROYW1lPicrdGhpcy5vcHRpb25zLmV4dElkRmllbGQrJzwvZXh0ZXJuYWxJZEZpZWxkTmFtZT4nIDpcbiAgICAgICAgICcnKSxcbiAgICAgICAgKHRoaXMub3B0aW9ucy5jb25jdXJyZW5jeU1vZGUgP1xuICAgICAgICAgJzxjb25jdXJyZW5jeU1vZGU+Jyt0aGlzLm9wdGlvbnMuY29uY3VycmVuY3lNb2RlKyc8L2NvbmN1cnJlbmN5TW9kZT4nIDpcbiAgICAgICAgICcnKSxcbiAgICAgICAgKHRoaXMub3B0aW9ucy5hc3NpZ25tZW50UnVsZUlkID9cbiAgICAgICAgICAnPGFzc2lnbm1lbnRSdWxlSWQ+JyArIHRoaXMub3B0aW9ucy5hc3NpZ25tZW50UnVsZUlkICsgJzwvYXNzaWdubWVudFJ1bGVJZD4nIDpcbiAgICAgICAgICAnJyksXG4gICAgICAgICc8Y29udGVudFR5cGU+Q1NWPC9jb250ZW50VHlwZT4nLFxuICAgICAgJzwvam9iSW5mbz4nXG4gICAgXS5qb2luKCcnKTtcblxuICAgIHRoaXMuX2pvYkluZm8gPSBidWxrLl9yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZCA6ICdQT1NUJyxcbiAgICAgIHBhdGggOiBcIi9qb2JcIixcbiAgICAgIGJvZHkgOiBib2R5LFxuICAgICAgaGVhZGVycyA6IHtcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIiA6IFwiYXBwbGljYXRpb24veG1sOyBjaGFyc2V0PXV0Zi04XCJcbiAgICAgIH0sXG4gICAgICByZXNwb25zZVR5cGU6IFwiYXBwbGljYXRpb24veG1sXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgc2VsZi5lbWl0KFwib3BlblwiLCByZXMuam9iSW5mbyk7XG4gICAgICBzZWxmLmlkID0gcmVzLmpvYkluZm8uaWQ7XG4gICAgICBzZWxmLnN0YXRlID0gcmVzLmpvYkluZm8uc3RhdGU7XG4gICAgICByZXR1cm4gcmVzLmpvYkluZm87XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBzZWxmLmVtaXQoXCJlcnJvclwiLCBlcnIpO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB0aGlzLl9qb2JJbmZvLnRoZW5DYWxsKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGJhdGNoIGluc3RhbmNlIGluIHRoZSBqb2JcbiAqXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI2NyZWF0ZUJhdGNoXG4gKiBAcmV0dXJucyB7QnVsa35CYXRjaH1cbiAqL1xuSm9iLnByb3RvdHlwZS5jcmVhdGVCYXRjaCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYmF0Y2ggPSBuZXcgQmF0Y2godGhpcyk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgYmF0Y2gub24oJ3F1ZXVlJywgZnVuY3Rpb24oKSB7XG4gICAgc2VsZi5fYmF0Y2hlc1tiYXRjaC5pZF0gPSBiYXRjaDtcbiAgfSk7XG4gIHJldHVybiBiYXRjaDtcbn07XG5cbi8qKlxuICogR2V0IGEgYmF0Y2ggaW5zdGFuY2Ugc3BlY2lmaWVkIGJ5IGdpdmVuIGJhdGNoIElEXG4gKlxuICogQG1ldGhvZCBCdWxrfkpvYiNiYXRjaFxuICogQHBhcmFtIHtTdHJpbmd9IGJhdGNoSWQgLSBCYXRjaCBJRFxuICogQHJldHVybnMge0J1bGt+QmF0Y2h9XG4gKi9cbkpvYi5wcm90b3R5cGUuYmF0Y2ggPSBmdW5jdGlvbihiYXRjaElkKSB7XG4gIHZhciBiYXRjaCA9IHRoaXMuX2JhdGNoZXNbYmF0Y2hJZF07XG4gIGlmICghYmF0Y2gpIHtcbiAgICBiYXRjaCA9IG5ldyBCYXRjaCh0aGlzLCBiYXRjaElkKTtcbiAgICB0aGlzLl9iYXRjaGVzW2JhdGNoSWRdID0gYmF0Y2g7XG4gIH1cbiAgcmV0dXJuIGJhdGNoO1xufTtcblxuLyoqXG4gKiBDaGVjayB0aGUgbGF0ZXN0IGpvYiBzdGF0dXMgZnJvbSBzZXJ2ZXJcbiAqXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI2NoZWNrXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxCdWxrfkpvYkluZm8+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxCdWxrfkpvYkluZm8+fVxuICovXG5Kb2IucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYnVsayA9IHRoaXMuX2J1bGs7XG4gIHZhciBsb2dnZXIgPSBidWxrLl9sb2dnZXI7XG5cbiAgdGhpcy5fam9iSW5mbyA9IHRoaXMuX3dhaXRBc3NpZ24oKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBidWxrLl9yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZCA6ICdHRVQnLFxuICAgICAgcGF0aCA6IFwiL2pvYi9cIiArIHNlbGYuaWQsXG4gICAgICByZXNwb25zZVR5cGU6IFwiYXBwbGljYXRpb24veG1sXCJcbiAgICB9KTtcbiAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICBsb2dnZXIuZGVidWcocmVzLmpvYkluZm8pO1xuICAgIHNlbGYuaWQgPSByZXMuam9iSW5mby5pZDtcbiAgICBzZWxmLnR5cGUgPSByZXMuam9iSW5mby5vYmplY3Q7XG4gICAgc2VsZi5vcGVyYXRpb24gPSByZXMuam9iSW5mby5vcGVyYXRpb247XG4gICAgc2VsZi5zdGF0ZSA9IHJlcy5qb2JJbmZvLnN0YXRlO1xuICAgIHJldHVybiByZXMuam9iSW5mbztcbiAgfSk7XG4gIHJldHVybiB0aGlzLl9qb2JJbmZvLnRoZW5DYWxsKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogV2FpdCB0aWxsIHRoZSBqb2IgaXMgYXNzaWduZWQgdG8gc2VydmVyXG4gKlxuICogQG1ldGhvZCBCdWxrfkpvYiNpbmZvXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxCdWxrfkpvYkluZm8+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxCdWxrfkpvYkluZm8+fVxuICovXG5Kb2IucHJvdG90eXBlLl93YWl0QXNzaWduID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgcmV0dXJuICh0aGlzLmlkID8gUHJvbWlzZS5yZXNvbHZlKHsgaWQ6IHRoaXMuaWQgfSkgOiB0aGlzLm9wZW4oKSkudGhlbkNhbGwoY2FsbGJhY2spO1xufTtcblxuXG4vKipcbiAqIExpc3QgYWxsIHJlZ2lzdGVyZWQgYmF0Y2ggaW5mbyBpbiBqb2JcbiAqXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI2xpc3RcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFycmF5LjxCdWxrfkJhdGNoSW5mbz4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBcnJheS48QnVsa35CYXRjaEluZm8+Pn1cbiAqL1xuSm9iLnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYnVsayA9IHRoaXMuX2J1bGs7XG4gIHZhciBsb2dnZXIgPSBidWxrLl9sb2dnZXI7XG5cbiAgcmV0dXJuIHRoaXMuX3dhaXRBc3NpZ24oKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBidWxrLl9yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZCA6ICdHRVQnLFxuICAgICAgcGF0aCA6IFwiL2pvYi9cIiArIHNlbGYuaWQgKyBcIi9iYXRjaFwiLFxuICAgICAgcmVzcG9uc2VUeXBlOiBcImFwcGxpY2F0aW9uL3htbFwiXG4gICAgfSk7XG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgbG9nZ2VyLmRlYnVnKHJlcy5iYXRjaEluZm9MaXN0LmJhdGNoSW5mbyk7XG4gICAgdmFyIGJhdGNoSW5mb0xpc3QgPSByZXMuYmF0Y2hJbmZvTGlzdDtcbiAgICBiYXRjaEluZm9MaXN0ID0gXy5pc0FycmF5KGJhdGNoSW5mb0xpc3QuYmF0Y2hJbmZvKSA/IGJhdGNoSW5mb0xpc3QuYmF0Y2hJbmZvIDogWyBiYXRjaEluZm9MaXN0LmJhdGNoSW5mbyBdO1xuICAgIHJldHVybiBiYXRjaEluZm9MaXN0O1xuICB9KS50aGVuQ2FsbChjYWxsYmFjayk7XG5cbn07XG5cbi8qKlxuICogQ2xvc2Ugb3BlbmVkIGpvYlxuICpcbiAqIEBtZXRob2QgQnVsa35Kb2IjY2xvc2VcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEJ1bGt+Sm9iSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMge1Byb21pc2UuPEJ1bGt+Sm9iSW5mbz59XG4gKi9cbkpvYi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICByZXR1cm4gdGhpcy5fY2hhbmdlU3RhdGUoXCJDbG9zZWRcIikudGhlbihmdW5jdGlvbihqb2JJbmZvKSB7XG4gICAgc2VsZi5pZCA9IG51bGw7XG4gICAgc2VsZi5lbWl0KFwiY2xvc2VcIiwgam9iSW5mbyk7XG4gICAgcmV0dXJuIGpvYkluZm87XG4gIH0sIGZ1bmN0aW9uKGVycikge1xuICAgIHNlbGYuZW1pdChcImVycm9yXCIsIGVycik7XG4gICAgdGhyb3cgZXJyO1xuICB9KTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBzdGF0dXMgdG8gYWJvcnRcbiAqXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI2Fib3J0XG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxCdWxrfkpvYkluZm8+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxCdWxrfkpvYkluZm8+fVxuICovXG5Kb2IucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcmV0dXJuIHRoaXMuX2NoYW5nZVN0YXRlKFwiQWJvcnRlZFwiKS50aGVuKGZ1bmN0aW9uKGpvYkluZm8pIHtcbiAgICBzZWxmLmlkID0gbnVsbDtcbiAgICBzZWxmLmVtaXQoXCJhYm9ydFwiLCBqb2JJbmZvKTtcbiAgICByZXR1cm4gam9iSW5mbztcbiAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgc2VsZi5lbWl0KFwiZXJyb3JcIiwgZXJyKTtcbiAgICB0aHJvdyBlcnI7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5Kb2IucHJvdG90eXBlLl9jaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBidWxrID0gdGhpcy5fYnVsaztcbiAgdmFyIGxvZ2dlciA9IGJ1bGsuX2xvZ2dlcjtcblxuICB0aGlzLl9qb2JJbmZvID0gdGhpcy5fd2FpdEFzc2lnbigpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJvZHkgPSBbXG4gICAgICAnPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIj8+JyxcbiAgICAgICc8am9iSW5mbyB4bWxucz1cImh0dHA6Ly93d3cuZm9yY2UuY29tLzIwMDkvMDYvYXN5bmNhcGkvZGF0YWxvYWRcIj4nLFxuICAgICAgICAnPHN0YXRlPicgKyBzdGF0ZSArICc8L3N0YXRlPicsXG4gICAgICAnPC9qb2JJbmZvPidcbiAgICBdLmpvaW4oJycpO1xuICAgIHJldHVybiBidWxrLl9yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZCA6ICdQT1NUJyxcbiAgICAgIHBhdGggOiBcIi9qb2IvXCIgKyBzZWxmLmlkLFxuICAgICAgYm9keSA6IGJvZHksXG4gICAgICBoZWFkZXJzIDoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLThcIlxuICAgICAgfSxcbiAgICAgIHJlc3BvbnNlVHlwZTogXCJhcHBsaWNhdGlvbi94bWxcIlxuICAgIH0pO1xuICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgIGxvZ2dlci5kZWJ1ZyhyZXMuam9iSW5mbyk7XG4gICAgc2VsZi5zdGF0ZSA9IHJlcy5qb2JJbmZvLnN0YXRlO1xuICAgIHJldHVybiByZXMuam9iSW5mbztcbiAgfSk7XG4gIHJldHVybiB0aGlzLl9qb2JJbmZvLnRoZW5DYWxsKGNhbGxiYWNrKTtcblxufTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG4gKiBCYXRjaCAoZXh0ZW5kcyBSZWNvcmRTdHJlYW0pXG4gKlxuICogQHByb3RlY3RlZFxuICogQGNsYXNzIEJ1bGt+QmF0Y2hcbiAqIEBleHRlbmRzIHtzdHJlYW0uV3JpdGFibGV9XG4gKiBAaW1wbGVtZW50cyB7UHJvbWlzZS48QXJyYXkuPFJlY29yZFJlc3VsdD4+fVxuICogQHBhcmFtIHtCdWxrfkpvYn0gam9iIC0gQnVsayBqb2Igb2JqZWN0XG4gKiBAcGFyYW0ge1N0cmluZ30gW2JhdGNoSWRdIC0gQmF0Y2ggSUQgKGlmIGFscmVhZHkgYXZhaWxhYmxlKVxuICovXG52YXIgQmF0Y2ggPSBmdW5jdGlvbihqb2IsIGJhdGNoSWQpIHtcbiAgQmF0Y2guc3VwZXJfLmNhbGwodGhpcywgeyBvYmplY3RNb2RlOiB0cnVlIH0pO1xuICB0aGlzLmpvYiA9IGpvYjtcbiAgdGhpcy5pZCA9IGJhdGNoSWQ7XG4gIHRoaXMuX2J1bGsgPSBqb2IuX2J1bGs7XG4gIHRoaXMuX2RlZmVycmVkID0gUHJvbWlzZS5kZWZlcigpO1xuICB0aGlzLl9zZXR1cERhdGFTdHJlYW1zKCk7XG59O1xuXG5pbmhlcml0cyhCYXRjaCwgc3RyZWFtLldyaXRhYmxlKTtcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbkJhdGNoLnByb3RvdHlwZS5fc2V0dXBEYXRhU3RyZWFtcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYmF0Y2ggPSB0aGlzO1xuICB2YXIgY29udmVydGVyT3B0aW9ucyA9IHsgbnVsbFZhbHVlIDogJyNOL0EnIH07XG4gIHRoaXMuX3VwbG9hZFN0cmVhbSA9IG5ldyBSZWNvcmRTdHJlYW0uU2VyaWFsaXphYmxlKCk7XG4gIHRoaXMuX3VwbG9hZERhdGFTdHJlYW0gPSB0aGlzLl91cGxvYWRTdHJlYW0uc3RyZWFtKCdjc3YnLCBjb252ZXJ0ZXJPcHRpb25zKTtcbiAgdGhpcy5fZG93bmxvYWRTdHJlYW0gPSBuZXcgUmVjb3JkU3RyZWFtLlBhcnNhYmxlKCk7XG4gIHRoaXMuX2Rvd25sb2FkRGF0YVN0cmVhbSA9IHRoaXMuX2Rvd25sb2FkU3RyZWFtLnN0cmVhbSgnY3N2JywgY29udmVydGVyT3B0aW9ucyk7XG5cbiAgdGhpcy5vbignZmluaXNoJywgZnVuY3Rpb24oKSB7XG4gICAgYmF0Y2guX3VwbG9hZFN0cmVhbS5lbmQoKTtcbiAgfSk7XG4gIHRoaXMuX3VwbG9hZERhdGFTdHJlYW0ub25jZSgncmVhZGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICBiYXRjaC5qb2Iub3BlbigpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAvLyBwaXBlIHVwbG9hZCBkYXRhIHRvIGJhdGNoIEFQSSByZXF1ZXN0IHN0cmVhbVxuICAgICAgYmF0Y2guX3VwbG9hZERhdGFTdHJlYW0ucGlwZShiYXRjaC5fY3JlYXRlUmVxdWVzdFN0cmVhbSgpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gZHVwbGV4IGRhdGEgc3RyZWFtLCBvcGVuZWQgYWNjZXNzIHRvIEFQSSBwcm9ncmFtbWVycyBieSBCYXRjaCNzdHJlYW0oKVxuICB2YXIgZGF0YVN0cmVhbSA9IHRoaXMuX2RhdGFTdHJlYW0gPSBuZXcgRHVwbGV4KCk7XG4gIGRhdGFTdHJlYW0uX3dyaXRlID0gZnVuY3Rpb24oZGF0YSwgZW5jLCBjYikge1xuICAgIGJhdGNoLl91cGxvYWREYXRhU3RyZWFtLndyaXRlKGRhdGEsIGVuYywgY2IpO1xuICB9O1xuICBkYXRhU3RyZWFtLm9uKCdmaW5pc2gnLCBmdW5jdGlvbigpIHtcbiAgICBiYXRjaC5fdXBsb2FkRGF0YVN0cmVhbS5lbmQoKTtcbiAgfSk7XG5cbiAgdGhpcy5fZG93bmxvYWREYXRhU3RyZWFtLm9uKCdyZWFkYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIGRhdGFTdHJlYW0ucmVhZCgwKTtcbiAgfSk7XG4gIHRoaXMuX2Rvd25sb2FkRGF0YVN0cmVhbS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgZGF0YVN0cmVhbS5wdXNoKG51bGwpO1xuICB9KTtcbiAgZGF0YVN0cmVhbS5fcmVhZCA9IGZ1bmN0aW9uKHNpemUpIHtcbiAgICB2YXIgY2h1bms7XG4gICAgd2hpbGUgKChjaHVuayA9IGJhdGNoLl9kb3dubG9hZERhdGFTdHJlYW0ucmVhZCgpKSAhPT0gbnVsbCkge1xuICAgICAgZGF0YVN0cmVhbS5wdXNoKGNodW5rKTtcbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIENvbm5lY3QgYmF0Y2ggQVBJIGFuZCBjcmVhdGUgc3RyZWFtIGluc3RhbmNlIG9mIHJlcXVlc3QvcmVzcG9uc2VcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge3N0cmVhbS5EdXBsZXh9XG4gKi9cbkJhdGNoLnByb3RvdHlwZS5fY3JlYXRlUmVxdWVzdFN0cmVhbSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYmF0Y2ggPSB0aGlzO1xuICB2YXIgYnVsayA9IGJhdGNoLl9idWxrO1xuICB2YXIgbG9nZ2VyID0gYnVsay5fbG9nZ2VyO1xuXG4gIHJldHVybiBidWxrLl9yZXF1ZXN0KHtcbiAgICBtZXRob2QgOiAnUE9TVCcsXG4gICAgcGF0aCA6IFwiL2pvYi9cIiArIGJhdGNoLmpvYi5pZCArIFwiL2JhdGNoXCIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L2NzdlwiXG4gICAgfSxcbiAgICByZXNwb25zZVR5cGU6IFwiYXBwbGljYXRpb24veG1sXCJcbiAgfSwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBiYXRjaC5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhyZXMuYmF0Y2hJbmZvKTtcbiAgICAgIGJhdGNoLmlkID0gcmVzLmJhdGNoSW5mby5pZDtcbiAgICAgIGJhdGNoLmVtaXQoJ3F1ZXVlJywgcmVzLmJhdGNoSW5mbyk7XG4gICAgfVxuICB9KS5zdHJlYW0oKTtcbn07XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgV3JpdGFibGVcbiAqXG4gKiBAb3ZlcnJpZGVcbiAqIEBwcml2YXRlXG4gKi9cbkJhdGNoLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbihyZWNvcmQsIGVuYywgY2IpIHtcbiAgcmVjb3JkID0gXy5jbG9uZShyZWNvcmQpO1xuICBpZiAodGhpcy5qb2Iub3BlcmF0aW9uID09PSBcImluc2VydFwiKSB7XG4gICAgZGVsZXRlIHJlY29yZC5JZDtcbiAgfSBlbHNlIGlmICh0aGlzLmpvYi5vcGVyYXRpb24gPT09IFwiZGVsZXRlXCIpIHtcbiAgICByZWNvcmQgPSB7IElkOiByZWNvcmQuSWQgfTtcbiAgfVxuICBkZWxldGUgcmVjb3JkLnR5cGU7XG4gIGRlbGV0ZSByZWNvcmQuYXR0cmlidXRlcztcbiAgdGhpcy5fdXBsb2FkU3RyZWFtLndyaXRlKHJlY29yZCwgZW5jLCBjYik7XG59O1xuXG4vKipcbiAqIFJldHVybnMgZHVwbGV4IHN0cmVhbSB3aGljaCBhY2NlcHRzIENTViBkYXRhIGlucHV0IGFuZCBiYXRjaCByZXN1bHQgb3V0cHV0XG4gKlxuICogQHJldHVybnMge3N0cmVhbS5EdXBsZXh9XG4gKi9cbkJhdGNoLnByb3RvdHlwZS5zdHJlYW0gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2RhdGFTdHJlYW07XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgYmF0Y2ggb3BlcmF0aW9uXG4gKlxuICogQG1ldGhvZCBCdWxrfkJhdGNoI2V4ZWN1dGVcbiAqIEBwYXJhbSB7QXJyYXkuPFJlY29yZD58c3RyZWFtLlN0cmVhbXxTdHJpbmd9IFtpbnB1dF0gLSBJbnB1dCBzb3VyY2UgZm9yIGJhdGNoIG9wZXJhdGlvbi4gQWNjZXB0cyBhcnJheSBvZiByZWNvcmRzLCBDU1Ygc3RyaW5nLCBhbmQgQ1NWIGRhdGEgaW5wdXQgc3RyZWFtIGluIGluc2VydC91cGRhdGUvdXBzZXJ0L2RlbGV0ZS9oYXJkRGVsZXRlIG9wZXJhdGlvbiwgU09RTCBzdHJpbmcgaW4gcXVlcnkgb3BlcmF0aW9uLlxuICogQHBhcmFtIHtDYWxsYmFjay48QXJyYXkuPFJlY29yZFJlc3VsdD58QXJyYXkuPEJhdGNoUmVzdWx0SW5mbz4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtCdWxrfkJhdGNofVxuICovXG5CYXRjaC5wcm90b3R5cGUucnVuID1cbkJhdGNoLnByb3RvdHlwZS5leGVjID1cbkJhdGNoLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oaW5wdXQsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAodHlwZW9mIGlucHV0ID09PSAnZnVuY3Rpb24nKSB7IC8vIGlmIGlucHV0IGFyZ3VtZW50IGlzIG9taXR0ZWRcbiAgICBjYWxsYmFjayA9IGlucHV0O1xuICAgIGlucHV0ID0gbnVsbDtcbiAgfVxuXG4gIC8vIGlmIGJhdGNoIGlzIGFscmVhZHkgZXhlY3V0ZWRcbiAgaWYgKHRoaXMuX3Jlc3VsdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkJhdGNoIGFscmVhZHkgZXhlY3V0ZWQuXCIpO1xuICB9XG5cbiAgdmFyIHJkZWZlcnJlZCA9IFByb21pc2UuZGVmZXIoKTtcbiAgdGhpcy5fcmVzdWx0ID0gcmRlZmVycmVkLnByb21pc2U7XG4gIHRoaXMuX3Jlc3VsdC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgIHNlbGYuX2RlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgc2VsZi5fZGVmZXJyZWQucmVqZWN0KGVycik7XG4gIH0pO1xuICB0aGlzLm9uY2UoJ3Jlc3BvbnNlJywgZnVuY3Rpb24ocmVzKSB7XG4gICAgcmRlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgfSk7XG4gIHRoaXMub25jZSgnZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICByZGVmZXJyZWQucmVqZWN0KGVycik7XG4gIH0pO1xuXG4gIGlmIChfLmlzT2JqZWN0KGlucHV0KSAmJiBfLmlzRnVuY3Rpb24oaW5wdXQucGlwZSkpIHsgLy8gaWYgaW5wdXQgaGFzIHN0cmVhbS5SZWFkYWJsZSBpbnRlcmZhY2VcbiAgICBpbnB1dC5waXBlKHRoaXMuX2RhdGFTdHJlYW0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBkYXRhO1xuICAgIGlmIChfLmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICBfLmZvckVhY2goaW5wdXQsIGZ1bmN0aW9uKHJlY29yZCkgeyBzZWxmLndyaXRlKHJlY29yZCk7IH0pO1xuICAgICAgc2VsZi5lbmQoKTtcbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcoaW5wdXQpKXtcbiAgICAgIGRhdGEgPSBpbnB1dDtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0ud3JpdGUoZGF0YSwgJ3V0ZjgnKTtcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0uZW5kKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gcmV0dXJuIEJhdGNoIGluc3RhbmNlIGZvciBjaGFpbmluZ1xuICByZXR1cm4gdGhpcy50aGVuQ2FsbChjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIFByb21pc2UvQSsgaW50ZXJmYWNlXG4gKiBodHRwOi8vcHJvbWlzZXMtYXBsdXMuZ2l0aHViLmlvL3Byb21pc2VzLXNwZWMvXG4gKlxuICogRGVsZWdhdGUgdG8gZGVmZXJyZWQgcHJvbWlzZSwgcmV0dXJuIHByb21pc2UgaW5zdGFuY2UgZm9yIGJhdGNoIHJlc3VsdFxuICpcbiAqIEBtZXRob2QgQnVsa35CYXRjaCN0aGVuXG4gKi9cbkJhdGNoLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25SZXNvbHZlZCwgb25SZWplY3QsIG9uUHJvZ3Jlc3MpIHtcbiAgcmV0dXJuIHRoaXMuX2RlZmVycmVkLnByb21pc2UudGhlbihvblJlc29sdmVkLCBvblJlamVjdCwgb25Qcm9ncmVzcyk7XG59O1xuXG4vKipcbiAqIFByb21pc2UvQSsgZXh0ZW5zaW9uXG4gKiBDYWxsIFwidGhlblwiIHVzaW5nIGdpdmVuIG5vZGUtc3R5bGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAqXG4gKiBAbWV0aG9kIEJ1bGt+QmF0Y2gjdGhlbkNhbGxcbiAqL1xuQmF0Y2gucHJvdG90eXBlLnRoZW5DYWxsID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICB0aGlzLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEJ1bGt+QmF0Y2hJbmZvXG4gKiBAcHJvcCB7U3RyaW5nfSBpZCAtIEJhdGNoIElEXG4gKiBAcHJvcCB7U3RyaW5nfSBqb2JJZCAtIEpvYiBJRFxuICogQHByb3Age1N0cmluZ30gc3RhdGUgLSBCYXRjaCBzdGF0ZVxuICogQHByb3Age1N0cmluZ30gc3RhdGVNZXNzYWdlIC0gQmF0Y2ggc3RhdGUgbWVzc2FnZVxuICovXG5cbi8qKlxuICogQ2hlY2sgdGhlIGxhdGVzdCBiYXRjaCBzdGF0dXMgaW4gc2VydmVyXG4gKlxuICogQG1ldGhvZCBCdWxrfkJhdGNoI2NoZWNrXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxCdWxrfkJhdGNoSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMge1Byb21pc2UuPEJ1bGt+QmF0Y2hJbmZvPn1cbiAqL1xuQmF0Y2gucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYnVsayA9IHRoaXMuX2J1bGs7XG4gIHZhciBsb2dnZXIgPSBidWxrLl9sb2dnZXI7XG4gIHZhciBqb2JJZCA9IHRoaXMuam9iLmlkO1xuICB2YXIgYmF0Y2hJZCA9IHRoaXMuaWQ7XG5cbiAgaWYgKCFqb2JJZCB8fCAhYmF0Y2hJZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkJhdGNoIG5vdCBzdGFydGVkLlwiKTtcbiAgfVxuICByZXR1cm4gYnVsay5fcmVxdWVzdCh7XG4gICAgbWV0aG9kIDogJ0dFVCcsXG4gICAgcGF0aCA6IFwiL2pvYi9cIiArIGpvYklkICsgXCIvYmF0Y2gvXCIgKyBiYXRjaElkLFxuICAgIHJlc3BvbnNlVHlwZTogXCJhcHBsaWNhdGlvbi94bWxcIlxuICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgIGxvZ2dlci5kZWJ1ZyhyZXMuYmF0Y2hJbmZvKTtcbiAgICByZXR1cm4gcmVzLmJhdGNoSW5mbztcbiAgfSkudGhlbkNhbGwoY2FsbGJhY2spO1xufTtcblxuXG4vKipcbiAqIFBvbGxpbmcgdGhlIGJhdGNoIHJlc3VsdCBhbmQgcmV0cmlldmVcbiAqXG4gKiBAbWV0aG9kIEJ1bGt+QmF0Y2gjcG9sbFxuICogQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gUG9sbGluZyBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IC0gUG9sbGluZyB0aW1lb3V0IGluIG1pbGxpc2Vjb25kc1xuICovXG5CYXRjaC5wcm90b3R5cGUucG9sbCA9IGZ1bmN0aW9uKGludGVydmFsLCB0aW1lb3V0KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGpvYklkID0gdGhpcy5qb2IuaWQ7XG4gIHZhciBiYXRjaElkID0gdGhpcy5pZDtcblxuICBpZiAoIWpvYklkIHx8ICFiYXRjaElkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQmF0Y2ggbm90IHN0YXJ0ZWQuXCIpO1xuICB9XG4gIHZhciBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgdmFyIHBvbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKHN0YXJ0VGltZSArIHRpbWVvdXQgPCBub3cpIHtcbiAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJQb2xsaW5nIHRpbWUgb3V0LiBKb2IgSWQgPSBcIiArIGpvYklkICsgXCIgLCBiYXRjaCBJZCA9IFwiICsgYmF0Y2hJZCk7XG4gICAgICBlcnIubmFtZSA9ICdQb2xsaW5nVGltZW91dCc7XG4gICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZi5jaGVjayhmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXMuc3RhdGUgPT09IFwiRmFpbGVkXCIpIHtcbiAgICAgICAgICBpZiAocGFyc2VJbnQocmVzLm51bWJlclJlY29yZHNQcm9jZXNzZWQsIDEwKSA+IDApIHtcbiAgICAgICAgICAgIHNlbGYucmV0cmlldmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihyZXMuc3RhdGVNZXNzYWdlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlcy5zdGF0ZSA9PT0gXCJDb21wbGV0ZWRcIikge1xuICAgICAgICAgIHNlbGYucmV0cmlldmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLmVtaXQoJ3Byb2dyZXNzJywgcmVzKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KHBvbGwsIGludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBzZXRUaW1lb3V0KHBvbGwsIGludGVydmFsKTtcbn07XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gQnVsa35CYXRjaFJlc3VsdEluZm9cbiAqIEBwcm9wIHtTdHJpbmd9IGlkIC0gQmF0Y2ggcmVzdWx0IElEXG4gKiBAcHJvcCB7U3RyaW5nfSBiYXRjaElkIC0gQmF0Y2ggSUQgd2hpY2ggaW5jbHVkZXMgdGhpcyBiYXRjaCByZXN1bHQuXG4gKiBAcHJvcCB7U3RyaW5nfSBqb2JJZCAtIEpvYiBJRCB3aGljaCBpbmNsdWRlcyB0aGlzIGJhdGNoIHJlc3VsdC5cbiAqL1xuXG4vKipcbiAqIFJldHJpZXZlIGJhdGNoIHJlc3VsdFxuICpcbiAqIEBtZXRob2QgQnVsa35CYXRjaCNyZXRyaWV2ZVxuICogQHBhcmFtIHtDYWxsYmFjay48QXJyYXkuPFJlY29yZFJlc3VsdD58QXJyYXkuPEJ1bGt+QmF0Y2hSZXN1bHRJbmZvPj59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMge1Byb21pc2UuPEFycmF5LjxSZWNvcmRSZXN1bHQ+fEFycmF5LjxCdWxrfkJhdGNoUmVzdWx0SW5mbz4+fVxuICovXG5CYXRjaC5wcm90b3R5cGUucmV0cmlldmUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBidWxrID0gdGhpcy5fYnVsaztcbiAgdmFyIGpvYklkID0gdGhpcy5qb2IuaWQ7XG4gIHZhciBqb2IgPSB0aGlzLmpvYjtcbiAgdmFyIGJhdGNoSWQgPSB0aGlzLmlkO1xuXG4gIGlmICgham9iSWQgfHwgIWJhdGNoSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaCBub3Qgc3RhcnRlZC5cIik7XG4gIH1cblxuICByZXR1cm4gam9iLmluZm8oKS50aGVuKGZ1bmN0aW9uKGpvYkluZm8pIHtcbiAgICByZXR1cm4gYnVsay5fcmVxdWVzdCh7XG4gICAgICBtZXRob2QgOiAnR0VUJyxcbiAgICAgIHBhdGggOiBcIi9qb2IvXCIgKyBqb2JJZCArIFwiL2JhdGNoL1wiICsgYmF0Y2hJZCArIFwiL3Jlc3VsdFwiXG4gICAgfSk7XG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgdmFyIHJlc3VsdHM7XG4gICAgaWYgKGpvYi5vcGVyYXRpb24gPT09ICdxdWVyeScpIHtcbiAgICAgIHZhciBjb25uID0gYnVsay5fY29ubjtcbiAgICAgIHZhciByZXN1bHRJZHMgPSByZXNbJ3Jlc3VsdC1saXN0J10ucmVzdWx0O1xuICAgICAgcmVzdWx0cyA9IHJlc1sncmVzdWx0LWxpc3QnXS5yZXN1bHQ7XG4gICAgICByZXN1bHRzID0gXy5tYXAoXy5pc0FycmF5KHJlc3VsdHMpID8gcmVzdWx0cyA6IFsgcmVzdWx0cyBdLCBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICBiYXRjaElkOiBiYXRjaElkLFxuICAgICAgICAgIGpvYklkOiBqb2JJZFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdHMgPSBfLm1hcChyZXMsIGZ1bmN0aW9uKHJldCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiByZXQuSWQgfHwgbnVsbCxcbiAgICAgICAgICBzdWNjZXNzOiByZXQuU3VjY2VzcyA9PT0gXCJ0cnVlXCIsXG4gICAgICAgICAgZXJyb3JzOiByZXQuRXJyb3IgPyBbIHJldC5FcnJvciBdIDogW11cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzdWx0cyk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH0pLmZhaWwoZnVuY3Rpb24oZXJyKSB7XG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgdGhyb3cgZXJyO1xuICB9KS50aGVuQ2FsbChjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIEZldGNoIHF1ZXJ5IHJlc3VsdCBhcyBhIHJlY29yZCBzdHJlYW1cbiAqIEBwYXJhbSB7U3RyaW5nfSByZXN1bHRJZCAtIFJlc3VsdCBpZFxuICogQHJldHVybnMge1JlY29yZFN0cmVhbX0gLSBSZWNvcmQgc3RyZWFtLCBjb252ZXJ0aWJsZSB0byBDU1YgZGF0YSBzdHJlYW1cbiAqL1xuQmF0Y2gucHJvdG90eXBlLnJlc3VsdCA9IGZ1bmN0aW9uKHJlc3VsdElkKSB7XG4gIHZhciBqb2JJZCA9IHRoaXMuam9iLmlkO1xuICB2YXIgYmF0Y2hJZCA9IHRoaXMuaWQ7XG4gIGlmICgham9iSWQgfHwgIWJhdGNoSWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaCBub3Qgc3RhcnRlZC5cIik7XG4gIH1cbiAgdmFyIHJlc3VsdFN0cmVhbSA9IG5ldyBSZWNvcmRTdHJlYW0uUGFyc2FibGUoKTtcbiAgdmFyIHJlc3VsdERhdGFTdHJlYW0gPSByZXN1bHRTdHJlYW0uc3RyZWFtKCdjc3YnKTtcbiAgdmFyIHJlcVN0cmVhbSA9IHRoaXMuX2J1bGsuX3JlcXVlc3Qoe1xuICAgIG1ldGhvZCA6ICdHRVQnLFxuICAgIHBhdGggOiBcIi9qb2IvXCIgKyBqb2JJZCArIFwiL2JhdGNoL1wiICsgYmF0Y2hJZCArIFwiL3Jlc3VsdC9cIiArIHJlc3VsdElkLFxuICAgIHJlc3BvbnNlVHlwZTogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIlxuICB9KS5zdHJlYW0oKS5waXBlKHJlc3VsdERhdGFTdHJlYW0pO1xuICByZXR1cm4gcmVzdWx0U3RyZWFtO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBCdWxrQXBpID0gZnVuY3Rpb24oKSB7XG4gIEJ1bGtBcGkuc3VwZXJfLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5pbmhlcml0cyhCdWxrQXBpLCBIdHRwQXBpKTtcblxuQnVsa0FwaS5wcm90b3R5cGUuYmVmb3JlU2VuZCA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgcmVxdWVzdC5oZWFkZXJzID0gcmVxdWVzdC5oZWFkZXJzIHx8IHt9O1xuICByZXF1ZXN0LmhlYWRlcnNbXCJYLVNGREMtU0VTU0lPTlwiXSA9IHRoaXMuX2Nvbm4uYWNjZXNzVG9rZW47XG59O1xuXG5CdWxrQXBpLnByb3RvdHlwZS5pc1Nlc3Npb25FeHBpcmVkID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDQwMCAmJlxuICAgIC88ZXhjZXB0aW9uQ29kZT5JbnZhbGlkU2Vzc2lvbklkPFxcL2V4Y2VwdGlvbkNvZGU+Ly50ZXN0KHJlc3BvbnNlLmJvZHkpO1xufTtcblxuQnVsa0FwaS5wcm90b3R5cGUuaGFzRXJyb3JJblJlc3BvbnNlQm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgcmV0dXJuICEhYm9keS5lcnJvcjtcbn07XG5cbkJ1bGtBcGkucHJvdG90eXBlLnBhcnNlRXJyb3IgPSBmdW5jdGlvbihib2R5KSB7XG4gIHJldHVybiB7XG4gICAgZXJyb3JDb2RlOiBib2R5LmVycm9yLmV4Y2VwdGlvbkNvZGUsXG4gICAgbWVzc2FnZTogYm9keS5lcnJvci5leGNlcHRpb25NZXNzYWdlXG4gIH07XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG4gKiBDbGFzcyBmb3IgQnVsayBBUElcbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7Q29ubmVjdGlvbn0gY29ubiAtIENvbm5lY3Rpb24gb2JqZWN0XG4gKi9cbnZhciBCdWxrID0gZnVuY3Rpb24oY29ubikge1xuICB0aGlzLl9jb25uID0gY29ubjtcbiAgdGhpcy5fbG9nZ2VyID0gY29ubi5fbG9nZ2VyO1xufTtcblxuLyoqXG4gKiBQb2xsaW5nIGludGVydmFsIGluIG1pbGxpc2Vjb25kc1xuICogQHR5cGUge051bWJlcn1cbiAqL1xuQnVsay5wcm90b3R5cGUucG9sbEludGVydmFsID0gMTAwMDtcblxuLyoqXG4gKiBQb2xsaW5nIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG5CdWxrLnByb3RvdHlwZS5wb2xsVGltZW91dCA9IDEwMDAwO1xuXG4vKiogQHByaXZhdGUgKiovXG5CdWxrLnByb3RvdHlwZS5fcmVxdWVzdCA9IGZ1bmN0aW9uKHJlcXVlc3QsIGNhbGxiYWNrKSB7XG4gIHZhciBjb25uID0gdGhpcy5fY29ubjtcbiAgcmVxdWVzdCA9IF8uY2xvbmUocmVxdWVzdCk7XG4gIHZhciBiYXNlVXJsID0gWyBjb25uLmluc3RhbmNlVXJsLCBcInNlcnZpY2VzL2FzeW5jXCIsIGNvbm4udmVyc2lvbiBdLmpvaW4oJy8nKTtcbiAgcmVxdWVzdC51cmwgPSBiYXNlVXJsICsgcmVxdWVzdC5wYXRoO1xuICB2YXIgb3B0aW9ucyA9IHsgcmVzcG9uc2VUeXBlOiByZXF1ZXN0LnJlc3BvbnNlVHlwZSB9O1xuICBkZWxldGUgcmVxdWVzdC5wYXRoO1xuICBkZWxldGUgcmVxdWVzdC5yZXNwb25zZVR5cGU7XG4gIHJldHVybiBuZXcgQnVsa0FwaSh0aGlzLl9jb25uLCBvcHRpb25zKS5yZXF1ZXN0KHJlcXVlc3QpLnRoZW5DYWxsKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBzdGFydCBidWxrbG9hZCBqb2IgYW5kIGJhdGNoXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBTT2JqZWN0IHR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcGVyYXRpb24gLSBCdWxrIGxvYWQgb3BlcmF0aW9uICgnaW5zZXJ0JywgJ3VwZGF0ZScsICd1cHNlcnQnLCAnZGVsZXRlJywgb3IgJ2hhcmREZWxldGUnKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIE9wdGlvbnMgZm9yIGJ1bGsgbG9hZGluZyBvcGVyYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5leHRJZEZpZWxkXSAtIEV4dGVybmFsIElEIGZpZWxkIG5hbWUgKHVzZWQgd2hlbiB1cHNlcnQgb3BlcmF0aW9uKS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb25jdXJyZW5jeU1vZGVdIC0gJ1NlcmlhbCcgb3IgJ1BhcmFsbGVsJy4gRGVmYXVsdHMgdG8gUGFyYWxsZWwuXG4gKiBAcGFyYW0ge0FycmF5LjxSZWNvcmQ+fHN0cmVhbS5TdHJlYW18U3RyaW5nfSBbaW5wdXRdIC0gSW5wdXQgc291cmNlIGZvciBidWxrbG9hZC4gQWNjZXB0cyBhcnJheSBvZiByZWNvcmRzLCBDU1Ygc3RyaW5nLCBhbmQgQ1NWIGRhdGEgaW5wdXQgc3RyZWFtIGluIGluc2VydC91cGRhdGUvdXBzZXJ0L2RlbGV0ZS9oYXJkRGVsZXRlIG9wZXJhdGlvbiwgU09RTCBzdHJpbmcgaW4gcXVlcnkgb3BlcmF0aW9uLlxuICogQHBhcmFtIHtDYWxsYmFjay48QXJyYXkuPFJlY29yZFJlc3VsdD58QXJyYXkuPEJ1bGt+QmF0Y2hSZXN1bHRJbmZvPj59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMge0J1bGt+QmF0Y2h9XG4gKi9cbkJ1bGsucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbih0eXBlLCBvcGVyYXRpb24sIG9wdGlvbnMsIGlucHV0LCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICghdHlwZSB8fCAhb3BlcmF0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW5zdWZmaWNpZW50IGFyZ3VtZW50cy4gQXQgbGVhc3QsICd0eXBlJyBhbmQgJ29wZXJhdGlvbicgYXJlIHJlcXVpcmVkLlwiKTtcbiAgfVxuICBpZiAoIV8uaXNPYmplY3Qob3B0aW9ucykgfHwgb3B0aW9ucy5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KSB7IC8vIHdoZW4gb3B0aW9ucyBpcyBub3QgcGxhaW4gaGFzaCBvYmplY3QsIGl0IGlzIG9taXR0ZWRcbiAgICBjYWxsYmFjayA9IGlucHV0O1xuICAgIGlucHV0ID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuICB2YXIgam9iID0gdGhpcy5jcmVhdGVKb2IodHlwZSwgb3BlcmF0aW9uLCBvcHRpb25zKTtcbiAgam9iLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgaWYgKGJhdGNoKSB7XG4gICAgICBiYXRjaC5lbWl0KCdlcnJvcicsIGVycm9yKTsgLy8gcGFzcyBqb2IgZXJyb3IgdG8gYmF0Y2hcbiAgICB9XG4gIH0pO1xuICB2YXIgYmF0Y2ggPSBqb2IuY3JlYXRlQmF0Y2goKTtcbiAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgICBiYXRjaCA9IG51bGw7XG4gICAgam9iLmNsb3NlKCk7XG4gIH07XG4gIHZhciBjbGVhbnVwT25FcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIubmFtZSAhPT0gJ1BvbGxpbmdUaW1lb3V0Jykge1xuICAgICAgY2xlYW51cCgpO1xuICAgIH1cbiAgfTtcbiAgYmF0Y2gub24oJ3Jlc3BvbnNlJywgY2xlYW51cCk7XG4gIGJhdGNoLm9uKCdlcnJvcicsIGNsZWFudXBPbkVycm9yKTtcbiAgYmF0Y2gub24oJ3F1ZXVlJywgZnVuY3Rpb24oKSB7IGJhdGNoLnBvbGwoc2VsZi5wb2xsSW50ZXJ2YWwsIHNlbGYucG9sbFRpbWVvdXQpOyB9KTtcbiAgcmV0dXJuIGJhdGNoLmV4ZWN1dGUoaW5wdXQsIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogRXhlY3V0ZSBidWxrIHF1ZXJ5IGFuZCBnZXQgcmVjb3JkIHN0cmVhbVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzb3FsIC0gU09RTCB0byBleGVjdXRlIGluIGJ1bGsgam9iXG4gKiBAcmV0dXJucyB7UmVjb3JkU3RyZWFtLlBhcnNhYmxlfSAtIFJlY29yZCBzdHJlYW0sIGNvbnZlcnRpYmxlIHRvIENTViBkYXRhIHN0cmVhbVxuICovXG5CdWxrLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHNvcWwpIHtcbiAgdmFyIG0gPSBzb3FsLnJlcGxhY2UoL1xcKFtcXHNcXFNdK1xcKS9nLCAnJykubWF0Y2goL0ZST01cXHMrKFxcdyspL2kpO1xuICBpZiAoIW0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzb2JqZWN0IHR5cGUgZm91bmQgaW4gcXVlcnksIG1heWJlIGNhdXNlZCBieSBpbnZhbGlkIFNPUUwuXCIpO1xuICB9XG4gIHZhciB0eXBlID0gbVsxXTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgcmVjb3JkU3RyZWFtID0gbmV3IFJlY29yZFN0cmVhbS5QYXJzYWJsZSgpO1xuICB2YXIgZGF0YVN0cmVhbSA9IHJlY29yZFN0cmVhbS5zdHJlYW0oJ2NzdicpO1xuICB0aGlzLmxvYWQodHlwZSwgXCJxdWVyeVwiLCBzb3FsKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICB2YXIgc3RyZWFtcyA9IHJlc3VsdHMubWFwKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIHNlbGZcbiAgICAgICAgLmpvYihyZXN1bHQuam9iSWQpXG4gICAgICAgIC5iYXRjaChyZXN1bHQuYmF0Y2hJZClcbiAgICAgICAgLnJlc3VsdChyZXN1bHQuaWQpXG4gICAgICAgIC5zdHJlYW0oKTtcbiAgICB9KTtcblxuICAgIGpvaW5TdHJlYW1zKHN0cmVhbXMpLnBpcGUoZGF0YVN0cmVhbSk7XG4gIH0pLmZhaWwoZnVuY3Rpb24oZXJyKSB7XG4gICAgcmVjb3JkU3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfSk7XG4gIHJldHVybiByZWNvcmRTdHJlYW07XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGpvYiBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU09iamVjdCB0eXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gb3BlcmF0aW9uIC0gQnVsayBsb2FkIG9wZXJhdGlvbiAoJ2luc2VydCcsICd1cGRhdGUnLCAndXBzZXJ0JywgJ2RlbGV0ZScsICdoYXJkRGVsZXRlJywgb3IgJ3F1ZXJ5JylcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBPcHRpb25zIGZvciBidWxrIGxvYWRpbmcgb3BlcmF0aW9uXG4gKiBAcmV0dXJucyB7QnVsa35Kb2J9XG4gKi9cbkJ1bGsucHJvdG90eXBlLmNyZWF0ZUpvYiA9IGZ1bmN0aW9uKHR5cGUsIG9wZXJhdGlvbiwgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IEpvYih0aGlzLCB0eXBlLCBvcGVyYXRpb24sIG9wdGlvbnMpO1xufTtcblxuLyoqXG4gKiBHZXQgYSBqb2IgaW5zdGFuY2Ugc3BlY2lmaWVkIGJ5IGdpdmVuIGpvYiBJRFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBqb2JJZCAtIEpvYiBJRFxuICogQHJldHVybnMge0J1bGt+Sm9ifVxuICovXG5CdWxrLnByb3RvdHlwZS5qb2IgPSBmdW5jdGlvbihqb2JJZCkge1xuICByZXR1cm4gbmV3IEpvYih0aGlzLCBudWxsLCBudWxsLCBudWxsLCBqb2JJZCk7XG59O1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLypcbiAqIFJlZ2lzdGVyIGhvb2sgaW4gY29ubmVjdGlvbiBpbnN0YW50aWF0aW9uIGZvciBkeW5hbWljYWxseSBhZGRpbmcgdGhpcyBBUEkgbW9kdWxlIGZlYXR1cmVzXG4gKi9cbmpzZm9yY2Uub24oJ2Nvbm5lY3Rpb246bmV3JywgZnVuY3Rpb24oY29ubikge1xuICBjb25uLmJ1bGsgPSBuZXcgQnVsayhjb25uKTtcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQnVsaztcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIl19
