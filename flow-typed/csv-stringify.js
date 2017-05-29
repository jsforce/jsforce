/* @flow */
import type { Transform as _Transform } from 'stream';

declare module 'csv-stringify' {
  declare export default function csvStringify(object?: Object): _Transform;
}

declare module 'csv-stringify/lib/sync' {
  declare export default function csvStringifySync(records: Array<Object>, object?: Object): string;
}
