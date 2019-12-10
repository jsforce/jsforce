import { BaseRegistry } from './base';

/**
 *
 */
export class EmptyRegistry extends BaseRegistry {
  _saveConfig() {
    // ignore all call requests
  }
}
