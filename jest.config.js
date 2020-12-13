module.exports = {
  testMatch: [
    '**/test/{connection-*,query,sobject,analytics,apex,bulk,metadata,soap,streaming}.test.ts',
  ],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
