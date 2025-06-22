import { BaseRegistry } from './base';

/**
 *
 */
export class EmptyRegistry extends BaseRegistry {
  override _saveConfig() {
    // ignore all call requests
  }
}
