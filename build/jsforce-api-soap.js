(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Soap = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @file Salesforce SOAP API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var _ = window.jsforce.require('lodash/core');
var jsforce = window.jsforce.require('./core');
var SOAP = window.jsforce.require('./soap');

/**
 * API class for Partner SOAP call
 *
 * @class
 * @param {Connection} conn - Connection
 */
var SoapApi = module.exports = function(conn) {
  this._conn = conn;
};

/**
 * Call SOAP Api (Partner) endpoint
 * @private
 */
SoapApi.prototype._invoke = function(method, message, schema, callback) {
  var soapEndpoint = new SOAP(this._conn, {
    xmlns: "urn:partner.soap.sforce.com",
    endpointUrl: this._conn.instanceUrl + "/services/Soap/u/" + this._conn.version
  });
  return soapEndpoint.invoke(method, message, { result: schema }).then(function(res) {
    return res.result;
  }).thenCall(callback);
};


/* */
var Schemas = {};

/**
 * @typedef SoapApi~LeadConvert
 * @prop {String} convertedStatus - Status of converted lead
 * @prop {String} leadId - Lead record Id to convert
 * @prop {String} [accountId] - Account record Id to assign the converted record
 * @prop {String} [contactId] - Contact record Id to assign the converted record
 * @prop {Boolean} [doNotCreateOpportunity] - True if you don't want to create a new opportunity
 * @prop {String} [opportunityName] - Name of opportunity to create
 * @prop {Boolean} [overwriteLeadSource] - True if overwriting lead source
 * @prop {String} [ownerId] - Owner Id
 * @prop {Boolean} [sendNotificationEmail] - True if send notification email
 */
/**
 * @typedef SoapApi~LeadConvertResult
 * @prop {String} leadId - Lead record Id to convert
 * @prop {String} [accountId] - Account record Id of converted lead
 * @prop {String} [contactId] - Contact record Id of converted lead
 * @prop {String} [opportunityId] - Opportunity record Id created in conversion
 * @prop {Boolean} success - True if successfully converted
 * @prop {Array.<Object>} errors - Error
 */
/**
 * Converts a Lead into an Account, Contact, or (optionally) an Opportunity.
 *
 * @param {SoapApi~LeadConvert|Array.<SoapApi~LeadConvert>} leadConverts
 * @param {Callback.<SoapApi~LeadConvertResult|Array.<SoapApi~LeadConvertResult>>} [callback] - Callback function
 * @returns {Promise.<SoapApi~LeadConvertResult|Array.<SoapApi~LeadConvertResult>>}
 */
SoapApi.prototype.convertLead = function(leadConverts, callback) {
  var schema = _.isArray(leadConverts) ? [ Schemas.LeadConvertResult ] : Schemas.LeadConvertResult;
  return this._invoke("convertLead", { leadConverts: leadConverts }, schema, callback);
};
Schemas.LeadConvertResult = {
  success: 'boolean',
  errors: [],
  leadId: 'string',
  accountId: 'string',
  contactId: 'string',
  opportunityId: 'string'
};

/**
 * @typedef SoapApi~MergeRequest
 * @prop {Object} masterRecord - The merge destination record
 * @prop {Array.<String>} recordToMergeIds - Ids of records to merge
 */
/**
 * @typedef SoapApi~MergeResult
 * @prop {Boolean} success - True if successfully merged
 * @prop {Array.<Object>} errors - Error
 * @prop {String} id - ID of the master record
 * @prop {Array.<String>} mergedRecordIds - ID of the records that were merged into the master record
 * @prop {Array.<String>} updatedRelatedIds - ID of all related records that were moved (re-parented) as a result of the merge
 */

/**
 * Merge up to three records into one
 *
 * @param {SoapApi~MergeRequest|Array.<SoapApi~MergeRequest>} mergeRequests
 * @param {Callback.<SoapApi~MergeResult|Array.<SoapApi~MergeResult>>} [callback] - Callback function
 * @returns {Promise.<SoapApi~MergeResult|Array.<SoapApi~MergeResult>>}
 */
SoapApi.prototype.merge = function(mergeRequests, callback) {
  var schema = _.isArray(mergeRequests) ? [ Schemas.MergeResult ] : Schemas.MergeResult;
  return this._invoke("merge", { mergeRequests: mergeRequests }, schema, callback);
};
Schemas.MergeResult = {
  success: 'boolean',
  errors: [],
  id: 'string',
  mergedRecordIds: ['string'],
  updatedRelatedIds: ['string']
};


/**
 * @typedef SoapApi~EmptyRecycleBinResult
 * @prop {String} id - ID of an sObject that you attempted to delete from the Recycle Bin
 * @prop {Boolean} success - Whether the call succeeded (true) or not (false) for this record
 * @prop {Array.<Object>} errors - Errors
 */
/**
 * Delete records from the recycle bin immediately
 *
 * @param {Array.<String>} ids - Record ids to empty from recycle bin
 * @param {Callback.<Array.<SoapApi~EmptyRecycleBinResult>>} [callback] - Callback function
 * @returns {Promise.<Array.<SoapApi~EmptyRecycleBinResult>>}
 */
SoapApi.prototype.emptyRecycleBin = function(ids, callback) {
  return this._invoke("emptyRecycleBin", { ids: ids }, [ Schemas.EmptyRecycleBinResult ], callback);
};
Schemas.EmptyRecycleBinResult = {
  id: 'string',
  success: 'boolean',
  errors: []
};


/**
 * @typedef SoapApi~DescribeTabSetResult
 * @prop {String} label - The display label for this standard or custom app
 * @prop {String} logoUrl - A fully qualified URL to the logo image associated with the standard or custom app
 * @prop {String} namespace - Namespace of application package
 * @prop {Boolean} selected - If true, then this standard or custom app is the user’s currently selected app
 * @prop {Array.<SoapApi~DescribeTab>} tabs - An array of tabs that are displayed for the specified standard app or custom app
 */
/**
 * @typedef SoapApi~DescribeTab
 * @prop {Array.<Object>} colors - Array of color information used for a tab
 * @prop {Boolean} custom - true if this is a custom tab
 * @prop {String} iconUrl - The URL for the main 32 x 32 pixel icon for a tab
 * @prop {Array.<Object>} icons - Array of icon information used for a tab
 * @prop {String} label - The display label for this tab
 * @prop {String} miniIconUrl - The URL for the 16 x 16 pixel icon that represents a tab
 * @prop {String} name - The API name of the tab
 * @prop {String} sobjectName - The name of the sObject that is primarily displayed on this tab
 * @prop {String} url - A fully qualified URL for viewing this tab
 */
/**
 * Returns information about the standard and custom apps available to the logged-in user
 *
 * @param {Callback.<Array.<SoapApi~DescribeTabSetResult>>} [callback] - Callback function
 * @returns {Promise.<Array.<SoapApi~DescribeTabSetResult>>}
 */
SoapApi.prototype.describeTabs = function(callback) {
  return this._invoke("describeTabs", {}, [ Schemas.DescribeTabSetResult ], callback);
};
Schemas.DescribeTabSetResult = {
  label: 'string',
  logoUrl: 'string',
  namespace: 'string',
  selected: 'boolean',
  tabs: [{
    colors: [{
      theme: 'string',
      color: 'string',
      context: 'string'
    }],
    iconUrl: 'string',
    icons: [{
      theme: 'string',
      height: 'number',
      width: 'number',
      url: 'string',
      contentType: 'string'
    }],
    label: 'string',
    custom: 'boolean',
    miniIconUrl: 'string',
    name: 'string',
    sobjectName: 'string',
    url: 'string'
  }]
};

/**
 * Retrieves the current system timestamp (Coordinated Universal Time (UTC) time zone) from the API
 *
 * @typedef SoapApi~ServerTimestampResult
 * @prop {String} timestamp - Timestamp
 */
/**
 * @param {Callback.<SoapApi~ServerTimestampResult>} [callback] - Callback function
 * @returns {Promise.<SoapApi~ServerTimestampResult>}
 */
SoapApi.prototype.getServerTimestamp = function(callback) {
  return this._invoke("getServerTimestamp", {}, Schemas.GetServerTimestampResult, callback);
};
Schemas.GetServerTimestampResult = {
  timestamp: 'string'
};

/**
 * @typedef SoapApi~UserInfoResult
 * @prop {Boolean} accessibilityMode
 * @prop {String} currencySymbol
 * @prop {Number} orgAttachmentFileSizeLimit
 * @prop {String} orgDefaultCurrencyIsoCode
 * @prop {String} orgDisallowHtmlAttachments
 * @prop {Boolean} orgHasPersonAccounts
 * @prop {String} organizationId
 * @prop {Boolean} organizationMultiCurrency
 * @prop {String} organizationName
 * @prop {String} profileId
 * @prop {String} roleId
 * @prop {Number} sessionSecondsValid
 * @prop {String} userDefaultCurrencyIsoCode
 * @prop {String} userEmail
 * @prop {String} userFullName
 * @prop {String} userId
 * @prop {String} userLanguage
 * @prop {String} userLocale
 * @prop {String} userName
 * @prop {String} userTimeZone
 * @prop {String} userType
 * @prop {String} userUiSkin
 */
/**
 * Retrieves personal information for the user associated with the current session
 *
 * @param {Callback.<SoapApi~UserInfoResult>} [callback] - Callback function
 * @returns {Promise.<SoapApi~UserInfoResult>}
 */
SoapApi.prototype.getUserInfo = function(callback) {
  return this._invoke("getUserInfo", {}, Schemas.GetUserInfoResult, callback);
};
Schemas.GetUserInfoResult = {
  accessibilityMode: 'boolean',
  currencySymbol: 'string',
  orgAttachmentFileSizeLimit: 'number',
  orgDefaultCurrencyIsoCode: 'string',
  orgDisallowHtmlAttachments: 'boolean',
  orgHasPersonAccounts: 'boolean',
  organizationId: 'string',
  organizationMultiCurrency: 'boolean',
  organizationName: 'string',
  profileId: 'string',
  roleId: 'string',
  sessionSecondsValid: 'number',
  userDefaultCurrencyIsoCode: 'string',
  userEmail: 'string',
  userFullName: 'string',
  userId: 'string',
  userLanguage: 'string',
  userLocale: 'string',
  userName: 'string',
  userTimeZone: 'string',
  userType: 'string',
  userUiSkin: 'string'
};

/**
 * Sets the specified user’s password to the specified value
 *
 * @param {String} userId - User Id to set password
 * @param {String} password - New password
 * @param {Callback.<String>} [callback] - Callback function
 * @returns {Promise.<String>}
 */
SoapApi.prototype.setPassword = function(userId, password, callback) {
  return this._invoke("setPassword", { userId: userId, password: password }, callback);
};

/**
 * @typedef SoapApi~ResetPasswordResult
 * @prop {String} password
 */
/**
 * Resets the specified user’s password
 *
 * @param {String} userId - User Id to set password
 * @param {String} password - New password
 * @param {Callback.<SoapApi~ResetPasswordResult>} [callback] - Callback function
 * @returns {Promise.<SoapApi~ResetPasswordResult>}
 */
SoapApi.prototype.resetPassword = function(userId, callback) {
  return this._invoke("resetPassword", { userId: userId }, callback);
};

/**
 * Adds one or more new records to your organization’s data
 *
 * @param {Array.<Object>} sObjects - Records to insert
 * @param {Callback.<SoapApi~SaveResult>} [callback] - Callback function
 * @returns {Promise.<SoapApi~SaveResult>}
 */
SoapApi.prototype.create = function(sObjects, callback) {
  var schema = _.isArray(sObjects) ? [ Schemas.SaveResult ] : Schemas.SaveResult;
  var args = {
    '@xmlns' : 'urn:partner.soap.sforce.com',
    '@xmlns:ns1' : 'sobject.partner.soap.sforce.com',
    'ns1:sObjects' : sObjects
  };
  return this._invoke("create", args, schema, callback);
};

/**
 * Updates one or more existing records in your organization’s data.
 *
 * @param {Array.<Object>} sObjects - Records to update
 * @param {Callback.<SoapApi~SaveResult>} [callback] - Callback function
 * @returns {Promise.<SoapApi~SaveResult>}
 */
SoapApi.prototype.update = function(sObjects, callback) {
  var schema = _.isArray(sObjects) ? [ Schemas.SaveResult ] : Schemas.SaveResult;
  var args = {
    '@xmlns' : 'urn:partner.soap.sforce.com',
    '@xmlns:ns1' : 'sobject.partner.soap.sforce.com',
    'ns1:sObjects' : sObjects
  };
  return this._invoke("update", args, schema, callback);
};

Schemas.SaveResult = {
  success: 'boolean',
  errors: [],
  id: 'string'
};

/**
 * Creates new records and updates existing records in your organization’s data.
 *
 * @param {Array.<Object>} sObjects - Records to upsert
 * @param {Callback.<SoapApi~UpsertResult>} [callback] - Callback function
 * @returns {Promise.<SoapApi~UpsertResult>}
 */
SoapApi.prototype.upsert = function(externalIdFieldName, sObjects, callback) {
  var schema = _.isArray(sObjects) ? [ Schemas.UpsertResult ] : Schemas.UpsertResult;
  var args = {
    '@xmlns' : 'urn:partner.soap.sforce.com',
    '@xmlns:ns1' : 'sobject.partner.soap.sforce.com',
    'ns1:externalIDFieldName' : externalIdFieldName,
    'ns1:sObjects' : sObjects
  };
  return this._invoke("upsert", args, schema, callback);
};

Schemas.UpsertResult = {
  created: 'boolean',
  success: 'boolean',
  errors: [],
  id: 'string'
};

/**
 * Deletes one or more records from your organization’s data
 *
 * @param {Array.<Object>} ids - Id of records to delete
 * @param {Callback.<SoapApi~DeleteResult>} [callback] - Callback function
 * @returns {Promise.<SoapApi~DeleteResult>}
 */
SoapApi.prototype.delete = function(ids, callback) {
  var schema = _.isArray(ids) ? [ Schemas.DeleteResult ] : Schemas.DeleteResult;
  var args = {
    '@xmlns' : 'urn:partner.soap.sforce.com',
    '@xmlns:ns1' : 'sobject.partner.soap.sforce.com',
    'ns1:ids' : ids
  };
  return this._invoke("delete", args, schema, callback);
};

Schemas.DeleteResult = {
  success: 'boolean',
  errors: [],
  id: 'string'
};


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.soap = new SoapApi(conn);
});


module.exports = SoapApi;

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL3NvYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXHJcbiAqIEBmaWxlIFNhbGVzZm9yY2UgU09BUCBBUElcclxuICogQGF1dGhvciBTaGluaWNoaSBUb21pdGEgPHNoaW5pY2hpLnRvbWl0YUBnbWFpbC5jb20+XHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIF8gPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdsb2Rhc2gvY29yZScpO1xyXG52YXIganNmb3JjZSA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vY29yZScpO1xyXG52YXIgU09BUCA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vc29hcCcpO1xyXG5cclxuLyoqXHJcbiAqIEFQSSBjbGFzcyBmb3IgUGFydG5lciBTT0FQIGNhbGxcclxuICpcclxuICogQGNsYXNzXHJcbiAqIEBwYXJhbSB7Q29ubmVjdGlvbn0gY29ubiAtIENvbm5lY3Rpb25cclxuICovXHJcbnZhciBTb2FwQXBpID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25uKSB7XHJcbiAgdGhpcy5fY29ubiA9IGNvbm47XHJcbn07XHJcblxyXG4vKipcclxuICogQ2FsbCBTT0FQIEFwaSAoUGFydG5lcikgZW5kcG9pbnRcclxuICogQHByaXZhdGVcclxuICovXHJcblNvYXBBcGkucHJvdG90eXBlLl9pbnZva2UgPSBmdW5jdGlvbihtZXRob2QsIG1lc3NhZ2UsIHNjaGVtYSwgY2FsbGJhY2spIHtcclxuICB2YXIgc29hcEVuZHBvaW50ID0gbmV3IFNPQVAodGhpcy5fY29ubiwge1xyXG4gICAgeG1sbnM6IFwidXJuOnBhcnRuZXIuc29hcC5zZm9yY2UuY29tXCIsXHJcbiAgICBlbmRwb2ludFVybDogdGhpcy5fY29ubi5pbnN0YW5jZVVybCArIFwiL3NlcnZpY2VzL1NvYXAvdS9cIiArIHRoaXMuX2Nvbm4udmVyc2lvblxyXG4gIH0pO1xyXG4gIHJldHVybiBzb2FwRW5kcG9pbnQuaW52b2tlKG1ldGhvZCwgbWVzc2FnZSwgeyByZXN1bHQ6IHNjaGVtYSB9KS50aGVuKGZ1bmN0aW9uKHJlcykge1xyXG4gICAgcmV0dXJuIHJlcy5yZXN1bHQ7XHJcbiAgfSkudGhlbkNhbGwoY2FsbGJhY2spO1xyXG59O1xyXG5cclxuXHJcbi8qICovXHJcbnZhciBTY2hlbWFzID0ge307XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgU29hcEFwaX5MZWFkQ29udmVydFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBjb252ZXJ0ZWRTdGF0dXMgLSBTdGF0dXMgb2YgY29udmVydGVkIGxlYWRcclxuICogQHByb3Age1N0cmluZ30gbGVhZElkIC0gTGVhZCByZWNvcmQgSWQgdG8gY29udmVydFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBbYWNjb3VudElkXSAtIEFjY291bnQgcmVjb3JkIElkIHRvIGFzc2lnbiB0aGUgY29udmVydGVkIHJlY29yZFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBbY29udGFjdElkXSAtIENvbnRhY3QgcmVjb3JkIElkIHRvIGFzc2lnbiB0aGUgY29udmVydGVkIHJlY29yZFxyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gW2RvTm90Q3JlYXRlT3Bwb3J0dW5pdHldIC0gVHJ1ZSBpZiB5b3UgZG9uJ3Qgd2FudCB0byBjcmVhdGUgYSBuZXcgb3Bwb3J0dW5pdHlcclxuICogQHByb3Age1N0cmluZ30gW29wcG9ydHVuaXR5TmFtZV0gLSBOYW1lIG9mIG9wcG9ydHVuaXR5IHRvIGNyZWF0ZVxyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gW292ZXJ3cml0ZUxlYWRTb3VyY2VdIC0gVHJ1ZSBpZiBvdmVyd3JpdGluZyBsZWFkIHNvdXJjZVxyXG4gKiBAcHJvcCB7U3RyaW5nfSBbb3duZXJJZF0gLSBPd25lciBJZFxyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gW3NlbmROb3RpZmljYXRpb25FbWFpbF0gLSBUcnVlIGlmIHNlbmQgbm90aWZpY2F0aW9uIGVtYWlsXHJcbiAqL1xyXG4vKipcclxuICogQHR5cGVkZWYgU29hcEFwaX5MZWFkQ29udmVydFJlc3VsdFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBsZWFkSWQgLSBMZWFkIHJlY29yZCBJZCB0byBjb252ZXJ0XHJcbiAqIEBwcm9wIHtTdHJpbmd9IFthY2NvdW50SWRdIC0gQWNjb3VudCByZWNvcmQgSWQgb2YgY29udmVydGVkIGxlYWRcclxuICogQHByb3Age1N0cmluZ30gW2NvbnRhY3RJZF0gLSBDb250YWN0IHJlY29yZCBJZCBvZiBjb252ZXJ0ZWQgbGVhZFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBbb3Bwb3J0dW5pdHlJZF0gLSBPcHBvcnR1bml0eSByZWNvcmQgSWQgY3JlYXRlZCBpbiBjb252ZXJzaW9uXHJcbiAqIEBwcm9wIHtCb29sZWFufSBzdWNjZXNzIC0gVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgY29udmVydGVkXHJcbiAqIEBwcm9wIHtBcnJheS48T2JqZWN0Pn0gZXJyb3JzIC0gRXJyb3JcclxuICovXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhIExlYWQgaW50byBhbiBBY2NvdW50LCBDb250YWN0LCBvciAob3B0aW9uYWxseSkgYW4gT3Bwb3J0dW5pdHkuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U29hcEFwaX5MZWFkQ29udmVydHxBcnJheS48U29hcEFwaX5MZWFkQ29udmVydD59IGxlYWRDb252ZXJ0c1xyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpfkxlYWRDb252ZXJ0UmVzdWx0fEFycmF5LjxTb2FwQXBpfkxlYWRDb252ZXJ0UmVzdWx0Pj59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48U29hcEFwaX5MZWFkQ29udmVydFJlc3VsdHxBcnJheS48U29hcEFwaX5MZWFkQ29udmVydFJlc3VsdD4+fVxyXG4gKi9cclxuU29hcEFwaS5wcm90b3R5cGUuY29udmVydExlYWQgPSBmdW5jdGlvbihsZWFkQ29udmVydHMsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNjaGVtYSA9IF8uaXNBcnJheShsZWFkQ29udmVydHMpID8gWyBTY2hlbWFzLkxlYWRDb252ZXJ0UmVzdWx0IF0gOiBTY2hlbWFzLkxlYWRDb252ZXJ0UmVzdWx0O1xyXG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJjb252ZXJ0TGVhZFwiLCB7IGxlYWRDb252ZXJ0czogbGVhZENvbnZlcnRzIH0sIHNjaGVtYSwgY2FsbGJhY2spO1xyXG59O1xyXG5TY2hlbWFzLkxlYWRDb252ZXJ0UmVzdWx0ID0ge1xyXG4gIHN1Y2Nlc3M6ICdib29sZWFuJyxcclxuICBlcnJvcnM6IFtdLFxyXG4gIGxlYWRJZDogJ3N0cmluZycsXHJcbiAgYWNjb3VudElkOiAnc3RyaW5nJyxcclxuICBjb250YWN0SWQ6ICdzdHJpbmcnLFxyXG4gIG9wcG9ydHVuaXR5SWQ6ICdzdHJpbmcnXHJcbn07XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgU29hcEFwaX5NZXJnZVJlcXVlc3RcclxuICogQHByb3Age09iamVjdH0gbWFzdGVyUmVjb3JkIC0gVGhlIG1lcmdlIGRlc3RpbmF0aW9uIHJlY29yZFxyXG4gKiBAcHJvcCB7QXJyYXkuPFN0cmluZz59IHJlY29yZFRvTWVyZ2VJZHMgLSBJZHMgb2YgcmVjb3JkcyB0byBtZXJnZVxyXG4gKi9cclxuLyoqXHJcbiAqIEB0eXBlZGVmIFNvYXBBcGl+TWVyZ2VSZXN1bHRcclxuICogQHByb3Age0Jvb2xlYW59IHN1Y2Nlc3MgLSBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBtZXJnZWRcclxuICogQHByb3Age0FycmF5LjxPYmplY3Q+fSBlcnJvcnMgLSBFcnJvclxyXG4gKiBAcHJvcCB7U3RyaW5nfSBpZCAtIElEIG9mIHRoZSBtYXN0ZXIgcmVjb3JkXHJcbiAqIEBwcm9wIHtBcnJheS48U3RyaW5nPn0gbWVyZ2VkUmVjb3JkSWRzIC0gSUQgb2YgdGhlIHJlY29yZHMgdGhhdCB3ZXJlIG1lcmdlZCBpbnRvIHRoZSBtYXN0ZXIgcmVjb3JkXHJcbiAqIEBwcm9wIHtBcnJheS48U3RyaW5nPn0gdXBkYXRlZFJlbGF0ZWRJZHMgLSBJRCBvZiBhbGwgcmVsYXRlZCByZWNvcmRzIHRoYXQgd2VyZSBtb3ZlZCAocmUtcGFyZW50ZWQpIGFzIGEgcmVzdWx0IG9mIHRoZSBtZXJnZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBNZXJnZSB1cCB0byB0aHJlZSByZWNvcmRzIGludG8gb25lXHJcbiAqXHJcbiAqIEBwYXJhbSB7U29hcEFwaX5NZXJnZVJlcXVlc3R8QXJyYXkuPFNvYXBBcGl+TWVyZ2VSZXF1ZXN0Pn0gbWVyZ2VSZXF1ZXN0c1xyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpfk1lcmdlUmVzdWx0fEFycmF5LjxTb2FwQXBpfk1lcmdlUmVzdWx0Pj59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48U29hcEFwaX5NZXJnZVJlc3VsdHxBcnJheS48U29hcEFwaX5NZXJnZVJlc3VsdD4+fVxyXG4gKi9cclxuU29hcEFwaS5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbihtZXJnZVJlcXVlc3RzLCBjYWxsYmFjaykge1xyXG4gIHZhciBzY2hlbWEgPSBfLmlzQXJyYXkobWVyZ2VSZXF1ZXN0cykgPyBbIFNjaGVtYXMuTWVyZ2VSZXN1bHQgXSA6IFNjaGVtYXMuTWVyZ2VSZXN1bHQ7XHJcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcIm1lcmdlXCIsIHsgbWVyZ2VSZXF1ZXN0czogbWVyZ2VSZXF1ZXN0cyB9LCBzY2hlbWEsIGNhbGxiYWNrKTtcclxufTtcclxuU2NoZW1hcy5NZXJnZVJlc3VsdCA9IHtcclxuICBzdWNjZXNzOiAnYm9vbGVhbicsXHJcbiAgZXJyb3JzOiBbXSxcclxuICBpZDogJ3N0cmluZycsXHJcbiAgbWVyZ2VkUmVjb3JkSWRzOiBbJ3N0cmluZyddLFxyXG4gIHVwZGF0ZWRSZWxhdGVkSWRzOiBbJ3N0cmluZyddXHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIFNvYXBBcGl+RW1wdHlSZWN5Y2xlQmluUmVzdWx0XHJcbiAqIEBwcm9wIHtTdHJpbmd9IGlkIC0gSUQgb2YgYW4gc09iamVjdCB0aGF0IHlvdSBhdHRlbXB0ZWQgdG8gZGVsZXRlIGZyb20gdGhlIFJlY3ljbGUgQmluXHJcbiAqIEBwcm9wIHtCb29sZWFufSBzdWNjZXNzIC0gV2hldGhlciB0aGUgY2FsbCBzdWNjZWVkZWQgKHRydWUpIG9yIG5vdCAoZmFsc2UpIGZvciB0aGlzIHJlY29yZFxyXG4gKiBAcHJvcCB7QXJyYXkuPE9iamVjdD59IGVycm9ycyAtIEVycm9yc1xyXG4gKi9cclxuLyoqXHJcbiAqIERlbGV0ZSByZWNvcmRzIGZyb20gdGhlIHJlY3ljbGUgYmluIGltbWVkaWF0ZWx5XHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPFN0cmluZz59IGlkcyAtIFJlY29yZCBpZHMgdG8gZW1wdHkgZnJvbSByZWN5Y2xlIGJpblxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBcnJheS48U29hcEFwaX5FbXB0eVJlY3ljbGVCaW5SZXN1bHQ+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBcnJheS48U29hcEFwaX5FbXB0eVJlY3ljbGVCaW5SZXN1bHQ+Pn1cclxuICovXHJcblNvYXBBcGkucHJvdG90eXBlLmVtcHR5UmVjeWNsZUJpbiA9IGZ1bmN0aW9uKGlkcywgY2FsbGJhY2spIHtcclxuICByZXR1cm4gdGhpcy5faW52b2tlKFwiZW1wdHlSZWN5Y2xlQmluXCIsIHsgaWRzOiBpZHMgfSwgWyBTY2hlbWFzLkVtcHR5UmVjeWNsZUJpblJlc3VsdCBdLCBjYWxsYmFjayk7XHJcbn07XHJcblNjaGVtYXMuRW1wdHlSZWN5Y2xlQmluUmVzdWx0ID0ge1xyXG4gIGlkOiAnc3RyaW5nJyxcclxuICBzdWNjZXNzOiAnYm9vbGVhbicsXHJcbiAgZXJyb3JzOiBbXVxyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBTb2FwQXBpfkRlc2NyaWJlVGFiU2V0UmVzdWx0XHJcbiAqIEBwcm9wIHtTdHJpbmd9IGxhYmVsIC0gVGhlIGRpc3BsYXkgbGFiZWwgZm9yIHRoaXMgc3RhbmRhcmQgb3IgY3VzdG9tIGFwcFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBsb2dvVXJsIC0gQSBmdWxseSBxdWFsaWZpZWQgVVJMIHRvIHRoZSBsb2dvIGltYWdlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3RhbmRhcmQgb3IgY3VzdG9tIGFwcFxyXG4gKiBAcHJvcCB7U3RyaW5nfSBuYW1lc3BhY2UgLSBOYW1lc3BhY2Ugb2YgYXBwbGljYXRpb24gcGFja2FnZVxyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gc2VsZWN0ZWQgLSBJZiB0cnVlLCB0aGVuIHRoaXMgc3RhbmRhcmQgb3IgY3VzdG9tIGFwcCBpcyB0aGUgdXNlcuKAmXMgY3VycmVudGx5IHNlbGVjdGVkIGFwcFxyXG4gKiBAcHJvcCB7QXJyYXkuPFNvYXBBcGl+RGVzY3JpYmVUYWI+fSB0YWJzIC0gQW4gYXJyYXkgb2YgdGFicyB0aGF0IGFyZSBkaXNwbGF5ZWQgZm9yIHRoZSBzcGVjaWZpZWQgc3RhbmRhcmQgYXBwIG9yIGN1c3RvbSBhcHBcclxuICovXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiBTb2FwQXBpfkRlc2NyaWJlVGFiXHJcbiAqIEBwcm9wIHtBcnJheS48T2JqZWN0Pn0gY29sb3JzIC0gQXJyYXkgb2YgY29sb3IgaW5mb3JtYXRpb24gdXNlZCBmb3IgYSB0YWJcclxuICogQHByb3Age0Jvb2xlYW59IGN1c3RvbSAtIHRydWUgaWYgdGhpcyBpcyBhIGN1c3RvbSB0YWJcclxuICogQHByb3Age1N0cmluZ30gaWNvblVybCAtIFRoZSBVUkwgZm9yIHRoZSBtYWluIDMyIHggMzIgcGl4ZWwgaWNvbiBmb3IgYSB0YWJcclxuICogQHByb3Age0FycmF5LjxPYmplY3Q+fSBpY29ucyAtIEFycmF5IG9mIGljb24gaW5mb3JtYXRpb24gdXNlZCBmb3IgYSB0YWJcclxuICogQHByb3Age1N0cmluZ30gbGFiZWwgLSBUaGUgZGlzcGxheSBsYWJlbCBmb3IgdGhpcyB0YWJcclxuICogQHByb3Age1N0cmluZ30gbWluaUljb25VcmwgLSBUaGUgVVJMIGZvciB0aGUgMTYgeCAxNiBwaXhlbCBpY29uIHRoYXQgcmVwcmVzZW50cyBhIHRhYlxyXG4gKiBAcHJvcCB7U3RyaW5nfSBuYW1lIC0gVGhlIEFQSSBuYW1lIG9mIHRoZSB0YWJcclxuICogQHByb3Age1N0cmluZ30gc29iamVjdE5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc09iamVjdCB0aGF0IGlzIHByaW1hcmlseSBkaXNwbGF5ZWQgb24gdGhpcyB0YWJcclxuICogQHByb3Age1N0cmluZ30gdXJsIC0gQSBmdWxseSBxdWFsaWZpZWQgVVJMIGZvciB2aWV3aW5nIHRoaXMgdGFiXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhbmRhcmQgYW5kIGN1c3RvbSBhcHBzIGF2YWlsYWJsZSB0byB0aGUgbG9nZ2VkLWluIHVzZXJcclxuICpcclxuICogQHBhcmFtIHtDYWxsYmFjay48QXJyYXkuPFNvYXBBcGl+RGVzY3JpYmVUYWJTZXRSZXN1bHQ+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBcnJheS48U29hcEFwaX5EZXNjcmliZVRhYlNldFJlc3VsdD4+fVxyXG4gKi9cclxuU29hcEFwaS5wcm90b3R5cGUuZGVzY3JpYmVUYWJzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICByZXR1cm4gdGhpcy5faW52b2tlKFwiZGVzY3JpYmVUYWJzXCIsIHt9LCBbIFNjaGVtYXMuRGVzY3JpYmVUYWJTZXRSZXN1bHQgXSwgY2FsbGJhY2spO1xyXG59O1xyXG5TY2hlbWFzLkRlc2NyaWJlVGFiU2V0UmVzdWx0ID0ge1xyXG4gIGxhYmVsOiAnc3RyaW5nJyxcclxuICBsb2dvVXJsOiAnc3RyaW5nJyxcclxuICBuYW1lc3BhY2U6ICdzdHJpbmcnLFxyXG4gIHNlbGVjdGVkOiAnYm9vbGVhbicsXHJcbiAgdGFiczogW3tcclxuICAgIGNvbG9yczogW3tcclxuICAgICAgdGhlbWU6ICdzdHJpbmcnLFxyXG4gICAgICBjb2xvcjogJ3N0cmluZycsXHJcbiAgICAgIGNvbnRleHQ6ICdzdHJpbmcnXHJcbiAgICB9XSxcclxuICAgIGljb25Vcmw6ICdzdHJpbmcnLFxyXG4gICAgaWNvbnM6IFt7XHJcbiAgICAgIHRoZW1lOiAnc3RyaW5nJyxcclxuICAgICAgaGVpZ2h0OiAnbnVtYmVyJyxcclxuICAgICAgd2lkdGg6ICdudW1iZXInLFxyXG4gICAgICB1cmw6ICdzdHJpbmcnLFxyXG4gICAgICBjb250ZW50VHlwZTogJ3N0cmluZydcclxuICAgIH1dLFxyXG4gICAgbGFiZWw6ICdzdHJpbmcnLFxyXG4gICAgY3VzdG9tOiAnYm9vbGVhbicsXHJcbiAgICBtaW5pSWNvblVybDogJ3N0cmluZycsXHJcbiAgICBuYW1lOiAnc3RyaW5nJyxcclxuICAgIHNvYmplY3ROYW1lOiAnc3RyaW5nJyxcclxuICAgIHVybDogJ3N0cmluZydcclxuICB9XVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHJpZXZlcyB0aGUgY3VycmVudCBzeXN0ZW0gdGltZXN0YW1wIChDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZSAoVVRDKSB0aW1lIHpvbmUpIGZyb20gdGhlIEFQSVxyXG4gKlxyXG4gKiBAdHlwZWRlZiBTb2FwQXBpflNlcnZlclRpbWVzdGFtcFJlc3VsdFxyXG4gKiBAcHJvcCB7U3RyaW5nfSB0aW1lc3RhbXAgLSBUaW1lc3RhbXBcclxuICovXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpflNlcnZlclRpbWVzdGFtcFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48U29hcEFwaX5TZXJ2ZXJUaW1lc3RhbXBSZXN1bHQ+fVxyXG4gKi9cclxuU29hcEFwaS5wcm90b3R5cGUuZ2V0U2VydmVyVGltZXN0YW1wID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICByZXR1cm4gdGhpcy5faW52b2tlKFwiZ2V0U2VydmVyVGltZXN0YW1wXCIsIHt9LCBTY2hlbWFzLkdldFNlcnZlclRpbWVzdGFtcFJlc3VsdCwgY2FsbGJhY2spO1xyXG59O1xyXG5TY2hlbWFzLkdldFNlcnZlclRpbWVzdGFtcFJlc3VsdCA9IHtcclxuICB0aW1lc3RhbXA6ICdzdHJpbmcnXHJcbn07XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgU29hcEFwaX5Vc2VySW5mb1Jlc3VsdFxyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gYWNjZXNzaWJpbGl0eU1vZGVcclxuICogQHByb3Age1N0cmluZ30gY3VycmVuY3lTeW1ib2xcclxuICogQHByb3Age051bWJlcn0gb3JnQXR0YWNobWVudEZpbGVTaXplTGltaXRcclxuICogQHByb3Age1N0cmluZ30gb3JnRGVmYXVsdEN1cnJlbmN5SXNvQ29kZVxyXG4gKiBAcHJvcCB7U3RyaW5nfSBvcmdEaXNhbGxvd0h0bWxBdHRhY2htZW50c1xyXG4gKiBAcHJvcCB7Qm9vbGVhbn0gb3JnSGFzUGVyc29uQWNjb3VudHNcclxuICogQHByb3Age1N0cmluZ30gb3JnYW5pemF0aW9uSWRcclxuICogQHByb3Age0Jvb2xlYW59IG9yZ2FuaXphdGlvbk11bHRpQ3VycmVuY3lcclxuICogQHByb3Age1N0cmluZ30gb3JnYW5pemF0aW9uTmFtZVxyXG4gKiBAcHJvcCB7U3RyaW5nfSBwcm9maWxlSWRcclxuICogQHByb3Age1N0cmluZ30gcm9sZUlkXHJcbiAqIEBwcm9wIHtOdW1iZXJ9IHNlc3Npb25TZWNvbmRzVmFsaWRcclxuICogQHByb3Age1N0cmluZ30gdXNlckRlZmF1bHRDdXJyZW5jeUlzb0NvZGVcclxuICogQHByb3Age1N0cmluZ30gdXNlckVtYWlsXHJcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJGdWxsTmFtZVxyXG4gKiBAcHJvcCB7U3RyaW5nfSB1c2VySWRcclxuICogQHByb3Age1N0cmluZ30gdXNlckxhbmd1YWdlXHJcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJMb2NhbGVcclxuICogQHByb3Age1N0cmluZ30gdXNlck5hbWVcclxuICogQHByb3Age1N0cmluZ30gdXNlclRpbWVab25lXHJcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJUeXBlXHJcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJVaVNraW5cclxuICovXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgcGVyc29uYWwgaW5mb3JtYXRpb24gZm9yIHRoZSB1c2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudCBzZXNzaW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFNvYXBBcGl+VXNlckluZm9SZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPFNvYXBBcGl+VXNlckluZm9SZXN1bHQ+fVxyXG4gKi9cclxuU29hcEFwaS5wcm90b3R5cGUuZ2V0VXNlckluZm8gPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJnZXRVc2VySW5mb1wiLCB7fSwgU2NoZW1hcy5HZXRVc2VySW5mb1Jlc3VsdCwgY2FsbGJhY2spO1xyXG59O1xyXG5TY2hlbWFzLkdldFVzZXJJbmZvUmVzdWx0ID0ge1xyXG4gIGFjY2Vzc2liaWxpdHlNb2RlOiAnYm9vbGVhbicsXHJcbiAgY3VycmVuY3lTeW1ib2w6ICdzdHJpbmcnLFxyXG4gIG9yZ0F0dGFjaG1lbnRGaWxlU2l6ZUxpbWl0OiAnbnVtYmVyJyxcclxuICBvcmdEZWZhdWx0Q3VycmVuY3lJc29Db2RlOiAnc3RyaW5nJyxcclxuICBvcmdEaXNhbGxvd0h0bWxBdHRhY2htZW50czogJ2Jvb2xlYW4nLFxyXG4gIG9yZ0hhc1BlcnNvbkFjY291bnRzOiAnYm9vbGVhbicsXHJcbiAgb3JnYW5pemF0aW9uSWQ6ICdzdHJpbmcnLFxyXG4gIG9yZ2FuaXphdGlvbk11bHRpQ3VycmVuY3k6ICdib29sZWFuJyxcclxuICBvcmdhbml6YXRpb25OYW1lOiAnc3RyaW5nJyxcclxuICBwcm9maWxlSWQ6ICdzdHJpbmcnLFxyXG4gIHJvbGVJZDogJ3N0cmluZycsXHJcbiAgc2Vzc2lvblNlY29uZHNWYWxpZDogJ251bWJlcicsXHJcbiAgdXNlckRlZmF1bHRDdXJyZW5jeUlzb0NvZGU6ICdzdHJpbmcnLFxyXG4gIHVzZXJFbWFpbDogJ3N0cmluZycsXHJcbiAgdXNlckZ1bGxOYW1lOiAnc3RyaW5nJyxcclxuICB1c2VySWQ6ICdzdHJpbmcnLFxyXG4gIHVzZXJMYW5ndWFnZTogJ3N0cmluZycsXHJcbiAgdXNlckxvY2FsZTogJ3N0cmluZycsXHJcbiAgdXNlck5hbWU6ICdzdHJpbmcnLFxyXG4gIHVzZXJUaW1lWm9uZTogJ3N0cmluZycsXHJcbiAgdXNlclR5cGU6ICdzdHJpbmcnLFxyXG4gIHVzZXJVaVNraW46ICdzdHJpbmcnXHJcbn07XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgc3BlY2lmaWVkIHVzZXLigJlzIHBhc3N3b3JkIHRvIHRoZSBzcGVjaWZpZWQgdmFsdWVcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCAtIFVzZXIgSWQgdG8gc2V0IHBhc3N3b3JkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIE5ldyBwYXNzd29yZFxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTdHJpbmc+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPFN0cmluZz59XHJcbiAqL1xyXG5Tb2FwQXBpLnByb3RvdHlwZS5zZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXJJZCwgcGFzc3dvcmQsIGNhbGxiYWNrKSB7XHJcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcInNldFBhc3N3b3JkXCIsIHsgdXNlcklkOiB1c2VySWQsIHBhc3N3b3JkOiBwYXNzd29yZCB9LCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG4vKipcclxuICogQHR5cGVkZWYgU29hcEFwaX5SZXNldFBhc3N3b3JkUmVzdWx0XHJcbiAqIEBwcm9wIHtTdHJpbmd9IHBhc3N3b3JkXHJcbiAqL1xyXG4vKipcclxuICogUmVzZXRzIHRoZSBzcGVjaWZpZWQgdXNlcuKAmXMgcGFzc3dvcmRcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCAtIFVzZXIgSWQgdG8gc2V0IHBhc3N3b3JkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIE5ldyBwYXNzd29yZFxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpflJlc2V0UGFzc3dvcmRSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPFNvYXBBcGl+UmVzZXRQYXNzd29yZFJlc3VsdD59XHJcbiAqL1xyXG5Tb2FwQXBpLnByb3RvdHlwZS5yZXNldFBhc3N3b3JkID0gZnVuY3Rpb24odXNlcklkLCBjYWxsYmFjaykge1xyXG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJyZXNldFBhc3N3b3JkXCIsIHsgdXNlcklkOiB1c2VySWQgfSwgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgb25lIG9yIG1vcmUgbmV3IHJlY29yZHMgdG8geW91ciBvcmdhbml6YXRpb27igJlzIGRhdGFcclxuICpcclxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gc09iamVjdHMgLSBSZWNvcmRzIHRvIGluc2VydFxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpflNhdmVSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHJldHVybnMge1Byb21pc2UuPFNvYXBBcGl+U2F2ZVJlc3VsdD59XHJcbiAqL1xyXG5Tb2FwQXBpLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihzT2JqZWN0cywgY2FsbGJhY2spIHtcclxuICB2YXIgc2NoZW1hID0gXy5pc0FycmF5KHNPYmplY3RzKSA/IFsgU2NoZW1hcy5TYXZlUmVzdWx0IF0gOiBTY2hlbWFzLlNhdmVSZXN1bHQ7XHJcbiAgdmFyIGFyZ3MgPSB7XHJcbiAgICAnQHhtbG5zJyA6ICd1cm46cGFydG5lci5zb2FwLnNmb3JjZS5jb20nLFxyXG4gICAgJ0B4bWxuczpuczEnIDogJ3NvYmplY3QucGFydG5lci5zb2FwLnNmb3JjZS5jb20nLFxyXG4gICAgJ25zMTpzT2JqZWN0cycgOiBzT2JqZWN0c1xyXG4gIH07XHJcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcImNyZWF0ZVwiLCBhcmdzLCBzY2hlbWEsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIG9uZSBvciBtb3JlIGV4aXN0aW5nIHJlY29yZHMgaW4geW91ciBvcmdhbml6YXRpb27igJlzIGRhdGEuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IHNPYmplY3RzIC0gUmVjb3JkcyB0byB1cGRhdGVcclxuICogQHBhcmFtIHtDYWxsYmFjay48U29hcEFwaX5TYXZlUmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTb2FwQXBpflNhdmVSZXN1bHQ+fVxyXG4gKi9cclxuU29hcEFwaS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oc09iamVjdHMsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNjaGVtYSA9IF8uaXNBcnJheShzT2JqZWN0cykgPyBbIFNjaGVtYXMuU2F2ZVJlc3VsdCBdIDogU2NoZW1hcy5TYXZlUmVzdWx0O1xyXG4gIHZhciBhcmdzID0ge1xyXG4gICAgJ0B4bWxucycgOiAndXJuOnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcclxuICAgICdAeG1sbnM6bnMxJyA6ICdzb2JqZWN0LnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcclxuICAgICduczE6c09iamVjdHMnIDogc09iamVjdHNcclxuICB9O1xyXG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJ1cGRhdGVcIiwgYXJncywgc2NoZW1hLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG5TY2hlbWFzLlNhdmVSZXN1bHQgPSB7XHJcbiAgc3VjY2VzczogJ2Jvb2xlYW4nLFxyXG4gIGVycm9yczogW10sXHJcbiAgaWQ6ICdzdHJpbmcnXHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBuZXcgcmVjb3JkcyBhbmQgdXBkYXRlcyBleGlzdGluZyByZWNvcmRzIGluIHlvdXIgb3JnYW5pemF0aW9u4oCZcyBkYXRhLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBzT2JqZWN0cyAtIFJlY29yZHMgdG8gdXBzZXJ0XHJcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFNvYXBBcGl+VXBzZXJ0UmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTb2FwQXBpflVwc2VydFJlc3VsdD59XHJcbiAqL1xyXG5Tb2FwQXBpLnByb3RvdHlwZS51cHNlcnQgPSBmdW5jdGlvbihleHRlcm5hbElkRmllbGROYW1lLCBzT2JqZWN0cywgY2FsbGJhY2spIHtcclxuICB2YXIgc2NoZW1hID0gXy5pc0FycmF5KHNPYmplY3RzKSA/IFsgU2NoZW1hcy5VcHNlcnRSZXN1bHQgXSA6IFNjaGVtYXMuVXBzZXJ0UmVzdWx0O1xyXG4gIHZhciBhcmdzID0ge1xyXG4gICAgJ0B4bWxucycgOiAndXJuOnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcclxuICAgICdAeG1sbnM6bnMxJyA6ICdzb2JqZWN0LnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcclxuICAgICduczE6ZXh0ZXJuYWxJREZpZWxkTmFtZScgOiBleHRlcm5hbElkRmllbGROYW1lLFxyXG4gICAgJ25zMTpzT2JqZWN0cycgOiBzT2JqZWN0c1xyXG4gIH07XHJcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcInVwc2VydFwiLCBhcmdzLCBzY2hlbWEsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcblNjaGVtYXMuVXBzZXJ0UmVzdWx0ID0ge1xyXG4gIGNyZWF0ZWQ6ICdib29sZWFuJyxcclxuICBzdWNjZXNzOiAnYm9vbGVhbicsXHJcbiAgZXJyb3JzOiBbXSxcclxuICBpZDogJ3N0cmluZydcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWxldGVzIG9uZSBvciBtb3JlIHJlY29yZHMgZnJvbSB5b3VyIG9yZ2FuaXphdGlvbuKAmXMgZGF0YVxyXG4gKlxyXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBpZHMgLSBJZCBvZiByZWNvcmRzIHRvIGRlbGV0ZVxyXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpfkRlbGV0ZVJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48U29hcEFwaX5EZWxldGVSZXN1bHQ+fVxyXG4gKi9cclxuU29hcEFwaS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24oaWRzLCBjYWxsYmFjaykge1xyXG4gIHZhciBzY2hlbWEgPSBfLmlzQXJyYXkoaWRzKSA/IFsgU2NoZW1hcy5EZWxldGVSZXN1bHQgXSA6IFNjaGVtYXMuRGVsZXRlUmVzdWx0O1xyXG4gIHZhciBhcmdzID0ge1xyXG4gICAgJ0B4bWxucycgOiAndXJuOnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcclxuICAgICdAeG1sbnM6bnMxJyA6ICdzb2JqZWN0LnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcclxuICAgICduczE6aWRzJyA6IGlkc1xyXG4gIH07XHJcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcImRlbGV0ZVwiLCBhcmdzLCBzY2hlbWEsIGNhbGxiYWNrKTtcclxufTtcclxuXHJcblNjaGVtYXMuRGVsZXRlUmVzdWx0ID0ge1xyXG4gIHN1Y2Nlc3M6ICdib29sZWFuJyxcclxuICBlcnJvcnM6IFtdLFxyXG4gIGlkOiAnc3RyaW5nJ1xyXG59O1xyXG5cclxuXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKlxyXG4gKiBSZWdpc3RlciBob29rIGluIGNvbm5lY3Rpb24gaW5zdGFudGlhdGlvbiBmb3IgZHluYW1pY2FsbHkgYWRkaW5nIHRoaXMgQVBJIG1vZHVsZSBmZWF0dXJlc1xyXG4gKi9cclxuanNmb3JjZS5vbignY29ubmVjdGlvbjpuZXcnLCBmdW5jdGlvbihjb25uKSB7XHJcbiAgY29ubi5zb2FwID0gbmV3IFNvYXBBcGkoY29ubik7XHJcbn0pO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU29hcEFwaTtcclxuIl19
