import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isNumber, isUndefined, clone } from './util';

const connMgr = new ConnectionManager(config);
const conn: any = connMgr.createConnection(); // TODO: remove any

/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});


/**
 *
 */
test.group('report', (test) => {
  let reportId: string;
  let instanceId: string;
  let cloneId: string;

  /**
   *
   */
  test.before(async () => {
    const res = await conn.sobject('Report').findOne({ Name: 'Lead List Report' }, 'Id').execute();
    if (!res) { throw new Error('No Report Name \'Lead List Report\' was found in the org.'); }
    reportId = res.Id;
  });

  /**
   *
   */
  test('list recent reports and return report infomation list', async (t) => {
    const reports = await conn.analytics.reports();
    t.true(Array.isArray(reports));
    for (const report of reports) {
      t.true(isString(report.id));
      t.true(isString(report.name));
      t.true(isString(report.url));
    }
  });

  /**
   *
   */
  test('describe report and return report metadata', async (t) => {
    const meta = await conn.analytics.report(reportId).describe();
    t.true(isObject(meta));
    t.true(isObject(meta.reportMetadata));
    t.true(isObject(meta.reportTypeMetadata));
    t.true(isObject(meta.reportExtendedMetadata));
  });

  /**
   *
   */
  test('execute report synchronously and return report execution result', async (t) => {
    const result = await conn.analytics.report(reportId).execute();
    t.true(isObject(result));
    t.true(result.hasDetailRows === false);
    t.true(isObject(result.reportMetadata));
    t.true(result.reportMetadata.id === reportId);
    t.true(isObject(result.factMap));
    t.true(isObject(result.factMap['T!T']));
    t.true(isUndefined(result.factMap['T!T'].rows));
    t.true(isObject(result.factMap['T!T'].aggregates));
  });

  /**
   *
   */
  test('execute report synchronously with details and return report execution result', async (t) => {
    const result = await conn.analytics.report(reportId).execute({ details: true });
    t.true(isObject(result));
    t.true(result.hasDetailRows === true);
    t.true(isObject(result.reportMetadata));
    t.true(result.reportMetadata.id === reportId);
    t.true(isObject(result.factMap));
    t.true(isObject(result.factMap['T!T']));
    t.true(Array.isArray(result.factMap['T!T'].rows));
    t.true(isObject(result.factMap['T!T'].aggregates));
  });


  /**
   *
   */
  test('execute report synchronously with filters overrided and return report execution result', async (t) => {
    const metadata = {
      reportMetadata: {
        historicalSnapshotDates: [],
        reportFilters: [{
          column: 'COMPANY',
          operator: 'contains',
          value: ',Inc.',
        }],
      },
    };
    const result =
      await conn.analytics.report(reportId).execute({ metadata, details: true });
    t.true(isObject(result));
    t.true(isObject(result.reportMetadata));
    t.true(Array.isArray(result.reportMetadata.reportFilters));
    t.true(result.reportMetadata.id === reportId);
    t.true(isObject(result.factMap));
    t.true(isObject(result.factMap['T!T']));
    t.true(Array.isArray(result.factMap['T!T'].rows));
    t.true(isObject(result.factMap['T!T'].aggregates));
  });


  /**
   *
   */
  test('execute report asynchronously and return report instance info', async (t) => {
    const instance = await conn.analytics.report(reportId).executeAsync();
    t.true(isObject(instance));
    t.true(isString(instance.id));
    t.true(isString(instance.status));
    t.true(isString(instance.requestDate));
    instanceId = instance.id;
  });


  /**
   *
   */
  test('list asynchronously executed report instances and return report instance list', async (t) => {
    const instances = await conn.analytics.report(reportId).instances();
    t.true(Array.isArray(instances));
    for (const instance of instances) {
      t.true(isString(instance.id));
      t.true(isString(instance.status));
      t.true(isString(instance.requestDate));
    }
  });

  /**
   *
   */
  test('retrieve asynchronously executed report result and return report execution result', async (t) => {
    const result = await conn.analytics.report(reportId).instance(instanceId).retrieve();
    t.true(isObject(result));
    t.true(isObject(result.attributes));
    t.true(result.attributes.id === instanceId);
    t.true(isString(result.attributes.status));
    t.true(isString(result.attributes.requestDate));
    if (result.attributes.status === 'Success') {
      t.true(isObject(result.reportMetadata));
      t.true(result.reportMetadata.id === reportId);
    }
  });

  /**
   *
   */
  test('explain query plan of report and get explain result', async (t) => {
    const result = await conn.analytics.report(reportId).explain();
    t.true(Array.isArray(result.plans));
    for (const plan of result.plans) {
      t.true(isNumber(plan.cardinality));
      t.true(Array.isArray(plan.fields));
      t.true(isString(plan.leadingOperationType));
      t.true(isNumber(plan.relativeCost));
      t.true(isNumber(plan.sobjectCardinality));
      t.true(isString(plan.sobjectType));
    }
  });

  /**
   *
   */
  test('clone report and get the cloned report', async (t) => {
    const result = await conn.analytics.report(reportId).clone('Lead List Report Clone');
    t.true(isObject(result.reportMetadata));
    cloneId = result.reportMetadata.id;
    t.true(cloneId !== reportId);
    t.true(result.reportMetadata.name === 'Lead List Report Clone');
  });


  /**
   *
   */
  test('destroy report and confirm the report destroyed', async (t) => {
    await conn.analytics.report(cloneId).destroy();
    try {
      await conn.analytics.report(cloneId).describe();
      t.fail();
    } catch (err) {
      t.true(isObject(err));
      t.true(err.name === 'NOT_FOUND');
    }
  });
});


/**
 *
 */
test.group('dashboard', (test) => {
  let dashboardId: string;
  let dashboardFolderId: string;
  let dashboardMetadata: any;
  let cloneDashboardId: string;

  /**
   *
   */
  test.before(async () => {
    const res =
      await conn.sobject('Dashboard').findOne({ Title: 'Lead List Dashboard' }, 'Id').execute();
    if (!res) { throw new Error('No Dashboard Named \'Lead List Dashboard\' was found in the org.'); }
    dashboardId = res.Id;
  });

  /**
   *
   */
  test('list recent dashboards and return dashboard infomation list', async (t) => {
    const dashboards = await conn.analytics.dashboards();
    t.true(Array.isArray(dashboards));
    for (const dashboard of dashboards) {
      t.true(isString(dashboard.id));
      t.true(isString(dashboard.name));
      t.true(isString(dashboard.url));
    }
  });


  /**
   *
   */
  test('describe dashboard and return dashboard metadata', async (t) => {
    const meta = await conn.analytics.dashboard(dashboardId).describe();
    t.true(isObject(meta));
    t.true(Array.isArray(meta.components));
    t.true(isObject(meta.layout));
    dashboardFolderId = meta.folderId;
    dashboardMetadata = clone(meta);
  });

  /**
   *
   */
  test('get all dashboard components and return all components', async (t) => {
    const meta = await conn.analytics.dashboard(dashboardId).components();
    t.true(dashboardMetadata.components.length === meta.componentData.length);
  });

  /**
   *
   */
  test('get one dashboard component and return one component', async (t) => {
    const meta =
      await conn.analytics.dashboard(dashboardId).components(dashboardMetadata.components[0].id);
    t.true(meta.componentData.length === 1);
  });

  /**
   *
   */
  test('get three dashboard components and return three components', async (t) => {
    const ids = [
      dashboardMetadata.components[0].id,
      dashboardMetadata.components[1].id,
      dashboardMetadata.components[2].id,
    ];
    const meta = await conn.analytics.dashboard(dashboardId).components(ids);
    t.true(meta.componentData.length === 3);
  });

  /**
   *
   */
  test('get status of dashboard and return dashboard status metadata', async (t) => {
    const meta = await conn.analytics.dashboard(dashboardId).status();
    t.true(isObject(meta));
    t.true(Array.isArray(meta.componentStatus));
  });

  /**
   *
   */
  test('clone dashboard and return cloned dashboard', async (t) => {
    const result = await conn.analytics.dashboard(dashboardId).clone({
      name: 'Lead List Dashboard Clone',
      folderId: dashboardFolderId,
    });
    t.true(isObject(result.attributes));
    cloneDashboardId = result.attributes.dashboardId;
    t.true(cloneDashboardId !== dashboardId);
    t.true(result.name === 'Lead List Dashboard Clone');
  });

  /**
   *
   */
  test('refresh dashboard and return refreshed dashboard metadata', async (t) => {
    // refresh cloned dashboard, in order to prevent frequent refresh error.
    const meta = await conn.analytics.dashboard(cloneDashboardId).refresh();
    t.true(isObject(meta));
    t.true(isString(meta.statusUrl));
  });

  /**
   *
   */
  test('destroy dashboard and confirm the dashboard destroyed', async (t) => {
    await conn.analytics.dashboard(cloneDashboardId).destroy();
    try {
      await conn.analytics.dashboard(cloneDashboardId).describe();
      t.fail();
    } catch (err) {
      t.true(isObject(err));
      t.true(err.name === 'ENTITY_IS_DELETED');
    }
  });
});


/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
