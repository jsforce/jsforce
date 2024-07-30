/**
 * @file Salesforce SOAP API
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { registerModule } from '../jsforce';
import Connection from '../connection';
import SOAP from '../soap';
import { Schema, Record, SoapSchemaDef, SoapSchema } from '../types';
import {
  ApiSchemas,
  LeadConvert,
  LeadConvertResult,
  MergeRequest,
  MergeResult,
  EmptyRecycleBinResult,
  UndeleteResult,
  DescribeTabSetResult,
  GetServerTimestampResult,
  GetUserInfoResult,
  ResetPasswordResult,
  SaveResult,
  UpsertResult,
  DeleteResult,
} from './soap/schema';

/**
 *
 */
function toSoapRecord(records: Record | Record[]): Record | Record[] {
  return (Array.isArray(records) ? records : [records]).map((record) => {
    const { type, attributes, ...rec } = record;
    const t = type || attributes?.type;
    if (!t) {
      throw new Error('Given record is not including sObject type information');
    }
    const fieldsToNull = Object.keys(rec).filter(
      (field) => record[field] === null,
    );
    for (const field of fieldsToNull) {
      delete rec[field];
    }
    return fieldsToNull.length > 0
      ? { type: t, fieldsToNull, ...rec }
      : { type: t, ...rec };
  });
}

/**
 * API class for Partner SOAP call
 */
export class SoapApi<S extends Schema> {
  _conn: Connection<S>;

  constructor(conn: Connection<S>) {
    this._conn = conn;
  }

  /**
   * Call SOAP Api (Partner) endpoint
   * @private
   */
  async _invoke(
    method: string,
    message: object,
    schema: SoapSchema | SoapSchemaDef,
  ) {
    const soapEndpoint = new SOAP(this._conn, {
      xmlns: 'urn:partner.soap.sforce.com',
      endpointUrl: `${this._conn.instanceUrl}/services/Soap/u/${this._conn.version}`,
    });
    const res = await soapEndpoint.invoke(
      method,
      message,
      schema ? ({ result: schema } as SoapSchema) : undefined,
      ApiSchemas,
    );
    return res.result;
  }

  /**
   * Converts a Lead into an Account, Contact, or (optionally) an Opportunity.
   */
  convertLead(
    leadConverts: Array<Partial<LeadConvert>>,
  ): Promise<LeadConvertResult[]>;
  convertLead(leadConvert: Partial<LeadConvert>): Promise<LeadConvertResult>;
  convertLead(
    leadConvert: Partial<LeadConvert> | Array<Partial<LeadConvert>>,
  ): Promise<LeadConvertResult | LeadConvertResult[]>;
  async convertLead(
    leadConverts: Partial<LeadConvert> | Array<Partial<LeadConvert>>,
  ) {
    const schema = Array.isArray(leadConverts)
      ? [ApiSchemas.LeadConvertResult]
      : ApiSchemas.LeadConvertResult;
    return this._invoke('convertLead', { leadConverts }, schema);
  }

  /**
   * Merge up to three records into one
   */
  merge(mergeRequests: Array<Partial<MergeRequest>>): Promise<MergeResult[]>;
  merge(mergeRequest: Partial<MergeRequest>): Promise<MergeResult>;
  merge(
    mergeRequest: Partial<MergeRequest> | Array<Partial<MergeRequest>>,
  ): Promise<MergeResult | MergeResult[]>;
  async merge(
    mergeRequests: Partial<MergeRequest> | Array<Partial<MergeRequest>>,
  ) {
    const schema = Array.isArray(mergeRequests)
      ? [ApiSchemas.MergeResult]
      : ApiSchemas.MergeResult;
    return this._invoke('merge', { mergeRequests }, schema);
  }

  /**
   * Delete records from the recycle bin immediately
   */
  async emptyRecycleBin(ids: string[]): Promise<EmptyRecycleBinResult> {
    return this._invoke('emptyRecycleBin', { ids }, [
      ApiSchemas.EmptyRecycleBinResult,
    ]);
  }

  /**
   * Returns information about the standard and custom apps available to the logged-in user
   */
  async describeTabs(): Promise<DescribeTabSetResult[]> {
    return this._invoke('describeTabs', {}, [ApiSchemas.DescribeTabSetResult]);
  }

  /**
   * Retrieves the current system timestamp (Coordinated Universal Time (UTC) time zone) from the API
   */
  async getServerTimestamp(): Promise<GetServerTimestampResult> {
    return this._invoke(
      'getServerTimestamp',
      {},
      ApiSchemas.GetServerTimestampResult,
    );
  }

  /**
   * Retrieves personal information for the user associated with the current session
   */
  async getUserInfo(): Promise<GetUserInfoResult> {
    return this._invoke('getUserInfo', {}, ApiSchemas.GetUserInfoResult);
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
      ApiSchemas.ResetPasswordResult,
    );
  }

  /**
   * Adds one or more new records to your organization’s data
   */
  create(sObject: Record[]): Promise<SaveResult[]>;
  create(sObject: Record): Promise<SaveResult>;
  create(sObjects: Record | Record[]): Promise<SaveResult | SaveResult[]>;
  create(sObjects: Record | Record[]) {
    const schema = Array.isArray(sObjects)
      ? [ApiSchemas.SaveResult]
      : ApiSchemas.SaveResult;
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
  update(sObject: Record[]): Promise<SaveResult[]>;
  update(sObject: Record): Promise<SaveResult>;
  update(sObjects: Record | Record[]): Promise<SaveResult | SaveResult[]>;
  update(sObjects: Record | Record[]) {
    const schema = Array.isArray(sObjects)
      ? [ApiSchemas.SaveResult]
      : ApiSchemas.SaveResult;
    const args = {
      '@xmlns': 'urn:partner.soap.sforce.com',
      '@xmlns:ns1': 'sobject.partner.soap.sforce.com',
      'ns1:sObjects': toSoapRecord(sObjects),
    };
    return this._invoke('update', args, schema);
  }

  /**
   * Creates new records and updates existing records in your organization’s data.
   */
  upsert(
    externalIdFieldName: string,
    sObjects: Record[],
  ): Promise<UpsertResult[]>;
  upsert(externalIdFieldName: string, sObject: Record): Promise<UpsertResult>;
  upsert(
    externalIdFieldName: string,
    sObjects: Record | Record[],
  ): Promise<UpsertResult | UpsertResult[]>;
  upsert(externalIdFieldName: string, sObjects: Record | Record[]) {
    const schema = Array.isArray(sObjects)
      ? [ApiSchemas.UpsertResult]
      : ApiSchemas.UpsertResult;
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
   */
  delete(ids: string | string[]): Promise<DeleteResult[]>;
  delete(id: string): Promise<DeleteResult>;
  delete(ids: string | string[]): Promise<DeleteResult | DeleteResult[]>;
  delete(ids: string | string[]) {
    const schema = Array.isArray(ids)
      ? [ApiSchemas.DeleteResult]
      : ApiSchemas.DeleteResult;
    const args = {
      '@xmlns': 'urn:partner.soap.sforce.com',
      '@xmlns:ns1': 'sobject.partner.soap.sforce.com',
      'ns1:ids': ids,
    };
    return this._invoke('delete', args, schema);
  }

  /**
   * Undelete records from the recycle bin immediately
   */
  undelete(ids: string[]): Promise<UndeleteResult[]> {
    const schema = [ApiSchemas.UndeleteResult];
    const args = {
      '@xmlns': 'urn:partner.soap.sforce.com',
      '@xmlns:ns1': 'sobject.partner.soap.sforce.com',
      'ns1:ids': ids,
    };
    return this._invoke('undelete', args, schema);
  }
}

/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
registerModule('soap', (conn) => new SoapApi(conn));

export default SoapApi;
