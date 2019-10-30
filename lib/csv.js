'use strict';

var _ = require('lodash/core'),
    csvParse = require('csv-parse/lib/es5'),
    csvParseSync = require('csv-parse/lib/es5/sync'),
    csvStringify = require('csv-stringify'),
    csvStringifySync = require('csv-stringify/lib/sync');

/**
 * @private
 */
function parseCSV(str, options) {
  options = _.extend({}, options, { columns: true });
  return csvParseSync(str, options);
}

/**
 * @private
 */
function toCSV(records, options) {
  options = _.extend({}, options, { header: true });
  return csvStringifySync(records, options);
}

/**
 * @private
 */
function parseCSVStream(options) {
  options = _.extend({}, options, { columns: true });
  return csvParse(options);
}

/**
 * @private
 */
function serializeCSVStream(options) {
  options = _.extend({}, options, { header: true });
  return csvStringify(options);
}


/**
 * @protected
 */
module.exports = {
  parseCSV: parseCSV,
  toCSV: toCSV,
  parseCSVStream: parseCSVStream,
  serializeCSVStream: serializeCSVStream
};
