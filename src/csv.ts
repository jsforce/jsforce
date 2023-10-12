/**
 *
 */
import { Transform } from 'stream';
import { Parser as csvParse } from 'csv-parse';
import { Options as ParseOpts, parse as csvParseSync } from 'csv-parse/sync';
import { Options as StringifyOpts, stringify as csvStringify } from 'csv-stringify';
import { stringify as csvStringifySync } from 'csv-stringify/sync';

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
  return new csvParse({ ...options, columns: true });
}

/**
 * @private
 */
export function serializeCSVStream(options?: StringifyOpts): Transform {
  return csvStringify({ ...options, header: true });
}
