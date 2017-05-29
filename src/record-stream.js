/* @flow */
/**
 * @file Represents stream that handles Salesforce record as stream data
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import { Readable, Writable, Duplex, Transform, PassThrough } from 'stream';
import { Record } from './types';
import { serializeCSVStream, parseCSVStream } from './csv';


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
function evalMapping(value: any, mapping: {[string]: string }) {
  if (typeof value === 'string') {
    const m = /^\$\{(\w+)\}$/.exec(value);
    if (m) { return mapping[m[1]]; }
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
function convertRecordForSerialization(record: Record, options?: Object = {}): Record {
  return Object.keys(record).reduce((rec, key) => {
    const value = rec[key];
    let urec;
    if (key === 'attributes') { // 'attributes' prop will be ignored
      urec = Object.assign({}, rec);
      delete urec[key];
      return urec;
    } else if (options.nullValue && value === null) {
      urec = { [key]: options.nullValue };
      return Object.assign({}, rec, urec);
    } else if (value !== null && typeof value === 'object') {
      const precord = convertRecordForSerialization(value, options);
      return Object.keys(precord).reduce((prec, pkey) => {
        prec[`${key}.${pkey}`] = precord[pkey]; // eslint-disable-line no-param-reassign
        return prec;
      }, Object.assign({}, rec));
    }
    return rec;
  }, record);
}

/**
 * @private
 */
function createPipelineStream(s1, s2) {
  const pipeline: any = new PassThrough();
  pipeline.on('pipe', (source) => {
    source.unpipe(pipeline);
    source.pipe(s1).pipe(s2);
  });
  pipeline.pipe = (dest, options) => s2.pipe(dest, options);
  return (pipeline : Transform);
}

type StreamConverter = {
  serialize: (RecordStreamSerializeOption) => Transform,
  parse: (RecordStreamParseOption) => Transform,
};

/**
 * @private
 */
const CSVStreamConverter: StreamConverter = {
  serialize(options?: RecordStreamSerializeOption = {}) {
    return createPipelineStream(
      // eslint-disable-next-line no-use-before-define
      RecordStream.map(record => convertRecordForSerialization(record, options)),
      serializeCSVStream(options)
    );
  },
  parse(options?: RecordStreamParseOption = {}) {
    return parseCSVStream(options);
  },
};

/**
 * @private
 */
const DataStreamConverters: { [string]: StreamConverter } = {
  csv: CSVStreamConverter,
};

/**
 * Class for Record Stream
 *
 * @class
 * @constructor
 * @extends stream.Transform
 */
export default class RecordStream extends PassThrough {
  /**
   *
   */
  constructor() {
    super({ objectMode: true });
  }

  /**
   * Get record stream of queried records applying the given mapping function
   */
  map(fn: Record => ?Record): Duplex {
    return this.pipe(RecordStream.map(fn));
  }

  /**
   * Get record stream of queried records, applying the given filter function
   */
  filter(fn: Record => boolean): Duplex {
    return this.pipe(RecordStream.filter(fn));
  }

  /* --------------------------------------------------- */

  /**
   * Create a record stream which maps records and pass them to downstream
   */
  static map(fn: Record => ?Record): Duplex {
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
  static recordMapStream(record: Record, noeval?: boolean) {
    return RecordStream.map((rec) => {
      const mapped = { Id: rec.Id };
      for (const prop of Object.keys(record)) {
        mapped[prop] = noeval ? record[prop] : evalMapping(record[prop], rec);
      }
      return mapped;
    });
  }

  /**
   * Create a record stream which filters records and pass them to downstream
   *
   * @param {RecordFilterFunction} fn - Record filtering function
   * @returns {RecordStream.Serializable}
   */
  static filter(fn: Record => boolean): Duplex {
    const filterStream = new Transform({
      objectMode: true,
      transform(record, enc, callback) {
        if (fn(record)) { filterStream.push(record); }
        callback();
      }
    });
    return filterStream;
  }
}

/**
 * @class RecordStream.Serializable
 * @extends {RecordStream}
 */
export class Serializable extends RecordStream {
  /**
   * Create readable data stream which emits serialized record data
   */
  stream(type?: string = 'csv', options?: Object = {}): Readable {
    const converter: ?StreamConverter = DataStreamConverters[type];
    if (!converter) {
      throw new Error(`Converting [${type}] data stream is not supported.`);
    }
    return this.pipe(converter.serialize(options));
  }
}


/**
 * @class RecordStream.Parsable
 * @extends {RecordStream}
 */
export class Parsable extends RecordStream {
  _execParse: boolean = false;
  _incomings: Array<[Readable, Writable]> = [];

  /**
   * Create writable data stream which accepts serialized record data
   */
  stream(type?: string = 'csv', options?: Object = {}): Writable {
    const converter: ?StreamConverter = DataStreamConverters[type];
    if (!converter) {
      throw new Error(`Converting [${type}] data stream is not supported.`);
    }
    const dataStream = new PassThrough();
    const parserStream = converter.parse(options);
    parserStream.pipe(this).pipe(
      new PassThrough({ objectMode: true, highWaterMark: (500 * 1000) })
    );
    if (this._execParse) {
      dataStream.pipe(parserStream);
    } else {
      this._incomings.push([dataStream, parserStream]);
    }
    return dataStream;
  }

  /* @override */
  on(ev: string, fn: Function) {
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
