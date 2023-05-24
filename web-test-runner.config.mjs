import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
  nodeResolve: true,
};
