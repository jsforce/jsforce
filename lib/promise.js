/*global process*/

'use strict';

var _ = require('underscore');

/**
 * @callback ResolvedCallback
 * @param {T} result - Resolved value
 * @returns {S}
 * @template T,S
 */

/**
 * @callback RejectedCallback
 * @param {Error} reason - Rejected reason
 * @returns {S}
 * @template S
 */

/**
 * @callback ResolveCallback
 * @param {T} result
 * @template T
 */

/**
 * @callback RejectedCallback
 * @param {Error} reason - Rejected reason
 * @returns {S}
 * @template S
 */

/**
 * @callback PromiseCallback
 * @param {ResolveCallback.<T>} resolve
 * @param {RejectCallback} reject
 * @template T
 */

/**
 * Promise class with a little extension
 *
 * @class Promise
 * @constructor
 * @param {PromiseCallback.<T>}
 * @template T
 */
var Promise = require('promise/lib/es6-extensions');

/**
 * The "then" method from the Promises/A+ specification
 *
 * @method Promise#then
 * @param {FulfilledCallback.<T, S1>} [onFulfilled]
 * @param {RejectedCallback.<S2>} [onRejected]
 * @returns {Promise.<S1|S2>}
 */

/**
 * Call "then" using given node-style callback function.
 * This is basically same as "nodeify" except that it always return the original promise
 *
 * @method Promise#thenCall
 * @param {Callback.<T>} [callback] - Callback function
 * @returns {Promise}
 */
Promise.prototype.thenCall = function(callback) {
  if (_.isFunction(callback)) {
    this.then(function(res) {
      process.nextTick(function() {
        callback(null, res);
      });
    }, function(err) {
      process.nextTick(function() {
        callback(err);
      });
    });
  }
  return this;
};

/**
 * A sugar method, equivalent to promise.then(undefined, onRejected).
 *
 * @method Promise#catch
 * @param {RejectedCallback.<S>} onRejected
 * @returns {Promise.<S>}
 */

/**
 * Synonym of Promise#catch
 *
 * @method Promise#fail
 * @param {RejectedCallback.<S>} onRejected
 * @returns {Promise.<S>}
 */
Promise.prototype.fail = Promise.prototype['catch'];

/**
 * Alias for completion
 *
 * @method Promise#done
 * @param {FulfilledCallback.<T, S>} [onFulfilled]
 * @returns {Promise.<S>}
 */

/**
 * Returns resolving promise with given reason
 *
 * @method Promise.resolve
 * @param {*} result - Resolved value
 * @returns {Promise}
 */

/**
 * Returns rejecting promise with given reason
 *
 * @method Promise.reject
 * @param {Error} reason - Rejecting reason
 * @returns {Promise}
 */

/**
 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise,
 * or is rejected with the same rejection reason as the first promise to be rejected.
 *
 * @method Promise.all
 * @param {Array.<Promise.<*>|*>} promises
 * @returns {Promise.<Array.<*>>}
 */

/**
 * Returns a deferred object
 *
 * @method Promise.defer
 * @returns {Deferred}
 */
Promise.defer = function() {
  return new Deferred();
};

/**
 * Deferred object
 *
 * @protected
 * @constructor
 */
var Deferred = function() {
  var self = this;
  this.promise = new Promise(function(resolve, reject) {
    self.resolve = resolve;
    self.reject = reject;
  });
};

/**
 * Resolve promise
 * @method Deferred#resolve
 * @param {*} result - Resolving result
 */

/**
 * Reject promise
 * @method Deferred#reject
 * @param {Error} error - Rejecting reason
 */

/**
 *
 */
module.exports = Promise;
