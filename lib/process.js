/**
 * @file Process class to manage/run workflow rule and approval process
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var _ = require('underscore'),
    Promise = require('./promise'),
    Conneciton = require('./connection');

/**
 * A class which manages process rules and approval processes
 *
 * @class
 * @param {Connection} conn - Connection object
 */
var Process = module.exports = function(conn) {
  /**
   * Object which mangages process rules
   * @member {Process~ProcessRule} Process#rule
   */
  this.rule = new ProcessRule(conn);
  /**
   * Object which mangages approval process
   * @member {Process~ApprovalProcess} Process#approval
   */
  this.approval = new ApprovalProcess(conn);
};

/**
 * A class which manages process (workflow) rules
 * 
 * @class Process~ProcessRule
 * @param {Connection} conn - Connection object
 */
var ProcessRule = function(conn) {
  this._conn = conn;
};

/**
 * @typedef {Object} Process~ProcessRuleDefinition
 * @prop {String} id - Id of approval process definition
 * @prop {String} name - Name of process rule definition
 * @prop {String} object - SObject name which process rule is defined
 */

/**
 * Get all process rule definitions registered to sobjects
 *
 * @method Process~ProcessRule#list
 * @param {Callback.<Map.<String, Array.<Process~ProcessRuleDefinition>>>} [callback] - Callback function
 * @returns {Promise.<Map.<String, Array.<Process~ProcessRuleDefinition>>>}
 */
ProcessRule.prototype.list = function(callback) {
  return this._conn.request("/process/rules").then(function(res) {
    return res.rules;
  }).thenCall(callback);
};


/**
 * @typedef {Object} Process~ProcessRuleTriggerResult
 * @prop {Boolean} success - Is process rule trigger succeeded or not
 * @prop {Array.<Object>} errors - Array of errors returned if the request failed
 */

/**
 * Trigger process rule for given entities
 *
 * @method Process~ProcessRule#trigger
 * @param {String|Array.<String>} contextIds - Entity ID(s) to trigger workflow process
 * @param {Callback.<Process~ProcessRuleTriggerResult>} [callback] - Callback function
 * @returns {Promise.<Process~ProcessRuleTriggerResult>}
 */
ProcessRule.prototype.trigger = function(contextIds, callback) {
  contextIds = _.isArray(contextIds) ? contextIds : [ contextIds ];
  return this._conn.request({
    method: "POST",
    url: "/process/rules/",
    body: JSON.stringify({
      contextIds: contextIds
    }),
    headers: {
      "content-type": "application/json"
    }
  }).thenCall(callback);
};

/**
 * A class which manages approval processes
 * 
 * @class Process~ApprovalProcess
 * @param {Connection} conn - Connection object
 */
var ApprovalProcess = function(conn) {
  this._conn = conn;
};

/**
 * @typedef {Object} Process~ApprovalProcessDefinition
 * @prop {String} id - Id of approval process definition
 * @prop {String} name - Name of approval process definition
 * @prop {String} object - SObject name which approval process is defined
 * @prop {Number} sortOrder - Processing order of approval in SObject 
 */
/**
 * Get all approval process definitions registered to sobjects
 *
 * @method Process~ApprovalProcess#list
 * @param {Callback.<Map.<String, Array.<ApprovalProcessDefinition>>>} [callback] - Callback function
 * @returns {Promise.<Map.<String, Array.<ApprovalProcessDefinition>>>}
 */
ApprovalProcess.prototype.list = function(callback) {
  return this._conn.request("/process/approvals").then(function(res) {
    return res.approvals;
  }).thenCall(callback);
};

/**
 * @typedef {Object} Process~ApprovalProcessRequestResult
 * @prop {Boolean} success - True if processing or approval completed successfully
 * @prop {Array.<Object>} errors - The set of errors returned if the request failed
 * @prop {Array.<String>} actorIds - IDs of the users who are currently assigned to this approval step
 * @prop {String} entityId - Object being processed
 * @prop {String} instanceId - ID of the ProcessInstance associated with the object submitted for processing
 * @prop {String} instanceStatus - Status of the current process instance (not an individual object but the entire process instance)
 * @prop {Array.<String>} newWorkItemIds - Case-insensitive IDs that point to ProcessInstanceWorkitem items (the set of pending approval requests)
 */

/**
 * Send bulk requests for approval process
 *
 * @method Process~ApprovalProcess#request
 * @param {Array.<ApprovalProcessRequest>} requests - Array of approval process request to send
 * @param {Callback.<Array.<ApprovalProcessRequestResult>>} - Callback function
 * @param {Promise.<Array.<ApprovalProcessRequestResult>>}
 */
ApprovalProcess.prototype.request = function(requests, callback) {
  requests = requests.map(function(req) {
    return req._request ? req._request : req;
  });
  return this._conn.request({
    method: 'POST',
    url: '/process/approvals',
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ requests: requests })
  }).thenCall(callback);
};

/**
 * Create approval process request
 *
 * @private
 */
ApprovalProcess.prototype._createRequest = function(actionType, contextId, comments, options, callback) {
  if (typeof comments === "function") {
    callback = comments;
    options = null;
    comments = null;
  }
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  options = options || {};
  var request = {
    actionType: actionType,
    contextId: contextId,
    comments: comments
  };
  _.extend(request, options);
  return new ApprovalProcessRequest(this, request).thenCall(callback);
};

/**
 * Submit approval request for an item
 *
 * @method Process~ApprovalProcess#submit
 * @param {String} contextId - ID of the item that is being acted upon
 * @param {String} [comments] - Comment to add to the history step associated with this request
 * @param {Object} [options] - Request parameters
 * @param {Array.<String>} [options.nextApproverIds] - If the process requires specification of the next approval, the ID of the user to be assigned the next request
 * @param {String} [options.processDefinitionNameOrId] - Developer name or ID of the process definition
 * @param {Boolean} [options.skipEntryCriteria] - Determines whether to evaluate the entry criteria for the process (true) or not (false) if the process definition name or ID isn’t null
 * @param {Callback.<ApprovalProcessRequestResult>} [callback] - Callback function
 * @returns {ApprovalProcessRequest}
 */
ApprovalProcess.prototype.submit = function(contextId, comments, options, callback) {
  return this._createRequest("Submit", contextId, comments, options, callback);
};

/**
 * Approve approval request for an item
 *
 * @method Process~ApprovalProcess#approve
 * @param {String} workitemId - ID of the item that is being acted upon
 * @param {String} [comments] - Comment to add to the history step associated with this request
 * @param {Object} [options] - Request parameters
 * @param {Array.<String>} [options.nextApproverIds] - If the process requires specification of the next approval, the ID of the user to be assigned the next request
 * @param {String} [options.processDefinitionNameOrId] - Developer name or ID of the process definition
 * @param {Boolean} [options.skipEntryCriteria] - Determines whether to evaluate the entry criteria for the process (true) or not (false) if the process definition name or ID isn’t null
 * @param {Callback.<ApprovalProcessRequestResult>} [callback] - Callback function
 * @returns {ApprovalProcessRequest}
 */
ApprovalProcess.prototype.approve = function(workitemId, comments, options, callback) {
  return this._createRequest("Approve", workitemId, comments, options, callback);
};

/**
 * Reject approval request for an item
 *
 * @method Process~ApprovalProcess#reject
 * @param {String} workitemId - ID of the item that is being acted upon
 * @param {String} [comments] - Comment to add to the history step associated with this request
 * @param {Object} [options] - Request parameters
 * @param {Array.<String>} [options.nextApproverIds] - If the process requires specification of the next approval, the ID of the user to be assigned the next request
 * @param {String} [options.processDefinitionNameOrId] - Developer name or ID of the process definition
 * @param {Boolean} [options.skipEntryCriteria] - Determines whether to evaluate the entry criteria for the process (true) or not (false) if the process definition name or ID isn’t null
 * @param {Callback.<ApprovalProcessRequestResult>} [callback] - Callback function
 * @returns {ApprovalProcessRequest}
 */
ApprovalProcess.prototype.reject = function(workitemId, comments, options, callback) {
  return this._createRequest("Reject", workitemId, comments, options, callback);
};

/**
 * A class representing approval process request
 *
 * @protected
 * @class Process~ApprovalProcessRequest
 * @implements {Promise.<Processr~ApprovalProcessRequestResult}
 * @param {Process~ApprovalProcess} process - ApprovalProcess
 * @param {Object} request - Request parameters
 * @param {String} request.actionType - Represents the kind of action to take: Submit, Approve, or Reject
 * @param {String} request.contextId - ID of the item that is being acted upon
 * @param {String} request.comments - Comment to add to the history step associated with this request
 * @param {Array.<String>} [request.nextApproverIds] - If the process requires specification of the next approval, the ID of the user to be assigned the next request
 * @param {String} [request.processDefinitionNameOrId] - Developer name or ID of the process definition
 * @param {Boolean} [request.skipEntryCriteria] - Determines whether to evaluate the entry criteria for the process (true) or not (false) if the process definition name or ID isn’t null
 */
var ApprovalProcessRequest = function(process, request) {
  this._process = process;
  this._request = request;
};

/**
 * Promise/A+ interface
 * http://promises-aplus.github.io/promises-spec/
 *
 * @method Process~ApprovalProcessRequest#then
 */
ApprovalProcessRequest.prototype.then = function(onResolve, onReject) {
  if (!this._promise) {
    this._promise = this._process.request([ this ]).then(function(rets) {
      return rets[0];
    });
  }
  this._promise.then(onResolve, onReject);
};

/**
 * Promise/A+ extension
 * Call "then" using given node-style callback function
 *
 * @method Process~ApprovalProcessRequest#thenCall
 */
ApprovalProcessRequest.prototype.thenCall = function(callback) {
  return callback ? this.then(function(res) {
    callback(null, res);
  }, function(err) {
    callback(err);
  }) :
  this;
};
