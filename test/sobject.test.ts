import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isNumber, isBoolean, isUndefined } from './util';
import { Record } from '..';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

const Account = conn.sobject('Account');
const Opportunity = conn.sobject('Opportunity');

let acc: Record;
/**
 *
 */
it('should find records and return records', async () => {
  const records = await Account.find();
  assert.ok(Array.isArray(records));
});

/**
 *
 */
it('should find and return records with direct callback', async () => {
  const records = await Account.find({}, { Name: 1 });
  assert.ok(Array.isArray(records));
  acc = records[0]; // keep sample account record
});

/**
 *
 */
it('should find with conditions', async () => {
  const likeStr = `${acc.Name[0]}%`;
  const records = await Account.find({ Name: { $like: likeStr } }, { Name: 1 });
  assert.ok(Array.isArray(records));
  assert.ok(records.length > 0);
});

/**
 *
 */
it('should find one record and return a record', async () => {
  const record = await Account.findOne({ Id: acc.Id });
  assert.ok(isObject(record));
  // TODO: delete if check when assertions in control flow analysis is introduced to TS
  if (record) {
    assert.ok(isString(record.Id));
  }
});

/**
 *
 */
it('should count records and return total size count', async () => {
  const likeStr = `${acc.Name[0]}%`;
  const count = await Account.count({ Name: { $like: likeStr } });
  assert.ok(isNumber(count));
  assert.ok(count > 0);
});

/**
 *
 */
it('should find records with sort option and return sorted records', async () => {
  const records = await Opportunity.find({}, { CloseDate: 1 })
    .sort('CloseDate', 'desc')
    .exec();
  assert.ok(Array.isArray(records));
  assert.ok(records.length > 0);
  for (let i = 0; i < records.length - 1; i++) {
    assert.ok(records[i].CloseDate >= records[i + 1].CloseDate);
  }
});

/**
 *
 */
it('should find records with multiple sort options and return sorted records', async () => {
  const records = await Opportunity.find(
    {},
    { 'Account.Name': 1, CloseDate: 1 },
  )
    .sort('Account.Name -CloseDate')
    .exec();
  assert.ok(Array.isArray(records));
  assert.ok(records.length > 0);
  for (let i = 0; i < records.length - 1; i++) {
    const r1 = records[i];
    const r2 = records[i + 1];
    assert.ok(r1.Account.Name <= r2.Account.Name);
    if (r1.Account.Name === r2.Account.Name) {
      assert.ok(r1.CloseDate >= r2.CloseDate);
    }
  }
});

/**
 *
 */
it('should find records with multiple sort options and limit option and return sorted records', async () => {
  const records = await Opportunity.find({}, { 'Owner.Name': 1, CloseDate: 1 })
    .sort({ 'Owner.Name': 1, CloseDate: -1 })
    .limit(10)
    .exec();
  assert.ok(Array.isArray(records));
  assert.ok(records.length > 0);
  assert.ok(records.length < 11);
  for (let i = 0; i < records.length - 1; i++) {
    const r1 = records[i];
    const r2 = records[i + 1];
    assert.ok(r1.Owner.Name <= r2.Owner.Name);
    if (r1.Owner.Name === r2.Owner.Name) {
      assert.ok(r1.CloseDate >= r2.CloseDate);
    }
  }
});

/**
 *
 */
it('should select records and return records', async () => {
  const records = await Opportunity.select('Id,Owner.Name,CloseDate')
    .limit(10)
    .exec();
  assert.ok(Array.isArray(records));
  assert.ok(records.length > 0);
  assert.ok(records.length < 11);
  for (const record of records) {
    assert.ok(isString(record.Id));
    assert.ok(isObject(record.Owner));
    assert.ok(isString(record.Owner.Name));
    assert.ok(isString(record.CloseDate));
  }
});

/**
 *
 */
it('should select records with asterisk and return records', async () => {
  const records = await Opportunity.select('*, Account.*, Owner.Name').exec();
  assert.ok(Array.isArray(records));
  for (const record of records) {
    assert.ok(isString(record.Id));
    assert.ok(isString(record.Name));
    assert.ok(isString(record.CloseDate));
    assert.ok(isObject(record.Account));
    assert.ok(isString(record.Account.Name));
    assert.ok(isObject(record.Owner));
    assert.ok(isString(record.Owner.Name));
  }
});

/**
 *
 */
it('should select records including child objects and return records with child records', async () => {
  const records = await Account.find(null, 'Id')
    .include('Contacts')
    .select('*')
    .limit(2)
    .end()
    .include('Opportunities', null, 'Id, Name', { limit: 2 })
    .end()
    .limit(10)
    .exec();
  assert.ok(Array.isArray(records));
  assert.ok(records.length > 0);
  assert.ok(records.length < 11);
  for (const record of records) {
    assert.ok(isString(record.Id));
    assert.ok(isUndefined(record.Name));
    if (record.Contacts) {
      assert.ok(isObject(record.Contacts));
      const crecords = record.Contacts.records;
      assert.ok(Array.isArray(crecords));
      assert.ok(crecords.length > 0);
      assert.ok(crecords.length < 3);
      for (let j = 0; j < crecords.length; j++) {
        const crecord = crecords[j];
        assert.ok(isString(crecord.Id));
        assert.ok(isString(crecord.FirstName));
        assert.ok(isString(crecord.LastName));
      }
    }
    if (record.Opportunities) {
      assert.ok(isObject(record.Opportunities));
      const orecords = record.Opportunities.records;
      assert.ok(Array.isArray(orecords));
      assert.ok(orecords.length > 0);
      assert.ok(orecords.length < 3);
      for (const orecord of orecords) {
        assert.ok(isString(orecord.Id));
        assert.ok(isString(orecord.Name));
        assert.ok(isUndefined(orecord.CloseDate));
      }
    }
  }
});

/**
 *
 */
it('should list layout for SObject and return Account layout information', async () => {
  const res = await Account.layouts();
  assert.ok(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    assert.ok(layout.id === null || isString(layout.id));
    assert.ok(isObject(layout.buttonLayoutSection));
    assert.ok(Array.isArray(layout.detailLayoutSections));
    assert.ok(Array.isArray(layout.editLayoutSections));
    assert.ok(isObject(layout.quickActionList));
    assert.ok(Array.isArray(layout.quickActionList.quickActionListItems));
    assert.ok(Array.isArray(layout.relatedLists));
  }
  assert.ok(Array.isArray(res.recordTypeMappings));
  assert.ok(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
it('should list layouts (cache-first) and return Account layout information', async () => {
  const res = await Account.layouts$();
  assert.ok(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    assert.ok(layout.id === null || isString(layout.id));
    assert.ok(isObject(layout.buttonLayoutSection));
    assert.ok(Array.isArray(layout.detailLayoutSections));
    assert.ok(Array.isArray(layout.editLayoutSections));
    assert.ok(isObject(layout.quickActionList));
    assert.ok(Array.isArray(layout.quickActionList.quickActionListItems));
    assert.ok(Array.isArray(layout.relatedLists));
  }
  assert.ok(Array.isArray(res.recordTypeMappings));
  assert.ok(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
it('should get cached layouts and return Account layout information immediately', () => {
  const res = Account.layouts$$();
  assert.ok(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    assert.ok(layout.id === null || isString(layout.id));
    assert.ok(isObject(layout.buttonLayoutSection));
    assert.ok(Array.isArray(layout.detailLayoutSections));
    assert.ok(Array.isArray(layout.editLayoutSections));
    assert.ok(isObject(layout.quickActionList));
    assert.ok(Array.isArray(layout.quickActionList.quickActionListItems));
    assert.ok(Array.isArray(layout.relatedLists));
  }
  assert.ok(Array.isArray(res.recordTypeMappings));
  assert.ok(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
it('should list named layout for SObject and return User named layout information', async () => {
  const res = await conn.sobject('User').layouts('UserAlt');
  assert.ok(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    assert.ok(layout.id === null || isString(layout.id));
    assert.ok(isObject(layout.buttonLayoutSection));
    assert.ok(Array.isArray(layout.detailLayoutSections));
    assert.ok(Array.isArray(layout.editLayoutSections));
    assert.ok(isObject(layout.quickActionList));
    assert.ok(Array.isArray(layout.quickActionList.quickActionListItems));
    assert.ok(Array.isArray(layout.relatedLists));
  }
  assert.ok(Array.isArray(res.recordTypeMappings));
  assert.ok(Array.isArray(res.recordTypeSelectorRequired));
});

it('should list named layouts (cache-first) and return User named layout information', async () => {
  const res = await conn.sobject('User').layouts$('UserAlt');
  assert.ok(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    assert.ok(layout.id === null || isString(layout.id));
    assert.ok(isObject(layout.buttonLayoutSection));
    assert.ok(Array.isArray(layout.detailLayoutSections));
    assert.ok(Array.isArray(layout.editLayoutSections));
    assert.ok(isObject(layout.quickActionList));
    assert.ok(Array.isArray(layout.quickActionList.quickActionListItems));
    assert.ok(Array.isArray(layout.relatedLists));
  }
  assert.ok(Array.isArray(res.recordTypeMappings));
  assert.ok(Array.isArray(res.recordTypeSelectorRequired));
});

it('should get cached named layouts and return User named layout information immediately', () => {
  const res = conn.sobject('User').layouts$$('UserAlt');
  assert.ok(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    assert.ok(layout.id === null || isString(layout.id));
    assert.ok(isObject(layout.buttonLayoutSection));
    assert.ok(Array.isArray(layout.detailLayoutSections));
    assert.ok(Array.isArray(layout.editLayoutSections));
    assert.ok(isObject(layout.quickActionList));
    assert.ok(Array.isArray(layout.quickActionList.quickActionListItems));
    assert.ok(Array.isArray(layout.relatedLists));
  }
  assert.ok(Array.isArray(res.recordTypeMappings));
  assert.ok(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
it('should list compact layout for SObject and return Account comact layout information', async () => {
  const res = await Account.compactLayouts();
  assert.ok(Array.isArray(res.compactLayouts));
  for (const clayout of res.compactLayouts) {
    assert.ok(clayout.id === null || isString(clayout.id));
    assert.ok(isString(clayout.objectType));
    assert.ok(Array.isArray(clayout.actions));
    assert.ok(Array.isArray(clayout.fieldItems));
  }
  assert.ok(
    !res.defaultCompactLayoutId || isString(res.defaultCompactLayoutId),
  );
  assert.ok(Array.isArray(res.recordTypeCompactLayoutMappings));
});

/**
 *
 */
it('should list compact layouts (cache-first) and return Account comact layout information', async () => {
  const res = await Account.compactLayouts$();
  assert.ok(Array.isArray(res.compactLayouts));
  for (const clayout of res.compactLayouts) {
    assert.ok(clayout.id === null || isString(clayout.id));
    assert.ok(isString(clayout.objectType));
    assert.ok(Array.isArray(clayout.actions));
    assert.ok(Array.isArray(clayout.fieldItems));
  }
  assert.ok(
    !res.defaultCompactLayoutId || isString(res.defaultCompactLayoutId),
  );
  assert.ok(Array.isArray(res.recordTypeCompactLayoutMappings));
});

/**
 *
 */
it('should get cached compact layouts and return Account comapct layout information immediately', () => {
  const res = Account.compactLayouts$$();
  assert.ok(Array.isArray(res.compactLayouts));
  for (const clayout of res.compactLayouts) {
    assert.ok(clayout.id === null || isString(clayout.id));
    assert.ok(isString(clayout.objectType));
    assert.ok(Array.isArray(clayout.actions));
    assert.ok(Array.isArray(clayout.fieldItems));
  }
  assert.ok(
    !res.defaultCompactLayoutId || isString(res.defaultCompactLayoutId),
  );
  assert.ok(Array.isArray(res.recordTypeCompactLayoutMappings));
});

/**
 *
 */
it('should list approval layout for SObject and return Account approval layout information', async () => {
  const res = await Account.approvalLayouts();
  assert.ok(Array.isArray(res.approvalLayouts));
  for (const alayout of res.approvalLayouts) {
    assert.ok(alayout.id === null || isString(alayout.id));
    assert.ok(isString(alayout.name));
    assert.ok(isString(alayout.label));
    assert.ok(Array.isArray(alayout.layoutItems));
  }
});

/**
 *
 */
it('should list approval layouts (cache-first) and return Account approval layout information', async () => {
  const res = await Account.approvalLayouts$();
  assert.ok(Array.isArray(res.approvalLayouts));
  for (const alayout of res.approvalLayouts) {
    assert.ok(alayout.id === null || isString(alayout.id));
    assert.ok(isString(alayout.name));
    assert.ok(isString(alayout.label));
    assert.ok(Array.isArray(alayout.layoutItems));
  }
});

/**
 *
 */
it('should get cached approval layouts and return Account approval layout information immediately', () => {
  const res = Account.approvalLayouts$$();
  assert.ok(Array.isArray(res.approvalLayouts));
  for (const alayout of res.approvalLayouts) {
    assert.ok(alayout.id === null || isString(alayout.id));
    assert.ok(isString(alayout.name));
    assert.ok(isString(alayout.label));
    assert.ok(Array.isArray(alayout.layoutItems));
  }
});

let listviewId: string;

/**
 *
 */
it('should listup list views and return list views definitions on the sobject', async () => {
  const result = await Account.listviews();
  assert.ok(isObject(result));
  assert.ok(Array.isArray(result.listviews));
  for (const [i, listview] of result.listviews.entries()) {
    assert.ok(isString(listview.id));
    assert.ok(isString(listview.label));
    assert.ok(isString(listview.describeUrl));
    assert.ok(isString(listview.resultsUrl));
    assert.ok(isBoolean(listview.soqlCompatible));
    if (i === 0) {
      listviewId = listview.id;
    }
  }
});

/**
 *
 */
it('should describe list view and return described list view info for given list view id', async () => {
  const result = await Account.listview(listviewId).describe();
  assert.ok(isObject(result));
  assert.ok(isString(result.id));
  assert.ok(isString(result.sobjectType));
  assert.ok(isString(result.query) || result.query === null);
  assert.ok(Array.isArray(result.columns));
  assert.ok(Array.isArray(result.orderBy));
  for (const column of result.columns) {
    assert.ok(isString(column.label));
    assert.ok(isString(column.fieldNameOrPath));
    assert.ok(isString(column.selectListItem));
    assert.ok(isNumber(column.sortIndex) || column.sortIndex === null);
    assert.ok(isBoolean(column.sortable));
  }
});

/**
 *
 */
it('should get result of list view and return executed result of list view for given list view id', async () => {
  const result = await Account.listview(listviewId).results();
  assert.ok(isObject(result));
  assert.ok(isBoolean(result.done));
  assert.ok(isNumber(result.size));
  assert.ok(isString(result.id));
  assert.ok(isString(result.label));
  assert.ok(Array.isArray(result.columns));
  for (const column of result.columns) {
    assert.ok(isString(column.label));
    assert.ok(isString(column.fieldNameOrPath));
    assert.ok(isString(column.selectListItem));
    assert.ok(isNumber(column.sortIndex) || column.sortIndex === null);
    assert.ok(isBoolean(column.sortable));
  }
  assert.ok(Array.isArray(result.records));
});

/**
 *
 */
it('should explain query plan of list view and get explain result', async () => {
  const result = await Account.listview(listviewId).explain();
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
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
