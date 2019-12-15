import VERSION from './VERSION';
import Connection from './connection';
import OAuth2 from './oauth2';
import SfDate from './date';
import registry, { Registry } from './registry';
import jsforce from './jsforce';

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
