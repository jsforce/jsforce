module.exports = {
  testMatch: ['**/test-ts/{connection-*,query,sobject}.test.ts'],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
