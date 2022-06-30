/**
 *
 */
import { Transform } from 'stream';
import csvParse, { Options as ParseOpts } from 'csv-parse/lib/es5';
import csvParseSync from 'csv-parse/lib/es5/sync';
import csvStringify, { Options as StringifyOpts } from 'csv-stringify/lib/es5';
import csvStringifySync from 'csv-stringify/lib/es5/sync';

/**
 * @private
 */
export function parseCSV(str: string, options?: ParseOpts): Object[] {
  return csvParseSync(str, { ...options, columns: true });
}

/**
 * @private
 */
export function toCSV(records: Object[], options?: StringifyOpts): string {
  return csvStringifySync(records, { ...options, header: true });
}

/**
 * @private
 */
export function parseCSVStream(options?: ParseOpts): Transform {
  return csvParse({ ...options, columns: true });
}

/**
 * @private
 */
export function serializeCSVStream(options?: StringifyOpts): Transform {
  return csvStringify({ ...options, header: true });
}
