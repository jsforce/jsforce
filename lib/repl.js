/* glbal global:true */
/**
 *
 *
 */
var repl = require('repl'),
    _    = require('underscore')._,
    sf   = require('./salesforce');

/**
 * Intercept the evaled value when it is "promise", and resolve its value before sending back to REPL.
 */
function promisify(repl) {
  var _eval = repl.eval;
  repl.eval = function(cmd, context, filename, callback) {
    _eval.call(repl, cmd, context, filename, function(err, res) {
      if (isPromiseLike(res)) {
        res.then(function(ret) {
          callback(null, ret);
        }, function(err) {
          callback(err);
        });
      } else {
        callback(err, res);
      }
    });
  };
  return repl;
}

/**
 * Detect whether the value has CommonJS Promise/A+ interface or not
 */
function isPromiseLike(v) {
  return _.isObject(v) && _.isFunction(v.then);
}

/**
 * Map all node-salesforce object to REPL context
 */
var context = promisify(repl.start({})).context;

for (var key in sf) {
  if (sf.hasOwnProperty(key) && !global[key]) {
    context[key] = sf[key];
  }
}
// expose salesforce package root as "$sf" in context.
context.$sf = sf;

// create default connection object
var conn = new sf.Connection();
for (var key in conn) {
  (function(key) {
    if (key.indexOf('_') === 0) { // ignore private
      return;
    }
    if (_.isFunction(conn[key])) {
      context[key] = function() {
        return conn[key].apply(conn, arguments);
      };
    } else if (_.isObject(conn[key])) {
      if (Object.defineProperty) {
        Object.defineProperty(context, key, {
          get: function() { return conn[key]; }
        });
      }
    }
  })(key);
}
// expose default connection as "$conn"
context.$conn = conn;
