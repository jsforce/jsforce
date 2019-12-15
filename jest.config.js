module.exports = {
  testMatch: ['**/test/{connection-*,query,sobject}.test.ts'],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
