/**
 * @file Manages Tooling APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { registerModule } from '../jsforce';
import Connection from '../connection';
import Cache, { CachedFunction } from '../cache';
import SObject from '../sobject';
import {
  DescribeGlobalResult,
  DescribeSObjectResult,
  HttpRequest,
  Schema,
  SObjectNames,
} from '../types';

/**
 *
 */
export type ExecuteAnonymousResult = {
  compiled: boolean;
  compileProblem: string | null;
  success: boolean;
  line: number;
  column: number;
  exceptionMessage: string | null;
  exceptionStackTrace: string | null;
};

export type RunTestLevel =
  | 'RunSpecifiedTests'
  | 'RunLocalTests'
  | 'RunAllTestsInOrg';

type TestsNode =
  | {
      classId: string;
      testMethods?: string[];
    }
  | {
      className: string;
      testMethods?: string[];
    };

export type RunTestsRequest = {
  tests: TestsNode[];
  maxFailedTests?: number;
  testLevel?: RunTestLevel;
  skipCodeCoverage?: boolean;
};

export type RunTestsAsyncRequest =
  | {
      classids?: string;
      classNames?: string;
      suiteids?: string;
      suiteNames?: string;
      maxFailedTests?: number;
      testLevel?: RunTestLevel;
      skipCodeCoverage?: boolean;
    }
  | {
      tests: TestsNode[];
      maxFailedTests?: number;
      testLevel?: RunTestLevel;
      skipCodeCoverage?: boolean;
    };

type CodeCoverageResult = {
  id: string;
  locationsNotCovered: any[];
  name: string;
  namespace: string | null;
  numLocations: number;
  numLocationsNotCovered: number;
  type: string;
};

type CodeCoverageWarning = {
  id: string;
  message: string;
  name: string | null;
  namespace: string | null;
};

type FlowCoverageResult = {
  elementsNotCovered: string[];
  flowId: string;
  flowName: string;
  flowNamespace: string | null;
  numElements: number;
  numElementsNotCovered: number;
  processType: string;
};

type FlowCoverageWarning = {
  flowId: string;
  flowName: string;
  flowNamespace: string | null;
  message: string;
};

type RunTestSuccess = {
  id: string;
  methodName: string;
  name: string;
  namespace: string | null;
  seeAllData: boolean;
  time: number;
};

type RunTestFailure = {
  id: string;
  message: string;
  methodName: string;
  name: string;
  namespace: string | null;
  seeAllData: boolean;
  stackTrace: string;
  time: number;
  type: string;
};

export type RunTestsResult = {
  apexLogId: string;
  codeCoverage: CodeCoverageResult[];
  codeCoverageWarnings: CodeCoverageWarning[];
  flowCoverage: FlowCoverageResult[];
  flowCoverageWarnings: FlowCoverageWarning[];
  numFailures: number;
  numTestsRun: number;
  successes: RunTestSuccess[];
  failures: RunTestFailure[];
  totalTime: number;
};

type ConstructorDeclaration = {
  methodDoc: string | null;
  name: string;
  parameters: Array<{
    name: string;
    type: string;
  }>;
  references: any[];
};

type MethodDeclaration = {
  argTypes: string[];
  isStatic: boolean;
  methodDoc: string | null;
  name: string;
  parameters: Array<{
    name: string;
    type: string;
  }>;
  references: any[];
};

type PropertyDeclaration = {
  name: string;
  references: any[];
};

type ClassDeclaration = {
  constructors: ConstructorDeclaration[];
  methods: MethodDeclaration[];
  properties: PropertyDeclaration[];
};

export type CompletionsResult = {
  publicDeclarations?: {
    [namespace: string]: {
      [name: string]: ClassDeclaration;
    };
  };
  completions?: {
    [component: string]: {
      simple: boolean;
      attribs: {
        [attr: string]: {};
      };
    };
  };
};

/**
 *
 */
const {
  query,
  queryMore,
  _ensureVersion,
  create,
  _createSingle,
  _createMany,
  _createParallel,
  retrieve,
  _retrieveSingle,
  _retrieveParallel,
  _retrieveMany,
  update,
  _updateSingle,
  _updateParallel,
  _updateMany,
  upsert,
  destroy,
  _destroySingle,
  _destroyParallel,
  _destroyMany,
  describe,
  describeGlobal,
  sobject,
} = Connection.prototype;

const describeCacheKey = (type?: string) =>
  type ? `describe.${type}` : 'describe';

/**
 * API class for Tooling API call
 */
export class Tooling<S extends Schema> {
  _conn: Connection<S>;

  get version(): string {
    return this._conn.version;
  }

  /**
   * Execute query by using SOQL
   */
  query: Connection<S>['query'] = query;

  /**
   * Query next record set by using query locator
   */
  queryMore: Connection<S>['queryMore'] = queryMore;

  _ensureVersion: Connection<S>['_ensureVersion'] = _ensureVersion;

  /**
   * Create records
   */
  create: Connection<S>['create'] = create;
  _createSingle = _createSingle;
  _createParallel = _createParallel;
  _createMany = _createMany;

  /**
   * Synonym of Tooling#create()
   */
  insert = create;

  /**
   * Retrieve specified records
   */
  retrieve: Connection<S>['retrieve'] = retrieve;
  _retrieveSingle = _retrieveSingle;
  _retrieveParallel = _retrieveParallel;
  _retrieveMany = _retrieveMany;

  /**
   * Update records
   */
  update: Connection<S>['update'] = update;
  _updateSingle = _updateSingle;
  _updateParallel = _updateParallel;
  _updateMany = _updateMany;

  /**
   * Upsert records
   */
  upsert: Connection<S>['upsert'] = upsert;

  /**
   * Delete records
   */
  destroy: Connection<S>['destroy'] = destroy;
  _destroySingle = _destroySingle;
  _destroyParallel = _destroyParallel;
  _destroyMany = _destroyMany;

  /**
   * Synonym of Tooling#destroy()
   */
  delete = destroy;

  /**
   * Synonym of Tooling#destroy()
   */
  del = destroy;

  cache = new Cache();

  /**
   * Describe SObject metadata
   */
  describe = this.cache.createCachedFunction(describe, this, {
    key: describeCacheKey,
    strategy: 'NOCACHE',
  });
  describe$ = this.cache.createCachedFunction(describe, this, {
    key: describeCacheKey,
    strategy: 'HIT',
  });
  describe$$ = (this.cache.createCachedFunction(describe, this, {
    key: describeCacheKey,
    strategy: 'IMMEDIATE',
  }) as unknown) as CachedFunction<(name: string) => DescribeSObjectResult>;

  /**
   * Synonym of Tooling#describe()
   */
  describeSObject = this.describe;
  describeSObject$ = this.describe$;
  describeSObject$$ = this.describe$$;

  /**
   * Describe global SObjects
   */
  describeGlobal = this.cache.createCachedFunction(describeGlobal, this, {
    key: 'describeGlobal',
    strategy: 'NOCACHE',
  });
  describeGlobal$ = this.cache.createCachedFunction(describeGlobal, this, {
    key: 'describeGlobal',
    strategy: 'HIT',
  });
  describeGlobal$$ = (this.cache.createCachedFunction(describeGlobal, this, {
    key: 'describeGlobal',
    strategy: 'IMMEDIATE',
  }) as unknown) as CachedFunction<(name: string) => DescribeGlobalResult>;

  /**
   * Get SObject instance
   */
  sobject: Connection<S>['sobject'] = sobject;

  sobjects: { [N in SObjectNames<S>]?: SObject<S, N> } = {};

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * @private
   */
  _establish() {
    this.sobjects = {};
    this.cache.clear();
    this.cache.get('describeGlobal').removeAllListeners('value');
    this.cache.get('describeGlobal').on('value', (res) => {
      if (res.result) {
        for (const { name: type } of res.result.sobjects) {
          this.sobject(type);
        }
      }
    });
  }

  /**
   * @private
   */
  _baseUrl() {
    return this._conn._baseUrl() + '/tooling';
  }

  /**
   * @private
   */
  _supports(feature: string) {
    return this._conn._supports(feature);
  }

  /**
   *
   */
  request<R = unknown>(request: string | HttpRequest, options?: Object) {
    return this._conn.request<R>(request, options);
  }

  /**
   * Executes Apex code anonymously
   */
  executeAnonymous(body: string) {
    const url =
      this._baseUrl() +
      '/executeAnonymous?anonymousBody=' +
      encodeURIComponent(body);
    return this.request<ExecuteAnonymousResult>(url);
  }

  /**
   * Executes Apex tests asynchronously
   */
  runTestsAsynchronous(req: RunTestsAsyncRequest) {
    const url = this._baseUrl() + '/runTestsAsynchronous/';
    return this._conn.requestPost<string | null>(url, req);
  }

  /**
   * Executes Apex tests synchronously
   */
  runTestsSynchronous(req: RunTestsRequest) {
    const url = this._baseUrl() + '/runTestsSynchronous/';
    return this._conn.requestPost<RunTestsResult | null>(url, req);
  }

  /**
   * Retrieves available code completions of the referenced type
   */
  completions(type: 'apex' | 'visualforce' = 'apex') {
    const url =
      this._baseUrl() + '/completions?type=' + encodeURIComponent(type);
    return this.request<CompletionsResult>({
      method: 'GET',
      url,
      headers: { Accept: 'application/json' },
    });
  }
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('tooling', (conn) => new Tooling(conn));

export default Tooling;
