/* @flow */
import type { Transform } from 'stream';
import csvParse from 'csv-parse';
import csvParseSync from 'csv-parse/lib/sync';
import csvStringify from 'csv-stringify';
import csvStringifySync from 'csv-stringify/lib/sync';

/**
 * @private
 */
export function parseCSV(str: string, options?: Object): Object[] {
  return csvParseSync(str, Object.assign({}, options, { columns: true }));
}

/**
 * @private
 */
export function toCSV(records: Object[], options?: Object): string {
  return csvStringifySync(records, Object.assign({}, options, { header: true }));
}

/**
 * @private
 */
export function parseCSVStream(options?: Object): Transform {
  return csvParse(Object.assign({}, options, { columns: true }));
}

/**
 * @private
 */
export function serializeCSVStream(options?: Object): Transform {
  return csvStringify(Object.assign({}, options, { header: true }));
}
