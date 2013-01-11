var events = require('events'),
    stream = require('stream'),
    Stream = stream.Stream,
    util   = require('util'),
    _      = require('underscore'),
    CSV    = require('./csv');

/**
 * 
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


/*--- Output Record Stream methods ---*/

/**
 * Receive record into stream.
 */
RecordStream.prototype.send = function(record) {
  // abstract
};

/**
 * Resume record fetch and query execution
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


/*--- Input Record Stream methods ---*/

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


/* --------------------------------------------------- */

/**
 * Map record and pass to downstream
 */
RecordStream.map = function(fn) {
  var rstream = new RecordStream();
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
  rstream.send = function(record) {
    if (fn(record)) {
      this.emit('record', record);
    }
  };
  return rstream;
};


/* --------------------------------------------------- */

/**
 * CSVStream (extends OutputRecordStream)
 */
var CSVStream = function(headers) {
  this.sendable = true;
  this.readable = true;
  this.headers = headers;
  this.wroteHeaders = false;
  this._stream = new Stream();
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
  var row = [];
  _.forEach(this.headers, function(header) {
    var value = record[header];
    if (_.isNull(value) || _.isUndefined(value) || typeof value !== 'string') {
      value = '';
    }
    row.push(String(value));
  });
  this._stream.emit("data", CSV.arrayToCSV(row) + "\n");
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
 * Get delegating ReadableStream
 */
CSVStream.prototype.stream = function(record) {
  return this._stream;
};


RecordStream.CSVStream = CSVStream;


/* --------------------------------------------------- */


module.exports = RecordStream;
