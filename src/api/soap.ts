/**
 * @file Salesforce SOAP API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { registerModule } from '../jsforce';
import Connection from '../connection';
import SOAP from '../soap';
import { Schema, SaveResult, Record } from '../types';

/**
 *
 */
type Nillable<T> = T & { _nillable: never };

type IsNillable<T> = T extends { _nillable: never } ? true : false;

type NonNillable<T> = T extends infer U & { _nillable: never } ? U : T;

type ApiSchemaDef =
  | { [key: string]: ApiSchemaDef }
  | Array<ApiSchemaDef>
  | ReadonlyArray<ApiSchemaDef>
  | 'string'
  | 'number'
  | 'boolean'
  | null;

type UndefKey<T extends {}, K extends keyof T = keyof T> = K extends keyof T
  ? undefined extends T[K]
    ? K
    : never
  : never;

type PartialForUndefined<
  T extends {},
  UK extends keyof T = UndefKey<T>,
  RK extends keyof T = Exclude<keyof T, UK>
> = Partial<Pick<T, UK>> & Pick<T, RK>;

type ApiSchemaType<T extends ApiSchemaDef> = IsNillable<T> extends true
  ? ApiSchemaTypeInternal<NonNillable<T>> | null | undefined
  : ApiSchemaTypeInternal<T>;

type ApiSchemaTypeInternal<T extends ApiSchemaDef> = T extends readonly [any]
  ? Array<ApiSchemaType<T[number]>>
  : T extends readonly any[]
  ? Array<ApiSchemaType<T[number]>>
  : T extends { [key: string]: ApiSchemaDef }
  ? PartialForUndefined<
      {
        [K in keyof T]: ApiSchemaType<T[K]>;
      }
    >
  : T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends null
  ? null
  : never;

/**
 *
 */
function nillable<T>(v: T): Nillable<T> {
  return v as Nillable<T>;
}

const SoapApiError = {
  message: 'string',
} as const;

const SoapApiSchemas = {
  LeadConvert: {
    convertedStatus: 'string',
    leadId: 'string',
    accountId: nillable('string'),
    contactId: nillable('string'),
    doNotCreateOpportunity: nillable('boolean'),
    opportunityName: nillable('string'),
    ownerId: nillable('string'),
    sendNotificationEmail: nillable('boolean'),
  },
  LeadConvertResult: {
    success: 'boolean',
    errors: [SoapApiError],
    leadId: nillable('string'),
    accountId: nillable('string'),
    contactId: nillable('string'),
    opportunityId: nillable('string'),
  },
  MergeRequest: {
    masterRecord: {},
    recordToMergeIds: ['string'],
  },
  MergeResult: {
    success: 'boolean',
    errors: [SoapApiError],
    id: nillable('string'),
    mergedRecordIds: ['string'],
    updatedRelatedIds: ['string'],
  },
  EmptyRecycleBinResult: {
    success: 'boolean',
    errors: [SoapApiError],
    id: nillable('string'),
  },
  DescribeTabSetResult: {
    label: 'string',
    logoUrl: 'string',
    namespace: nillable('string'),
    selected: 'boolean',
    tabSetId: 'string',
    tabs: [
      {
        colors: [
          {
            theme: 'string',
            color: 'string',
            context: 'string',
          },
        ],
        iconUrl: 'string',
        icons: [
          {
            theme: 'string',
            height: nillable('number'),
            width: nillable('number'),
            url: 'string',
            contentType: 'string',
          },
        ],
        label: 'string',
        custom: 'boolean',
        miniIconUrl: 'string',
        name: 'string',
        sobjectName: nillable('string'),
        url: 'string',
      },
    ],
  },
  GetUserInfoResult: {
    accessibilityMode: 'boolean',
    chatterExternal: 'boolean',
    currencySymbol: nillable('string'),
    orgAttachmentFileSizeLimit: 'number',
    orgDefaultCurrencyIsoCode: nillable('string'),
    orgDisallowHtmlAttachments: nillable('boolean'),
    orgHasPersonAccounts: 'boolean',
    organizationId: 'string',
    organizationMultiCurrency: 'boolean',
    organizationName: 'string',
    profileId: 'string',
    roleId: nillable('string'),
    sessionSecondsValid: 'number',
    userDefaultCurrencyIsoCode: nillable('string'),
    userEmail: 'string',
    userFullName: 'string',
    userId: 'string',
    userLanguage: 'string',
    userLocale: 'string',
    userName: 'string',
    userTimeZone: 'string',
    userType: 'string',
    userUiSkin: 'string',
  },
  GetServerTimestampResult: {
    timestamp: 'string',
  },
  ResetPasswordResult: {
    password: 'string',
  },
  SaveResult: {
    success: 'boolean',
    errors: [SoapApiError],
    id: nillable('string'),
  },
  UpsertResult: {
    success: 'boolean',
    errors: [SoapApiError],
    created: 'boolean',
    id: nillable('string'),
  },
  DeleteResult: {
    success: 'boolean',
    errors: [SoapApiError],
    id: nillable('string'),
  },
} as const;

type LeadConvert = ApiSchemaType<typeof SoapApiSchemas.LeadConvert>;

type LeadConvertResult = ApiSchemaType<typeof SoapApiSchemas.LeadConvertResult>;

type MergeRequest = ApiSchemaType<typeof SoapApiSchemas.MergeRequest>;

type MergeResult = ApiSchemaType<typeof SoapApiSchemas.MergeResult>;

type EmptyRecycleBinResult = ApiSchemaType<
  typeof SoapApiSchemas.EmptyRecycleBinResult
>;

type DescribeTabSetResult = ApiSchemaType<
  typeof SoapApiSchemas.DescribeTabSetResult
>;

type GetServerTimestampResult = ApiSchemaType<
  typeof SoapApiSchemas.GetServerTimestampResult
>;

type GetUserInfoResult = ApiSchemaType<typeof SoapApiSchemas.GetUserInfoResult>;

type ResetPasswordResult = ApiSchemaType<
  typeof SoapApiSchemas.ResetPasswordResult
>;

function toSoapRecord(records: Record | Record[]): Record | Record[] {
  return (Array.isArray(records) ? records : [records]).map((record) => {
    const { type, attributes, ...rec } = record;
    const t = type || attributes?.type;
    if (t) {
      return { type: t, ...rec };
    } else {
      return record;
    }
  });
}

/**
 * API class for Partner SOAP call
 */
export default class SoapApi<S extends Schema> {
  _conn: Connection<S>;

  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * Call SOAP Api (Partner) endpoint
   * @private
   */
  async _invoke(method: string, message: object, schema: ApiSchemaDef) {
    const soapEndpoint = new SOAP(this._conn, {
      xmlns: 'urn:partner.soap.sforce.com',
      endpointUrl: `${this._conn.instanceUrl}/services/Soap/u/${this._conn.version}`,
    });
    const res = await soapEndpoint.invoke(method, message, { result: schema });
    return res.result;
  }

  /**
   * Converts a Lead into an Account, Contact, or (optionally) an Opportunity.
   */
  convertLead(leadConvert: LeadConvert): Promise<LeadConvertResult>;
  convertLead(leadConverts: LeadConvert[]): Promise<LeadConvertResult[]>;
  async convertLead(leadConverts: LeadConvert | LeadConvert[]) {
    const schema = Array.isArray(leadConverts)
      ? [SoapApiSchemas.LeadConvertResult]
      : SoapApiSchemas.LeadConvertResult;
    return this._invoke('convertLead', { leadConverts }, schema);
  }

  /**
   * Merge up to three records into one
   */
  merge(mergeRequest: MergeRequest): Promise<MergeResult>;
  merge(mergeRequests: MergeRequest[]): Promise<MergeResult[]>;
  async merge(mergeRequests: MergeRequest | MergeRequest[]) {
    const schema = Array.isArray(mergeRequests)
      ? [SoapApiSchemas.MergeResult]
      : SoapApiSchemas.MergeResult;
    return this._invoke('merge', { mergeRequests }, schema);
  }

  /**
   * Delete records from the recycle bin immediately
   */
  async emptyRecycleBin(ids: string[]): Promise<EmptyRecycleBinResult> {
    return this._invoke('emptyRecycleBin', { ids }, [
      SoapApiSchemas.EmptyRecycleBinResult,
    ]);
  }

  /**
   * Returns information about the standard and custom apps available to the logged-in user
   */
  async describeTabs(): Promise<DescribeTabSetResult[]> {
    return this._invoke('describeTabs', {}, [
      SoapApiSchemas.DescribeTabSetResult,
    ]);
  }

  /**
   * Retrieves the current system timestamp (Coordinated Universal Time (UTC) time zone) from the API
   */
  async getServerTimestamp(): Promise<GetServerTimestampResult> {
    return this._invoke(
      'getServerTimestamp',
      {},
      SoapApiSchemas.GetServerTimestampResult,
    );
  }

  /**
   * Retrieves personal information for the user associated with the current session
   */
  async getUserInfo(): Promise<GetUserInfoResult> {
    return this._invoke('getUserInfo', {}, SoapApiSchemas.GetUserInfoResult);
  }

  /**
   * Sets the specified user’s password to the specified value
   */
  setPassword(userId: string, password: string): Promise<string> {
    return this._invoke('setPassword', { userId, password }, 'string');
  }

  /**
   * Resets the specified user’s password
   */
  resetPassword(userId: string): Promise<ResetPasswordResult> {
    return this._invoke(
      'resetPassword',
      { userId },
      SoapApiSchemas.ResetPasswordResult,
    );
  }

  /**
   * Adds one or more new records to your organization’s data
   */
  create(sObject: Record): Promise<SaveResult>;
  create(sObject: Record[]): Promise<SaveResult[]>;
  async create(
    sObjects: Record | Record[],
  ): Promise<SaveResult | SaveResult[]> {
    const schema = Array.isArray(sObjects)
      ? [SoapApiSchemas.SaveResult]
      : SoapApiSchemas.SaveResult;
    const args = {
      '@xmlns': 'urn:partner.soap.sforce.com',
      '@xmlns:ns1': 'sobject.partner.soap.sforce.com',
      'ns1:sObjects': toSoapRecord(sObjects),
    };
    return this._invoke('create', args, schema);
  }

  /**
   * Updates one or more existing records in your organization’s data.
   */
  update(sObject: Record): Promise<SaveResult>;
  update(sObject: Record[]): Promise<SaveResult[]>;
  async update(
    sObjects: Record | Record[],
  ): Promise<SaveResult | SaveResult[]> {
    const schema = Array.isArray(sObjects)
      ? [SoapApiSchemas.SaveResult]
      : SoapApiSchemas.SaveResult;
    const args = {
      '@xmlns': 'urn:partner.soap.sforce.com',
      '@xmlns:ns1': 'sobject.partner.soap.sforce.com',
      'ns1:sObjects': toSoapRecord(sObjects),
    };
    return this._invoke('update', args, schema);
  }

  /**
   * Creates new records and updates existing records in your organization’s data.
   *
   * @param {Array.<Object>} sObjects - Records to upsert
   * @param {Callback.<SoapApi~UpsertResult>} [callback] - Callback function
   * @returns {Promise.<SoapApi~UpsertResult>}
   */
  upsert(
    externalIdFieldName: string,
    sObjects: Record | Record[],
  ): Promise<SaveResult | SaveResult[]> {
    const schema = Array.isArray(sObjects)
      ? [SoapApiSchemas.UpsertResult]
      : SoapApiSchemas.UpsertResult;
    const args = {
      '@xmlns': 'urn:partner.soap.sforce.com',
      '@xmlns:ns1': 'sobject.partner.soap.sforce.com',
      'ns1:externalIDFieldName': externalIdFieldName,
      'ns1:sObjects': toSoapRecord(sObjects),
    };
    return this._invoke('upsert', args, schema);
  }

  /**
   * Deletes one or more records from your organization’s data
   *
   * @param {Array.<Object>} ids - Id of records to delete
   * @param {Callback.<SoapApi~DeleteResult>} [callback] - Callback function
   * @returns {Promise.<SoapApi~DeleteResult>}
   */
  delete(ids: string | string[]) {
    const schema = Array.isArray(ids)
      ? [SoapApiSchemas.DeleteResult]
      : SoapApiSchemas.DeleteResult;
    const args = {
      '@xmlns': 'urn:partner.soap.sforce.com',
      '@xmlns:ns1': 'sobject.partner.soap.sforce.com',
      'ns1:ids': ids,
    };
    return this._invoke('delete', args, schema);
  }
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('soap', (conn) => new SoapApi(conn));
