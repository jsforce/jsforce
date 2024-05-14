import { StringKeys } from './util';

/**
 *
 */
export type DateString = string & { __DateBrand: never };

export type BlobString = string & { __BlobBrand: never };

export type Address = {
  city: string | null;
  country: string | null;
  geocodeAccuracy: string | null;
  latitude: number | null;
  longitude: number | null;
  postalCode: string | null;
  state: string | null;
  street: string | null;
};

export type SObjectFieldType =
  | number
  | boolean
  | DateString
  | BlobString
  | string
  | Address;

export type SObjectDefinition<N extends string = string> = {
  Name: N;
  Fields: { [name: string]: SObjectFieldType | null };
  ParentReferences: { [name: string]: SObjectDefinition | null };
  ChildRelationships: { [name: string]: SObjectDefinition };
}

export type Schema = {
  SObjects: { [name: string]: SObjectDefinition };
}

/**
 *
 */
export type SObjectNames<S extends Schema> = StringKeys<S['SObjects']>;

export type SObjectFieldNames<
  S extends Schema,
  N extends SObjectNames<S>
> = StringKeys<S['SObjects'][N]['Fields']>;

export type ParentReferenceNames<
  S extends Schema,
  N extends SObjectNames<S>
> = StringKeys<S['SObjects'][N]['ParentReferences']>;

type ParentReferenceSObjectName_<
  S extends Schema,
  N extends SObjectNames<S>,
  PRN extends ParentReferenceNames<S, N>,
  PSO extends SObjectDefinition = NonNullable<
    S['SObjects'][N]['ParentReferences'][PRN]
  >,
  SK extends keyof S['SObjects'] = keyof S['SObjects']
> = Extract<SK extends PSO['Name'] ? SK : never, string>;

export type ParentReferenceSObjectName<
  S extends Schema,
  N extends SObjectNames<S>,
  PRN extends ParentReferenceNames<S, N>
> = ParentReferenceSObjectName_<S, N, PRN>;

export type ChildRelationshipNames<
  S extends Schema,
  N extends SObjectNames<S>
> = StringKeys<S['SObjects'][N]['ChildRelationships']>;

type ChildRelationshipSObjectName_<
  S extends Schema,
  N extends SObjectNames<S>,
  CRN extends ChildRelationshipNames<S, N>,
  CSO extends SObjectDefinition = S['SObjects'][N]['ChildRelationships'][CRN],
  SK extends keyof S['SObjects'] = keyof S['SObjects']
> = Extract<SK extends CSO['Name'] ? SK : never, string>;

export type ChildRelationshipSObjectName<
  S extends Schema,
  N extends SObjectNames<S>,
  CRN extends ChildRelationshipNames<S, N>
> = ChildRelationshipSObjectName_<S, N, CRN>;
