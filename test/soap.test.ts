import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isString, isBoolean, isUndefined } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/*------------------------------------------------------------------------*/

/**
 *
 */
it('should describe tabs and return app and its including tabs', async () => {
  const apps = await conn.soap.describeTabs();
  assert.ok(apps.length > 0);
  for (const app of apps) {
    assert.ok(isString(app.label));
    assert.ok(isString(app.logoUrl));
    assert.ok(isBoolean(app.selected));
    assert.ok(Array.isArray(app.tabs));
    for (const tab of app.tabs) {
      assert.ok(Array.isArray(tab.icons));
      assert.ok(isBoolean(tab.custom));
      assert.ok(isString(tab.name));
      assert.ok(isString(tab.label));
      assert.ok(isString(tab.url));
      assert.ok(isString(tab.miniIconUrl));
      assert.ok(isString(tab.sobjectName));
    }
  }
});

/**
 *
 */
describe('convert and merge', () => {
  const accountIds: string[] = [];
  const contactIds: string[] = [];
  const oppIds: string[] = [];
  const leads = [
    {
      FirstName: 'Convert Test #1',
      LastName: 'Lead',
      Company: 'JSforce Test',
    },
    {
      FirstName: 'Convert Test #2',
      LastName: 'Lead',
      Company: 'JSforce Test',
    },
    {
      FirstName: 'Merge Test (Master)',
      LastName: 'Lead',
      Company: 'JSforce Test',
    },
    {
      FirstName: 'Merge Test (Merging #1)',
      LastName: 'Lead',
      Company: 'JSforce Test',
    },
    {
      FirstName: 'Merge Test (Merging #2)',
      LastName: 'Lead',
      Company: 'JSforce Test',
    },
  ];

  let leadIds: string[];
  let convertedStatus: string;

  beforeAll(async () => {
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
    leadIds = rets.map((r) => r.id!);
    // @ts-expect-error  @typescript-eslint/no-unnecessary-type-assertion weird CI only linting?
    convertedStatus = statusField.picklist.picklistValues
      .filter((pv: { converted: string }) => pv.converted === 'true')
      .map((pv: { fullName: any }) => pv.fullName)[0];
  });

  /**
   *
   */
  it('should convert leads and return converted account/contact/opp information', async () => {
    const ret = await conn.soap.convertLead({
      leadId: leadIds[0],
      convertedStatus,
    });
    assert.ok(ret.success);
    assert.ok(isString(ret.accountId));
    assert.ok(isString(ret.contactId));
    assert.ok(isString(ret.opportunityId));
    accountIds.push(ret.accountId);
    contactIds.push(ret.contactId);
    oppIds.push(ret.opportunityId);
  });

  /**
   *
   */
  it('should convert lead by specifying accountId and without creating opportunity', async () => {
    const ret = await conn.soap.convertLead({
      leadId: leadIds[1],
      accountId: accountIds[0],
      convertedStatus,
      doNotCreateOpportunity: true,
    });
    assert.ok(ret.success);
    assert.ok(isString(ret.accountId));
    assert.ok(isString(ret.contactId));
    assert.ok(ret.opportunityId == null);
    contactIds.push(ret.contactId);
  });

  /**
   *
   */
  it('should merge records', async () => {
    const masterRecord = Object.assign(
      { type: 'Lead' },
      { Id: leadIds[2] },
      leads[2],
    );
    const recordToMergeIds = [leadIds[3], leadIds[4]];
    const ret = await conn.soap.merge({ masterRecord, recordToMergeIds });
    assert.ok(ret.success);
    assert.ok(ret.id === leadIds[2]);
    assert.ok(ret.mergedRecordIds.length === 2);
    leadIds = leadIds.slice(0, 3); // eslint-disable-line require-atomic-updates
  });

  /**
   *
   */
  afterAll(async () => {
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
describe('undelete', () => {
  const contacts = [
    {
      Name: 'Undelete Test #1',
    },
    {
      Name: 'Undelete Test #2',
    },
    {
      Name: 'Undelete Test #3',
    },
  ];

  let contactIds: string[];

  beforeAll(async () => {
    // Arrange
    const insertedContacts = await conn.sobject('Lead').create(contacts);
    contactIds = insertedContacts.map((contact) => contact.id!);

    await Promise.all(
      contactIds.map((id) => conn.sobject('Contact').destroy(id)),
    );
  });

  /**
   *
   */
  it('should undelete deleted contacts', async () => {
    // Act
    const ret = await conn.soap.undelete(contactIds);

    // Assert

    assert.ok(isUndefined(ret.errors));
    assert.ok(isString(ret.id));
    assert.ok(isBoolean(ret.success));
    assert.ok(ret.success === true);
  });

  it('should fail to undelete string', async () => {
    // Act
    const rets = await conn.soap.undelete(['not an id']);

    // Assert
    assert.ok(rets.errors.length > 0);
    assert.ok(isBoolean(rets.success));
    assert.ok(rets.success === false);
  });

  it('should fail to undelete not deleted ids', async () => {
    // Arrange
    const contact = await conn.sobject('Lead').create({
      Name: 'Undelete Test #4',
    });

    // Act
    const rets = await conn.soap.undelete([contact.id!]);

    // Assert
    assert.ok(rets.errors.length > 0);
    assert.ok(isBoolean(rets.success));
    assert.ok(rets.success === false);
  });

  afterAll(async () => {
    await conn.sobject('Contact').destroy(contactIds);
  });
});
