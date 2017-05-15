import test from './util/ava/ext';
import { isNumber } from './util';
import Cache from '../src/cache';

/**
 *
 */
test.group('cache', (test) => {
  const cache = new Cache();
  let t1, t2, t3, t4, t5; // eslint-disable-line one-var, one-var-declaration-per-line

  const getTime = () => new Promise((resolve) => {
    setTimeout(() => { resolve(Date.now()); }, 200);
  });

  const getTimeWithResCached = cache.createCachedFunction(getTime, null, { key: 'getTime', strategy: 'NOCACHE' });

  test.serial('call response-cached getTime function and return time', async (t) => {
    t1 = await getTimeWithResCached();
    t.true(isNumber(t1));
  });

  test.serial('call response-cached function and get different time', async (t) => {
    t2 = await getTimeWithResCached();
    t.true(isNumber(t2));
    t.true(t1 < t2);
  });

  const getTimeCacheIfHit = cache.createCachedFunction(getTime, null, { key: 'getTime', strategy: 'HIT' });

  test.serial('call cacheable getTime function and get time which equals to latest call result', async (t) => {
    t3 = await getTimeCacheIfHit();
    t.true(isNumber(t3));
    t.true(t3 === t2);
  });

  const getTimeCacheImmediate = cache.createCachedFunction(getTime, null, { key: 'getTime', strategy: 'IMMEDIATE' });

  test.serial('call cached function with immediate lookup strategy and get same time which equals to latest fn call result', (t) => {
    t4 = getTimeCacheImmediate();
    t.true(isNumber(t4));
    t.true(t4 === t3);
  });

  test.serial('clear cache and call cache-first function and get time much newer than the latest', async (t) => {
    cache.clear();
    t5 = await getTimeCacheIfHit();
    t.true(isNumber(t5));
    t.true(t4 < t5);
  });
});
