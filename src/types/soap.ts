/**
 *
 */
export type NillableElem<T> = T & { _nillable: never };

type IsNillableElem<T> = T extends { _nillable: never } ? true : false;

type NonNillableElem<T> = T extends infer U & { _nillable: never } ? U : T;

export type SoapSchemaDef =
  | { [key: string]: SoapSchemaDef }
  | Array<SoapSchemaDef>
  | ReadonlyArray<SoapSchemaDef>
  | 'string'
  | 'number'
  | 'boolean'
  | 'any'
  | '?string'
  | '?number'
  | '?boolean'
  | '?any'
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
> = [UK] extends [never]
  ? T
  : [RK] extends [never]
  ? Partial<T>
  : Partial<Pick<T, UK>> & Pick<T, RK>;

export type SoapSchemaType<T extends SoapSchemaDef> = IsNillableElem<
  T
> extends true
  ? SoapSchemaTypeInternal<NonNillableElem<T>> | null | undefined
  : SoapSchemaTypeInternal<T>;

type SoapSchemaTypeInternal<T extends SoapSchemaDef> = T extends readonly [any]
  ? Array<SoapSchemaType<T[number]>>
  : T extends readonly any[]
  ? Array<SoapSchemaType<T[number]>>
  : T extends { [key: string]: any }
  ? PartialForUndefined<
      {
        [K in keyof T]: SoapSchemaType<T[K]>;
      }
    >
  : T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'any'
  ? any
  : T extends '?string'
  ? string | null | undefined
  : T extends '?number'
  ? number | null | undefined
  : T extends '?boolean'
  ? boolean | null | undefined
  : T extends '?any'
  ? any | null | undefined
  : T extends null
  ? null
  : never;
