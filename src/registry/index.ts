import { Registry } from './types';
import { FileRegistry } from './file';
import { SfdxRegistry } from './sfdx';
import { EmptyRegistry } from './empty';

const registry =
  process.env.JSFORCE_CONNECTION_REGISTRY === 'sfdx'
    ? new SfdxRegistry({})
    : new FileRegistry({});

export default registry;

export { Registry, FileRegistry, SfdxRegistry, EmptyRegistry };
