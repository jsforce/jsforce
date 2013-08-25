/**
 * @file Creates REPL interface with built in Salesforce API objects and automatically resolves promise object
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
var _    = require('underscore')._,
    sf   = require('./salesforce');

/**
 * Intercept the evaled value when it is "promise", and resolve its value before sending back to REPL.
 * @private
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
 * @private
 */
function isPromiseLike(v) {
  return _.isObject(v) && _.isFunction(v.then);
}

/**
 * define get accessor using Object.defineProperty
 * @private
 */
function defineProp(target, obj, prop) {
  if (Object.defineProperty) {
    Object.defineProperty(target, prop, {
      get: function() { return obj[prop]; }
    });
  }
}

/**
 * Map all node-salesforce object to REPL context
 * @private
 */
function defineBuiltinVars(context) {
  // define salesforce package root objects
  for (var key in sf) {
    if (sf.hasOwnProperty(key) && !global[key]) {
      context[key] = sf[key];
    }
  }
  // expose salesforce package root as "$sf" in context.
  context.$sf = sf;

  // create default connection object
  var conn = new sf.Connection();

  for (var prop in conn) {
    if (prop.indexOf('_') === 0) { // ignore private
      continue;
    }
    if (_.isFunction(conn[prop])) {
      context[prop] = _.bind(conn[prop], conn);
    } else if (_.isObject(conn[prop])) {
      defineProp(context, conn, prop);
    }
  }

  // expose default connection as "$conn"
  context.$conn = conn;
}

/**
 * @protected
 */
module.exports = function(repl) {
  return {
    start: function(options) {
      var sfrepl = promisify(repl.start(options));
      defineBuiltinVars(sfrepl.context);
      return sfrepl;
    }
  };
};

