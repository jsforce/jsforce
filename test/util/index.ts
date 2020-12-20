export function delay(msec: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), msec);
  });
}

type MapObject = { [name: string]: unknown };

export function isObject(o: any): o is MapObject;
// eslint-disable-next-line no-redeclare
export function isObject<T extends MapObject>(o: T): o is T;
// eslint-disable-next-line no-redeclare
export function isObject(o: any) {
  return o != null && typeof o == 'object';
}

export function isString(o: any): o is string;
// eslint-disable-next-line no-redeclare
export function isString<T extends string>(o: T): o is T;
// eslint-disable-next-line no-redeclare
export function isString(o: any): o is string {
  return typeof o === 'string';
}

export function isNumber(o: any): o is number;
// eslint-disable-next-line no-redeclare
export function isNumber<T extends number>(o: T): o is T;
// eslint-disable-next-line no-redeclare
export function isNumber(o: any) {
  return typeof o === 'number';
}

export function isBoolean(o: any): o is boolean;
// eslint-disable-next-line no-redeclare
export function isBoolean<T extends boolean>(o: T): o is T;
// eslint-disable-next-line no-redeclare
export function isBoolean(o: any) {
  return typeof o === 'boolean';
}

export function isUndefined(o: any): o is undefined {
  return typeof o === 'undefined';
}

export function clone(o: Object) {
  return JSON.parse(JSON.stringify(o));
}
