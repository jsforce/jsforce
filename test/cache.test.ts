import assert from 'assert';
import { isNumber } from './util';
import Cache from '../src/cache';
import { it, describe } from '@jest/globals';

/**
 *
 */
describe('cache', () => {
  const cache = new Cache();
  let t1: number;
  let t2: number;
  let t3: number;
  let t4: number;
  let t5: number;

  const getTime = () =>
    new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Date.now());
      }, 200);
    });

  const getTimeWithResCached = cache.createCachedFunction(getTime, null, {
    key: 'getTime',
    strategy: 'NOCACHE',
  });

  it('should call response-cached getTime function and return time', async () => {
    t1 = await getTimeWithResCached();
    assert.ok(isNumber(t1));
  });

  it('should call response-cached function and get different time', async () => {
    t2 = await getTimeWithResCached();
    assert.ok(isNumber(t2));
    assert.ok(t1 < t2);
  });

  const getTimeCacheIfHit = cache.createCachedFunction(getTime, null, {
    key: 'getTime',
    strategy: 'HIT',
  });

  it('should call cacheable getTime function and get time which equals to latest call result', async () => {
    t3 = await getTimeCacheIfHit();
    assert.ok(isNumber(t3));
    assert.ok(t3 === t2);
  });

  const getTimeCacheImmediate: Function = cache.createCachedFunction(
    getTime,
    null,
    { key: 'getTime', strategy: 'IMMEDIATE' },
  );

  it('should call cached function with immediate lookup strategy and get same time which equals to latest fn call result', () => {
    t4 = getTimeCacheImmediate();
    assert.ok(isNumber(t4));
    assert.ok(t4 === t3);
  });

  it('should clear cache and call cache-first function and get time much newer than the latest', async () => {
    cache.clear();
    t5 = await getTimeCacheIfHit();
    assert.ok(isNumber(t5));
    assert.ok(t4 < t5);
  });
});
