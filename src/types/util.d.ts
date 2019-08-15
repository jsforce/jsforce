export type Optional<T> = T | null | undefined;

export type StringKeys<O> = Extract<keyof O, string>;

export type PickIfMatch<
  O extends { [name: string]: any },
  P extends string
> = Pick<O, Extract<P, keyof O>>;
