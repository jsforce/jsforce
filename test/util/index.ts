export function delay(msec: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), msec);
  });
}

type MapObject = { [name: string]: unknown };

export function isObject(o: any): o is MapObject;
export function isObject<T extends MapObject>(o: T): o is T;
export function isObject(o: any) {
  return o != null && typeof o == 'object';
}

export function isString(o: any): o is string;
export function isString<T extends string>(o: T): o is T;
export function isString(o: any): o is string {
  return typeof o === 'string';
}

export function isNumber(o: any): o is number;
export function isNumber<T extends number>(o: T): o is T;
export function isNumber(o: any) {
  return typeof o === 'number';
}

export function isBoolean(o: any): o is boolean;
export function isBoolean<T extends boolean>(o: T): o is T;
export function isBoolean(o: any) {
  return typeof o === 'boolean';
}

export function isUndefined(o: any): o is undefined {
  return typeof o === 'undefined';
}

export function clone(o: Object) {
  return JSON.parse(JSON.stringify(o));
}
