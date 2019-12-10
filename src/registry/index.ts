import { Registry } from './registry';
import { FileRegistry } from './file';
import { SfdxRegistry } from './sfdx';
import { EmptyRegistry } from './empty';

export function createConnectionRegistry(
  name: string = 'file',
  options: {} = {},
) {
  switch (name) {
    case 'file':
      return new FileRegistry(options);
    case 'sfdx':
      return new SfdxRegistry(options);
    default:
      return new EmptyRegistry();
  }
}

export { Registry, FileRegistry, SfdxRegistry, EmptyRegistry };
