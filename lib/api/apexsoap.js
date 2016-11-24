'use strict';

var inherits = require('inherits'),
    jsforce = require('../core'),
    _       = require('lodash/core'),
    SOAP    = require('../soap');

/*--------------------------------------------*/
/**
 * Class for Salesforce Apexsoap API
 *
 * @class
 * @param {Connection} conn - Connection object
 */
var Apexsoap = module.exports = function(conn) {
  this._conn = conn;
};


/**
 * Polling interval in milliseconds
 * @type {Number}
 */
Apexsoap.prototype.pollInterval = 1000;

/**
 * Polling timeout in milliseconds
 * @type {Number}
 */
Apexsoap.prototype.pollTimeout = 10000;


/**
 * Call Apexsoap API SOAP endpoint
 *
 * @private
 */
Apexsoap.prototype._invoke = function(method, message, callback) {
  var soapEndpoint = new SOAP(this._conn, {
    xmlns: "http://soap.sforce.com/2006/08/apex",
    endpointUrl: this._conn.instanceUrl + "/services/Soap/s/" + this._conn.version
  });
  return soapEndpoint.invoke(method, message).then(function(res) {
    return res.result;
  }).thenCall(callback);
};

/**
 * Synchronously runTests specified Apexsoap components in the organization.
 *
 * @method Apexsoap#runTests
 * @param {Apexsoap~RunTestsRequest|Array.<Apexsoap~RunTestsRequest>} RunTestsRequest - full name(s) of Apexsoap objects to runTests
 * @param {Callback.<Apexsoap~RunTestResult|Array.<Apexsoap~RunTestResult>>} [callback] - Callback function
 * @returns {Promise.<Array.<Apexsoap~RunTestResult|Array.<Apexsoap~RunTestResult>>>}
 */
Apexsoap.prototype.runTests = function(RunTestsRequest, callback) {
  return this._invoke("runTests", { RunTestsRequest: RunTestsRequest }).then(function(results) {
    return convertToRunTestResult(results);
  }).thenCall(callback);
};

/**
 * @typedef {Object} Apexsoap~RunTestResult
 */

/**
 * @private
 */
function convertToRunTestResult(result) {
  var runTestResult = _.clone(result);
  if (runTestResult.codeCoverage) {
    runTestResult.codeCoverage = runTestResult.codeCoverage;
    if(!_.isArray(runTestResult.codeCoverage)) {
      runTestResult.codeCoverage = [runTestResult.codeCoverage];
    }
  }
  if (runTestResult.codeCoverageWarnings) {
    runTestResult.codeCoverageWarnings = runTestResult.codeCoverageWarnings;
    if(!_.isArray(runTestResult.codeCoverageWarnings)) {
      runTestResult.codeCoverageWarnings = [runTestResult.codeCoverageWarnings];
    }
  }
  if (runTestResult.failures) {
    runTestResult.failures = runTestResult.failures;
    if(!_.isArray(runTestResult.failures)) {
      runTestResult.failures = [runTestResult.failures];
    }
  }
  runTestResult.numFailures = Number(runTestResult.numFailures);
  runTestResult.numTestsRun = Number(runTestResult.numTestsRun);
  if (runTestResult.successes) {
    runTestResult.successes = runTestResult.successes;
    if(!_.isArray(runTestResult.successes)) {
      runTestResult.successes = [runTestResult.successes];
    }
  }
  runTestResult.totalTime = Number(runTestResult.totalTime);

  return runTestResult;
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.apexsoap = new Apexsoap(conn);
});
