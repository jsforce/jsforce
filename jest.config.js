module.exports = {
  testMatch: ['**/test/{connection-*,query,sobject,apex,metadata}.test.ts'],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
