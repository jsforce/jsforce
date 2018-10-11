/* @flow */
/**
 * @file Manages asynchronous method response cache
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
import EventEmitter from 'events';


/**
 * type def
 */
export type CachingOptions = {
  key?: string | (...any[]) => string,
  namespace?: string,
  strategy: 'NOCACHE' | 'HIT' | 'IMMEDIATE',
};


/**
 * Class for managing cache entry
 *
 * @private
 * @class
 * @constructor
 * @template T
 */
class CacheEntry<T> extends EventEmitter {
  _fetching: boolean = false;
  _value: ?{ error?: Error, result?: T } = undefined;

  /**
   * Get value in the cache entry
   *
   * @param {() => Promise<T>} [callback] - Callback function callbacked the cache entry updated
   * @returns {T|undefined}
   */
  get(callback?: (T) => any): ?{ error?: Error, result?: T } {
    if (callback) {
      const cb = callback;
      this.once('value', (v: T) => cb(v));
      if (typeof this._value !== 'undefined') {
        this.emit('value', this._value);
      }
    }
    return this._value;
  }

  /**
   * Set value in the cache entry
   */
  set(value: { error?: Error, result?: T }) {
    this._value = value;
    this.emit('value', this._value);
  }

  /**
   * Clear cached value
   */
  clear() {
    this._fetching = false;
    this._value = undefined;
  }
}

/**
 * create and return cache key from namespace and serialized arguments.
 * @private
 */
function createCacheKey(namespace: ?string, args: any[]): string {
  return `${namespace || ''}(${[...args].map(a => JSON.stringify(a)).join(',')})`;
}

function generateKeyString(options: CachingOptions, scope: any, args: any[]): string {
  return (
    typeof options.key === 'string' ? options.key :
    typeof options.key === 'function' ? options.key.apply(scope, args) :
    createCacheKey(options.namespace, args)
  );
}


/**
 * Caching manager for async methods
 *
 * @class
 * @constructor
 */
export default class Cache {
  _entries: {[string]: CacheEntry<any> } = {};

  /**
   * retrive cache entry, or create if not exists.
   *
   * @param {String} [key] - Key of cache entry
   * @returns {CacheEntry}
   */
  get(key: string) {
    if (this._entries[key]) {
      return this._entries[key];
    }
    const entry = new CacheEntry();
    this._entries[key] = entry;
    return entry;
  }

  /**
   * clear cache entries prefix matching given key
   */
  clear(key?: string) {
    for (const k of Object.keys(this._entries)) {
      if (!key || k.indexOf(key) === 0) {
        this._entries[k].clear();
      }
    }
  }

  /**
   * Enable caching for async call fn to lookup the response cache first,
   * then invoke original if no cached value.
   */
  createCachedFunction(
    fn: ((...any[]) => Promise<any>),
    scope: any,
    options?: CachingOptions = { strategy: 'NOCACHE' }
  ): ((...any[]) => any) {
    const strategy = options.strategy;
    const $fn = (...args: any[]) => {
      const key = generateKeyString(options, scope, args);
      const entry = this.get(key);
      const executeFetch = async () => {
        entry._fetching = true;
        try {
          const result = await fn.apply(scope || this, args);
          entry.set({ error: undefined, result });
          return result;
        } catch (error) {
          entry.set({ error, result: undefined });
          throw error;
        }
      };
      let value;
      switch (strategy) {
        case 'IMMEDIATE':
          value = entry.get();
          if (!value) {
            throw new Error('Function call result is not cached yet.');
          }
          if (value.error) { throw value.error; }
          return value.result;
        case 'HIT':
          return (async () => {
            if (!entry._fetching) { // only when no other client is calling function
              await executeFetch();
            }
            return new Promise((resolve, reject) => {
              entry.get(({ error, result }) => {
                if (error) reject(error); else resolve(result);
              });
            });
          })();
        case 'NOCACHE':
        default:
          return executeFetch();
      }
    };
    $fn.clear = (...args) => {
      const key = generateKeyString(options, scope, args);
      this.clear(key);
    };
    return $fn;
  }
}
