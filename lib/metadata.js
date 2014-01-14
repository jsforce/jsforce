/*global Buffer */
/**
 * @file Manages Tooling APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
var util = require('util'),
    events = require('events'),
    stream = require('stream'),
    Stream = stream.Stream,
    _    = require('underscore'),
    Promise = require('./promise'),
    SOAP = require('./soap');

/**
 *
 */
var AsyncResult = function(meta, results, isArray) {
  this._meta = meta;
  this._results = results;
  this._isArray = isArray;
};

util.inherits(AsyncResult, events.EventEmitter);

/**
 * Promise/A+ interface
 * http://promises-aplus.github.io/promises-spec/
 *
 * Delegate to deferred promise, return promise instance for batch result
 */
AsyncResult.prototype.then = function(onResolve, onReject) {
  var self = this;
  return this._results.then(function(results) {
    var convertType = function(res) {
      if (res.$ && res.$["xsi:nil"] === 'true') {
        return null;
      }
      res.done = res.done === 'true';
      return res;
    };
    results = _.isArray(results) ? _.map(results, convertType) : convertType(results);
    if (self._isArray && !_.isArray(results)) {
      results = [ results ];
    }
    return onResolve(results);
  }, onReject);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 */
AsyncResult.prototype.thenCall = function(callback) {
  return _.isFunction(callback) ? this.then(function(res) {
    return callback(null, res);
  }, function(err) {
    return callback(err);
  }) : this;
};

/**
 *
 */
AsyncResult.prototype.check = function(callback) {
  var self = this;
  var meta = this._meta;
  return this.then(function(results) {
    var ids = _.isArray(results) ? _.map(results, function(res){ return res.id; }) : results.id;
    return meta.checkStatus(ids);
  }).thenCall(callback);
};

/**
 * Polling until async call status becomes complete or error
 *
 * @param {Number} interval - Polling interval in milliseconds
 * @param {Number} timeout - Polling timeout in milliseconds
 */
AsyncResult.prototype.poll = function(interval, timeout) {
  var self = this;
  var startTime = new Date().getTime();
  var poll = function() {
    var now = new Date().getTime();
    if (startTime + timeout < now) {
      self.emit('error', new Error("polling time out"));
      return;
    }
    self.check().then(function(results) {
      var done = true;
      var resultArr = _.isArray(results) ? results : [ results ];
      for (var i=0, len=resultArr.length; i<len; i++) {
        var result = resultArr[i];
        if (result && !result.done) {
          done = false;
        }
      }
      if (done) {
        self.emit('complete', results);
      } else {
        setTimeout(poll, interval);
      }
    }, function(err) {
      self.emit('error', err);
    });
  };
  setTimeout(poll, interval);
};

/**
 *
 */
AsyncResult.prototype.complete = function(callback) {
  var deferred = Promise.defer();
  this.on('complete', function(results) {
    deferred.resolve(results);
  });
  this.on('error', function(err) {
    deferred.reject(err);
  });
  var meta = this._meta;
  this.poll(meta.pollInterval, meta.pollTimeout);
  return deferred.promise.thenCall(callback);
};

/*--------------------------------------------*/
/**
 *
 */
var RetrieveResult = function(meta, result) {
  RetrieveResult.super_.call(this, meta, result);
};

util.inherits(RetrieveResult, AsyncResult);

/**
 *
 */
RetrieveResult.prototype.complete = function(callback) {
  var meta = this._meta;
  return RetrieveResult.super_.prototype.complete.call(this).then(function(result) {
    return meta.checkRetrieveStatus(result.id);
  }).thenCall(callback);
};

/**
 *
 */
RetrieveResult.prototype.stream = function() {
  var rstream = new Stream();
  rstream.readable = true;
  this.complete(function(err, result) {
    if (err) {
      rstream.emit('error', err);
    } else {
      rstream.emit('data', new Buffer(result.zipFile, 'base64'));
      rstream.emit('end');
    }
  });
  return rstream;
};

/*--------------------------------------------*/
/**
 *
 */
var DeployResult = function(meta, result) {
  DeployResult.super_.call(this, meta, result);
};

util.inherits(DeployResult, AsyncResult);

/**
 *
 */
DeployResult.prototype.complete = function(includeDetails, callback) {
  if (_.isFunction(includeDetails)) {
    callback = includeDetails;
    includeDetails = false;
  }
  var meta = this._meta;
  return DeployResult.super__.prototype.complete.call(this).then(function(result) {
    return meta.checkDeployStatus(result.id, includeDetails);
  }).thenCall(callback);
};

/*--------------------------------------------*/
/**
 *
 */
var Metadata = module.exports = function(conn) {
  this._conn = conn;
};


/** 
 * Polling interval in milliseconds 
 * @type {Number}
 */
Metadata.prototype.pollInterval = 1000;

/**
 * Polling timeout in milliseconds
 * @type {Number}
 */
Metadata.prototype.pollTimeout = 10000;


Metadata.prototype._invoke = function(method, message, callback) {
  var soapEndpoint = new SOAP({
    sessionId: this._conn.accessToken,
    serverUrl: this._conn.instanceUrl + "/services/Soap/m/" + this._conn.version,
    xmlns: "http://soap.sforce.com/2006/04/metadata"
  });
  return soapEndpoint.invoke(method, message).then(function(res) {
    return res.result;
  }).thenCall(callback); 
};

/**
 *
 */
Metadata.prototype.create = function(type, metadata, callback) {
  if (_.isObject(type)) {
    callback = metadata;
    metadata = type;
    type = null;
  }
  var convert = function(md) {
    md["@xsi:type"] = md.type || type;
    delete md.type;
    return md;
  };
  var isArray = _.isArray(metadata);
  metadata = isArray ? _.map(metadata, convert) : convert(metadata);
  var res = this._invoke("create", { metadata: metadata });
  return new AsyncResult(this, res, isArray).thenCall(callback);
};

/**
 *
 */
Metadata.prototype.update = function(type, updateMetadata, callback) {
  if (_.isObject(type)) {
    callback = updateMetadata;
    updateMetadata = type;
    type = null;
  }
  var convert = function(umd) {
    umd.metadata["@xsi:type"] = umd.metadata.type || type;
    delete umd.metadata.type;
    return umd;
  };
  var isArray = _.isArray(updateMetadata);
  updateMetadata = isArray ? _.map(updateMetadata, convert) : convert(updateMetadata);
  var res = this._invoke("update", { updateMetadata: updateMetadata });
  return new AsyncResult(this, res, isArray).thenCall(callback);
};

/**
 *
 */
Metadata.prototype.delete =
Metadata.prototype.del = function(type, metadata, callback) {
  if (!_.isString(type)) {
    callback = metadata;
    metadata = type;
    type = null;
  }
  var convert = function(md) {
    if (_.isString(md)) {
      md = { fullName : md };
    }
    md["@xsi:type"] = md.type || type;
    delete md.type;
    return md;
  };
  var isArray = _.isArray(metadata);
  metadata = isArray ? _.map(metadata, convert) : convert(metadata);
  var res = this._invoke("delete", { metadata: metadata });
  return new AsyncResult(this, res, isArray).thenCall(callback);
};

/**
 *
 */
Metadata.prototype.checkStatus = function(ids, callback) {
  var isArray = _.isArray(ids);
  var res = this._invoke("checkStatus", { asyncProcessId: ids });
  return new AsyncResult(this, res, isArray).thenCall(callback);
};

/**
 *
 */
Metadata.prototype.describe = function(version, callback) {
  if (!_.isString(version)) {
    callback = version;
    version = this._conn.version;
  }
  return this._invoke("describeMetadata", { asOfVersion: version });
};

/**
 *
 */
Metadata.prototype.list = function(queries, version, callback) {
  if (!_.isString(version)) {
    callback = version;
    version = this._conn.version;
  }
  if (!_.isArray(queries)) {
    queries = [ queries ];
  } 
  return this._invoke("listMetadata", { queries: queries, asOfVersion: version }, callback);
};

/**
 *
 */
Metadata.prototype.retrieve = function(request, callback) {
  var res = this._invoke("retrieve", { request: request });
  return new RetrieveResult(this, res).thenCall(callback);
};

/**
 *
 */
Metadata.prototype.checkRetrieveStatus = function(id, callback) {
  return this._invoke("checkRetrieveStatus", { asyncProcessId: id }, callback);
};

/**
 *
 */
Metadata.prototype.deploy = function(zipInput, options, callback) {
  if (!options || _.isFunction(options)) {
    callback = options;
    options = {};
  }
  var deferred = Promise.defer();
  if (zipInput instanceof Stream) {
    var bufs = [];
    zipInput.on('data', function(d) {
      bufs.push(d);
    });
    zipInput.on('end', function() {
      deferred.resolve(Buffer.concat(bufs));
    });
    zipInput.resume();
  } else if (zipInput instanceof Buffer) {
    deferred.resolve(zipInput);
  }

  var self = this;
  var res = deferred.promise.then(function(zipContentBuffer) {
    var zipContentB64 = zipContentBuffer.toString('base64');
    return self._invoke("deploy", { ZipFile: zipContentB64, DeployOptions: options }, callback);
  });
  return new DeployResult(this, res).thenCall(callback);
};

/**
 *
 */
Metadata.prototype.checkDeployStatus = function(id, includeDetails, callback) {
  if (_.isObject(includeDetails) || _.isBoolean(includeDetails)) {
    includeDetails = !!includeDetails;
  } else {
    callback = includeDetails;
    includeDetails = false;
  }
  return this._invoke("checkDeployStatus", { asyncProcessId: id, includeDetails : includeDetails }, callback);
};

