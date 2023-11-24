/**
 * @file Manages Salesforce Analytics API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { registerModule } from '../jsforce';
import Connection from '../connection';
import { Schema } from '../types';
import {
  ReportMetadata,
  ReportExecuteResult,
  ReportRetrieveResult,
  ReportDescribeResult,
  ReportInfo,
  ReportInstanceInfo,
  DashboardMetadata,
  DashboardResult,
  DashboardStatusResult,
  DashboardRefreshResult,
  DashboardInfo,
} from './analytics/types';
import { QueryExplainResult } from '../query';

/*----------------------------------------------------------------------------------*/
export type {
  ReportMetadata,
  ReportExecuteResult,
  ReportRetrieveResult,
  ReportDescribeResult,
  ReportInfo,
  ReportInstanceInfo,
  DashboardMetadata,
  DashboardResult,
  DashboardStatusResult,
  DashboardRefreshResult,
  DashboardInfo,
};

export type ReportExecuteOptions = {
  details?: boolean;
  metadata?: {
    reportMetadata: Partial<ReportMetadata>;
  };
};

/*----------------------------------------------------------------------------------*/
/**
 * Report object class in Analytics API
 */
export class ReportInstance<S extends Schema> {
  _report: Report<S>;
  _conn: Connection<S>;
  id: string;

  /**
   *
   */
  constructor(report: Report<S>, id: string) {
    this._report = report;
    this._conn = report._conn;
    this.id = id;
  }

  /**
   * Retrieve report result asynchronously executed
   */
  retrieve(): Promise<ReportRetrieveResult> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'reports',
      this._report.id,
      'instances',
      this.id,
    ].join('/');
    return this._conn.request<ReportRetrieveResult>(url);
  }
}

/*----------------------------------------------------------------------------------*/
/**
 * Report object class in Analytics API
 */
export class Report<S extends Schema> {
  _conn: Connection<S>;
  id: string;

  /**
   *
   */
  constructor(conn: Connection<S>, id: string) {
    this._conn = conn;
    this.id = id;
  }

  /**
   * Describe report metadata
   */
  describe(): Promise<ReportDescribeResult> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'reports',
      this.id,
      'describe',
    ].join('/');
    return this._conn.request<ReportDescribeResult>(url);
  }

  /**
   * Destroy a report
   */
  destroy(): Promise<void> {
    const url = [this._conn._baseUrl(), 'analytics', 'reports', this.id].join(
      '/',
    );
    return this._conn.request<void>({ method: 'DELETE', url });
  }

  /**
   * Synonym of Analytics~Report#destroy()
   */
  delete = this.destroy;

  /**
   * Synonym of Analytics~Report#destroy()
   */
  del = this.destroy;

  /**
   * Clones a given report
   */
  clone(name: string): Promise<ReportDescribeResult> {
    const url =
      [this._conn._baseUrl(), 'analytics', 'reports'].join('/') +
      '?cloneId=' +
      this.id;
    const config = { reportMetadata: { name } };
    return this._conn.request<ReportDescribeResult>({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  }

  /**
   * Explain plan for executing report
   */
  explain(): Promise<QueryExplainResult> {
    const url = '/query/?explain=' + this.id;
    return this._conn.request<QueryExplainResult>(url);
  }

  /**
   * Run report synchronously
   */
  execute(options: ReportExecuteOptions = {}): Promise<ReportExecuteResult> {
    const url =
      [this._conn._baseUrl(), 'analytics', 'reports', this.id].join('/') +
      '?includeDetails=' +
      (options.details ? 'true' : 'false');
    return this._conn.request<ReportExecuteResult>({
      url,
      ...(options.metadata
        ? {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options.metadata),
          }
        : { method: 'GET' }),
    });
  }

  /**
   * Synonym of Analytics~Report#execute()
   */
  run = this.execute;

  /**
   * Synonym of Analytics~Report#execute()
   */
  exec = this.execute;

  /**
   * Run report asynchronously
   */
  executeAsync(
    options: ReportExecuteOptions = {},
  ): Promise<ReportInstanceInfo> {
    const url =
      [
        this._conn._baseUrl(),
        'analytics',
        'reports',
        this.id,
        'instances',
      ].join('/') + (options.details ? '?includeDetails=true' : '');
    return this._conn.request<ReportInstanceInfo>({
      method: 'POST',
      url,
      ...(options.metadata
        ? {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options.metadata),
          }
        : { body: '' }),
    });
  }

  /**
   * Get report instance for specified instance ID
   */
  instance(id: string) {
    return new ReportInstance(this, id);
  }

  /**
   * List report instances which had been executed asynchronously
   */
  instances(): Promise<ReportInstanceInfo[]> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'reports',
      this.id,
      'instances',
    ].join('/');
    return this._conn.request<ReportInstanceInfo[]>(url);
  }
}

/*----------------------------------------------------------------------------------*/
/**
 * Dashboard object class in the Analytics API
 */
export class Dashboard<S extends Schema> {
  _conn: Connection<S>;
  id: string;

  /**
   *
   */
  constructor(conn: Connection<S>, id: string) {
    this._conn = conn;
    this.id = id;
  }

  /**
   * Describe dashboard metadata
   *
   * @method Analytics~Dashboard#describe
   * @param {Callback.<Analytics-DashboardMetadata>} [callback] - Callback function
   * @returns {Promise.<Analytics-DashboardMetadata>}
   */
  describe(): Promise<DashboardMetadata> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'dashboards',
      this.id,
      'describe',
    ].join('/');
    return this._conn.request<DashboardMetadata>(url);
  }

  /**
   * Get details about dashboard components
   */
  components(componentIds?: string | string[]): Promise<DashboardResult> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'dashboards',
      this.id,
    ].join('/');
    const config = {
      componentIds: Array.isArray(componentIds)
        ? componentIds
        : typeof componentIds === 'string'
        ? [componentIds]
        : undefined,
    };
    return this._conn.request<DashboardResult>({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  }

  /**
   * Get dashboard status
   */
  status(): Promise<DashboardStatusResult> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'dashboards',
      this.id,
      'status',
    ].join('/');
    return this._conn.request<DashboardStatusResult>(url);
  }

  /**
   * Refresh a dashboard
   */
  refresh(): Promise<DashboardRefreshResult> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'dashboards',
      this.id,
    ].join('/');
    return this._conn.request<DashboardRefreshResult>({
      method: 'PUT',
      url,
      body: '',
    });
  }

  /**
   * Clone a dashboard
   */
  clone(
    config: { name: string; folderId?: string } | string,
    folderId?: string,
  ): Promise<DashboardMetadata> {
    const url =
      [this._conn._baseUrl(), 'analytics', 'dashboards'].join('/') +
      '?cloneId=' +
      this.id;
    if (typeof config === 'string') {
      config = { name: config, folderId };
    }
    return this._conn.request<DashboardMetadata>({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  }

  /**
   * Destroy a dashboard
   */
  destroy(): Promise<void> {
    const url = [
      this._conn._baseUrl(),
      'analytics',
      'dashboards',
      this.id,
    ].join('/');
    return this._conn.request<void>({ method: 'DELETE', url });
  }

  /**
   * Synonym of Analytics~Dashboard#destroy()
   */
  delete = this.destroy;

  /**
   * Synonym of Analytics~Dashboard#destroy()
   */
  del = this.destroy;
}

/*----------------------------------------------------------------------------------*/
/**
 * API class for Analytics API
 */
export class Analytics<S extends Schema> {
  _conn: Connection<S>;

  /**
   *
   */
  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * Get report object of Analytics API
   */
  report(id: string) {
    return new Report(this._conn, id);
  }

  /**
   * Get recent report list
   */
  reports() {
    const url = [this._conn._baseUrl(), 'analytics', 'reports'].join('/');
    return this._conn.request<ReportInfo[]>(url);
  }

  /**
   * Get dashboard object of Analytics API
   */
  dashboard(id: string) {
    return new Dashboard(this._conn, id);
  }

  /**
   * Get recent dashboard list
   */
  dashboards() {
    const url = [this._conn._baseUrl(), 'analytics', 'dashboards'].join('/');
    return this._conn.request<DashboardInfo[]>(url);
  }
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('analytics', (conn) => new Analytics(conn));

export default Analytics;
