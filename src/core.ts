/* @flow */
/**
 * @file JSforce Core
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import EventEmitter from 'events';
import VERSION from './VERSION';
import Connection from './connection';
import OAuth2 from './oauth2';

const jsforce = new class extends EventEmitter {
  VERSION: typeof VERSION = VERSION;
  Connection: typeof Connection = Connection;
  OAuth2: typeof OAuth2 = OAuth2;
}();

export { VERSION, Connection, OAuth2 };
export default jsforce;
