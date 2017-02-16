import { EventEmitter } from 'events';

/**
 *
 */
export default class Connection extends EventEmitter {
  constructor(config) {
    super();
    console.log(config);
  }
}
