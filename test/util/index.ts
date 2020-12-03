export function delay(msec: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), msec);
  });
}

export function isObject(o: any): o is Object {
  return typeof o === 'object' && o !== null;
}

export function isString(o: any): o is string {
  return typeof o === 'string';
}

export function isNumber(o: any): o is number {
  return typeof o === 'number';
}

export function isBoolean(o: any): o is boolean {
  return typeof o === 'boolean';
}

export function isUndefined(o: any): o is undefined {
  return typeof o === 'undefined';
}

export function clone(o: Object) {
  return JSON.parse(JSON.stringify(o));
}
