/**
 *
 */
export function isObject(v: any): v is object {
  const t = typeof v;
  return v != null && (t == 'object' || t == 'function');
}

/**
 *
 */
export function isMapObject(v: any): v is { [name: string]: unknown } {
  const t = typeof v;
  return v != null && t == 'object';
}

/**
 *
 */
export function isFunction(v: any): v is (...args: any[]) => any {
  return typeof v == 'function';
}

/**
 *
 */
export function isNumber(v: any): v is number {
  return typeof v == 'number';
}

/**
 * Detect whether the value has CommonJS Promise/A+ interface or not
 */
export function isPromiseLike(v: any): v is { then: Function } {
  return isObject(v) && isFunction((v as any).then);
}

/**
 *
 */
export function identityFunc<T>(a: T) {
  return a;
}

/**
 *
 */
export function emptyFunc() {}
