var events = require('events'),
    stream = require('stream'),
    Stream = stream.Stream,
    util   = require('util'),
    _      = require('underscore'),
    CSV    = require('./csv');

/**
 * RecordStream
 * @abstract
 */
var RecordStream = function() {
  this.sendable = false;
  this.receivable = false;
  this.on('error', function() {
    this.sendable = false;
    this.recievable = false;
  });
  this.on('end', function() {
    this.recievable = false;
  });
};

util.inherits(RecordStream, events.EventEmitter);


/*--- Output Record Stream methods (Sendable) ---*/

/**
 * Output record into stream.
 */
RecordStream.prototype.send = function(record) {
  // abstract
};

/**
 * End sending records into stream. 
 */
RecordStream.prototype.end = function() {
  this.sendable = false;
};

/**
 * Destroy record stream;
 */
RecordStream.prototype.destroy = function() {
  this.reciebable = false;
  this.sendable = false;
};

/**
 * Destroy record stream after all record submission in the queue;
 * @abstract
 */
RecordStream.prototype.destroySoon = function() {
  //
};


/*--- Input Record Stream methods (Receivable) ---*/

/*
 * Pause record fetch
 */
RecordStream.prototype.pause = function() {
  // abstract
};

/**
 * Resume record fetch and query execution
 * @abstract
 */
RecordStream.prototype.resume = function() {
  // abstract
};

/**
 * Streaming pipe for record manipulation
 * Originally from Node.js's Stream#pipe 
 * https://github.com/joyent/node/blob/master/lib/stream.js
 */
RecordStream.prototype.pipe = function (dest, options) {
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
 * Create Stream instance for serializing/deserialize records
 */
RecordStream.prototype.stream = function(type) {
  type = type || 'csv';
  var recStream;
  if (type === "csv") {
    recStream = new RecordStream.CSVStream();
  }
  if (!recStream) {
    throw new Error("No stream type defined for '"+type+"'.");
  }
  if (this.receivable) {
    this.pipe(recStream);
  } else if (this.sendable) {
    recStream.pipe(this);
  }
  return recStream.stream(); // get Node.js stream instance
};
/* --------------------------------------------------- */

/**
 * Map record and pass to downstream
 */
RecordStream.map = function(fn) {
  var rstream = new RecordStream();
  rstream.receivable = true;
  rstream.send = function(record) {
    var rec = fn(record) || record; // if not returned record, use same record
    this.emit('record', rec);
  };
  return rstream;
};


/**
 * Filter record to pass to downstream
 */
RecordStream.filter = function(fn) {
  var rstream = new RecordStream();
  rstream.receivable = true;
  rstream.send = function(record) {
    if (fn(record)) {
      this.emit('record', record);
    }
  };
  return rstream;
};


/* --------------------------------------------------- */

/**
 * CSVStream (extends RecordStream implements Receivable, Sendable)
 */
var CSVStream = function(headers) {
  var self = this;
  this.sendable = true;
  this.receivable = true;
  this.headers = headers;
  this.wroteHeaders = false;
  this._stream = new Stream();
  this._buffer = [];
  this._stream.on('data', function(data) { self._handleData(data); });
  this._stream.on('end', function(data) { self._handleEnd(data); });
};

util.inherits(CSVStream, RecordStream);

/**
 *
 */
CSVStream.prototype.send = function(record) {
  if (!this.wroteHeaders) {
    if (!this.headers) {
      this.headers = CSV.extractHeaders([ record ]);
    }
    this._stream.emit("data", CSV.arrayToCSV(this.headers) + "\n");
    this.wroteHeaders = true;
  }
  this._stream.emit("data", CSV.recordToCSV(record, this.headers) + "\n");
};

/**
 *
 */
CSVStream.prototype.end = function(record) {
  if (record) { this.send(record); }
  this.readable = false;
  this.sendable = false;
  this._stream.emit("end");
};

/**
 *
 */
CSVStream.prototype._handleData = function(data, enc) {
  this._buffer.push([ data, enc ]);
};

/**
 *
 */
CSVStream.prototype._handleEnd = function(data, enc) {
  var self = this;
  if (data) {
    this._buffer.push([ data, enc ]);
  }
  data = this._buffer.map(function(d) {
    return d[0].toString(d[1] || 'utf-8');
  }).join('');
  var records = CSV.parseCSV(data);
  records.forEach(function(record) {
    self.emit('record', record);
  });
  this.emit('end');
};

/**
 * Get delegating Node.js stream
 * @override
 */
CSVStream.prototype.stream = function(record) {
  return this._stream;
};


RecordStream.CSVStream = CSVStream;


/* --------------------------------------------------- */


module.exports = RecordStream;
