import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isNumber, isBoolean, isUndefined } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});


let Account;
let Opportunity;

/**
 *
 */
test.before('create sobject and get SObject instances', () => {
  Account = conn.sobject('Account');
  Opportunity = conn.sobject('Opportunity');
});

let acc;
/**
 *
 */
test.serial('find records and return records', async (t) => {
  const records = await Account.find();
  t.true(Array.isArray(records));
});

/**
 *
 */
test.serial('find and return records with direct callback', async (t) => {
  const records = await Account.find({}, { Name: 1 });
  t.true(Array.isArray(records));
  acc = records[0]; // keep sample account record
});

/**
 *
 */
test.serial('find with conditions', async (t) => {
  const likeStr = `${acc.Name[0]}%`;
  const records = await Account.find({ Name: { $like: likeStr } }, { Name: 1 });
  t.true(Array.isArray(records));
  t.true(records.length > 0);
});

/**
 *
 */
test.serial('find one record and return a record', async (t) => {
  const record = await Account.findOne({ Id: acc.Id });
  t.true(isObject(record));
  t.true(isString(record.Id));
});

/**
 *
 */
test.serial('count records and return total size count', async (t) => {
  const likeStr = `${acc.Name[0]}%`;
  const count = await Account.count({ Name: { $like: likeStr } });
  t.true(isNumber(count));
  t.true(count > 0);
});

/**
 *
 */
test.serial('find records with sort option and return sorted records', async (t) => {
  const records = await Opportunity.find({}, { CloseDate: 1 })
    .sort('CloseDate', 'desc')
    .exec();
  t.true(Array.isArray(records));
  t.true(records.length > 0);
  for (let i = 0; i < records.length - 1; i++) {
    t.true(records[i].CloseDate >= records[i + 1].CloseDate);
  }
});

/**
 *
 */
test.serial('find records with multiple sort options and return sorted records', async (t) => {
  const records = await Opportunity.find({}, { 'Account.Name': 1, CloseDate: 1 })
    .sort('Account.Name -CloseDate')
    .exec();
  t.true(Array.isArray(records));
  t.true(records.length > 0);
  for (let i = 0; i < records.length - 1; i++) {
    const r1 = records[i];
    const r2 = records[i + 1];
    t.true(r1.Account.Name <= r2.Account.Name);
    if (r1.Account.Name === r2.Account.Name) {
      t.true(r1.CloseDate >= r2.CloseDate);
    }
  }
});

/**
 *
 */
test.serial('find records with multiple sort options and limit option and return sorted records', async (t) => {
  const records = await Opportunity.find({}, { 'Owner.Name': 1, CloseDate: 1 })
    .sort({ 'Owner.Name': 1, CloseDate: -1 })
    .limit(10)
    .exec();
  t.true(Array.isArray(records));
  t.true(records.length > 0);
  t.true(records.length < 11);
  for (let i = 0; i < records.length - 1; i++) {
    const r1 = records[i];
    const r2 = records[i + 1];
    t.true(r1.Owner.Name <= r2.Owner.Name);
    if (r1.Owner.Name === r2.Owner.Name) {
      t.true(r1.CloseDate >= r2.CloseDate);
    }
  }
});

/**
 *
 */
test.serial('select records and return records', async (t) => {
  const records = await Opportunity.select('Id,Owner.Name,CloseDate')
    .limit(10)
    .exec();
  t.true(Array.isArray(records));
  t.true(records.length > 0);
  t.true(records.length < 11);
  for (const record of records) {
    t.true(isString(record.Id));
    t.true(isObject(record.Owner));
    t.true(isString(record.Owner.Name));
    t.true(isString(record.CloseDate));
  }
});

/**
 *
 */
test.serial('select records with asterisk and return records', async (t) => {
  const records = await Opportunity.select('*, Account.*, Owner.Name').exec();
  t.true(Array.isArray(records));
  for (const record of records) {
    t.true(isString(record.Id));
    t.true(isString(record.Name));
    t.true(isString(record.CloseDate));
    t.true(isObject(record.Account));
    t.true(isString(record.Account.Name));
    t.true(isObject(record.Owner));
    t.true(isString(record.Owner.Name));
  }
});

/**
 *
 */
test.serial('select records including child objects and return records with child records', async (t) => {
  const records = await Account.find(null, 'Id')
    .include('Contacts').select('*').limit(2)
    .end()
    .include('Opportunities', null, 'Id, Name', { limit: 2 })
    .end()
    .limit(10)
    .exec();
  t.true(Array.isArray(records));
  t.true(records.length > 0);
  t.true(records.length < 11);
  for (const record of records) {
    t.true(isString(record.Id));
    t.true(isUndefined(record.Name));
    if (record.Contacts) {
      t.true(isObject(record.Contacts));
      const crecords = record.Contacts.records;
      t.true(Array.isArray(crecords));
      t.true(crecords.length > 0);
      t.true(crecords.length < 3);
      for (let j = 0; j < crecords.length; j++) {
        const crecord = crecords[j];
        t.true(isString(crecord.Id));
        t.true(isString(crecord.FirstName));
        t.true(isString(crecord.LastName));
      }
    }
    if (record.Opportunities) {
      t.true(isObject(record.Opportunities));
      const orecords = record.Opportunities.records;
      t.true(Array.isArray(orecords));
      t.true(orecords.length > 0);
      t.true(orecords.length < 3);
      for (const orecord of orecords) {
        t.true(isString(orecord.Id));
        t.true(isString(orecord.Name));
        t.true(isUndefined(orecord.CloseDate));
      }
    }
  }
});

/**
 *
 */
test.serial('list layout for SObject and return Account layout information', async (t) => {
  const res = await Account.layouts();
  t.true(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    t.true(layout.id === null || isString(layout.id));
    t.true(isObject(layout.buttonLayoutSection));
    t.true(Array.isArray(layout.detailLayoutSections));
    t.true(Array.isArray(layout.editLayoutSections));
    t.true(isObject(layout.quickActionList));
    t.true(Array.isArray(layout.quickActionList.quickActionListItems));
    t.true(Array.isArray(layout.relatedLists));
  }
  t.true(Array.isArray(res.recordTypeMappings));
  t.true(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
test.serial('list layouts (cache-first) and return Account layout information', async (t) => {
  const res = await Account.layouts$();
  t.true(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    t.true(layout.id === null || isString(layout.id));
    t.true(isObject(layout.buttonLayoutSection));
    t.true(Array.isArray(layout.detailLayoutSections));
    t.true(Array.isArray(layout.editLayoutSections));
    t.true(isObject(layout.quickActionList));
    t.true(Array.isArray(layout.quickActionList.quickActionListItems));
    t.true(Array.isArray(layout.relatedLists));
  }
  t.true(Array.isArray(res.recordTypeMappings));
  t.true(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
test.serial('get cached layouts and return Account layout information immediately', (t) => {
  const res = Account.layouts$$();
  t.true(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    t.true(layout.id === null || isString(layout.id));
    t.true(isObject(layout.buttonLayoutSection));
    t.true(Array.isArray(layout.detailLayoutSections));
    t.true(Array.isArray(layout.editLayoutSections));
    t.true(isObject(layout.quickActionList));
    t.true(Array.isArray(layout.quickActionList.quickActionListItems));
    t.true(Array.isArray(layout.relatedLists));
  }
  t.true(Array.isArray(res.recordTypeMappings));
  t.true(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
test.serial('list named layout for SObject and return User named layout information', async (t) => {
  const res = await conn.sobject('User').layouts('UserAlt');
  t.true(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    t.true(layout.id === null || isString(layout.id));
    t.true(isObject(layout.buttonLayoutSection));
    t.true(Array.isArray(layout.detailLayoutSections));
    t.true(Array.isArray(layout.editLayoutSections));
    t.true(isObject(layout.quickActionList));
    t.true(Array.isArray(layout.quickActionList.quickActionListItems));
    t.true(Array.isArray(layout.relatedLists));
  }
  t.true(Array.isArray(res.recordTypeMappings));
  t.true(Array.isArray(res.recordTypeSelectorRequired));
});

test.serial('list named layouts (cache-first) and return User named layout information', async (t) => {
  const res = await conn.sobject('User').layouts$('UserAlt');
  t.true(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    t.true(layout.id === null || isString(layout.id));
    t.true(isObject(layout.buttonLayoutSection));
    t.true(Array.isArray(layout.detailLayoutSections));
    t.true(Array.isArray(layout.editLayoutSections));
    t.true(isObject(layout.quickActionList));
    t.true(Array.isArray(layout.quickActionList.quickActionListItems));
    t.true(Array.isArray(layout.relatedLists));
  }
  t.true(Array.isArray(res.recordTypeMappings));
  t.true(Array.isArray(res.recordTypeSelectorRequired));
});

test.serial('get cached named layouts and return User named layout information immediately', (t) => {
  const res = conn.sobject('User').layouts$$('UserAlt');
  t.true(Array.isArray(res.layouts));
  for (const layout of res.layouts) {
    t.true(layout.id === null || isString(layout.id));
    t.true(isObject(layout.buttonLayoutSection));
    t.true(Array.isArray(layout.detailLayoutSections));
    t.true(Array.isArray(layout.editLayoutSections));
    t.true(isObject(layout.quickActionList));
    t.true(Array.isArray(layout.quickActionList.quickActionListItems));
    t.true(Array.isArray(layout.relatedLists));
  }
  t.true(Array.isArray(res.recordTypeMappings));
  t.true(Array.isArray(res.recordTypeSelectorRequired));
});

/**
 *
 */
test.serial('list compact layout for SObject and return Account comact layout information', async (t) => {
  const res = await Account.compactLayouts();
  t.true(Array.isArray(res.compactLayouts));
  for (const clayout of res.compactLayouts) {
    t.true(clayout.id === null || isString(clayout.id));
    t.true(isString(clayout.objectType));
    t.true(Array.isArray(clayout.actions));
    t.true(Array.isArray(clayout.fieldItems));
  }
  t.true(!res.defaultCompactLayoutId || isString(res.defaultCompactLayoutId));
  t.true(Array.isArray(res.recordTypeCompactLayoutMappings));
});

/**
 *
 */
test.serial('list compact layouts (cache-first) and return Account comact layout information', async (t) => {
  const res = await Account.compactLayouts$();
  t.true(Array.isArray(res.compactLayouts));
  for (const clayout of res.compactLayouts) {
    t.true(clayout.id === null || isString(clayout.id));
    t.true(isString(clayout.objectType));
    t.true(Array.isArray(clayout.actions));
    t.true(Array.isArray(clayout.fieldItems));
  }
  t.true(!res.defaultCompactLayoutId || isString(res.defaultCompactLayoutId));
  t.true(Array.isArray(res.recordTypeCompactLayoutMappings));
});

/**
 *
 */
test.serial('get cached compact layouts and return Account comapct layout information immediately', (t) => {
  const res = Account.compactLayouts$$();
  t.true(Array.isArray(res.compactLayouts));
  for (const clayout of res.compactLayouts) {
    t.true(clayout.id === null || isString(clayout.id));
    t.true(isString(clayout.objectType));
    t.true(Array.isArray(clayout.actions));
    t.true(Array.isArray(clayout.fieldItems));
  }
  t.true(!res.defaultCompactLayoutId || isString(res.defaultCompactLayoutId));
  t.true(Array.isArray(res.recordTypeCompactLayoutMappings));
});


/**
 *
 */
test.serial('list approval layout for SObject and return Account approval layout information', async (t) => {
  const res = await Account.approvalLayouts();
  t.true(Array.isArray(res.approvalLayouts));
  for (const alayout of res.approvalLayouts) {
    t.true(alayout.id === null || isString(alayout.id));
    t.true(isString(alayout.name));
    t.true(isString(alayout.label));
    t.true(Array.isArray(alayout.layoutItems));
  }
});

/**
 *
 */
test.serial('list approval layouts (cache-first) and return Account approval layout information', async (t) => {
  const res = await Account.approvalLayouts$();
  t.true(Array.isArray(res.approvalLayouts));
  for (const alayout of res.approvalLayouts) {
    t.true(alayout.id === null || isString(alayout.id));
    t.true(isString(alayout.name));
    t.true(isString(alayout.label));
    t.true(Array.isArray(alayout.layoutItems));
  }
});

/**
 *
 */
test.serial('get cached approval layouts and return Account approval layout information immediately', (t) => {
  const res = Account.approvalLayouts$$();
  t.true(Array.isArray(res.approvalLayouts));
  for (const alayout of res.approvalLayouts) {
    t.true(alayout.id === null || isString(alayout.id));
    t.true(isString(alayout.name));
    t.true(isString(alayout.label));
    t.true(Array.isArray(alayout.layoutItems));
  }
});


let listviewId;

/**
 *
 */
test.serial('listup list views and return list views definitions on the sobject', async (t) => {
  const result = await Account.listviews();
  t.true(isObject(result));
  t.true(Array.isArray(result.listviews));
  for (const [i, listview] of result.listviews.entries()) {
    t.true(isString(listview.id));
    t.true(isString(listview.label));
    t.true(isString(listview.describeUrl));
    t.true(isString(listview.resultsUrl));
    t.true(isBoolean(listview.soqlCompatible));
    if (i === 0) { listviewId = listview.id; }
  }
});

/**
 *
 */
test.serial('describe list view and return described list view info for given list view id', async (t) => {
  const result = await Account.listview(listviewId).describe();
  t.true(isObject(result));
  t.true(isString(result.id));
  t.true(isString(result.sobjectType));
  t.true(isString(result.query) || result.query === null);
  t.true(Array.isArray(result.columns));
  t.true(Array.isArray(result.orderBy));
  for (const column of result.columns) {
    t.true(isString(column.label));
    t.true(isString(column.fieldNameOrPath));
    t.true(isString(column.selectListItem));
    t.true(isNumber(column.sortIndex) || column.sortIndex === null);
    t.true(isBoolean(column.sortable));
  }
});

/**
 *
 */
test.serial('get result of list view and return executed result of list view for given list view id', async (t) => {
  const result = await Account.listview(listviewId).results();
  t.true(isObject(result));
  t.true(isBoolean(result.done));
  t.true(isNumber(result.size));
  t.true(isString(result.id));
  t.true(isString(result.label));
  t.true(Array.isArray(result.columns));
  for (const column of result.columns) {
    t.true(isString(column.label));
    t.true(isString(column.fieldNameOrPath));
    t.true(isString(column.selectListItem));
    t.true(isNumber(column.sortIndex) || column.sortIndex === null);
    t.true(isBoolean(column.sortable));
  }
  t.true(Array.isArray(result.records));
});

/**
 *
 */
test.serial('explain query plan of list view and get explain result', async (t) => {
  const result = await Account.listview(listviewId).explain();
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
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
