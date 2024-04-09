import jsforce from './jsforce';
import SfDate from './date';
import registry, { Registry } from './registry';
import browser, { BrowserClient } from './browser/client';
import VERSION from './VERSION';

import RecordReference from './record-reference';
import RecordStream from './record-stream';

export * from './oauth2';
export * from './connection';
export * from './query';
export * from './quick-action';
export * from './sobject';

export * from './types';
export {
  VERSION,
  SfDate as Date,
  SfDate,
  BrowserClient,
  RecordReference,
  RecordStream,
  registry,
  browser,
};
export type { Registry };
export default jsforce;
