import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isNumber, isUndefined, clone } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
describe('report', () => {
  let reportId: string;
  let instanceId: string;
  let cloneId: string;

  /**
   *
   */
  beforeAll(async () => {
    const res = await conn
      .sobject('Report')
      .findOne({ Name: 'Lead List Report' }, 'Id')
      .execute();
    if (!res) {
      throw new Error(
        "No Report Name 'Lead List Report' was found in the org.",
      );
    }
    reportId = res.Id;
  });

  /**
   *
   */
  it('should list recent reports and return report infomation list', async () => {
    const reports = await conn.analytics.reports();
    assert.ok(Array.isArray(reports));
    for (const report of reports) {
      assert.ok(isString(report.id));
      assert.ok(isString(report.name));
      assert.ok(isString(report.url));
    }
  });

  /**
   *
   */
  it('should describe report and return report metadata', async () => {
    const meta = await conn.analytics.report(reportId).describe();
    assert.ok(isObject(meta));
    assert.ok(isObject(meta.reportMetadata));
    assert.ok(isObject(meta.reportTypeMetadata));
    assert.ok(isObject(meta.reportExtendedMetadata));
  });

  /**
   *
   */
  it('should execute report synchronously and return report execution result', async () => {
    const result = await conn.analytics.report(reportId).execute();
    assert.ok(isObject(result));
    assert.ok(result.hasDetailRows === false);
    assert.ok(isObject(result.reportMetadata));
    assert.ok(result.reportMetadata.id === reportId);
    assert.ok(isObject(result.factMap));
    assert.ok(isObject(result.factMap['T!T']));
    assert.ok(isUndefined(result.factMap['T!T'].rows));
    assert.ok(Array.isArray(result.factMap['T!T'].aggregates));
  });

  /**
   *
   */
  it('should execute report synchronously with details and return report execution result', async () => {
    const result = await conn.analytics
      .report(reportId)
      .execute({ details: true });
    assert.ok(isObject(result));
    assert.ok(result.hasDetailRows === true);
    assert.ok(isObject(result.reportMetadata));
    assert.ok(result.reportMetadata.id === reportId);
    assert.ok(isObject(result.factMap));
    assert.ok(isObject(result.factMap['T!T']));
    assert.ok(Array.isArray(result.factMap['T!T'].rows));
    assert.ok(Array.isArray(result.factMap['T!T'].aggregates));
  });

  /**
   *
   */
  it('should execute report synchronously with filters overrided and return report execution result', async () => {
    const metadata = {
      reportMetadata: {
        historicalSnapshotDates: [],
        reportFilters: [
          {
            column: 'COMPANY',
            operator: 'contains' as const,
            value: ',Inc.',
          },
        ],
      },
    };
    const result = await conn.analytics
      .report(reportId)
      .execute({ metadata, details: true });
    assert.ok(isObject(result));
    assert.ok(isObject(result.reportMetadata));
    assert.ok(Array.isArray(result.reportMetadata.reportFilters));
    assert.ok(result.reportMetadata.id === reportId);
    assert.ok(isObject(result.factMap));
    assert.ok(isObject(result.factMap['T!T']));
    assert.ok(Array.isArray(result.factMap['T!T'].rows));
    assert.ok(Array.isArray(result.factMap['T!T'].aggregates));
  });

  /**
   *
   */
  it('should execute report asynchronously and return report instance info', async () => {
    const instance = await conn.analytics.report(reportId).executeAsync();
    assert.ok(isObject(instance));
    assert.ok(isString(instance.id));
    assert.ok(isString(instance.status));
    assert.ok(isString(instance.requestDate));
    instanceId = instance.id;
  });

  /**
   *
   */
  it('should list asynchronously executed report instances and return report instance list', async () => {
    const instances = await conn.analytics.report(reportId).instances();
    assert.ok(Array.isArray(instances));
    for (const instance of instances) {
      assert.ok(isString(instance.id));
      assert.ok(isString(instance.status));
      assert.ok(isString(instance.requestDate));
    }
  });

  /**
   *
   */
  it('should retrieve asynchronously executed report result and return report execution result', async () => {
    const result = await conn.analytics
      .report(reportId)
      .instance(instanceId)
      .retrieve();
    assert.ok(isObject(result));
    assert.ok(isObject(result.attributes));
    assert.ok(result.attributes.id === instanceId);
    assert.ok(isString(result.attributes.status));
    assert.ok(isString(result.attributes.requestDate));
    if (result.attributes.status === 'Success') {
      assert.ok(isObject(result.reportMetadata));
      assert.ok(result.reportMetadata.id === reportId);
    }
  });

  /**
   *
   */
  it('should explain query plan of report and get explain result', async () => {
    const result = await conn.analytics.report(reportId).explain();
    assert.ok(Array.isArray(result.plans));
    for (const plan of result.plans) {
      assert.ok(isNumber(plan.cardinality));
      assert.ok(Array.isArray(plan.fields));
      assert.ok(isString(plan.leadingOperationType));
      assert.ok(isNumber(plan.relativeCost));
      assert.ok(isNumber(plan.sobjectCardinality));
      assert.ok(isString(plan.sobjectType));
    }
  });

  /**
   *
   */
  it('should clone report and get the cloned report', async () => {
    const result = await conn.analytics
      .report(reportId)
      .clone('Lead List Report Clone');
    assert.ok(isObject(result.reportMetadata));
    cloneId = result.reportMetadata.id;
    assert.ok(cloneId !== reportId);
    assert.ok(result.reportMetadata.name === 'Lead List Report Clone');
  });

  /**
   *
   */
  it('should destroy report and confirm the report destroyed', async () => {
    await conn.analytics.report(cloneId).destroy();
    try {
      await conn.analytics.report(cloneId).describe();
      assert.fail();
    } catch (err) {
      assert.ok(isObject(err));
      assert.ok(err.name === 'NOT_FOUND');
    }
  });
});

/**
 *
 */
describe('dashboard', () => {
  let dashboardId: string;
  let dashboardFolderId: string;
  let dashboardMetadata: any;
  let cloneDashboardId: string;

  /**
   *
   */
  beforeAll(async () => {
    const res = await conn
      .sobject('Dashboard')
      .findOne({ Title: 'Lead List Dashboard' }, 'Id')
      .execute();
    if (!res) {
      throw new Error(
        "No Dashboard Named 'Lead List Dashboard' was found in the org.",
      );
    }
    dashboardId = res.Id;
  });

  /**
   *
   */
  it('should list recent dashboards and return dashboard infomation list', async () => {
    const dashboards = await conn.analytics.dashboards();
    assert.ok(Array.isArray(dashboards));
    for (const dashboard of dashboards) {
      assert.ok(isString(dashboard.id));
      assert.ok(isString(dashboard.name));
      assert.ok(isString(dashboard.url));
    }
  });

  /**
   *
   */
  it('should describe dashboard and return dashboard metadata', async () => {
    const meta = await conn.analytics.dashboard(dashboardId).describe();
    assert.ok(isObject(meta));
    assert.ok(Array.isArray(meta.components));
    assert.ok(isObject(meta.layout));
    dashboardFolderId = meta.folderId;
    dashboardMetadata = clone(meta);
  });

  /**
   *
   */
  it('should get all dashboard components and return all components', async () => {
    const meta = await conn.analytics.dashboard(dashboardId).components();
    assert.ok(
      dashboardMetadata.components.length === meta.componentData.length,
    );
  });

  /**
   *
   */
  it('should get one dashboard component and return one component', async () => {
    const meta = await conn.analytics
      .dashboard(dashboardId)
      .components(dashboardMetadata.components[0].id);
    assert.ok(meta.componentData.length === 1);
  });

  /**
   *
   */
  it('should get three dashboard components and return three components', async () => {
    const ids = [
      dashboardMetadata.components[0].id,
      dashboardMetadata.components[1].id,
      dashboardMetadata.components[2].id,
    ];
    const result = await conn.analytics.dashboard(dashboardId).components(ids);
    assert.ok(result.componentData.length === 3);
  });

  /**
   *
   */
  it('should get status of dashboard and return dashboard status', async () => {
    const result = await conn.analytics.dashboard(dashboardId).status();
    assert.ok(isObject(result));
    assert.ok(Array.isArray(result.componentStatus));
  });

  /**
   *
   */
  it('should clone dashboard and return cloned dashboard', async () => {
    const meta = await conn.analytics.dashboard(dashboardId).clone({
      name: 'Lead List Dashboard Clone',
      folderId: dashboardFolderId,
    });
    assert.ok(isObject(meta.attributes));
    cloneDashboardId = meta.attributes.dashboardId;
    assert.ok(cloneDashboardId !== dashboardId);
    assert.ok(meta.name === 'Lead List Dashboard Clone');
  });

  /**
   *
   */
  it('should refresh dashboard and return refreshed dashboard metadata', async () => {
    // refresh cloned dashboard, in order to prevent frequent refresh error.
    const result = await conn.analytics.dashboard(cloneDashboardId).refresh();
    assert.ok(isObject(result));
    assert.ok(isString(result.statusUrl));
  });

  /**
   *
   */
  it('should destroy dashboard and confirm the dashboard destroyed', async () => {
    await conn.analytics.dashboard(cloneDashboardId).destroy();
    try {
      await conn.analytics.dashboard(cloneDashboardId).describe();
      assert.fail();
    } catch (err) {
      assert.ok(isObject(err));
      assert.ok(err.name === 'ENTITY_IS_DELETED');
    }
  });
});
