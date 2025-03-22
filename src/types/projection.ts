import { SObjectDefinition, Schema } from './schema';
import { StringKeys } from './util';

/**
 *
 */
type FieldPath_3<SO extends SObjectDefinition> =
  | '*'
  | Array<StringKeys<SO['Fields']>>;

type FieldPath_2<
  SO extends SObjectDefinition,
  PSOR extends SO['ParentReferences'] = SO['ParentReferences']
> =
  | '*'
  | StringKeys<SO['Fields']>
  | {
      [K in StringKeys<PSOR>]?:
        | '*'
        | Array<FieldPath_3<Extract<PSOR[K], SObjectDefinition>>>;
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
        | Array<FieldPath_2<Extract<PSOR[K], SObjectDefinition>>>;
    };

type FieldPathSpecifier_<
  S extends Schema,
  N extends string,
  SO extends SObjectDefinition = S['SObjects'][N],
  PSOR extends SO['ParentReferences'] = SO['ParentReferences']
> =
  | '*'
  | StringKeys<SO['Fields']>
  | {
      [K in StringKeys<PSOR>]?:
        | '*'
        | Array<FieldPath_1<Extract<PSOR[K], SObjectDefinition>>>;
    };

export type FieldPathSpecifier<
  S extends Schema,
  N extends string
> = FieldPathSpecifier_<S, N>;

export type FieldProjectionConfigObject = {
  [name: string]: 1 | true | FieldProjectionConfig | undefined;
};

export type FieldProjectionConfig = string | null | FieldProjectionConfigObject;

export type FieldPathScopedProjection<
  S extends Schema,
  N extends string,
  FPS extends FieldPathSpecifier<S, N>
> = FPS extends { [name: string]: any }
  ? {
      [K in StringKeys<FPS>]: FPS[K] extends '*'
        ? '*'
        : FPS[K] extends Array<infer U>
        ? U extends FieldProjectionConfig
          ? U
          : never
        : never;
    }
  : FPS extends string
  ? FPS
  : never;
