import Apex from './api/apex';
import ConnectionCore from './connection';
import jsforce, { OAuth2, VERSION } from './core';

export { OAuth2, VERSION };

export class Connection extends ConnectionCore {
  apex: Apex = new Apex(this);
}

jsforce.Connection = Connection; // eslint-disable-line import/no-named-as-default-member

export default jsforce;
