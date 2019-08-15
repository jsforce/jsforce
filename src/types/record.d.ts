import { Record } from './type';
import {
  Schema,
  SObjectDefinition,
  ParentReferenceSObjectName,
  SObjectNames,
  ParentReferenceNames,
} from './schema';
import {
  FieldProjectionConfig,
  FieldPathScopedProjection,
  FieldPathSpecifier,
  FieldProjectionConfigObject,
} from './projection';
import { StringKeys, PickIfMatch } from './util';

/**
 *
 */
type RecordWithFields<
  SO extends SObjectDefinition,
  IsPartial extends boolean = false
> = Record & IsPartial extends true ? Partial<SO['Fields']> : SO['Fields'];

type RecordWithParentRefs<
  SO extends SObjectDefinition,
  IsPartial extends boolean = false,
  PSOR extends SObjectDefinition['ParentReferences'] = SO['ParentReferences']
> = RecordWithFields<SO, IsPartial> &
  {
    [K in StringKeys<PSOR>]: PSOR[K] extends SObjectDefinition
      ? RecordWithParentRefs<PSOR[K], IsPartial>
      : null;
  };

type RecordWithChildRelations<
  SO extends SObjectDefinition,
  IsPartial extends boolean = false,
  CSOR extends SObjectDefinition['ChildRelationships'] = SO['ChildRelationships']
> = RecordWithParentRefs<SO, IsPartial> &
  {
    [K in StringKeys<CSOR>]: ChildRelationObject<CSOR[K], IsPartial> | null;
  };

type ChildRelationObject<
  CO extends SObjectDefinition,
  IsPartial extends boolean = false
> = {
  totalSize: number;
  done: boolean;
  records: RecordWithParentRefs<CO, IsPartial>[];
};

/**
 *
 */
type RecordFieldProjectionForAsterOrNull<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCAN extends '*' | null
> = FPCAN[] extends never[]
  ? {}
  : FPCAN extends '*'
  ? RecordWithFields<SO>
  : RecordWithChildRelations<SO, true>;

type RecordFieldProjectionForString<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCS extends string
> = FPCS[] extends never[] ? {} : PickIfMatch<RecordWithFields<SO>, FPCS>;

type RecordReferenceProjection<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCO extends FieldProjectionConfigObject,
  FK extends StringKeys<FPCO>,
  PRN extends ParentReferenceNames<S, N>,
  N extends SObjectNames<S> = Extract<SObjectNames<S>, SO['Name']>,
  PN extends SObjectNames<S> = ParentReferenceSObjectName<S, N, PRN>,
  PSO extends SObjectDefinition | null = SO['ParentReferences'][PRN],
  FPCOFK extends FieldProjectionConfig = Extract<
    FPCO[FK],
    FieldProjectionConfig
  >
> = RecordFieldProjection<S, PN, FPCOFK> | (null extends PSO ? null : never);

type RecordFieldProjectionForObjectConfig<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCO extends FieldProjectionConfigObject
> = FPCO[] extends never[]
  ? {}
  : {
      [FK in StringKeys<FPCO>]: FK extends StringKeys<RecordWithFields<SO>>
        ? RecordWithFields<SO>[FK]
        : FK extends StringKeys<SO['ParentReferences']>
        ? RecordReferenceProjection<S, SO, FPCO, FK, FK>
        : never;
    };

type RecordFieldProjection<
  S extends Schema,
  N extends string,
  FPC extends FieldProjectionConfig,
  SO extends SObjectDefinition = S['SObjects'][N],
  FPCALL extends FieldProjectionConfig = FieldPathScopedProjection<
    S,
    N,
    FieldPathSpecifier<S, N>
  >,
  FPCAN extends '*' | null = Extract<FPC, '*' | null>,
  FPCS extends string = Exclude<Extract<FPC, string>, '*'>,
  FPCO extends Exclude<FPC, string | null> = Exclude<FPC, string | null>
> = FPCALL[] extends FPC[]
  ? RecordFieldProjectionForAsterOrNull<S, SO, null>
  : RecordFieldProjectionForAsterOrNull<S, SO, FPCAN> &
      RecordFieldProjectionForString<S, SO, FPCS> &
      RecordFieldProjectionForObjectConfig<S, SO, FPCO>;

export type SObjectRecord<
  S extends Schema,
  N extends string,
  FPC extends FieldProjectionConfig = '*',
  R extends Record = Record,
  Option extends Partial<{ Extend: boolean }> = {}
> = Record extends R
  ? RecordFieldProjection<S, N, FPC> & Record
  : Option['Extend'] extends true
  ? RecordFieldProjection<S, N, FPC> & Record & R
  : R;

export type SObjectInputRecord<S extends Schema, N extends string> = Partial<
  SObjectRecord<S, N>
>;

export type SObjectUpdateRecord<
  S extends Schema,
  N extends string
> = SObjectInputRecord<S, N> & { Id: string };
