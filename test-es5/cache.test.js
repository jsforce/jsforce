/*global describe, it, before */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('lodash/core'),
    Cache  = require('../lib/cache');

/**
 *
 */
describe("cache", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var cache = new Cache();
  var getTime = function(callback) {
    setTimeout(function() {
      callback(null, Date.now());
    }, 1000);
  };

  describe("call response-cached getTime function", function() {
    var t1, t2;
    var getTimeResCached;

    it("should return time", function(done) {
      getTimeResCached = cache.makeResponseCacheable(getTime, null, { key: 'getTime' });
      getTimeResCached(function(err, t) {
        if (err) { throw err; }
        t1 = t;
        assert.ok(_.isNumber(t1));
      }.check(done));
    });

    describe("then call response-cached function", function() {
      it("should get different time", function(done) {
        getTimeResCached(function(err, t) {
          if (err) { throw err; }
          t2 = t;
          assert.ok(_.isNumber(t2));
          assert.ok(t1 < t2);
        }.check(done));
      });

      describe("then call cacheable getTime function", function() {
        var t3, t4, t5;
        var getTimeCached;

        it("should get time which equals to latest fn call result", function(done) {
          getTimeCached = cache.makeCacheable(getTime, null, { key: 'getTime' });
          getTimeCached(function(err, t) {
            if (err) { throw err; }
            t3 = t;
            assert.ok(_.isNumber(t3));
            assert.equal(t3, t2);
          }.check(done));
        });

        describe("then call cached function with no callback", function() {
          it("should get same time which equals to latest fn call result", function() {
            t4 = getTimeCached();
            assert.ok(_.isNumber(t4));
            assert.equal(t4, t3);
          });

          describe("then clear cache and call cache-first function", function() {
            it("should get time much newer than the latest", function(done) {
              cache.clear();
              getTimeCached(function(err, t) {
                if (err) { throw err; }
                t5 = t;
                assert.ok(_.isNumber(t5));
                assert.ok(t4 < t5);
              }.check(done));
            });
          });
        });
      });
    });
  });
});
