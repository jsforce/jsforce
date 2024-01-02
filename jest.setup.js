/* global jest */
jest.setTimeout(120000);

// only retry on CI
if (process.env.CI) {
  jest.retryTimes(3, {logErrorsBeforeRetry: true})
}
