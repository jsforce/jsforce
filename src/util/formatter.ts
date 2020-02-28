/**
 *
 */
export function zeroPad(num: number, digits: number = 2): string {
  let nstr = '';
  for (let d = digits - 1; d > 0; d--) {
    if (num >= 10 ** d) {
      break;
    }
    nstr += '0';
  }
  return nstr + String(num);
}

/**
 *
 */
export function formatDate(date: Date) {
  return `${date.getUTCFullYear()}-${zeroPad(date.getUTCMonth() + 1)}-${zeroPad(
    date.getUTCDate(),
  )}T${zeroPad(date.getUTCHours())}:${zeroPad(date.getUTCMinutes())}:${zeroPad(
    date.getUTCSeconds(),
  )}+00:00`;
}
