/**
 * @file Represents stream that handles Salesforce record as stream data
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
var events = require('events'),
    Transform = require('readable-stream').Transform,
    PassThrough = require('readable-stream').PassThrough,
    through2 = require('through2'),
    inherits = require('inherits'),
    _      = require('underscore'),
    CSV    = require('./csv');

/**
 * @private
 */
var CSVStreamConverter = {
  serialize: function(options) {
    var wroteHeaders = false;
    var headers = options.headers;
    return through2({ writableObjectMode: true },
      function transform(record, enc, callback) {
        if (!wroteHeaders) {
          if (!headers) {
            headers = CSV.extractHeaders([ record ]);
          }
          this.push(CSV.arrayToCSV(headers) + '\n');
          wroteHeaders = true;
        }
        this.push(CSV.recordToCSV(record, headers, { nullValue: options.nullValue }) + '\n');
        callback();
      }
    );
  },

  parse: function() {
    var buf = [];
    return through2({ readableObjectMode: true },
      function transform(data, enc, callback) {
        buf.push([ data, enc ]);
        callback();
      },
      function flush(callback) {
        var data = buf.map(function(d) {
          return d[0].toString(d[1] || 'utf-8');
        }).join('');
        var records = CSV.parseCSV(data);
        var _this = this;
        records.forEach(function(record) {
          _this.push(record);
        });
        callback();
      }
    );
  }
};

/**
 * @private
 */
var DataStreamConverters = {
  csv: CSVStreamConverter
};


/**
 * Class for Record Stream
 *
 * @abstract
 * @class
 * @constructor
 * @extends stream.PassThrough
 */
var RecordStream = module.exports = function() {
  PassThrough.call(this, { objectMode: true });
};

inherits(RecordStream, PassThrough);

/**
 * Mapping incoming record from upstream, and pass to downstream
 *
 * @param {RecordMapFunction} fn - Record mapping function
 * @returns {RecordStream}
 */
RecordStream.prototype.map = function(fn) {
  return this.pipe(RecordStream.map(fn));
};

/**
 * Filtering incoming record from upstream, and pass to downstream
 *
 * @param {RecordFilterFunction} fn - Record filtering function
 * @returns {RecordStream}
 */
RecordStream.prototype.filter = function(fn) {
  return this.pipe(RecordStream.filter(fn));
};

/**
 * Create readable stream instance which outputs serialized record data
 *
 * @param {String} [type] - Type of outgoing data format. Currently 'csv' is default value and the only supported.
 * @param {Object} [options] - Options passed to converter
 * @returns {stream.Readable}
 */
RecordStream.prototype.readableDataStream = function(type, options) {
  type = type || 'csv';
  var converter = DataStreamConverters[type];
  if (!converter) {
    throw new Error('Converting [' + type + '] data stream is not supported.');
  }
  var dataStream = new PassThrough();
  this.pipe(converter.serialize(options)).pipe(dataStream);
  return dataStream;
};

/**
 * Create writable stream instance which acceptss serialized record data
 *
 * @param {String} [type] - Type of incoming data format. Currently 'csv' is default value and the only supported.
 * @param {Object} [options] - Options passed to converter
 * @returns {stream.Writable}
 */
RecordStream.prototype.writableDataStream = function(type, options) {
  type = type || 'csv';
  var converter = DataStreamConverters[type];
  if (!converter) {
    throw new Error('Converting [' + type + '] data stream is not supported.');
  }
  var dataStream = new PassThrough();
  dataStream.pipe(converter.parse(options)).pipe(this);
  return dataStream;
};

/* --------------------------------------------------- */

/**
 * @callback RecordMapFunction
 * @param {Record} record - Source record to map
 * @returns {Record}
 */

/**
 * Create a record stream which maps records and pass them to downstream
 *
 * @param {RecordMapFunction} fn - Record mapping function
 * @returns {RecordStream}
 */
RecordStream.map = function(fn) {
  var mapStream = new RecordStream();
  mapStream._transform = function(record, enc, callback) {
    var rec = fn(record) || record; // if not returned record, use same record
    this.push(rec);
    callback();
  };
  return mapStream;
};

/**
 * Create mapping stream using given record template
 *
 * @param {Record} record - Mapping record object. In mapping field value, temlate notation can be used to refer field value in source record, if noeval param is not true.
 * @param {Boolean} [noeval] - Disable template evaluation in mapping record.
 * @returns {RecordStream}
 */
RecordStream.recordMapStream = function(record, noeval) {
  return RecordStream.map(function(rec) {
    var mapped = { Id: rec.Id };
    for (var prop in record) {
      mapped[prop] = noeval ? record[prop] : evalMapping(record[prop], rec);
    }
    return mapped;
  });

  function evalMapping(value, mapping) {
    if (_.isString(value)) {
      var m = /^\$\{(\w+)\}$/.exec(value);
      if (m) { return mapping[m[1]]; }
      return value.replace(/\$\{(\w+)\}/g, function($0, prop) {
        var v = mapping[prop];
        return _.isNull(v) || _.isUndefined(v) ? "" : String(v);
      });
    } else {
      return value;
    }
  }
};

/**
 * @callback RecordFilterFunction
 * @param {Record} record - Source record to filter
 * @returns {Boolean}
 */

/**
 * Create a record stream which filters records and pass them to downstream
 *
 * @param {RecordFilterFunction} fn - Record filtering function
 * @returns {RecordStream}
 */
RecordStream.filter = function(fn) {
  var filterStream = new RecordStream();
  filterStream._transform = function(record, enc, callback) {
    if (fn(record)) { this.push(record); }
    callback();
  };
  return filterStream;
};
