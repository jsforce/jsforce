import { Record } from './type';

/**
 *
 */
export type DateString = string & { __DateBrand: never };

export interface SObjectDefinition {
  Fields: { [name: string]: number | boolean | DateString | string | null };
  ParentReferences: { [name: string]: SObjectDefinition | null };
  ChildRelationships: {
    [name: string]: SObjectDefinition;
  };
}

type RecordFields<
  SO extends SObjectDefinition,
  IsPartial extends boolean = false
> = Record & IsPartial extends true ? Partial<SO['Fields']> : SO['Fields'];

type RecordObject<
  SO extends SObjectDefinition,
  IsPartial extends boolean = false,
  PSOR extends SObjectDefinition['ParentReferences'] = SO['ParentReferences']
> = RecordFields<SO, IsPartial> &
  {
    [K in StringKeys<PSOR>]: PSOR[K] extends SObjectDefinition
      ? RecordObject<PSOR[K], IsPartial>
      : null;
  };

type RootRecordObject<
  SO extends SObjectDefinition,
  IsPartial extends boolean = false,
  CSOR extends SObjectDefinition['ChildRelationships'] = SO['ChildRelationships']
> = RecordObject<SO, IsPartial> &
  {
    [K in StringKeys<CSOR>]: ChildRelationObject<CSOR[K], IsPartial>;
  };

type ChildRelationObject<
  CO extends SObjectDefinition,
  IsPartial extends boolean = false
> = {
  totalSize: number;
  done: boolean;
  records: RecordObject<CO, IsPartial>[];
} | null;

export type StringKeys<O, K = keyof O> = K extends string ? K : never;

export type NonNullableMap<M extends {}> = {
  [K in keyof M]: NonNullable<M[K]>;
};

export type FieldProjectionConfigObject = {
  [name: string]: 1 | true | FieldProjectionConfig | undefined;
};

export type FieldProjectionConfig = string | null | FieldProjectionConfigObject;

export type PickIfMatch<
  O extends { [name: string]: any },
  P extends string
> = Pick<O, Extract<P, keyof O>>;

type RecordFieldProjectionForAsterOrNull<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCAN extends '*' | null
> = FPCAN[] extends never[]
  ? {}
  : FPCAN extends '*'
  ? RecordFields<SO>
  : RootRecordObject<SO, true>;

type RecordFieldProjectionForString<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCS extends string
> = FPCS[] extends never[] ? {} : PickIfMatch<RecordFields<SO>, FPCS>;

type RecordReferenceProjection<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCO extends FieldProjectionConfigObject,
  FK extends StringKeys<FPCO>,
  PK extends StringKeys<SO['ParentReferences']>,
  PSOR extends SO['ParentReferences'] = SO['ParentReferences'],
  PSO extends SObjectDefinition = Extract<PSOR[PK], SObjectDefinition>,
  FPCOFK extends FieldProjectionConfig = Extract<
    FPCO[FK],
    FieldProjectionConfig
  >
> =
  | RecordFieldProjection<S, PSO, FPCOFK>
  | (null extends PSOR[PK] ? null : never);

type RecordFieldProjectionForObjectConfig<
  S extends Schema,
  SO extends SObjectDefinition,
  FPCO extends FieldProjectionConfigObject
> = FPCO[] extends never[]
  ? {}
  : {
      [FK in StringKeys<FPCO>]: FK extends StringKeys<RecordFields<SO>>
        ? RecordFields<SO>[FK]
        : FK extends StringKeys<SO['ParentReferences']>
        ? RecordReferenceProjection<S, SO, FPCO, FK, FK>
        : never;
    };

type RecordFieldProjection<
  S extends Schema,
  SO extends SObjectDefinition,
  FPC extends FieldProjectionConfig,
  FPCALL extends FieldProjectionConfig = FieldPathScopedProjection<
    SO,
    FieldPath<SO>
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
  ? RecordFieldProjection<S, S['SObjects'][N], FPC> & Record
  : Option['Extend'] extends true
  ? RecordFieldProjection<S, S['SObjects'][N], FPC> & Record & R
  : R;

type FieldPath_3<SO extends SObjectDefinition> =
  | '*'
  | StringKeys<SO['Fields']>[];

type FieldPath_2<
  SO extends SObjectDefinition,
  PSOR extends SO['ParentReferences'] = SO['ParentReferences']
> =
  | '*'
  | StringKeys<SO['Fields']>
  | {
      [K in StringKeys<PSOR>]?:
        | '*'
        | FieldPath_3<Extract<PSOR[K], SObjectDefinition>>[];
    };

type FieldPath_1<
  SO extends SObjectDefinition,
  PSOR extends SO['ParentReferences'] = SO['ParentReferences']
> =
  | '*'
  | StringKeys<SO['Fields']>
  | {
      [K in StringKeys<PSOR>]?:
        | '*'
        | FieldPath_2<Extract<PSOR[K], SObjectDefinition>>[];
    };

export type FieldPath<
  SO extends SObjectDefinition,
  PSOR extends SO['ParentReferences'] = SO['ParentReferences']
> =
  | '*'
  | StringKeys<SO['Fields']>
  | {
      [K in StringKeys<PSOR>]?:
        | '*'
        | FieldPath_1<Extract<PSOR[K], SObjectDefinition>>[];
    };

export type FieldPathScopedProjection<
  SO extends SObjectDefinition,
  FP extends FieldPath<SO>
> = FP extends { [name: string]: any }
  ? {
      [K in StringKeys<FP>]: FP[K] extends '*'
        ? '*'
        : FP[K] extends Array<infer U>
        ? U extends FieldProjectionConfig
          ? U
          : never
        : never;
    }
  : FP extends string
  ? FP
  : never;

export interface Schema {
  SObjects: {
    [name: string]: SObjectDefinition;
  };
}

export type SObjectNames<S extends Schema> = StringKeys<S['SObjects']>;
