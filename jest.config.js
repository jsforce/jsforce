module.exports = {
  testMatch: [
    '**/test/{connection-*,query,sobject,analytics,apex,bulk,chatter,metadata,process,soap,streaming,tooling}.test.ts',
  ],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
};
