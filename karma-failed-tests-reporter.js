/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
const path = require('path');
const fs = require('fs');

const FailedTestsReporter = function (baseReporterDecorator, config) {
  baseReporterDecorator(this);

  const { failedTestsReporter: failedTestsReporterConfig = {} } = config;
  const { outputFile } = failedTestsReporterConfig;

  const failedTests = [];

  this.onSpecComplete = function (browser, result) {
    const { success, fullName } = result;
    if (!success) {
      failedTests.push(fullName);
    }
  };

  this.onRunComplete = function () {
    if (outputFile) {
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, failedTests.join('\n'));
    }
  };
};

FailedTestsReporter.$inject = ['baseReporterDecorator', 'config', 'helper'];

module.exports = {
  'reporter:failed-tests': ['type', FailedTestsReporter],
};
