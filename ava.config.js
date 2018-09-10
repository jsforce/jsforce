export default {
  files: [
    'test/**/*.test.js',
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
