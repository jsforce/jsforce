/**
 * @file Represents stream that handles Salesforce record as stream data
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { Readable, Writable, Duplex, Transform, PassThrough } from 'stream';
import { Record, Optional } from './types';
import { serializeCSVStream, parseCSVStream } from './csv';
import { concatStreamsAsDuplex } from './util/stream';

/**
 * type defs
 */
export type RecordStreamSerializeOption = {
  nullValue?: any;
};

export type RecordStreamParseOption = {};

/**
 * @private
 */
function evalMapping(value: any, mapping: { [prop: string]: string }) {
  if (typeof value === 'string') {
    const m = /^\$\{(\w+)\}$/.exec(value);
    if (m) {
      return mapping[m[1]];
    }
    return value.replace(/\$\{(\w+)\}/g, ($0, prop) => {
      const v = mapping[prop];
      return typeof v === 'undefined' || v === null ? '' : String(v);
    });
  }
  return value;
}

/**
 * @private
 */
function convertRecordForSerialization(
  record: Record,
  options: { nullValue?: boolean } = {},
): Record {
  return Object.keys(record).reduce((rec: Record, key: string) => {
    const value = (rec as any)[key];
    let urec: Record;
    if (key === 'attributes') {
      // 'attributes' prop will be ignored
      urec = { ...rec };
      delete urec[key];
      return urec;
    } else if (options.nullValue && value === null) {
      return { ...rec, [key]: options.nullValue } as Record;
    } else if (value !== null && typeof value === 'object') {
      const precord = convertRecordForSerialization(value, options);
      return Object.keys(precord).reduce(
        (prec: Record, pkey) => {
          prec[`${key}.${pkey}`] = precord[pkey]; // eslint-disable-line no-param-reassign
          return prec;
        },
        { ...rec },
      );
    }
    return rec;
  }, record);
}

/**
 * @private
 */
function createPipelineStream(s1: Duplex, s2: Duplex) {
  s1.pipe(s2);
  return concatStreamsAsDuplex(s1, s2, { writableObjectMode: true });
}

type StreamConverter = {
  serialize: (options?: RecordStreamSerializeOption) => Duplex;
  parse: (options?: RecordStreamParseOption) => Duplex;
};

/**
 * @private
 */
const CSVStreamConverter: StreamConverter = {
  serialize(options: RecordStreamSerializeOption = {}) {
    const { nullValue, ...csvOpts } = options;
    return createPipelineStream(
      // eslint-disable-next-line no-use-before-define
      RecordStream.map((record) =>
        convertRecordForSerialization(record, options),
      ),
      serializeCSVStream(csvOpts),
    );
  },
  parse(options: RecordStreamParseOption = {}) {
    return parseCSVStream(options);
  },
};

/**
 * @private
 */
const DataStreamConverters: { [key: string]: StreamConverter } = {
  csv: CSVStreamConverter,
};

/**
 * Class for Record Stream
 *
 * @class
 * @constructor
 * @extends stream.Transform
 */
export class RecordStream<R extends Record = Record> extends PassThrough {
  /**
   *
   */
  constructor() {
    super({ objectMode: true });
  }

  /**
   * Get record stream of queried records applying the given mapping function
   */
  map<RR extends Record>(fn: (rec: R) => Optional<RR>) {
    return this.pipe(RecordStream.map<R, RR>(fn));
  }

  /**
   * Get record stream of queried records, applying the given filter function
   */
  filter(fn: (rec: R) => boolean): Duplex {
    return this.pipe(RecordStream.filter<R>(fn));
  }

  /* @override */
  on(ev: string, fn: (...args: any[]) => void) {
    return super.on(ev === 'record' ? 'data' : ev, fn);
  }

  /* @override */
  addListener = this.on;

  /* --------------------------------------------------- */

  /**
   * Create a record stream which maps records and pass them to downstream
   */
  static map<R1 extends Record = Record, R2 extends Record = Record>(
    fn: (rec: R1) => Optional<R2>,
  ) {
    const mapStream = new Transform({
      objectMode: true,
      transform(record, enc, callback) {
        const rec = fn(record) || record; // if not returned record, use same record
        mapStream.push(rec);
        callback();
      },
    });
    return mapStream;
  }

  /**
   * Create mapping stream using given record template
   */
  static recordMapStream<
    R1 extends Record = Record,
    R2 extends Record = Record
  >(record: R2, noeval?: boolean) {
    return RecordStream.map<R1, R2>((rec) => {
      const mapped: Record = { Id: rec.Id };
      for (const prop of Object.keys(record)) {
        mapped[prop] = noeval ? record[prop] : evalMapping(record[prop], rec);
      }
      return mapped as R2;
    });
  }

  /**
   * Create a record stream which filters records and pass them to downstream
   *
   * @param {RecordFilterFunction} fn - Record filtering function
   * @returns {RecordStream.Serializable}
   */
  static filter<R1 extends Record = Record>(fn: (rec: R1) => boolean): Duplex {
    const filterStream = new Transform({
      objectMode: true,
      transform(record, enc, callback) {
        if (fn(record)) {
          filterStream.push(record);
        }
        callback();
      },
    });
    return filterStream;
  }
}

/**
 * @class RecordStream.Serializable
 * @extends {RecordStream}
 */
export class Serializable<R extends Record = Record> extends RecordStream<R> {
  _dataStreams: { [type: string]: Duplex } = {};

  /**
   * Get readable data stream which emits serialized record data
   */
  stream(type: string = 'csv', options: Object = {}): Duplex {
    if (this._dataStreams[type]) {
      return this._dataStreams[type];
    }
    const converter: Optional<StreamConverter> = DataStreamConverters[type];
    if (!converter) {
      throw new Error(`Converting [${type}] data stream is not supported.`);
    }
    const dataStream = new PassThrough();
    this.pipe(converter.serialize(options)).pipe(dataStream);
    this._dataStreams[type] = dataStream;
    return dataStream;
  }
}

/**
 * @class RecordStream.Parsable
 * @extends {RecordStream}
 */
export class Parsable<R extends Record = Record> extends RecordStream<R> {
  _dataStreams: { [type: string]: Duplex } = {};
  _execParse: boolean = false;
  _incomings: Array<[Readable, Writable]> = [];

  /**
   * Get writable data stream which accepts serialized record data
   */
  stream(type: string = 'csv', options: Object = {}): Duplex {
    if (this._dataStreams[type]) {
      return this._dataStreams[type];
    }
    const converter: Optional<StreamConverter> = DataStreamConverters[type];
    if (!converter) {
      throw new Error(`Converting [${type}] data stream is not supported.`);
    }
    const dataStream = new PassThrough();
    const parserStream = converter.parse(options);
    parserStream.on('error', (err) => this.emit('error', err));
    parserStream
      .pipe(this)
      .pipe(new PassThrough({ objectMode: true, highWaterMark: 500 * 1000 }));
    if (this._execParse) {
      dataStream.pipe(parserStream);
    } else {
      this._incomings.push([dataStream, parserStream]);
    }
    this._dataStreams[type] = dataStream;
    return dataStream;
  }

  /* @override */
  on(ev: string, fn: (...args: any[]) => void) {
    if (ev === 'readable' || ev === 'record') {
      if (!this._execParse) {
        this._execParse = true;
        for (const [dataStream, parserStream] of this._incomings) {
          dataStream.pipe(parserStream);
        }
      }
    }
    return super.on(ev, fn);
  }

  /* @override */
  addListener = this.on;
}

export default RecordStream;
