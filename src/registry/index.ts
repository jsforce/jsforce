import { Registry } from './types';
import { FileRegistry } from './file';
import { SfdxRegistry } from './sfdx';
import { EmptyRegistry } from './empty';

let registry: Registry;
try {
  registry =
    process.env.JSFORCE_CONNECTION_REGISTRY === 'sfdx'
      ? new SfdxRegistry({})
      : new FileRegistry({});
} catch (e) {
  console.error(e);
  registry = new EmptyRegistry();
}

export default registry;

export { Registry, FileRegistry, SfdxRegistry, EmptyRegistry };
