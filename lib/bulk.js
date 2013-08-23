var util         = require('util'),
    stream       = require('stream'),
    Stream       = stream.Stream,
    events       = require('events'),
    _            = require('underscore')._,
    Connection   = require('./connection'),
    RecordStream = require('./record-stream'),
    CSV          = require('./csv'),
    Promise      = require('./promise');


/*--------------------------------------------*/

/**
 *
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

Job.prototype = new events.EventEmitter();

/**
 *
 */
Job.prototype.open = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

  // if not requested opening job
  if (!this._jobInfo) {
    var body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<jobInfo  xmlns="http://www.force.com/2009/06/asyncapi/dataload">',
        '<operation>' + this.operation.toLowerCase() + '</operation>',
        '<object>' + this.type + '</object>',
        (this.options.extIdField ?
         '<externalIdFieldName>'+this.options.extIdField+'</externalIdFieldName>' :
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
 *
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
 *
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
 *
 */
Job.prototype.check = function(callback) {
  var self = this;
  var jobId = this.id;
  var bulk = this._bulk;
  var logger = bulk._logger;

  return Promise.when(function() {
    if (!jobId) { throw new Error("No job id assigned yet."); }
  }).then(function() {
    return bulk._request({
      method : 'GET',
      path : "/job/" + jobId,
      responseType: "application/xml"
    });
  }).then(function(res) {
    logger.debug(res.jobInfo);
    self.state = res.jobInfo.state;
    return res.jobInfo;
  }).thenCall(callback);

};

/**
 *
 */
Job.prototype.list = function(callback) {
  var self = this;
  var jobId = this.id;
  var bulk = this._bulk;
  var logger = bulk._logger;

  return Promise.when(function() {
    if (!jobId) { throw new Error("No job id assigned yet."); }
  }).then(function() {
    return bulk._request({
      method : 'GET',
      path : "/job/" + jobId + "/batch",
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
 *
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
 *
 */
Job.prototype.abort = function() {
  var self = this;
  return this._changeState("Aborted").then(function(jobInfo) {
    self.id = null;
    self.emit("abort", jobInfo);
    self.state = "Aborted";
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
  var jobId = this.id;
  var bulk = this._bulk;
  var logger = bulk._logger;

  return Promise.when(function() {
    if (!jobId) { throw new Error("No job id assigned yet."); }
  }).then(function() {
    var body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<jobInfo xmlns="http://www.force.com/2009/06/asyncapi/dataload">',
        '<state>' + state + '</state>',
      '</jobInfo>'
    ].join('');
    return bulk._request({
      method : 'POST',
      path : "/job/" + jobId,
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
  }).thenCall(callback);

};


/*--------------------------------------------*/

/**
 * Batch (extends RecordStream implements Sendable)
 */
var Batch = function(job, batchId) {
  Batch.super_.apply(this);
  this.sendable = true;
  this.job = job;
  this.id = batchId;
  this._bulk = job._bulk;
  this._running = false;
  this._closed = false;
  this._csvStream = new RecordStream.CSVStream();
  this._csvStream.stream().pipe(this.stream());
  this._deferred = Promise.defer();
};

util.inherits(Batch, RecordStream);

/**
 *
 */
Batch.prototype.run =
Batch.prototype.exec =
Batch.prototype.execute = function(input, callback) {
  var self = this;
  var deferred = this._deferred;

  if (typeof input === 'function') { // if input argument is omitted
    callback = input;
    input = null;
  }

  if (this._running || this._closed) {
    deferred.reject(new Error("Batch already executed."));
    return this;
  }

  this._running = true;

  // callback and promise resolution;
  var promiseCallback = function(err, res) {
    self._running = false;
    self._closed = true;
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

  if (input instanceof Stream) {
    input.pipe(this.stream());
  } else {
    var data;
    if (_.isArray(input)) {
      _.forEach(input, function(record) { self.send(record); });
    } else if (_.isString(input)){
      data = input;
      var stream = this.stream();
      stream.write(data);
      stream.end();
    }
  }

  // return Batch instance for chaining
  return this;
};

/**
 * Promise/A+ interface
 * http://promises-aplus.github.io/promises-spec/
 *
 * Delegate to deferred promise, return promise instance for batch result
 */
Batch.prototype.then = function(onResolved, onReject, onProgress) {
  return this._deferred.promise.then(onResolved, onReject, onProgress);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 */
Batch.prototype.thenCall = function(callback) {
  return _.isFunction(callback) ? this.then(function(res) {
    return callback(null, res);
  }, function(err) {
    return callback(err);
  }) : this;
};

/**
 *
 */
Batch.prototype.send = function(record) {
  record = _.clone(record);
  if (this.job.operation === "insert") {
    delete record.Id;
  } else if (this.job.operation === "delete") {
    record = { Id: record.Id };
  }
  delete record.type;
  delete record.attributes;
  return this._csvStream.send(record);
};

/**
 *
 */
Batch.prototype.end = function(record) {
  if (record) {
    this.send(record);
  }
  this.sendable = false;
  this._csvStream.end();
};



/**
 *
 */
Batch.prototype.check = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;
  var jobId = this.job.id;
  var batchId = this.id;

  return Promise.when(function() {
    if (!jobId || !batchId) {
      throw new Error("Batch not started.");
    }
  }).then(function() {
    return bulk._request({
      method : 'GET',
      path : "/job/" + jobId + "/batch/" + batchId,
      responseType: "application/xml"
    });
  }).then(function(res) {
    logger.debug(res.batchInfo);
    return res.batchInfo;
  }).thenCall(callback);
};


/**
 *
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
      self.emit('error', new Error("polling time out"));
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
          setTimeout(poll, interval);
        }
      }
    });
  };
  setTimeout(poll, interval);
};

/**
 *
 */
Batch.prototype.retrieve = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var jobId = this.job.id;
  var batchId = this.id;

  return Promise.when(function() {
    if (!jobId || !batchId) {
      throw new Error("Batch not started.");
    }
  }).then(function() {
    return bulk._request({
      method : 'GET',
      path : "/job/" + jobId + "/batch/" + batchId + "/result"
    });
  }).then(function(results) {
    results = _.map(results, function(ret) {
      return {
        id: ret.Id || null,
        success: ret.Success === "true",
        errors: ret.Error ? [ ret.Error ] : []
      };
    });
    self.emit('response', results);
    return results;
  }, function(err) {
    self.emit('error', err);
    throw err;
  }).thenCall(callback);
};

/**
 * @override
 */
Batch.prototype.stream = function() {
  if (!this._stream) {
    this._stream = new BatchStream(this);
  }
  return this._stream;
};

/*--------------------------------------------*/

/**
 * Batch uploading stream (extends WritableStream)
 */
var BatchStream = function(batch) {
  BatchStream.super_.call(this);
  this.batch = batch;
  this.writable = true;
};

util.inherits(BatchStream, Stream);

/**
 *
 */
BatchStream.prototype._getRequestStream = function() {
  var batch = this.batch;
  var bulk = batch._bulk;
  var logger = bulk._logger;

  if (!this._reqStream) {
    this._reqStream = bulk._request({
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
  }
  return this._reqStream;
};

BatchStream.prototype.write = function(data) {
  var batch = this.batch;
  if (!batch.job.id) {
    this._queue(data);
    return;
  }
  return this._getRequestStream().write(data);
};

BatchStream.prototype.end = function(data) {
  var batch = this.batch;
  if (!batch.job.id) {
    this._ending = true;
    if (data) {
      this._queue(data);
    }
    return;
  }
  this.writable = false;
  this._getRequestStream().end(data);
};

BatchStream.prototype._queue = function(data) {
  var bstream = this;
  var batch = this.batch;
  if (!this._buffer) {
    this._buffer = [];
    batch.job.on("open", function() { 
      bstream._buffer.forEach(function(data) {
        bstream.write(data);
      });
      if (bstream._ending) {
        bstream.end();
      }
      bstream._buffer = [];
    });
  }
  this._buffer.push(data);
};

/*--------------------------------------------*/

/**
 * 
 */
var Bulk = function(conn) {
  this._conn = conn;
  this._logger = conn._logger;
};

Bulk.prototype.pollInterval = 1000;
Bulk.prototype.pollTimeout = 10000;

Bulk.prototype._request = function(params, callback) {
  var conn = this._conn;
  params = _.clone(params);
  var baseUrl = [ conn.instanceUrl, "services/async", conn.version ].join('/');
  params.url = baseUrl + params.path;
  var options = {
    responseContentType: params.responseType,
    beforesend: function(conn, params) {
      params.headers["X-SFDC-SESSION"] = conn.accessToken;
    },
    parseError: function(err) {
      return {
        code: err.error.exceptionCode,
        message: err.error.exceptionMessage
      };
    }
  };
  delete params.path;
  delete params.responseType;
  return this._conn._request(params, callback, options);
};

/**
 *
 */
Bulk.prototype.load = function(type, operation, options, input, callback) {
  var self = this;
  if (!type || !operation) {
    throw new Error("Insufficient arguments. At least, 'type' and 'operation' are required.");
  }
  if (operation.toLowerCase() !== 'upsert') { // options is only for upsert operation
    callback = input;
    input = options;
    options = null;
  }
  var job = this.createJob(type, operation, options);
  var batch = job.createBatch();
  var cleanup = function() { job.close(); };
  batch.on('response', cleanup);
  batch.on('error', cleanup);
  batch.on('queue', function() { batch.poll(self.pollInterval, self.pollTimeout); });
  return batch.execute(input, callback);
};


/**
 *
 */
Bulk.prototype.createJob = function(type, operation, options) {
  var job = new Job(this, type, operation, options);
  job.open();
  return job;
};

/**
 *
 */
Bulk.prototype.job = function(jobId) {
  return new Job(this, null, null, null, jobId);
};



/*--------------------------------------------*/

/**
 *
 */
module.exports = Bulk;