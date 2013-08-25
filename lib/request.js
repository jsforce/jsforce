var stream = require('stream'),
    _ = require('underscore')._,
    request = require('request'),
    Promise = require('./promise');

/**
 * HTTP request method, returns promise instead of stream
 * @private
 */
function promisedRequest(params, callback) {
  var deferred = Promise.defer();
  var req;
  var createRequest = function() {
    if (!req) {
      req = request(params, function(err, response) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(response);
        }
      });
    }
    return req;
  };
  return streamify(deferred.promise, createRequest).thenCall(callback);
}

/**
 * Add stream() method to promise (and following promise chain), to access original request stream.
 * @private
 */
function streamify(promise, factory) {
  var _then = promise.then;
  promise.then = function() {
    factory();
    var newPromise = _then.apply(promise, arguments);
    return streamify(newPromise, factory);
  };
  promise.stream = factory;
  return promise;
}

/**
 * @protected
 */
module.exports = promisedRequest;
