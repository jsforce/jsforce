var stream     = require('stream'),
    Stream     = stream.Stream,
    events     = require('events'),
    _          = require('underscore')._,
    Connection = require('./connection'),
    CSV        = require('./csv');

/**
 *
 */
var bulkRequestOption = {
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


/*--------------------------------------------*/

/**
 *
 */
var Job = function(conn, type, operation, jobId) {
  this._conn = conn;
  this.type = type;
  this.id = jobId;
  this.operation = operation;
  this.batches = {};
};

Job.prototype = new events.EventEmitter();

/**
 *
 */
Job.prototype.open = function() {
  var self = this;
  var logger = this._conn._logger;
  var body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<jobInfo  xmlns="http://www.force.com/2009/06/asyncapi/dataload">',
      '<operation>' + this.operation.toLowerCase() + '</operation>',
      '<object>' + this.type + '</object>',
      '<contentType>CSV</contentType>',
    '</jobInfo>'
  ].join('');

  this._conn._request({
    method : 'POST',
    url : this._conn.urls.bulk.base + "/job",
    body : body,
    headers : {
      "Content-Type" : "application/xml; charset=utf-8"
    }
  }, function(err, res) {
    if (err) {
      self.emit("error", err);
    } else {
      self.id = res.jobInfo.id;
      logger.debug(res.jobInfo);
      self.emit("open", res.jobInfo);
    }
  }, bulkRequestOption);
};

/**
 *
 */
Job.prototype.addBatch = function() {
  var batch = new Batch(this._conn, this);
  var self = this;
  batch.on('queue', function() {
    self.batches[batch.id] = batch;
  });
  return batch;
};

/**
 *
 */
Job.prototype.getBatch = function(batchId) {
  var batch = this.batches[batchId];
  if (!batch) {
    batch = new Batch(this._conn, this, batchId);
    this.batches[batchId] = batch;
  }
  return batch;
};

/**
 *
 */
Job.prototype.close = function() {
  var self = this;
  var logger = this._conn._logger;

  if (!this.id) { return; }

  var body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<jobInfo xmlns="http://www.force.com/2009/06/asyncapi/dataload">',
      '<state>Closed</state>',
    '</jobInfo>'
  ].join('');

  this._conn._request({
    method : 'POST',
    url : this._conn.urls.bulk.base + "/job/" + this.id,
    body : body,
    headers : {
      "Content-Type" : "application/xml; charset=utf-8"
    }
  }, function(err, res) {
    if (err) {
      self.emit("error", err);
    } else {
      self.id = null;
      logger.debug(res.jobInfo);
      self.emit("close", res.jobInfo);
    }
  }, bulkRequestOption);

};


/*--------------------------------------------*/

/**
 *
 */
var Batch = function(conn, job, batchId) {
  this._conn = conn;
  this.job = job;
  this.id = batchId;
  this.writable = true;
};

Batch.prototype = new events.EventEmitter();

/**
 *
 */
Batch.prototype.run =
Batch.prototype.exec =
Batch.prototype.execute = function(input) {
  var self = this;
  var jobId = this.job.id;
  if (!jobId) {
    this.job.on("open", function() { self.execute(input); });
    return;
  }

  if (input instanceof Stream) {
    input.pipe(this.stream());
  } else {
    var data;
    if (_.isArray(input)) {
      var records = _.map(input, function(rec) {
        rec = _.clone(rec);
        if (self.job.operation === "insert") {
          delete rec.Id;
        }
        delete rec.type;
        delete rec.attributes;
        return rec;
      });
      data = CSV.toCSV(records);
    } else if (_.isString(input)){
      data = input;
    }
    var stream = this.stream();
    stream.write(data);
    stream.end();
  }
};

/**
 *
 */
Batch.prototype.stream = function() {
  if (this._stream) {
    return this._stream;
  }
  var batch = this;
  var logger = this._conn._logger;

  var reqStream;
  var requestStream = function() {
    if (!reqStream) {
      reqStream = batch._conn._request({
        method : 'POST',
        url : batch._conn.urls.bulk.base + "/job/" + batch.job.id + "/batch",
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
      }, bulkRequestOption);
    }
    return reqStream;
  };

  var bstream = this._stream = new Stream();
  bstream.writable = true;

  bstream.write = function(data) {
    if (!batch.job.id) {
      batch.job.on("open", function() { bstream.write(data); });
      return;
    }
    requestStream().write(data);
  };

  bstream.end = function(data) {
    if (!batch.job.id) {
      batch.job.on("open", function() { bstream.end(data); });
      return;
    }
    bstream.writable = false;
    requestStream().end(data);
  };

  bstream.on("pipe", function(istream) {
    istream.resume();
  });

  return bstream;
};


/**
 *
 */
Batch.prototype.check = function(callback) {
  var self = this;
  var logger = this._conn._logger;
  var jobId = this.job.id;
  var batchId = this.id;
  if (!jobId || !batchId) {
    return callback({ message : "Batch not started." });
  }
  this._conn._request({
    method : 'GET',
    url : this._conn.urls.bulk.base + "/job/" + jobId + "/batch/" + batchId
  }, function(err, res) {
    if (res) { logger.debug(res.batchInfo); }
    callback(err, res && res.batchInfo);
  }, bulkRequestOption);
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
            self.emit('error', { message: "Batch request failed." });
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
  var jobId = this.job.id;
  var batchId = this.id;
  if (!jobId || !batchId) {
    return callback({ message : "Batch not started." });
  }
  this._conn._request({
    method : 'GET',
    url : this._conn.urls.bulk.base + "/job/" + jobId + "/batch/" + batchId + "/result"
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
  }, bulkRequestOption);
};

/*--------------------------------------------*/

/**
 * 
 */
var Bulkloader = function(conn) {
  this._conn = conn;
};

Bulkloader.prototype.pollInterval = 1000;
Bulkloader.prototype.pollTimeout = 10000;

/**
 *
 */
Bulkloader.prototype.bulkload = function(type, operation, input, callback) {
  var self = this;
  var job = this.createJob(type, operation);
  var batch = job.addBatch();
  var cleanup = function() { job.close(); };
  batch.on('response', cleanup);
  batch.on('error', cleanup);
  batch.on('queue', function() { batch.poll(self.pollInterval, self.pollTimeout); });
  if (typeof callback === 'function') {
    batch.on('response', function(res) { callback(null, res); });
    batch.on('error', function(err) { callback(err); });
    batch.execute(input);
  }
  return batch;
};


/**
 *
 */
Bulkloader.prototype.createJob = function(type, operation) {
  var job = new Job(this._conn, type, operation);
  job.open();
  return job;
};

/**
 *
 */
Bulkloader.prototype.getJob = function(jobId) {
  return new Job(this._conn, null, null, jobId);
};

/**
 *
 */
Bulkloader.prototype.getBatch = function(jobId, batchId) {
  var job = this.getJob(jobId);
  job.getBatch(batchId);
};

/*--------------------------------------------*/

/**
 *
 */
Connection.prototype.bulkload = function(type, operation, input, callback) {
  if (!this._bulkloader) {
    this._bulkloader = new Bulkloader(this);
  }
  return this._bulkloader.bulkload(type, operation, input, callback);
};


/*--------------------------------------------*/

/**
 *
 */
module.exports = Bulkloader;