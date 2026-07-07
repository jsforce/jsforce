/**
 *
 */
import { Transform } from 'stream';
import { Parser as csvParse } from 'csv-parse';
import { Options as ParseOpts, parse as csvParseSync } from 'csv-parse/sync';
import {
  Options as StringifyOpts,
  stringify as csvStringify,
} from 'csv-stringify';
import { stringify as csvStringifySync } from 'csv-stringify/sync';

// The following column delimiters are supported by the Bulk V2 API:
// https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/create_job.htm
//
// BACKQUOTE, CARET, COMMA, PIPE, SEMICOLON, TAB
const csvDelimiters = ['`','^',',','|',';','	']

/**
 * @private
 */
export function parseCSV(str: string, options?: ParseOpts): Object[] {
  return csvParseSync(str, { ...options, columns: true, delimiter: csvDelimiters });
}

/**
 * @private
 */
export function getCSVColumns(records: Object[]): string[] {
  const columnSet = new Set<string>();
  const columns: string[] = [];
  for (const record of records) {
    for (const column of Object.keys(record)) {
      if (!columnSet.has(column)) {
        columnSet.add(column);
        columns.push(column);
      }
    }
  }
  return columns;
}

/**
 * @private
 */
export function toCSV(records: Object[], options?: StringifyOpts): string {
  const columns = getCSVColumns(records);
  return csvStringifySync(records, {
    ...(columns.length > 0 ? { columns } : {}),
    ...options,
    header: true,
  });
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
