import {
  AssertTrue,
  Has,
  IsNullable,
  IsExact,
  IsAny,
} from 'conditional-type-checks';
import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import {
  Schema,
  StandardSchema,
  SObjectRecord,
  SObjectInputRecord,
  SObjectUpdateRecord,
  Record,
  DateString,
  Address,
} from '../src';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection<StandardSchema>();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
describe('default schema', () => {
  type S = Schema;

  test('record', () => {
    type Account = SObjectRecord<S, 'Account'>;
    type t1 =
      | AssertTrue<Has<Account['Id'], string>>
      | AssertTrue<IsNullable<Account['Id']>>;
    const acc: Account = { Id: '000001', Name: 'Account #1' };
    assert.ok(acc.Id != null);
    type Contact = SObjectInputRecord<S, 'Account'>;
    type t2 =
      | AssertTrue<Has<Contact['Id'], string>>
      | AssertTrue<IsNullable<Contact['Id']>>;
    const con: Contact = { Id: '000001', Name: 'Contact #1' };
    assert.ok(con.Id != null);
    type Case = SObjectUpdateRecord<S, 'Case'>;
    type t3 = AssertTrue<IsExact<Case['Id'], string>>;
    const cas: Case = { Id: '000001', Subject: 'Case #1' };
    assert.ok(cas.Id != null);
  });

  test('connection CRUD', async () => {
    assert.ok(true);
  });
});

/**
 *
 */
describe('standard schema', () => {
  type S = StandardSchema;

  test('record', () => {
    type Account_All = SObjectRecord<S, 'Account'>;
    type t1 =
      | AssertTrue<IsExact<Account_All['Id'], string>>
      | AssertTrue<IsExact<Account_All['Name'], string>>
      | AssertTrue<IsExact<Account_All['NumberOfEmployees'], number | null>>;
    /* partial */
    type Account = SObjectRecord<S, 'Account', null>;
    type t2 =
      | AssertTrue<Has<Account['Id'], string>>
      | AssertTrue<IsNullable<Account['Id']>>
      | AssertTrue<Has<Account['Name'], string>>
      | AssertTrue<IsNullable<Account['Name']>>
      | AssertTrue<Has<Account['NumberOfEmployees'], number>>
      | AssertTrue<IsNullable<Account['NumberOfEmployees']>>
      | AssertTrue<Has<Account['Parent'], Omit<Account, 'Parent'>>>
      | AssertTrue<IsNullable<Account['Parent']>>;
    const acc: Account = { Id: '000001', Name: 'Account #1' };
    assert.ok(acc.Id != null);
    type Contact = SObjectInputRecord<S, 'Account'>;
    type t3 =
      | AssertTrue<Has<Contact['Id'], string>>
      | AssertTrue<IsNullable<Contact['Id']>>;
    const con: Contact = { Id: '000001', Name: 'Contact #1' };
    assert.ok(con.Id != null);
    type Case = SObjectUpdateRecord<S, 'Case'>;
    type t4 =
      | AssertTrue<IsExact<Case['Id'], string>>
      | AssertTrue<Has<Case['CaseNumber'], string>>
      | AssertTrue<IsNullable<Case['CaseNumber']>>
      | AssertTrue<Has<Case['Subject'], string>>
      | AssertTrue<IsNullable<Case['Subject']>>;
    const cas: Case = { Id: '000001', Subject: 'Case #1' };
    assert.ok(cas.Id != null);
  });

  test('query', async () => {
    const qr = await conn.query('SELECT Id, Name FROM Account');
    type t1 = AssertTrue<Has<typeof qr, { done: boolean; records: Record[] }>>;
    const recs1 = await conn
      .sobject('Account')
      .find({ OwnerId: { $ne: null } })
      .sort('LastModifiedDate', 'DESC')
      .limit(10);
    type Account_All = SObjectRecord<S, 'Account'>;
    type FoundRec1 = typeof recs1[number];
    type t2 = AssertTrue<IsExact<FoundRec1, Account_All>>;

    //
    const recs2 = await conn
      .sobject('Account')
      .find(null, ['Id', 'Name', 'NumberOfEmployees'])
      .sort({ LastActivityDate: 'DESC' })
      .limit(10);
    type FoundRec2 = typeof recs2[number];
    type t3 =
      | AssertTrue<Has<FoundRec2, Record>>
      | AssertTrue<IsExact<FoundRec2['Id'], string>>
      | AssertTrue<IsExact<FoundRec2['Name'], string>>
      | AssertTrue<IsNullable<FoundRec2['NumberOfEmployees']>>
      | AssertTrue<Has<FoundRec2['NumberOfEmployees'], number>>
      | AssertTrue<IsAny<FoundRec2['Industry']>>;

    //
    const rec3 = await conn
      .sobject('Contact')
      .findOne({ Email: 'abc@example.org' });
    type Contact_All = SObjectRecord<S, 'Contact'>;
    type FoundRec3 = typeof rec3;
    type t4 =
      | AssertTrue<IsNullable<FoundRec3>>
      | AssertTrue<Has<FoundRec3, Contact_All>>;

    //
    const rec4 = await conn
      .sobject('Contact')
      .findOne({ Email: 'abc@example.org' }, [
        'Id',
        'LastName',
        'FirstName',
        'Email',
        'MailingAddress',
        'CreatedDate',
      ]);
    type FoundRec4 = NonNullable<typeof rec4>;
    type t5 =
      | AssertTrue<IsNullable<typeof rec4>>
      | AssertTrue<Has<FoundRec4, Record>>
      | AssertTrue<IsExact<FoundRec4['Id'], string>>
      | AssertTrue<IsExact<FoundRec4['LastName'], string>>
      | AssertTrue<IsNullable<FoundRec4['MailingAddress']>>
      | AssertTrue<Has<FoundRec4['MailingAddress'], Address>>
      | AssertTrue<IsExact<FoundRec4['CreatedDate'], DateString>>
      | AssertTrue<IsAny<FoundRec4['CreatedById']>>;

    //
    const recs5 = await conn
      .sobject('Task')
      .select([
        'Id',
        'Subject',
        'ActivityDate',
        'IsClosed',
        { Owner: ['Id', 'Username', 'Email'], What: ['Name'] },
      ])
      .where({ IsClosed: false })
      .limit(10);
    type FoundRec5 = typeof recs5[number];
    type t6 =
      | AssertTrue<Has<FoundRec5, Record>>
      | AssertTrue<IsExact<FoundRec5['Id'], string>>
      | AssertTrue<Has<FoundRec5['Subject'], string>>
      | AssertTrue<IsNullable<FoundRec5['Subject']>>
      | AssertTrue<Has<FoundRec5['ActivityDate'], DateString>>
      | AssertTrue<IsNullable<FoundRec5['ActivityDate']>>
      | AssertTrue<IsExact<FoundRec5['IsClosed'], boolean>>
      | AssertTrue<IsExact<FoundRec5['Owner']['Id'], string>>
      | AssertTrue<Has<FoundRec5['What'], Record>>
      | AssertTrue<IsNullable<FoundRec5['What']>>
      | AssertTrue<IsAny<FoundRec5['Status']>>;

    //
    const recs6 = await conn
      .sobject('Account')
      .find({ Type: ['Customer', 'Partner'] })
      .include('ActivityHistories')
      .select([
        'Id',
        'Subject',
        'ActivityDate',
        'IsClosed',
        { Owner: ['Id', 'Username', 'Email'], What: ['Name'] },
      ])
      .end();
    type FoundRec6 = typeof recs6[number];
    type t7 =
      | AssertTrue<Has<FoundRec6['ActivityHistories'], { totalSize: number }>>
      | AssertTrue<IsNullable<FoundRec6['ActivityHistories']>>;
    type FoundRec6ActivityHistory = NonNullable<
      FoundRec6['ActivityHistories']
    >['records'][number];
    type t8 =
      | AssertTrue<IsExact<FoundRec6ActivityHistory['Id'], string>>
      | AssertTrue<Has<FoundRec6ActivityHistory['Subject'], string>>
      | AssertTrue<IsNullable<FoundRec6ActivityHistory['Subject']>>
      | AssertTrue<Has<FoundRec6ActivityHistory['ActivityDate'], DateString>>
      | AssertTrue<IsNullable<FoundRec6ActivityHistory['ActivityDate']>>
      | AssertTrue<IsExact<FoundRec6ActivityHistory['IsClosed'], boolean>>
      | AssertTrue<Has<FoundRec6ActivityHistory['Owner'], Record>>
      | AssertTrue<IsNullable<FoundRec6ActivityHistory['Owner']>>
      | AssertTrue<Has<FoundRec6ActivityHistory['What'], Record>>
      | AssertTrue<IsNullable<FoundRec6ActivityHistory['What']>>;

    //
    const recs7 = await conn
      .sobject('Account' as string)
      .find<{ Id: string; Name: string }>({ Name: { $like: 'A%' } }, [
        'Id',
        'Name',
        { Owner: ['Id', 'Username'] },
      ]);
    type t9 = AssertTrue<
      IsExact<typeof recs7[number], { Id: string; Name: string }>
    >;

    //
    const cnt = await conn.sobject('Task').count({ IsClosed: false });
    type t10 = AssertTrue<IsExact<typeof cnt, number>>;

    assert.ok(true);
  });
});

/**
 *
 */
afterAll(async () => {
  await connMgr.closeConnection(conn);
});
