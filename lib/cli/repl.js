/*global process, global */
/**
 * @file Creates REPL interface with built in Salesforce API objects and automatically resolves promise object
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
var stream = require('stream'),
    rstream = require('readable-stream'),
    Readable = stream.Readable || rstream.Readable,
    Writable = stream.Writable || rstream.Writable,
    Transform = stream.Transform || rstream.Transform,
    PassThrough = stream.PassThrough || rstream.PassThrough,
    _      = require('underscore'),
    sf     = require('../salesforce');

/**
 * Intercept the evaled value returned from repl evaluator, convert and send back to output.
 * @private
 */
function injectAfter(repl, afterFn) {
  var _eval = repl.eval;
  repl.eval = function(cmd, context, filename, callback) {
    _eval.call(repl, cmd, context, filename, function(err, res) {
      var result;
      try {
        afterFn(err, res, callback);
      } catch(e) {
        callback(e);
      }
    });
  };
  return repl;
}

/**
 * When the result was "promise", resolve its value
 * @private
 */
function promisify(err, value, callback) {
  if (err) { throw err; }
  if (isPromiseLike(value)) {
    value.then(function(v) {
      callback(null, v);
    }, function(err) {
      callback(err);
    });
  } else {
    callback(null, value);
  }
}

/**
 * Detect whether the value has CommonJS Promise/A+ interface or not
 * @private
 */
function isPromiseLike(v) {
  return _.isObject(v) && _.isFunction(v.then);
}

/**
 * Output object to stdout in JSON representation
 * @private
 */
function outputToStdout(prettyPrint) {
  if (prettyPrint && !_.isNumber(prettyPrint)) {
    prettyPrint = 4;
  }
  return function(err, value, callback) {
    if (err) {
      console.error(err);
    } else {
      var str = JSON.stringify(value, null, prettyPrint);
      console.log(str);
    }
    callback(err, value);
  };
}

/**
 *
 */

/**
 * define get accessor using Object.defineProperty
 * @private
 */
function defineProp(obj, prop, getter) {
  if (Object.defineProperty) {
    Object.defineProperty(obj, prop, { get: getter });
  }
}


/**
 *
 */
var Repl = module.exports = function(cli, replModule) {
  this._cli = cli;
  this._replModule = replModule;
  this._in = new Transform();
  this._out = new Transform();
  var self = this;
  this._in._transform = this._out._transform = function(chunk, encoding, callback) {
    if (!self._paused) { this.push(chunk); }
    callback();
  };
};

/**
 *
 */
Repl.prototype.start = function(options) {
  var cli = this._cli;
  options = options || {};

  process.stdin.resume();
  process.stdin.setRawMode(true);
  process.stdin.pipe(this._in);

  this._out.pipe(process.stdout);
  defineProp(this._out, "columns", function() { return process.stdout.columns; });

  var repl = this._replModule.start({
    input: this._in,
    output: this._out,
    terminal: true
  });
  repl.defineCommand('connect', {
    help: 'Connect to Salesforce instance',
    action: function(name) {
      cli.connect(name, null, function(err, res) {
        if (err) { console.error(err); }
        repl.displayPrompt();
      });
    }
  });
  repl.defineCommand('authorize', {
    help: 'Get API tokens using OAuth2 flow',
    action: function(clientName) {
      cli.authorize(clientName, function(err, res) {
        if (err) { console.error(err); }
        repl.displayPrompt();
      });
    }
  });
  repl = injectAfter(repl, promisify);

  if (options.interactive === false) { 
    repl = injectAfter(repl, outputToStdout(options.prettyPrint));
    repl = injectAfter(repl, function() { process.exit(); });
    this._out.pause();
  }
  repl.on('exit', function() { process.exit(); });

  this._defineBuiltinVars(repl.context);

  if (options.evalScript) {
    this._in.write(options.evalScript + "\n", "utf-8");
  }
  return this;
};

Repl.prototype.pause = function() {
  this._paused = true;
};

Repl.prototype.resume = function() {
  this._paused = false;
  process.stdin.resume();
  process.stdin.setRawMode(true);
};


/**
 * Map all node-salesforce object to REPL context
 * @private
 */
Repl.prototype._defineBuiltinVars = function(context) {
  var cli = this._cli;

  // define salesforce package root objects
  for (var key in sf) {
    if (sf.hasOwnProperty(key) && !global[key]) {
      context[key] = sf[key];
    }
  }
  // expose salesforce package root as "$sf" in context.
  context.$sf = sf;

  function createProxyFunc(prop) {
    return function() {
      var conn = cli.getCurrentConnection();
      return conn[prop].apply(conn, arguments);
    };
  }

  function createProxyAccessor(prop) {
    return function() {
      var conn = cli.getCurrentConnection();
      return conn[prop];
    };
  }

  var conn = cli.getCurrentConnection();
  // define connection prototype functions as proxy
  for (var prop in conn) {
    if (prop.indexOf('_') === 0) { // ignore private
      continue;
    }
    if (_.isFunction(conn[prop])) {
      context[prop] = createProxyFunc(prop);
    } else if (_.isObject(conn[prop])) {
      defineProp(context, prop, createProxyAccessor(prop));
    }
  }

  // expose default connection as "$conn"
  defineProp(context, "$conn", function(){ return cli.getCurrentConnection(); });

};
