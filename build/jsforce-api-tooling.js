(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Tooling = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @file Manages Tooling APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var jsforce = window.jsforce.require('./core'),
    _     = window.jsforce.require('lodash/core'),
    Cache = window.jsforce.require('./cache');

/**
 * API class for Tooling API call
 *
 * @class
 * @param {Connection} conn - Connection
 */
var Tooling = function(conn) {
  this._conn = conn;
  this._logger = conn._logger;
  var delegates = [
    "query",
    "queryMore",
    "_toRecordResult",
    "create",
    "_createSingle",
    "_createParallel",
    "_createMany",
    "insert",
    "retrieve",
    "_retrieveSingle",
    "_retrieveParallel",
    "_retrieveMany",
    "update",
    "_updateSingle",
    "_updateParallel",
    "_updateMany",
    "upsert",
    "del",
    "delete",
    "destroy",
    "_destroySingle",
    "_destroyParallel",
    "_destroyMany",
    "describe",
    "describeGlobal",
    "sobject"
  ];
  delegates.forEach(function(method) {
    this[method] = conn.constructor.prototype[method];
  }, this);

  this.cache = new Cache();

  var cacheOptions = {
    key: function(type) { return type ? "describe." + type : "describe"; }
  };
  this.describe$ = this.cache.makeCacheable(this.describe, this, cacheOptions);
  this.describe = this.cache.makeResponseCacheable(this.describe, this, cacheOptions);
  this.describeSObject$ = this.describe$;
  this.describeSObject = this.describe;

  cacheOptions = { key: 'describeGlobal' };
  this.describeGlobal$ = this.cache.makeCacheable(this.describeGlobal, this, cacheOptions);
  this.describeGlobal = this.cache.makeResponseCacheable(this.describeGlobal, this, cacheOptions);

  this.initialize();
};

/**
 * Initialize tooling API
 * @protected
 */
Tooling.prototype.initialize = function() {
  this.sobjects = {};
  this.cache.clear();
  this.cache.get('describeGlobal').removeAllListeners('value');
  this.cache.get('describeGlobal').on('value', _.bind(function(res) {
    if (res.result) {
      var types = _.map(res.result.sobjects, function(so) { return so.name; });
      types.forEach(this.sobject, this);
    }
  }, this));
};

/**
 * @private
 */
Tooling.prototype._baseUrl = function() {
  return this._conn._baseUrl() + "/tooling";
};

/**
 * @private
 */
Tooling.prototype._supports = function(feature) {
  // should return false in order not to use compsite collection
  if (feature === 'sobject-collection') {
    return false;
  }
  return this._conn._supports.apply(this._conn, arguments);
};

/**
 * @private
 */
Tooling.prototype.request = function() {
  return this._conn.request.apply(this._conn, arguments);
};

/**
 * Execute query by using SOQL
 *
 * @param {String} soql - SOQL string
 * @param {Callback.<QueryResult>} [callback] - Callback function
 * @returns {Query.<QueryResult>}
 */
/**
 * Query next record set by using query locator
 *
 * @method Tooling#query
 * @param {String} locator - Next record set locator
 * @param {Callback.<QueryResult>} [callback] - Callback function
 * @returns {Query.<QueryResult>}
 */
/**
 * Retrieve specified records
 *
 * @method Tooling#queryMore
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A record ID or array of record IDs
 * @param {Callback.<Record|Array.<Record>>} [callback] - Callback function
 * @returns {Promise.<Record|Array.<Record>>}
 */

/**
 * Synonym of Tooling#create()
 *
 * @method Tooling#insert
 * @param {String} type - SObject Type
 * @param {Object|Array.<Object>} records - A record or array of records to create
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
/**
 * Create records
 *
 * @method Tooling#create
 * @param {String} type - SObject Type
 * @param {Record|Array.<Record>} records - A record or array of records to create
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */

/**
 * Update records
 *
 * @method Tooling#update
 * @param {String} type - SObject Type
 * @param {Record|Array.<Record>} records - A record or array of records to update
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */

/**
 * Upsert records
 *
 * @method Tooling#upsert
 * @param {String} type - SObject Type
 * @param {Record|Array.<Record>} records - Record or array of records to upsert
 * @param {String} extIdField - External ID field name
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */

/**
 * Synonym of Tooling#destroy()
 *
 * @method Tooling#delete
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A ID or array of IDs to delete
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
/**
 * Synonym of Tooling#destroy()
 *
 * @method Tooling#del
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A ID or array of IDs to delete
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
/**
 * Delete records
 *
 * @method Tooling#destroy
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A ID or array of IDs to delete
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */

/**
 * Synonym of Tooling#describe()
 *
 * @method Tooling#describeSObject
 * @param {String} type - SObject Type
 * @param {Callback.<DescribeSObjectResult>} [callback] - Callback function
 * @returns {Promise.<DescribeSObjectResult>}
 */
/**
 * Describe SObject metadata
 *
 * @method Tooling#describe
 * @param {String} type - SObject Type
 * @param {Callback.<DescribeSObjectResult>} [callback] - Callback function
 * @returns {Promise.<DescribeSObjectResult>}
 */

/**
 * Describe global SObjects
 *
 * @method Tooling#describeGlobal
 * @param {Callback.<DescribeGlobalResult>} [callback] - Callback function
 * @returns {Promise.<DescribeGlobalResult>}
 */

/**
 * Get SObject instance
 *
 * @method Tooling#sobject
 * @param {String} type - SObject Type
 * @returns {SObject}
 */

/**
 * @typedef {Object} Tooling~ExecuteAnonymousResult
 * @prop {Boolean} compiled - Flag if the query is compiled successfully
 * @prop {String} compileProblem - Error reason in compilation
 * @prop {Boolean} success - Flag if the code is executed successfully
 * @prop {Number} line - Line number for the error
 * @prop {Number} column - Column number for the error
 * @prop {String} exceptionMessage - Exception message
 * @prop {String} exceptionStackTrace - Exception stack trace
 */
/**
 * Executes Apex code anonymously
 *
 * @param {String} body - Anonymous Apex code
 * @param {Callback.<Tooling~ExecuteAnonymousResult>} [callback] - Callback function
 * @returns {Promise.<Tooling~ExecuteAnonymousResult>}
 */
Tooling.prototype.executeAnonymous = function(body, callback) {
  var url = this._baseUrl() + "/executeAnonymous?anonymousBody=" + encodeURIComponent(body);
  return this.request(url).thenCall(callback);
};

/**
 * Executes Apex tests asynchronously
 *
 * @param {Array.<String>} classids - Comma separated list of class IDs
 * @param {Callback.<Tooling~ExecuteAnonymousResult>} [callback] - Callback function
 * @returns {Promise.<Tooling~ExecuteAnonymousResult>}
 */
Tooling.prototype.runTestsAsynchronous = function(classids, callback) {
  var url = this._baseUrl() + "/runTestsAsynchronous/";
  return this._conn.requestPost(url, {classids : classids.join(',')}, undefined, callback);
};

/**
 * Executes Apex tests synchronously
 *
 * @param {Array.<String>} classnames - Comma separated list of class Names
 * @param {Callback.<Tooling~ExecuteAnonymousResult>} [callback] - Callback function
 * @returns {Promise.<Tooling~ExecuteAnonymousResult>}
 */
Tooling.prototype.runTestsSynchronous = function(classnames, callback) {
  var url = this._baseUrl() + "/runTestsSynchronous/";
  return this._conn.requestPost(url, {classnames : classnames.join(',')}, undefined, callback);
};

/**
 * @typedef {Object} Tooling~CompletionsResult
 * @prop {Object} publicDeclarations
 */
/**
 * Retrieves available code completions of the referenced type
 *
 * @param {String} [type] - completion type (default 'apex')
 * @param {Callback.<Tooling~CompletionsResult>} [callback] - Callback function
 * @returns {Promise.<Tooling~CompletionsResult>}
 */
Tooling.prototype.completions = function(type, callback) {
  if (!_.isString(type)) {
    callback = type;
    type = 'apex';
  }
  var url = this._baseUrl() + "/completions?type=" + encodeURIComponent(type);
  return this.request(url).thenCall(callback);
};


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.tooling = new Tooling(conn);
});


module.exports = Tooling;

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL3Rvb2xpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXHJcbiAqIEBmaWxlIE1hbmFnZXMgVG9vbGluZyBBUElzXHJcbiAqIEBhdXRob3IgU2hpbmljaGkgVG9taXRhIDxzaGluaWNoaS50b21pdGFAZ21haWwuY29tPlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBqc2ZvcmNlID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9jb3JlJyksXHJcbiAgICBfICAgICA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJ2xvZGFzaC9jb3JlJyksXHJcbiAgICBDYWNoZSA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vY2FjaGUnKTtcclxuXHJcbi8qKlxyXG4gKiBBUEkgY2xhc3MgZm9yIFRvb2xpbmcgQVBJIGNhbGxcclxuICpcclxuICogQGNsYXNzXHJcbiAqIEBwYXJhbSB7Q29ubmVjdGlvbn0gY29ubiAtIENvbm5lY3Rpb25cclxuICovXHJcbnZhciBUb29saW5nID0gZnVuY3Rpb24oY29ubikge1xyXG4gIHRoaXMuX2Nvbm4gPSBjb25uO1xyXG4gIHRoaXMuX2xvZ2dlciA9IGNvbm4uX2xvZ2dlcjtcclxuICB2YXIgZGVsZWdhdGVzID0gW1xyXG4gICAgXCJxdWVyeVwiLFxyXG4gICAgXCJxdWVyeU1vcmVcIixcclxuICAgIFwiX3RvUmVjb3JkUmVzdWx0XCIsXHJcbiAgICBcImNyZWF0ZVwiLFxyXG4gICAgXCJfY3JlYXRlU2luZ2xlXCIsXHJcbiAgICBcIl9jcmVhdGVQYXJhbGxlbFwiLFxyXG4gICAgXCJfY3JlYXRlTWFueVwiLFxyXG4gICAgXCJpbnNlcnRcIixcclxuICAgIFwicmV0cmlldmVcIixcclxuICAgIFwiX3JldHJpZXZlU2luZ2xlXCIsXHJcbiAgICBcIl9yZXRyaWV2ZVBhcmFsbGVsXCIsXHJcbiAgICBcIl9yZXRyaWV2ZU1hbnlcIixcclxuICAgIFwidXBkYXRlXCIsXHJcbiAgICBcIl91cGRhdGVTaW5nbGVcIixcclxuICAgIFwiX3VwZGF0ZVBhcmFsbGVsXCIsXHJcbiAgICBcIl91cGRhdGVNYW55XCIsXHJcbiAgICBcInVwc2VydFwiLFxyXG4gICAgXCJkZWxcIixcclxuICAgIFwiZGVsZXRlXCIsXHJcbiAgICBcImRlc3Ryb3lcIixcclxuICAgIFwiX2Rlc3Ryb3lTaW5nbGVcIixcclxuICAgIFwiX2Rlc3Ryb3lQYXJhbGxlbFwiLFxyXG4gICAgXCJfZGVzdHJveU1hbnlcIixcclxuICAgIFwiZGVzY3JpYmVcIixcclxuICAgIFwiZGVzY3JpYmVHbG9iYWxcIixcclxuICAgIFwic29iamVjdFwiXHJcbiAgXTtcclxuICBkZWxlZ2F0ZXMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcclxuICAgIHRoaXNbbWV0aG9kXSA9IGNvbm4uY29uc3RydWN0b3IucHJvdG90eXBlW21ldGhvZF07XHJcbiAgfSwgdGhpcyk7XHJcblxyXG4gIHRoaXMuY2FjaGUgPSBuZXcgQ2FjaGUoKTtcclxuXHJcbiAgdmFyIGNhY2hlT3B0aW9ucyA9IHtcclxuICAgIGtleTogZnVuY3Rpb24odHlwZSkgeyByZXR1cm4gdHlwZSA/IFwiZGVzY3JpYmUuXCIgKyB0eXBlIDogXCJkZXNjcmliZVwiOyB9XHJcbiAgfTtcclxuICB0aGlzLmRlc2NyaWJlJCA9IHRoaXMuY2FjaGUubWFrZUNhY2hlYWJsZSh0aGlzLmRlc2NyaWJlLCB0aGlzLCBjYWNoZU9wdGlvbnMpO1xyXG4gIHRoaXMuZGVzY3JpYmUgPSB0aGlzLmNhY2hlLm1ha2VSZXNwb25zZUNhY2hlYWJsZSh0aGlzLmRlc2NyaWJlLCB0aGlzLCBjYWNoZU9wdGlvbnMpO1xyXG4gIHRoaXMuZGVzY3JpYmVTT2JqZWN0JCA9IHRoaXMuZGVzY3JpYmUkO1xyXG4gIHRoaXMuZGVzY3JpYmVTT2JqZWN0ID0gdGhpcy5kZXNjcmliZTtcclxuXHJcbiAgY2FjaGVPcHRpb25zID0geyBrZXk6ICdkZXNjcmliZUdsb2JhbCcgfTtcclxuICB0aGlzLmRlc2NyaWJlR2xvYmFsJCA9IHRoaXMuY2FjaGUubWFrZUNhY2hlYWJsZSh0aGlzLmRlc2NyaWJlR2xvYmFsLCB0aGlzLCBjYWNoZU9wdGlvbnMpO1xyXG4gIHRoaXMuZGVzY3JpYmVHbG9iYWwgPSB0aGlzLmNhY2hlLm1ha2VSZXNwb25zZUNhY2hlYWJsZSh0aGlzLmRlc2NyaWJlR2xvYmFsLCB0aGlzLCBjYWNoZU9wdGlvbnMpO1xyXG5cclxuICB0aGlzLmluaXRpYWxpemUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRvb2xpbmcgQVBJXHJcbiAqIEBwcm90ZWN0ZWRcclxuICovXHJcblRvb2xpbmcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICB0aGlzLnNvYmplY3RzID0ge307XHJcbiAgdGhpcy5jYWNoZS5jbGVhcigpO1xyXG4gIHRoaXMuY2FjaGUuZ2V0KCdkZXNjcmliZUdsb2JhbCcpLnJlbW92ZUFsbExpc3RlbmVycygndmFsdWUnKTtcclxuICB0aGlzLmNhY2hlLmdldCgnZGVzY3JpYmVHbG9iYWwnKS5vbigndmFsdWUnLCBfLmJpbmQoZnVuY3Rpb24ocmVzKSB7XHJcbiAgICBpZiAocmVzLnJlc3VsdCkge1xyXG4gICAgICB2YXIgdHlwZXMgPSBfLm1hcChyZXMucmVzdWx0LnNvYmplY3RzLCBmdW5jdGlvbihzbykgeyByZXR1cm4gc28ubmFtZTsgfSk7XHJcbiAgICAgIHR5cGVzLmZvckVhY2godGhpcy5zb2JqZWN0LCB0aGlzKTtcclxuICAgIH1cclxuICB9LCB0aGlzKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHByaXZhdGVcclxuICovXHJcblRvb2xpbmcucHJvdG90eXBlLl9iYXNlVXJsID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4uX2Jhc2VVcmwoKSArIFwiL3Rvb2xpbmdcIjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuVG9vbGluZy5wcm90b3R5cGUuX3N1cHBvcnRzID0gZnVuY3Rpb24oZmVhdHVyZSkge1xyXG4gIC8vIHNob3VsZCByZXR1cm4gZmFsc2UgaW4gb3JkZXIgbm90IHRvIHVzZSBjb21wc2l0ZSBjb2xsZWN0aW9uXHJcbiAgaWYgKGZlYXR1cmUgPT09ICdzb2JqZWN0LWNvbGxlY3Rpb24nKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLl9jb25uLl9zdXBwb3J0cy5hcHBseSh0aGlzLl9jb25uLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5Ub29saW5nLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdC5hcHBseSh0aGlzLl9jb25uLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEV4ZWN1dGUgcXVlcnkgYnkgdXNpbmcgU09RTFxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc29xbCAtIFNPUUwgc3RyaW5nXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFF1ZXJ5UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtRdWVyeS48UXVlcnlSZXN1bHQ+fVxyXG4gKi9cclxuLyoqXHJcbiAqIFF1ZXJ5IG5leHQgcmVjb3JkIHNldCBieSB1c2luZyBxdWVyeSBsb2NhdG9yXHJcbiAqXHJcbiAqIEBtZXRob2QgVG9vbGluZyNxdWVyeVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYXRvciAtIE5leHQgcmVjb3JkIHNldCBsb2NhdG9yXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFF1ZXJ5UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtRdWVyeS48UXVlcnlSZXN1bHQ+fVxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHJpZXZlIHNwZWNpZmllZCByZWNvcmRzXHJcbiAqXHJcbiAqIEBtZXRob2QgVG9vbGluZyNxdWVyeU1vcmVcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBTT2JqZWN0IFR5cGVcclxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXkuPFN0cmluZz59IGlkcyAtIEEgcmVjb3JkIElEIG9yIGFycmF5IG9mIHJlY29yZCBJRHNcclxuICogQHBhcmFtIHtDYWxsYmFjay48UmVjb3JkfEFycmF5LjxSZWNvcmQ+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxSZWNvcmR8QXJyYXkuPFJlY29yZD4+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBTeW5vbnltIG9mIFRvb2xpbmcjY3JlYXRlKClcclxuICpcclxuICogQG1ldGhvZCBUb29saW5nI2luc2VydFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFNPYmplY3QgVHlwZVxyXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheS48T2JqZWN0Pn0gcmVjb3JkcyAtIEEgcmVjb3JkIG9yIGFycmF5IG9mIHJlY29yZHMgdG8gY3JlYXRlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFJlY29yZFJlc3VsdHxBcnJheS48UmVjb3JkUmVzdWx0Pj59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48UmVjb3JkUmVzdWx0fEFycmF5LjxSZWNvcmRSZXN1bHQ+Pn1cclxuICovXHJcbi8qKlxyXG4gKiBDcmVhdGUgcmVjb3Jkc1xyXG4gKlxyXG4gKiBAbWV0aG9kIFRvb2xpbmcjY3JlYXRlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU09iamVjdCBUeXBlXHJcbiAqIEBwYXJhbSB7UmVjb3JkfEFycmF5LjxSZWNvcmQ+fSByZWNvcmRzIC0gQSByZWNvcmQgb3IgYXJyYXkgb2YgcmVjb3JkcyB0byBjcmVhdGVcclxuICogQHBhcmFtIHtDYWxsYmFjay48UmVjb3JkUmVzdWx0fEFycmF5LjxSZWNvcmRSZXN1bHQ+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxSZWNvcmRSZXN1bHR8QXJyYXkuPFJlY29yZFJlc3VsdD4+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgcmVjb3Jkc1xyXG4gKlxyXG4gKiBAbWV0aG9kIFRvb2xpbmcjdXBkYXRlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU09iamVjdCBUeXBlXHJcbiAqIEBwYXJhbSB7UmVjb3JkfEFycmF5LjxSZWNvcmQ+fSByZWNvcmRzIC0gQSByZWNvcmQgb3IgYXJyYXkgb2YgcmVjb3JkcyB0byB1cGRhdGVcclxuICogQHBhcmFtIHtDYWxsYmFjay48UmVjb3JkUmVzdWx0fEFycmF5LjxSZWNvcmRSZXN1bHQ+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxSZWNvcmRSZXN1bHR8QXJyYXkuPFJlY29yZFJlc3VsdD4+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBVcHNlcnQgcmVjb3Jkc1xyXG4gKlxyXG4gKiBAbWV0aG9kIFRvb2xpbmcjdXBzZXJ0XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU09iamVjdCBUeXBlXHJcbiAqIEBwYXJhbSB7UmVjb3JkfEFycmF5LjxSZWNvcmQ+fSByZWNvcmRzIC0gUmVjb3JkIG9yIGFycmF5IG9mIHJlY29yZHMgdG8gdXBzZXJ0XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHRJZEZpZWxkIC0gRXh0ZXJuYWwgSUQgZmllbGQgbmFtZVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxSZWNvcmRSZXN1bHR8QXJyYXkuPFJlY29yZFJlc3VsdD4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2tcclxuICogQHJldHVybnMge1Byb21pc2UuPFJlY29yZFJlc3VsdHxBcnJheS48UmVjb3JkUmVzdWx0Pj59XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFN5bm9ueW0gb2YgVG9vbGluZyNkZXN0cm95KClcclxuICpcclxuICogQG1ldGhvZCBUb29saW5nI2RlbGV0ZVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFNPYmplY3QgVHlwZVxyXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheS48U3RyaW5nPn0gaWRzIC0gQSBJRCBvciBhcnJheSBvZiBJRHMgdG8gZGVsZXRlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFJlY29yZFJlc3VsdHxBcnJheS48UmVjb3JkUmVzdWx0Pj59IFtjYWxsYmFja10gLSBDYWxsYmFja1xyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48UmVjb3JkUmVzdWx0fEFycmF5LjxSZWNvcmRSZXN1bHQ+Pn1cclxuICovXHJcbi8qKlxyXG4gKiBTeW5vbnltIG9mIFRvb2xpbmcjZGVzdHJveSgpXHJcbiAqXHJcbiAqIEBtZXRob2QgVG9vbGluZyNkZWxcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBTT2JqZWN0IFR5cGVcclxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXkuPFN0cmluZz59IGlkcyAtIEEgSUQgb3IgYXJyYXkgb2YgSURzIHRvIGRlbGV0ZVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxSZWNvcmRSZXN1bHR8QXJyYXkuPFJlY29yZFJlc3VsdD4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2tcclxuICogQHJldHVybnMge1Byb21pc2UuPFJlY29yZFJlc3VsdHxBcnJheS48UmVjb3JkUmVzdWx0Pj59XHJcbiAqL1xyXG4vKipcclxuICogRGVsZXRlIHJlY29yZHNcclxuICpcclxuICogQG1ldGhvZCBUb29saW5nI2Rlc3Ryb3lcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBTT2JqZWN0IFR5cGVcclxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXkuPFN0cmluZz59IGlkcyAtIEEgSUQgb3IgYXJyYXkgb2YgSURzIHRvIGRlbGV0ZVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxSZWNvcmRSZXN1bHR8QXJyYXkuPFJlY29yZFJlc3VsdD4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2tcclxuICogQHJldHVybnMge1Byb21pc2UuPFJlY29yZFJlc3VsdHxBcnJheS48UmVjb3JkUmVzdWx0Pj59XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFN5bm9ueW0gb2YgVG9vbGluZyNkZXNjcmliZSgpXHJcbiAqXHJcbiAqIEBtZXRob2QgVG9vbGluZyNkZXNjcmliZVNPYmplY3RcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBTT2JqZWN0IFR5cGVcclxuICogQHBhcmFtIHtDYWxsYmFjay48RGVzY3JpYmVTT2JqZWN0UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxEZXNjcmliZVNPYmplY3RSZXN1bHQ+fVxyXG4gKi9cclxuLyoqXHJcbiAqIERlc2NyaWJlIFNPYmplY3QgbWV0YWRhdGFcclxuICpcclxuICogQG1ldGhvZCBUb29saW5nI2Rlc2NyaWJlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gU09iamVjdCBUeXBlXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPERlc2NyaWJlU09iamVjdFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48RGVzY3JpYmVTT2JqZWN0UmVzdWx0Pn1cclxuICovXHJcblxyXG4vKipcclxuICogRGVzY3JpYmUgZ2xvYmFsIFNPYmplY3RzXHJcbiAqXHJcbiAqIEBtZXRob2QgVG9vbGluZyNkZXNjcmliZUdsb2JhbFxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxEZXNjcmliZUdsb2JhbFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48RGVzY3JpYmVHbG9iYWxSZXN1bHQ+fVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHZXQgU09iamVjdCBpbnN0YW5jZVxyXG4gKlxyXG4gKiBAbWV0aG9kIFRvb2xpbmcjc29iamVjdFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFNPYmplY3QgVHlwZVxyXG4gKiBAcmV0dXJucyB7U09iamVjdH1cclxuICovXHJcblxyXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gVG9vbGluZ35FeGVjdXRlQW5vbnltb3VzUmVzdWx0XHJcbiAqIEBwcm9wIHtCb29sZWFufSBjb21waWxlZCAtIEZsYWcgaWYgdGhlIHF1ZXJ5IGlzIGNvbXBpbGVkIHN1Y2Nlc3NmdWxseVxyXG4gKiBAcHJvcCB7U3RyaW5nfSBjb21waWxlUHJvYmxlbSAtIEVycm9yIHJlYXNvbiBpbiBjb21waWxhdGlvblxyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gc3VjY2VzcyAtIEZsYWcgaWYgdGhlIGNvZGUgaXMgZXhlY3V0ZWQgc3VjY2Vzc2Z1bGx5XHJcbiAqIEBwcm9wIHtOdW1iZXJ9IGxpbmUgLSBMaW5lIG51bWJlciBmb3IgdGhlIGVycm9yXHJcbiAqIEBwcm9wIHtOdW1iZXJ9IGNvbHVtbiAtIENvbHVtbiBudW1iZXIgZm9yIHRoZSBlcnJvclxyXG4gKiBAcHJvcCB7U3RyaW5nfSBleGNlcHRpb25NZXNzYWdlIC0gRXhjZXB0aW9uIG1lc3NhZ2VcclxuICogQHByb3Age1N0cmluZ30gZXhjZXB0aW9uU3RhY2tUcmFjZSAtIEV4Y2VwdGlvbiBzdGFjayB0cmFjZVxyXG4gKi9cclxuLyoqXHJcbiAqIEV4ZWN1dGVzIEFwZXggY29kZSBhbm9ueW1vdXNseVxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gYm9keSAtIEFub255bW91cyBBcGV4IGNvZGVcclxuICogQHBhcmFtIHtDYWxsYmFjay48VG9vbGluZ35FeGVjdXRlQW5vbnltb3VzUmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxUb29saW5nfkV4ZWN1dGVBbm9ueW1vdXNSZXN1bHQ+fVxyXG4gKi9cclxuVG9vbGluZy5wcm90b3R5cGUuZXhlY3V0ZUFub255bW91cyA9IGZ1bmN0aW9uKGJvZHksIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHVybCA9IHRoaXMuX2Jhc2VVcmwoKSArIFwiL2V4ZWN1dGVBbm9ueW1vdXM/YW5vbnltb3VzQm9keT1cIiArIGVuY29kZVVSSUNvbXBvbmVudChib2R5KTtcclxuICByZXR1cm4gdGhpcy5yZXF1ZXN0KHVybCkudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEV4ZWN1dGVzIEFwZXggdGVzdHMgYXN5bmNocm9ub3VzbHlcclxuICpcclxuICogQHBhcmFtIHtBcnJheS48U3RyaW5nPn0gY2xhc3NpZHMgLSBDb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBJRHNcclxuICogQHBhcmFtIHtDYWxsYmFjay48VG9vbGluZ35FeGVjdXRlQW5vbnltb3VzUmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxUb29saW5nfkV4ZWN1dGVBbm9ueW1vdXNSZXN1bHQ+fVxyXG4gKi9cclxuVG9vbGluZy5wcm90b3R5cGUucnVuVGVzdHNBc3luY2hyb25vdXMgPSBmdW5jdGlvbihjbGFzc2lkcywgY2FsbGJhY2spIHtcclxuICB2YXIgdXJsID0gdGhpcy5fYmFzZVVybCgpICsgXCIvcnVuVGVzdHNBc3luY2hyb25vdXMvXCI7XHJcbiAgcmV0dXJuIHRoaXMuX2Nvbm4ucmVxdWVzdFBvc3QodXJsLCB7Y2xhc3NpZHMgOiBjbGFzc2lkcy5qb2luKCcsJyl9LCB1bmRlZmluZWQsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFeGVjdXRlcyBBcGV4IHRlc3RzIHN5bmNocm9ub3VzbHlcclxuICpcclxuICogQHBhcmFtIHtBcnJheS48U3RyaW5nPn0gY2xhc3NuYW1lcyAtIENvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGNsYXNzIE5hbWVzXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFRvb2xpbmd+RXhlY3V0ZUFub255bW91c1Jlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48VG9vbGluZ35FeGVjdXRlQW5vbnltb3VzUmVzdWx0Pn1cclxuICovXHJcblRvb2xpbmcucHJvdG90eXBlLnJ1blRlc3RzU3luY2hyb25vdXMgPSBmdW5jdGlvbihjbGFzc25hbWVzLCBjYWxsYmFjaykge1xyXG4gIHZhciB1cmwgPSB0aGlzLl9iYXNlVXJsKCkgKyBcIi9ydW5UZXN0c1N5bmNocm9ub3VzL1wiO1xyXG4gIHJldHVybiB0aGlzLl9jb25uLnJlcXVlc3RQb3N0KHVybCwge2NsYXNzbmFtZXMgOiBjbGFzc25hbWVzLmpvaW4oJywnKX0sIHVuZGVmaW5lZCwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRvb2xpbmd+Q29tcGxldGlvbnNSZXN1bHRcclxuICogQHByb3Age09iamVjdH0gcHVibGljRGVjbGFyYXRpb25zXHJcbiAqL1xyXG4vKipcclxuICogUmV0cmlldmVzIGF2YWlsYWJsZSBjb2RlIGNvbXBsZXRpb25zIG9mIHRoZSByZWZlcmVuY2VkIHR5cGVcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IFt0eXBlXSAtIGNvbXBsZXRpb24gdHlwZSAoZGVmYXVsdCAnYXBleCcpXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFRvb2xpbmd+Q29tcGxldGlvbnNSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPFRvb2xpbmd+Q29tcGxldGlvbnNSZXN1bHQ+fVxyXG4gKi9cclxuVG9vbGluZy5wcm90b3R5cGUuY29tcGxldGlvbnMgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaykge1xyXG4gIGlmICghXy5pc1N0cmluZyh0eXBlKSkge1xyXG4gICAgY2FsbGJhY2sgPSB0eXBlO1xyXG4gICAgdHlwZSA9ICdhcGV4JztcclxuICB9XHJcbiAgdmFyIHVybCA9IHRoaXMuX2Jhc2VVcmwoKSArIFwiL2NvbXBsZXRpb25zP3R5cGU9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodHlwZSk7XHJcbiAgcmV0dXJuIHRoaXMucmVxdWVzdCh1cmwpLnRoZW5DYWxsKGNhbGxiYWNrKTtcclxufTtcclxuXHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLypcclxuICogUmVnaXN0ZXIgaG9vayBpbiBjb25uZWN0aW9uIGluc3RhbnRpYXRpb24gZm9yIGR5bmFtaWNhbGx5IGFkZGluZyB0aGlzIEFQSSBtb2R1bGUgZmVhdHVyZXNcclxuICovXHJcbmpzZm9yY2Uub24oJ2Nvbm5lY3Rpb246bmV3JywgZnVuY3Rpb24oY29ubikge1xyXG4gIGNvbm4udG9vbGluZyA9IG5ldyBUb29saW5nKGNvbm4pO1xyXG59KTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2xpbmc7XHJcbiJdfQ==
