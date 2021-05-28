/**
 * @file Process class to manage/run workflow rule and approval process
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import Connection from './connection';
import { ProcessRules, Schema } from './types';

/**
 *
 */
export type ProcessRuleDefinition = {
  id: string;
  name: string;
  object: string;
};

/**
 *
 */
export type ProcessRuleTriggerResult =
  | {
      success: true;
    }
  | {
      success: false;
      errors: Array<{ message: string }>;
    };

/**
 * A class which manages process (workflow) rules
 */
export class ProcessRule<S extends Schema> {
  _conn: Connection<S>;

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * Get all process rule definitions registered to sobjects
   */
  async list() {
    const res = await this._conn.request<{ rules: ProcessRules }>(
      '/process/rules',
    );
    return res.rules;
  }

  /**
   * Trigger process rule for given entities
   */
  trigger(contextIds: string | string[]) {
    const contextIds_ = Array.isArray(contextIds) ? contextIds : [contextIds];
    // https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_process_rules_trigger.htm
    return this._conn.request<
      | {
          errors: null;
          success: true;
        }
      | {
          // Docs don't say what the trigger errors are
          errors: any[];
          success: false;
        }
    >({
      method: 'POST',
      url: '/process/rules/',
      body: JSON.stringify({
        contextIds: contextIds_,
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}

/**
 *
 */
export type ApprovalProcessDefinition = {
  id: string;
  name: string;
  object: string;
  sortOrder: number;
  description: string | null;
};

/**
 *
 */
export type ApprovalProcessRequestResult =
  | {
      success: true;
      actorIds: string[];
      entityId: string;
      instanceId: string;
      instanceStatus: string;
      newWorkItemIds: string[];
    }
  | {
      success: false;
      errors: Array<{ message: string }>;
    };

/**
 *
 */
export type ApprovalProcessActionOptions = {
  processDefinitionNameOrId?: string;
  skipEntryCriteria?: boolean;
};

/**
 * A class which manages approval processes
 */
export class ApprovalProcess<S extends Schema> {
  _conn: Connection<S>;

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * Get all approval process definitions registered to sobjects
   */
  async list() {
    const res = await this._conn.request<{
      approvals: { [index: string]: ApprovalProcessDefinition };
    }>('/process/approvals');
    return res.approvals;
  }

  /**
   * Send bulk requests for approval process
   */
  request(
    requests: Array<ApprovalProcessRequestConfig | ApprovalProcessRequest<S>>,
  ) {
    const requests_ = requests.map((req) =>
      '_request' in req ? req._request : req,
    );
    return this._conn.request<ApprovalProcessRequestResult[]>({
      method: 'POST',
      url: '/process/approvals',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requests: requests_ }),
    });
  }

  /**
   * Create approval process request
   *
   * @private
   */
  _createRequest(
    actionType: 'Submit' | 'Approve' | 'Reject',
    contextId: string,
    comments?: string,
    options: ApprovalProcessActionOptions = {},
  ) {
    return new ApprovalProcessRequest(this, {
      actionType,
      contextId,
      comments,
      ...options,
    });
  }

  /**
   * Submit approval request for an item
   */
  submit(
    contextId: string,
    comments?: string,
    options?: ApprovalProcessActionOptions,
  ) {
    return this._createRequest('Submit', contextId, comments, options);
  }

  /**
   * Approve approval request for an item
   */
  approve(
    workitemId: string,
    comments?: string,
    options: ApprovalProcessActionOptions = {},
  ) {
    return this._createRequest('Approve', workitemId, comments, options);
  }

  /**
   * Reject approval request for an item
   */
  reject(
    workitemId: string,
    comments?: string,
    options: ApprovalProcessActionOptions = {},
  ) {
    return this._createRequest('Reject', workitemId, comments, options);
  }
}

/**
 *
 */
export type ApprovalProcessRequestConfig = {
  actionType: 'Submit' | 'Approve' | 'Reject';
  contextId: string;
  comments?: string;
  nextApproverIds?: string[];
  processDefinitionNameOrId?: string;
  skipEntryCriteria?: boolean;
};

/**
 * A class representing approval process request
 */
class ApprovalProcessRequest<S extends Schema> {
  _process: ApprovalProcess<S>;
  _request: ApprovalProcessRequestConfig;
  _promise: Promise<ApprovalProcessRequestResult> | undefined;

  constructor(
    process: ApprovalProcess<S>,
    request: ApprovalProcessRequestConfig,
  ) {
    this._process = process;
    this._request = request;
  }

  /**
   * Promise/A+ interface
   * http://promises-aplus.github.io/promises-spec/
   */
  then<U>(
    onResolve?: (
      res: ApprovalProcessRequestResult,
    ) => U | PromiseLike<U> | null,
    onReject?: (err: any) => U | PromiseLike<U> | null,
  ) {
    if (!this._promise) {
      this._promise = this._process
        .request([this])
        .then((rets: any) => rets[0]);
    }
    this._promise.then(onResolve, onReject);
  }
}

/**
 * A class which manages process rules and approval processes
 */
export class Process<S extends Schema> {
  rule: ProcessRule<S>;
  approval: ApprovalProcess<S>;

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this.rule = new ProcessRule(conn);
    this.approval = new ApprovalProcess(conn);
  }
}

export default Process;
