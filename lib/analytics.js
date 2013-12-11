/**
 * @file Manages Salesforce Analytics API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
var _       = require('underscore')._,
    Promise = require('./promise');

/**
 * Report instance to retrieving asynchronously executed result
 *
 * @constructor
 * @param {Report} report - Report
 * @param {String} id - Report instance id
 */
var ReportInstance = function(report, id) {
  this._report = report;
  this._conn = report._conn;
  this.id = id;
};

/**
 * Retrieve report result asynchronously executed
 * @param {Callback.<ReportResult>} [callback] - Callback function
 * @returns {Promise.<ReportResult>}
 */
ReportInstance.prototype.retrieve = function(callback) {
  var conn = this._conn,
      report = this._report;
  var url = [ conn._baseUrl(), "analytics", "reports", report.id, "instances", this.id ].join('/');
  return conn._request(url).thenCall(callback);
};

/**
 * Report object in Analytics API
 *
 * @constructor
 * @param {Connection} conn Connection
 */
var Report = function(conn, id) {
  this._conn = conn;
  this.id = id;
};

/**
 * Describe report metadata
 *
 * @param {Callback.<ReportMetadata>} [callback] - Callback function
 * @returns {Promise.<ReportMetadata>}
 */
Report.prototype.describe = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports", this.id, "describe" ].join('/');
  return this._conn._request(url).thenCall(callback);
};

/**
 * Run report synchronously
 *
 * @method execute
 * @memberof Report.prototype
 * @param {Object} [options] - Options
 * @param {Boolean} options.details - Flag if include detail in result
 * @param {ReportMetadata} options.metadata - Overriding report metadata
 * @param {Callback.<ReportResult>} [callback] - Callback function
 * @returns {Promise.<ReportResult>}
 * 
 */
Report.prototype.run = 
Report.prototype.exec = 
Report.prototype.execute = function(options, callback) {
  options = options || {};
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }
  var url = [ this._conn._baseUrl(), "analytics", "reports", this.id ].join('/');
  if (options.details) {
    url += "?includeDetails=true";
  }
  var params = { method : options.metadata ? 'POST' : 'GET', url : url };
  if (options.metadata) {
    params.headers = { "Content-Type" : "application/json" };
    params.body = JSON.stringify(options.metadata);
  }
  return this._conn._request(params).thenCall(callback);
};

/**
 * Run report asynchronously
 *
 * @method executeAsync
 * @memberof Report.prototype
 * @param {Object} [options] - Options
 * @param {Boolean} options.details - Flag if include detail in result
 * @param {ReportMetadata} options.metadata - Overriding report metadata
 * @param {Callback.<ReportInstanceAttrs>} [callback] - Callback function
 * @returns {Promise.<ReportInstanceAttrs>}
 */
Report.prototype.executeAsync = function(options, callback) {
  options = options || {};
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }
  var url = [ this._conn._baseUrl(), "analytics", "reports", this.id, "instances" ].join('/');
  if (options.details) {
    url += "?includeDetails=true";
  }
  var params = { method : 'POST', url : url };
  if (options.metadata) {
    params.headers = { "Content-Type" : "application/json" };
    params.body = JSON.stringify(options.metadata);
  }
  return this._conn._request(params).thenCall(callback);
};

/**
 * Get report instance for specified instance ID
 *
 * @param {String} id - Report instance ID
 * @returns {ReportInstance}
 */
Report.prototype.instance = function(id) {
  return new ReportInstance(this, id);
};

/**
 * List report instances which had been executed asynchronously
 *
 * @param {Callback.<Array.<ReportInstanceAttrs>>} [callback] - Callback function
 * @returns {Promise.<Array.<ReportInstanceAttrs>>}
 */
Report.prototype.instances = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports", this.id, "instances" ].join('/');
  return this._conn._request(url).thenCall(callback);
};


/**
 * API class for Analytics API
 *
 * @constructor
 * @param {Connection} conn Connection
 */
var Analytics = function(conn) {
  this._conn = conn;
};

/**
 * Get report object of Analytics API
 *
 * @param {String} id - Report Id
 * @returns {Report}
 */
Analytics.prototype.report = function(id) {
  return new Report(this._conn, id);
};

/**
 * Get recent report list
 *
 * @param {Callback.<Array.<ReportInfo>>} [callback] - Callback function
 * @returns {Promise.<Array.<ReportInfo>>}
 */
Analytics.prototype.reports = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports" ].join('/');
  return this._conn._request(url).thenCall(callback);
};

module.exports = Analytics;
