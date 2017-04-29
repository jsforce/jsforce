import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isString, isBoolean, isUndefined } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();
conn.metadata.pollTimeout = 40 * 1000; // adjust poll timeout to test timeout.


/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});


/*------------------------------------------------------------------------*/

/**
 *
 */
test.serial('describe tabs and return app and its including tabs', async (t) => {
  const apps = await conn.soap.describeTabs();
  t.true(apps.length > 0);
  for (const app of apps) {
    t.true(isString(app.label));
    t.true(isString(app.logoUrl));
    t.true(isBoolean(app.selected));
    t.true(Array.isArray(app.tabs));
    for (const tab of app.tabs) {
      t.true(Array.isArray(tab.icons));
      t.true(isBoolean(tab.custom));
      t.true(isString(tab.name));
      t.true(isString(tab.label));
      t.true(isString(tab.url));
      t.true(isString(tab.miniIconUrl));
      t.true(isString(tab.sobjectName));
    }
  }
});


/**
 *
 */
test.group('convert and merge', (test) => {
  const accountIds = [];
  const contactIds = [];
  const oppIds = [];
  const leads = [{
    FirstName: 'Convert Test #1',
    LastName: 'Lead',
    Company: 'JSforce Test'
  }, {
    FirstName: 'Convert Test #2',
    LastName: 'Lead',
    Company: 'JSforce Test'
  }, {
    FirstName: 'Merge Test (Master)',
    LastName: 'Lead',
    Company: 'JSforce Test'
  }, {
    FirstName: 'Merge Test (Merging #1)',
    LastName: 'Lead',
    Company: 'JSforce Test'
  }, {
    FirstName: 'Merge Test (Merging #2)',
    LastName: 'Lead',
    Company: 'JSforce Test'
  }];

  let leadIds;
  let convertedStatus;

  test.before(async () => {
    // Because ver >= 38.0 metadata API doesn't return picklist values in standard field,
    // fix the version to 37.0
    const conn370 = connMgr.createConnection();
    conn370.version = '37.0';
    conn370.accessToken = conn.accessToken;
    conn370.instanceUrl = conn.instanceUrl;
    const [rets, statusField] = await Promise.all([
      conn.sobject('Lead').create(leads),
      conn370.metadata.read('CustomField', 'Lead.Status'),
    ]);
    leadIds = rets.map(r => r.id);
    convertedStatus = statusField.picklist.picklistValues
      .filter(pv => pv.converted === 'true')
      .map(pv => pv.fullName)[0];
  });

  /**
   *
   */
  test.serial('convert leads and return converted account/contact/opp information', async (t) => {
    const ret = await conn.soap.convertLead({ leadId: leadIds[0], convertedStatus });
    t.true(ret.success === true);
    t.true(isString(ret.accountId));
    t.true(isString(ret.contactId));
    t.true(isString(ret.opportunityId));
    accountIds.push(ret.accountId);
    contactIds.push(ret.contactId);
    oppIds.push(ret.opportunityId);
  });

  /**
   *
   */
  test.serial('convert lead by specifying accountId and without creating opportunity', async (t) => {
    const ret = await conn.soap.convertLead({
      leadId: leadIds[1],
      accountId: accountIds[0],
      convertedStatus,
      doNotCreateOpportunity: true
    });
    t.true(ret.success === true);
    t.true(isString(ret.accountId));
    t.true(isString(ret.contactId));
    t.true(ret.opportunityId === null || isUndefined(ret.OpportunityId));
    contactIds.push(ret.contactId);
  });

  /**
   *
   */
  test.serial('merge records', async (t) => {
    const masterRecord = Object.assign({ type: 'Lead' }, { Id: leadIds[2] }, leads[2]);
    const recordToMergeIds = [leadIds[3], leadIds[4]];
    const ret = await conn.soap.merge({ masterRecord, recordToMergeIds });
    t.true(ret.success === true);
    t.true(ret.id === leadIds[2]);
    t.true(ret.mergedRecordIds.length === 2);
    leadIds = leadIds.slice(0, 3);
  });

  /**
   *
   */
  test.after(async () => {
    await conn.sobject('Opportunity').destroy(oppIds);
    await conn.sobject('Contact').destroy(contactIds);
    await conn.sobject('Account').destroy(accountIds);
    await conn.sobject('Lead').destroy(leadIds);
  });
});

/*------------------------------------------------------------------------*/


/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
