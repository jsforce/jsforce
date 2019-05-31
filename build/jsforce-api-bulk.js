(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Bulk = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
 * @method Bulk~Job#info
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
      _.forEach(input, function(record) {
        Object.keys(record).forEach(function(key) {
          if (typeof record[key] === 'boolean') {
            record[key] = String(record[key])
          }
        })
        self.write(record);
      });
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
      err.jobId = jobId;
      err.batchId = batchId;
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

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
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
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL2J1bGsuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKmdsb2JhbCBwcm9jZXNzKi9cclxuLyoqXHJcbiAqIEBmaWxlIE1hbmFnZXMgU2FsZXNmb3JjZSBCdWxrIEFQSSByZWxhdGVkIG9wZXJhdGlvbnNcclxuICogQGF1dGhvciBTaGluaWNoaSBUb21pdGEgPHNoaW5pY2hpLnRvbWl0YUBnbWFpbC5jb20+XHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGluaGVyaXRzICAgICA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJ2luaGVyaXRzJyksXHJcbiAgICBzdHJlYW0gICAgICAgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdyZWFkYWJsZS1zdHJlYW0nKSxcclxuICAgIER1cGxleCAgICAgICA9IHN0cmVhbS5EdXBsZXgsXHJcbiAgICBldmVudHMgICAgICAgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdldmVudHMnKSxcclxuICAgIF8gICAgICAgICAgICA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJ2xvZGFzaC9jb3JlJyksXHJcbiAgICBqb2luU3RyZWFtcyAgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdtdWx0aXN0cmVhbScpLFxyXG4gICAganNmb3JjZSAgICAgID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9jb3JlJyksXHJcbiAgICBSZWNvcmRTdHJlYW0gPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCcuL3JlY29yZC1zdHJlYW0nKSxcclxuICAgIFByb21pc2UgICAgICA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vcHJvbWlzZScpLFxyXG4gICAgSHR0cEFwaSAgICAgID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9odHRwLWFwaScpO1xyXG5cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIEJ1bGsgQVBJIEpvYlxyXG4gKlxyXG4gKiBAcHJvdGVjdGVkXHJcbiAqIEBjbGFzcyBCdWxrfkpvYlxyXG4gKiBAZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyXHJcbiAqXHJcbiAqIEBwYXJhbSB7QnVsa30gYnVsayAtIEJ1bGsgQVBJIG9iamVjdFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW3R5cGVdIC0gU09iamVjdCB0eXBlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3BlcmF0aW9uXSAtIEJ1bGsgbG9hZCBvcGVyYXRpb24gKCdpbnNlcnQnLCAndXBkYXRlJywgJ3Vwc2VydCcsICdkZWxldGUnLCBvciAnaGFyZERlbGV0ZScpXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBPcHRpb25zIGZvciBidWxrIGxvYWRpbmcgb3BlcmF0aW9uXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5leHRJZEZpZWxkXSAtIEV4dGVybmFsIElEIGZpZWxkIG5hbWUgKHVzZWQgd2hlbiB1cHNlcnQgb3BlcmF0aW9uKS5cclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbmN1cnJlbmN5TW9kZV0gLSAnU2VyaWFsJyBvciAnUGFyYWxsZWwnLiBEZWZhdWx0cyB0byBQYXJhbGxlbC5cclxuICogQHBhcmFtIHtTdHJpbmd9IFtqb2JJZF0gLSBKb2IgSUQgKGlmIGFscmVhZHkgYXZhaWxhYmxlKVxyXG4gKi9cclxudmFyIEpvYiA9IGZ1bmN0aW9uKGJ1bGssIHR5cGUsIG9wZXJhdGlvbiwgb3B0aW9ucywgam9iSWQpIHtcclxuICB0aGlzLl9idWxrID0gYnVsaztcclxuICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gIHRoaXMub3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgdGhpcy5pZCA9IGpvYklkO1xyXG4gIHRoaXMuc3RhdGUgPSB0aGlzLmlkID8gJ09wZW4nIDogJ1Vua25vd24nO1xyXG4gIHRoaXMuX2JhdGNoZXMgPSB7fTtcclxufTtcclxuXHJcbmluaGVyaXRzKEpvYiwgZXZlbnRzLkV2ZW50RW1pdHRlcik7XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gQnVsa35Kb2JJbmZvXHJcbiAqIEBwcm9wIHtTdHJpbmd9IGlkIC0gSm9iIElEXHJcbiAqIEBwcm9wIHtTdHJpbmd9IG9iamVjdCAtIE9iamVjdCB0eXBlIG5hbWVcclxuICogQHByb3Age1N0cmluZ30gb3BlcmF0aW9uIC0gT3BlcmF0aW9uIHR5cGUgb2YgdGhlIGpvYlxyXG4gKiBAcHJvcCB7U3RyaW5nfSBzdGF0ZSAtIEpvYiBzdGF0dXNcclxuICovXHJcblxyXG4vKipcclxuICogUmV0dXJuIGxhdGVzdCBqb2JJbmZvIGZyb20gY2FjaGVcclxuICpcclxuICogQG1ldGhvZCBCdWxrfkpvYiNpbmZvXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEJ1bGt+Sm9iSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QnVsa35Kb2JJbmZvPn1cclxuICovXHJcbkpvYi5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIC8vIGlmIGNhY2hlIGlzIG5vdCBhdmFpbGFibGUsIGNoZWNrIHRoZSBsYXRlc3RcclxuICBpZiAoIXRoaXMuX2pvYkluZm8pIHtcclxuICAgIHRoaXMuX2pvYkluZm8gPSB0aGlzLmNoZWNrKCk7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLl9qb2JJbmZvLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBPcGVuIG5ldyBqb2IgYW5kIGdldCBqb2JpbmZvXHJcbiAqXHJcbiAqIEBtZXRob2QgQnVsa35Kb2Ijb3BlblxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxCdWxrfkpvYkluZm8+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEJ1bGt+Sm9iSW5mbz59XHJcbiAqL1xyXG5Kb2IucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICB2YXIgYnVsayA9IHRoaXMuX2J1bGs7XHJcbiAgdmFyIGxvZ2dlciA9IGJ1bGsuX2xvZ2dlcjtcclxuXHJcbiAgLy8gaWYgbm90IHJlcXVlc3RlZCBvcGVuaW5nIGpvYlxyXG4gIGlmICghdGhpcy5fam9iSW5mbykge1xyXG4gICAgdmFyIG9wZXJhdGlvbiA9IHRoaXMub3BlcmF0aW9uLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAob3BlcmF0aW9uID09PSAnaGFyZGRlbGV0ZScpIHsgb3BlcmF0aW9uID0gJ2hhcmREZWxldGUnOyB9XHJcbiAgICB2YXIgYm9keSA9IFtcclxuICAgICAgJzw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/PicsXHJcbiAgICAgICc8am9iSW5mbyAgeG1sbnM9XCJodHRwOi8vd3d3LmZvcmNlLmNvbS8yMDA5LzA2L2FzeW5jYXBpL2RhdGFsb2FkXCI+JyxcclxuICAgICAgICAnPG9wZXJhdGlvbj4nICsgb3BlcmF0aW9uICsgJzwvb3BlcmF0aW9uPicsXHJcbiAgICAgICAgJzxvYmplY3Q+JyArIHRoaXMudHlwZSArICc8L29iamVjdD4nLFxyXG4gICAgICAgICh0aGlzLm9wdGlvbnMuZXh0SWRGaWVsZCA/XHJcbiAgICAgICAgICc8ZXh0ZXJuYWxJZEZpZWxkTmFtZT4nK3RoaXMub3B0aW9ucy5leHRJZEZpZWxkKyc8L2V4dGVybmFsSWRGaWVsZE5hbWU+JyA6XHJcbiAgICAgICAgICcnKSxcclxuICAgICAgICAodGhpcy5vcHRpb25zLmNvbmN1cnJlbmN5TW9kZSA/XHJcbiAgICAgICAgICc8Y29uY3VycmVuY3lNb2RlPicrdGhpcy5vcHRpb25zLmNvbmN1cnJlbmN5TW9kZSsnPC9jb25jdXJyZW5jeU1vZGU+JyA6XHJcbiAgICAgICAgICcnKSxcclxuICAgICAgICAodGhpcy5vcHRpb25zLmFzc2lnbm1lbnRSdWxlSWQgP1xyXG4gICAgICAgICAgJzxhc3NpZ25tZW50UnVsZUlkPicgKyB0aGlzLm9wdGlvbnMuYXNzaWdubWVudFJ1bGVJZCArICc8L2Fzc2lnbm1lbnRSdWxlSWQ+JyA6XHJcbiAgICAgICAgICAnJyksXHJcbiAgICAgICAgJzxjb250ZW50VHlwZT5DU1Y8L2NvbnRlbnRUeXBlPicsXHJcbiAgICAgICc8L2pvYkluZm8+J1xyXG4gICAgXS5qb2luKCcnKTtcclxuXHJcbiAgICB0aGlzLl9qb2JJbmZvID0gYnVsay5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZCA6ICdQT1NUJyxcclxuICAgICAgcGF0aCA6IFwiL2pvYlwiLFxyXG4gICAgICBib2R5IDogYm9keSxcclxuICAgICAgaGVhZGVycyA6IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLThcIlxyXG4gICAgICB9LFxyXG4gICAgICByZXNwb25zZVR5cGU6IFwiYXBwbGljYXRpb24veG1sXCJcclxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgIHNlbGYuZW1pdChcIm9wZW5cIiwgcmVzLmpvYkluZm8pO1xyXG4gICAgICBzZWxmLmlkID0gcmVzLmpvYkluZm8uaWQ7XHJcbiAgICAgIHNlbGYuc3RhdGUgPSByZXMuam9iSW5mby5zdGF0ZTtcclxuICAgICAgcmV0dXJuIHJlcy5qb2JJbmZvO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgIHNlbGYuZW1pdChcImVycm9yXCIsIGVycik7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5fam9iSW5mby50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IGJhdGNoIGluc3RhbmNlIGluIHRoZSBqb2JcclxuICpcclxuICogQG1ldGhvZCBCdWxrfkpvYiNjcmVhdGVCYXRjaFxyXG4gKiBAcmV0dXJucyB7QnVsa35CYXRjaH1cclxuICovXHJcbkpvYi5wcm90b3R5cGUuY3JlYXRlQmF0Y2ggPSBmdW5jdGlvbigpIHtcclxuICB2YXIgYmF0Y2ggPSBuZXcgQmF0Y2godGhpcyk7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIGJhdGNoLm9uKCdxdWV1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgc2VsZi5fYmF0Y2hlc1tiYXRjaC5pZF0gPSBiYXRjaDtcclxuICB9KTtcclxuICByZXR1cm4gYmF0Y2g7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGEgYmF0Y2ggaW5zdGFuY2Ugc3BlY2lmaWVkIGJ5IGdpdmVuIGJhdGNoIElEXHJcbiAqXHJcbiAqIEBtZXRob2QgQnVsa35Kb2IjYmF0Y2hcclxuICogQHBhcmFtIHtTdHJpbmd9IGJhdGNoSWQgLSBCYXRjaCBJRFxyXG4gKiBAcmV0dXJucyB7QnVsa35CYXRjaH1cclxuICovXHJcbkpvYi5wcm90b3R5cGUuYmF0Y2ggPSBmdW5jdGlvbihiYXRjaElkKSB7XHJcbiAgdmFyIGJhdGNoID0gdGhpcy5fYmF0Y2hlc1tiYXRjaElkXTtcclxuICBpZiAoIWJhdGNoKSB7XHJcbiAgICBiYXRjaCA9IG5ldyBCYXRjaCh0aGlzLCBiYXRjaElkKTtcclxuICAgIHRoaXMuX2JhdGNoZXNbYmF0Y2hJZF0gPSBiYXRjaDtcclxuICB9XHJcbiAgcmV0dXJuIGJhdGNoO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIHRoZSBsYXRlc3Qgam9iIHN0YXR1cyBmcm9tIHNlcnZlclxyXG4gKlxyXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI2NoZWNrXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEJ1bGt+Sm9iSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QnVsa35Kb2JJbmZvPn1cclxuICovXHJcbkpvYi5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICB2YXIgYnVsayA9IHRoaXMuX2J1bGs7XHJcbiAgdmFyIGxvZ2dlciA9IGJ1bGsuX2xvZ2dlcjtcclxuXHJcbiAgdGhpcy5fam9iSW5mbyA9IHRoaXMuX3dhaXRBc3NpZ24oKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIGJ1bGsuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2QgOiAnR0VUJyxcclxuICAgICAgcGF0aCA6IFwiL2pvYi9cIiArIHNlbGYuaWQsXHJcbiAgICAgIHJlc3BvbnNlVHlwZTogXCJhcHBsaWNhdGlvbi94bWxcIlxyXG4gICAgfSk7XHJcbiAgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcclxuICAgIGxvZ2dlci5kZWJ1ZyhyZXMuam9iSW5mbyk7XHJcbiAgICBzZWxmLmlkID0gcmVzLmpvYkluZm8uaWQ7XHJcbiAgICBzZWxmLnR5cGUgPSByZXMuam9iSW5mby5vYmplY3Q7XHJcbiAgICBzZWxmLm9wZXJhdGlvbiA9IHJlcy5qb2JJbmZvLm9wZXJhdGlvbjtcclxuICAgIHNlbGYuc3RhdGUgPSByZXMuam9iSW5mby5zdGF0ZTtcclxuICAgIHJldHVybiByZXMuam9iSW5mbztcclxuICB9KTtcclxuICByZXR1cm4gdGhpcy5fam9iSW5mby50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogV2FpdCB0aWxsIHRoZSBqb2IgaXMgYXNzaWduZWQgdG8gc2VydmVyXHJcbiAqXHJcbiAqIEBtZXRob2QgQnVsa35Kb2IjaW5mb1xyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxCdWxrfkpvYkluZm8+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEJ1bGt+Sm9iSW5mbz59XHJcbiAqL1xyXG5Kb2IucHJvdG90eXBlLl93YWl0QXNzaWduID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICByZXR1cm4gKHRoaXMuaWQgPyBQcm9taXNlLnJlc29sdmUoeyBpZDogdGhpcy5pZCB9KSA6IHRoaXMub3BlbigpKS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIExpc3QgYWxsIHJlZ2lzdGVyZWQgYmF0Y2ggaW5mbyBpbiBqb2JcclxuICpcclxuICogQG1ldGhvZCBCdWxrfkpvYiNsaXN0XHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFycmF5LjxCdWxrfkJhdGNoSW5mbz4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEFycmF5LjxCdWxrfkJhdGNoSW5mbz4+fVxyXG4gKi9cclxuSm9iLnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdmFyIGJ1bGsgPSB0aGlzLl9idWxrO1xyXG4gIHZhciBsb2dnZXIgPSBidWxrLl9sb2dnZXI7XHJcblxyXG4gIHJldHVybiB0aGlzLl93YWl0QXNzaWduKCkudGhlbihmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBidWxrLl9yZXF1ZXN0KHtcclxuICAgICAgbWV0aG9kIDogJ0dFVCcsXHJcbiAgICAgIHBhdGggOiBcIi9qb2IvXCIgKyBzZWxmLmlkICsgXCIvYmF0Y2hcIixcclxuICAgICAgcmVzcG9uc2VUeXBlOiBcImFwcGxpY2F0aW9uL3htbFwiXHJcbiAgICB9KTtcclxuICB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xyXG4gICAgbG9nZ2VyLmRlYnVnKHJlcy5iYXRjaEluZm9MaXN0LmJhdGNoSW5mbyk7XHJcbiAgICB2YXIgYmF0Y2hJbmZvTGlzdCA9IHJlcy5iYXRjaEluZm9MaXN0O1xyXG4gICAgYmF0Y2hJbmZvTGlzdCA9IF8uaXNBcnJheShiYXRjaEluZm9MaXN0LmJhdGNoSW5mbykgPyBiYXRjaEluZm9MaXN0LmJhdGNoSW5mbyA6IFsgYmF0Y2hJbmZvTGlzdC5iYXRjaEluZm8gXTtcclxuICAgIHJldHVybiBiYXRjaEluZm9MaXN0O1xyXG4gIH0pLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2Ugb3BlbmVkIGpvYlxyXG4gKlxyXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI2Nsb3NlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEJ1bGt+Sm9iSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QnVsa35Kb2JJbmZvPn1cclxuICovXHJcbkpvYi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgcmV0dXJuIHRoaXMuX2NoYW5nZVN0YXRlKFwiQ2xvc2VkXCIpLnRoZW4oZnVuY3Rpb24oam9iSW5mbykge1xyXG4gICAgc2VsZi5pZCA9IG51bGw7XHJcbiAgICBzZWxmLmVtaXQoXCJjbG9zZVwiLCBqb2JJbmZvKTtcclxuICAgIHJldHVybiBqb2JJbmZvO1xyXG4gIH0sIGZ1bmN0aW9uKGVycikge1xyXG4gICAgc2VsZi5lbWl0KFwiZXJyb3JcIiwgZXJyKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHN0YXR1cyB0byBhYm9ydFxyXG4gKlxyXG4gKiBAbWV0aG9kIEJ1bGt+Sm9iI2Fib3J0XHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEJ1bGt+Sm9iSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QnVsa35Kb2JJbmZvPn1cclxuICovXHJcbkpvYi5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgcmV0dXJuIHRoaXMuX2NoYW5nZVN0YXRlKFwiQWJvcnRlZFwiKS50aGVuKGZ1bmN0aW9uKGpvYkluZm8pIHtcclxuICAgIHNlbGYuaWQgPSBudWxsO1xyXG4gICAgc2VsZi5lbWl0KFwiYWJvcnRcIiwgam9iSW5mbyk7XHJcbiAgICByZXR1cm4gam9iSW5mbztcclxuICB9LCBmdW5jdGlvbihlcnIpIHtcclxuICAgIHNlbGYuZW1pdChcImVycm9yXCIsIGVycik7XHJcbiAgICB0aHJvdyBlcnI7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICovXHJcbkpvYi5wcm90b3R5cGUuX2NoYW5nZVN0YXRlID0gZnVuY3Rpb24oc3RhdGUsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHZhciBidWxrID0gdGhpcy5fYnVsaztcclxuICB2YXIgbG9nZ2VyID0gYnVsay5fbG9nZ2VyO1xyXG5cclxuICB0aGlzLl9qb2JJbmZvID0gdGhpcy5fd2FpdEFzc2lnbigpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYm9keSA9IFtcclxuICAgICAgJzw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/PicsXHJcbiAgICAgICc8am9iSW5mbyB4bWxucz1cImh0dHA6Ly93d3cuZm9yY2UuY29tLzIwMDkvMDYvYXN5bmNhcGkvZGF0YWxvYWRcIj4nLFxyXG4gICAgICAgICc8c3RhdGU+JyArIHN0YXRlICsgJzwvc3RhdGU+JyxcclxuICAgICAgJzwvam9iSW5mbz4nXHJcbiAgICBdLmpvaW4oJycpO1xyXG4gICAgcmV0dXJuIGJ1bGsuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2QgOiAnUE9TVCcsXHJcbiAgICAgIHBhdGggOiBcIi9qb2IvXCIgKyBzZWxmLmlkLFxyXG4gICAgICBib2R5IDogYm9keSxcclxuICAgICAgaGVhZGVycyA6IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi94bWw7IGNoYXJzZXQ9dXRmLThcIlxyXG4gICAgICB9LFxyXG4gICAgICByZXNwb25zZVR5cGU6IFwiYXBwbGljYXRpb24veG1sXCJcclxuICAgIH0pO1xyXG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICBsb2dnZXIuZGVidWcocmVzLmpvYkluZm8pO1xyXG4gICAgc2VsZi5zdGF0ZSA9IHJlcy5qb2JJbmZvLnN0YXRlO1xyXG4gICAgcmV0dXJuIHJlcy5qb2JJbmZvO1xyXG4gIH0pO1xyXG4gIHJldHVybiB0aGlzLl9qb2JJbmZvLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxuXHJcbn07XHJcblxyXG5cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4vKipcclxuICogQmF0Y2ggKGV4dGVuZHMgUmVjb3JkU3RyZWFtKVxyXG4gKlxyXG4gKiBAcHJvdGVjdGVkXHJcbiAqIEBjbGFzcyBCdWxrfkJhdGNoXHJcbiAqIEBleHRlbmRzIHtzdHJlYW0uV3JpdGFibGV9XHJcbiAqIEBpbXBsZW1lbnRzIHtQcm9taXNlLjxBcnJheS48UmVjb3JkUmVzdWx0Pj59XHJcbiAqIEBwYXJhbSB7QnVsa35Kb2J9IGpvYiAtIEJ1bGsgam9iIG9iamVjdFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW2JhdGNoSWRdIC0gQmF0Y2ggSUQgKGlmIGFscmVhZHkgYXZhaWxhYmxlKVxyXG4gKi9cclxudmFyIEJhdGNoID0gZnVuY3Rpb24oam9iLCBiYXRjaElkKSB7XHJcbiAgQmF0Y2guc3VwZXJfLmNhbGwodGhpcywgeyBvYmplY3RNb2RlOiB0cnVlIH0pO1xyXG4gIHRoaXMuam9iID0gam9iO1xyXG4gIHRoaXMuaWQgPSBiYXRjaElkO1xyXG4gIHRoaXMuX2J1bGsgPSBqb2IuX2J1bGs7XHJcbiAgdGhpcy5fZGVmZXJyZWQgPSBQcm9taXNlLmRlZmVyKCk7XHJcbiAgdGhpcy5fc2V0dXBEYXRhU3RyZWFtcygpO1xyXG59O1xyXG5cclxuaW5oZXJpdHMoQmF0Y2gsIHN0cmVhbS5Xcml0YWJsZSk7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5CYXRjaC5wcm90b3R5cGUuX3NldHVwRGF0YVN0cmVhbXMgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgYmF0Y2ggPSB0aGlzO1xyXG4gIHZhciBjb252ZXJ0ZXJPcHRpb25zID0geyBudWxsVmFsdWUgOiAnI04vQScgfTtcclxuICB0aGlzLl91cGxvYWRTdHJlYW0gPSBuZXcgUmVjb3JkU3RyZWFtLlNlcmlhbGl6YWJsZSgpO1xyXG4gIHRoaXMuX3VwbG9hZERhdGFTdHJlYW0gPSB0aGlzLl91cGxvYWRTdHJlYW0uc3RyZWFtKCdjc3YnLCBjb252ZXJ0ZXJPcHRpb25zKTtcclxuICB0aGlzLl9kb3dubG9hZFN0cmVhbSA9IG5ldyBSZWNvcmRTdHJlYW0uUGFyc2FibGUoKTtcclxuICB0aGlzLl9kb3dubG9hZERhdGFTdHJlYW0gPSB0aGlzLl9kb3dubG9hZFN0cmVhbS5zdHJlYW0oJ2NzdicsIGNvbnZlcnRlck9wdGlvbnMpO1xyXG5cclxuICB0aGlzLm9uKCdmaW5pc2gnLCBmdW5jdGlvbigpIHtcclxuICAgIGJhdGNoLl91cGxvYWRTdHJlYW0uZW5kKCk7XHJcbiAgfSk7XHJcbiAgdGhpcy5fdXBsb2FkRGF0YVN0cmVhbS5vbmNlKCdyZWFkYWJsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmF0Y2guam9iLm9wZW4oKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBwaXBlIHVwbG9hZCBkYXRhIHRvIGJhdGNoIEFQSSByZXF1ZXN0IHN0cmVhbVxyXG4gICAgICBiYXRjaC5fdXBsb2FkRGF0YVN0cmVhbS5waXBlKGJhdGNoLl9jcmVhdGVSZXF1ZXN0U3RyZWFtKCkpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGR1cGxleCBkYXRhIHN0cmVhbSwgb3BlbmVkIGFjY2VzcyB0byBBUEkgcHJvZ3JhbW1lcnMgYnkgQmF0Y2gjc3RyZWFtKClcclxuICB2YXIgZGF0YVN0cmVhbSA9IHRoaXMuX2RhdGFTdHJlYW0gPSBuZXcgRHVwbGV4KCk7XHJcbiAgZGF0YVN0cmVhbS5fd3JpdGUgPSBmdW5jdGlvbihkYXRhLCBlbmMsIGNiKSB7XHJcbiAgICBiYXRjaC5fdXBsb2FkRGF0YVN0cmVhbS53cml0ZShkYXRhLCBlbmMsIGNiKTtcclxuICB9O1xyXG4gIGRhdGFTdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmF0Y2guX3VwbG9hZERhdGFTdHJlYW0uZW5kKCk7XHJcbiAgfSk7XHJcblxyXG4gIHRoaXMuX2Rvd25sb2FkRGF0YVN0cmVhbS5vbigncmVhZGFibGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGRhdGFTdHJlYW0ucmVhZCgwKTtcclxuICB9KTtcclxuICB0aGlzLl9kb3dubG9hZERhdGFTdHJlYW0ub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgZGF0YVN0cmVhbS5wdXNoKG51bGwpO1xyXG4gIH0pO1xyXG4gIGRhdGFTdHJlYW0uX3JlYWQgPSBmdW5jdGlvbihzaXplKSB7XHJcbiAgICB2YXIgY2h1bms7XHJcbiAgICB3aGlsZSAoKGNodW5rID0gYmF0Y2guX2Rvd25sb2FkRGF0YVN0cmVhbS5yZWFkKCkpICE9PSBudWxsKSB7XHJcbiAgICAgIGRhdGFTdHJlYW0ucHVzaChjaHVuayk7XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb25uZWN0IGJhdGNoIEFQSSBhbmQgY3JlYXRlIHN0cmVhbSBpbnN0YW5jZSBvZiByZXF1ZXN0L3Jlc3BvbnNlXHJcbiAqXHJcbiAqIEBwcml2YXRlXHJcbiAqIEByZXR1cm5zIHtzdHJlYW0uRHVwbGV4fVxyXG4gKi9cclxuQmF0Y2gucHJvdG90eXBlLl9jcmVhdGVSZXF1ZXN0U3RyZWFtID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGJhdGNoID0gdGhpcztcclxuICB2YXIgYnVsayA9IGJhdGNoLl9idWxrO1xyXG4gIHZhciBsb2dnZXIgPSBidWxrLl9sb2dnZXI7XHJcblxyXG4gIHJldHVybiBidWxrLl9yZXF1ZXN0KHtcclxuICAgIG1ldGhvZCA6ICdQT1NUJyxcclxuICAgIHBhdGggOiBcIi9qb2IvXCIgKyBiYXRjaC5qb2IuaWQgKyBcIi9iYXRjaFwiLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQvY3N2XCJcclxuICAgIH0sXHJcbiAgICByZXNwb25zZVR5cGU6IFwiYXBwbGljYXRpb24veG1sXCJcclxuICB9LCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICBiYXRjaC5lbWl0KCdlcnJvcicsIGVycik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsb2dnZXIuZGVidWcocmVzLmJhdGNoSW5mbyk7XHJcbiAgICAgIGJhdGNoLmlkID0gcmVzLmJhdGNoSW5mby5pZDtcclxuICAgICAgYmF0Y2guZW1pdCgncXVldWUnLCByZXMuYmF0Y2hJbmZvKTtcclxuICAgIH1cclxuICB9KS5zdHJlYW0oKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiBXcml0YWJsZVxyXG4gKlxyXG4gKiBAb3ZlcnJpZGVcclxuICogQHByaXZhdGVcclxuICovXHJcbkJhdGNoLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbihyZWNvcmQsIGVuYywgY2IpIHtcclxuICByZWNvcmQgPSBfLmNsb25lKHJlY29yZCk7XHJcbiAgaWYgKHRoaXMuam9iLm9wZXJhdGlvbiA9PT0gXCJpbnNlcnRcIikge1xyXG4gICAgZGVsZXRlIHJlY29yZC5JZDtcclxuICB9IGVsc2UgaWYgKHRoaXMuam9iLm9wZXJhdGlvbiA9PT0gXCJkZWxldGVcIikge1xyXG4gICAgcmVjb3JkID0geyBJZDogcmVjb3JkLklkIH07XHJcbiAgfVxyXG4gIGRlbGV0ZSByZWNvcmQudHlwZTtcclxuICBkZWxldGUgcmVjb3JkLmF0dHJpYnV0ZXM7XHJcbiAgdGhpcy5fdXBsb2FkU3RyZWFtLndyaXRlKHJlY29yZCwgZW5jLCBjYik7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyBkdXBsZXggc3RyZWFtIHdoaWNoIGFjY2VwdHMgQ1NWIGRhdGEgaW5wdXQgYW5kIGJhdGNoIHJlc3VsdCBvdXRwdXRcclxuICpcclxuICogQHJldHVybnMge3N0cmVhbS5EdXBsZXh9XHJcbiAqL1xyXG5CYXRjaC5wcm90b3R5cGUuc3RyZWFtID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2RhdGFTdHJlYW07XHJcbn07XHJcblxyXG4vKipcclxuICogRXhlY3V0ZSBiYXRjaCBvcGVyYXRpb25cclxuICpcclxuICogQG1ldGhvZCBCdWxrfkJhdGNoI2V4ZWN1dGVcclxuICogQHBhcmFtIHtBcnJheS48UmVjb3JkPnxzdHJlYW0uU3RyZWFtfFN0cmluZ30gW2lucHV0XSAtIElucHV0IHNvdXJjZSBmb3IgYmF0Y2ggb3BlcmF0aW9uLiBBY2NlcHRzIGFycmF5IG9mIHJlY29yZHMsIENTViBzdHJpbmcsIGFuZCBDU1YgZGF0YSBpbnB1dCBzdHJlYW0gaW4gaW5zZXJ0L3VwZGF0ZS91cHNlcnQvZGVsZXRlL2hhcmREZWxldGUgb3BlcmF0aW9uLCBTT1FMIHN0cmluZyBpbiBxdWVyeSBvcGVyYXRpb24uXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFycmF5LjxSZWNvcmRSZXN1bHQ+fEFycmF5LjxCYXRjaFJlc3VsdEluZm8+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtCdWxrfkJhdGNofVxyXG4gKi9cclxuQmF0Y2gucHJvdG90eXBlLnJ1biA9XHJcbkJhdGNoLnByb3RvdHlwZS5leGVjID1cclxuQmF0Y2gucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbihpbnB1dCwgY2FsbGJhY2spIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIGlmICh0eXBlb2YgaW5wdXQgPT09ICdmdW5jdGlvbicpIHsgLy8gaWYgaW5wdXQgYXJndW1lbnQgaXMgb21pdHRlZFxyXG4gICAgY2FsbGJhY2sgPSBpbnB1dDtcclxuICAgIGlucHV0ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIGlmIGJhdGNoIGlzIGFscmVhZHkgZXhlY3V0ZWRcclxuICBpZiAodGhpcy5fcmVzdWx0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaCBhbHJlYWR5IGV4ZWN1dGVkLlwiKTtcclxuICB9XHJcblxyXG4gIHZhciByZGVmZXJyZWQgPSBQcm9taXNlLmRlZmVyKCk7XHJcbiAgdGhpcy5fcmVzdWx0ID0gcmRlZmVycmVkLnByb21pc2U7XHJcbiAgdGhpcy5fcmVzdWx0LnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICBzZWxmLl9kZWZlcnJlZC5yZXNvbHZlKHJlcyk7XHJcbiAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICBzZWxmLl9kZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICB9KTtcclxuICB0aGlzLm9uY2UoJ3Jlc3BvbnNlJywgZnVuY3Rpb24ocmVzKSB7XHJcbiAgICByZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xyXG4gIH0pO1xyXG4gIHRoaXMub25jZSgnZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcclxuICAgIHJkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuICB9KTtcclxuXHJcbiAgaWYgKF8uaXNPYmplY3QoaW5wdXQpICYmIF8uaXNGdW5jdGlvbihpbnB1dC5waXBlKSkgeyAvLyBpZiBpbnB1dCBoYXMgc3RyZWFtLlJlYWRhYmxlIGludGVyZmFjZVxyXG4gICAgaW5wdXQucGlwZSh0aGlzLl9kYXRhU3RyZWFtKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIGRhdGE7XHJcbiAgICBpZiAoXy5pc0FycmF5KGlucHV0KSkge1xyXG4gICAgICBfLmZvckVhY2goaW5wdXQsIGZ1bmN0aW9uKHJlY29yZCkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHJlY29yZCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgcmVjb3JkW2tleV0gPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICByZWNvcmRba2V5XSA9IFN0cmluZyhyZWNvcmRba2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHNlbGYud3JpdGUocmVjb3JkKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHNlbGYuZW5kKCk7XHJcbiAgICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcoaW5wdXQpKXtcclxuICAgICAgZGF0YSA9IGlucHV0O1xyXG4gICAgICB0aGlzLl9kYXRhU3RyZWFtLndyaXRlKGRhdGEsICd1dGY4Jyk7XHJcbiAgICAgIHRoaXMuX2RhdGFTdHJlYW0uZW5kKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyByZXR1cm4gQmF0Y2ggaW5zdGFuY2UgZm9yIGNoYWluaW5nXHJcbiAgcmV0dXJuIHRoaXMudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFByb21pc2UvQSsgaW50ZXJmYWNlXHJcbiAqIGh0dHA6Ly9wcm9taXNlcy1hcGx1cy5naXRodWIuaW8vcHJvbWlzZXMtc3BlYy9cclxuICpcclxuICogRGVsZWdhdGUgdG8gZGVmZXJyZWQgcHJvbWlzZSwgcmV0dXJuIHByb21pc2UgaW5zdGFuY2UgZm9yIGJhdGNoIHJlc3VsdFxyXG4gKlxyXG4gKiBAbWV0aG9kIEJ1bGt+QmF0Y2gjdGhlblxyXG4gKi9cclxuQmF0Y2gucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvblJlc29sdmVkLCBvblJlamVjdCwgb25Qcm9ncmVzcykge1xyXG4gIHJldHVybiB0aGlzLl9kZWZlcnJlZC5wcm9taXNlLnRoZW4ob25SZXNvbHZlZCwgb25SZWplY3QsIG9uUHJvZ3Jlc3MpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFByb21pc2UvQSsgZXh0ZW5zaW9uXHJcbiAqIENhbGwgXCJ0aGVuXCIgdXNpbmcgZ2l2ZW4gbm9kZS1zdHlsZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKlxyXG4gKiBAbWV0aG9kIEJ1bGt+QmF0Y2gjdGhlbkNhbGxcclxuICovXHJcbkJhdGNoLnByb3RvdHlwZS50aGVuQ2FsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgaWYgKF8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcclxuICAgIHRoaXMudGhlbihmdW5jdGlvbihyZXMpIHtcclxuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9KTtcclxuICAgIH0sIGZ1bmN0aW9uKGVycikge1xyXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEJ1bGt+QmF0Y2hJbmZvXHJcbiAqIEBwcm9wIHtTdHJpbmd9IGlkIC0gQmF0Y2ggSURcclxuICogQHByb3Age1N0cmluZ30gam9iSWQgLSBKb2IgSURcclxuICogQHByb3Age1N0cmluZ30gc3RhdGUgLSBCYXRjaCBzdGF0ZVxyXG4gKiBAcHJvcCB7U3RyaW5nfSBzdGF0ZU1lc3NhZ2UgLSBCYXRjaCBzdGF0ZSBtZXNzYWdlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIHRoZSBsYXRlc3QgYmF0Y2ggc3RhdHVzIGluIHNlcnZlclxyXG4gKlxyXG4gKiBAbWV0aG9kIEJ1bGt+QmF0Y2gjY2hlY2tcclxuICogQHBhcmFtIHtDYWxsYmFjay48QnVsa35CYXRjaEluZm8+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEJ1bGt+QmF0Y2hJbmZvPn1cclxuICovXHJcbkJhdGNoLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHZhciBidWxrID0gdGhpcy5fYnVsaztcclxuICB2YXIgbG9nZ2VyID0gYnVsay5fbG9nZ2VyO1xyXG4gIHZhciBqb2JJZCA9IHRoaXMuam9iLmlkO1xyXG4gIHZhciBiYXRjaElkID0gdGhpcy5pZDtcclxuXHJcbiAgaWYgKCFqb2JJZCB8fCAhYmF0Y2hJZCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQmF0Y2ggbm90IHN0YXJ0ZWQuXCIpO1xyXG4gIH1cclxuICByZXR1cm4gYnVsay5fcmVxdWVzdCh7XHJcbiAgICBtZXRob2QgOiAnR0VUJyxcclxuICAgIHBhdGggOiBcIi9qb2IvXCIgKyBqb2JJZCArIFwiL2JhdGNoL1wiICsgYmF0Y2hJZCxcclxuICAgIHJlc3BvbnNlVHlwZTogXCJhcHBsaWNhdGlvbi94bWxcIlxyXG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICBsb2dnZXIuZGVidWcocmVzLmJhdGNoSW5mbyk7XHJcbiAgICByZXR1cm4gcmVzLmJhdGNoSW5mbztcclxuICB9KS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFBvbGxpbmcgdGhlIGJhdGNoIHJlc3VsdCBhbmQgcmV0cmlldmVcclxuICpcclxuICogQG1ldGhvZCBCdWxrfkJhdGNoI3BvbGxcclxuICogQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIC0gUG9sbGluZyBpbnRlcnZhbCBpbiBtaWxsaXNlY29uZHNcclxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgLSBQb2xsaW5nIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXHJcbiAqL1xyXG5CYXRjaC5wcm90b3R5cGUucG9sbCA9IGZ1bmN0aW9uKGludGVydmFsLCB0aW1lb3V0KSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHZhciBqb2JJZCA9IHRoaXMuam9iLmlkO1xyXG4gIHZhciBiYXRjaElkID0gdGhpcy5pZDtcclxuXHJcbiAgaWYgKCFqb2JJZCB8fCAhYmF0Y2hJZCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQmF0Y2ggbm90IHN0YXJ0ZWQuXCIpO1xyXG4gIH1cclxuICB2YXIgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgdmFyIHBvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIGlmIChzdGFydFRpbWUgKyB0aW1lb3V0IDwgbm93KSB7XHJcbiAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJQb2xsaW5nIHRpbWUgb3V0LiBKb2IgSWQgPSBcIiArIGpvYklkICsgXCIgLCBiYXRjaCBJZCA9IFwiICsgYmF0Y2hJZCk7XHJcbiAgICAgIGVyci5uYW1lID0gJ1BvbGxpbmdUaW1lb3V0JztcclxuICAgICAgZXJyLmpvYklkID0gam9iSWQ7XHJcbiAgICAgIGVyci5iYXRjaElkID0gYmF0Y2hJZDtcclxuICAgICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHNlbGYuY2hlY2soZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXMuc3RhdGUgPT09IFwiRmFpbGVkXCIpIHtcclxuICAgICAgICAgIGlmIChwYXJzZUludChyZXMubnVtYmVyUmVjb3Jkc1Byb2Nlc3NlZCwgMTApID4gMCkge1xyXG4gICAgICAgICAgICBzZWxmLnJldHJpZXZlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKHJlcy5zdGF0ZU1lc3NhZ2UpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHJlcy5zdGF0ZSA9PT0gXCJDb21wbGV0ZWRcIikge1xyXG4gICAgICAgICAgc2VsZi5yZXRyaWV2ZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmLmVtaXQoJ3Byb2dyZXNzJywgcmVzKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQocG9sbCwgaW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuICBzZXRUaW1lb3V0KHBvbGwsIGludGVydmFsKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBCdWxrfkJhdGNoUmVzdWx0SW5mb1xyXG4gKiBAcHJvcCB7U3RyaW5nfSBpZCAtIEJhdGNoIHJlc3VsdCBJRFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBiYXRjaElkIC0gQmF0Y2ggSUQgd2hpY2ggaW5jbHVkZXMgdGhpcyBiYXRjaCByZXN1bHQuXHJcbiAqIEBwcm9wIHtTdHJpbmd9IGpvYklkIC0gSm9iIElEIHdoaWNoIGluY2x1ZGVzIHRoaXMgYmF0Y2ggcmVzdWx0LlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZSBiYXRjaCByZXN1bHRcclxuICpcclxuICogQG1ldGhvZCBCdWxrfkJhdGNoI3JldHJpZXZlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFycmF5LjxSZWNvcmRSZXN1bHQ+fEFycmF5LjxCdWxrfkJhdGNoUmVzdWx0SW5mbz4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEFycmF5LjxSZWNvcmRSZXN1bHQ+fEFycmF5LjxCdWxrfkJhdGNoUmVzdWx0SW5mbz4+fVxyXG4gKi9cclxuQmF0Y2gucHJvdG90eXBlLnJldHJpZXZlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdmFyIGJ1bGsgPSB0aGlzLl9idWxrO1xyXG4gIHZhciBqb2JJZCA9IHRoaXMuam9iLmlkO1xyXG4gIHZhciBqb2IgPSB0aGlzLmpvYjtcclxuICB2YXIgYmF0Y2hJZCA9IHRoaXMuaWQ7XHJcblxyXG4gIGlmICgham9iSWQgfHwgIWJhdGNoSWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIkJhdGNoIG5vdCBzdGFydGVkLlwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBqb2IuaW5mbygpLnRoZW4oZnVuY3Rpb24oam9iSW5mbykge1xyXG4gICAgcmV0dXJuIGJ1bGsuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2QgOiAnR0VUJyxcclxuICAgICAgcGF0aCA6IFwiL2pvYi9cIiArIGpvYklkICsgXCIvYmF0Y2gvXCIgKyBiYXRjaElkICsgXCIvcmVzdWx0XCJcclxuICAgIH0pO1xyXG4gIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICB2YXIgcmVzdWx0cztcclxuICAgIGlmIChqb2Iub3BlcmF0aW9uID09PSAncXVlcnknKSB7XHJcbiAgICAgIHZhciBjb25uID0gYnVsay5fY29ubjtcclxuICAgICAgdmFyIHJlc3VsdElkcyA9IHJlc1sncmVzdWx0LWxpc3QnXS5yZXN1bHQ7XHJcbiAgICAgIHJlc3VsdHMgPSByZXNbJ3Jlc3VsdC1saXN0J10ucmVzdWx0O1xyXG4gICAgICByZXN1bHRzID0gXy5tYXAoXy5pc0FycmF5KHJlc3VsdHMpID8gcmVzdWx0cyA6IFsgcmVzdWx0cyBdLCBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICBiYXRjaElkOiBiYXRjaElkLFxyXG4gICAgICAgICAgam9iSWQ6IGpvYklkXHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHRzID0gXy5tYXAocmVzLCBmdW5jdGlvbihyZXQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgaWQ6IHJldC5JZCB8fCBudWxsLFxyXG4gICAgICAgICAgc3VjY2VzczogcmV0LlN1Y2Nlc3MgPT09IFwidHJ1ZVwiLFxyXG4gICAgICAgICAgZXJyb3JzOiByZXQuRXJyb3IgPyBbIHJldC5FcnJvciBdIDogW11cclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXN1bHRzKTtcclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH0pLmZhaWwoZnVuY3Rpb24oZXJyKSB7XHJcbiAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcclxuICAgIHRocm93IGVycjtcclxuICB9KS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogRmV0Y2ggcXVlcnkgcmVzdWx0IGFzIGEgcmVjb3JkIHN0cmVhbVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVzdWx0SWQgLSBSZXN1bHQgaWRcclxuICogQHJldHVybnMge1JlY29yZFN0cmVhbX0gLSBSZWNvcmQgc3RyZWFtLCBjb252ZXJ0aWJsZSB0byBDU1YgZGF0YSBzdHJlYW1cclxuICovXHJcbkJhdGNoLnByb3RvdHlwZS5yZXN1bHQgPSBmdW5jdGlvbihyZXN1bHRJZCkge1xyXG4gIHZhciBqb2JJZCA9IHRoaXMuam9iLmlkO1xyXG4gIHZhciBiYXRjaElkID0gdGhpcy5pZDtcclxuICBpZiAoIWpvYklkIHx8ICFiYXRjaElkKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXRjaCBub3Qgc3RhcnRlZC5cIik7XHJcbiAgfVxyXG4gIHZhciByZXN1bHRTdHJlYW0gPSBuZXcgUmVjb3JkU3RyZWFtLlBhcnNhYmxlKCk7XHJcbiAgdmFyIHJlc3VsdERhdGFTdHJlYW0gPSByZXN1bHRTdHJlYW0uc3RyZWFtKCdjc3YnKTtcclxuICB2YXIgcmVxU3RyZWFtID0gdGhpcy5fYnVsay5fcmVxdWVzdCh7XHJcbiAgICBtZXRob2QgOiAnR0VUJyxcclxuICAgIHBhdGggOiBcIi9qb2IvXCIgKyBqb2JJZCArIFwiL2JhdGNoL1wiICsgYmF0Y2hJZCArIFwiL3Jlc3VsdC9cIiArIHJlc3VsdElkLFxyXG4gICAgcmVzcG9uc2VUeXBlOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiXHJcbiAgfSkuc3RyZWFtKCkucGlwZShyZXN1bHREYXRhU3RyZWFtKTtcclxuICByZXR1cm4gcmVzdWx0U3RyZWFtO1xyXG59O1xyXG5cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxudmFyIEJ1bGtBcGkgPSBmdW5jdGlvbigpIHtcclxuICBCdWxrQXBpLnN1cGVyXy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuaW5oZXJpdHMoQnVsa0FwaSwgSHR0cEFwaSk7XHJcblxyXG5CdWxrQXBpLnByb3RvdHlwZS5iZWZvcmVTZW5kID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gIHJlcXVlc3QuaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycyB8fCB7fTtcclxuICByZXF1ZXN0LmhlYWRlcnNbXCJYLVNGREMtU0VTU0lPTlwiXSA9IHRoaXMuX2Nvbm4uYWNjZXNzVG9rZW47XHJcbn07XHJcblxyXG5CdWxrQXBpLnByb3RvdHlwZS5pc1Nlc3Npb25FeHBpcmVkID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gNDAwICYmXHJcbiAgICAvPGV4Y2VwdGlvbkNvZGU+SW52YWxpZFNlc3Npb25JZDxcXC9leGNlcHRpb25Db2RlPi8udGVzdChyZXNwb25zZS5ib2R5KTtcclxufTtcclxuXHJcbkJ1bGtBcGkucHJvdG90eXBlLmhhc0Vycm9ySW5SZXNwb25zZUJvZHkgPSBmdW5jdGlvbihib2R5KSB7XHJcbiAgcmV0dXJuICEhYm9keS5lcnJvcjtcclxufTtcclxuXHJcbkJ1bGtBcGkucHJvdG90eXBlLnBhcnNlRXJyb3IgPSBmdW5jdGlvbihib2R5KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGVycm9yQ29kZTogYm9keS5lcnJvci5leGNlcHRpb25Db2RlLFxyXG4gICAgbWVzc2FnZTogYm9keS5lcnJvci5leGNlcHRpb25NZXNzYWdlXHJcbiAgfTtcclxufTtcclxuXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBCdWxrIEFQSVxyXG4gKlxyXG4gKiBAY2xhc3NcclxuICogQHBhcmFtIHtDb25uZWN0aW9ufSBjb25uIC0gQ29ubmVjdGlvbiBvYmplY3RcclxuICovXHJcbnZhciBCdWxrID0gZnVuY3Rpb24oY29ubikge1xyXG4gIHRoaXMuX2Nvbm4gPSBjb25uO1xyXG4gIHRoaXMuX2xvZ2dlciA9IGNvbm4uX2xvZ2dlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQb2xsaW5nIGludGVydmFsIGluIG1pbGxpc2Vjb25kc1xyXG4gKiBAdHlwZSB7TnVtYmVyfVxyXG4gKi9cclxuQnVsay5wcm90b3R5cGUucG9sbEludGVydmFsID0gMTAwMDtcclxuXHJcbi8qKlxyXG4gKiBQb2xsaW5nIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXHJcbiAqIEB0eXBlIHtOdW1iZXJ9XHJcbiAqL1xyXG5CdWxrLnByb3RvdHlwZS5wb2xsVGltZW91dCA9IDEwMDAwO1xyXG5cclxuLyoqIEBwcml2YXRlICoqL1xyXG5CdWxrLnByb3RvdHlwZS5fcmVxdWVzdCA9IGZ1bmN0aW9uKHJlcXVlc3QsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIGNvbm4gPSB0aGlzLl9jb25uO1xyXG4gIHJlcXVlc3QgPSBfLmNsb25lKHJlcXVlc3QpO1xyXG4gIHZhciBiYXNlVXJsID0gWyBjb25uLmluc3RhbmNlVXJsLCBcInNlcnZpY2VzL2FzeW5jXCIsIGNvbm4udmVyc2lvbiBdLmpvaW4oJy8nKTtcclxuICByZXF1ZXN0LnVybCA9IGJhc2VVcmwgKyByZXF1ZXN0LnBhdGg7XHJcbiAgdmFyIG9wdGlvbnMgPSB7IHJlc3BvbnNlVHlwZTogcmVxdWVzdC5yZXNwb25zZVR5cGUgfTtcclxuICBkZWxldGUgcmVxdWVzdC5wYXRoO1xyXG4gIGRlbGV0ZSByZXF1ZXN0LnJlc3BvbnNlVHlwZTtcclxuICByZXR1cm4gbmV3IEJ1bGtBcGkodGhpcy5fY29ubiwgb3B0aW9ucykucmVxdWVzdChyZXF1ZXN0KS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGFuZCBzdGFydCBidWxrbG9hZCBqb2IgYW5kIGJhdGNoXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU09iamVjdCB0eXBlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcGVyYXRpb24gLSBCdWxrIGxvYWQgb3BlcmF0aW9uICgnaW5zZXJ0JywgJ3VwZGF0ZScsICd1cHNlcnQnLCAnZGVsZXRlJywgb3IgJ2hhcmREZWxldGUnKVxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gT3B0aW9ucyBmb3IgYnVsayBsb2FkaW5nIG9wZXJhdGlvblxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZXh0SWRGaWVsZF0gLSBFeHRlcm5hbCBJRCBmaWVsZCBuYW1lICh1c2VkIHdoZW4gdXBzZXJ0IG9wZXJhdGlvbikuXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb25jdXJyZW5jeU1vZGVdIC0gJ1NlcmlhbCcgb3IgJ1BhcmFsbGVsJy4gRGVmYXVsdHMgdG8gUGFyYWxsZWwuXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFJlY29yZD58c3RyZWFtLlN0cmVhbXxTdHJpbmd9IFtpbnB1dF0gLSBJbnB1dCBzb3VyY2UgZm9yIGJ1bGtsb2FkLiBBY2NlcHRzIGFycmF5IG9mIHJlY29yZHMsIENTViBzdHJpbmcsIGFuZCBDU1YgZGF0YSBpbnB1dCBzdHJlYW0gaW4gaW5zZXJ0L3VwZGF0ZS91cHNlcnQvZGVsZXRlL2hhcmREZWxldGUgb3BlcmF0aW9uLCBTT1FMIHN0cmluZyBpbiBxdWVyeSBvcGVyYXRpb24uXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFycmF5LjxSZWNvcmRSZXN1bHQ+fEFycmF5LjxCdWxrfkJhdGNoUmVzdWx0SW5mbz4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge0J1bGt+QmF0Y2h9XHJcbiAqL1xyXG5CdWxrLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24odHlwZSwgb3BlcmF0aW9uLCBvcHRpb25zLCBpbnB1dCwgY2FsbGJhY2spIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgaWYgKCF0eXBlIHx8ICFvcGVyYXRpb24pIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIkluc3VmZmljaWVudCBhcmd1bWVudHMuIEF0IGxlYXN0LCAndHlwZScgYW5kICdvcGVyYXRpb24nIGFyZSByZXF1aXJlZC5cIik7XHJcbiAgfVxyXG4gIGlmICghXy5pc09iamVjdChvcHRpb25zKSB8fCBvcHRpb25zLmNvbnN0cnVjdG9yICE9PSBPYmplY3QpIHsgLy8gd2hlbiBvcHRpb25zIGlzIG5vdCBwbGFpbiBoYXNoIG9iamVjdCwgaXQgaXMgb21pdHRlZFxyXG4gICAgY2FsbGJhY2sgPSBpbnB1dDtcclxuICAgIGlucHV0ID0gb3B0aW9ucztcclxuICAgIG9wdGlvbnMgPSBudWxsO1xyXG4gIH1cclxuICB2YXIgam9iID0gdGhpcy5jcmVhdGVKb2IodHlwZSwgb3BlcmF0aW9uLCBvcHRpb25zKTtcclxuICBqb2Iub25jZSgnZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGlmIChiYXRjaCkge1xyXG4gICAgICBiYXRjaC5lbWl0KCdlcnJvcicsIGVycm9yKTsgLy8gcGFzcyBqb2IgZXJyb3IgdG8gYmF0Y2hcclxuICAgIH1cclxuICB9KTtcclxuICB2YXIgYmF0Y2ggPSBqb2IuY3JlYXRlQmF0Y2goKTtcclxuICB2YXIgY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgYmF0Y2ggPSBudWxsO1xyXG4gICAgam9iLmNsb3NlKCk7XHJcbiAgfTtcclxuICB2YXIgY2xlYW51cE9uRXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcclxuICAgIGlmIChlcnIubmFtZSAhPT0gJ1BvbGxpbmdUaW1lb3V0Jykge1xyXG4gICAgICBjbGVhbnVwKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBiYXRjaC5vbigncmVzcG9uc2UnLCBjbGVhbnVwKTtcclxuICBiYXRjaC5vbignZXJyb3InLCBjbGVhbnVwT25FcnJvcik7XHJcbiAgYmF0Y2gub24oJ3F1ZXVlJywgZnVuY3Rpb24oKSB7IGJhdGNoLnBvbGwoc2VsZi5wb2xsSW50ZXJ2YWwsIHNlbGYucG9sbFRpbWVvdXQpOyB9KTtcclxuICByZXR1cm4gYmF0Y2guZXhlY3V0ZShpbnB1dCwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEV4ZWN1dGUgYnVsayBxdWVyeSBhbmQgZ2V0IHJlY29yZCBzdHJlYW1cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IHNvcWwgLSBTT1FMIHRvIGV4ZWN1dGUgaW4gYnVsayBqb2JcclxuICogQHJldHVybnMge1JlY29yZFN0cmVhbS5QYXJzYWJsZX0gLSBSZWNvcmQgc3RyZWFtLCBjb252ZXJ0aWJsZSB0byBDU1YgZGF0YSBzdHJlYW1cclxuICovXHJcbkJ1bGsucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24oc29xbCkge1xyXG4gIHZhciBtID0gc29xbC5yZXBsYWNlKC9cXChbXFxzXFxTXStcXCkvZywgJycpLm1hdGNoKC9GUk9NXFxzKyhcXHcrKS9pKTtcclxuICBpZiAoIW0pIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHNvYmplY3QgdHlwZSBmb3VuZCBpbiBxdWVyeSwgbWF5YmUgY2F1c2VkIGJ5IGludmFsaWQgU09RTC5cIik7XHJcbiAgfVxyXG4gIHZhciB0eXBlID0gbVsxXTtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdmFyIHJlY29yZFN0cmVhbSA9IG5ldyBSZWNvcmRTdHJlYW0uUGFyc2FibGUoKTtcclxuICB2YXIgZGF0YVN0cmVhbSA9IHJlY29yZFN0cmVhbS5zdHJlYW0oJ2NzdicpO1xyXG4gIHRoaXMubG9hZCh0eXBlLCBcInF1ZXJ5XCIsIHNvcWwpLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xyXG4gICAgdmFyIHN0cmVhbXMgPSByZXN1bHRzLm1hcChmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgcmV0dXJuIHNlbGZcclxuICAgICAgICAuam9iKHJlc3VsdC5qb2JJZClcclxuICAgICAgICAuYmF0Y2gocmVzdWx0LmJhdGNoSWQpXHJcbiAgICAgICAgLnJlc3VsdChyZXN1bHQuaWQpXHJcbiAgICAgICAgLnN0cmVhbSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgam9pblN0cmVhbXMoc3RyZWFtcykucGlwZShkYXRhU3RyZWFtKTtcclxuICB9KS5mYWlsKGZ1bmN0aW9uKGVycikge1xyXG4gICAgcmVjb3JkU3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcclxuICB9KTtcclxuICByZXR1cm4gcmVjb3JkU3RyZWFtO1xyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgam9iIGluc3RhbmNlXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU09iamVjdCB0eXBlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcGVyYXRpb24gLSBCdWxrIGxvYWQgb3BlcmF0aW9uICgnaW5zZXJ0JywgJ3VwZGF0ZScsICd1cHNlcnQnLCAnZGVsZXRlJywgJ2hhcmREZWxldGUnLCBvciAncXVlcnknKVxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gT3B0aW9ucyBmb3IgYnVsayBsb2FkaW5nIG9wZXJhdGlvblxyXG4gKiBAcmV0dXJucyB7QnVsa35Kb2J9XHJcbiAqL1xyXG5CdWxrLnByb3RvdHlwZS5jcmVhdGVKb2IgPSBmdW5jdGlvbih0eXBlLCBvcGVyYXRpb24sIG9wdGlvbnMpIHtcclxuICByZXR1cm4gbmV3IEpvYih0aGlzLCB0eXBlLCBvcGVyYXRpb24sIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhIGpvYiBpbnN0YW5jZSBzcGVjaWZpZWQgYnkgZ2l2ZW4gam9iIElEXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBqb2JJZCAtIEpvYiBJRFxyXG4gKiBAcmV0dXJucyB7QnVsa35Kb2J9XHJcbiAqL1xyXG5CdWxrLnByb3RvdHlwZS5qb2IgPSBmdW5jdGlvbihqb2JJZCkge1xyXG4gIHJldHVybiBuZXcgSm9iKHRoaXMsIG51bGwsIG51bGwsIG51bGwsIGpvYklkKTtcclxufTtcclxuXHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLypcclxuICogUmVnaXN0ZXIgaG9vayBpbiBjb25uZWN0aW9uIGluc3RhbnRpYXRpb24gZm9yIGR5bmFtaWNhbGx5IGFkZGluZyB0aGlzIEFQSSBtb2R1bGUgZmVhdHVyZXNcclxuICovXHJcbmpzZm9yY2Uub24oJ2Nvbm5lY3Rpb246bmV3JywgZnVuY3Rpb24oY29ubikge1xyXG4gIGNvbm4uYnVsayA9IG5ldyBCdWxrKGNvbm4pO1xyXG59KTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGs7XHJcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
