export default {
  files: [
    'test.es6/{connection-*,query,sobject}.test.js',
  ],
  concurrency: 1,
  verbose: true,
  failFast: true,
  require: [
    '@babel/register',
    'esm'
  ],
  babel: {
    testOptions: {},
  },
};
