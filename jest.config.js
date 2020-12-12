module.exports = {
  testMatch: [
    '**/test/{connection-*,query,sobject,analytics,apex,bulk,metadata,soap}.test.ts',
  ],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
