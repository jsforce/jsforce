var util         = require('util'),
    stream       = require('stream'),
    Stream       = stream.Stream,
    events       = require('events'),
    _            = require('underscore')._,
    Connection   = require('./connection'),
    RecordStream = require('./record-stream'),
    CSV          = require('./csv');

/**
 *
 */
function createRequestOption(contentType) {
  return {
    responseContentType: contentType,
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
}


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
Job.prototype.open = function() {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

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

  bulk._request({
    method : 'POST',
    path : "/job",
    body : body,
    headers : {
      "Content-Type" : "application/xml; charset=utf-8"
    }
  }, function(err, res) {
    if (err) {
      self.emit("error", err);
    } else {
      logger.debug(res.jobInfo);
      self.id = res.jobInfo.id;
      self.state = res.jobInfo.state;
      self.emit("open", res.jobInfo);
    }
  }, createRequestOption("application/xml"));
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
  var bulk = this._bulk;
  var logger = bulk._logger;

  if (!this.id) { throw new Error("No job id assigned yet."); }

  bulk._request({
    method : 'GET',
    path : "/job/" + this.id
  }, function(err, res) {
    if (res) {
      logger.debug(res.jobInfo);
      self.state = res.jobInfo.state;
    }
    callback(err, res && res.jobInfo);
  }, createRequestOption("application/xml"));
};

/**
 *
 */
Job.prototype.list = function(callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

  if (!this.id) { throw new Error("No job id assigned yet."); }

  bulk._request({
    method : 'GET',
    path : "/job/" + this.id + "/batch"
  }, function(err, res) {
    var batchInfoList;
    if (res) {
      logger.debug(res.batchInfoList.batchInfo);
      batchInfoList = res.batchInfoList;
      batchInfoList = _.isArray(batchInfoList.batchInfo) ? batchInfoList.batchInfo : [ batchInfoList.batchInfo ];
    }
    callback(err, batchInfoList);
  }, createRequestOption("application/xml"));
};

/**
 *
 */
Job.prototype.close = function() {
  var self = this;

  this._changeState("Closed", function(err, jobInfo) {
    if (err) {
      self.emit("error", err);
    } else {
      self.id = null;
      self.emit("close", jobInfo);
    }
  });
};

/**
 *
 */
Job.prototype.abort = function() {
  var self = this;

  this._changeState("Aborted", function(err, jobInfo) {
    if (err) {
      self.emit("error", err);
    } else {
      self.id = null;
      self.emit("abort", jobInfo);
      self.state = "Aborted";
    }
  });
};

/**
 * @private
 */
Job.prototype._changeState = function(state, callback) {
  var self = this;
  var bulk = this._bulk;
  var logger = bulk._logger;

  if (!this.id) { throw new Error("No job id assigned yet."); }

  var body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<jobInfo xmlns="http://www.force.com/2009/06/asyncapi/dataload">',
      '<state>' + state + '</state>',
    '</jobInfo>'
  ].join('');

  bulk._request({
    method : 'POST',
    path : "/job/" + this.id,
    body : body,
    headers : {
      "Content-Type" : "application/xml; charset=utf-8"
    }
  }, function(err, res) {
    if (res) {
      logger.debug(res.jobInfo);
      self.state = res.jobInfo.state;
    }
    callback(err, res && res.jobInfo);
  }, createRequestOption("application/xml"));

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
  this._csvStream = new RecordStream.CSVStream();
  this._csvStream.stream().pipe(this.stream());
};

util.inherits(Batch, RecordStream);

/**
 *
 */
Batch.prototype.run =
Batch.prototype.exec =
Batch.prototype.execute = function(input, callback) {
  var self = this;

  if (this.id) {
    throw new Error("Batch already executed and has id.");
  }

  if (callback) {
    this.on('response', function(res) { callback(null, res); });
    this.on('error', function(err) { callback(err); });
  }
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
  if (!jobId || !batchId) {
    return callback({ message : "Batch not started." });
  }
  bulk._request({
    method : 'GET',
    path : "/job/" + jobId + "/batch/" + batchId
  }, function(err, res) {
    if (res) { logger.debug(res.batchInfo); }
    callback(err, res && res.batchInfo);
  }, createRequestOption("application/xml"));
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
      self.emit('error', { messsage: "polling time out" });
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
            self.emit('error', { message: res.stateMessage });
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
  if (!jobId || !batchId) {
    return callback({ message : "Batch not started." });
  }
  bulk._request({
    method : 'GET',
    path : "/job/" + jobId + "/batch/" + batchId + "/result"
  }, function(err, results) {
    results = _.map(results, function(ret) {
      return {
        id: ret.Id || null,
        success: ret.Success === "true",
        errors: ret.Error ? [ ret.Error ] : []
      };
    });
    if (err) {
      self.emit('error', err);
    } else {
      self.emit('response', results);
    }
    if (callback) {
      callback(err, results);
    }
  }, createRequestOption());
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
      }
    }, function(err, res) {
      if (err) {
        batch.emit('error', err);
      } else {
        logger.debug(res.batchInfo);
        batch.id = res.batchInfo.id;
        batch.emit('queue', res.batchInfo);
      }
    }, createRequestOption("application/xml"));
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

Bulk.prototype._request = function(params, callback, options) {
  var conn = this._conn;
  params = _.clone(params);
  var baseUrl = [ conn.instanceUrl, "services/async", conn.version ].join('/');
  params.url = baseUrl + params.path;
  delete params.path;
  return this._conn._request(params, callback, options);
};

/**
 *
 */
Bulk.prototype.load = function(type, operation, options, input, callback) {
  var self = this;
  if (typeof input === 'function') {
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
  if (typeof callback === 'function') {
    batch.execute(input, callback);
  }
  return batch;
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