var fs         = require('fs'),
    events     = require('events'),
    request    = require('request'),
    async      = require('async'),
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
  this.batches = [];
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
  this.batches.push(batch);
  return batch;
};

/**
 *
 */
Job.prototype.getBatch = function(batchId) {
  var batch = new Batch(this._conn, this, batchId);
  this.batches.push(batch);
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
};

Batch.prototype = new events.EventEmitter();

/**
 *
 */
Batch.prototype.run =
Batch.prototype.exec =
Batch.prototype.execute = function(input) {
  var self = this;
  var logger = this._conn._logger;
  var jobId = this.job.id;

  if (!jobId) {
    this.job.on("open", function() { self.execute(input); });
    return;
  }

  var body = input;
  if (_.isArray(input)) {
    body = CSV.toCSV(input);
  }

  this._conn._request({
    method : 'POST',
    url : this._conn.urls.bulk.base + "/job/" + jobId + "/batch",
    body : body,
    headers : {
      "Content-Type" : "text/csv"
    }
  }, function(err, res) {
    if (err) {
      self.emit('error', err);
    } else {
      logger.debug(res.batchInfo);
      self.id = res.batchInfo.id;
      self.emit('queue', res.batchInfo);
    }
  }, bulkRequestOption);

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
  if (typeof callback === 'function') {
    batch.on('response', function(res) { callback(null, res); });
    batch.on('error', function(err) { callback(err); });
    batch.on('queue', function() { batch.poll(self.pollInterval, self.pollTimeout); });
    batch.execute(input);
  }
  return batch;
};

/**
 *
 */
Bulkloader.prototype.stream = function(type, operation) {
  // TODO
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


/*--------------------------------------------*/

/**
 *
 */
Connection.prototype.bulkload = function(type, operation, input, callback) {
  if (!this._bulkloader) {
    this._bulkloader = new Bulkloader(this);
  }
  this._bulkloader.bulkload(type, operation, input, callback);
};


/**
 *
 */
Connection.prototype.bulkStream = function(type, operation) {
  if (!this._bulkloader) {
    this._bulkloader = new Bulkloader(this);
  }
  return this._bulkloader.stream(type, operation);
};

/*--------------------------------------------*/

/**
 *
 */
module.exports = Bulkloader;