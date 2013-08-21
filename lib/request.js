var stream = require('stream'),
    _ = require('underscore')._,
    request = require('request'),
    Promise = require('./promise');

/**
 *
 */
module.exports = function(params, callback) {
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
  var promise = deferred.promise.thenCall(callback);
  return streamify(promise, createRequest);
};

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