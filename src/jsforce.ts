import EventEmitter from 'events';
import VERSION from './VERSION';
import Connection from './connection';
import OAuth2 from './oauth2';
import SfDate from './date';
import registry, { Registry } from './registry';

/**
 *
 */
class JSforce extends EventEmitter {
  VERSION: typeof VERSION = VERSION;
  Connection: typeof Connection = Connection;
  OAuth2: typeof OAuth2 = OAuth2;
  SfDate: typeof SfDate = SfDate;
  Date: typeof SfDate = SfDate;
  registry: Registry = registry;
}

export function registerModule(
  name: string,
  factory: (conn: Connection) => any,
) {
  jsforce.on('connection:new', (conn: Connection) => {
    let obj: any = undefined;
    Object.defineProperty(conn, name, {
      get() {
        obj = obj ?? factory(conn);
        return obj;
      },
      enumerable: true,
      configurable: true,
    });
  });
}

const jsforce = new JSforce();
export default jsforce;
