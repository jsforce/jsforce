export function isNodeJS() {
  return Object.prototype.toString.call(global.process) === '[object process]';
}
