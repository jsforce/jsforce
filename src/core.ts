import jsforce from './jsforce';
import Connection, { ConnectionConfig } from './connection';
import OAuth2 from './oauth2';
import SfDate from './date';
import registry, { Registry } from './registry';
import browser, { BrowserClient } from './browser/client';
import VERSION from './VERSION';
import Query from './query';
import QuickAction from './quick-action';
import RecordReference from './record-reference';
import RecordStream from './record-stream';
import SObject from './sobject';

export * from './types';
export {
  VERSION,
  Connection,
  ConnectionConfig,
  OAuth2,
  SfDate as Date,
  SfDate,
  Registry,
  BrowserClient,
  Query,
  QuickAction,
  RecordReference,
  RecordStream,
  SObject,
  registry,
  browser,
};
export default jsforce;
