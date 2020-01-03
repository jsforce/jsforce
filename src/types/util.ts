export type Optional<T> = T | null | undefined;

export type StringKeys<O> = Extract<keyof O, string>;

export type PickIfMatch<
  O extends { [name: string]: any },
  P extends string
> = Pick<O, Extract<P, keyof O>>;

export type IsEqualType<S, T> = [S] extends [T]
  ? [T] extends [S]
    ? true
    : false
  : false;

export type ConditionalPartial<
  O,
  IsPartial extends boolean
> = IsPartial extends true ? Partial<O> : O;
