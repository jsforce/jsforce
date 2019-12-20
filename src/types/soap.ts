/**
 *
 */
export type SoapSchemaDef =
  | readonly ['?', SoapSchemaDef]
  | readonly [SoapSchemaDef]
  | readonly SoapSchemaDef[]
  | { readonly '?': { readonly [key: string]: SoapSchemaDef } }
  | { readonly [key: string]: SoapSchemaDef }
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
  ? { -readonly [K in RK]-?: T[K] }
  : [RK] extends [never]
  ? { -readonly [K in UK]+?: T[K] }
  : { -readonly [K in UK]+?: T[K] } & { -readonly [K in RK]-?: T[K] };

export type SoapSchemaType<T extends SoapSchemaDef> = T extends readonly [
  '?',
  any,
]
  ? Array<SoapSchemaType<T[1]>> | null | undefined
  : T extends readonly [any]
  ? Array<SoapSchemaType<T[0]>>
  : T extends readonly any[]
  ? Array<SoapSchemaType<T[number]>>
  : T extends { readonly '?': { readonly [key: string]: any } }
  ?
      | PartialForUndefined<
          {
            [K in keyof T['?']]: SoapSchemaType<T['?'][K]>;
          }
        >
      | null
      | undefined
  : T extends { readonly [key: string]: any }
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
