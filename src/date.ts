/**
 *
 */
import { zeroPad } from './util/formatter';

/** @private **/
function createLiteralBuilder(literal: string) {
  return (num: number) => new SfDate(`${literal}:${String(num)}`); // eslint-disable-line no-use-before-define
}

/**
 * A date object to keep Salesforce date literal
 *
 * @class
 * @constructor
 * @see http://www.salesforce.com/us/developer/docs/soql_sosl/Content/sforce_api_calls_soql_select_dateformats.htm
 */
export class SfDate {
  private _literal: string;

  /**
   *
   */
  constructor(literal: string) {
    this._literal = literal;
  }

  /**
   * Returns literal when converted to string
   */
  toJSON() {
    return this._literal;
  }

  toString = this.toJSON;

  /**
   * Convert JavaScript date object to ISO8601 Date format (e.g. 2012-10-31)
   *
   * @param {String|Number|Date} date - Input date
   * @returns {SfDate} - Salesforce date literal with ISO8601 date format
   */
  static toDateLiteral(date: string | number | Date) {
    let _date: Date;
    if (typeof date === 'number') {
      _date = new Date(date);
    } else if (typeof date === 'string') {
      _date = SfDate.parseDate(date);
    } else {
      _date = date;
    }
    const yy = _date.getFullYear();
    const mm = _date.getMonth() + 1;
    const dd = _date.getDate();
    const dstr = [yy, zeroPad(mm), zeroPad(dd)].join('-');
    return new SfDate(dstr);
  }

  /**
   * Convert JavaScript date object to ISO8601 DateTime format
   * (e.g. 2012-10-31T12:34:56Z)
   */
  static toDateTimeLiteral(date: string | number | Date) {
    let _date: Date;
    if (typeof date === 'number') {
      _date = new Date(date);
    } else if (typeof date === 'string') {
      _date = SfDate.parseDate(date);
    } else {
      _date = date;
    }
    const yy = _date.getUTCFullYear();
    const mm = _date.getUTCMonth() + 1;
    const dd = _date.getUTCDate();
    const hh = _date.getUTCHours();
    const mi = _date.getUTCMinutes();
    const ss = _date.getUTCSeconds();
    const dtstr = `${[yy, zeroPad(mm), zeroPad(dd)].join('-')}T${[
      zeroPad(hh),
      zeroPad(mi),
      zeroPad(ss),
    ].join(':')}Z`;
    return new SfDate(dtstr);
  }

  /**
   * Convert JavaScript date object to ISO8601 time format
   * (e.g. 12:34:56.789Z)
   */
  static toTimeLiteral(time: string | number | Date) {
    let _date = new Date(0);
    if (typeof time === 'string') {
      _date = SfDate.parseTime(time);
    } else if (typeof time === 'number') {
      _date = new Date(time);
    } else {
      _date = time;
    }
    const hh = _date.getUTCHours();
    const mi = _date.getUTCMinutes();
    const ss = _date.getUTCSeconds();
    const sss = _date.getUTCMilliseconds();
    const tstr = `${zeroPad(hh)}:${zeroPad(mi)}:${zeroPad(ss)}.${zeroPad(
      sss,
      3,
    )}Z`;
    return new SfDate(tstr);
  }

  /**
   * Parse IS08601 date(time) formatted string and return date instance
   */
  static parseDate(str: string): Date {
    let d = new Date();
    const regexp = /^([\d]{4})-?([\d]{2})-?([\d]{2})(T([\d]{2}):?([\d]{2}):?([\d]{2})(.([\d]{3}))?(Z|([+-])([\d]{2}):?([\d]{2})))?$/;
    const m = str.match(regexp);
    if (m) {
      d = new Date(0);
      if (!m[4]) {
        d.setFullYear(parseInt(m[1], 10));
        d.setDate(parseInt(m[3], 10));
        d.setMonth(parseInt(m[2], 10) - 1);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
      } else {
        d.setUTCFullYear(parseInt(m[1], 10));
        d.setUTCDate(parseInt(m[3], 10));
        d.setUTCMonth(parseInt(m[2], 10) - 1);
        d.setUTCHours(parseInt(m[5], 10));
        d.setUTCMinutes(parseInt(m[6], 10));
        d.setUTCSeconds(parseInt(m[7], 10));
        d.setUTCMilliseconds(parseInt(m[9] || '0', 10));
        if (m[10] && m[10] !== 'Z') {
          const offset = parseInt(m[12], 10) * 60 + parseInt(m[13], 10);
          d.setTime(
            (m[11] === '+' ? -1 : 1) * offset * 60 * 1000 + d.getTime(),
          );
        }
      }
      return d;
    }
    throw new Error(`Invalid date format is specified : ${str}`);
  }

  /**
   * Parse IS08601 time formatted string and convert to parse string
   */
  static parseTime(str: string): Date {
    const regexp = /^([\d]{2}):?([\d]{2}):?([\d]{2})(.([\d]{3}))?Z?$/;
    const m = str.match(regexp);
    if (m) {
      const d = new Date(0);
      const hh = parseInt(m[1], 10);
      const mi = parseInt(m[2], 10);
      const ss = parseInt(m[3], 10);
      const sss = parseInt(m[5] || '0', 10);
      d.setUTCHours(hh);
      d.setUTCMinutes(mi);
      d.setUTCSeconds(ss);
      d.setUTCMilliseconds(sss);
      return d;
    }
    throw new Error(`Invalid time format is specified : ${str}`);
  }

  static YESTERDAY = new SfDate('YESTERDAY');
  static TODAY = new SfDate('TODAY');
  static TOMORROW = new SfDate('TOMORROW');
  static LAST_WEEK = new SfDate('LAST_WEEK');
  static THIS_WEEK = new SfDate('THIS_WEEK');
  static NEXT_WEEK = new SfDate('NEXT_WEEK');
  static LAST_MONTH = new SfDate('LAST_MONTH');
  static THIS_MONTH = new SfDate('THIS_MONTH');
  static NEXT_MONTH = new SfDate('NEXT_MONTH');
  static LAST_90_DAYS = new SfDate('LAST_90_DAYS');
  static NEXT_90_DAYS = new SfDate('NEXT_90_DAYS');
  static LAST_N_DAYS = createLiteralBuilder('LAST_N_DAYS');
  static NEXT_N_DAYS = createLiteralBuilder('NEXT_N_DAYS');
  static NEXT_N_WEEKS = createLiteralBuilder('NEXT_N_WEEKS');
  static LAST_N_WEEKS = createLiteralBuilder('LAST_N_WEEKS');
  static NEXT_N_MONTHS = createLiteralBuilder('NEXT_N_MONTHS');
  static LAST_N_MONTHS = createLiteralBuilder('LAST_N_MONTHS');
  static THIS_QUARTER = new SfDate('THIS_QUARTER');
  static LAST_QUARTER = new SfDate('LAST_QUARTER');
  static NEXT_QUARTER = new SfDate('NEXT_QUARTER');
  static NEXT_N_QUARTERS = createLiteralBuilder('NEXT_N_QUARTERS');
  static LAST_N_QUARTERS = createLiteralBuilder('LAST_N_QUARTERS');
  static THIS_YEAR = new SfDate('THIS_YEAR');
  static LAST_YEAR = new SfDate('LAST_YEAR');
  static NEXT_YEAR = new SfDate('NEXT_YEAR');
  static NEXT_N_YEARS = createLiteralBuilder('NEXT_N_YEARS');
  static LAST_N_YEARS = createLiteralBuilder('LAST_N_YEARS');
  static THIS_FISCAL_QUARTER = new SfDate('THIS_FISCAL_QUARTER');
  static LAST_FISCAL_QUARTER = new SfDate('LAST_FISCAL_QUARTER');
  static NEXT_FISCAL_QUARTER = new SfDate('NEXT_FISCAL_QUARTER');
  static THIS_FISCAL_YEAR = new SfDate('THIS_FISCAL_YEAR');
  static NEXT_N_FISCAL_QUARTERS = createLiteralBuilder(
    'NEXT_N_FISCAL_QUARTERS',
  );
  static LAST_N_FISCAL_QUARTERS = createLiteralBuilder(
    'LAST_N_FISCAL_QUARTERS',
  );
  static LAST_FISCAL_YEAR = new SfDate('LAST_FISCAL_YEAR');
  static NEXT_FISCAL_YEAR = new SfDate('NEXT_FISCAL_YEAR');
  static NEXT_N_FISCAL_YEARS = createLiteralBuilder('NEXT_N_FISCAL_YEARS');
  static LAST_N_FISCAL_YEARS = createLiteralBuilder('LAST_N_FISCAL_YEARS');
}

export default SfDate;
