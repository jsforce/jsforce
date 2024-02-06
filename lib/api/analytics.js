/**
 * @file Manages Salesforce Analytics API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var _ = require('lodash/core'),
    jsforce = require('../core'),
    Promise  = require('../promise');

/**
 * Report instance to retrieving asynchronously executed result
 *
 * @protected
 * @class Analytics~ReportInstance
 * @param {Analytics~Report} report - Report
 * @param {String} id - Report instance id
 */
var ReportInstance = function(report, id) {
  this._report = report;
  this._conn = report._conn;
  this.id = id;
};

/**
 * Retrieve report result asynchronously executed
 *
 * @method Analytics~ReportInstance#retrieve
 * @param {Callback.<Analytics~ReportResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportResult>}
 */
ReportInstance.prototype.retrieve = function(callback) {
  var conn = this._conn,
      report = this._report;
  var url = [ conn._baseUrl(), "analytics", "reports", report.id, "instances", this.id ].join('/');
  return conn.request(url).thenCall(callback);
};

/**
 * Report object in Analytics API
 *
 * @protected
 * @class Analytics~Report
 * @param {Connection} conn Connection
 */
var Report = function(conn, id) {
  this._conn = conn;
  this.id = id;
};

/**
 * Describe report metadata
 *
 * @method Analytics~Report#describe
 * @param {Callback.<Analytics~ReportMetadata>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportMetadata>}
 */
Report.prototype.describe = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports", this.id, "describe" ].join('/');
  return this._conn.request(url).thenCall(callback);
};

/**
 * Synonym of Analytics~Report#destroy()
 *
 * @method Analytics~Report#delete
 * @param {Callback.<Analytics~ReportResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportResult>}
 */
/**
 * Synonym of Analytics~Report#destroy()
 *
 * @method Analytics~Report#del
 * @param {Callback.<Analytics~ReportResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportResult>}
 */
/**
 * Destroy a report
 *
 * @method Analytics~Report#destroy
 * @param {Callback.<Analytics~ReportResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportResult>}
 */
Report.prototype["delete"] =
Report.prototype.del =
Report.prototype.destroy = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports", this.id ].join('/');
  return this._conn.request({method: 'DELETE', url: url}).thenCall(callback);
};

/**
 * Clones a given report
 *
 * @method Analytics~Report#clone
 * @param {String} name - The name of the new report
 * @param {Callback.<Analytics~ReportResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportResult>}
 */
Report.prototype.clone = function(name, callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports" ].join('/');
  url += "?cloneId=" + this.id;
  var data = { reportMetadata: { name: name } };
  var params = { method : 'POST', url: url, headers: { "Content-Type" : "application/json" }, body: JSON.stringify(data)};

  return this._conn.request(params).thenCall(callback);
};

/**
 * Explain plan for executing report
 *
 * @method Analytics~Report#explain
 * @param {Callback.<ExplainInfo>} [callback] - Callback function
 * @returns {Promise.<ExplainInfo>}
 */
Report.prototype.explain = function(callback) {
  var url = "/query/?explain=" + this.id;
  return this._conn.request(url).thenCall(callback);
};


/**
 * Run report synchronously
 *
 * @method Analytics~Report#execute
 * @param {Object} [options] - Options
 * @param {Boolean} options.details - Flag if include detail in result
 * @param {Analytics~ReportMetadata} options.metadata - Overriding report metadata
 * @param {Callback.<Analytics~ReportResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportResult>}
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
  url += "?includeDetails=" + (options.details ? "true" : "false");
  var params = { method : options.metadata ? 'POST' : 'GET', url : url };
  if (options.metadata) {
    params.headers = { "Content-Type" : "application/json" };
    params.body = JSON.stringify(options.metadata);
  }
  return this._conn.request(params).thenCall(callback);
};


/**
 * Run report asynchronously
 *
 * @method Analytics~Report#executeAsync
 * @param {Object} [options] - Options
 * @param {Boolean} options.details - Flag if include detail in result
 * @param {Analytics~ReportMetadata} options.metadata - Overriding report metadata
 * @param {Callback.<Analytics~ReportInstanceAttrs>} [callback] - Callback function
 * @returns {Promise.<Analytics~ReportInstanceAttrs>}
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
  var params = { method : 'POST', url : url, body: "" };
  if (options.metadata) {
    params.headers = { "Content-Type" : "application/json" };
    params.body = JSON.stringify(options.metadata);
  }
  return this._conn.request(params).thenCall(callback);
};

/**
 * Get report instance for specified instance ID
 *
 * @method Analytics~Report#instance
 * @param {String} id - Report instance ID
 * @returns {Analytics~ReportInstance}
 */
Report.prototype.instance = function(id) {
  return new ReportInstance(this, id);
};

/**
 * List report instances which had been executed asynchronously
 *
 * @method Analytics~Report#instances
 * @param {Callback.<Array.<Analytics~ReportInstanceAttrs>>} [callback] - Callback function
 * @returns {Promise.<Array.<Analytics~ReportInstanceAttrs>>}
 */
Report.prototype.instances = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports", this.id, "instances" ].join('/');
  return this._conn.request(url).thenCall(callback);
};

/**
 * Dashboard object in the Analytics API
 *
 * @protected
 * @class Analytics-Dashboard
 * @param {Connection} conn Connection
 * @param {String} id - The Id
 */

var Dashboard = function(conn, id) {
  this._conn = conn;
  this.id = id;
};

/**
 * Describe dashboard metadata
 *
 * @method Analytics~Dashboard#describe
 * @param {Callback.<Analytics-DashboardMetadata>} [callback] - Callback function
 * @returns {Promise.<Analytics-DashboardMetadata>}
 */
Dashboard.prototype.describe = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "dashboards", this.id, "describe" ].join('/');
  return this._conn.request(url).thenCall(callback);
};

/**
 * Get details about dashboard components
 *
 * @method Analytics~Dashboard#components
 * @param {Callback.<Analytics-DashboardComponentMetadata>} [callback] - Callback function
 * @returns {Promise.<Analytics-DashboardComponentMetadata>}
 */
Dashboard.prototype.components = function(componentIds, callback) {
  var url = [ this._conn._baseUrl(), "analytics", "dashboards", this.id].join('/');
  var data = {};
  if (_.isFunction(componentIds)) {
    callback = componentIds;
  } else if (_.isArray(componentIds)) {
    data.componentIds = componentIds;
  } else if (_.isString(componentIds)) {
    data.componentIds = [ componentIds ];
  }
  var params = { method : 'POST', url : url, headers : { "Content-Type" : "application/json" }, body : JSON.stringify(data)};
  return this._conn.request(params).thenCall(callback);
};

/**
 * Get dashboard status
 *
 * @method Analytics~Dashboard#status
 * @param {Callback.<Analytics-DashboardStatusMetadata>} [callback] - Callback function
 * @returns {Promise.<Analytics-DashboardStatusMetadata>}
 */
Dashboard.prototype.status = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "dashboards", this.id, "status" ].join('/');
  return this._conn.request(url).thenCall(callback);
};

/**
 * Refresh a dashboard
 *
 * @method Analytics~Dashboard#refresh
 * @param {Callback.<Analytics-DashboardStatusUrl>} [callback] - Callback function
 * @returns {Promise.<Analytics-DashboardStatusUrl>}
 */
Dashboard.prototype.refresh = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "dashboards", this.id ].join('/');
  var params = { method : 'PUT', url : url, body: '' };
  return this._conn.request(params).thenCall(callback);
};

/**
 * Clone a dashboard
 *
 * @method Analytics~Dashboard#clone
 * @param {Callback.<Analytics-DashboardMetadata>} [callback] - Callback function
 * @returns {Promise.<Analytics-DashboardMetadata>}
 */
Dashboard.prototype.clone = function(name, folderid, callback) {
  var url = [ this._conn._baseUrl(), "analytics", "dashboards" ].join('/');
  url += "?cloneId=" + this.id;
  var data = {};

  if (_.isObject(name)) {
    data = name;
    callback = folderid;
  } else {
    data.name = name;
    data.folderId = folderid;
  }
  var params = { method : 'POST', url : url, headers : { "Content-Type" : "application/json" }, body : JSON.stringify(data)};

  return this._conn.request(params).thenCall(callback);
};

/**
 * Synonym of Analytics~Dashboard#destroy()
 *
 * @method Analytics~Dashboard#delete
 * @param {Callback.<Analytics~DashboardResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~DashboardResult>}
 */
/**
 * Synonym of Analytics~Dashboard#destroy()
 *
 * @method Analytics~Dashboard#del
 * @param {Callback.<Analytics~DashboardResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~DashboardResult>}
 */
/**
 * Destroy a dashboard
 *
 * @method Analytics~Dashboard#destroy
 * @param {Callback.<Analytics~DashboardResult>} [callback] - Callback function
 * @returns {Promise.<Analytics~DashboardResult>}
 */
Dashboard.prototype["delete"] =
Dashboard.prototype.del =
Dashboard.prototype.destroy = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "dashboards", this.id ].join('/');
  return this._conn.request({method: 'DELETE', url: url}).thenCall(callback);
};

/**
 * API class for Analytics API
 *
 * @class
 * @param {Connection} conn Connection
 */
var Analytics = function(conn) {
  this._conn = conn;
};

/**
 * Get report object of Analytics API
 *
 * @param {String} id - Report Id
 * @returns {Analytics~Report}
 */
Analytics.prototype.report = function(id) {
  return new Report(this._conn, id);
};

/**
 * Get recent report list
 *
 * @param {Callback.<Array.<Analytics~ReportInfo>>} [callback] - Callback function
 * @returns {Promise.<Array.<Analytics~ReportInfo>>}
 */
Analytics.prototype.reports = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "reports" ].join('/');
  return this._conn.request(url).thenCall(callback);
};

/**
 * Get dashboard object of Analytics API
 *
 * @param {String} id - Dashboard Id
 * @returns {Analytics~Dashboard}
 */
Analytics.prototype.dashboard = function(id) {
  return new Dashboard(this._conn, id);
};

/**
 * Get recent dashboard list
 *
 * @param {Callback.<Array.<Analytics~DashboardInfo>>} [callback] - Callback function
 * @returns {Promise.<Array.<Analytics~DashboardInfo>>}
 */
Analytics.prototype.dashboards = function(callback) {
  var url = [ this._conn._baseUrl(), "analytics", "dashboards" ].join('/');
  return this._conn.request(url).thenCall(callback);
};

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.analytics = new Analytics(conn);
});


module.exports = Analytics;
