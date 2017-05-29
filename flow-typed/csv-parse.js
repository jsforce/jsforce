/* @flow */
import type { Transform as _Transform } from 'stream';

declare module 'csv-parse' {
  declare export default function csvParse(object?: Object): _Transform;
}

declare module 'csv-parse/lib/sync' {
  declare export default function csvParseSync(str: string, object?: Object): Array<Object>;
}
