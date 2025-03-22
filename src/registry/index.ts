import type { Registry } from './types';
import { FileRegistry } from './file';
import { SfdxRegistry } from './sfdx';
import { EmptyRegistry } from './empty';
import { getLogger } from '../util/logger';

let registry: Registry;
try {
  registry =
    process.env.JSFORCE_CONNECTION_REGISTRY === 'sfdx'
      ? new SfdxRegistry({})
      : new FileRegistry({});
} catch (e) {
  getLogger('registry').error(e);
  registry = new EmptyRegistry();
}

export default registry;
export type { Registry };
export { FileRegistry, SfdxRegistry, EmptyRegistry };
