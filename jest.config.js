module.exports = {
  testMatch: ['**/test/*.test.ts'],
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^jsforce$': '<rootDir>',
    '^jsforce/(.+)': '<rootDir>/$1',
  },
};
