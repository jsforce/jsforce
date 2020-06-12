import jsforce from './jsforce';
import Connection from './connection';
import OAuth2 from './oauth2';
import SfDate from './date';
import registry, { Registry } from './registry';
import VERSION from './VERSION';

export * from './types';
export {
  VERSION,
  Connection,
  OAuth2,
  SfDate as Date,
  SfDate,
  Registry,
  registry,
};
export default jsforce;
