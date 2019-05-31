(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Analytics = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @file Manages Salesforce Analytics API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var _ = window.jsforce.require('lodash/core'),
    jsforce = window.jsforce.require('./core'),
    Promise  = window.jsforce.require('./promise');

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

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL2FuYWx5dGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXHJcbiAqIEBmaWxlIE1hbmFnZXMgU2FsZXNmb3JjZSBBbmFseXRpY3MgQVBJXHJcbiAqIEBhdXRob3IgU2hpbmljaGkgVG9taXRhIDxzaGluaWNoaS50b21pdGFAZ21haWwuY29tPlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnbG9kYXNoL2NvcmUnKSxcclxuICAgIGpzZm9yY2UgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCcuL2NvcmUnKSxcclxuICAgIFByb21pc2UgID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9wcm9taXNlJyk7XHJcblxyXG4vKipcclxuICogUmVwb3J0IGluc3RhbmNlIHRvIHJldHJpZXZpbmcgYXN5bmNocm9ub3VzbHkgZXhlY3V0ZWQgcmVzdWx0XHJcbiAqXHJcbiAqIEBwcm90ZWN0ZWRcclxuICogQGNsYXNzIEFuYWx5dGljc35SZXBvcnRJbnN0YW5jZVxyXG4gKiBAcGFyYW0ge0FuYWx5dGljc35SZXBvcnR9IHJlcG9ydCAtIFJlcG9ydFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBSZXBvcnQgaW5zdGFuY2UgaWRcclxuICovXHJcbnZhciBSZXBvcnRJbnN0YW5jZSA9IGZ1bmN0aW9uKHJlcG9ydCwgaWQpIHtcclxuICB0aGlzLl9yZXBvcnQgPSByZXBvcnQ7XHJcbiAgdGhpcy5fY29ubiA9IHJlcG9ydC5fY29ubjtcclxuICB0aGlzLmlkID0gaWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0cmlldmUgcmVwb3J0IHJlc3VsdCBhc3luY2hyb25vdXNseSBleGVjdXRlZFxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35SZXBvcnRJbnN0YW5jZSNyZXRyaWV2ZVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBbmFseXRpY3N+UmVwb3J0UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBbmFseXRpY3N+UmVwb3J0UmVzdWx0Pn1cclxuICovXHJcblJlcG9ydEluc3RhbmNlLnByb3RvdHlwZS5yZXRyaWV2ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdmFyIGNvbm4gPSB0aGlzLl9jb25uLFxyXG4gICAgICByZXBvcnQgPSB0aGlzLl9yZXBvcnQ7XHJcbiAgdmFyIHVybCA9IFsgY29ubi5fYmFzZVVybCgpLCBcImFuYWx5dGljc1wiLCBcInJlcG9ydHNcIiwgcmVwb3J0LmlkLCBcImluc3RhbmNlc1wiLCB0aGlzLmlkIF0uam9pbignLycpO1xyXG4gIHJldHVybiBjb25uLnJlcXVlc3QodXJsKS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVwb3J0IG9iamVjdCBpbiBBbmFseXRpY3MgQVBJXHJcbiAqXHJcbiAqIEBwcm90ZWN0ZWRcclxuICogQGNsYXNzIEFuYWx5dGljc35SZXBvcnRcclxuICogQHBhcmFtIHtDb25uZWN0aW9ufSBjb25uIENvbm5lY3Rpb25cclxuICovXHJcbnZhciBSZXBvcnQgPSBmdW5jdGlvbihjb25uLCBpZCkge1xyXG4gIHRoaXMuX2Nvbm4gPSBjb25uO1xyXG4gIHRoaXMuaWQgPSBpZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZSByZXBvcnQgbWV0YWRhdGFcclxuICpcclxuICogQG1ldGhvZCBBbmFseXRpY3N+UmVwb3J0I2Rlc2NyaWJlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFuYWx5dGljc35SZXBvcnRNZXRhZGF0YT59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzflJlcG9ydE1ldGFkYXRhPn1cclxuICovXHJcblJlcG9ydC5wcm90b3R5cGUuZGVzY3JpYmUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHZhciB1cmwgPSBbIHRoaXMuX2Nvbm4uX2Jhc2VVcmwoKSwgXCJhbmFseXRpY3NcIiwgXCJyZXBvcnRzXCIsIHRoaXMuaWQsIFwiZGVzY3JpYmVcIiBdLmpvaW4oJy8nKTtcclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHVybCkudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN5bm9ueW0gb2YgQW5hbHl0aWNzflJlcG9ydCNkZXN0cm95KClcclxuICpcclxuICogQG1ldGhvZCBBbmFseXRpY3N+UmVwb3J0I2RlbGV0ZVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBbmFseXRpY3N+UmVwb3J0UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBbmFseXRpY3N+UmVwb3J0UmVzdWx0Pn1cclxuICovXHJcbi8qKlxyXG4gKiBTeW5vbnltIG9mIEFuYWx5dGljc35SZXBvcnQjZGVzdHJveSgpXHJcbiAqXHJcbiAqIEBtZXRob2QgQW5hbHl0aWNzflJlcG9ydCNkZWxcclxuICogQHBhcmFtIHtDYWxsYmFjay48QW5hbHl0aWNzflJlcG9ydFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzflJlcG9ydFJlc3VsdD59XHJcbiAqL1xyXG4vKipcclxuICogRGVzdHJveSBhIHJlcG9ydFxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35SZXBvcnQjZGVzdHJveVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBbmFseXRpY3N+UmVwb3J0UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBbmFseXRpY3N+UmVwb3J0UmVzdWx0Pn1cclxuICovXHJcblJlcG9ydC5wcm90b3R5cGVbXCJkZWxldGVcIl0gPVxyXG5SZXBvcnQucHJvdG90eXBlLmRlbCA9XHJcblJlcG9ydC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHVybCA9IFsgdGhpcy5fY29ubi5fYmFzZVVybCgpLCBcImFuYWx5dGljc1wiLCBcInJlcG9ydHNcIiwgdGhpcy5pZCBdLmpvaW4oJy8nKTtcclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHttZXRob2Q6ICdERUxFVEUnLCB1cmw6IHVybH0pLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9uZXMgYSBnaXZlbiByZXBvcnRcclxuICpcclxuICogQG1ldGhvZCBBbmFseXRpY3N+UmVwb3J0I2Nsb25lXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIG5ldyByZXBvcnRcclxuICogQHBhcmFtIHtDYWxsYmFjay48QW5hbHl0aWNzflJlcG9ydFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzflJlcG9ydFJlc3VsdD59XHJcbiAqL1xyXG5SZXBvcnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24obmFtZSwgY2FsbGJhY2spIHtcclxuICB2YXIgdXJsID0gWyB0aGlzLl9jb25uLl9iYXNlVXJsKCksIFwiYW5hbHl0aWNzXCIsIFwicmVwb3J0c1wiIF0uam9pbignLycpO1xyXG4gIHVybCArPSBcIj9jbG9uZUlkPVwiICsgdGhpcy5pZDtcclxuICB2YXIgZGF0YSA9IHsgcmVwb3J0TWV0YWRhdGE6IHsgbmFtZTogbmFtZSB9IH07XHJcbiAgdmFyIHBhcmFtcyA9IHsgbWV0aG9kIDogJ1BPU1QnLCB1cmw6IHVybCwgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSwgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSl9O1xyXG5cclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHBhcmFtcykudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEV4cGxhaW4gcGxhbiBmb3IgZXhlY3V0aW5nIHJlcG9ydFxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35SZXBvcnQjZXhwbGFpblxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxFeHBsYWluSW5mbz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48RXhwbGFpbkluZm8+fVxyXG4gKi9cclxuUmVwb3J0LnByb3RvdHlwZS5leHBsYWluID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICB2YXIgdXJsID0gXCIvcXVlcnkvP2V4cGxhaW49XCIgKyB0aGlzLmlkO1xyXG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3QodXJsKS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFJ1biByZXBvcnQgc3luY2hyb25vdXNseVxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35SZXBvcnQjZXhlY3V0ZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gT3B0aW9uc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuZGV0YWlscyAtIEZsYWcgaWYgaW5jbHVkZSBkZXRhaWwgaW4gcmVzdWx0XHJcbiAqIEBwYXJhbSB7QW5hbHl0aWNzflJlcG9ydE1ldGFkYXRhfSBvcHRpb25zLm1ldGFkYXRhIC0gT3ZlcnJpZGluZyByZXBvcnQgbWV0YWRhdGFcclxuICogQHBhcmFtIHtDYWxsYmFjay48QW5hbHl0aWNzflJlcG9ydFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzflJlcG9ydFJlc3VsdD59XHJcbiAqL1xyXG5SZXBvcnQucHJvdG90eXBlLnJ1biA9XHJcblJlcG9ydC5wcm90b3R5cGUuZXhlYyA9XHJcblJlcG9ydC5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgaWYgKF8uaXNGdW5jdGlvbihvcHRpb25zKSkge1xyXG4gICAgY2FsbGJhY2sgPSBvcHRpb25zO1xyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG4gIH1cclxuICB2YXIgdXJsID0gWyB0aGlzLl9jb25uLl9iYXNlVXJsKCksIFwiYW5hbHl0aWNzXCIsIFwicmVwb3J0c1wiLCB0aGlzLmlkIF0uam9pbignLycpO1xyXG4gIHVybCArPSBcIj9pbmNsdWRlRGV0YWlscz1cIiArIChvcHRpb25zLmRldGFpbHMgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7XHJcbiAgdmFyIHBhcmFtcyA9IHsgbWV0aG9kIDogb3B0aW9ucy5tZXRhZGF0YSA/ICdQT1NUJyA6ICdHRVQnLCB1cmwgOiB1cmwgfTtcclxuICBpZiAob3B0aW9ucy5tZXRhZGF0YSkge1xyXG4gICAgcGFyYW1zLmhlYWRlcnMgPSB7IFwiQ29udGVudC1UeXBlXCIgOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9O1xyXG4gICAgcGFyYW1zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLm1ldGFkYXRhKTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdChwYXJhbXMpLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogUnVuIHJlcG9ydCBhc3luY2hyb25vdXNseVxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35SZXBvcnQjZXhlY3V0ZUFzeW5jXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBPcHRpb25zXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5kZXRhaWxzIC0gRmxhZyBpZiBpbmNsdWRlIGRldGFpbCBpbiByZXN1bHRcclxuICogQHBhcmFtIHtBbmFseXRpY3N+UmVwb3J0TWV0YWRhdGF9IG9wdGlvbnMubWV0YWRhdGEgLSBPdmVycmlkaW5nIHJlcG9ydCBtZXRhZGF0YVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBbmFseXRpY3N+UmVwb3J0SW5zdGFuY2VBdHRycz59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzflJlcG9ydEluc3RhbmNlQXR0cnM+fVxyXG4gKi9cclxuUmVwb3J0LnByb3RvdHlwZS5leGVjdXRlQXN5bmMgPSBmdW5jdGlvbihvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9ucykpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcbiAgdmFyIHVybCA9IFsgdGhpcy5fY29ubi5fYmFzZVVybCgpLCBcImFuYWx5dGljc1wiLCBcInJlcG9ydHNcIiwgdGhpcy5pZCwgXCJpbnN0YW5jZXNcIiBdLmpvaW4oJy8nKTtcclxuICBpZiAob3B0aW9ucy5kZXRhaWxzKSB7XHJcbiAgICB1cmwgKz0gXCI/aW5jbHVkZURldGFpbHM9dHJ1ZVwiO1xyXG4gIH1cclxuICB2YXIgcGFyYW1zID0geyBtZXRob2QgOiAnUE9TVCcsIHVybCA6IHVybCwgYm9keTogXCJcIiB9O1xyXG4gIGlmIChvcHRpb25zLm1ldGFkYXRhKSB7XHJcbiAgICBwYXJhbXMuaGVhZGVycyA9IHsgXCJDb250ZW50LVR5cGVcIiA6IFwiYXBwbGljYXRpb24vanNvblwiIH07XHJcbiAgICBwYXJhbXMuYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMubWV0YWRhdGEpO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHBhcmFtcykudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCByZXBvcnQgaW5zdGFuY2UgZm9yIHNwZWNpZmllZCBpbnN0YW5jZSBJRFxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35SZXBvcnQjaW5zdGFuY2VcclxuICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gUmVwb3J0IGluc3RhbmNlIElEXHJcbiAqIEByZXR1cm5zIHtBbmFseXRpY3N+UmVwb3J0SW5zdGFuY2V9XHJcbiAqL1xyXG5SZXBvcnQucHJvdG90eXBlLmluc3RhbmNlID0gZnVuY3Rpb24oaWQpIHtcclxuICByZXR1cm4gbmV3IFJlcG9ydEluc3RhbmNlKHRoaXMsIGlkKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBMaXN0IHJlcG9ydCBpbnN0YW5jZXMgd2hpY2ggaGFkIGJlZW4gZXhlY3V0ZWQgYXN5bmNocm9ub3VzbHlcclxuICpcclxuICogQG1ldGhvZCBBbmFseXRpY3N+UmVwb3J0I2luc3RhbmNlc1xyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBcnJheS48QW5hbHl0aWNzflJlcG9ydEluc3RhbmNlQXR0cnM+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBcnJheS48QW5hbHl0aWNzflJlcG9ydEluc3RhbmNlQXR0cnM+Pn1cclxuICovXHJcblJlcG9ydC5wcm90b3R5cGUuaW5zdGFuY2VzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICB2YXIgdXJsID0gWyB0aGlzLl9jb25uLl9iYXNlVXJsKCksIFwiYW5hbHl0aWNzXCIsIFwicmVwb3J0c1wiLCB0aGlzLmlkLCBcImluc3RhbmNlc1wiIF0uam9pbignLycpO1xyXG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3QodXJsKS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogRGFzaGJvYXJkIG9iamVjdCBpbiB0aGUgQW5hbHl0aWNzIEFQSVxyXG4gKlxyXG4gKiBAcHJvdGVjdGVkXHJcbiAqIEBjbGFzcyBBbmFseXRpY3MtRGFzaGJvYXJkXHJcbiAqIEBwYXJhbSB7Q29ubmVjdGlvbn0gY29ubiBDb25uZWN0aW9uXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBJZFxyXG4gKi9cclxuXHJcbnZhciBEYXNoYm9hcmQgPSBmdW5jdGlvbihjb25uLCBpZCkge1xyXG4gIHRoaXMuX2Nvbm4gPSBjb25uO1xyXG4gIHRoaXMuaWQgPSBpZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZXNjcmliZSBkYXNoYm9hcmQgbWV0YWRhdGFcclxuICpcclxuICogQG1ldGhvZCBBbmFseXRpY3N+RGFzaGJvYXJkI2Rlc2NyaWJlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFuYWx5dGljcy1EYXNoYm9hcmRNZXRhZGF0YT59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzLURhc2hib2FyZE1ldGFkYXRhPn1cclxuICovXHJcbkRhc2hib2FyZC5wcm90b3R5cGUuZGVzY3JpYmUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHZhciB1cmwgPSBbIHRoaXMuX2Nvbm4uX2Jhc2VVcmwoKSwgXCJhbmFseXRpY3NcIiwgXCJkYXNoYm9hcmRzXCIsIHRoaXMuaWQsIFwiZGVzY3JpYmVcIiBdLmpvaW4oJy8nKTtcclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHVybCkudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBkZXRhaWxzIGFib3V0IGRhc2hib2FyZCBjb21wb25lbnRzXHJcbiAqXHJcbiAqIEBtZXRob2QgQW5hbHl0aWNzfkRhc2hib2FyZCNjb21wb25lbnRzXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFuYWx5dGljcy1EYXNoYm9hcmRDb21wb25lbnRNZXRhZGF0YT59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzLURhc2hib2FyZENvbXBvbmVudE1ldGFkYXRhPn1cclxuICovXHJcbkRhc2hib2FyZC5wcm90b3R5cGUuY29tcG9uZW50cyA9IGZ1bmN0aW9uKGNvbXBvbmVudElkcywgY2FsbGJhY2spIHtcclxuICB2YXIgdXJsID0gWyB0aGlzLl9jb25uLl9iYXNlVXJsKCksIFwiYW5hbHl0aWNzXCIsIFwiZGFzaGJvYXJkc1wiLCB0aGlzLmlkXS5qb2luKCcvJyk7XHJcbiAgdmFyIGRhdGEgPSB7fTtcclxuICBpZiAoXy5pc0Z1bmN0aW9uKGNvbXBvbmVudElkcykpIHtcclxuICAgIGNhbGxiYWNrID0gY29tcG9uZW50SWRzO1xyXG4gIH0gZWxzZSBpZiAoXy5pc0FycmF5KGNvbXBvbmVudElkcykpIHtcclxuICAgIGRhdGEuY29tcG9uZW50SWRzID0gY29tcG9uZW50SWRzO1xyXG4gIH0gZWxzZSBpZiAoXy5pc1N0cmluZyhjb21wb25lbnRJZHMpKSB7XHJcbiAgICBkYXRhLmNvbXBvbmVudElkcyA9IFsgY29tcG9uZW50SWRzIF07XHJcbiAgfVxyXG4gIHZhciBwYXJhbXMgPSB7IG1ldGhvZCA6ICdQT1NUJywgdXJsIDogdXJsLCBoZWFkZXJzIDogeyBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSwgYm9keSA6IEpTT04uc3RyaW5naWZ5KGRhdGEpfTtcclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHBhcmFtcykudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBkYXNoYm9hcmQgc3RhdHVzXHJcbiAqXHJcbiAqIEBtZXRob2QgQW5hbHl0aWNzfkRhc2hib2FyZCNzdGF0dXNcclxuICogQHBhcmFtIHtDYWxsYmFjay48QW5hbHl0aWNzLURhc2hib2FyZFN0YXR1c01ldGFkYXRhPn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBbmFseXRpY3MtRGFzaGJvYXJkU3RhdHVzTWV0YWRhdGE+fVxyXG4gKi9cclxuRGFzaGJvYXJkLnByb3RvdHlwZS5zdGF0dXMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHZhciB1cmwgPSBbIHRoaXMuX2Nvbm4uX2Jhc2VVcmwoKSwgXCJhbmFseXRpY3NcIiwgXCJkYXNoYm9hcmRzXCIsIHRoaXMuaWQsIFwic3RhdHVzXCIgXS5qb2luKCcvJyk7XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdCh1cmwpLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZWZyZXNoIGEgZGFzaGJvYXJkXHJcbiAqXHJcbiAqIEBtZXRob2QgQW5hbHl0aWNzfkRhc2hib2FyZCNyZWZyZXNoXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFuYWx5dGljcy1EYXNoYm9hcmRTdGF0dXNVcmw+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEFuYWx5dGljcy1EYXNoYm9hcmRTdGF0dXNVcmw+fVxyXG4gKi9cclxuRGFzaGJvYXJkLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICB2YXIgdXJsID0gWyB0aGlzLl9jb25uLl9iYXNlVXJsKCksIFwiYW5hbHl0aWNzXCIsIFwiZGFzaGJvYXJkc1wiLCB0aGlzLmlkIF0uam9pbignLycpO1xyXG4gIHZhciBwYXJhbXMgPSB7IG1ldGhvZCA6ICdQVVQnLCB1cmwgOiB1cmwsIGJvZHk6ICcnIH07XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdChwYXJhbXMpLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9uZSBhIGRhc2hib2FyZFxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35EYXNoYm9hcmQjY2xvbmVcclxuICogQHBhcmFtIHtDYWxsYmFjay48QW5hbHl0aWNzLURhc2hib2FyZE1ldGFkYXRhPn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBbmFseXRpY3MtRGFzaGJvYXJkTWV0YWRhdGE+fVxyXG4gKi9cclxuRGFzaGJvYXJkLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKG5hbWUsIGZvbGRlcmlkLCBjYWxsYmFjaykge1xyXG4gIHZhciB1cmwgPSBbIHRoaXMuX2Nvbm4uX2Jhc2VVcmwoKSwgXCJhbmFseXRpY3NcIiwgXCJkYXNoYm9hcmRzXCIgXS5qb2luKCcvJyk7XHJcbiAgdXJsICs9IFwiP2Nsb25lSWQ9XCIgKyB0aGlzLmlkO1xyXG4gIHZhciBkYXRhID0ge307XHJcblxyXG4gIGlmIChfLmlzT2JqZWN0KG5hbWUpKSB7XHJcbiAgICBkYXRhID0gbmFtZTtcclxuICAgIGNhbGxiYWNrID0gZm9sZGVyaWQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIGRhdGEubmFtZSA9IG5hbWU7XHJcbiAgICBkYXRhLmZvbGRlcklkID0gZm9sZGVyaWQ7XHJcbiAgfVxyXG4gIHZhciBwYXJhbXMgPSB7IG1ldGhvZCA6ICdQT1NUJywgdXJsIDogdXJsLCBoZWFkZXJzIDogeyBcIkNvbnRlbnQtVHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSwgYm9keSA6IEpTT04uc3RyaW5naWZ5KGRhdGEpfTtcclxuXHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdChwYXJhbXMpLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTeW5vbnltIG9mIEFuYWx5dGljc35EYXNoYm9hcmQjZGVzdHJveSgpXHJcbiAqXHJcbiAqIEBtZXRob2QgQW5hbHl0aWNzfkRhc2hib2FyZCNkZWxldGVcclxuICogQHBhcmFtIHtDYWxsYmFjay48QW5hbHl0aWNzfkRhc2hib2FyZFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzfkRhc2hib2FyZFJlc3VsdD59XHJcbiAqL1xyXG4vKipcclxuICogU3lub255bSBvZiBBbmFseXRpY3N+RGFzaGJvYXJkI2Rlc3Ryb3koKVxyXG4gKlxyXG4gKiBAbWV0aG9kIEFuYWx5dGljc35EYXNoYm9hcmQjZGVsXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFuYWx5dGljc35EYXNoYm9hcmRSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEFuYWx5dGljc35EYXNoYm9hcmRSZXN1bHQ+fVxyXG4gKi9cclxuLyoqXHJcbiAqIERlc3Ryb3kgYSBkYXNoYm9hcmRcclxuICpcclxuICogQG1ldGhvZCBBbmFseXRpY3N+RGFzaGJvYXJkI2Rlc3Ryb3lcclxuICogQHBhcmFtIHtDYWxsYmFjay48QW5hbHl0aWNzfkRhc2hib2FyZFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48QW5hbHl0aWNzfkRhc2hib2FyZFJlc3VsdD59XHJcbiAqL1xyXG5EYXNoYm9hcmQucHJvdG90eXBlW1wiZGVsZXRlXCJdID1cclxuRGFzaGJvYXJkLnByb3RvdHlwZS5kZWwgPVxyXG5EYXNoYm9hcmQucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHZhciB1cmwgPSBbIHRoaXMuX2Nvbm4uX2Jhc2VVcmwoKSwgXCJhbmFseXRpY3NcIiwgXCJkYXNoYm9hcmRzXCIsIHRoaXMuaWQgXS5qb2luKCcvJyk7XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdCh7bWV0aG9kOiAnREVMRVRFJywgdXJsOiB1cmx9KS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQVBJIGNsYXNzIGZvciBBbmFseXRpY3MgQVBJXHJcbiAqXHJcbiAqIEBjbGFzc1xyXG4gKiBAcGFyYW0ge0Nvbm5lY3Rpb259IGNvbm4gQ29ubmVjdGlvblxyXG4gKi9cclxudmFyIEFuYWx5dGljcyA9IGZ1bmN0aW9uKGNvbm4pIHtcclxuICB0aGlzLl9jb25uID0gY29ubjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgcmVwb3J0IG9iamVjdCBvZiBBbmFseXRpY3MgQVBJXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFJlcG9ydCBJZFxyXG4gKiBAcmV0dXJucyB7QW5hbHl0aWNzflJlcG9ydH1cclxuICovXHJcbkFuYWx5dGljcy5wcm90b3R5cGUucmVwb3J0ID0gZnVuY3Rpb24oaWQpIHtcclxuICByZXR1cm4gbmV3IFJlcG9ydCh0aGlzLl9jb25uLCBpZCk7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IHJlY2VudCByZXBvcnQgbGlzdFxyXG4gKlxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBcnJheS48QW5hbHl0aWNzflJlcG9ydEluZm8+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBcnJheS48QW5hbHl0aWNzflJlcG9ydEluZm8+Pn1cclxuICovXHJcbkFuYWx5dGljcy5wcm90b3R5cGUucmVwb3J0cyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHVybCA9IFsgdGhpcy5fY29ubi5fYmFzZVVybCgpLCBcImFuYWx5dGljc1wiLCBcInJlcG9ydHNcIiBdLmpvaW4oJy8nKTtcclxuICByZXR1cm4gdGhpcy5fY29ubi5yZXF1ZXN0KHVybCkudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBkYXNoYm9hcmQgb2JqZWN0IG9mIEFuYWx5dGljcyBBUElcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gRGFzaGJvYXJkIElkXHJcbiAqIEByZXR1cm5zIHtBbmFseXRpY3N+RGFzaGJvYXJkfVxyXG4gKi9cclxuQW5hbHl0aWNzLnByb3RvdHlwZS5kYXNoYm9hcmQgPSBmdW5jdGlvbihpZCkge1xyXG4gIHJldHVybiBuZXcgRGFzaGJvYXJkKHRoaXMuX2Nvbm4sIGlkKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgcmVjZW50IGRhc2hib2FyZCBsaXN0XHJcbiAqXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFycmF5LjxBbmFseXRpY3N+RGFzaGJvYXJkSW5mbz4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPEFycmF5LjxBbmFseXRpY3N+RGFzaGJvYXJkSW5mbz4+fVxyXG4gKi9cclxuQW5hbHl0aWNzLnByb3RvdHlwZS5kYXNoYm9hcmRzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICB2YXIgdXJsID0gWyB0aGlzLl9jb25uLl9iYXNlVXJsKCksIFwiYW5hbHl0aWNzXCIsIFwiZGFzaGJvYXJkc1wiIF0uam9pbignLycpO1xyXG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3QodXJsKS50aGVuQ2FsbChjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLypcclxuICogUmVnaXN0ZXIgaG9vayBpbiBjb25uZWN0aW9uIGluc3RhbnRpYXRpb24gZm9yIGR5bmFtaWNhbGx5IGFkZGluZyB0aGlzIEFQSSBtb2R1bGUgZmVhdHVyZXNcclxuICovXHJcbmpzZm9yY2Uub24oJ2Nvbm5lY3Rpb246bmV3JywgZnVuY3Rpb24oY29ubikge1xyXG4gIGNvbm4uYW5hbHl0aWNzID0gbmV3IEFuYWx5dGljcyhjb25uKTtcclxufSk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbmFseXRpY3M7XHJcbiJdfQ==
