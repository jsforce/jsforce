import Apex from './api/apex';
export * from './types';
import jsforce from './jsforce';

import {
  VERSION,
  Connection as ConnectionCore,
  OAuth2,
  Date,
  SfDate,
  Registry,
  registry,
} from './core';
import { Schema } from './types';

export { VERSION, OAuth2, Date, SfDate, Registry, registry };

export class Connection<S extends Schema = Schema> extends ConnectionCore<S> {
  apex: Apex<S> = new Apex<S>(this);
}

jsforce.Connection = Connection;

export default jsforce;
