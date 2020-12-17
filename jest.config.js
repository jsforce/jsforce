module.exports = {
  testMatch: [
    '**/test/{connection-*,query,sobject,analytics,apex,bulk,chatter,metadata,soap,streaming,tooling}.test.ts',
  ],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
