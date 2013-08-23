var Q = require('q'),
    _ = require('underscore')._;

/**
 * Promises/A+ spec compliant class, with a little extension
 * http://promises-aplus.github.io/promises-spec/
 */
var Promise = function(promise) {
  this._promise = Q(promise);
};

/**
 * The "then" method from the Promises/A+ specification
 */
Promise.prototype.then = function() {
  // Delegate Q promise implementation and wrap by our Promise instance
  return new Promise(this._promise.then.apply(this._promise, arguments));
};

/**
 * Call "then" using given node-style callback function
 */
Promise.prototype.thenCall = function(callback) {
  return _.isFunction(callback) ? this.then(function(res) {
    return callback(null, res);
  }, function(err) {
    return callback(err);
  }) : this;
};

/**
 * A sugar method, equivalent to promise.then(undefined, onRejected).
 */
Promise.prototype.fail = function() {
  return new Promise(this._promise.fail.apply(this._promise, arguments));
};

/**
 * Alias for completion
 */
Promise.prototype.done = function() {
  return new Promise(this._promise.done.apply(this._promise, arguments));
};

/**
 *
 */
Promise.when = function() {
  return new Promise(Q.when.apply(Q, arguments));
};

/**
 * Returns rejecting promise with given reason
 */
Promise.reject = function(reason) {
  return new Promise(Q.reject(reason));
};

/**
 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, 
 * or is rejected with the same rejection reason as the first promise to be rejected.
 */
Promise.all = function() {
  return new Promise(Q.all.apply(Q, arguments));
};

/**
 * Returns a deferred object
 */
Promise.defer = function() {
  return new Deferred();
};

/**
 * Deferred object
 */
var Deferred = function() {
  this._deferred = Q.defer();
  this.promise = new Promise(this._deferred.promise);
};

Deferred.prototype.resolve = function() {
  return this._deferred.resolve.apply(this._promise, arguments);
};

Deferred.prototype.reject = function() {
  return this._deferred.reject.apply(this._promise, arguments);
};

module.exports = Promise;
