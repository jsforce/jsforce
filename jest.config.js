module.exports = {
  testMatch: [
    '**/test/{connection-*,query,sobject,apex,bulk,metadata,soap}.test.ts',
  ],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
