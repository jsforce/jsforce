export default {
  files: [
    'test-ts/{connection-*,query,sobject}.test.ts',
  ],
  concurrency: 1,
  verbose: true,
  failFast: true,
  extensions: [
    'ts',
  ],
  require: [
    'ts-node/register'
  ],
  babel: {
    testOptions: {},
  },
};
