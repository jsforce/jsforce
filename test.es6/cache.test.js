import test from './util/ava/ext';
import { isNumber } from './util';
import Cache from '../lib/cache';

/**
 *
 */
test.group('cache', (test) => {
  const cache = new Cache();
  let t1, t2, t3, t4, t5; // eslint-disable-line one-var, one-var-declaration-per-line

  const getTime = (callback) => {
    setTimeout(() => { callback(null, Date.now()); }, 1000);
  };

  const getTimeResCached = cache.makeResponseCacheable(getTime, null, { key: 'getTime' });

  test.serial('call response-cached getTime function and return time', async (t) => (
    new Promise((resolve, reject) => {
      getTimeResCached((err, time) => {
        if (err) { reject(err); return; }
        t1 = time;
        t.true(isNumber(t1));
        resolve();
      });
    })
  ));

  test.serial('call response-cached function and get different time', async (t) => (
    new Promise((resolve, reject) => {
      getTimeResCached((err, time) => {
        if (err) { reject(err); return; }
        t2 = time;
        t.true(isNumber(t2));
        t.true(t1 < t2);
        resolve();
      });
    })
  ));

  const getTimeCached = cache.makeCacheable(getTime, null, { key: 'getTime' });

  test.serial('call cacheable getTime function and get time which equals to latest call result', async (t) => (
    new Promise((resolve, reject) => {
      getTimeCached((err, time) => {
        if (err) { reject(err); return; }
        t3 = time;
        t.true(isNumber(t3));
        t.true(t3 === t2);
        resolve();
      });
    })
  ));

  test.serial('call cached function with no callback and get same time which equals to latest fn call result', (t) => {
    t4 = getTimeCached();
    t.true(isNumber(t4));
    t.true(t4 === t3);
  });

  test.serial('clear cache and call cache-first function and get time much newer than the latest', async (t) => {
    cache.clear();
    return new Promise((resolve, reject) => {
      getTimeCached((err, time) => {
        if (err) { reject(err); return; }
        t5 = time;
        t.true(isNumber(t5));
        t.true(t4 < t5);
        resolve();
      });
    });
  });
});
