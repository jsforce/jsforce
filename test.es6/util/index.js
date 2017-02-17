export function delay(msec) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), msec);
  });
}

export function isObject(o) {
  return typeof o === 'object' && o !== null;
}
