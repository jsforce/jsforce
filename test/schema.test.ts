import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import type {
  AssertTrue,
  Has,
  IsNullable,
  IsExact,
  IsAny,
} from 'conditional-type-checks';
import type {
  Record,
  Schema,
  StandardSchema,
  SObjectRecord,
  SObjectInputRecord,
  SObjectUpdateRecord,
  DateString,
  Address,
} from 'jsforce';

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

  it('should record', () => {
    type Account = SObjectRecord<S, 'Account'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t1 = AssertTrue<Has<Account['Id'], string>>;
    const acc: Account = { Id: '000001', Name: 'Account #1' };
    assert.ok(acc.Id != null);
    type Contact = SObjectInputRecord<S, 'Account'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t2 = AssertTrue<Has<Contact['Id'], string>>;
    const con: Contact = { Id: '000001', Name: 'Contact #1' };
    assert.ok(con.Id != null);
    type Case = SObjectUpdateRecord<S, 'Case'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t3 = AssertTrue<IsExact<Case['Id'], string>>;
    const cas: Case = { Id: '000001', Subject: 'Case #1' };
    assert.ok(cas.Id != null);
  });

  it('should connection CRUD', () => {
    assert.ok(true);
  });
});

/**
 *
 */
describe('standard schema', () => {
  type S = StandardSchema;

  it('should record', () => {
    type Account_All = SObjectRecord<S, 'Account'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t1 = AssertTrue<IsExact<Account_All['Id'], string>>;
    /* partial */
    type Account = SObjectRecord<S, 'Account', null>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t2 = AssertTrue<Has<Account['Id'], string>>;
    // @ts-expect-error to get test condition
    const acc: Account = { Id: '000001', Name: 'Account #1' };
    assert.ok(acc.Id != null);
    type Contact = SObjectInputRecord<S, 'Account'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t3 = AssertTrue<Has<Contact['Id'], string>>;
    const con: Contact = { Id: '000001', Name: 'Contact #1' };
    assert.ok(con.Id != null);
    type Case = SObjectUpdateRecord<S, 'Case'>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t4 = AssertTrue<IsExact<Case['Id'], string>>;
    const cas: Case = { Id: '000001', Subject: 'Case #1' };
    assert.ok(cas.Id != null);
  });

  it('should query', async () => {
    const qr = await conn.query('SELECT Id, Name FROM Account');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t1 = AssertTrue<Has<typeof qr, { done: boolean; records: Record[] }>>;
    const recs1 = await conn
      .sobject('Account')
      .find({ OwnerId: { $ne: null } })
      .sort('LastModifiedDate', 'DESC')
      .limit(10);
    type Account_All = SObjectRecord<S, 'Account'>;
    type FoundRec1 = typeof recs1[number];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t2 = AssertTrue<IsExact<FoundRec1, Account_All>>;

    //
    const recs2 = await conn
      .sobject('Account')
      .find(null, ['Id', 'Name', 'NumberOfEmployees'])
      .sort({ LastActivityDate: 'DESC' })
      .limit(10);
    type FoundRec2 = typeof recs2[number];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t3 = AssertTrue<Has<FoundRec2, Record>>;

    //
    const rec3 = await conn
      .sobject('Contact')
      .findOne({ Email: 'abc@example.org' });
    type Contact_All = SObjectRecord<S, 'Contact'>;
    type FoundRec3 = typeof rec3;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t4 = AssertTrue<IsNullable<FoundRec3>>;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t5 = AssertTrue<IsNullable<typeof rec4>>;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t6 = AssertTrue<Has<FoundRec5, Record>>;

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t7 = AssertTrue<
      Has<FoundRec6['ActivityHistories'], { totalSize: number }>
    >;
    type FoundRec6ActivityHistory = NonNullable<
      FoundRec6['ActivityHistories']
    >['records'][number];
    // @ts-expect-error to get test condition
    type t8 = AssertTrue<IsExact<FoundRec6ActivityHistory['Id'], string>>;

    const recs7 = await conn
      .sobject('Account' as string)
      .find<{ Id: string; Name: string }>({ Name: { $like: 'A%' } }, [
        'Id',
        'Name',
        { Owner: ['Id', 'Username'] },
      ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t9 = AssertTrue<
      IsExact<typeof recs7[number], { Id: string; Name: string }>
    >;

    //
    const cnt = await conn.sobject('Task').count({ IsClosed: false });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type t10 = AssertTrue<IsExact<typeof cnt, number>>;

    assert.ok(true);
  });
});
