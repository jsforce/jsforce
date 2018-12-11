/**
 * @file JSforce Core
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import EventEmitter from 'events';
import VERSION from './VERSION';
import Connection from './connection';
import OAuth2 from './oauth2';
import SfDate from './date';

const jsforce = new class extends EventEmitter {
  VERSION: typeof VERSION = VERSION;
  Connection: typeof Connection = Connection;
  OAuth2: typeof OAuth2 = OAuth2;
  SfDate: typeof SfDate = SfDate;
  Date: typeof SfDate = SfDate;
}();

export { VERSION, Connection, OAuth2, SfDate as Date, SfDate };
export default jsforce;
