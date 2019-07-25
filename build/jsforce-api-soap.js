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


/**
 * Describes metadata (field list and object properties) for the specified object or array of objects.
 *
 * @param {Array.<String>} typeNames - Names of SObject types to describe
 * @param {Callback.<SoapApi~DescribeSObjectResult} [callback] - Callback function
 * @returns {Promise.<SoapApi~DescribeSObjectResult}
 */
SoapApi.prototype.describeSObjects = function(typeNames, callback) {
  var schema = _.isArray(typeNames) ? [ Schemas.DescribeSObjectResult ] : Schemas.DescribeSObjectResult;
  var args = {
    '@xmlns' : 'urn:partner.soap.sforce.com',
    '@xmlns:ns1' : 'sobject.partner.soap.sforce.com',
    'ns1:sObjectType' : typeNames
  };
  return this._invoke("describeSObjects", args, schema, callback)
}

Schemas.DescribeSObjectResult = {
  actionOverrides: [{
    formFactor: 'string',
    isAvailableInTouch: 'boolean',
    name: 'string',
    pageId: 'string', // ID,
    url: 'string',
  }],
  activateable: 'boolean',
  childRelationships: [{
    cascadeDelete: 'boolean',
    childSObject: 'string',
    deprecatedAndHidden: 'boolean',
    field: 'string',
    junctionIdListNames: ['string'],
    junctionReferenceTo: ['string'],
    relationshipName: 'string',
    restrictedDelete: 'boolean',
  }],
  compactLayoutable: 'boolean',
  createable: 'boolean',
  custom: 'boolean',
  customSetting: 'boolean',
  deletable: 'boolean',
  deprecatedAndHidden: 'boolean',
  feedEnabled: 'boolean',
  fields: [{
    aggregatable: 'boolean',
    aiPredictionField: 'boolean',
    autoNumber: 'boolean',
    byteLength: 'number',
    calculated: 'boolean',
    calculatedFormula: 'string',
    cascadeDelete: 'boolean',
    caseSensitive: 'boolean',
    compoundFieldName: 'string',
    controllerName: 'string',
    createable: 'boolean',
    custom: 'boolean',
    defaultValue: 'anyType',
    defaultValueFormula: 'string',
    defaultedOnCreate: 'boolean',
    dependentPicklist: 'boolean',
    deprecatedAndHidden: 'boolean',
    digits: 'number',
    displayLocationInDecimal: 'boolean',
    encrypted: 'boolean',
    externalId: 'boolean',
    extraTypeInfo: 'string',
    filterable: 'boolean',
    filteredLookupInfo: {
      controllingFields: ['string'],
      dependent: 'boolean',
      optionalFilter: 'boolean',
    },
    formulaTreatNullNumberAsZero: 'boolean',
    groupable: 'boolean',
    highScaleNumber: 'boolean',
    htmlFormatted: 'boolean',
    idLookup: 'boolean',
    inlineHelpText: 'string',
    label: 'string',
    length: 'number',
    mask: 'string',
    maskType: 'string',
    name: 'string',
    nameField: 'boolean',
    namePointing: 'boolean',
    nillable: 'boolean',
    permissionable: 'boolean',
    picklistValues: [{
      active: 'boolean',
      defaultValue: 'boolean',
      label: 'string',
      validFor: 'base64Binary',
      value: 'string',
    }],
    polymorphicForeignKey: 'boolean',
    precision: 'number',
    queryByDistance: 'boolean',
    referenceTargetField: 'string',
    referenceTo: ['string'],
    relationshipName: 'string',
    relationshipOrder: 'number',
    restrictedDelete: 'boolean',
    restrictedPicklist: 'boolean',
    scale: 'number',
    searchPrefilterable: 'boolean',
    soapType: 'string', // soapType,
    sortable: 'boolean',
    type: 'string', // fieldType,
    unique: 'boolean',
    updateable: 'boolean',
    writeRequiresMasterRead: 'boolean',
  }],
  hasSubtypes: 'boolean',
  idEnabled: 'boolean',
  isSubtype: 'boolean',
  keyPrefix: 'string',
  label: 'string',
  labelPlural: 'string',
  layoutable: 'boolean',
  mergeable: 'boolean',
  mruEnabled: 'boolean',
  name: 'string',
  namedLayoutInfos: [{
    name: 'string',
  }],
  networkScopeFieldName: 'string',
  queryable: 'boolean',
  recordTypeInfos: [{
    active: 'boolean',
    available: 'boolean',
    defaultRecordTypeMapping: 'boolean',
    developerName: 'string',
    master: 'boolean',
    name: 'string',
    recordTypeId: 'string', // ID,
  }],
  replicateable: 'boolean',
  retrieveable: 'boolean',
  searchLayoutable: 'boolean',
  searchable: 'boolean',
  supportedScopes: [{
    label: 'string',
    name: 'string',
  }],
  triggerable: 'boolean',
  undeletable: 'boolean',
  updateable: 'boolean',
  urlDetail: 'string',
  urlEdit: 'string',
  urlNew: 'string',
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL3NvYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogQGZpbGUgU2FsZXNmb3JjZSBTT0FQIEFQSVxuICogQGF1dGhvciBTaGluaWNoaSBUb21pdGEgPHNoaW5pY2hpLnRvbWl0YUBnbWFpbC5jb20+XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJ2xvZGFzaC9jb3JlJyk7XG52YXIganNmb3JjZSA9IHdpbmRvdy5qc2ZvcmNlLnJlcXVpcmUoJy4vY29yZScpO1xudmFyIFNPQVAgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCcuL3NvYXAnKTtcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFBhcnRuZXIgU09BUCBjYWxsXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Nvbm5lY3Rpb259IGNvbm4gLSBDb25uZWN0aW9uXG4gKi9cbnZhciBTb2FwQXBpID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjb25uKSB7XG4gIHRoaXMuX2Nvbm4gPSBjb25uO1xufTtcblxuLyoqXG4gKiBDYWxsIFNPQVAgQXBpIChQYXJ0bmVyKSBlbmRwb2ludFxuICogQHByaXZhdGVcbiAqL1xuU29hcEFwaS5wcm90b3R5cGUuX2ludm9rZSA9IGZ1bmN0aW9uKG1ldGhvZCwgbWVzc2FnZSwgc2NoZW1hLCBjYWxsYmFjaykge1xuICB2YXIgc29hcEVuZHBvaW50ID0gbmV3IFNPQVAodGhpcy5fY29ubiwge1xuICAgIHhtbG5zOiBcInVybjpwYXJ0bmVyLnNvYXAuc2ZvcmNlLmNvbVwiLFxuICAgIGVuZHBvaW50VXJsOiB0aGlzLl9jb25uLmluc3RhbmNlVXJsICsgXCIvc2VydmljZXMvU29hcC91L1wiICsgdGhpcy5fY29ubi52ZXJzaW9uXG4gIH0pO1xuICByZXR1cm4gc29hcEVuZHBvaW50Lmludm9rZShtZXRob2QsIG1lc3NhZ2UsIHsgcmVzdWx0OiBzY2hlbWEgfSkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICByZXR1cm4gcmVzLnJlc3VsdDtcbiAgfSkudGhlbkNhbGwoY2FsbGJhY2spO1xufTtcblxuXG4vKiAqL1xudmFyIFNjaGVtYXMgPSB7fTtcblxuLyoqXG4gKiBAdHlwZWRlZiBTb2FwQXBpfkxlYWRDb252ZXJ0XG4gKiBAcHJvcCB7U3RyaW5nfSBjb252ZXJ0ZWRTdGF0dXMgLSBTdGF0dXMgb2YgY29udmVydGVkIGxlYWRcbiAqIEBwcm9wIHtTdHJpbmd9IGxlYWRJZCAtIExlYWQgcmVjb3JkIElkIHRvIGNvbnZlcnRcbiAqIEBwcm9wIHtTdHJpbmd9IFthY2NvdW50SWRdIC0gQWNjb3VudCByZWNvcmQgSWQgdG8gYXNzaWduIHRoZSBjb252ZXJ0ZWQgcmVjb3JkXG4gKiBAcHJvcCB7U3RyaW5nfSBbY29udGFjdElkXSAtIENvbnRhY3QgcmVjb3JkIElkIHRvIGFzc2lnbiB0aGUgY29udmVydGVkIHJlY29yZFxuICogQHByb3Age0Jvb2xlYW59IFtkb05vdENyZWF0ZU9wcG9ydHVuaXR5XSAtIFRydWUgaWYgeW91IGRvbid0IHdhbnQgdG8gY3JlYXRlIGEgbmV3IG9wcG9ydHVuaXR5XG4gKiBAcHJvcCB7U3RyaW5nfSBbb3Bwb3J0dW5pdHlOYW1lXSAtIE5hbWUgb2Ygb3Bwb3J0dW5pdHkgdG8gY3JlYXRlXG4gKiBAcHJvcCB7Qm9vbGVhbn0gW292ZXJ3cml0ZUxlYWRTb3VyY2VdIC0gVHJ1ZSBpZiBvdmVyd3JpdGluZyBsZWFkIHNvdXJjZVxuICogQHByb3Age1N0cmluZ30gW293bmVySWRdIC0gT3duZXIgSWRcbiAqIEBwcm9wIHtCb29sZWFufSBbc2VuZE5vdGlmaWNhdGlvbkVtYWlsXSAtIFRydWUgaWYgc2VuZCBub3RpZmljYXRpb24gZW1haWxcbiAqL1xuLyoqXG4gKiBAdHlwZWRlZiBTb2FwQXBpfkxlYWRDb252ZXJ0UmVzdWx0XG4gKiBAcHJvcCB7U3RyaW5nfSBsZWFkSWQgLSBMZWFkIHJlY29yZCBJZCB0byBjb252ZXJ0XG4gKiBAcHJvcCB7U3RyaW5nfSBbYWNjb3VudElkXSAtIEFjY291bnQgcmVjb3JkIElkIG9mIGNvbnZlcnRlZCBsZWFkXG4gKiBAcHJvcCB7U3RyaW5nfSBbY29udGFjdElkXSAtIENvbnRhY3QgcmVjb3JkIElkIG9mIGNvbnZlcnRlZCBsZWFkXG4gKiBAcHJvcCB7U3RyaW5nfSBbb3Bwb3J0dW5pdHlJZF0gLSBPcHBvcnR1bml0eSByZWNvcmQgSWQgY3JlYXRlZCBpbiBjb252ZXJzaW9uXG4gKiBAcHJvcCB7Qm9vbGVhbn0gc3VjY2VzcyAtIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGNvbnZlcnRlZFxuICogQHByb3Age0FycmF5LjxPYmplY3Q+fSBlcnJvcnMgLSBFcnJvclxuICovXG4vKipcbiAqIENvbnZlcnRzIGEgTGVhZCBpbnRvIGFuIEFjY291bnQsIENvbnRhY3QsIG9yIChvcHRpb25hbGx5KSBhbiBPcHBvcnR1bml0eS5cbiAqXG4gKiBAcGFyYW0ge1NvYXBBcGl+TGVhZENvbnZlcnR8QXJyYXkuPFNvYXBBcGl+TGVhZENvbnZlcnQ+fSBsZWFkQ29udmVydHNcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFNvYXBBcGl+TGVhZENvbnZlcnRSZXN1bHR8QXJyYXkuPFNvYXBBcGl+TGVhZENvbnZlcnRSZXN1bHQ+Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48U29hcEFwaX5MZWFkQ29udmVydFJlc3VsdHxBcnJheS48U29hcEFwaX5MZWFkQ29udmVydFJlc3VsdD4+fVxuICovXG5Tb2FwQXBpLnByb3RvdHlwZS5jb252ZXJ0TGVhZCA9IGZ1bmN0aW9uKGxlYWRDb252ZXJ0cywgY2FsbGJhY2spIHtcbiAgdmFyIHNjaGVtYSA9IF8uaXNBcnJheShsZWFkQ29udmVydHMpID8gWyBTY2hlbWFzLkxlYWRDb252ZXJ0UmVzdWx0IF0gOiBTY2hlbWFzLkxlYWRDb252ZXJ0UmVzdWx0O1xuICByZXR1cm4gdGhpcy5faW52b2tlKFwiY29udmVydExlYWRcIiwgeyBsZWFkQ29udmVydHM6IGxlYWRDb252ZXJ0cyB9LCBzY2hlbWEsIGNhbGxiYWNrKTtcbn07XG5TY2hlbWFzLkxlYWRDb252ZXJ0UmVzdWx0ID0ge1xuICBzdWNjZXNzOiAnYm9vbGVhbicsXG4gIGVycm9yczogW10sXG4gIGxlYWRJZDogJ3N0cmluZycsXG4gIGFjY291bnRJZDogJ3N0cmluZycsXG4gIGNvbnRhY3RJZDogJ3N0cmluZycsXG4gIG9wcG9ydHVuaXR5SWQ6ICdzdHJpbmcnXG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIFNvYXBBcGl+TWVyZ2VSZXF1ZXN0XG4gKiBAcHJvcCB7T2JqZWN0fSBtYXN0ZXJSZWNvcmQgLSBUaGUgbWVyZ2UgZGVzdGluYXRpb24gcmVjb3JkXG4gKiBAcHJvcCB7QXJyYXkuPFN0cmluZz59IHJlY29yZFRvTWVyZ2VJZHMgLSBJZHMgb2YgcmVjb3JkcyB0byBtZXJnZVxuICovXG4vKipcbiAqIEB0eXBlZGVmIFNvYXBBcGl+TWVyZ2VSZXN1bHRcbiAqIEBwcm9wIHtCb29sZWFufSBzdWNjZXNzIC0gVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgbWVyZ2VkXG4gKiBAcHJvcCB7QXJyYXkuPE9iamVjdD59IGVycm9ycyAtIEVycm9yXG4gKiBAcHJvcCB7U3RyaW5nfSBpZCAtIElEIG9mIHRoZSBtYXN0ZXIgcmVjb3JkXG4gKiBAcHJvcCB7QXJyYXkuPFN0cmluZz59IG1lcmdlZFJlY29yZElkcyAtIElEIG9mIHRoZSByZWNvcmRzIHRoYXQgd2VyZSBtZXJnZWQgaW50byB0aGUgbWFzdGVyIHJlY29yZFxuICogQHByb3Age0FycmF5LjxTdHJpbmc+fSB1cGRhdGVkUmVsYXRlZElkcyAtIElEIG9mIGFsbCByZWxhdGVkIHJlY29yZHMgdGhhdCB3ZXJlIG1vdmVkIChyZS1wYXJlbnRlZCkgYXMgYSByZXN1bHQgb2YgdGhlIG1lcmdlXG4gKi9cblxuLyoqXG4gKiBNZXJnZSB1cCB0byB0aHJlZSByZWNvcmRzIGludG8gb25lXG4gKlxuICogQHBhcmFtIHtTb2FwQXBpfk1lcmdlUmVxdWVzdHxBcnJheS48U29hcEFwaX5NZXJnZVJlcXVlc3Q+fSBtZXJnZVJlcXVlc3RzXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpfk1lcmdlUmVzdWx0fEFycmF5LjxTb2FwQXBpfk1lcmdlUmVzdWx0Pj59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMge1Byb21pc2UuPFNvYXBBcGl+TWVyZ2VSZXN1bHR8QXJyYXkuPFNvYXBBcGl+TWVyZ2VSZXN1bHQ+Pn1cbiAqL1xuU29hcEFwaS5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbihtZXJnZVJlcXVlc3RzLCBjYWxsYmFjaykge1xuICB2YXIgc2NoZW1hID0gXy5pc0FycmF5KG1lcmdlUmVxdWVzdHMpID8gWyBTY2hlbWFzLk1lcmdlUmVzdWx0IF0gOiBTY2hlbWFzLk1lcmdlUmVzdWx0O1xuICByZXR1cm4gdGhpcy5faW52b2tlKFwibWVyZ2VcIiwgeyBtZXJnZVJlcXVlc3RzOiBtZXJnZVJlcXVlc3RzIH0sIHNjaGVtYSwgY2FsbGJhY2spO1xufTtcblNjaGVtYXMuTWVyZ2VSZXN1bHQgPSB7XG4gIHN1Y2Nlc3M6ICdib29sZWFuJyxcbiAgZXJyb3JzOiBbXSxcbiAgaWQ6ICdzdHJpbmcnLFxuICBtZXJnZWRSZWNvcmRJZHM6IFsnc3RyaW5nJ10sXG4gIHVwZGF0ZWRSZWxhdGVkSWRzOiBbJ3N0cmluZyddXG59O1xuXG5cbi8qKlxuICogQHR5cGVkZWYgU29hcEFwaX5FbXB0eVJlY3ljbGVCaW5SZXN1bHRcbiAqIEBwcm9wIHtTdHJpbmd9IGlkIC0gSUQgb2YgYW4gc09iamVjdCB0aGF0IHlvdSBhdHRlbXB0ZWQgdG8gZGVsZXRlIGZyb20gdGhlIFJlY3ljbGUgQmluXG4gKiBAcHJvcCB7Qm9vbGVhbn0gc3VjY2VzcyAtIFdoZXRoZXIgdGhlIGNhbGwgc3VjY2VlZGVkICh0cnVlKSBvciBub3QgKGZhbHNlKSBmb3IgdGhpcyByZWNvcmRcbiAqIEBwcm9wIHtBcnJheS48T2JqZWN0Pn0gZXJyb3JzIC0gRXJyb3JzXG4gKi9cbi8qKlxuICogRGVsZXRlIHJlY29yZHMgZnJvbSB0aGUgcmVjeWNsZSBiaW4gaW1tZWRpYXRlbHlcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxTdHJpbmc+fSBpZHMgLSBSZWNvcmQgaWRzIHRvIGVtcHR5IGZyb20gcmVjeWNsZSBiaW5cbiAqIEBwYXJhbSB7Q2FsbGJhY2suPEFycmF5LjxTb2FwQXBpfkVtcHR5UmVjeWNsZUJpblJlc3VsdD4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBcnJheS48U29hcEFwaX5FbXB0eVJlY3ljbGVCaW5SZXN1bHQ+Pn1cbiAqL1xuU29hcEFwaS5wcm90b3R5cGUuZW1wdHlSZWN5Y2xlQmluID0gZnVuY3Rpb24oaWRzLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5faW52b2tlKFwiZW1wdHlSZWN5Y2xlQmluXCIsIHsgaWRzOiBpZHMgfSwgWyBTY2hlbWFzLkVtcHR5UmVjeWNsZUJpblJlc3VsdCBdLCBjYWxsYmFjayk7XG59O1xuU2NoZW1hcy5FbXB0eVJlY3ljbGVCaW5SZXN1bHQgPSB7XG4gIGlkOiAnc3RyaW5nJyxcbiAgc3VjY2VzczogJ2Jvb2xlYW4nLFxuICBlcnJvcnM6IFtdXG59O1xuXG5cbi8qKlxuICogQHR5cGVkZWYgU29hcEFwaX5EZXNjcmliZVRhYlNldFJlc3VsdFxuICogQHByb3Age1N0cmluZ30gbGFiZWwgLSBUaGUgZGlzcGxheSBsYWJlbCBmb3IgdGhpcyBzdGFuZGFyZCBvciBjdXN0b20gYXBwXG4gKiBAcHJvcCB7U3RyaW5nfSBsb2dvVXJsIC0gQSBmdWxseSBxdWFsaWZpZWQgVVJMIHRvIHRoZSBsb2dvIGltYWdlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3RhbmRhcmQgb3IgY3VzdG9tIGFwcFxuICogQHByb3Age1N0cmluZ30gbmFtZXNwYWNlIC0gTmFtZXNwYWNlIG9mIGFwcGxpY2F0aW9uIHBhY2thZ2VcbiAqIEBwcm9wIHtCb29sZWFufSBzZWxlY3RlZCAtIElmIHRydWUsIHRoZW4gdGhpcyBzdGFuZGFyZCBvciBjdXN0b20gYXBwIGlzIHRoZSB1c2Vy4oCZcyBjdXJyZW50bHkgc2VsZWN0ZWQgYXBwXG4gKiBAcHJvcCB7QXJyYXkuPFNvYXBBcGl+RGVzY3JpYmVUYWI+fSB0YWJzIC0gQW4gYXJyYXkgb2YgdGFicyB0aGF0IGFyZSBkaXNwbGF5ZWQgZm9yIHRoZSBzcGVjaWZpZWQgc3RhbmRhcmQgYXBwIG9yIGN1c3RvbSBhcHBcbiAqL1xuLyoqXG4gKiBAdHlwZWRlZiBTb2FwQXBpfkRlc2NyaWJlVGFiXG4gKiBAcHJvcCB7QXJyYXkuPE9iamVjdD59IGNvbG9ycyAtIEFycmF5IG9mIGNvbG9yIGluZm9ybWF0aW9uIHVzZWQgZm9yIGEgdGFiXG4gKiBAcHJvcCB7Qm9vbGVhbn0gY3VzdG9tIC0gdHJ1ZSBpZiB0aGlzIGlzIGEgY3VzdG9tIHRhYlxuICogQHByb3Age1N0cmluZ30gaWNvblVybCAtIFRoZSBVUkwgZm9yIHRoZSBtYWluIDMyIHggMzIgcGl4ZWwgaWNvbiBmb3IgYSB0YWJcbiAqIEBwcm9wIHtBcnJheS48T2JqZWN0Pn0gaWNvbnMgLSBBcnJheSBvZiBpY29uIGluZm9ybWF0aW9uIHVzZWQgZm9yIGEgdGFiXG4gKiBAcHJvcCB7U3RyaW5nfSBsYWJlbCAtIFRoZSBkaXNwbGF5IGxhYmVsIGZvciB0aGlzIHRhYlxuICogQHByb3Age1N0cmluZ30gbWluaUljb25VcmwgLSBUaGUgVVJMIGZvciB0aGUgMTYgeCAxNiBwaXhlbCBpY29uIHRoYXQgcmVwcmVzZW50cyBhIHRhYlxuICogQHByb3Age1N0cmluZ30gbmFtZSAtIFRoZSBBUEkgbmFtZSBvZiB0aGUgdGFiXG4gKiBAcHJvcCB7U3RyaW5nfSBzb2JqZWN0TmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzT2JqZWN0IHRoYXQgaXMgcHJpbWFyaWx5IGRpc3BsYXllZCBvbiB0aGlzIHRhYlxuICogQHByb3Age1N0cmluZ30gdXJsIC0gQSBmdWxseSBxdWFsaWZpZWQgVVJMIGZvciB2aWV3aW5nIHRoaXMgdGFiXG4gKi9cbi8qKlxuICogUmV0dXJucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3RhbmRhcmQgYW5kIGN1c3RvbSBhcHBzIGF2YWlsYWJsZSB0byB0aGUgbG9nZ2VkLWluIHVzZXJcbiAqXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxBcnJheS48U29hcEFwaX5EZXNjcmliZVRhYlNldFJlc3VsdD4+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxBcnJheS48U29hcEFwaX5EZXNjcmliZVRhYlNldFJlc3VsdD4+fVxuICovXG5Tb2FwQXBpLnByb3RvdHlwZS5kZXNjcmliZVRhYnMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5faW52b2tlKFwiZGVzY3JpYmVUYWJzXCIsIHt9LCBbIFNjaGVtYXMuRGVzY3JpYmVUYWJTZXRSZXN1bHQgXSwgY2FsbGJhY2spO1xufTtcblNjaGVtYXMuRGVzY3JpYmVUYWJTZXRSZXN1bHQgPSB7XG4gIGxhYmVsOiAnc3RyaW5nJyxcbiAgbG9nb1VybDogJ3N0cmluZycsXG4gIG5hbWVzcGFjZTogJ3N0cmluZycsXG4gIHNlbGVjdGVkOiAnYm9vbGVhbicsXG4gIHRhYnM6IFt7XG4gICAgY29sb3JzOiBbe1xuICAgICAgdGhlbWU6ICdzdHJpbmcnLFxuICAgICAgY29sb3I6ICdzdHJpbmcnLFxuICAgICAgY29udGV4dDogJ3N0cmluZydcbiAgICB9XSxcbiAgICBpY29uVXJsOiAnc3RyaW5nJyxcbiAgICBpY29uczogW3tcbiAgICAgIHRoZW1lOiAnc3RyaW5nJyxcbiAgICAgIGhlaWdodDogJ251bWJlcicsXG4gICAgICB3aWR0aDogJ251bWJlcicsXG4gICAgICB1cmw6ICdzdHJpbmcnLFxuICAgICAgY29udGVudFR5cGU6ICdzdHJpbmcnXG4gICAgfV0sXG4gICAgbGFiZWw6ICdzdHJpbmcnLFxuICAgIGN1c3RvbTogJ2Jvb2xlYW4nLFxuICAgIG1pbmlJY29uVXJsOiAnc3RyaW5nJyxcbiAgICBuYW1lOiAnc3RyaW5nJyxcbiAgICBzb2JqZWN0TmFtZTogJ3N0cmluZycsXG4gICAgdXJsOiAnc3RyaW5nJ1xuICB9XVxufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgc3lzdGVtIHRpbWVzdGFtcCAoQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUgKFVUQykgdGltZSB6b25lKSBmcm9tIHRoZSBBUElcbiAqXG4gKiBAdHlwZWRlZiBTb2FwQXBpflNlcnZlclRpbWVzdGFtcFJlc3VsdFxuICogQHByb3Age1N0cmluZ30gdGltZXN0YW1wIC0gVGltZXN0YW1wXG4gKi9cbi8qKlxuICogQHBhcmFtIHtDYWxsYmFjay48U29hcEFwaX5TZXJ2ZXJUaW1lc3RhbXBSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTb2FwQXBpflNlcnZlclRpbWVzdGFtcFJlc3VsdD59XG4gKi9cblNvYXBBcGkucHJvdG90eXBlLmdldFNlcnZlclRpbWVzdGFtcCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJnZXRTZXJ2ZXJUaW1lc3RhbXBcIiwge30sIFNjaGVtYXMuR2V0U2VydmVyVGltZXN0YW1wUmVzdWx0LCBjYWxsYmFjayk7XG59O1xuU2NoZW1hcy5HZXRTZXJ2ZXJUaW1lc3RhbXBSZXN1bHQgPSB7XG4gIHRpbWVzdGFtcDogJ3N0cmluZydcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgU29hcEFwaX5Vc2VySW5mb1Jlc3VsdFxuICogQHByb3Age0Jvb2xlYW59IGFjY2Vzc2liaWxpdHlNb2RlXG4gKiBAcHJvcCB7U3RyaW5nfSBjdXJyZW5jeVN5bWJvbFxuICogQHByb3Age051bWJlcn0gb3JnQXR0YWNobWVudEZpbGVTaXplTGltaXRcbiAqIEBwcm9wIHtTdHJpbmd9IG9yZ0RlZmF1bHRDdXJyZW5jeUlzb0NvZGVcbiAqIEBwcm9wIHtTdHJpbmd9IG9yZ0Rpc2FsbG93SHRtbEF0dGFjaG1lbnRzXG4gKiBAcHJvcCB7Qm9vbGVhbn0gb3JnSGFzUGVyc29uQWNjb3VudHNcbiAqIEBwcm9wIHtTdHJpbmd9IG9yZ2FuaXphdGlvbklkXG4gKiBAcHJvcCB7Qm9vbGVhbn0gb3JnYW5pemF0aW9uTXVsdGlDdXJyZW5jeVxuICogQHByb3Age1N0cmluZ30gb3JnYW5pemF0aW9uTmFtZVxuICogQHByb3Age1N0cmluZ30gcHJvZmlsZUlkXG4gKiBAcHJvcCB7U3RyaW5nfSByb2xlSWRcbiAqIEBwcm9wIHtOdW1iZXJ9IHNlc3Npb25TZWNvbmRzVmFsaWRcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJEZWZhdWx0Q3VycmVuY3lJc29Db2RlXG4gKiBAcHJvcCB7U3RyaW5nfSB1c2VyRW1haWxcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJGdWxsTmFtZVxuICogQHByb3Age1N0cmluZ30gdXNlcklkXG4gKiBAcHJvcCB7U3RyaW5nfSB1c2VyTGFuZ3VhZ2VcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJMb2NhbGVcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJOYW1lXG4gKiBAcHJvcCB7U3RyaW5nfSB1c2VyVGltZVpvbmVcbiAqIEBwcm9wIHtTdHJpbmd9IHVzZXJUeXBlXG4gKiBAcHJvcCB7U3RyaW5nfSB1c2VyVWlTa2luXG4gKi9cbi8qKlxuICogUmV0cmlldmVzIHBlcnNvbmFsIGluZm9ybWF0aW9uIGZvciB0aGUgdXNlciBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnQgc2Vzc2lvblxuICpcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFNvYXBBcGl+VXNlckluZm9SZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTb2FwQXBpflVzZXJJbmZvUmVzdWx0Pn1cbiAqL1xuU29hcEFwaS5wcm90b3R5cGUuZ2V0VXNlckluZm8gPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5faW52b2tlKFwiZ2V0VXNlckluZm9cIiwge30sIFNjaGVtYXMuR2V0VXNlckluZm9SZXN1bHQsIGNhbGxiYWNrKTtcbn07XG5TY2hlbWFzLkdldFVzZXJJbmZvUmVzdWx0ID0ge1xuICBhY2Nlc3NpYmlsaXR5TW9kZTogJ2Jvb2xlYW4nLFxuICBjdXJyZW5jeVN5bWJvbDogJ3N0cmluZycsXG4gIG9yZ0F0dGFjaG1lbnRGaWxlU2l6ZUxpbWl0OiAnbnVtYmVyJyxcbiAgb3JnRGVmYXVsdEN1cnJlbmN5SXNvQ29kZTogJ3N0cmluZycsXG4gIG9yZ0Rpc2FsbG93SHRtbEF0dGFjaG1lbnRzOiAnYm9vbGVhbicsXG4gIG9yZ0hhc1BlcnNvbkFjY291bnRzOiAnYm9vbGVhbicsXG4gIG9yZ2FuaXphdGlvbklkOiAnc3RyaW5nJyxcbiAgb3JnYW5pemF0aW9uTXVsdGlDdXJyZW5jeTogJ2Jvb2xlYW4nLFxuICBvcmdhbml6YXRpb25OYW1lOiAnc3RyaW5nJyxcbiAgcHJvZmlsZUlkOiAnc3RyaW5nJyxcbiAgcm9sZUlkOiAnc3RyaW5nJyxcbiAgc2Vzc2lvblNlY29uZHNWYWxpZDogJ251bWJlcicsXG4gIHVzZXJEZWZhdWx0Q3VycmVuY3lJc29Db2RlOiAnc3RyaW5nJyxcbiAgdXNlckVtYWlsOiAnc3RyaW5nJyxcbiAgdXNlckZ1bGxOYW1lOiAnc3RyaW5nJyxcbiAgdXNlcklkOiAnc3RyaW5nJyxcbiAgdXNlckxhbmd1YWdlOiAnc3RyaW5nJyxcbiAgdXNlckxvY2FsZTogJ3N0cmluZycsXG4gIHVzZXJOYW1lOiAnc3RyaW5nJyxcbiAgdXNlclRpbWVab25lOiAnc3RyaW5nJyxcbiAgdXNlclR5cGU6ICdzdHJpbmcnLFxuICB1c2VyVWlTa2luOiAnc3RyaW5nJ1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBzcGVjaWZpZWQgdXNlcuKAmXMgcGFzc3dvcmQgdG8gdGhlIHNwZWNpZmllZCB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgLSBVc2VyIElkIHRvIHNldCBwYXNzd29yZFxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gTmV3IHBhc3N3b3JkXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTdHJpbmc+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTdHJpbmc+fVxuICovXG5Tb2FwQXBpLnByb3RvdHlwZS5zZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXJJZCwgcGFzc3dvcmQsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJzZXRQYXNzd29yZFwiLCB7IHVzZXJJZDogdXNlcklkLCBwYXNzd29yZDogcGFzc3dvcmQgfSwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiBTb2FwQXBpflJlc2V0UGFzc3dvcmRSZXN1bHRcbiAqIEBwcm9wIHtTdHJpbmd9IHBhc3N3b3JkXG4gKi9cbi8qKlxuICogUmVzZXRzIHRoZSBzcGVjaWZpZWQgdXNlcuKAmXMgcGFzc3dvcmRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIC0gVXNlciBJZCB0byBzZXQgcGFzc3dvcmRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIE5ldyBwYXNzd29yZFxuICogQHBhcmFtIHtDYWxsYmFjay48U29hcEFwaX5SZXNldFBhc3N3b3JkUmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48U29hcEFwaX5SZXNldFBhc3N3b3JkUmVzdWx0Pn1cbiAqL1xuU29hcEFwaS5wcm90b3R5cGUucmVzZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHVzZXJJZCwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcInJlc2V0UGFzc3dvcmRcIiwgeyB1c2VySWQ6IHVzZXJJZCB9LCBjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIEFkZHMgb25lIG9yIG1vcmUgbmV3IHJlY29yZHMgdG8geW91ciBvcmdhbml6YXRpb27igJlzIGRhdGFcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBzT2JqZWN0cyAtIFJlY29yZHMgdG8gaW5zZXJ0XG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpflNhdmVSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTb2FwQXBpflNhdmVSZXN1bHQ+fVxuICovXG5Tb2FwQXBpLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihzT2JqZWN0cywgY2FsbGJhY2spIHtcbiAgdmFyIHNjaGVtYSA9IF8uaXNBcnJheShzT2JqZWN0cykgPyBbIFNjaGVtYXMuU2F2ZVJlc3VsdCBdIDogU2NoZW1hcy5TYXZlUmVzdWx0O1xuICB2YXIgYXJncyA9IHtcbiAgICAnQHhtbG5zJyA6ICd1cm46cGFydG5lci5zb2FwLnNmb3JjZS5jb20nLFxuICAgICdAeG1sbnM6bnMxJyA6ICdzb2JqZWN0LnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcbiAgICAnbnMxOnNPYmplY3RzJyA6IHNPYmplY3RzXG4gIH07XG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJjcmVhdGVcIiwgYXJncywgc2NoZW1hLCBjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgb25lIG9yIG1vcmUgZXhpc3RpbmcgcmVjb3JkcyBpbiB5b3VyIG9yZ2FuaXphdGlvbuKAmXMgZGF0YS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBzT2JqZWN0cyAtIFJlY29yZHMgdG8gdXBkYXRlXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpflNhdmVSZXN1bHQ+fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTb2FwQXBpflNhdmVSZXN1bHQ+fVxuICovXG5Tb2FwQXBpLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihzT2JqZWN0cywgY2FsbGJhY2spIHtcbiAgdmFyIHNjaGVtYSA9IF8uaXNBcnJheShzT2JqZWN0cykgPyBbIFNjaGVtYXMuU2F2ZVJlc3VsdCBdIDogU2NoZW1hcy5TYXZlUmVzdWx0O1xuICB2YXIgYXJncyA9IHtcbiAgICAnQHhtbG5zJyA6ICd1cm46cGFydG5lci5zb2FwLnNmb3JjZS5jb20nLFxuICAgICdAeG1sbnM6bnMxJyA6ICdzb2JqZWN0LnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcbiAgICAnbnMxOnNPYmplY3RzJyA6IHNPYmplY3RzXG4gIH07XG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJ1cGRhdGVcIiwgYXJncywgc2NoZW1hLCBjYWxsYmFjayk7XG59O1xuXG5TY2hlbWFzLlNhdmVSZXN1bHQgPSB7XG4gIHN1Y2Nlc3M6ICdib29sZWFuJyxcbiAgZXJyb3JzOiBbXSxcbiAgaWQ6ICdzdHJpbmcnXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgbmV3IHJlY29yZHMgYW5kIHVwZGF0ZXMgZXhpc3RpbmcgcmVjb3JkcyBpbiB5b3VyIG9yZ2FuaXphdGlvbuKAmXMgZGF0YS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBzT2JqZWN0cyAtIFJlY29yZHMgdG8gdXBzZXJ0XG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTb2FwQXBpflVwc2VydFJlc3VsdD59IFtjYWxsYmFja10gLSBDYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybnMge1Byb21pc2UuPFNvYXBBcGl+VXBzZXJ0UmVzdWx0Pn1cbiAqL1xuU29hcEFwaS5wcm90b3R5cGUudXBzZXJ0ID0gZnVuY3Rpb24oZXh0ZXJuYWxJZEZpZWxkTmFtZSwgc09iamVjdHMsIGNhbGxiYWNrKSB7XG4gIHZhciBzY2hlbWEgPSBfLmlzQXJyYXkoc09iamVjdHMpID8gWyBTY2hlbWFzLlVwc2VydFJlc3VsdCBdIDogU2NoZW1hcy5VcHNlcnRSZXN1bHQ7XG4gIHZhciBhcmdzID0ge1xuICAgICdAeG1sbnMnIDogJ3VybjpwYXJ0bmVyLnNvYXAuc2ZvcmNlLmNvbScsXG4gICAgJ0B4bWxuczpuczEnIDogJ3NvYmplY3QucGFydG5lci5zb2FwLnNmb3JjZS5jb20nLFxuICAgICduczE6ZXh0ZXJuYWxJREZpZWxkTmFtZScgOiBleHRlcm5hbElkRmllbGROYW1lLFxuICAgICduczE6c09iamVjdHMnIDogc09iamVjdHNcbiAgfTtcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcInVwc2VydFwiLCBhcmdzLCBzY2hlbWEsIGNhbGxiYWNrKTtcbn07XG5cblNjaGVtYXMuVXBzZXJ0UmVzdWx0ID0ge1xuICBjcmVhdGVkOiAnYm9vbGVhbicsXG4gIHN1Y2Nlc3M6ICdib29sZWFuJyxcbiAgZXJyb3JzOiBbXSxcbiAgaWQ6ICdzdHJpbmcnXG59O1xuXG4vKipcbiAqIERlbGV0ZXMgb25lIG9yIG1vcmUgcmVjb3JkcyBmcm9tIHlvdXIgb3JnYW5pemF0aW9u4oCZcyBkYXRhXG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gaWRzIC0gSWQgb2YgcmVjb3JkcyB0byBkZWxldGVcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFNvYXBBcGl+RGVsZXRlUmVzdWx0Pn0gW2NhbGxiYWNrXSAtIENhbGxiYWNrIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7UHJvbWlzZS48U29hcEFwaX5EZWxldGVSZXN1bHQ+fVxuICovXG5Tb2FwQXBpLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbihpZHMsIGNhbGxiYWNrKSB7XG4gIHZhciBzY2hlbWEgPSBfLmlzQXJyYXkoaWRzKSA/IFsgU2NoZW1hcy5EZWxldGVSZXN1bHQgXSA6IFNjaGVtYXMuRGVsZXRlUmVzdWx0O1xuICB2YXIgYXJncyA9IHtcbiAgICAnQHhtbG5zJyA6ICd1cm46cGFydG5lci5zb2FwLnNmb3JjZS5jb20nLFxuICAgICdAeG1sbnM6bnMxJyA6ICdzb2JqZWN0LnBhcnRuZXIuc29hcC5zZm9yY2UuY29tJyxcbiAgICAnbnMxOmlkcycgOiBpZHNcbiAgfTtcbiAgcmV0dXJuIHRoaXMuX2ludm9rZShcImRlbGV0ZVwiLCBhcmdzLCBzY2hlbWEsIGNhbGxiYWNrKTtcbn07XG5cblNjaGVtYXMuRGVsZXRlUmVzdWx0ID0ge1xuICBzdWNjZXNzOiAnYm9vbGVhbicsXG4gIGVycm9yczogW10sXG4gIGlkOiAnc3RyaW5nJ1xufTtcblxuXG4vKipcbiAqIERlc2NyaWJlcyBtZXRhZGF0YSAoZmllbGQgbGlzdCBhbmQgb2JqZWN0IHByb3BlcnRpZXMpIGZvciB0aGUgc3BlY2lmaWVkIG9iamVjdCBvciBhcnJheSBvZiBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPFN0cmluZz59IHR5cGVOYW1lcyAtIE5hbWVzIG9mIFNPYmplY3QgdHlwZXMgdG8gZGVzY3JpYmVcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFNvYXBBcGl+RGVzY3JpYmVTT2JqZWN0UmVzdWx0fSBbY2FsbGJhY2tdIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHtQcm9taXNlLjxTb2FwQXBpfkRlc2NyaWJlU09iamVjdFJlc3VsdH1cbiAqL1xuU29hcEFwaS5wcm90b3R5cGUuZGVzY3JpYmVTT2JqZWN0cyA9IGZ1bmN0aW9uKHR5cGVOYW1lcywgY2FsbGJhY2spIHtcbiAgdmFyIHNjaGVtYSA9IF8uaXNBcnJheSh0eXBlTmFtZXMpID8gWyBTY2hlbWFzLkRlc2NyaWJlU09iamVjdFJlc3VsdCBdIDogU2NoZW1hcy5EZXNjcmliZVNPYmplY3RSZXN1bHQ7XG4gIHZhciBhcmdzID0ge1xuICAgICdAeG1sbnMnIDogJ3VybjpwYXJ0bmVyLnNvYXAuc2ZvcmNlLmNvbScsXG4gICAgJ0B4bWxuczpuczEnIDogJ3NvYmplY3QucGFydG5lci5zb2FwLnNmb3JjZS5jb20nLFxuICAgICduczE6c09iamVjdFR5cGUnIDogdHlwZU5hbWVzXG4gIH07XG4gIHJldHVybiB0aGlzLl9pbnZva2UoXCJkZXNjcmliZVNPYmplY3RzXCIsIGFyZ3MsIHNjaGVtYSwgY2FsbGJhY2spXG59XG5cblNjaGVtYXMuRGVzY3JpYmVTT2JqZWN0UmVzdWx0ID0ge1xuICBhY3Rpb25PdmVycmlkZXM6IFt7XG4gICAgZm9ybUZhY3RvcjogJ3N0cmluZycsXG4gICAgaXNBdmFpbGFibGVJblRvdWNoOiAnYm9vbGVhbicsXG4gICAgbmFtZTogJ3N0cmluZycsXG4gICAgcGFnZUlkOiAnc3RyaW5nJywgLy8gSUQsXG4gICAgdXJsOiAnc3RyaW5nJyxcbiAgfV0sXG4gIGFjdGl2YXRlYWJsZTogJ2Jvb2xlYW4nLFxuICBjaGlsZFJlbGF0aW9uc2hpcHM6IFt7XG4gICAgY2FzY2FkZURlbGV0ZTogJ2Jvb2xlYW4nLFxuICAgIGNoaWxkU09iamVjdDogJ3N0cmluZycsXG4gICAgZGVwcmVjYXRlZEFuZEhpZGRlbjogJ2Jvb2xlYW4nLFxuICAgIGZpZWxkOiAnc3RyaW5nJyxcbiAgICBqdW5jdGlvbklkTGlzdE5hbWVzOiBbJ3N0cmluZyddLFxuICAgIGp1bmN0aW9uUmVmZXJlbmNlVG86IFsnc3RyaW5nJ10sXG4gICAgcmVsYXRpb25zaGlwTmFtZTogJ3N0cmluZycsXG4gICAgcmVzdHJpY3RlZERlbGV0ZTogJ2Jvb2xlYW4nLFxuICB9XSxcbiAgY29tcGFjdExheW91dGFibGU6ICdib29sZWFuJyxcbiAgY3JlYXRlYWJsZTogJ2Jvb2xlYW4nLFxuICBjdXN0b206ICdib29sZWFuJyxcbiAgY3VzdG9tU2V0dGluZzogJ2Jvb2xlYW4nLFxuICBkZWxldGFibGU6ICdib29sZWFuJyxcbiAgZGVwcmVjYXRlZEFuZEhpZGRlbjogJ2Jvb2xlYW4nLFxuICBmZWVkRW5hYmxlZDogJ2Jvb2xlYW4nLFxuICBmaWVsZHM6IFt7XG4gICAgYWdncmVnYXRhYmxlOiAnYm9vbGVhbicsXG4gICAgYWlQcmVkaWN0aW9uRmllbGQ6ICdib29sZWFuJyxcbiAgICBhdXRvTnVtYmVyOiAnYm9vbGVhbicsXG4gICAgYnl0ZUxlbmd0aDogJ251bWJlcicsXG4gICAgY2FsY3VsYXRlZDogJ2Jvb2xlYW4nLFxuICAgIGNhbGN1bGF0ZWRGb3JtdWxhOiAnc3RyaW5nJyxcbiAgICBjYXNjYWRlRGVsZXRlOiAnYm9vbGVhbicsXG4gICAgY2FzZVNlbnNpdGl2ZTogJ2Jvb2xlYW4nLFxuICAgIGNvbXBvdW5kRmllbGROYW1lOiAnc3RyaW5nJyxcbiAgICBjb250cm9sbGVyTmFtZTogJ3N0cmluZycsXG4gICAgY3JlYXRlYWJsZTogJ2Jvb2xlYW4nLFxuICAgIGN1c3RvbTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHRWYWx1ZTogJ2FueVR5cGUnLFxuICAgIGRlZmF1bHRWYWx1ZUZvcm11bGE6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHRlZE9uQ3JlYXRlOiAnYm9vbGVhbicsXG4gICAgZGVwZW5kZW50UGlja2xpc3Q6ICdib29sZWFuJyxcbiAgICBkZXByZWNhdGVkQW5kSGlkZGVuOiAnYm9vbGVhbicsXG4gICAgZGlnaXRzOiAnbnVtYmVyJyxcbiAgICBkaXNwbGF5TG9jYXRpb25JbkRlY2ltYWw6ICdib29sZWFuJyxcbiAgICBlbmNyeXB0ZWQ6ICdib29sZWFuJyxcbiAgICBleHRlcm5hbElkOiAnYm9vbGVhbicsXG4gICAgZXh0cmFUeXBlSW5mbzogJ3N0cmluZycsXG4gICAgZmlsdGVyYWJsZTogJ2Jvb2xlYW4nLFxuICAgIGZpbHRlcmVkTG9va3VwSW5mbzoge1xuICAgICAgY29udHJvbGxpbmdGaWVsZHM6IFsnc3RyaW5nJ10sXG4gICAgICBkZXBlbmRlbnQ6ICdib29sZWFuJyxcbiAgICAgIG9wdGlvbmFsRmlsdGVyOiAnYm9vbGVhbicsXG4gICAgfSxcbiAgICBmb3JtdWxhVHJlYXROdWxsTnVtYmVyQXNaZXJvOiAnYm9vbGVhbicsXG4gICAgZ3JvdXBhYmxlOiAnYm9vbGVhbicsXG4gICAgaGlnaFNjYWxlTnVtYmVyOiAnYm9vbGVhbicsXG4gICAgaHRtbEZvcm1hdHRlZDogJ2Jvb2xlYW4nLFxuICAgIGlkTG9va3VwOiAnYm9vbGVhbicsXG4gICAgaW5saW5lSGVscFRleHQ6ICdzdHJpbmcnLFxuICAgIGxhYmVsOiAnc3RyaW5nJyxcbiAgICBsZW5ndGg6ICdudW1iZXInLFxuICAgIG1hc2s6ICdzdHJpbmcnLFxuICAgIG1hc2tUeXBlOiAnc3RyaW5nJyxcbiAgICBuYW1lOiAnc3RyaW5nJyxcbiAgICBuYW1lRmllbGQ6ICdib29sZWFuJyxcbiAgICBuYW1lUG9pbnRpbmc6ICdib29sZWFuJyxcbiAgICBuaWxsYWJsZTogJ2Jvb2xlYW4nLFxuICAgIHBlcm1pc3Npb25hYmxlOiAnYm9vbGVhbicsXG4gICAgcGlja2xpc3RWYWx1ZXM6IFt7XG4gICAgICBhY3RpdmU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHRWYWx1ZTogJ2Jvb2xlYW4nLFxuICAgICAgbGFiZWw6ICdzdHJpbmcnLFxuICAgICAgdmFsaWRGb3I6ICdiYXNlNjRCaW5hcnknLFxuICAgICAgdmFsdWU6ICdzdHJpbmcnLFxuICAgIH1dLFxuICAgIHBvbHltb3JwaGljRm9yZWlnbktleTogJ2Jvb2xlYW4nLFxuICAgIHByZWNpc2lvbjogJ251bWJlcicsXG4gICAgcXVlcnlCeURpc3RhbmNlOiAnYm9vbGVhbicsXG4gICAgcmVmZXJlbmNlVGFyZ2V0RmllbGQ6ICdzdHJpbmcnLFxuICAgIHJlZmVyZW5jZVRvOiBbJ3N0cmluZyddLFxuICAgIHJlbGF0aW9uc2hpcE5hbWU6ICdzdHJpbmcnLFxuICAgIHJlbGF0aW9uc2hpcE9yZGVyOiAnbnVtYmVyJyxcbiAgICByZXN0cmljdGVkRGVsZXRlOiAnYm9vbGVhbicsXG4gICAgcmVzdHJpY3RlZFBpY2tsaXN0OiAnYm9vbGVhbicsXG4gICAgc2NhbGU6ICdudW1iZXInLFxuICAgIHNlYXJjaFByZWZpbHRlcmFibGU6ICdib29sZWFuJyxcbiAgICBzb2FwVHlwZTogJ3N0cmluZycsIC8vIHNvYXBUeXBlLFxuICAgIHNvcnRhYmxlOiAnYm9vbGVhbicsXG4gICAgdHlwZTogJ3N0cmluZycsIC8vIGZpZWxkVHlwZSxcbiAgICB1bmlxdWU6ICdib29sZWFuJyxcbiAgICB1cGRhdGVhYmxlOiAnYm9vbGVhbicsXG4gICAgd3JpdGVSZXF1aXJlc01hc3RlclJlYWQ6ICdib29sZWFuJyxcbiAgfV0sXG4gIGhhc1N1YnR5cGVzOiAnYm9vbGVhbicsXG4gIGlkRW5hYmxlZDogJ2Jvb2xlYW4nLFxuICBpc1N1YnR5cGU6ICdib29sZWFuJyxcbiAga2V5UHJlZml4OiAnc3RyaW5nJyxcbiAgbGFiZWw6ICdzdHJpbmcnLFxuICBsYWJlbFBsdXJhbDogJ3N0cmluZycsXG4gIGxheW91dGFibGU6ICdib29sZWFuJyxcbiAgbWVyZ2VhYmxlOiAnYm9vbGVhbicsXG4gIG1ydUVuYWJsZWQ6ICdib29sZWFuJyxcbiAgbmFtZTogJ3N0cmluZycsXG4gIG5hbWVkTGF5b3V0SW5mb3M6IFt7XG4gICAgbmFtZTogJ3N0cmluZycsXG4gIH1dLFxuICBuZXR3b3JrU2NvcGVGaWVsZE5hbWU6ICdzdHJpbmcnLFxuICBxdWVyeWFibGU6ICdib29sZWFuJyxcbiAgcmVjb3JkVHlwZUluZm9zOiBbe1xuICAgIGFjdGl2ZTogJ2Jvb2xlYW4nLFxuICAgIGF2YWlsYWJsZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHRSZWNvcmRUeXBlTWFwcGluZzogJ2Jvb2xlYW4nLFxuICAgIGRldmVsb3Blck5hbWU6ICdzdHJpbmcnLFxuICAgIG1hc3RlcjogJ2Jvb2xlYW4nLFxuICAgIG5hbWU6ICdzdHJpbmcnLFxuICAgIHJlY29yZFR5cGVJZDogJ3N0cmluZycsIC8vIElELFxuICB9XSxcbiAgcmVwbGljYXRlYWJsZTogJ2Jvb2xlYW4nLFxuICByZXRyaWV2ZWFibGU6ICdib29sZWFuJyxcbiAgc2VhcmNoTGF5b3V0YWJsZTogJ2Jvb2xlYW4nLFxuICBzZWFyY2hhYmxlOiAnYm9vbGVhbicsXG4gIHN1cHBvcnRlZFNjb3BlczogW3tcbiAgICBsYWJlbDogJ3N0cmluZycsXG4gICAgbmFtZTogJ3N0cmluZycsXG4gIH1dLFxuICB0cmlnZ2VyYWJsZTogJ2Jvb2xlYW4nLFxuICB1bmRlbGV0YWJsZTogJ2Jvb2xlYW4nLFxuICB1cGRhdGVhYmxlOiAnYm9vbGVhbicsXG4gIHVybERldGFpbDogJ3N0cmluZycsXG4gIHVybEVkaXQ6ICdzdHJpbmcnLFxuICB1cmxOZXc6ICdzdHJpbmcnLFxufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKlxuICogUmVnaXN0ZXIgaG9vayBpbiBjb25uZWN0aW9uIGluc3RhbnRpYXRpb24gZm9yIGR5bmFtaWNhbGx5IGFkZGluZyB0aGlzIEFQSSBtb2R1bGUgZmVhdHVyZXNcbiAqL1xuanNmb3JjZS5vbignY29ubmVjdGlvbjpuZXcnLCBmdW5jdGlvbihjb25uKSB7XG4gIGNvbm4uc29hcCA9IG5ldyBTb2FwQXBpKGNvbm4pO1xufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTb2FwQXBpO1xuIl19
