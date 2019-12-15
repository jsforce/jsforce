/**
 * @file Represents Salesforce QuickAction
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';


/**
 * A class for quick action
 *
 * @protected
 * @constructor
 */
var QuickAction = module.exports = function(conn, path) {
  this._conn = conn;
  this._path = path;
};

/**
 * @typedef {Object} QuickAction~QuickActionInfo
 * @prop {String} type - Type of the action (e.g. Create, Update, Post, LogACall)
 * @prop {String} name - Name of the action
 * @prop {String} label - Label of the action
 * @prop {Object} urls - Endpoint URL information of the action
 */
/**
 * @typedef {QuickAction~QuickActionInfo} QuickAction~QuickActionDescriveInfo
 * @prop {String} contextSobjectType - Object type used for the action
 * @prop {String} targetSobjectType - Object type of the action to target
 * @prop {String} targetParentField - Field name in the target object which refers parent(context) object record ID.
 * @prop {String} targetRecordTypeId - Record type of the targeted record
 * @prop {Object} layout - Layout sections that comprise an action
 */

/**
 * Describe the action's information (including layout, etc.)
 *
 * @param {Callback.<QuickAction~QuickActionDescriveInfo>} [callback] - Callback function
 * @returns {Promise.<QuickAction~QuickActionDescriveInfo>}
 */
QuickAction.prototype.describe = function(callback) {
  var url = this._path + "/describe";
  return this._conn.request(url).thenCall(callback);
};

/**
 * Retrieve default field values in the action (for given record, if specified)
 *
 * @param {String} [contextId] - ID of record to get default values specific to the record
 * @param {Callback.<Record>} [callback] - Callback function
 * @returns {Promise.<Record>}
 */
QuickAction.prototype.defaultValues = function(contextId, callback) {
  if (typeof contextId === 'function') {
    callback = contextId;
    contextId = null;
  }
  var url = this._path + "/defaultValues";
  if (contextId) {
    url += "/" + contextId;
  }
  return this._conn.request(url).thenCall(callback);
};

/**
 * @typedef {Object} QuickAction~QuickActionResult
 * @param {String} id - Record id of the action result
 * @param {Array.<String>} feedItemIds - List of IDs for feed item
 * @param {Boolean} success - True if the action successfully completed
 * @param {Boolean} created - True if the action yields a new record
 * @param {String} contextId - Context record ID of the action
 * @param {Array.<Object>} errors - Errors if the action failed
 */

/**
 * Execute the action for given context Id and record information
 * 
 * @param {String} contextId - Context record ID of the action
 * @param {Record} record - Input record information for the action
 * @param {Callback.<QuickAction~QuickActionResult>} [callback] - Callback function
 * @returns {Promise.<QuickAction~QuickActionResult>}
 */
QuickAction.prototype.execute = function(contextId, record, callback) {
  var body = {
    contextId: contextId,
    record: record
  };
  return this._conn.requestPost(this._path, body).thenCall(callback);
};
