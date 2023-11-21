// Karma configuration

const { readFileSync } = require('fs');
const webpackConfig = require('./webpack.config.test');

// Set BABEL_ENV to use proper preset config
process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

module.exports = function (config) {
  let specsToRetry;
  if (config.retryFailed) {
    // Loads names of failed specs and prepares them for use in a regex.
    specsToRetry = readFileSync(
      'failures.txt',
      'utf-8'
    )
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d')
      .split('\n')
      .join('|');
  }

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-jasmine-html-reporter',
      'karma-chrome-launcher',
      require('./karma-failed-tests-reporter.js'),
    ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: ['dist/jsforce.js', 'test/**/*.test.ts'],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.ts': ['webpack', 'sourcemap'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['kjhtml', 'progress','failed-tests'],

    failedTestsReporter: {
      outputFile: 'failures.txt',
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.CI === 'true',

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    // Webpack
    webpack: webpackConfig,

    // Jasmine Setting
    client: {
      args: [
        specsToRetry && '--grep',
        specsToRetry && `/${specsToRetry}/`,
      ].filter(Boolean),
      jasmine: {
        random: false,
        timeoutInterval: 120000,
      },
    },

    // Karma Timeout
    browserNoActivityTimeout: 140000,
  });
};
