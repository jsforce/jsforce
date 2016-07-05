(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.jsforce||(g.jsforce = {}));g=(g.modules||(g.modules = {}));g=(g.api||(g.api = {}));g.Streaming = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file Manages Streaming APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var events = window.jsforce.require('events'),
    inherits = window.jsforce.require('inherits'),
    _ = window.jsforce.require('lodash/core'),
    Faye   = require('faye'),
    jsforce = window.jsforce.require('./core');

/**
 * Streaming API topic class
 *
 * @class Streaming~Topic
 * @param {Streaming} steaming - Streaming API object
 * @param {String} name - Topic name
 */
var Topic = function(streaming, name) {
  this._streaming = streaming;
  this.name = name;
};

/**
 * @typedef {Object} Streaming~StreamingMessage
 * @prop {Object} event
 * @prop {Object} event.type - Event type
 * @prop {Record} sobject - Record information
 */
/**
 * Subscribe listener to topic
 *
 * @method Streaming~Topic#subscribe
 * @param {Callback.<Streaming~StreamingMesasge>} listener - Streaming message listener
 * @returns {Subscription} - Faye subscription object
 */
Topic.prototype.subscribe = function(listener) {
  return this._streaming.subscribe(this.name, listener);
};

/**
 * Unsubscribe listener from topic
 *
 * @method Streaming~Topic#unsubscribe
 * @param {Callback.<Streaming~StreamingMesasge>} listener - Streaming message listener
 * @returns {Streaming~Topic}
 */
Topic.prototype.unsubscribe = function(listener) {
  this._streaming.unsubscribe(this.name, listener);
  return this;
};

/*--------------------------------------------*/

/**
 * Streaming API Generic Streaming Channel
 *
 * @class Streaming~Channel
 * @param {Streaming} steaming - Streaming API object
 * @param {String} name - Channel name (starts with "/u/")
 */
var Channel = function(streaming, name) {
  this._streaming = streaming;
  this._name = name;
};

/**
 * Subscribe to hannel
 *
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Subscription} - Faye subscription object
 */
Channel.prototype.subscribe = function(listener) {
  return this._streaming.subscribe(this._name, listener);
};

Channel.prototype.unsubscribe = function(listener) {
  this._streaming.unsubscribe(this._name, listener);
  return this;
};

Channel.prototype.push = function(events, callback) {
  var isArray = _.isArray(events);
  events = isArray ? events : [ events ];
  var conn = this._streaming._conn;
  if (!this._id) {
    this._id = conn.sobject('StreamingChannel').findOne({ Name: this._name }, 'Id')
      .then(function(rec) { return rec.Id });
  }
  return this._id.then(function(id) {
    var channelUrl = '/sobjects/StreamingChannel/' + id + '/push';
    return conn.requestPost(channelUrl, { pushEvents: events });
  }).then(function(rets) {
    return isArray ? rets : rets[0];
  }).thenCall(callback);
};

/*--------------------------------------------*/

/**
 * Streaming API class
 *
 * @class
 * @extends events.EventEmitter
 * @param {Connection} conn - Connection object
 */
var Streaming = function(conn) {
  this._conn = conn;
};

inherits(Streaming, events.EventEmitter);

/** @private **/
Streaming.prototype._createClient = function(replay) {
  var endpointUrl = [ this._conn.instanceUrl, "cometd" + (replay ? "/replay" : ""), this._conn.version ].join('/');
  var fayeClient = new Faye.Client(endpointUrl, {});
  fayeClient.setHeader('Authorization', 'OAuth '+this._conn.accessToken);
  return fayeClient;
};

/** @private **/
Streaming.prototype._getFayeClient = function(channelName) {
  var isGeneric = channelName.indexOf('/u/') === 0;
  var clientType = isGeneric ? 'generic' : 'pushTopic';
  if (!this._fayeClients || !this._fayeClients[clientType]) {
    this._fayeClients = this._fayeClients || {};
    this._fayeClients[clientType] = this._createClient(isGeneric);
    if (this._fayeClients[clientType]._dispatcher.getConnectionTypes().indexOf('callback-polling') === -1) {
      // prevent streaming API server error
      this._fayeClients[clientType]._dispatcher.selectTransport('long-polling');
      this._fayeClients[clientType]._dispatcher._transport.batching = false;
    }
  }
  return this._fayeClients[clientType];
};


/**
 * Get named topic
 *
 * @param {String} name - Topic name
 * @returns {Streaming~Topic}
 */
Streaming.prototype.topic = function(name) {
  this._topics = this._topics || {};
  var topic = this._topics[name] =
    this._topics[name] || new Topic(this, name);
  return topic;
};

/**
 * Get Channel for Id
 * @param {String} channelId - Id of StreamingChannel object
 * @returns {Streaming~Channel}
 */
Streaming.prototype.channel = function(channelId) {
  return new Channel(this, channelId);
};

/**
 * Subscribe topic/channel
 *
 * @param {String} name - Topic name
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Subscription} - Faye subscription object
 */
Streaming.prototype.subscribe = function(name, listener) {
  var channelName = name.indexOf('/') === 0 ? name : '/topic/' + name;
  var fayeClient = this._getFayeClient(channelName);
  return fayeClient.subscribe(channelName, listener);
};

/**
 * Unsubscribe topic
 *
 * @param {String} name - Topic name
 * @param {Callback.<Streaming~StreamingMessage>} listener - Streaming message listener
 * @returns {Streaming}
 */
Streaming.prototype.unsubscribe = function(name, listener) {
  var channelName = name.indexOf('/') === 0 ? name : '/topic/' + name;
  var fayeClient = this._getFayeClient(channelName);
  fayeClient.unsubscribe(channelName, listener);
  return this;
};


/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
jsforce.on('connection:new', function(conn) {
  conn.streaming = new Streaming(conn);
});


module.exports = Streaming;

},{"faye":5}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":4}],4:[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
'use strict';

var constants = require('./util/constants'),
    Logging   = require('./mixins/logging');

var Faye = {
  VERSION:    constants.VERSION,

  Client:     require('./protocol/client'),
  Scheduler:  require('./protocol/scheduler')
};

Logging.wrapper = Faye;

module.exports = Faye;

},{"./mixins/logging":7,"./protocol/client":11,"./protocol/scheduler":17,"./util/constants":29}],6:[function(require,module,exports){
(function (global){
'use strict';

var Promise   = require('../util/promise');

module.exports = {
  then: function(callback, errback) {
    var self = this;
    if (!this._promise)
      this._promise = new Promise(function(resolve, reject) {
        self._resolve = resolve;
        self._reject  = reject;
      });

    if (arguments.length === 0)
      return this._promise;
    else
      return this._promise.then(callback, errback);
  },

  callback: function(callback, context) {
    return this.then(function(value) { callback.call(context, value) });
  },

  errback: function(callback, context) {
    return this.then(null, function(reason) { callback.call(context, reason) });
  },

  timeout: function(seconds, message) {
    this.then();
    var self = this;
    this._timer = global.setTimeout(function() {
      self._reject(message);
    }, seconds * 1000);
  },

  setDeferredStatus: function(status, value) {
    if (this._timer) global.clearTimeout(this._timer);

    this.then();

    if (status === 'succeeded')
      this._resolve(value);
    else if (status === 'failed')
      this._reject(value);
    else
      delete this._promise;
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../util/promise":34}],7:[function(require,module,exports){
'use strict';

var toJSON = require('../util/to_json');

var Logging = {
  LOG_LEVELS: {
    fatal:  4,
    error:  3,
    warn:   2,
    info:   1,
    debug:  0
  },

  writeLog: function(messageArgs, level) {
    var logger = Logging.logger || (Logging.wrapper || Logging).logger;
    if (!logger) return;

    var args   = Array.prototype.slice.apply(messageArgs),
        banner = '[Faye',
        klass  = this.className,

        message = args.shift().replace(/\?/g, function() {
          try {
            return toJSON(args.shift());
          } catch (error) {
            return '[Object]';
          }
        });

    if (klass) banner += '.' + klass;
    banner += '] ';

    if (typeof logger[level] === 'function')
      logger[level](banner + message);
    else if (typeof logger === 'function')
      logger(banner + message);
  }
};

for (var key in Logging.LOG_LEVELS)
  (function(level) {
    Logging[level] = function() {
      this.writeLog(arguments, level);
    };
  })(key);

module.exports = Logging;

},{"../util/to_json":36}],8:[function(require,module,exports){
'use strict';

var extend       = require('../util/extend'),
    EventEmitter = require('../util/event_emitter');

var Publisher = {
  countListeners: function(eventType) {
    return this.listeners(eventType).length;
  },

  bind: function(eventType, listener, context) {
    var slice   = Array.prototype.slice,
        handler = function() { listener.apply(context, slice.call(arguments)) };

    this._listeners = this._listeners || [];
    this._listeners.push([eventType, listener, context, handler]);
    return this.on(eventType, handler);
  },

  unbind: function(eventType, listener, context) {
    this._listeners = this._listeners || [];
    var n = this._listeners.length, tuple;

    while (n--) {
      tuple = this._listeners[n];
      if (tuple[0] !== eventType) continue;
      if (listener && (tuple[1] !== listener || tuple[2] !== context)) continue;
      this._listeners.splice(n, 1);
      this.removeListener(eventType, tuple[3]);
    }
  }
};

extend(Publisher, EventEmitter.prototype);
Publisher.trigger = Publisher.emit;

module.exports = Publisher;

},{"../util/event_emitter":32,"../util/extend":33}],9:[function(require,module,exports){
(function (global){
'use strict';

module.exports = {
  addTimeout: function(name, delay, callback, context) {
    this._timeouts = this._timeouts || {};
    if (this._timeouts.hasOwnProperty(name)) return;
    var self = this;
    this._timeouts[name] = global.setTimeout(function() {
      delete self._timeouts[name];
      callback.call(context);
    }, 1000 * delay);
  },

  removeTimeout: function(name) {
    this._timeouts = this._timeouts || {};
    var timeout = this._timeouts[name];
    if (!timeout) return;
    global.clearTimeout(timeout);
    delete this._timeouts[name];
  },

  removeAllTimeouts: function() {
    this._timeouts = this._timeouts || {};
    for (var name in this._timeouts) this.removeTimeout(name);
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],10:[function(require,module,exports){
'use strict';

var Class     = require('../util/class'),
    extend    = require('../util/extend'),
    Publisher = require('../mixins/publisher'),
    Grammar   = require('./grammar');

var Channel = Class({
  initialize: function(name) {
    this.id = this.name = name;
  },

  push: function(message) {
    this.trigger('message', message);
  },

  isUnused: function() {
    return this.countListeners('message') === 0;
  }
});

extend(Channel.prototype, Publisher);

extend(Channel, {
  HANDSHAKE:    '/meta/handshake',
  CONNECT:      '/meta/connect',
  SUBSCRIBE:    '/meta/subscribe',
  UNSUBSCRIBE:  '/meta/unsubscribe',
  DISCONNECT:   '/meta/disconnect',

  META:         'meta',
  SERVICE:      'service',

  expand: function(name) {
    var segments = this.parse(name),
        channels = ['/**', name];

    var copy = segments.slice();
    copy[copy.length - 1] = '*';
    channels.push(this.unparse(copy));

    for (var i = 1, n = segments.length; i < n; i++) {
      copy = segments.slice(0, i);
      copy.push('**');
      channels.push(this.unparse(copy));
    }

    return channels;
  },

  isValid: function(name) {
    return Grammar.CHANNEL_NAME.test(name) ||
           Grammar.CHANNEL_PATTERN.test(name);
  },

  parse: function(name) {
    if (!this.isValid(name)) return null;
    return name.split('/').slice(1);
  },

  unparse: function(segments) {
    return '/' + segments.join('/');
  },

  isMeta: function(name) {
    var segments = this.parse(name);
    return segments ? (segments[0] === this.META) : null;
  },

  isService: function(name) {
    var segments = this.parse(name);
    return segments ? (segments[0] === this.SERVICE) : null;
  },

  isSubscribable: function(name) {
    if (!this.isValid(name)) return null;
    return !this.isMeta(name) && !this.isService(name);
  },

  Set: Class({
    initialize: function() {
      this._channels = {};
    },

    getKeys: function() {
      var keys = [];
      for (var key in this._channels) keys.push(key);
      return keys;
    },

    remove: function(name) {
      delete this._channels[name];
    },

    hasSubscription: function(name) {
      return this._channels.hasOwnProperty(name);
    },

    subscribe: function(names, subscription) {
      var name;
      for (var i = 0, n = names.length; i < n; i++) {
        name = names[i];
        var channel = this._channels[name] = this._channels[name] || new Channel(name);
        channel.bind('message', subscription);
      }
    },

    unsubscribe: function(name, subscription) {
      var channel = this._channels[name];
      if (!channel) return false;
      channel.unbind('message', subscription);

      if (channel.isUnused()) {
        this.remove(name);
        return true;
      } else {
        return false;
      }
    },

    distributeMessage: function(message) {
      var channels = Channel.expand(message.channel);

      for (var i = 0, n = channels.length; i < n; i++) {
        var channel = this._channels[channels[i]];
        if (channel) channel.trigger('message', message);
      }
    }
  })
});

module.exports = Channel;

},{"../mixins/publisher":8,"../util/class":28,"../util/extend":33,"./grammar":15}],11:[function(require,module,exports){
(function (global){
'use strict';

var asap            = require('asap'),
    Class           = require('../util/class'),
    Promise         = require('../util/promise'),
    URI             = require('../util/uri'),
    array           = require('../util/array'),
    browser         = require('../util/browser'),
    constants       = require('../util/constants'),
    extend          = require('../util/extend'),
    validateOptions = require('../util/validate_options'),
    Deferrable      = require('../mixins/deferrable'),
    Logging         = require('../mixins/logging'),
    Publisher       = require('../mixins/publisher'),
    Channel         = require('./channel'),
    Dispatcher      = require('./dispatcher'),
    Error           = require('./error'),
    Extensible      = require('./extensible'),
    Publication     = require('./publication'),
    Subscription    = require('./subscription');

var Client = Class({ className: 'Client',
  UNCONNECTED:        1,
  CONNECTING:         2,
  CONNECTED:          3,
  DISCONNECTED:       4,

  HANDSHAKE:          'handshake',
  RETRY:              'retry',
  NONE:               'none',

  CONNECTION_TIMEOUT: 60,

  DEFAULT_ENDPOINT:   '/bayeux',
  INTERVAL:           0,

  initialize: function(endpoint, options) {
    this.info('New client created for ?', endpoint);
    options = options || {};

    validateOptions(options, ['interval', 'timeout', 'endpoints', 'proxy', 'retry', 'scheduler', 'websocketExtensions', 'tls', 'ca']);

    this._channels   = new Channel.Set();
    this._dispatcher = Dispatcher.create(this, endpoint || this.DEFAULT_ENDPOINT, options);

    this._messageId = 0;
    this._state     = this.UNCONNECTED;

    this._responseCallbacks = {};

    this._advice = {
      reconnect: this.RETRY,
      interval:  1000 * (options.interval || this.INTERVAL),
      timeout:   1000 * (options.timeout  || this.CONNECTION_TIMEOUT)
    };
    this._dispatcher.timeout = this._advice.timeout / 1000;

    this._dispatcher.bind('message', this._receiveMessage, this);

    if (browser.Event && global.onbeforeunload !== undefined)
      browser.Event.on(global, 'beforeunload', function() {
        if (array.indexOf(this._dispatcher._disabled, 'autodisconnect') < 0)
          this.disconnect();
      }, this);
  },

  addWebsocketExtension: function(extension) {
    return this._dispatcher.addWebsocketExtension(extension);
  },

  disable: function(feature) {
    return this._dispatcher.disable(feature);
  },

  setHeader: function(name, value) {
    return this._dispatcher.setHeader(name, value);
  },

  // Request
  // MUST include:  * channel
  //                * version
  //                * supportedConnectionTypes
  // MAY include:   * minimumVersion
  //                * ext
  //                * id
  //
  // Success Response                             Failed Response
  // MUST include:  * channel                     MUST include:  * channel
  //                * version                                    * successful
  //                * supportedConnectionTypes                   * error
  //                * clientId                    MAY include:   * supportedConnectionTypes
  //                * successful                                 * advice
  // MAY include:   * minimumVersion                             * version
  //                * advice                                     * minimumVersion
  //                * ext                                        * ext
  //                * id                                         * id
  //                * authSuccessful
  handshake: function(callback, context) {
    if (this._advice.reconnect === this.NONE) return;
    if (this._state !== this.UNCONNECTED) return;

    this._state = this.CONNECTING;
    var self = this;

    this.info('Initiating handshake with ?', URI.stringify(this._dispatcher.endpoint));
    this._dispatcher.selectTransport(constants.MANDATORY_CONNECTION_TYPES);

    this._sendMessage({
      channel:                  Channel.HANDSHAKE,
      version:                  constants.BAYEUX_VERSION,
      supportedConnectionTypes: this._dispatcher.getConnectionTypes()

    }, {}, function(response) {

      if (response.successful) {
        this._state = this.CONNECTED;
        this._dispatcher.clientId  = response.clientId;

        this._dispatcher.selectTransport(response.supportedConnectionTypes);

        this.info('Handshake successful: ?', this._dispatcher.clientId);

        this.subscribe(this._channels.getKeys(), true);
        if (callback) asap(function() { callback.call(context) });

      } else {
        this.info('Handshake unsuccessful');
        global.setTimeout(function() { self.handshake(callback, context) }, this._dispatcher.retry * 1000);
        this._state = this.UNCONNECTED;
      }
    }, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * connectionType                     * clientId
  // MAY include:   * ext                 MAY include:   * error
  //                * id                                 * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  connect: function(callback, context) {
    if (this._advice.reconnect === this.NONE) return;
    if (this._state === this.DISCONNECTED) return;

    if (this._state === this.UNCONNECTED)
      return this.handshake(function() { this.connect(callback, context) }, this);

    this.callback(callback, context);
    if (this._state !== this.CONNECTED) return;

    this.info('Calling deferred actions for ?', this._dispatcher.clientId);
    this.setDeferredStatus('succeeded');
    this.setDeferredStatus('unknown');

    if (this._connectRequest) return;
    this._connectRequest = true;

    this.info('Initiating connection for ?', this._dispatcher.clientId);

    this._sendMessage({
      channel:        Channel.CONNECT,
      clientId:       this._dispatcher.clientId,
      connectionType: this._dispatcher.connectionType

    }, {}, this._cycleConnection, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  // MAY include:   * ext                                * clientId
  //                * id                  MAY include:   * error
  //                                                     * ext
  //                                                     * id
  disconnect: function() {
    if (this._state !== this.CONNECTED) return;
    this._state = this.DISCONNECTED;

    this.info('Disconnecting ?', this._dispatcher.clientId);
    var promise = new Publication();

    this._sendMessage({
      channel:  Channel.DISCONNECT,
      clientId: this._dispatcher.clientId

    }, {}, function(response) {
      if (response.successful) {
        this._dispatcher.close();
        promise.setDeferredStatus('succeeded');
      } else {
        promise.setDeferredStatus('failed', Error.parse(response.error));
      }
    }, this);

    this.info('Clearing channel listeners for ?', this._dispatcher.clientId);
    this._channels = new Channel.Set();

    return promise;
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * subscription                       * clientId
  // MAY include:   * ext                                * subscription
  //                * id                  MAY include:   * error
  //                                                     * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  subscribe: function(channel, callback, context) {
    if (channel instanceof Array)
      return array.map(channel, function(c) {
        return this.subscribe(c, callback, context);
      }, this);

    var subscription = new Subscription(this, channel, callback, context),
        force        = (callback === true),
        hasSubscribe = this._channels.hasSubscription(channel);

    if (hasSubscribe && !force) {
      this._channels.subscribe([channel], subscription);
      subscription.setDeferredStatus('succeeded');
      return subscription;
    }

    this.connect(function() {
      this.info('Client ? attempting to subscribe to ?', this._dispatcher.clientId, channel);
      if (!force) this._channels.subscribe([channel], subscription);

      this._sendMessage({
        channel:      Channel.SUBSCRIBE,
        clientId:     this._dispatcher.clientId,
        subscription: channel

      }, {}, function(response) {
        if (!response.successful) {
          subscription.setDeferredStatus('failed', Error.parse(response.error));
          return this._channels.unsubscribe(channel, subscription);
        }

        var channels = [].concat(response.subscription);
        this.info('Subscription acknowledged for ? to ?', this._dispatcher.clientId, channels);
        subscription.setDeferredStatus('succeeded');
      }, this);
    }, this);

    return subscription;
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * clientId                           * successful
  //                * subscription                       * clientId
  // MAY include:   * ext                                * subscription
  //                * id                  MAY include:   * error
  //                                                     * advice
  //                                                     * ext
  //                                                     * id
  //                                                     * timestamp
  unsubscribe: function(channel, subscription) {
    if (channel instanceof Array)
      return array.map(channel, function(c) {
        return this.unsubscribe(c, subscription);
      }, this);

    var dead = this._channels.unsubscribe(channel, subscription);
    if (!dead) return;

    this.connect(function() {
      this.info('Client ? attempting to unsubscribe from ?', this._dispatcher.clientId, channel);

      this._sendMessage({
        channel:      Channel.UNSUBSCRIBE,
        clientId:     this._dispatcher.clientId,
        subscription: channel

      }, {}, function(response) {
        if (!response.successful) return;

        var channels = [].concat(response.subscription);
        this.info('Unsubscription acknowledged for ? from ?', this._dispatcher.clientId, channels);
      }, this);
    }, this);
  },

  // Request                              Response
  // MUST include:  * channel             MUST include:  * channel
  //                * data                               * successful
  // MAY include:   * clientId            MAY include:   * id
  //                * id                                 * error
  //                * ext                                * ext
  publish: function(channel, data, options) {
    validateOptions(options || {}, ['attempts', 'deadline']);
    var publication = new Publication();

    this.connect(function() {
      this.info('Client ? queueing published message to ?: ?', this._dispatcher.clientId, channel, data);

      this._sendMessage({
        channel:  channel,
        data:     data,
        clientId: this._dispatcher.clientId

      }, options, function(response) {
        if (response.successful)
          publication.setDeferredStatus('succeeded');
        else
          publication.setDeferredStatus('failed', Error.parse(response.error));
      }, this);
    }, this);

    return publication;
  },

  _sendMessage: function(message, options, callback, context) {
    message.id = this._generateMessageId();

    var timeout = this._advice.timeout
                ? 1.2 * this._advice.timeout / 1000
                : 1.2 * this._dispatcher.retry;

    this.pipeThroughExtensions('outgoing', message, null, function(message) {
      if (!message) return;
      if (callback) this._responseCallbacks[message.id] = [callback, context];
      this._dispatcher.sendMessage(message, timeout, options || {});
    }, this);
  },

  _generateMessageId: function() {
    this._messageId += 1;
    if (this._messageId >= Math.pow(2,32)) this._messageId = 0;
    return this._messageId.toString(36);
  },

  _receiveMessage: function(message) {
    var id = message.id, callback;

    if (message.successful !== undefined) {
      callback = this._responseCallbacks[id];
      delete this._responseCallbacks[id];
    }

    this.pipeThroughExtensions('incoming', message, null, function(message) {
      if (!message) return;
      if (message.advice) this._handleAdvice(message.advice);
      this._deliverMessage(message);
      if (callback) callback[0].call(callback[1], message);
    }, this);
  },

  _handleAdvice: function(advice) {
    extend(this._advice, advice);
    this._dispatcher.timeout = this._advice.timeout / 1000;

    if (this._advice.reconnect === this.HANDSHAKE && this._state !== this.DISCONNECTED) {
      this._state = this.UNCONNECTED;
      this._dispatcher.clientId = null;
      this._cycleConnection();
    }
  },

  _deliverMessage: function(message) {
    if (!message.channel || message.data === undefined) return;
    this.info('Client ? calling listeners for ? with ?', this._dispatcher.clientId, message.channel, message.data);
    this._channels.distributeMessage(message);
  },

  _cycleConnection: function() {
    if (this._connectRequest) {
      this._connectRequest = null;
      this.info('Closed connection for ?', this._dispatcher.clientId);
    }
    var self = this;
    global.setTimeout(function() { self.connect() }, this._advice.interval);
  }
});

extend(Client.prototype, Deferrable);
extend(Client.prototype, Publisher);
extend(Client.prototype, Logging);
extend(Client.prototype, Extensible);

module.exports = Client;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/deferrable":6,"../mixins/logging":7,"../mixins/publisher":8,"../util/array":26,"../util/browser":27,"../util/class":28,"../util/constants":29,"../util/extend":33,"../util/promise":34,"../util/uri":37,"../util/validate_options":38,"./channel":10,"./dispatcher":12,"./error":13,"./extensible":14,"./publication":16,"./subscription":18,"asap":3}],12:[function(require,module,exports){
(function (global){
'use strict';

var Class     = require('../util/class'),
    URI       = require('../util/uri'),
    cookies   = require('../util/cookies'),
    extend    = require('../util/extend'),
    Logging   = require('../mixins/logging'),
    Publisher = require('../mixins/publisher'),
    Transport = require('../transport'),
    Scheduler = require('./scheduler');

var Dispatcher = Class({ className: 'Dispatcher',
  MAX_REQUEST_SIZE: 2048,
  DEFAULT_RETRY:    5,

  UP:   1,
  DOWN: 2,

  initialize: function(client, endpoint, options) {
    this._client     = client;
    this.endpoint    = URI.parse(endpoint);
    this._alternates = options.endpoints || {};

    this.cookies      = cookies.CookieJar && new cookies.CookieJar();
    this._disabled    = [];
    this._envelopes   = {};
    this.headers      = {};
    this.retry        = options.retry || this.DEFAULT_RETRY;
    this._scheduler   = options.scheduler || Scheduler;
    this._state       = 0;
    this.transports   = {};
    this.wsExtensions = [];

    this.proxy = options.proxy || {};
    if (typeof this._proxy === 'string') this._proxy = {origin: this._proxy};

    var exts = options.websocketExtensions;
    if (exts) {
      exts = [].concat(exts);
      for (var i = 0, n = exts.length; i < n; i++)
        this.addWebsocketExtension(exts[i]);
    }

    this.tls = options.tls || {};
    this.tls.ca = this.tls.ca || options.ca;

    for (var type in this._alternates)
      this._alternates[type] = URI.parse(this._alternates[type]);

    this.maxRequestSize = this.MAX_REQUEST_SIZE;
  },

  endpointFor: function(connectionType) {
    return this._alternates[connectionType] || this.endpoint;
  },

  addWebsocketExtension: function(extension) {
    this.wsExtensions.push(extension);
  },

  disable: function(feature) {
    this._disabled.push(feature);
  },

  setHeader: function(name, value) {
    this.headers[name] = value;
  },

  close: function() {
    var transport = this._transport;
    delete this._transport;
    if (transport) transport.close();
  },

  getConnectionTypes: function() {
    return Transport.getConnectionTypes();
  },

  selectTransport: function(transportTypes) {
    Transport.get(this, transportTypes, this._disabled, function(transport) {
      this.debug('Selected ? transport for ?', transport.connectionType, URI.stringify(transport.endpoint));

      if (transport === this._transport) return;
      if (this._transport) this._transport.close();

      this._transport = transport;
      this.connectionType = transport.connectionType;
    }, this);
  },

  sendMessage: function(message, timeout, options) {
    options = options || {};

    var id       = message.id,
        attempts = options.attempts,
        deadline = options.deadline && new Date().getTime() + (options.deadline * 1000),
        envelope = this._envelopes[id],
        scheduler;

    if (!envelope) {
      scheduler = new this._scheduler(message, {timeout: timeout, interval: this.retry, attempts: attempts, deadline: deadline});
      envelope  = this._envelopes[id] = {message: message, scheduler: scheduler};
    }

    this._sendEnvelope(envelope);
  },

  _sendEnvelope: function(envelope) {
    if (!this._transport) return;
    if (envelope.request || envelope.timer) return;

    var message   = envelope.message,
        scheduler = envelope.scheduler,
        self      = this;

    if (!scheduler.isDeliverable()) {
      scheduler.abort();
      delete this._envelopes[message.id];
      return;
    }

    envelope.timer = global.setTimeout(function() {
      self.handleError(message);
    }, scheduler.getTimeout() * 1000);

    scheduler.send();
    envelope.request = this._transport.sendMessage(message);
  },

  handleResponse: function(reply) {
    var envelope = this._envelopes[reply.id];

    if (reply.successful !== undefined && envelope) {
      envelope.scheduler.succeed();
      delete this._envelopes[reply.id];
      global.clearTimeout(envelope.timer);
    }

    this.trigger('message', reply);

    if (this._state === this.UP) return;
    this._state = this.UP;
    this._client.trigger('transport:up');
  },

  handleError: function(message, immediate) {
    var envelope = this._envelopes[message.id],
        request  = envelope && envelope.request,
        self     = this;

    if (!request) return;

    request.then(function(req) {
      if (req && req.abort) req.abort();
    });

    var scheduler = envelope.scheduler;
    scheduler.fail();

    global.clearTimeout(envelope.timer);
    envelope.request = envelope.timer = null;

    if (immediate) {
      this._sendEnvelope(envelope);
    } else {
      envelope.timer = global.setTimeout(function() {
        envelope.timer = null;
        self._sendEnvelope(envelope);
      }, scheduler.getInterval() * 1000);
    }

    if (this._state === this.DOWN) return;
    this._state = this.DOWN;
    this._client.trigger('transport:down');
  }
});

Dispatcher.create = function(client, endpoint, options) {
  return new Dispatcher(client, endpoint, options);
};

extend(Dispatcher.prototype, Publisher);
extend(Dispatcher.prototype, Logging);

module.exports = Dispatcher;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/logging":7,"../mixins/publisher":8,"../transport":19,"../util/class":28,"../util/cookies":30,"../util/extend":33,"../util/uri":37,"./scheduler":17}],13:[function(require,module,exports){
'use strict';

var Class   = require('../util/class'),
    Grammar = require('./grammar');

var Error = Class({
  initialize: function(code, params, message) {
    this.code    = code;
    this.params  = Array.prototype.slice.call(params);
    this.message = message;
  },

  toString: function() {
    return this.code + ':' +
           this.params.join(',') + ':' +
           this.message;
  }
});

Error.parse = function(message) {
  message = message || '';
  if (!Grammar.ERROR.test(message)) return new Error(null, [], message);

  var parts   = message.split(':'),
      code    = parseInt(parts[0]),
      params  = parts[1].split(','),
      message = parts[2];

  return new Error(code, params, message);
};

// http://code.google.com/p/cometd/wiki/BayeuxCodes
var errors = {
  versionMismatch:  [300, 'Version mismatch'],
  conntypeMismatch: [301, 'Connection types not supported'],
  extMismatch:      [302, 'Extension mismatch'],
  badRequest:       [400, 'Bad request'],
  clientUnknown:    [401, 'Unknown client'],
  parameterMissing: [402, 'Missing required parameter'],
  channelForbidden: [403, 'Forbidden channel'],
  channelUnknown:   [404, 'Unknown channel'],
  channelInvalid:   [405, 'Invalid channel'],
  extUnknown:       [406, 'Unknown extension'],
  publishFailed:    [407, 'Failed to publish'],
  serverError:      [500, 'Internal server error']
};

for (var name in errors)
  (function(name) {
    Error[name] = function() {
      return new Error(errors[name][0], arguments, errors[name][1]).toString();
    };
  })(name);

module.exports = Error;

},{"../util/class":28,"./grammar":15}],14:[function(require,module,exports){
'use strict';

var extend  = require('../util/extend'),
    Logging = require('../mixins/logging');

var Extensible = {
  addExtension: function(extension) {
    this._extensions = this._extensions || [];
    this._extensions.push(extension);
    if (extension.added) extension.added(this);
  },

  removeExtension: function(extension) {
    if (!this._extensions) return;
    var i = this._extensions.length;
    while (i--) {
      if (this._extensions[i] !== extension) continue;
      this._extensions.splice(i,1);
      if (extension.removed) extension.removed(this);
    }
  },

  pipeThroughExtensions: function(stage, message, request, callback, context) {
    this.debug('Passing through ? extensions: ?', stage, message);

    if (!this._extensions) return callback.call(context, message);
    var extensions = this._extensions.slice();

    var pipe = function(message) {
      if (!message) return callback.call(context, message);

      var extension = extensions.shift();
      if (!extension) return callback.call(context, message);

      var fn = extension[stage];
      if (!fn) return pipe(message);

      if (fn.length >= 3) extension[stage](message, request, pipe);
      else                extension[stage](message, pipe);
    };
    pipe(message);
  }
};

extend(Extensible, Logging);

module.exports = Extensible;

},{"../mixins/logging":7,"../util/extend":33}],15:[function(require,module,exports){
'use strict';

module.exports = {
  CHANNEL_NAME:     /^\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*$/,
  CHANNEL_PATTERN:  /^(\/(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)))+)*\/\*{1,2}$/,
  ERROR:            /^([0-9][0-9][0-9]:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*(,(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)*:(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*|[0-9][0-9][0-9]::(((([a-z]|[A-Z])|[0-9])|(\-|\_|\!|\~|\(|\)|\$|\@)| |\/|\*|\.))*)$/,
  VERSION:          /^([0-9])+(\.(([a-z]|[A-Z])|[0-9])(((([a-z]|[A-Z])|[0-9])|\-|\_))*)*$/
};

},{}],16:[function(require,module,exports){
'use strict';

var Class      = require('../util/class'),
    Deferrable = require('../mixins/deferrable');

module.exports = Class(Deferrable);

},{"../mixins/deferrable":6,"../util/class":28}],17:[function(require,module,exports){
'use strict';

var extend = require('../util/extend');

var Scheduler = function(message, options) {
  this.message  = message;
  this.options  = options;
  this.attempts = 0;
};

extend(Scheduler.prototype, {
  getTimeout: function() {
    return this.options.timeout;
  },

  getInterval: function() {
    return this.options.interval;
  },

  isDeliverable: function() {
    var attempts = this.options.attempts,
        made     = this.attempts,
        deadline = this.options.deadline,
        now      = new Date().getTime();

    if (attempts !== undefined && made >= attempts)
      return false;

    if (deadline !== undefined && now > deadline)
      return false;

    return true;
  },

  send: function() {
    this.attempts += 1;
  },

  succeed: function() {},

  fail: function() {},

  abort: function() {}
});

module.exports = Scheduler;

},{"../util/extend":33}],18:[function(require,module,exports){
'use strict';

var Class      = require('../util/class'),
    extend     = require('../util/extend'),
    Deferrable = require('../mixins/deferrable');

var Subscription = Class({
  initialize: function(client, channels, callback, context) {
    this._client    = client;
    this._channels  = channels;
    this._callback  = callback;
    this._context   = context;
    this._cancelled = false;
  },

  withChannel: function(callback, context) {
    this._withChannel = [callback, context];
    return this;
  },

  apply: function(context, args) {
    var message = args[0];

    if (this._callback)
      this._callback.call(this._context, message.data);

    if (this._withChannel)
      this._withChannel[0].call(this._withChannel[1], message.channel, message.data);
  },

  cancel: function() {
    if (this._cancelled) return;
    this._client.unsubscribe(this._channels, this);
    this._cancelled = true;
  },

  unsubscribe: function() {
    this.cancel();
  }
});

extend(Subscription.prototype, Deferrable);

module.exports = Subscription;

},{"../mixins/deferrable":6,"../util/class":28,"../util/extend":33}],19:[function(require,module,exports){
'use strict';

var Transport = require('./transport');

Transport.register('websocket', require('./web_socket'));
Transport.register('eventsource', require('./event_source'));
Transport.register('long-polling', require('./xhr'));
Transport.register('cross-origin-long-polling', require('./cors'));
Transport.register('callback-polling', require('./jsonp'));

module.exports = Transport;

},{"./cors":20,"./event_source":21,"./jsonp":22,"./transport":23,"./web_socket":24,"./xhr":25}],20:[function(require,module,exports){
(function (global){
'use strict';

var Class     = require('../util/class'),
    Set       = require('../util/set'),
    URI       = require('../util/uri'),
    extend    = require('../util/extend'),
    toJSON    = require('../util/to_json'),
    Transport = require('./transport');

var CORS = extend(Class(Transport, {
  encode: function(messages) {
    return 'message=' + encodeURIComponent(toJSON(messages));
  },

  request: function(messages) {
    var xhrClass = global.XDomainRequest ? XDomainRequest : XMLHttpRequest,
        xhr      = new xhrClass(),
        id       = ++CORS._id,
        headers  = this._dispatcher.headers,
        self     = this,
        key;

    xhr.open('POST', URI.stringify(this.endpoint), true);

    if (xhr.setRequestHeader) {
      xhr.setRequestHeader('Pragma', 'no-cache');
      for (key in headers) {
        if (!headers.hasOwnProperty(key)) continue;
        xhr.setRequestHeader(key, headers[key]);
      }
    }

    var cleanUp = function() {
      if (!xhr) return false;
      CORS._pending.remove(id);
      xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onprogress = null;
      xhr = null;
    };

    xhr.onload = function() {
      var replies;
      try { replies = JSON.parse(xhr.responseText) } catch (error) {}

      cleanUp();

      if (replies)
        self._receive(replies);
      else
        self._handleError(messages);
    };

    xhr.onerror = xhr.ontimeout = function() {
      cleanUp();
      self._handleError(messages);
    };

    xhr.onprogress = function() {};

    if (xhrClass === global.XDomainRequest)
      CORS._pending.add({id: id, xhr: xhr});

    xhr.send(this.encode(messages));
    return xhr;
  }
}), {
  _id:      0,
  _pending: new Set(),

  isUsable: function(dispatcher, endpoint, callback, context) {
    if (URI.isSameOrigin(endpoint))
      return callback.call(context, false);

    if (global.XDomainRequest)
      return callback.call(context, endpoint.protocol === location.protocol);

    if (global.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
      return callback.call(context, xhr.withCredentials !== undefined);
    }
    return callback.call(context, false);
  }
});

module.exports = CORS;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../util/class":28,"../util/extend":33,"../util/set":35,"../util/to_json":36,"../util/uri":37,"./transport":23}],21:[function(require,module,exports){
(function (global){
'use strict';

var Class      = require('../util/class'),
    URI        = require('../util/uri'),
    copyObject = require('../util/copy_object'),
    extend     = require('../util/extend'),
    Deferrable = require('../mixins/deferrable'),
    Transport  = require('./transport'),
    XHR        = require('./xhr');

var EventSource = extend(Class(Transport, {
  initialize: function(dispatcher, endpoint) {
    Transport.prototype.initialize.call(this, dispatcher, endpoint);
    if (!global.EventSource) return this.setDeferredStatus('failed');

    this._xhr = new XHR(dispatcher, endpoint);

    endpoint = copyObject(endpoint);
    endpoint.pathname += '/' + dispatcher.clientId;

    var socket = new global.EventSource(URI.stringify(endpoint)),
        self   = this;

    socket.onopen = function() {
      self._everConnected = true;
      self.setDeferredStatus('succeeded');
    };

    socket.onerror = function() {
      if (self._everConnected) {
        self._handleError([]);
      } else {
        self.setDeferredStatus('failed');
        socket.close();
      }
    };

    socket.onmessage = function(event) {
      var replies;
      try { replies = JSON.parse(event.data) } catch (error) {}

      if (replies)
        self._receive(replies);
      else
        self._handleError([]);
    };

    this._socket = socket;
  },

  close: function() {
    if (!this._socket) return;
    this._socket.onopen = this._socket.onerror = this._socket.onmessage = null;
    this._socket.close();
    delete this._socket;
  },

  isUsable: function(callback, context) {
    this.callback(function() { callback.call(context, true) });
    this.errback(function() { callback.call(context, false) });
  },

  encode: function(messages) {
    return this._xhr.encode(messages);
  },

  request: function(messages) {
    return this._xhr.request(messages);
  }

}), {
  isUsable: function(dispatcher, endpoint, callback, context) {
    var id = dispatcher.clientId;
    if (!id) return callback.call(context, false);

    XHR.isUsable(dispatcher, endpoint, function(usable) {
      if (!usable) return callback.call(context, false);
      this.create(dispatcher, endpoint).isUsable(callback, context);
    }, this);
  },

  create: function(dispatcher, endpoint) {
    var sockets = dispatcher.transports.eventsource = dispatcher.transports.eventsource || {},
        id      = dispatcher.clientId;

    var url = copyObject(endpoint);
    url.pathname += '/' + (id || '');
    url = URI.stringify(url);

    sockets[url] = sockets[url] || new this(dispatcher, endpoint);
    return sockets[url];
  }
});

extend(EventSource.prototype, Deferrable);

module.exports = EventSource;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/deferrable":6,"../util/class":28,"../util/copy_object":31,"../util/extend":33,"../util/uri":37,"./transport":23,"./xhr":25}],22:[function(require,module,exports){
(function (global){
'use strict';

var Class      = require('../util/class'),
    URI        = require('../util/uri'),
    copyObject = require('../util/copy_object'),
    extend     = require('../util/extend'),
    toJSON     = require('../util/to_json'),
    Transport  = require('./transport');

var JSONP = extend(Class(Transport, {
 encode: function(messages) {
    var url = copyObject(this.endpoint);
    url.query.message = toJSON(messages);
    url.query.jsonp   = '__jsonp' + JSONP._cbCount + '__';
    return URI.stringify(url);
  },

  request: function(messages) {
    var head         = document.getElementsByTagName('head')[0],
        script       = document.createElement('script'),
        callbackName = JSONP.getCallbackName(),
        endpoint     = copyObject(this.endpoint),
        self         = this;

    endpoint.query.message = toJSON(messages);
    endpoint.query.jsonp   = callbackName;

    var cleanup = function() {
      if (!global[callbackName]) return false;
      global[callbackName] = undefined;
      try { delete global[callbackName] } catch (error) {}
      script.parentNode.removeChild(script);
    };

    global[callbackName] = function(replies) {
      cleanup();
      self._receive(replies);
    };

    script.type = 'text/javascript';
    script.src  = URI.stringify(endpoint);
    head.appendChild(script);

    script.onerror = function() {
      cleanup();
      self._handleError(messages);
    };

    return {abort: cleanup};
  }
}), {
  _cbCount: 0,

  getCallbackName: function() {
    this._cbCount += 1;
    return '__jsonp' + this._cbCount + '__';
  },

  isUsable: function(dispatcher, endpoint, callback, context) {
    callback.call(context, true);
  }
});

module.exports = JSONP;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../util/class":28,"../util/copy_object":31,"../util/extend":33,"../util/to_json":36,"../util/uri":37,"./transport":23}],23:[function(require,module,exports){
(function (process){
'use strict';

var Class    = require('../util/class'),
    Cookie   = require('../util/cookies').Cookie,
    Promise  = require('../util/promise'),
    URI      = require('../util/uri'),
    array    = require('../util/array'),
    extend   = require('../util/extend'),
    Logging  = require('../mixins/logging'),
    Timeouts = require('../mixins/timeouts'),
    Channel  = require('../protocol/channel');

var Transport = extend(Class({ className: 'Transport',
  DEFAULT_PORTS:    {'http:': 80, 'https:': 443, 'ws:': 80, 'wss:': 443},
  SECURE_PROTOCOLS: ['https:', 'wss:'],
  MAX_DELAY:        0,

  batching:  true,

  initialize: function(dispatcher, endpoint) {
    this._dispatcher = dispatcher;
    this.endpoint    = endpoint;
    this._outbox     = [];
    this._proxy      = extend({}, this._dispatcher.proxy);

    if (!this._proxy.origin && typeof process !== 'undefined') {
      this._proxy.origin = array.indexOf(this.SECURE_PROTOCOLS, this.endpoint.protocol) >= 0
                         ? (process.env.HTTPS_PROXY || process.env.https_proxy)
                         : (process.env.HTTP_PROXY  || process.env.http_proxy);
    }
  },

  close: function() {},

  encode: function(messages) {
    return '';
  },

  sendMessage: function(message) {
    this.debug('Client ? sending message to ?: ?',
               this._dispatcher.clientId, URI.stringify(this.endpoint), message);

    if (!this.batching) return Promise.resolve(this.request([message]));

    this._outbox.push(message);
    this._flushLargeBatch();

    if (message.channel === Channel.HANDSHAKE)
      return this._publish(0.01);

    if (message.channel === Channel.CONNECT)
      this._connectMessage = message;

    return this._publish(this.MAX_DELAY);
  },

  _makePromise: function() {
    var self = this;

    this._requestPromise = this._requestPromise || new Promise(function(resolve) {
      self._resolvePromise = resolve;
    });
  },

  _publish: function(delay) {
    this._makePromise();

    this.addTimeout('publish', delay, function() {
      this._flush();
      delete this._requestPromise;
    }, this);

    return this._requestPromise;
  },

  _flush: function() {
    this.removeTimeout('publish');

    if (this._outbox.length > 1 && this._connectMessage)
      this._connectMessage.advice = {timeout: 0};

    this._resolvePromise(this.request(this._outbox));

    this._connectMessage = null;
    this._outbox = [];
  },

  _flushLargeBatch: function() {
    var string = this.encode(this._outbox);
    if (string.length < this._dispatcher.maxRequestSize) return;
    var last = this._outbox.pop();

    this._makePromise();
    this._flush();

    if (last) this._outbox.push(last);
  },

  _receive: function(replies) {
    if (!replies) return;
    replies = [].concat(replies);

    this.debug('Client ? received from ? via ?: ?',
               this._dispatcher.clientId, URI.stringify(this.endpoint), this.connectionType, replies);

    for (var i = 0, n = replies.length; i < n; i++)
      this._dispatcher.handleResponse(replies[i]);
  },

  _handleError: function(messages, immediate) {
    messages = [].concat(messages);

    this.debug('Client ? failed to send to ? via ?: ?',
               this._dispatcher.clientId, URI.stringify(this.endpoint), this.connectionType, messages);

    for (var i = 0, n = messages.length; i < n; i++)
      this._dispatcher.handleError(messages[i]);
  },

  _getCookies: function() {
    var cookies = this._dispatcher.cookies,
        url     = URI.stringify(this.endpoint);

    if (!cookies) return '';

    return array.map(cookies.getCookiesSync(url), function(cookie) {
      return cookie.cookieString();
    }).join('; ');
  },

  _storeCookies: function(setCookie) {
    var cookies = this._dispatcher.cookies,
        url     = URI.stringify(this.endpoint),
        cookie;

    if (!setCookie || !cookies) return;
    setCookie = [].concat(setCookie);

    for (var i = 0, n = setCookie.length; i < n; i++) {
      cookie = Cookie.parse(setCookie[i]);
      cookies.setCookieSync(cookie, url);
    }
  }

}), {
  get: function(dispatcher, allowed, disabled, callback, context) {
    var endpoint = dispatcher.endpoint;

    array.asyncEach(this._transports, function(pair, resume) {
      var connType     = pair[0], klass = pair[1],
          connEndpoint = dispatcher.endpointFor(connType);

      if (array.indexOf(disabled, connType) >= 0)
        return resume();

      if (array.indexOf(allowed, connType) < 0) {
        klass.isUsable(dispatcher, connEndpoint, function() {});
        return resume();
      }

      klass.isUsable(dispatcher, connEndpoint, function(isUsable) {
        if (!isUsable) return resume();
        var transport = klass.hasOwnProperty('create') ? klass.create(dispatcher, connEndpoint) : new klass(dispatcher, connEndpoint);
        callback.call(context, transport);
      });
    }, function() {
      throw new Error('Could not find a usable connection type for ' + URI.stringify(endpoint));
    });
  },

  register: function(type, klass) {
    this._transports.push([type, klass]);
    klass.prototype.connectionType = type;
  },

  getConnectionTypes: function() {
    return array.map(this._transports, function(t) { return t[0] });
  },

  _transports: []
});

extend(Transport.prototype, Logging);
extend(Transport.prototype, Timeouts);

module.exports = Transport;

}).call(this,require('_process'))

},{"../mixins/logging":7,"../mixins/timeouts":9,"../protocol/channel":10,"../util/array":26,"../util/class":28,"../util/cookies":30,"../util/extend":33,"../util/promise":34,"../util/uri":37,"_process":2}],24:[function(require,module,exports){
(function (global){
'use strict';

var Class      = require('../util/class'),
    Promise    = require('../util/promise'),
    Set        = require('../util/set'),
    URI        = require('../util/uri'),
    browser    = require('../util/browser'),
    copyObject = require('../util/copy_object'),
    extend     = require('../util/extend'),
    toJSON     = require('../util/to_json'),
    ws         = require('../util/websocket'),
    Deferrable = require('../mixins/deferrable'),
    Transport  = require('./transport');

var WebSocket = extend(Class(Transport, {
  UNCONNECTED:  1,
  CONNECTING:   2,
  CONNECTED:    3,

  batching:     false,

  isUsable: function(callback, context) {
    this.callback(function() { callback.call(context, true) });
    this.errback(function() { callback.call(context, false) });
    this.connect();
  },

  request: function(messages) {
    this._pending = this._pending || new Set();
    for (var i = 0, n = messages.length; i < n; i++) this._pending.add(messages[i]);

    var self = this;

    var promise = new Promise(function(resolve, reject) {
      self.callback(function(socket) {
        if (!socket || socket.readyState !== 1) return;
        socket.send(toJSON(messages));
        resolve(socket);
      });

      self.connect();
    });

    return {
      abort: function() { promise.then(function(ws) { ws.close() }) }
    };
  },

  connect: function() {
    if (WebSocket._unloaded) return;

    this._state = this._state || this.UNCONNECTED;
    if (this._state !== this.UNCONNECTED) return;
    this._state = this.CONNECTING;

    var socket = this._createSocket();
    if (!socket) return this.setDeferredStatus('failed');

    var self = this;

    socket.onopen = function() {
      if (socket.headers) self._storeCookies(socket.headers['set-cookie']);
      self._socket = socket;
      self._state = self.CONNECTED;
      self._everConnected = true;
      self._ping();
      self.setDeferredStatus('succeeded', socket);
    };

    var closed = false;
    socket.onclose = socket.onerror = function() {
      if (closed) return;
      closed = true;

      var wasConnected = (self._state === self.CONNECTED);
      socket.onopen = socket.onclose = socket.onerror = socket.onmessage = null;

      delete self._socket;
      self._state = self.UNCONNECTED;
      self.removeTimeout('ping');

      var pending = self._pending ? self._pending.toArray() : [];
      delete self._pending;

      if (wasConnected || self._everConnected) {
        self.setDeferredStatus('unknown');
        self._handleError(pending, wasConnected);
      } else {
        self.setDeferredStatus('failed');
      }
    };

    socket.onmessage = function(event) {
      var replies;
      try { replies = JSON.parse(event.data) } catch (error) {}

      if (!replies) return;

      replies = [].concat(replies);

      for (var i = 0, n = replies.length; i < n; i++) {
        if (replies[i].successful === undefined) continue;
        self._pending.remove(replies[i]);
      }
      self._receive(replies);
    };
  },

  close: function() {
    if (!this._socket) return;
    this._socket.close();
  },

  _createSocket: function() {
    var url        = WebSocket.getSocketUrl(this.endpoint),
        headers    = this._dispatcher.headers,
        extensions = this._dispatcher.wsExtensions,
        cookie     = this._getCookies(),
        tls        = this._dispatcher.tls,
        options    = {extensions: extensions, headers: headers, proxy: this._proxy, tls: tls};

    if (cookie !== '') options.headers['Cookie'] = cookie;

    return ws.create(url, [], options);
  },

  _ping: function() {
    if (!this._socket || this._socket.readyState !== 1) return;
    this._socket.send('[]');
    this.addTimeout('ping', this._dispatcher.timeout / 2, this._ping, this);
  }

}), {
  PROTOCOLS: {
    'http:':  'ws:',
    'https:': 'wss:'
  },

  create: function(dispatcher, endpoint) {
    var sockets = dispatcher.transports.websocket = dispatcher.transports.websocket || {};
    sockets[endpoint.href] = sockets[endpoint.href] || new this(dispatcher, endpoint);
    return sockets[endpoint.href];
  },

  getSocketUrl: function(endpoint) {
    endpoint = copyObject(endpoint);
    endpoint.protocol = this.PROTOCOLS[endpoint.protocol];
    return URI.stringify(endpoint);
  },

  isUsable: function(dispatcher, endpoint, callback, context) {
    this.create(dispatcher, endpoint).isUsable(callback, context);
  }
});

extend(WebSocket.prototype, Deferrable);

if (browser.Event && global.onbeforeunload !== undefined)
  browser.Event.on(global, 'beforeunload', function() { WebSocket._unloaded = true });

module.exports = WebSocket;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../mixins/deferrable":6,"../util/browser":27,"../util/class":28,"../util/copy_object":31,"../util/extend":33,"../util/promise":34,"../util/set":35,"../util/to_json":36,"../util/uri":37,"../util/websocket":39,"./transport":23}],25:[function(require,module,exports){
(function (global){
'use strict';

var Class     = require('../util/class'),
    URI       = require('../util/uri'),
    browser   = require('../util/browser'),
    extend    = require('../util/extend'),
    toJSON    = require('../util/to_json'),
    Transport = require('./transport');

var XHR = extend(Class(Transport, {
  encode: function(messages) {
    return toJSON(messages);
  },

  request: function(messages) {
    var href = this.endpoint.href,
        self = this,
        xhr;

    // Prefer XMLHttpRequest over ActiveXObject if they both exist
    if (global.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (global.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
      return this._handleError(messages);
    }

    xhr.open('POST', href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    var headers = this._dispatcher.headers;
    for (var key in headers) {
      if (!headers.hasOwnProperty(key)) continue;
      xhr.setRequestHeader(key, headers[key]);
    }

    var abort = function() { xhr.abort() };
    if (global.onbeforeunload !== undefined)
      browser.Event.on(global, 'beforeunload', abort);

    xhr.onreadystatechange = function() {
      if (!xhr || xhr.readyState !== 4) return;

      var replies    = null,
          status     = xhr.status,
          text       = xhr.responseText,
          successful = (status >= 200 && status < 300) || status === 304 || status === 1223;

      if (global.onbeforeunload !== undefined)
        browser.Event.detach(global, 'beforeunload', abort);

      xhr.onreadystatechange = function() {};
      xhr = null;

      if (!successful) return self._handleError(messages);

      try {
        replies = JSON.parse(text);
      } catch (error) {}

      if (replies)
        self._receive(replies);
      else
        self._handleError(messages);
    };

    xhr.send(this.encode(messages));
    return xhr;
  }
}), {
  isUsable: function(dispatcher, endpoint, callback, context) {
    var usable = (navigator.product === 'ReactNative')
              || URI.isSameOrigin(endpoint);

    callback.call(context, usable);
  }
});

module.exports = XHR;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../util/browser":27,"../util/class":28,"../util/extend":33,"../util/to_json":36,"../util/uri":37,"./transport":23}],26:[function(require,module,exports){
'use strict';

module.exports = {
  commonElement: function(lista, listb) {
    for (var i = 0, n = lista.length; i < n; i++) {
      if (this.indexOf(listb, lista[i]) !== -1)
        return lista[i];
    }
    return null;
  },

  indexOf: function(list, needle) {
    if (list.indexOf) return list.indexOf(needle);

    for (var i = 0, n = list.length; i < n; i++) {
      if (list[i] === needle) return i;
    }
    return -1;
  },

  map: function(object, callback, context) {
    if (object.map) return object.map(callback, context);
    var result = [];

    if (object instanceof Array) {
      for (var i = 0, n = object.length; i < n; i++) {
        result.push(callback.call(context || null, object[i], i));
      }
    } else {
      for (var key in object) {
        if (!object.hasOwnProperty(key)) continue;
        result.push(callback.call(context || null, key, object[key]));
      }
    }
    return result;
  },

  filter: function(array, callback, context) {
    if (array.filter) return array.filter(callback, context);
    var result = [];
    for (var i = 0, n = array.length; i < n; i++) {
      if (callback.call(context || null, array[i], i))
        result.push(array[i]);
    }
    return result;
  },

  asyncEach: function(list, iterator, callback, context) {
    var n       = list.length,
        i       = -1,
        calls   = 0,
        looping = false;

    var iterate = function() {
      calls -= 1;
      i += 1;
      if (i === n) return callback && callback.call(context);
      iterator(list[i], resume);
    };

    var loop = function() {
      if (looping) return;
      looping = true;
      while (calls > 0) iterate();
      looping = false;
    };

    var resume = function() {
      calls += 1;
      loop();
    };
    resume();
  }
};

},{}],27:[function(require,module,exports){
(function (global){
'use strict';

var Event = {
  _registry: [],

  on: function(element, eventName, callback, context) {
    var wrapped = function() { callback.call(context) };

    if (element.addEventListener)
      element.addEventListener(eventName, wrapped, false);
    else
      element.attachEvent('on' + eventName, wrapped);

    this._registry.push({
      _element:   element,
      _type:      eventName,
      _callback:  callback,
      _context:     context,
      _handler:   wrapped
    });
  },

  detach: function(element, eventName, callback, context) {
    var i = this._registry.length, register;
    while (i--) {
      register = this._registry[i];

      if ((element    && element    !== register._element)  ||
          (eventName  && eventName  !== register._type)     ||
          (callback   && callback   !== register._callback) ||
          (context    && context    !== register._context))
        continue;

      if (register._element.removeEventListener)
        register._element.removeEventListener(register._type, register._handler, false);
      else
        register._element.detachEvent('on' + register._type, register._handler);

      this._registry.splice(i,1);
      register = null;
    }
  }
};

if (global.onunload !== undefined)
  Event.on(global, 'unload', Event.detach, Event);

module.exports = {
  Event: Event
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],28:[function(require,module,exports){
'use strict';

var extend = require('./extend');

module.exports = function(parent, methods) {
  if (typeof parent !== 'function') {
    methods = parent;
    parent  = Object;
  }

  var klass = function() {
    if (!this.initialize) return this;
    return this.initialize.apply(this, arguments) || this;
  };

  var bridge = function() {};
  bridge.prototype = parent.prototype;

  klass.prototype = new bridge();
  extend(klass.prototype, methods);

  return klass;
};

},{"./extend":33}],29:[function(require,module,exports){
module.exports = {
  VERSION:          '1.2.1',

  BAYEUX_VERSION:   '1.0',
  ID_LENGTH:        160,
  JSONP_CALLBACK:   'jsonpcallback',
  CONNECTION_TYPES: ['long-polling', 'cross-origin-long-polling', 'callback-polling', 'websocket', 'eventsource', 'in-process'],

  MANDATORY_CONNECTION_TYPES: ['long-polling', 'callback-polling', 'in-process']
};

},{}],30:[function(require,module,exports){
'use strict';

module.exports = {};

},{}],31:[function(require,module,exports){
'use strict';

var copyObject = function(object) {
  var clone, i, key;
  if (object instanceof Array) {
    clone = [];
    i = object.length;
    while (i--) clone[i] = copyObject(object[i]);
    return clone;
  } else if (typeof object === 'object') {
    clone = (object === null) ? null : {};
    for (key in object) clone[key] = copyObject(object[key]);
    return clone;
  } else {
    return object;
  }
};

module.exports = copyObject;

},{}],32:[function(require,module,exports){
/*
Copyright Joyent, Inc. and other Node contributors. All rights reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

function EventEmitter() {}
module.exports = EventEmitter;

EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {
    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

},{}],33:[function(require,module,exports){
'use strict';

module.exports = function(dest, source, overwrite) {
  if (!source) return dest;
  for (var key in source) {
    if (!source.hasOwnProperty(key)) continue;
    if (dest.hasOwnProperty(key) && overwrite === false) continue;
    if (dest[key] !== source[key])
      dest[key] = source[key];
  }
  return dest;
};

},{}],34:[function(require,module,exports){
'use strict';

var asap = require('asap');

var PENDING   = 0,
    FULFILLED = 1,
    REJECTED  = 2;

var RETURN = function(x) { return x },
    THROW  = function(x) { throw  x };

var Promise = function(task) {
  this._state       = PENDING;
  this._onFulfilled = [];
  this._onRejected  = [];

  if (typeof task !== 'function') return;
  var self = this;

  task(function(value)  { fulfill(self, value) },
       function(reason) { reject(self, reason) });
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var next = new Promise();
  registerOnFulfilled(this, onFulfilled, next);
  registerOnRejected(this, onRejected, next);
  return next;
};

Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

var registerOnFulfilled = function(promise, onFulfilled, next) {
  if (typeof onFulfilled !== 'function') onFulfilled = RETURN;
  var handler = function(value) { invoke(onFulfilled, value, next) };

  if (promise._state === PENDING) {
    promise._onFulfilled.push(handler);
  } else if (promise._state === FULFILLED) {
    handler(promise._value);
  }
};

var registerOnRejected = function(promise, onRejected, next) {
  if (typeof onRejected !== 'function') onRejected = THROW;
  var handler = function(reason) { invoke(onRejected, reason, next) };

  if (promise._state === PENDING) {
    promise._onRejected.push(handler);
  } else if (promise._state === REJECTED) {
    handler(promise._reason);
  }
};

var invoke = function(fn, value, next) {
  asap(function() { _invoke(fn, value, next) });
};

var _invoke = function(fn, value, next) {
  var outcome;

  try {
    outcome = fn(value);
  } catch (error) {
    return reject(next, error);
  }

  if (outcome === next) {
    reject(next, new TypeError('Recursive promise chain detected'));
  } else {
    fulfill(next, outcome);
  }
};

var fulfill = function(promise, value) {
  var called = false, type, then;

  try {
    type = typeof value;
    then = value !== null && (type === 'function' || type === 'object') && value.then;

    if (typeof then !== 'function') return _fulfill(promise, value);

    then.call(value, function(v) {
      if (!(called ^ (called = true))) return;
      fulfill(promise, v);
    }, function(r) {
      if (!(called ^ (called = true))) return;
      reject(promise, r);
    });
  } catch (error) {
    if (!(called ^ (called = true))) return;
    reject(promise, error);
  }
};

var _fulfill = function(promise, value) {
  if (promise._state !== PENDING) return;

  promise._state      = FULFILLED;
  promise._value      = value;
  promise._onRejected = [];

  var onFulfilled = promise._onFulfilled, fn;
  while (fn = onFulfilled.shift()) fn(value);
};

var reject = function(promise, reason) {
  if (promise._state !== PENDING) return;

  promise._state       = REJECTED;
  promise._reason      = reason;
  promise._onFulfilled = [];

  var onRejected = promise._onRejected, fn;
  while (fn = onRejected.shift()) fn(reason);
};

Promise.resolve = Promise.accept = Promise.fulfill = function(value) {
  return new Promise(function(resolve, reject) { resolve(value) });
};

Promise.reject = function(reason) {
  return new Promise(function(resolve, reject) { reject(reason) });
};

Promise.all = function(promises) {
  return new Promise(function(resolve, reject) {
    var list = [], n = promises.length, i;

    if (n === 0) return resolve(list);

    for (i = 0; i < n; i++) (function(promise, i) {
      Promise.resolve(promise).then(function(value) {
        list[i] = value;
        if (--n === 0) resolve(list);
      }, reject);
    })(promises[i], i);
  });
};

Promise.race = function(promises) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, n = promises.length; i < n; i++)
      Promise.resolve(promises[i]).then(resolve, reject);
  });
};

Promise.deferred = Promise.pending = function() {
  var tuple = {};

  tuple.promise = new Promise(function(resolve, reject) {
    tuple.fulfill = tuple.resolve = resolve;
    tuple.reject  = reject;
  });
  return tuple;
};

module.exports = Promise;

},{"asap":3}],35:[function(require,module,exports){
'use strict';

var Class = require('./class');

module.exports = Class({
  initialize: function() {
    this._index = {};
  },

  add: function(item) {
    var key = (item.id !== undefined) ? item.id : item;
    if (this._index.hasOwnProperty(key)) return false;
    this._index[key] = item;
    return true;
  },

  forEach: function(block, context) {
    for (var key in this._index) {
      if (this._index.hasOwnProperty(key))
        block.call(context, this._index[key]);
    }
  },

  isEmpty: function() {
    for (var key in this._index) {
      if (this._index.hasOwnProperty(key)) return false;
    }
    return true;
  },

  member: function(item) {
    for (var key in this._index) {
      if (this._index[key] === item) return true;
    }
    return false;
  },

  remove: function(item) {
    var key = (item.id !== undefined) ? item.id : item;
    var removed = this._index[key];
    delete this._index[key];
    return removed;
  },

  toArray: function() {
    var array = [];
    this.forEach(function(item) { array.push(item) });
    return array;
  }
});

},{"./class":28}],36:[function(require,module,exports){
'use strict';

// http://assanka.net/content/tech/2009/09/02/json2-js-vs-prototype/

module.exports = function(object) {
  return JSON.stringify(object, function(key, value) {
    return (this[key] instanceof Array) ? this[key] : value;
  });
};

},{}],37:[function(require,module,exports){
'use strict';

module.exports = {
  isURI: function(uri) {
    return uri && uri.protocol && uri.host && uri.path;
  },

  isSameOrigin: function(uri) {
    return uri.protocol === location.protocol &&
           uri.hostname === location.hostname &&
           uri.port     === location.port;
  },

  parse: function(url) {
    if (typeof url !== 'string') return url;
    var uri = {}, parts, query, pairs, i, n, data;

    var consume = function(name, pattern) {
      url = url.replace(pattern, function(match) {
        uri[name] = match;
        return '';
      });
      uri[name] = uri[name] || '';
    };

    consume('protocol', /^[a-z]+\:/i);
    consume('host',     /^\/\/[^\/\?#]+/);

    if (!/^\//.test(url) && !uri.host)
      url = location.pathname.replace(/[^\/]*$/, '') + url;

    consume('pathname', /^[^\?#]*/);
    consume('search',   /^\?[^#]*/);
    consume('hash',     /^#.*/);

    uri.protocol = uri.protocol || location.protocol;

    if (uri.host) {
      uri.host     = uri.host.substr(2);
      parts        = uri.host.split(':');
      uri.hostname = parts[0];
      uri.port     = parts[1] || '';
    } else {
      uri.host     = location.host;
      uri.hostname = location.hostname;
      uri.port     = location.port;
    }

    uri.pathname = uri.pathname || '/';
    uri.path = uri.pathname + uri.search;

    query = uri.search.replace(/^\?/, '');
    pairs = query ? query.split('&') : [];
    data  = {};

    for (i = 0, n = pairs.length; i < n; i++) {
      parts = pairs[i].split('=');
      data[decodeURIComponent(parts[0] || '')] = decodeURIComponent(parts[1] || '');
    }

    uri.query = data;

    uri.href = this.stringify(uri);
    return uri;
  },

  stringify: function(uri) {
    var string = uri.protocol + '//' + uri.hostname;
    if (uri.port) string += ':' + uri.port;
    string += uri.pathname + this.queryString(uri.query) + (uri.hash || '');
    return string;
  },

  queryString: function(query) {
    var pairs = [];
    for (var key in query) {
      if (!query.hasOwnProperty(key)) continue;
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
    }
    if (pairs.length === 0) return '';
    return '?' + pairs.join('&');
  }
};

},{}],38:[function(require,module,exports){
'use strict';

var array = require('./array');

module.exports = function(options, validKeys) {
  for (var key in options) {
    if (array.indexOf(validKeys, key) < 0)
      throw new Error('Unrecognized option: ' + key);
  }
};

},{"./array":26}],39:[function(require,module,exports){
(function (global){
'use strict';

var WS = global.MozWebSocket || global.WebSocket;

module.exports = {
  create: function(url, protocols, options) {
    return new WS(url);
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYXBpL3N0cmVhbWluZy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9ub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLWFzYXAuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9ub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLXJhdy5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy9mYXllX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvbWl4aW5zL2RlZmVycmFibGUuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvbWl4aW5zL2xvZ2dpbmcuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvbWl4aW5zL3B1Ymxpc2hlci5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy9taXhpbnMvdGltZW91dHMuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvcHJvdG9jb2wvY2hhbm5lbC5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy9wcm90b2NvbC9jbGllbnQuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvcHJvdG9jb2wvZGlzcGF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy9wcm90b2NvbC9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy9wcm90b2NvbC9leHRlbnNpYmxlLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3Byb3RvY29sL2dyYW1tYXIuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvcHJvdG9jb2wvcHVibGljYXRpb24uanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvcHJvdG9jb2wvc2NoZWR1bGVyLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3Byb3RvY29sL3N1YnNjcmlwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy90cmFuc3BvcnQvYnJvd3Nlcl90cmFuc3BvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3RyYW5zcG9ydC9jb3JzLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3RyYW5zcG9ydC9ldmVudF9zb3VyY2UuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvdHJhbnNwb3J0L2pzb25wLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3RyYW5zcG9ydC90cmFuc3BvcnQuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvdHJhbnNwb3J0L3dlYl9zb2NrZXQuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvdHJhbnNwb3J0L3hoci5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy91dGlsL2FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3V0aWwvYnJvd3Nlci9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy91dGlsL2NsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3V0aWwvY29uc3RhbnRzLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3V0aWwvY29va2llcy9icm93c2VyX2Nvb2tpZXMuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvdXRpbC9jb3B5X29iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy91dGlsL2V2ZW50X2VtaXR0ZXIuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvdXRpbC9leHRlbmQuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvdXRpbC9wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3V0aWwvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2ZheWUvc3JjL3V0aWwvdG9fanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy91dGlsL3VyaS5qcyIsIm5vZGVfbW9kdWxlcy9mYXllL3NyYy91dGlsL3ZhbGlkYXRlX29wdGlvbnMuanMiLCJub2RlX21vZHVsZXMvZmF5ZS9zcmMvdXRpbC93ZWJzb2NrZXQvYnJvd3Nlcl93ZWJzb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN6TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQGZpbGUgTWFuYWdlcyBTdHJlYW1pbmcgQVBJc1xuICogQGF1dGhvciBTaGluaWNoaSBUb21pdGEgPHNoaW5pY2hpLnRvbWl0YUBnbWFpbC5jb20+XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXZlbnRzID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnZXZlbnRzJyksXG4gICAgaW5oZXJpdHMgPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdpbmhlcml0cycpLFxuICAgIF8gPSB3aW5kb3cuanNmb3JjZS5yZXF1aXJlKCdsb2Rhc2gvY29yZScpLFxuICAgIEZheWUgICA9IHJlcXVpcmUoJ2ZheWUnKSxcbiAgICBqc2ZvcmNlID0gd2luZG93LmpzZm9yY2UucmVxdWlyZSgnLi9jb3JlJyk7XG5cbi8qKlxuICogU3RyZWFtaW5nIEFQSSB0b3BpYyBjbGFzc1xuICpcbiAqIEBjbGFzcyBTdHJlYW1pbmd+VG9waWNcbiAqIEBwYXJhbSB7U3RyZWFtaW5nfSBzdGVhbWluZyAtIFN0cmVhbWluZyBBUEkgb2JqZWN0XG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRvcGljIG5hbWVcbiAqL1xudmFyIFRvcGljID0gZnVuY3Rpb24oc3RyZWFtaW5nLCBuYW1lKSB7XG4gIHRoaXMuX3N0cmVhbWluZyA9IHN0cmVhbWluZztcbiAgdGhpcy5uYW1lID0gbmFtZTtcbn07XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gU3RyZWFtaW5nflN0cmVhbWluZ01lc3NhZ2VcbiAqIEBwcm9wIHtPYmplY3R9IGV2ZW50XG4gKiBAcHJvcCB7T2JqZWN0fSBldmVudC50eXBlIC0gRXZlbnQgdHlwZVxuICogQHByb3Age1JlY29yZH0gc29iamVjdCAtIFJlY29yZCBpbmZvcm1hdGlvblxuICovXG4vKipcbiAqIFN1YnNjcmliZSBsaXN0ZW5lciB0byB0b3BpY1xuICpcbiAqIEBtZXRob2QgU3RyZWFtaW5nflRvcGljI3N1YnNjcmliZVxuICogQHBhcmFtIHtDYWxsYmFjay48U3RyZWFtaW5nflN0cmVhbWluZ01lc2FzZ2U+fSBsaXN0ZW5lciAtIFN0cmVhbWluZyBtZXNzYWdlIGxpc3RlbmVyXG4gKiBAcmV0dXJucyB7U3Vic2NyaXB0aW9ufSAtIEZheWUgc3Vic2NyaXB0aW9uIG9iamVjdFxuICovXG5Ub3BpYy5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgcmV0dXJuIHRoaXMuX3N0cmVhbWluZy5zdWJzY3JpYmUodGhpcy5uYW1lLCBsaXN0ZW5lcik7XG59O1xuXG4vKipcbiAqIFVuc3Vic2NyaWJlIGxpc3RlbmVyIGZyb20gdG9waWNcbiAqXG4gKiBAbWV0aG9kIFN0cmVhbWluZ35Ub3BpYyN1bnN1YnNjcmliZVxuICogQHBhcmFtIHtDYWxsYmFjay48U3RyZWFtaW5nflN0cmVhbWluZ01lc2FzZ2U+fSBsaXN0ZW5lciAtIFN0cmVhbWluZyBtZXNzYWdlIGxpc3RlbmVyXG4gKiBAcmV0dXJucyB7U3RyZWFtaW5nflRvcGljfVxuICovXG5Ub3BpYy5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICB0aGlzLl9zdHJlYW1pbmcudW5zdWJzY3JpYmUodGhpcy5uYW1lLCBsaXN0ZW5lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8qKlxuICogU3RyZWFtaW5nIEFQSSBHZW5lcmljIFN0cmVhbWluZyBDaGFubmVsXG4gKlxuICogQGNsYXNzIFN0cmVhbWluZ35DaGFubmVsXG4gKiBAcGFyYW0ge1N0cmVhbWluZ30gc3RlYW1pbmcgLSBTdHJlYW1pbmcgQVBJIG9iamVjdFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBDaGFubmVsIG5hbWUgKHN0YXJ0cyB3aXRoIFwiL3UvXCIpXG4gKi9cbnZhciBDaGFubmVsID0gZnVuY3Rpb24oc3RyZWFtaW5nLCBuYW1lKSB7XG4gIHRoaXMuX3N0cmVhbWluZyA9IHN0cmVhbWluZztcbiAgdGhpcy5fbmFtZSA9IG5hbWU7XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byBoYW5uZWxcbiAqXG4gKiBAcGFyYW0ge0NhbGxiYWNrLjxTdHJlYW1pbmd+U3RyZWFtaW5nTWVzc2FnZT59IGxpc3RlbmVyIC0gU3RyZWFtaW5nIG1lc3NhZ2UgbGlzdGVuZXJcbiAqIEByZXR1cm5zIHtTdWJzY3JpcHRpb259IC0gRmF5ZSBzdWJzY3JpcHRpb24gb2JqZWN0XG4gKi9cbkNoYW5uZWwucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gIHJldHVybiB0aGlzLl9zdHJlYW1pbmcuc3Vic2NyaWJlKHRoaXMuX25hbWUsIGxpc3RlbmVyKTtcbn07XG5cbkNoYW5uZWwucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgdGhpcy5fc3RyZWFtaW5nLnVuc3Vic2NyaWJlKHRoaXMuX25hbWUsIGxpc3RlbmVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5DaGFubmVsLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oZXZlbnRzLCBjYWxsYmFjaykge1xuICB2YXIgaXNBcnJheSA9IF8uaXNBcnJheShldmVudHMpO1xuICBldmVudHMgPSBpc0FycmF5ID8gZXZlbnRzIDogWyBldmVudHMgXTtcbiAgdmFyIGNvbm4gPSB0aGlzLl9zdHJlYW1pbmcuX2Nvbm47XG4gIGlmICghdGhpcy5faWQpIHtcbiAgICB0aGlzLl9pZCA9IGNvbm4uc29iamVjdCgnU3RyZWFtaW5nQ2hhbm5lbCcpLmZpbmRPbmUoeyBOYW1lOiB0aGlzLl9uYW1lIH0sICdJZCcpXG4gICAgICAudGhlbihmdW5jdGlvbihyZWMpIHsgcmV0dXJuIHJlYy5JZCB9KTtcbiAgfVxuICByZXR1cm4gdGhpcy5faWQudGhlbihmdW5jdGlvbihpZCkge1xuICAgIHZhciBjaGFubmVsVXJsID0gJy9zb2JqZWN0cy9TdHJlYW1pbmdDaGFubmVsLycgKyBpZCArICcvcHVzaCc7XG4gICAgcmV0dXJuIGNvbm4ucmVxdWVzdFBvc3QoY2hhbm5lbFVybCwgeyBwdXNoRXZlbnRzOiBldmVudHMgfSk7XG4gIH0pLnRoZW4oZnVuY3Rpb24ocmV0cykge1xuICAgIHJldHVybiBpc0FycmF5ID8gcmV0cyA6IHJldHNbMF07XG4gIH0pLnRoZW5DYWxsKGNhbGxiYWNrKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcbiAqIFN0cmVhbWluZyBBUEkgY2xhc3NcbiAqXG4gKiBAY2xhc3NcbiAqIEBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXJcbiAqIEBwYXJhbSB7Q29ubmVjdGlvbn0gY29ubiAtIENvbm5lY3Rpb24gb2JqZWN0XG4gKi9cbnZhciBTdHJlYW1pbmcgPSBmdW5jdGlvbihjb25uKSB7XG4gIHRoaXMuX2Nvbm4gPSBjb25uO1xufTtcblxuaW5oZXJpdHMoU3RyZWFtaW5nLCBldmVudHMuRXZlbnRFbWl0dGVyKTtcblxuLyoqIEBwcml2YXRlICoqL1xuU3RyZWFtaW5nLnByb3RvdHlwZS5fY3JlYXRlQ2xpZW50ID0gZnVuY3Rpb24ocmVwbGF5KSB7XG4gIHZhciBlbmRwb2ludFVybCA9IFsgdGhpcy5fY29ubi5pbnN0YW5jZVVybCwgXCJjb21ldGRcIiArIChyZXBsYXkgPyBcIi9yZXBsYXlcIiA6IFwiXCIpLCB0aGlzLl9jb25uLnZlcnNpb24gXS5qb2luKCcvJyk7XG4gIHZhciBmYXllQ2xpZW50ID0gbmV3IEZheWUuQ2xpZW50KGVuZHBvaW50VXJsLCB7fSk7XG4gIGZheWVDbGllbnQuc2V0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ09BdXRoICcrdGhpcy5fY29ubi5hY2Nlc3NUb2tlbik7XG4gIHJldHVybiBmYXllQ2xpZW50O1xufTtcblxuLyoqIEBwcml2YXRlICoqL1xuU3RyZWFtaW5nLnByb3RvdHlwZS5fZ2V0RmF5ZUNsaWVudCA9IGZ1bmN0aW9uKGNoYW5uZWxOYW1lKSB7XG4gIHZhciBpc0dlbmVyaWMgPSBjaGFubmVsTmFtZS5pbmRleE9mKCcvdS8nKSA9PT0gMDtcbiAgdmFyIGNsaWVudFR5cGUgPSBpc0dlbmVyaWMgPyAnZ2VuZXJpYycgOiAncHVzaFRvcGljJztcbiAgaWYgKCF0aGlzLl9mYXllQ2xpZW50cyB8fCAhdGhpcy5fZmF5ZUNsaWVudHNbY2xpZW50VHlwZV0pIHtcbiAgICB0aGlzLl9mYXllQ2xpZW50cyA9IHRoaXMuX2ZheWVDbGllbnRzIHx8IHt9O1xuICAgIHRoaXMuX2ZheWVDbGllbnRzW2NsaWVudFR5cGVdID0gdGhpcy5fY3JlYXRlQ2xpZW50KGlzR2VuZXJpYyk7XG4gICAgaWYgKHRoaXMuX2ZheWVDbGllbnRzW2NsaWVudFR5cGVdLl9kaXNwYXRjaGVyLmdldENvbm5lY3Rpb25UeXBlcygpLmluZGV4T2YoJ2NhbGxiYWNrLXBvbGxpbmcnKSA9PT0gLTEpIHtcbiAgICAgIC8vIHByZXZlbnQgc3RyZWFtaW5nIEFQSSBzZXJ2ZXIgZXJyb3JcbiAgICAgIHRoaXMuX2ZheWVDbGllbnRzW2NsaWVudFR5cGVdLl9kaXNwYXRjaGVyLnNlbGVjdFRyYW5zcG9ydCgnbG9uZy1wb2xsaW5nJyk7XG4gICAgICB0aGlzLl9mYXllQ2xpZW50c1tjbGllbnRUeXBlXS5fZGlzcGF0Y2hlci5fdHJhbnNwb3J0LmJhdGNoaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzLl9mYXllQ2xpZW50c1tjbGllbnRUeXBlXTtcbn07XG5cblxuLyoqXG4gKiBHZXQgbmFtZWQgdG9waWNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRvcGljIG5hbWVcbiAqIEByZXR1cm5zIHtTdHJlYW1pbmd+VG9waWN9XG4gKi9cblN0cmVhbWluZy5wcm90b3R5cGUudG9waWMgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHRoaXMuX3RvcGljcyA9IHRoaXMuX3RvcGljcyB8fCB7fTtcbiAgdmFyIHRvcGljID0gdGhpcy5fdG9waWNzW25hbWVdID1cbiAgICB0aGlzLl90b3BpY3NbbmFtZV0gfHwgbmV3IFRvcGljKHRoaXMsIG5hbWUpO1xuICByZXR1cm4gdG9waWM7XG59O1xuXG4vKipcbiAqIEdldCBDaGFubmVsIGZvciBJZFxuICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWxJZCAtIElkIG9mIFN0cmVhbWluZ0NoYW5uZWwgb2JqZWN0XG4gKiBAcmV0dXJucyB7U3RyZWFtaW5nfkNoYW5uZWx9XG4gKi9cblN0cmVhbWluZy5wcm90b3R5cGUuY2hhbm5lbCA9IGZ1bmN0aW9uKGNoYW5uZWxJZCkge1xuICByZXR1cm4gbmV3IENoYW5uZWwodGhpcywgY2hhbm5lbElkKTtcbn07XG5cbi8qKlxuICogU3Vic2NyaWJlIHRvcGljL2NoYW5uZWxcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRvcGljIG5hbWVcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFN0cmVhbWluZ35TdHJlYW1pbmdNZXNzYWdlPn0gbGlzdGVuZXIgLSBTdHJlYW1pbmcgbWVzc2FnZSBsaXN0ZW5lclxuICogQHJldHVybnMge1N1YnNjcmlwdGlvbn0gLSBGYXllIHN1YnNjcmlwdGlvbiBvYmplY3RcbiAqL1xuU3RyZWFtaW5nLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbihuYW1lLCBsaXN0ZW5lcikge1xuICB2YXIgY2hhbm5lbE5hbWUgPSBuYW1lLmluZGV4T2YoJy8nKSA9PT0gMCA/IG5hbWUgOiAnL3RvcGljLycgKyBuYW1lO1xuICB2YXIgZmF5ZUNsaWVudCA9IHRoaXMuX2dldEZheWVDbGllbnQoY2hhbm5lbE5hbWUpO1xuICByZXR1cm4gZmF5ZUNsaWVudC5zdWJzY3JpYmUoY2hhbm5lbE5hbWUsIGxpc3RlbmVyKTtcbn07XG5cbi8qKlxuICogVW5zdWJzY3JpYmUgdG9waWNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRvcGljIG5hbWVcbiAqIEBwYXJhbSB7Q2FsbGJhY2suPFN0cmVhbWluZ35TdHJlYW1pbmdNZXNzYWdlPn0gbGlzdGVuZXIgLSBTdHJlYW1pbmcgbWVzc2FnZSBsaXN0ZW5lclxuICogQHJldHVybnMge1N0cmVhbWluZ31cbiAqL1xuU3RyZWFtaW5nLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gIHZhciBjaGFubmVsTmFtZSA9IG5hbWUuaW5kZXhPZignLycpID09PSAwID8gbmFtZSA6ICcvdG9waWMvJyArIG5hbWU7XG4gIHZhciBmYXllQ2xpZW50ID0gdGhpcy5fZ2V0RmF5ZUNsaWVudChjaGFubmVsTmFtZSk7XG4gIGZheWVDbGllbnQudW5zdWJzY3JpYmUoY2hhbm5lbE5hbWUsIGxpc3RlbmVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLypcbiAqIFJlZ2lzdGVyIGhvb2sgaW4gY29ubmVjdGlvbiBpbnN0YW50aWF0aW9uIGZvciBkeW5hbWljYWxseSBhZGRpbmcgdGhpcyBBUEkgbW9kdWxlIGZlYXR1cmVzXG4gKi9cbmpzZm9yY2Uub24oJ2Nvbm5lY3Rpb246bmV3JywgZnVuY3Rpb24oY29ubikge1xuICBjb25uLnN0cmVhbWluZyA9IG5ldyBTdHJlYW1pbmcoY29ubik7XG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmVhbWluZztcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuICB9XG4gIHRyeSB7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICB9XG4gIH1cbn0gKCkpXG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBjYWNoZWRTZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJhd0FzYXAgcHJvdmlkZXMgZXZlcnl0aGluZyB3ZSBuZWVkIGV4Y2VwdCBleGNlcHRpb24gbWFuYWdlbWVudC5cbnZhciByYXdBc2FwID0gcmVxdWlyZShcIi4vcmF3XCIpO1xuLy8gUmF3VGFza3MgYXJlIHJlY3ljbGVkIHRvIHJlZHVjZSBHQyBjaHVybi5cbnZhciBmcmVlVGFza3MgPSBbXTtcbi8vIFdlIHF1ZXVlIGVycm9ycyB0byBlbnN1cmUgdGhleSBhcmUgdGhyb3duIGluIHJpZ2h0IG9yZGVyIChGSUZPKS5cbi8vIEFycmF5LWFzLXF1ZXVlIGlzIGdvb2QgZW5vdWdoIGhlcmUsIHNpbmNlIHdlIGFyZSBqdXN0IGRlYWxpbmcgd2l0aCBleGNlcHRpb25zLlxudmFyIHBlbmRpbmdFcnJvcnMgPSBbXTtcbnZhciByZXF1ZXN0RXJyb3JUaHJvdyA9IHJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKHRocm93Rmlyc3RFcnJvcik7XG5cbmZ1bmN0aW9uIHRocm93Rmlyc3RFcnJvcigpIHtcbiAgICBpZiAocGVuZGluZ0Vycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgcGVuZGluZ0Vycm9ycy5zaGlmdCgpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDYWxscyBhIHRhc2sgYXMgc29vbiBhcyBwb3NzaWJsZSBhZnRlciByZXR1cm5pbmcsIGluIGl0cyBvd24gZXZlbnQsIHdpdGggcHJpb3JpdHlcbiAqIG92ZXIgb3RoZXIgZXZlbnRzIGxpa2UgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZXBhaW50LiBBbiBlcnJvciB0aHJvd24gZnJvbSBhblxuICogZXZlbnQgd2lsbCBub3QgaW50ZXJydXB0LCBub3IgZXZlbiBzdWJzdGFudGlhbGx5IHNsb3cgZG93biB0aGUgcHJvY2Vzc2luZyBvZlxuICogb3RoZXIgZXZlbnRzLCBidXQgd2lsbCBiZSByYXRoZXIgcG9zdHBvbmVkIHRvIGEgbG93ZXIgcHJpb3JpdHkgZXZlbnQuXG4gKiBAcGFyYW0ge3tjYWxsfX0gdGFzayBBIGNhbGxhYmxlIG9iamVjdCwgdHlwaWNhbGx5IGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBub1xuICogYXJndW1lbnRzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGFzYXA7XG5mdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgICB2YXIgcmF3VGFzaztcbiAgICBpZiAoZnJlZVRhc2tzLmxlbmd0aCkge1xuICAgICAgICByYXdUYXNrID0gZnJlZVRhc2tzLnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJhd1Rhc2sgPSBuZXcgUmF3VGFzaygpO1xuICAgIH1cbiAgICByYXdUYXNrLnRhc2sgPSB0YXNrO1xuICAgIHJhd0FzYXAocmF3VGFzayk7XG59XG5cbi8vIFdlIHdyYXAgdGFza3Mgd2l0aCByZWN5Y2xhYmxlIHRhc2sgb2JqZWN0cy4gIEEgdGFzayBvYmplY3QgaW1wbGVtZW50c1xuLy8gYGNhbGxgLCBqdXN0IGxpa2UgYSBmdW5jdGlvbi5cbmZ1bmN0aW9uIFJhd1Rhc2soKSB7XG4gICAgdGhpcy50YXNrID0gbnVsbDtcbn1cblxuLy8gVGhlIHNvbGUgcHVycG9zZSBvZiB3cmFwcGluZyB0aGUgdGFzayBpcyB0byBjYXRjaCB0aGUgZXhjZXB0aW9uIGFuZCByZWN5Y2xlXG4vLyB0aGUgdGFzayBvYmplY3QgYWZ0ZXIgaXRzIHNpbmdsZSB1c2UuXG5SYXdUYXNrLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIHRoaXMudGFzay5jYWxsKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGFzYXAub25lcnJvcikge1xuICAgICAgICAgICAgLy8gVGhpcyBob29rIGV4aXN0cyBwdXJlbHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gICAgICAgICAgICAvLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXRcbiAgICAgICAgICAgIC8vIGRlcGVuZHMgb24gaXRzIGV4aXN0ZW5jZS5cbiAgICAgICAgICAgIGFzYXAub25lcnJvcihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJbiBhIHdlYiBicm93c2VyLCBleGNlcHRpb25zIGFyZSBub3QgZmF0YWwuIEhvd2V2ZXIsIHRvIGF2b2lkXG4gICAgICAgICAgICAvLyBzbG93aW5nIGRvd24gdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdGFza3MsIHdlIHJldGhyb3cgdGhlIGVycm9yIGluIGFcbiAgICAgICAgICAgIC8vIGxvd2VyIHByaW9yaXR5IHR1cm4uXG4gICAgICAgICAgICBwZW5kaW5nRXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgcmVxdWVzdEVycm9yVGhyb3coKTtcbiAgICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMudGFzayA9IG51bGw7XG4gICAgICAgIGZyZWVUYXNrc1tmcmVlVGFza3MubGVuZ3RoXSA9IHRoaXM7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBVc2UgdGhlIGZhc3Rlc3QgbWVhbnMgcG9zc2libGUgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gaXRzIG93biB0dXJuLCB3aXRoXG4vLyBwcmlvcml0eSBvdmVyIG90aGVyIGV2ZW50cyBpbmNsdWRpbmcgSU8sIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVkcmF3XG4vLyBldmVudHMgaW4gYnJvd3NlcnMuXG4vL1xuLy8gQW4gZXhjZXB0aW9uIHRocm93biBieSBhIHRhc2sgd2lsbCBwZXJtYW5lbnRseSBpbnRlcnJ1cHQgdGhlIHByb2Nlc3Npbmcgb2Zcbi8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZSwgYnV0IGlmIHlvdSB1c2UgYHJhd0FzYXBgIGRpcmVjdGx5LCB5b3UgYXJlIHJlc3BvbnNpYmxlIHRvXG4vLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuLy8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5tb2R1bGUuZXhwb3J0cyA9IHJhd0FzYXA7XG5mdW5jdGlvbiByYXdBc2FwKHRhc2spIHtcbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgICByZXF1ZXN0Rmx1c2goKTtcbiAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBFcXVpdmFsZW50IHRvIHB1c2gsIGJ1dCBhdm9pZHMgYSBmdW5jdGlvbiBjYWxsLlxuICAgIHF1ZXVlW3F1ZXVlLmxlbmd0aF0gPSB0YXNrO1xufVxuXG52YXIgcXVldWUgPSBbXTtcbi8vIE9uY2UgYSBmbHVzaCBoYXMgYmVlbiByZXF1ZXN0ZWQsIG5vIGZ1cnRoZXIgY2FsbHMgdG8gYHJlcXVlc3RGbHVzaGAgYXJlXG4vLyBuZWNlc3NhcnkgdW50aWwgdGhlIG5leHQgYGZsdXNoYCBjb21wbGV0ZXMuXG52YXIgZmx1c2hpbmcgPSBmYWxzZTtcbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGFuIGltcGxlbWVudGF0aW9uLXNwZWNpZmljIG1ldGhvZCB0aGF0IGF0dGVtcHRzIHRvIGtpY2tcbi8vIG9mZiBhIGBmbHVzaGAgZXZlbnQgYXMgcXVpY2tseSBhcyBwb3NzaWJsZS4gYGZsdXNoYCB3aWxsIGF0dGVtcHQgdG8gZXhoYXVzdFxuLy8gdGhlIGV2ZW50IHF1ZXVlIGJlZm9yZSB5aWVsZGluZyB0byB0aGUgYnJvd3NlcidzIG93biBldmVudCBsb29wLlxudmFyIHJlcXVlc3RGbHVzaDtcbi8vIFRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCB0YXNrIHRvIGV4ZWN1dGUgaW4gdGhlIHRhc2sgcXVldWUuIFRoaXMgaXNcbi8vIHByZXNlcnZlZCBiZXR3ZWVuIGNhbGxzIHRvIGBmbHVzaGAgc28gdGhhdCBpdCBjYW4gYmUgcmVzdW1lZCBpZlxuLy8gYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24uXG52YXIgaW5kZXggPSAwO1xuLy8gSWYgYSB0YXNrIHNjaGVkdWxlcyBhZGRpdGlvbmFsIHRhc2tzIHJlY3Vyc2l2ZWx5LCB0aGUgdGFzayBxdWV1ZSBjYW4gZ3Jvd1xuLy8gdW5ib3VuZGVkLiBUbyBwcmV2ZW50IG1lbW9yeSBleGhhdXN0aW9uLCB0aGUgdGFzayBxdWV1ZSB3aWxsIHBlcmlvZGljYWxseVxuLy8gdHJ1bmNhdGUgYWxyZWFkeS1jb21wbGV0ZWQgdGFza3MuXG52YXIgY2FwYWNpdHkgPSAxMDI0O1xuXG4vLyBUaGUgZmx1c2ggZnVuY3Rpb24gcHJvY2Vzc2VzIGFsbCB0YXNrcyB0aGF0IGhhdmUgYmVlbiBzY2hlZHVsZWQgd2l0aFxuLy8gYHJhd0FzYXBgIHVubGVzcyBhbmQgdW50aWwgb25lIG9mIHRob3NlIHRhc2tzIHRocm93cyBhbiBleGNlcHRpb24uXG4vLyBJZiBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgYGZsdXNoYCBlbnN1cmVzIHRoYXQgaXRzIHN0YXRlIHdpbGwgcmVtYWluXG4vLyBjb25zaXN0ZW50IGFuZCB3aWxsIHJlc3VtZSB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGNhbGxlZCBhZ2Fpbi5cbi8vIEhvd2V2ZXIsIGBmbHVzaGAgZG9lcyBub3QgbWFrZSBhbnkgYXJyYW5nZW1lbnRzIHRvIGJlIGNhbGxlZCBhZ2FpbiBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93bi5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHdoaWxlIChpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIC8vIEFkdmFuY2UgdGhlIGluZGV4IGJlZm9yZSBjYWxsaW5nIHRoZSB0YXNrLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSB3aWxsXG4gICAgICAgIC8vIGJlZ2luIGZsdXNoaW5nIG9uIHRoZSBuZXh0IHRhc2sgdGhlIHRhc2sgdGhyb3dzIGFuIGVycm9yLlxuICAgICAgICBpbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgcXVldWVbY3VycmVudEluZGV4XS5jYWxsKCk7XG4gICAgICAgIC8vIFByZXZlbnQgbGVha2luZyBtZW1vcnkgZm9yIGxvbmcgY2hhaW5zIG9mIHJlY3Vyc2l2ZSBjYWxscyB0byBgYXNhcGAuXG4gICAgICAgIC8vIElmIHdlIGNhbGwgYGFzYXBgIHdpdGhpbiB0YXNrcyBzY2hlZHVsZWQgYnkgYGFzYXBgLCB0aGUgcXVldWUgd2lsbFxuICAgICAgICAvLyBncm93LCBidXQgdG8gYXZvaWQgYW4gTyhuKSB3YWxrIGZvciBldmVyeSB0YXNrIHdlIGV4ZWN1dGUsIHdlIGRvbid0XG4gICAgICAgIC8vIHNoaWZ0IHRhc2tzIG9mZiB0aGUgcXVldWUgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gZXhlY3V0ZWQuXG4gICAgICAgIC8vIEluc3RlYWQsIHdlIHBlcmlvZGljYWxseSBzaGlmdCAxMDI0IHRhc2tzIG9mZiB0aGUgcXVldWUuXG4gICAgICAgIGlmIChpbmRleCA+IGNhcGFjaXR5KSB7XG4gICAgICAgICAgICAvLyBNYW51YWxseSBzaGlmdCBhbGwgdmFsdWVzIHN0YXJ0aW5nIGF0IHRoZSBpbmRleCBiYWNrIHRvIHRoZVxuICAgICAgICAgICAgLy8gYmVnaW5uaW5nIG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICAgIGZvciAodmFyIHNjYW4gPSAwLCBuZXdMZW5ndGggPSBxdWV1ZS5sZW5ndGggLSBpbmRleDsgc2NhbiA8IG5ld0xlbmd0aDsgc2NhbisrKSB7XG4gICAgICAgICAgICAgICAgcXVldWVbc2Nhbl0gPSBxdWV1ZVtzY2FuICsgaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcXVldWUubGVuZ3RoIC09IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgaW5kZXggPSAwO1xuICAgIGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGltcGxlbWVudGVkIHVzaW5nIGEgc3RyYXRlZ3kgYmFzZWQgb24gZGF0YSBjb2xsZWN0ZWQgZnJvbVxuLy8gZXZlcnkgYXZhaWxhYmxlIFNhdWNlTGFicyBTZWxlbml1bSB3ZWIgZHJpdmVyIHdvcmtlciBhdCB0aW1lIG9mIHdyaXRpbmcuXG4vLyBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xbUctNVVZR3VwNXF4R2RFTVdraFA2QldDejA1M05VYjJFMVFvVVRVMTZ1QS9lZGl0I2dpZD03ODM3MjQ1OTNcblxuLy8gU2FmYXJpIDYgYW5kIDYuMSBmb3IgZGVza3RvcCwgaVBhZCwgYW5kIGlQaG9uZSBhcmUgdGhlIG9ubHkgYnJvd3NlcnMgdGhhdFxuLy8gaGF2ZSBXZWJLaXRNdXRhdGlvbk9ic2VydmVyIGJ1dCBub3QgdW4tcHJlZml4ZWQgTXV0YXRpb25PYnNlcnZlci5cbi8vIE11c3QgdXNlIGBnbG9iYWxgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG4vLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuLy8gTXV0YXRpb25PYnNlcnZlcnMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgaGF2ZSBoaWdoIHByaW9yaXR5IGFuZCB3b3JrXG4vLyByZWxpYWJseSBldmVyeXdoZXJlIHRoZXkgYXJlIGltcGxlbWVudGVkLlxuLy8gVGhleSBhcmUgaW1wbGVtZW50ZWQgaW4gYWxsIG1vZGVybiBicm93c2Vycy5cbi8vXG4vLyAtIEFuZHJvaWQgNC00LjNcbi8vIC0gQ2hyb21lIDI2LTM0XG4vLyAtIEZpcmVmb3ggMTQtMjlcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbi8vIC0gaVBhZCBTYWZhcmkgNi03LjFcbi8vIC0gaVBob25lIFNhZmFyaSA3LTcuMVxuLy8gLSBTYWZhcmkgNi03XG5pZiAodHlwZW9mIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG5cbi8vIE1lc3NhZ2VDaGFubmVscyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBnaXZlIGRpcmVjdCBhY2Nlc3MgdG8gdGhlIEhUTUxcbi8vIHRhc2sgcXVldWUsIGFyZSBpbXBsZW1lbnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCwgU2FmYXJpIDUuMC0xLCBhbmQgT3BlcmFcbi8vIDExLTEyLCBhbmQgaW4gd2ViIHdvcmtlcnMgaW4gbWFueSBlbmdpbmVzLlxuLy8gQWx0aG91Z2ggbWVzc2FnZSBjaGFubmVscyB5aWVsZCB0byBhbnkgcXVldWVkIHJlbmRlcmluZyBhbmQgSU8gdGFza3MsIHRoZXlcbi8vIHdvdWxkIGJlIGJldHRlciB0aGFuIGltcG9zaW5nIHRoZSA0bXMgZGVsYXkgb2YgdGltZXJzLlxuLy8gSG93ZXZlciwgdGhleSBkbyBub3Qgd29yayByZWxpYWJseSBpbiBJbnRlcm5ldCBFeHBsb3JlciBvciBTYWZhcmkuXG5cbi8vIEludGVybmV0IEV4cGxvcmVyIDEwIGlzIHRoZSBvbmx5IGJyb3dzZXIgdGhhdCBoYXMgc2V0SW1tZWRpYXRlIGJ1dCBkb2VzXG4vLyBub3QgaGF2ZSBNdXRhdGlvbk9ic2VydmVycy5cbi8vIEFsdGhvdWdoIHNldEltbWVkaWF0ZSB5aWVsZHMgdG8gdGhlIGJyb3dzZXIncyByZW5kZXJlciwgaXQgd291bGQgYmVcbi8vIHByZWZlcnJhYmxlIHRvIGZhbGxpbmcgYmFjayB0byBzZXRUaW1lb3V0IHNpbmNlIGl0IGRvZXMgbm90IGhhdmVcbi8vIHRoZSBtaW5pbXVtIDRtcyBwZW5hbHR5LlxuLy8gVW5mb3J0dW5hdGVseSB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwIE1vYmlsZSAoYW5kXG4vLyBEZXNrdG9wIHRvIGEgbGVzc2VyIGV4dGVudCkgdGhhdCByZW5kZXJzIGJvdGggc2V0SW1tZWRpYXRlIGFuZFxuLy8gTWVzc2FnZUNoYW5uZWwgdXNlbGVzcyBmb3IgdGhlIHB1cnBvc2VzIG9mIEFTQVAuXG4vLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3EvaXNzdWVzLzM5NlxuXG4vLyBUaW1lcnMgYXJlIGltcGxlbWVudGVkIHVuaXZlcnNhbGx5LlxuLy8gV2UgZmFsbCBiYWNrIHRvIHRpbWVycyBpbiB3b3JrZXJzIGluIG1vc3QgZW5naW5lcywgYW5kIGluIGZvcmVncm91bmRcbi8vIGNvbnRleHRzIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnMuXG4vLyBIb3dldmVyLCBub3RlIHRoYXQgZXZlbiB0aGlzIHNpbXBsZSBjYXNlIHJlcXVpcmVzIG51YW5jZXMgdG8gb3BlcmF0ZSBpbiBhXG4vLyBicm9hZCBzcGVjdHJ1bSBvZiBicm93c2Vycy5cbi8vXG4vLyAtIEZpcmVmb3ggMy0xM1xuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciA2LTlcbi8vIC0gaVBhZCBTYWZhcmkgNC4zXG4vLyAtIEx5bnggMi44Ljdcbn0gZWxzZSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGZsdXNoKTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgcmVxdWVzdHMgdGhhdCB0aGUgaGlnaCBwcmlvcml0eSBldmVudCBxdWV1ZSBiZSBmbHVzaGVkIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLlxuLy8gVGhpcyBpcyB1c2VmdWwgdG8gcHJldmVudCBhbiBlcnJvciB0aHJvd24gaW4gYSB0YXNrIGZyb20gc3RhbGxpbmcgdGhlIGV2ZW50XG4vLyBxdWV1ZSBpZiB0aGUgZXhjZXB0aW9uIGhhbmRsZWQgYnkgTm9kZS5qc+KAmXNcbi8vIGBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIilgIG9yIGJ5IGEgZG9tYWluLlxucmF3QXNhcC5yZXF1ZXN0Rmx1c2ggPSByZXF1ZXN0Rmx1c2g7XG5cbi8vIFRvIHJlcXVlc3QgYSBoaWdoIHByaW9yaXR5IGV2ZW50LCB3ZSBpbmR1Y2UgYSBtdXRhdGlvbiBvYnNlcnZlciBieSB0b2dnbGluZ1xuLy8gdGhlIHRleHQgb2YgYSB0ZXh0IG5vZGUgYmV0d2VlbiBcIjFcIiBhbmQgXCItMVwiLlxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgICB2YXIgdG9nZ2xlID0gMTtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgdG9nZ2xlID0gLXRvZ2dsZTtcbiAgICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlO1xuICAgIH07XG59XG5cbi8vIFRoZSBtZXNzYWdlIGNoYW5uZWwgdGVjaG5pcXVlIHdhcyBkaXNjb3ZlcmVkIGJ5IE1hbHRlIFVibCBhbmQgd2FzIHRoZVxuLy8gb3JpZ2luYWwgZm91bmRhdGlvbiBmb3IgdGhpcyBsaWJyYXJ5LlxuLy8gaHR0cDovL3d3dy5ub25ibG9ja2luZy5pby8yMDExLzA2L3dpbmRvd25leHR0aWNrLmh0bWxcblxuLy8gU2FmYXJpIDYuMC41IChhdCBsZWFzdCkgaW50ZXJtaXR0ZW50bHkgZmFpbHMgdG8gY3JlYXRlIG1lc3NhZ2UgcG9ydHMgb24gYVxuLy8gcGFnZSdzIGZpcnN0IGxvYWQuIFRoYW5rZnVsbHksIHRoaXMgdmVyc2lvbiBvZiBTYWZhcmkgc3VwcG9ydHNcbi8vIE11dGF0aW9uT2JzZXJ2ZXJzLCBzbyB3ZSBkb24ndCBuZWVkIHRvIGZhbGwgYmFjayBpbiB0aGF0IGNhc2UuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NZXNzYWdlQ2hhbm5lbChjYWxsYmFjaykge1xuLy8gICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4vLyAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBjYWxsYmFjaztcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gRm9yIHJlYXNvbnMgZXhwbGFpbmVkIGFib3ZlLCB3ZSBhcmUgYWxzbyB1bmFibGUgdG8gdXNlIGBzZXRJbW1lZGlhdGVgXG4vLyB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcy5cbi8vIEV2ZW4gaWYgd2Ugd2VyZSwgdGhlcmUgaXMgYW5vdGhlciBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAuXG4vLyBJdCBpcyBub3Qgc3VmZmljaWVudCB0byBhc3NpZ24gYHNldEltbWVkaWF0ZWAgdG8gYHJlcXVlc3RGbHVzaGAgYmVjYXVzZVxuLy8gYHNldEltbWVkaWF0ZWAgbXVzdCBiZSBjYWxsZWQgKmJ5IG5hbWUqIGFuZCB0aGVyZWZvcmUgbXVzdCBiZSB3cmFwcGVkIGluIGFcbi8vIGNsb3N1cmUuXG4vLyBOZXZlciBmb3JnZXQuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21TZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIHNldEltbWVkaWF0ZShjYWxsYmFjayk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gU2FmYXJpIDYuMCBoYXMgYSBwcm9ibGVtIHdoZXJlIHRpbWVycyB3aWxsIGdldCBsb3N0IHdoaWxlIHRoZSB1c2VyIGlzXG4vLyBzY3JvbGxpbmcuIFRoaXMgcHJvYmxlbSBkb2VzIG5vdCBpbXBhY3QgQVNBUCBiZWNhdXNlIFNhZmFyaSA2LjAgc3VwcG9ydHNcbi8vIG11dGF0aW9uIG9ic2VydmVycywgc28gdGhhdCBpbXBsZW1lbnRhdGlvbiBpcyB1c2VkIGluc3RlYWQuXG4vLyBIb3dldmVyLCBpZiB3ZSBldmVyIGVsZWN0IHRvIHVzZSB0aW1lcnMgaW4gU2FmYXJpLCB0aGUgcHJldmFsZW50IHdvcmstYXJvdW5kXG4vLyBpcyB0byBhZGQgYSBzY3JvbGwgZXZlbnQgbGlzdGVuZXIgdGhhdCBjYWxscyBmb3IgYSBmbHVzaC5cblxuLy8gYHNldFRpbWVvdXRgIGRvZXMgbm90IGNhbGwgdGhlIHBhc3NlZCBjYWxsYmFjayBpZiB0aGUgZGVsYXkgaXMgbGVzcyB0aGFuXG4vLyBhcHByb3hpbWF0ZWx5IDcgaW4gd2ViIHdvcmtlcnMgaW4gRmlyZWZveCA4IHRocm91Z2ggMTgsIGFuZCBzb21ldGltZXMgbm90XG4vLyBldmVuIHRoZW4uXG5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgLy8gV2UgZGlzcGF0Y2ggYSB0aW1lb3V0IHdpdGggYSBzcGVjaWZpZWQgZGVsYXkgb2YgMCBmb3IgZW5naW5lcyB0aGF0XG4gICAgICAgIC8vIGNhbiByZWxpYWJseSBhY2NvbW1vZGF0ZSB0aGF0IHJlcXVlc3QuIFRoaXMgd2lsbCB1c3VhbGx5IGJlIHNuYXBwZWRcbiAgICAgICAgLy8gdG8gYSA0IG1pbGlzZWNvbmQgZGVsYXksIGJ1dCBvbmNlIHdlJ3JlIGZsdXNoaW5nLCB0aGVyZSdzIG5vIGRlbGF5XG4gICAgICAgIC8vIGJldHdlZW4gZXZlbnRzLlxuICAgICAgICB2YXIgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaGFuZGxlVGltZXIsIDApO1xuICAgICAgICAvLyBIb3dldmVyLCBzaW5jZSB0aGlzIHRpbWVyIGdldHMgZnJlcXVlbnRseSBkcm9wcGVkIGluIEZpcmVmb3hcbiAgICAgICAgLy8gd29ya2Vycywgd2UgZW5saXN0IGFuIGludGVydmFsIGhhbmRsZSB0aGF0IHdpbGwgdHJ5IHRvIGZpcmVcbiAgICAgICAgLy8gYW4gZXZlbnQgMjAgdGltZXMgcGVyIHNlY29uZCB1bnRpbCBpdCBzdWNjZWVkcy5cbiAgICAgICAgdmFyIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoaGFuZGxlVGltZXIsIDUwKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUaW1lcigpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoZXZlciB0aW1lciBzdWNjZWVkcyB3aWxsIGNhbmNlbCBib3RoIHRpbWVycyBhbmRcbiAgICAgICAgICAgIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8gVGhpcyBpcyBmb3IgYGFzYXAuanNgIG9ubHkuXG4vLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXQgZGVwZW5kcyBvblxuLy8gaXRzIGV4aXN0ZW5jZS5cbnJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyO1xuXG4vLyBBU0FQIHdhcyBvcmlnaW5hbGx5IGEgbmV4dFRpY2sgc2hpbSBpbmNsdWRlZCBpbiBRLiBUaGlzIHdhcyBmYWN0b3JlZCBvdXRcbi8vIGludG8gdGhpcyBBU0FQIHBhY2thZ2UuIEl0IHdhcyBsYXRlciBhZGFwdGVkIHRvIFJTVlAgd2hpY2ggbWFkZSBmdXJ0aGVyXG4vLyBhbWVuZG1lbnRzLiBUaGVzZSBkZWNpc2lvbnMsIHBhcnRpY3VsYXJseSB0byBtYXJnaW5hbGl6ZSBNZXNzYWdlQ2hhbm5lbCBhbmRcbi8vIHRvIGNhcHR1cmUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gaW4gYSBjbG9zdXJlLCB3ZXJlIGludGVncmF0ZWRcbi8vIGJhY2sgaW50byBBU0FQIHByb3Blci5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9jZGRmNzIzMjU0NmE5Y2Y4NTg1MjRiNzVjZGU2ZjllZGY3MjYyMGE3L2xpYi9yc3ZwL2FzYXAuanNcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vdXRpbC9jb25zdGFudHMnKSxcbiAgICBMb2dnaW5nICAgPSByZXF1aXJlKCcuL21peGlucy9sb2dnaW5nJyk7XG5cbnZhciBGYXllID0ge1xuICBWRVJTSU9OOiAgICBjb25zdGFudHMuVkVSU0lPTixcblxuICBDbGllbnQ6ICAgICByZXF1aXJlKCcuL3Byb3RvY29sL2NsaWVudCcpLFxuICBTY2hlZHVsZXI6ICByZXF1aXJlKCcuL3Byb3RvY29sL3NjaGVkdWxlcicpXG59O1xuXG5Mb2dnaW5nLndyYXBwZXIgPSBGYXllO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZheWU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcm9taXNlICAgPSByZXF1aXJlKCcuLi91dGlsL3Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRoZW46IGZ1bmN0aW9uKGNhbGxiYWNrLCBlcnJiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy5fcHJvbWlzZSlcbiAgICAgIHRoaXMuX3Byb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgc2VsZi5fcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgIHNlbGYuX3JlamVjdCAgPSByZWplY3Q7XG4gICAgICB9KTtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2U7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuX3Byb21pc2UudGhlbihjYWxsYmFjaywgZXJyYmFjayk7XG4gIH0sXG5cbiAgY2FsbGJhY2s6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbih2YWx1ZSkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlKSB9KTtcbiAgfSxcblxuICBlcnJiYWNrOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgZnVuY3Rpb24ocmVhc29uKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgcmVhc29uKSB9KTtcbiAgfSxcblxuICB0aW1lb3V0OiBmdW5jdGlvbihzZWNvbmRzLCBtZXNzYWdlKSB7XG4gICAgdGhpcy50aGVuKCk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuX3RpbWVyID0gZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLl9yZWplY3QobWVzc2FnZSk7XG4gICAgfSwgc2Vjb25kcyAqIDEwMDApO1xuICB9LFxuXG4gIHNldERlZmVycmVkU3RhdHVzOiBmdW5jdGlvbihzdGF0dXMsIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuX3RpbWVyKSBnbG9iYWwuY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcblxuICAgIHRoaXMudGhlbigpO1xuXG4gICAgaWYgKHN0YXR1cyA9PT0gJ3N1Y2NlZWRlZCcpXG4gICAgICB0aGlzLl9yZXNvbHZlKHZhbHVlKTtcbiAgICBlbHNlIGlmIChzdGF0dXMgPT09ICdmYWlsZWQnKVxuICAgICAgdGhpcy5fcmVqZWN0KHZhbHVlKTtcbiAgICBlbHNlXG4gICAgICBkZWxldGUgdGhpcy5fcHJvbWlzZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRvSlNPTiA9IHJlcXVpcmUoJy4uL3V0aWwvdG9fanNvbicpO1xuXG52YXIgTG9nZ2luZyA9IHtcbiAgTE9HX0xFVkVMUzoge1xuICAgIGZhdGFsOiAgNCxcbiAgICBlcnJvcjogIDMsXG4gICAgd2FybjogICAyLFxuICAgIGluZm86ICAgMSxcbiAgICBkZWJ1ZzogIDBcbiAgfSxcblxuICB3cml0ZUxvZzogZnVuY3Rpb24obWVzc2FnZUFyZ3MsIGxldmVsKSB7XG4gICAgdmFyIGxvZ2dlciA9IExvZ2dpbmcubG9nZ2VyIHx8IChMb2dnaW5nLndyYXBwZXIgfHwgTG9nZ2luZykubG9nZ2VyO1xuICAgIGlmICghbG9nZ2VyKSByZXR1cm47XG5cbiAgICB2YXIgYXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KG1lc3NhZ2VBcmdzKSxcbiAgICAgICAgYmFubmVyID0gJ1tGYXllJyxcbiAgICAgICAga2xhc3MgID0gdGhpcy5jbGFzc05hbWUsXG5cbiAgICAgICAgbWVzc2FnZSA9IGFyZ3Muc2hpZnQoKS5yZXBsYWNlKC9cXD8vZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0b0pTT04oYXJncy5zaGlmdCgpKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuICdbT2JqZWN0XSc7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIGlmIChrbGFzcykgYmFubmVyICs9ICcuJyArIGtsYXNzO1xuICAgIGJhbm5lciArPSAnXSAnO1xuXG4gICAgaWYgKHR5cGVvZiBsb2dnZXJbbGV2ZWxdID09PSAnZnVuY3Rpb24nKVxuICAgICAgbG9nZ2VyW2xldmVsXShiYW5uZXIgKyBtZXNzYWdlKTtcbiAgICBlbHNlIGlmICh0eXBlb2YgbG9nZ2VyID09PSAnZnVuY3Rpb24nKVxuICAgICAgbG9nZ2VyKGJhbm5lciArIG1lc3NhZ2UpO1xuICB9XG59O1xuXG5mb3IgKHZhciBrZXkgaW4gTG9nZ2luZy5MT0dfTEVWRUxTKVxuICAoZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBMb2dnaW5nW2xldmVsXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy53cml0ZUxvZyhhcmd1bWVudHMsIGxldmVsKTtcbiAgICB9O1xuICB9KShrZXkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2dpbmc7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4uL3V0aWwvZXZlbnRfZW1pdHRlcicpO1xuXG52YXIgUHVibGlzaGVyID0ge1xuICBjb3VudExpc3RlbmVyczogZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzKGV2ZW50VHlwZSkubGVuZ3RoO1xuICB9LFxuXG4gIGJpbmQ6IGZ1bmN0aW9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgc2xpY2UgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBsaXN0ZW5lci5hcHBseShjb250ZXh0LCBzbGljZS5jYWxsKGFyZ3VtZW50cykpIH07XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMgfHwgW107XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goW2V2ZW50VHlwZSwgbGlzdGVuZXIsIGNvbnRleHQsIGhhbmRsZXJdKTtcbiAgICByZXR1cm4gdGhpcy5vbihldmVudFR5cGUsIGhhbmRsZXIpO1xuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lciwgY29udGV4dCkge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycyB8fCBbXTtcbiAgICB2YXIgbiA9IHRoaXMuX2xpc3RlbmVycy5sZW5ndGgsIHR1cGxlO1xuXG4gICAgd2hpbGUgKG4tLSkge1xuICAgICAgdHVwbGUgPSB0aGlzLl9saXN0ZW5lcnNbbl07XG4gICAgICBpZiAodHVwbGVbMF0gIT09IGV2ZW50VHlwZSkgY29udGludWU7XG4gICAgICBpZiAobGlzdGVuZXIgJiYgKHR1cGxlWzFdICE9PSBsaXN0ZW5lciB8fCB0dXBsZVsyXSAhPT0gY29udGV4dCkpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShuLCAxKTtcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnRUeXBlLCB0dXBsZVszXSk7XG4gICAgfVxuICB9XG59O1xuXG5leHRlbmQoUHVibGlzaGVyLCBFdmVudEVtaXR0ZXIucHJvdG90eXBlKTtcblB1Ymxpc2hlci50cmlnZ2VyID0gUHVibGlzaGVyLmVtaXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gUHVibGlzaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkVGltZW91dDogZnVuY3Rpb24obmFtZSwgZGVsYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fdGltZW91dHMgPSB0aGlzLl90aW1lb3V0cyB8fCB7fTtcbiAgICBpZiAodGhpcy5fdGltZW91dHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHJldHVybjtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fdGltZW91dHNbbmFtZV0gPSBnbG9iYWwuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGRlbGV0ZSBzZWxmLl90aW1lb3V0c1tuYW1lXTtcbiAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgfSwgMTAwMCAqIGRlbGF5KTtcbiAgfSxcblxuICByZW1vdmVUaW1lb3V0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdGhpcy5fdGltZW91dHMgPSB0aGlzLl90aW1lb3V0cyB8fCB7fTtcbiAgICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXRzW25hbWVdO1xuICAgIGlmICghdGltZW91dCkgcmV0dXJuO1xuICAgIGdsb2JhbC5jbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgZGVsZXRlIHRoaXMuX3RpbWVvdXRzW25hbWVdO1xuICB9LFxuXG4gIHJlbW92ZUFsbFRpbWVvdXRzOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl90aW1lb3V0cyA9IHRoaXMuX3RpbWVvdXRzIHx8IHt9O1xuICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5fdGltZW91dHMpIHRoaXMucmVtb3ZlVGltZW91dChuYW1lKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBleHRlbmQgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIFB1Ymxpc2hlciA9IHJlcXVpcmUoJy4uL21peGlucy9wdWJsaXNoZXInKSxcbiAgICBHcmFtbWFyICAgPSByZXF1aXJlKCcuL2dyYW1tYXInKTtcblxudmFyIENoYW5uZWwgPSBDbGFzcyh7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLmlkID0gdGhpcy5uYW1lID0gbmFtZTtcbiAgfSxcblxuICBwdXNoOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdGhpcy50cmlnZ2VyKCdtZXNzYWdlJywgbWVzc2FnZSk7XG4gIH0sXG5cbiAgaXNVbnVzZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50TGlzdGVuZXJzKCdtZXNzYWdlJykgPT09IDA7XG4gIH1cbn0pO1xuXG5leHRlbmQoQ2hhbm5lbC5wcm90b3R5cGUsIFB1Ymxpc2hlcik7XG5cbmV4dGVuZChDaGFubmVsLCB7XG4gIEhBTkRTSEFLRTogICAgJy9tZXRhL2hhbmRzaGFrZScsXG4gIENPTk5FQ1Q6ICAgICAgJy9tZXRhL2Nvbm5lY3QnLFxuICBTVUJTQ1JJQkU6ICAgICcvbWV0YS9zdWJzY3JpYmUnLFxuICBVTlNVQlNDUklCRTogICcvbWV0YS91bnN1YnNjcmliZScsXG4gIERJU0NPTk5FQ1Q6ICAgJy9tZXRhL2Rpc2Nvbm5lY3QnLFxuXG4gIE1FVEE6ICAgICAgICAgJ21ldGEnLFxuICBTRVJWSUNFOiAgICAgICdzZXJ2aWNlJyxcblxuICBleHBhbmQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLnBhcnNlKG5hbWUpLFxuICAgICAgICBjaGFubmVscyA9IFsnLyoqJywgbmFtZV07XG5cbiAgICB2YXIgY29weSA9IHNlZ21lbnRzLnNsaWNlKCk7XG4gICAgY29weVtjb3B5Lmxlbmd0aCAtIDFdID0gJyonO1xuICAgIGNoYW5uZWxzLnB1c2godGhpcy51bnBhcnNlKGNvcHkpKTtcblxuICAgIGZvciAodmFyIGkgPSAxLCBuID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBjb3B5ID0gc2VnbWVudHMuc2xpY2UoMCwgaSk7XG4gICAgICBjb3B5LnB1c2goJyoqJyk7XG4gICAgICBjaGFubmVscy5wdXNoKHRoaXMudW5wYXJzZShjb3B5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5uZWxzO1xuICB9LFxuXG4gIGlzVmFsaWQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gR3JhbW1hci5DSEFOTkVMX05BTUUudGVzdChuYW1lKSB8fFxuICAgICAgICAgICBHcmFtbWFyLkNIQU5ORUxfUEFUVEVSTi50ZXN0KG5hbWUpO1xuICB9LFxuXG4gIHBhcnNlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLmlzVmFsaWQobmFtZSkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBuYW1lLnNwbGl0KCcvJykuc2xpY2UoMSk7XG4gIH0sXG5cbiAgdW5wYXJzZTogZnVuY3Rpb24oc2VnbWVudHMpIHtcbiAgICByZXR1cm4gJy8nICsgc2VnbWVudHMuam9pbignLycpO1xuICB9LFxuXG4gIGlzTWV0YTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBzZWdtZW50cyA9IHRoaXMucGFyc2UobmFtZSk7XG4gICAgcmV0dXJuIHNlZ21lbnRzID8gKHNlZ21lbnRzWzBdID09PSB0aGlzLk1FVEEpIDogbnVsbDtcbiAgfSxcblxuICBpc1NlcnZpY2U6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgc2VnbWVudHMgPSB0aGlzLnBhcnNlKG5hbWUpO1xuICAgIHJldHVybiBzZWdtZW50cyA/IChzZWdtZW50c1swXSA9PT0gdGhpcy5TRVJWSUNFKSA6IG51bGw7XG4gIH0sXG5cbiAgaXNTdWJzY3JpYmFibGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZChuYW1lKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuICF0aGlzLmlzTWV0YShuYW1lKSAmJiAhdGhpcy5pc1NlcnZpY2UobmFtZSk7XG4gIH0sXG5cbiAgU2V0OiBDbGFzcyh7XG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9jaGFubmVscyA9IHt9O1xuICAgIH0sXG5cbiAgICBnZXRLZXlzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXlzID0gW107XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5fY2hhbm5lbHMpIGtleXMucHVzaChrZXkpO1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW25hbWVdO1xuICAgIH0sXG5cbiAgICBoYXNTdWJzY3JpcHRpb246IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShuYW1lKTtcbiAgICB9LFxuXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbihuYW1lcywgc3Vic2NyaXB0aW9uKSB7XG4gICAgICB2YXIgbmFtZTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gbmFtZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tuYW1lXSA9IHRoaXMuX2NoYW5uZWxzW25hbWVdIHx8IG5ldyBDaGFubmVsKG5hbWUpO1xuICAgICAgICBjaGFubmVsLmJpbmQoJ21lc3NhZ2UnLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24obmFtZSwgc3Vic2NyaXB0aW9uKSB7XG4gICAgICB2YXIgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzW25hbWVdO1xuICAgICAgaWYgKCFjaGFubmVsKSByZXR1cm4gZmFsc2U7XG4gICAgICBjaGFubmVsLnVuYmluZCgnbWVzc2FnZScsIHN1YnNjcmlwdGlvbik7XG5cbiAgICAgIGlmIChjaGFubmVsLmlzVW51c2VkKCkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUobmFtZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXN0cmlidXRlTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgdmFyIGNoYW5uZWxzID0gQ2hhbm5lbC5leHBhbmQobWVzc2FnZS5jaGFubmVsKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBjaGFubmVscy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsc1tpXV07XG4gICAgICAgIGlmIChjaGFubmVsKSBjaGFubmVsLnRyaWdnZXIoJ21lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFubmVsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNhcCAgICAgICAgICAgID0gcmVxdWlyZSgnYXNhcCcpLFxuICAgIENsYXNzICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBQcm9taXNlICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3Byb21pc2UnKSxcbiAgICBVUkkgICAgICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGFycmF5ICAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvYXJyYXknKSxcbiAgICBicm93c2VyICAgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2Jyb3dzZXInKSxcbiAgICBjb25zdGFudHMgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NvbnN0YW50cycpLFxuICAgIGV4dGVuZCAgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgdmFsaWRhdGVPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC92YWxpZGF0ZV9vcHRpb25zJyksXG4gICAgRGVmZXJyYWJsZSAgICAgID0gcmVxdWlyZSgnLi4vbWl4aW5zL2RlZmVycmFibGUnKSxcbiAgICBMb2dnaW5nICAgICAgICAgPSByZXF1aXJlKCcuLi9taXhpbnMvbG9nZ2luZycpLFxuICAgIFB1Ymxpc2hlciAgICAgICA9IHJlcXVpcmUoJy4uL21peGlucy9wdWJsaXNoZXInKSxcbiAgICBDaGFubmVsICAgICAgICAgPSByZXF1aXJlKCcuL2NoYW5uZWwnKSxcbiAgICBEaXNwYXRjaGVyICAgICAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKSxcbiAgICBFcnJvciAgICAgICAgICAgPSByZXF1aXJlKCcuL2Vycm9yJyksXG4gICAgRXh0ZW5zaWJsZSAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpYmxlJyksXG4gICAgUHVibGljYXRpb24gICAgID0gcmVxdWlyZSgnLi9wdWJsaWNhdGlvbicpLFxuICAgIFN1YnNjcmlwdGlvbiAgICA9IHJlcXVpcmUoJy4vc3Vic2NyaXB0aW9uJyk7XG5cbnZhciBDbGllbnQgPSBDbGFzcyh7IGNsYXNzTmFtZTogJ0NsaWVudCcsXG4gIFVOQ09OTkVDVEVEOiAgICAgICAgMSxcbiAgQ09OTkVDVElORzogICAgICAgICAyLFxuICBDT05ORUNURUQ6ICAgICAgICAgIDMsXG4gIERJU0NPTk5FQ1RFRDogICAgICAgNCxcblxuICBIQU5EU0hBS0U6ICAgICAgICAgICdoYW5kc2hha2UnLFxuICBSRVRSWTogICAgICAgICAgICAgICdyZXRyeScsXG4gIE5PTkU6ICAgICAgICAgICAgICAgJ25vbmUnLFxuXG4gIENPTk5FQ1RJT05fVElNRU9VVDogNjAsXG5cbiAgREVGQVVMVF9FTkRQT0lOVDogICAnL2JheWV1eCcsXG4gIElOVEVSVkFMOiAgICAgICAgICAgMCxcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihlbmRwb2ludCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5mbygnTmV3IGNsaWVudCBjcmVhdGVkIGZvciA/JywgZW5kcG9pbnQpO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFsaWRhdGVPcHRpb25zKG9wdGlvbnMsIFsnaW50ZXJ2YWwnLCAndGltZW91dCcsICdlbmRwb2ludHMnLCAncHJveHknLCAncmV0cnknLCAnc2NoZWR1bGVyJywgJ3dlYnNvY2tldEV4dGVuc2lvbnMnLCAndGxzJywgJ2NhJ10pO1xuXG4gICAgdGhpcy5fY2hhbm5lbHMgICA9IG5ldyBDaGFubmVsLlNldCgpO1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIgPSBEaXNwYXRjaGVyLmNyZWF0ZSh0aGlzLCBlbmRwb2ludCB8fCB0aGlzLkRFRkFVTFRfRU5EUE9JTlQsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fbWVzc2FnZUlkID0gMDtcbiAgICB0aGlzLl9zdGF0ZSAgICAgPSB0aGlzLlVOQ09OTkVDVEVEO1xuXG4gICAgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3MgPSB7fTtcblxuICAgIHRoaXMuX2FkdmljZSA9IHtcbiAgICAgIHJlY29ubmVjdDogdGhpcy5SRVRSWSxcbiAgICAgIGludGVydmFsOiAgMTAwMCAqIChvcHRpb25zLmludGVydmFsIHx8IHRoaXMuSU5URVJWQUwpLFxuICAgICAgdGltZW91dDogICAxMDAwICogKG9wdGlvbnMudGltZW91dCAgfHwgdGhpcy5DT05ORUNUSU9OX1RJTUVPVVQpXG4gICAgfTtcbiAgICB0aGlzLl9kaXNwYXRjaGVyLnRpbWVvdXQgPSB0aGlzLl9hZHZpY2UudGltZW91dCAvIDEwMDA7XG5cbiAgICB0aGlzLl9kaXNwYXRjaGVyLmJpbmQoJ21lc3NhZ2UnLCB0aGlzLl9yZWNlaXZlTWVzc2FnZSwgdGhpcyk7XG5cbiAgICBpZiAoYnJvd3Nlci5FdmVudCAmJiBnbG9iYWwub25iZWZvcmV1bmxvYWQgIT09IHVuZGVmaW5lZClcbiAgICAgIGJyb3dzZXIuRXZlbnQub24oZ2xvYmFsLCAnYmVmb3JldW5sb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChhcnJheS5pbmRleE9mKHRoaXMuX2Rpc3BhdGNoZXIuX2Rpc2FibGVkLCAnYXV0b2Rpc2Nvbm5lY3QnKSA8IDApXG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBhZGRXZWJzb2NrZXRFeHRlbnNpb246IGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyLmFkZFdlYnNvY2tldEV4dGVuc2lvbihleHRlbnNpb24pO1xuICB9LFxuXG4gIGRpc2FibGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hlci5kaXNhYmxlKGZlYXR1cmUpO1xuICB9LFxuXG4gIHNldEhlYWRlcjogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hlci5zZXRIZWFkZXIobmFtZSwgdmFsdWUpO1xuICB9LFxuXG4gIC8vIFJlcXVlc3RcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogdmVyc2lvblxuICAvLyAgICAgICAgICAgICAgICAqIHN1cHBvcnRlZENvbm5lY3Rpb25UeXBlc1xuICAvLyBNQVkgaW5jbHVkZTogICAqIG1pbmltdW1WZXJzaW9uXG4gIC8vICAgICAgICAgICAgICAgICogZXh0XG4gIC8vICAgICAgICAgICAgICAgICogaWRcbiAgLy9cbiAgLy8gU3VjY2VzcyBSZXNwb25zZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRmFpbGVkIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIHZlcnNpb24gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gICAgICAgICAgICAgICAgKiBzdXBwb3J0ZWRDb25uZWN0aW9uVHlwZXMgICAgICAgICAgICAgICAgICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIHN1cHBvcnRlZENvbm5lY3Rpb25UeXBlc1xuICAvLyAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFkdmljZVxuICAvLyBNQVkgaW5jbHVkZTogICAqIG1pbmltdW1WZXJzaW9uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHZlcnNpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBhZHZpY2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBtaW5pbXVtVmVyc2lvblxuICAvLyAgICAgICAgICAgICAgICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGlkXG4gIC8vICAgICAgICAgICAgICAgICogYXV0aFN1Y2Nlc3NmdWxcbiAgaGFuZHNoYWtlOiBmdW5jdGlvbihjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmICh0aGlzLl9hZHZpY2UucmVjb25uZWN0ID09PSB0aGlzLk5PTkUpIHJldHVybjtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IHRoaXMuVU5DT05ORUNURUQpIHJldHVybjtcblxuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5DT05ORUNUSU5HO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuaW5mbygnSW5pdGlhdGluZyBoYW5kc2hha2Ugd2l0aCA/JywgVVJJLnN0cmluZ2lmeSh0aGlzLl9kaXNwYXRjaGVyLmVuZHBvaW50KSk7XG4gICAgdGhpcy5fZGlzcGF0Y2hlci5zZWxlY3RUcmFuc3BvcnQoY29uc3RhbnRzLk1BTkRBVE9SWV9DT05ORUNUSU9OX1RZUEVTKTtcblxuICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6ICAgICAgICAgICAgICAgICAgQ2hhbm5lbC5IQU5EU0hBS0UsXG4gICAgICB2ZXJzaW9uOiAgICAgICAgICAgICAgICAgIGNvbnN0YW50cy5CQVlFVVhfVkVSU0lPTixcbiAgICAgIHN1cHBvcnRlZENvbm5lY3Rpb25UeXBlczogdGhpcy5fZGlzcGF0Y2hlci5nZXRDb25uZWN0aW9uVHlwZXMoKVxuXG4gICAgfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzZnVsKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gdGhpcy5DT05ORUNURUQ7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQgID0gcmVzcG9uc2UuY2xpZW50SWQ7XG5cbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5zZWxlY3RUcmFuc3BvcnQocmVzcG9uc2Uuc3VwcG9ydGVkQ29ubmVjdGlvblR5cGVzKTtcblxuICAgICAgICB0aGlzLmluZm8oJ0hhbmRzaGFrZSBzdWNjZXNzZnVsOiA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpYmUodGhpcy5fY2hhbm5lbHMuZ2V0S2V5cygpLCB0cnVlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBhc2FwKGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQpIH0pO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZm8oJ0hhbmRzaGFrZSB1bnN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHNlbGYuaGFuZHNoYWtlKGNhbGxiYWNrLCBjb250ZXh0KSB9LCB0aGlzLl9kaXNwYXRjaGVyLnJldHJ5ICogMTAwMCk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gdGhpcy5VTkNPTk5FQ1RFRDtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICAvLyBSZXF1ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vICAgICAgICAgICAgICAgICogY29ubmVjdGlvblR5cGUgICAgICAgICAgICAgICAgICAgICAqIGNsaWVudElkXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogZXh0ICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFkdmljZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogaWRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogdGltZXN0YW1wXG4gIGNvbm5lY3Q6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgaWYgKHRoaXMuX2FkdmljZS5yZWNvbm5lY3QgPT09IHRoaXMuTk9ORSkgcmV0dXJuO1xuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gdGhpcy5ESVNDT05ORUNURUQpIHJldHVybjtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gdGhpcy5VTkNPTk5FQ1RFRClcbiAgICAgIHJldHVybiB0aGlzLmhhbmRzaGFrZShmdW5jdGlvbigpIHsgdGhpcy5jb25uZWN0KGNhbGxiYWNrLCBjb250ZXh0KSB9LCB0aGlzKTtcblxuICAgIHRoaXMuY2FsbGJhY2soY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gdGhpcy5DT05ORUNURUQpIHJldHVybjtcblxuICAgIHRoaXMuaW5mbygnQ2FsbGluZyBkZWZlcnJlZCBhY3Rpb25zIGZvciA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG4gICAgdGhpcy5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgdGhpcy5zZXREZWZlcnJlZFN0YXR1cygndW5rbm93bicpO1xuXG4gICAgaWYgKHRoaXMuX2Nvbm5lY3RSZXF1ZXN0KSByZXR1cm47XG4gICAgdGhpcy5fY29ubmVjdFJlcXVlc3QgPSB0cnVlO1xuXG4gICAgdGhpcy5pbmZvKCdJbml0aWF0aW5nIGNvbm5lY3Rpb24gZm9yID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcblxuICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6ICAgICAgICBDaGFubmVsLkNPTk5FQ1QsXG4gICAgICBjbGllbnRJZDogICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCxcbiAgICAgIGNvbm5lY3Rpb25UeXBlOiB0aGlzLl9kaXNwYXRjaGVyLmNvbm5lY3Rpb25UeXBlXG5cbiAgICB9LCB7fSwgdGhpcy5fY3ljbGVDb25uZWN0aW9uLCB0aGlzKTtcbiAgfSxcblxuICAvLyBSZXF1ZXN0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2VcbiAgLy8gTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsICAgICAgICAgICAgIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbFxuICAvLyAgICAgICAgICAgICAgICAqIGNsaWVudElkICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWNjZXNzZnVsXG4gIC8vIE1BWSBpbmNsdWRlOiAgICogZXh0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGNsaWVudElkXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBpZFxuICBkaXNjb25uZWN0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IHRoaXMuQ09OTkVDVEVEKSByZXR1cm47XG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLkRJU0NPTk5FQ1RFRDtcblxuICAgIHRoaXMuaW5mbygnRGlzY29ubmVjdGluZyA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCk7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHVibGljYXRpb24oKTtcblxuICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgIGNoYW5uZWw6ICBDaGFubmVsLkRJU0NPTk5FQ1QsXG4gICAgICBjbGllbnRJZDogdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZFxuXG4gICAgfSwge30sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzc2Z1bCkge1xuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsb3NlKCk7XG4gICAgICAgIHByb21pc2Uuc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZS5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJywgRXJyb3IucGFyc2UocmVzcG9uc2UuZXJyb3IpKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMuaW5mbygnQ2xlYXJpbmcgY2hhbm5lbCBsaXN0ZW5lcnMgZm9yID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcbiAgICB0aGlzLl9jaGFubmVscyA9IG5ldyBDaGFubmVsLlNldCgpO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH0sXG5cbiAgLy8gUmVxdWVzdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiBjbGllbnRJZCAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyAgICAgICAgICAgICAgICAqIHN1YnNjcmlwdGlvbiAgICAgICAgICAgICAgICAgICAgICAgKiBjbGllbnRJZFxuICAvLyBNQVkgaW5jbHVkZTogICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBzdWJzY3JpcHRpb25cbiAgLy8gICAgICAgICAgICAgICAgKiBpZCAgICAgICAgICAgICAgICAgIE1BWSBpbmNsdWRlOiAgICogZXJyb3JcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogYWR2aWNlXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGV4dFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBpZFxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB0aW1lc3RhbXBcbiAgc3Vic2NyaWJlOiBmdW5jdGlvbihjaGFubmVsLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmIChjaGFubmVsIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICByZXR1cm4gYXJyYXkubWFwKGNoYW5uZWwsIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlKGMsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICAgIH0sIHRoaXMpO1xuXG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24odGhpcywgY2hhbm5lbCwgY2FsbGJhY2ssIGNvbnRleHQpLFxuICAgICAgICBmb3JjZSAgICAgICAgPSAoY2FsbGJhY2sgPT09IHRydWUpLFxuICAgICAgICBoYXNTdWJzY3JpYmUgPSB0aGlzLl9jaGFubmVscy5oYXNTdWJzY3JpcHRpb24oY2hhbm5lbCk7XG5cbiAgICBpZiAoaGFzU3Vic2NyaWJlICYmICFmb3JjZSkge1xuICAgICAgdGhpcy5fY2hhbm5lbHMuc3Vic2NyaWJlKFtjaGFubmVsXSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuaW5mbygnQ2xpZW50ID8gYXR0ZW1wdGluZyB0byBzdWJzY3JpYmUgdG8gPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIGNoYW5uZWwpO1xuICAgICAgaWYgKCFmb3JjZSkgdGhpcy5fY2hhbm5lbHMuc3Vic2NyaWJlKFtjaGFubmVsXSwgc3Vic2NyaXB0aW9uKTtcblxuICAgICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBjaGFubmVsOiAgICAgIENoYW5uZWwuU1VCU0NSSUJFLFxuICAgICAgICBjbGllbnRJZDogICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsXG4gICAgICAgIHN1YnNjcmlwdGlvbjogY2hhbm5lbFxuXG4gICAgICB9LCB7fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzZnVsKSB7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnLCBFcnJvci5wYXJzZShyZXNwb25zZS5lcnJvcikpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVscy51bnN1YnNjcmliZShjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoYW5uZWxzID0gW10uY29uY2F0KHJlc3BvbnNlLnN1YnNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuaW5mbygnU3Vic2NyaXB0aW9uIGFja25vd2xlZGdlZCBmb3IgPyB0byA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbHMpO1xuICAgICAgICBzdWJzY3JpcHRpb24uc2V0RGVmZXJyZWRTdGF0dXMoJ3N1Y2NlZWRlZCcpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9LFxuXG4gIC8vIFJlcXVlc3QgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNwb25zZVxuICAvLyBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWwgICAgICAgICAgICAgTVVTVCBpbmNsdWRlOiAgKiBjaGFubmVsXG4gIC8vICAgICAgICAgICAgICAgICogY2xpZW50SWQgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxcbiAgLy8gICAgICAgICAgICAgICAgKiBzdWJzY3JpcHRpb24gICAgICAgICAgICAgICAgICAgICAgICogY2xpZW50SWRcbiAgLy8gTUFZIGluY2x1ZGU6ICAgKiBleHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3Vic2NyaXB0aW9uXG4gIC8vICAgICAgICAgICAgICAgICogaWQgICAgICAgICAgICAgICAgICBNQVkgaW5jbHVkZTogICAqIGVycm9yXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGFkdmljZVxuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogaWRcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogdGltZXN0YW1wXG4gIHVuc3Vic2NyaWJlOiBmdW5jdGlvbihjaGFubmVsLCBzdWJzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hhbm5lbCBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgcmV0dXJuIGFycmF5Lm1hcChjaGFubmVsLCBmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVuc3Vic2NyaWJlKGMsIHN1YnNjcmlwdGlvbik7XG4gICAgICB9LCB0aGlzKTtcblxuICAgIHZhciBkZWFkID0gdGhpcy5fY2hhbm5lbHMudW5zdWJzY3JpYmUoY2hhbm5lbCwgc3Vic2NyaXB0aW9uKTtcbiAgICBpZiAoIWRlYWQpIHJldHVybjtcblxuICAgIHRoaXMuY29ubmVjdChmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuaW5mbygnQ2xpZW50ID8gYXR0ZW1wdGluZyB0byB1bnN1YnNjcmliZSBmcm9tID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBjaGFubmVsKTtcblxuICAgICAgdGhpcy5fc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBjaGFubmVsOiAgICAgIENoYW5uZWwuVU5TVUJTQ1JJQkUsXG4gICAgICAgIGNsaWVudElkOiAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCxcbiAgICAgICAgc3Vic2NyaXB0aW9uOiBjaGFubmVsXG5cbiAgICAgIH0sIHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3NmdWwpIHJldHVybjtcblxuICAgICAgICB2YXIgY2hhbm5lbHMgPSBbXS5jb25jYXQocmVzcG9uc2Uuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5pbmZvKCdVbnN1YnNjcmlwdGlvbiBhY2tub3dsZWRnZWQgZm9yID8gZnJvbSA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbHMpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgLy8gUmVxdWVzdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc3BvbnNlXG4gIC8vIE1VU1QgaW5jbHVkZTogICogY2hhbm5lbCAgICAgICAgICAgICBNVVNUIGluY2x1ZGU6ICAqIGNoYW5uZWxcbiAgLy8gICAgICAgICAgICAgICAgKiBkYXRhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogc3VjY2Vzc2Z1bFxuICAvLyBNQVkgaW5jbHVkZTogICAqIGNsaWVudElkICAgICAgICAgICAgTUFZIGluY2x1ZGU6ICAgKiBpZFxuICAvLyAgICAgICAgICAgICAgICAqIGlkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBlcnJvclxuICAvLyAgICAgICAgICAgICAgICAqIGV4dCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBleHRcbiAgcHVibGlzaDogZnVuY3Rpb24oY2hhbm5lbCwgZGF0YSwgb3B0aW9ucykge1xuICAgIHZhbGlkYXRlT3B0aW9ucyhvcHRpb25zIHx8IHt9LCBbJ2F0dGVtcHRzJywgJ2RlYWRsaW5lJ10pO1xuICAgIHZhciBwdWJsaWNhdGlvbiA9IG5ldyBQdWJsaWNhdGlvbigpO1xuXG4gICAgdGhpcy5jb25uZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5pbmZvKCdDbGllbnQgPyBxdWV1ZWluZyBwdWJsaXNoZWQgbWVzc2FnZSB0byA/OiA/JywgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCwgY2hhbm5lbCwgZGF0YSk7XG5cbiAgICAgIHRoaXMuX3NlbmRNZXNzYWdlKHtcbiAgICAgICAgY2hhbm5lbDogIGNoYW5uZWwsXG4gICAgICAgIGRhdGE6ICAgICBkYXRhLFxuICAgICAgICBjbGllbnRJZDogdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZFxuXG4gICAgICB9LCBvcHRpb25zLCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzc2Z1bClcbiAgICAgICAgICBwdWJsaWNhdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwdWJsaWNhdGlvbi5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJywgRXJyb3IucGFyc2UocmVzcG9uc2UuZXJyb3IpKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHB1YmxpY2F0aW9uO1xuICB9LFxuXG4gIF9zZW5kTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSwgb3B0aW9ucywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBtZXNzYWdlLmlkID0gdGhpcy5fZ2VuZXJhdGVNZXNzYWdlSWQoKTtcblxuICAgIHZhciB0aW1lb3V0ID0gdGhpcy5fYWR2aWNlLnRpbWVvdXRcbiAgICAgICAgICAgICAgICA/IDEuMiAqIHRoaXMuX2FkdmljZS50aW1lb3V0IC8gMTAwMFxuICAgICAgICAgICAgICAgIDogMS4yICogdGhpcy5fZGlzcGF0Y2hlci5yZXRyeTtcblxuICAgIHRoaXMucGlwZVRocm91Z2hFeHRlbnNpb25zKCdvdXRnb2luZycsIG1lc3NhZ2UsIG51bGwsIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAgICAgaWYgKGNhbGxiYWNrKSB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1ttZXNzYWdlLmlkXSA9IFtjYWxsYmFjaywgY29udGV4dF07XG4gICAgICB0aGlzLl9kaXNwYXRjaGVyLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIHRpbWVvdXQsIG9wdGlvbnMgfHwge30pO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIF9nZW5lcmF0ZU1lc3NhZ2VJZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fbWVzc2FnZUlkICs9IDE7XG4gICAgaWYgKHRoaXMuX21lc3NhZ2VJZCA+PSBNYXRoLnBvdygyLDMyKSkgdGhpcy5fbWVzc2FnZUlkID0gMDtcbiAgICByZXR1cm4gdGhpcy5fbWVzc2FnZUlkLnRvU3RyaW5nKDM2KTtcbiAgfSxcblxuICBfcmVjZWl2ZU1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB2YXIgaWQgPSBtZXNzYWdlLmlkLCBjYWxsYmFjaztcblxuICAgIGlmIChtZXNzYWdlLnN1Y2Nlc3NmdWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2sgPSB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tpZF07XG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbaWRdO1xuICAgIH1cblxuICAgIHRoaXMucGlwZVRocm91Z2hFeHRlbnNpb25zKCdpbmNvbWluZycsIG1lc3NhZ2UsIG51bGwsIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmICghbWVzc2FnZSkgcmV0dXJuO1xuICAgICAgaWYgKG1lc3NhZ2UuYWR2aWNlKSB0aGlzLl9oYW5kbGVBZHZpY2UobWVzc2FnZS5hZHZpY2UpO1xuICAgICAgdGhpcy5fZGVsaXZlck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrWzBdLmNhbGwoY2FsbGJhY2tbMV0sIG1lc3NhZ2UpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIF9oYW5kbGVBZHZpY2U6IGZ1bmN0aW9uKGFkdmljZSkge1xuICAgIGV4dGVuZCh0aGlzLl9hZHZpY2UsIGFkdmljZSk7XG4gICAgdGhpcy5fZGlzcGF0Y2hlci50aW1lb3V0ID0gdGhpcy5fYWR2aWNlLnRpbWVvdXQgLyAxMDAwO1xuXG4gICAgaWYgKHRoaXMuX2FkdmljZS5yZWNvbm5lY3QgPT09IHRoaXMuSEFORFNIQUtFICYmIHRoaXMuX3N0YXRlICE9PSB0aGlzLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLlVOQ09OTkVDVEVEO1xuICAgICAgdGhpcy5fZGlzcGF0Y2hlci5jbGllbnRJZCA9IG51bGw7XG4gICAgICB0aGlzLl9jeWNsZUNvbm5lY3Rpb24oKTtcbiAgICB9XG4gIH0sXG5cbiAgX2RlbGl2ZXJNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgaWYgKCFtZXNzYWdlLmNoYW5uZWwgfHwgbWVzc2FnZS5kYXRhID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICB0aGlzLmluZm8oJ0NsaWVudCA/IGNhbGxpbmcgbGlzdGVuZXJzIGZvciA/IHdpdGggPycsIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIG1lc3NhZ2UuY2hhbm5lbCwgbWVzc2FnZS5kYXRhKTtcbiAgICB0aGlzLl9jaGFubmVscy5kaXN0cmlidXRlTWVzc2FnZShtZXNzYWdlKTtcbiAgfSxcblxuICBfY3ljbGVDb25uZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fY29ubmVjdFJlcXVlc3QpIHtcbiAgICAgIHRoaXMuX2Nvbm5lY3RSZXF1ZXN0ID0gbnVsbDtcbiAgICAgIHRoaXMuaW5mbygnQ2xvc2VkIGNvbm5lY3Rpb24gZm9yID8nLCB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkKTtcbiAgICB9XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGdsb2JhbC5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzZWxmLmNvbm5lY3QoKSB9LCB0aGlzLl9hZHZpY2UuaW50ZXJ2YWwpO1xuICB9XG59KTtcblxuZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIERlZmVycmFibGUpO1xuZXh0ZW5kKENsaWVudC5wcm90b3R5cGUsIFB1Ymxpc2hlcik7XG5leHRlbmQoQ2xpZW50LnByb3RvdHlwZSwgTG9nZ2luZyk7XG5leHRlbmQoQ2xpZW50LnByb3RvdHlwZSwgRXh0ZW5zaWJsZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFVSSSAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgY29va2llcyAgID0gcmVxdWlyZSgnLi4vdXRpbC9jb29raWVzJyksXG4gICAgZXh0ZW5kICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBMb2dnaW5nICAgPSByZXF1aXJlKCcuLi9taXhpbnMvbG9nZ2luZycpLFxuICAgIFB1Ymxpc2hlciA9IHJlcXVpcmUoJy4uL21peGlucy9wdWJsaXNoZXInKSxcbiAgICBUcmFuc3BvcnQgPSByZXF1aXJlKCcuLi90cmFuc3BvcnQnKSxcbiAgICBTY2hlZHVsZXIgPSByZXF1aXJlKCcuL3NjaGVkdWxlcicpO1xuXG52YXIgRGlzcGF0Y2hlciA9IENsYXNzKHsgY2xhc3NOYW1lOiAnRGlzcGF0Y2hlcicsXG4gIE1BWF9SRVFVRVNUX1NJWkU6IDIwNDgsXG4gIERFRkFVTFRfUkVUUlk6ICAgIDUsXG5cbiAgVVA6ICAgMSxcbiAgRE9XTjogMixcblxuICBpbml0aWFsaXplOiBmdW5jdGlvbihjbGllbnQsIGVuZHBvaW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5fY2xpZW50ICAgICA9IGNsaWVudDtcbiAgICB0aGlzLmVuZHBvaW50ICAgID0gVVJJLnBhcnNlKGVuZHBvaW50KTtcbiAgICB0aGlzLl9hbHRlcm5hdGVzID0gb3B0aW9ucy5lbmRwb2ludHMgfHwge307XG5cbiAgICB0aGlzLmNvb2tpZXMgICAgICA9IGNvb2tpZXMuQ29va2llSmFyICYmIG5ldyBjb29raWVzLkNvb2tpZUphcigpO1xuICAgIHRoaXMuX2Rpc2FibGVkICAgID0gW107XG4gICAgdGhpcy5fZW52ZWxvcGVzICAgPSB7fTtcbiAgICB0aGlzLmhlYWRlcnMgICAgICA9IHt9O1xuICAgIHRoaXMucmV0cnkgICAgICAgID0gb3B0aW9ucy5yZXRyeSB8fCB0aGlzLkRFRkFVTFRfUkVUUlk7XG4gICAgdGhpcy5fc2NoZWR1bGVyICAgPSBvcHRpb25zLnNjaGVkdWxlciB8fCBTY2hlZHVsZXI7XG4gICAgdGhpcy5fc3RhdGUgICAgICAgPSAwO1xuICAgIHRoaXMudHJhbnNwb3J0cyAgID0ge307XG4gICAgdGhpcy53c0V4dGVuc2lvbnMgPSBbXTtcblxuICAgIHRoaXMucHJveHkgPSBvcHRpb25zLnByb3h5IHx8IHt9O1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcHJveHkgPT09ICdzdHJpbmcnKSB0aGlzLl9wcm94eSA9IHtvcmlnaW46IHRoaXMuX3Byb3h5fTtcblxuICAgIHZhciBleHRzID0gb3B0aW9ucy53ZWJzb2NrZXRFeHRlbnNpb25zO1xuICAgIGlmIChleHRzKSB7XG4gICAgICBleHRzID0gW10uY29uY2F0KGV4dHMpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBleHRzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgICAgdGhpcy5hZGRXZWJzb2NrZXRFeHRlbnNpb24oZXh0c1tpXSk7XG4gICAgfVxuXG4gICAgdGhpcy50bHMgPSBvcHRpb25zLnRscyB8fCB7fTtcbiAgICB0aGlzLnRscy5jYSA9IHRoaXMudGxzLmNhIHx8IG9wdGlvbnMuY2E7XG5cbiAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMuX2FsdGVybmF0ZXMpXG4gICAgICB0aGlzLl9hbHRlcm5hdGVzW3R5cGVdID0gVVJJLnBhcnNlKHRoaXMuX2FsdGVybmF0ZXNbdHlwZV0pO1xuXG4gICAgdGhpcy5tYXhSZXF1ZXN0U2l6ZSA9IHRoaXMuTUFYX1JFUVVFU1RfU0laRTtcbiAgfSxcblxuICBlbmRwb2ludEZvcjogZnVuY3Rpb24oY29ubmVjdGlvblR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fYWx0ZXJuYXRlc1tjb25uZWN0aW9uVHlwZV0gfHwgdGhpcy5lbmRwb2ludDtcbiAgfSxcblxuICBhZGRXZWJzb2NrZXRFeHRlbnNpb246IGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgIHRoaXMud3NFeHRlbnNpb25zLnB1c2goZXh0ZW5zaW9uKTtcbiAgfSxcblxuICBkaXNhYmxlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQucHVzaChmZWF0dXJlKTtcbiAgfSxcblxuICBzZXRIZWFkZXI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpcy5oZWFkZXJzW25hbWVdID0gdmFsdWU7XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFuc3BvcnQgPSB0aGlzLl90cmFuc3BvcnQ7XG4gICAgZGVsZXRlIHRoaXMuX3RyYW5zcG9ydDtcbiAgICBpZiAodHJhbnNwb3J0KSB0cmFuc3BvcnQuY2xvc2UoKTtcbiAgfSxcblxuICBnZXRDb25uZWN0aW9uVHlwZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUcmFuc3BvcnQuZ2V0Q29ubmVjdGlvblR5cGVzKCk7XG4gIH0sXG5cbiAgc2VsZWN0VHJhbnNwb3J0OiBmdW5jdGlvbih0cmFuc3BvcnRUeXBlcykge1xuICAgIFRyYW5zcG9ydC5nZXQodGhpcywgdHJhbnNwb3J0VHlwZXMsIHRoaXMuX2Rpc2FibGVkLCBmdW5jdGlvbih0cmFuc3BvcnQpIHtcbiAgICAgIHRoaXMuZGVidWcoJ1NlbGVjdGVkID8gdHJhbnNwb3J0IGZvciA/JywgdHJhbnNwb3J0LmNvbm5lY3Rpb25UeXBlLCBVUkkuc3RyaW5naWZ5KHRyYW5zcG9ydC5lbmRwb2ludCkpO1xuXG4gICAgICBpZiAodHJhbnNwb3J0ID09PSB0aGlzLl90cmFuc3BvcnQpIHJldHVybjtcbiAgICAgIGlmICh0aGlzLl90cmFuc3BvcnQpIHRoaXMuX3RyYW5zcG9ydC5jbG9zZSgpO1xuXG4gICAgICB0aGlzLl90cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25UeXBlID0gdHJhbnNwb3J0LmNvbm5lY3Rpb25UeXBlO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIHNlbmRNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlLCB0aW1lb3V0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgaWQgICAgICAgPSBtZXNzYWdlLmlkLFxuICAgICAgICBhdHRlbXB0cyA9IG9wdGlvbnMuYXR0ZW1wdHMsXG4gICAgICAgIGRlYWRsaW5lID0gb3B0aW9ucy5kZWFkbGluZSAmJiBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIChvcHRpb25zLmRlYWRsaW5lICogMTAwMCksXG4gICAgICAgIGVudmVsb3BlID0gdGhpcy5fZW52ZWxvcGVzW2lkXSxcbiAgICAgICAgc2NoZWR1bGVyO1xuXG4gICAgaWYgKCFlbnZlbG9wZSkge1xuICAgICAgc2NoZWR1bGVyID0gbmV3IHRoaXMuX3NjaGVkdWxlcihtZXNzYWdlLCB7dGltZW91dDogdGltZW91dCwgaW50ZXJ2YWw6IHRoaXMucmV0cnksIGF0dGVtcHRzOiBhdHRlbXB0cywgZGVhZGxpbmU6IGRlYWRsaW5lfSk7XG4gICAgICBlbnZlbG9wZSAgPSB0aGlzLl9lbnZlbG9wZXNbaWRdID0ge21lc3NhZ2U6IG1lc3NhZ2UsIHNjaGVkdWxlcjogc2NoZWR1bGVyfTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZW5kRW52ZWxvcGUoZW52ZWxvcGUpO1xuICB9LFxuXG4gIF9zZW5kRW52ZWxvcGU6IGZ1bmN0aW9uKGVudmVsb3BlKSB7XG4gICAgaWYgKCF0aGlzLl90cmFuc3BvcnQpIHJldHVybjtcbiAgICBpZiAoZW52ZWxvcGUucmVxdWVzdCB8fCBlbnZlbG9wZS50aW1lcikgcmV0dXJuO1xuXG4gICAgdmFyIG1lc3NhZ2UgICA9IGVudmVsb3BlLm1lc3NhZ2UsXG4gICAgICAgIHNjaGVkdWxlciA9IGVudmVsb3BlLnNjaGVkdWxlcixcbiAgICAgICAgc2VsZiAgICAgID0gdGhpcztcblxuICAgIGlmICghc2NoZWR1bGVyLmlzRGVsaXZlcmFibGUoKSkge1xuICAgICAgc2NoZWR1bGVyLmFib3J0KCk7XG4gICAgICBkZWxldGUgdGhpcy5fZW52ZWxvcGVzW21lc3NhZ2UuaWRdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVudmVsb3BlLnRpbWVyID0gZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLmhhbmRsZUVycm9yKG1lc3NhZ2UpO1xuICAgIH0sIHNjaGVkdWxlci5nZXRUaW1lb3V0KCkgKiAxMDAwKTtcblxuICAgIHNjaGVkdWxlci5zZW5kKCk7XG4gICAgZW52ZWxvcGUucmVxdWVzdCA9IHRoaXMuX3RyYW5zcG9ydC5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgfSxcblxuICBoYW5kbGVSZXNwb25zZTogZnVuY3Rpb24ocmVwbHkpIHtcbiAgICB2YXIgZW52ZWxvcGUgPSB0aGlzLl9lbnZlbG9wZXNbcmVwbHkuaWRdO1xuXG4gICAgaWYgKHJlcGx5LnN1Y2Nlc3NmdWwgIT09IHVuZGVmaW5lZCAmJiBlbnZlbG9wZSkge1xuICAgICAgZW52ZWxvcGUuc2NoZWR1bGVyLnN1Y2NlZWQoKTtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbnZlbG9wZXNbcmVwbHkuaWRdO1xuICAgICAgZ2xvYmFsLmNsZWFyVGltZW91dChlbnZlbG9wZS50aW1lcik7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdtZXNzYWdlJywgcmVwbHkpO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSB0aGlzLlVQKSByZXR1cm47XG4gICAgdGhpcy5fc3RhdGUgPSB0aGlzLlVQO1xuICAgIHRoaXMuX2NsaWVudC50cmlnZ2VyKCd0cmFuc3BvcnQ6dXAnKTtcbiAgfSxcblxuICBoYW5kbGVFcnJvcjogZnVuY3Rpb24obWVzc2FnZSwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIGVudmVsb3BlID0gdGhpcy5fZW52ZWxvcGVzW21lc3NhZ2UuaWRdLFxuICAgICAgICByZXF1ZXN0ICA9IGVudmVsb3BlICYmIGVudmVsb3BlLnJlcXVlc3QsXG4gICAgICAgIHNlbGYgICAgID0gdGhpcztcblxuICAgIGlmICghcmVxdWVzdCkgcmV0dXJuO1xuXG4gICAgcmVxdWVzdC50aGVuKGZ1bmN0aW9uKHJlcSkge1xuICAgICAgaWYgKHJlcSAmJiByZXEuYWJvcnQpIHJlcS5hYm9ydCgpO1xuICAgIH0pO1xuXG4gICAgdmFyIHNjaGVkdWxlciA9IGVudmVsb3BlLnNjaGVkdWxlcjtcbiAgICBzY2hlZHVsZXIuZmFpbCgpO1xuXG4gICAgZ2xvYmFsLmNsZWFyVGltZW91dChlbnZlbG9wZS50aW1lcik7XG4gICAgZW52ZWxvcGUucmVxdWVzdCA9IGVudmVsb3BlLnRpbWVyID0gbnVsbDtcblxuICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgIHRoaXMuX3NlbmRFbnZlbG9wZShlbnZlbG9wZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudmVsb3BlLnRpbWVyID0gZ2xvYmFsLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVudmVsb3BlLnRpbWVyID0gbnVsbDtcbiAgICAgICAgc2VsZi5fc2VuZEVudmVsb3BlKGVudmVsb3BlKTtcbiAgICAgIH0sIHNjaGVkdWxlci5nZXRJbnRlcnZhbCgpICogMTAwMCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3N0YXRlID09PSB0aGlzLkRPV04pIHJldHVybjtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuRE9XTjtcbiAgICB0aGlzLl9jbGllbnQudHJpZ2dlcigndHJhbnNwb3J0OmRvd24nKTtcbiAgfVxufSk7XG5cbkRpc3BhdGNoZXIuY3JlYXRlID0gZnVuY3Rpb24oY2xpZW50LCBlbmRwb2ludCwgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IERpc3BhdGNoZXIoY2xpZW50LCBlbmRwb2ludCwgb3B0aW9ucyk7XG59O1xuXG5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIFB1Ymxpc2hlcik7XG5leHRlbmQoRGlzcGF0Y2hlci5wcm90b3R5cGUsIExvZ2dpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIEdyYW1tYXIgPSByZXF1aXJlKCcuL2dyYW1tYXInKTtcblxudmFyIEVycm9yID0gQ2xhc3Moe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbihjb2RlLCBwYXJhbXMsIG1lc3NhZ2UpIHtcbiAgICB0aGlzLmNvZGUgICAgPSBjb2RlO1xuICAgIHRoaXMucGFyYW1zICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHBhcmFtcyk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfSxcblxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZSArICc6JyArXG4gICAgICAgICAgIHRoaXMucGFyYW1zLmpvaW4oJywnKSArICc6JyArXG4gICAgICAgICAgIHRoaXMubWVzc2FnZTtcbiAgfVxufSk7XG5cbkVycm9yLnBhcnNlID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICBtZXNzYWdlID0gbWVzc2FnZSB8fCAnJztcbiAgaWYgKCFHcmFtbWFyLkVSUk9SLnRlc3QobWVzc2FnZSkpIHJldHVybiBuZXcgRXJyb3IobnVsbCwgW10sIG1lc3NhZ2UpO1xuXG4gIHZhciBwYXJ0cyAgID0gbWVzc2FnZS5zcGxpdCgnOicpLFxuICAgICAgY29kZSAgICA9IHBhcnNlSW50KHBhcnRzWzBdKSxcbiAgICAgIHBhcmFtcyAgPSBwYXJ0c1sxXS5zcGxpdCgnLCcpLFxuICAgICAgbWVzc2FnZSA9IHBhcnRzWzJdO1xuXG4gIHJldHVybiBuZXcgRXJyb3IoY29kZSwgcGFyYW1zLCBtZXNzYWdlKTtcbn07XG5cbi8vIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9jb21ldGQvd2lraS9CYXlldXhDb2Rlc1xudmFyIGVycm9ycyA9IHtcbiAgdmVyc2lvbk1pc21hdGNoOiAgWzMwMCwgJ1ZlcnNpb24gbWlzbWF0Y2gnXSxcbiAgY29ubnR5cGVNaXNtYXRjaDogWzMwMSwgJ0Nvbm5lY3Rpb24gdHlwZXMgbm90IHN1cHBvcnRlZCddLFxuICBleHRNaXNtYXRjaDogICAgICBbMzAyLCAnRXh0ZW5zaW9uIG1pc21hdGNoJ10sXG4gIGJhZFJlcXVlc3Q6ICAgICAgIFs0MDAsICdCYWQgcmVxdWVzdCddLFxuICBjbGllbnRVbmtub3duOiAgICBbNDAxLCAnVW5rbm93biBjbGllbnQnXSxcbiAgcGFyYW1ldGVyTWlzc2luZzogWzQwMiwgJ01pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVyJ10sXG4gIGNoYW5uZWxGb3JiaWRkZW46IFs0MDMsICdGb3JiaWRkZW4gY2hhbm5lbCddLFxuICBjaGFubmVsVW5rbm93bjogICBbNDA0LCAnVW5rbm93biBjaGFubmVsJ10sXG4gIGNoYW5uZWxJbnZhbGlkOiAgIFs0MDUsICdJbnZhbGlkIGNoYW5uZWwnXSxcbiAgZXh0VW5rbm93bjogICAgICAgWzQwNiwgJ1Vua25vd24gZXh0ZW5zaW9uJ10sXG4gIHB1Ymxpc2hGYWlsZWQ6ICAgIFs0MDcsICdGYWlsZWQgdG8gcHVibGlzaCddLFxuICBzZXJ2ZXJFcnJvcjogICAgICBbNTAwLCAnSW50ZXJuYWwgc2VydmVyIGVycm9yJ11cbn07XG5cbmZvciAodmFyIG5hbWUgaW4gZXJyb3JzKVxuICAoZnVuY3Rpb24obmFtZSkge1xuICAgIEVycm9yW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKGVycm9yc1tuYW1lXVswXSwgYXJndW1lbnRzLCBlcnJvcnNbbmFtZV1bMV0pLnRvU3RyaW5nKCk7XG4gICAgfTtcbiAgfSkobmFtZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICBMb2dnaW5nID0gcmVxdWlyZSgnLi4vbWl4aW5zL2xvZ2dpbmcnKTtcblxudmFyIEV4dGVuc2libGUgPSB7XG4gIGFkZEV4dGVuc2lvbjogZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgdGhpcy5fZXh0ZW5zaW9ucyA9IHRoaXMuX2V4dGVuc2lvbnMgfHwgW107XG4gICAgdGhpcy5fZXh0ZW5zaW9ucy5wdXNoKGV4dGVuc2lvbik7XG4gICAgaWYgKGV4dGVuc2lvbi5hZGRlZCkgZXh0ZW5zaW9uLmFkZGVkKHRoaXMpO1xuICB9LFxuXG4gIHJlbW92ZUV4dGVuc2lvbjogZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgaWYgKCF0aGlzLl9leHRlbnNpb25zKSByZXR1cm47XG4gICAgdmFyIGkgPSB0aGlzLl9leHRlbnNpb25zLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAodGhpcy5fZXh0ZW5zaW9uc1tpXSAhPT0gZXh0ZW5zaW9uKSBjb250aW51ZTtcbiAgICAgIHRoaXMuX2V4dGVuc2lvbnMuc3BsaWNlKGksMSk7XG4gICAgICBpZiAoZXh0ZW5zaW9uLnJlbW92ZWQpIGV4dGVuc2lvbi5yZW1vdmVkKHRoaXMpO1xuICAgIH1cbiAgfSxcblxuICBwaXBlVGhyb3VnaEV4dGVuc2lvbnM6IGZ1bmN0aW9uKHN0YWdlLCBtZXNzYWdlLCByZXF1ZXN0LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHRoaXMuZGVidWcoJ1Bhc3NpbmcgdGhyb3VnaCA/IGV4dGVuc2lvbnM6ID8nLCBzdGFnZSwgbWVzc2FnZSk7XG5cbiAgICBpZiAoIXRoaXMuX2V4dGVuc2lvbnMpIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuICAgIHZhciBleHRlbnNpb25zID0gdGhpcy5fZXh0ZW5zaW9ucy5zbGljZSgpO1xuXG4gICAgdmFyIHBpcGUgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAoIW1lc3NhZ2UpIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuXG4gICAgICB2YXIgZXh0ZW5zaW9uID0gZXh0ZW5zaW9ucy5zaGlmdCgpO1xuICAgICAgaWYgKCFleHRlbnNpb24pIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuXG4gICAgICB2YXIgZm4gPSBleHRlbnNpb25bc3RhZ2VdO1xuICAgICAgaWYgKCFmbikgcmV0dXJuIHBpcGUobWVzc2FnZSk7XG5cbiAgICAgIGlmIChmbi5sZW5ndGggPj0gMykgZXh0ZW5zaW9uW3N0YWdlXShtZXNzYWdlLCByZXF1ZXN0LCBwaXBlKTtcbiAgICAgIGVsc2UgICAgICAgICAgICAgICAgZXh0ZW5zaW9uW3N0YWdlXShtZXNzYWdlLCBwaXBlKTtcbiAgICB9O1xuICAgIHBpcGUobWVzc2FnZSk7XG4gIH1cbn07XG5cbmV4dGVuZChFeHRlbnNpYmxlLCBMb2dnaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbnNpYmxlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ0hBTk5FTF9OQU1FOiAgICAgL15cXC8oKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCkpKSsoXFwvKCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApKSkrKSokLyxcbiAgQ0hBTk5FTF9QQVRURVJOOiAgL14oXFwvKCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApKSkrKSpcXC9cXCp7MSwyfSQvLFxuICBFUlJPUjogICAgICAgICAgICAvXihbMC05XVswLTldWzAtOV06KCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApfCB8XFwvfFxcKnxcXC4pKSooLCgoKChbYS16XXxbQS1aXSl8WzAtOV0pfChcXC18XFxffFxcIXxcXH58XFwofFxcKXxcXCR8XFxAKXwgfFxcL3xcXCp8XFwuKSkqKSo6KCgoKFthLXpdfFtBLVpdKXxbMC05XSl8KFxcLXxcXF98XFwhfFxcfnxcXCh8XFwpfFxcJHxcXEApfCB8XFwvfFxcKnxcXC4pKSp8WzAtOV1bMC05XVswLTldOjooKCgoW2Etel18W0EtWl0pfFswLTldKXwoXFwtfFxcX3xcXCF8XFx+fFxcKHxcXCl8XFwkfFxcQCl8IHxcXC98XFwqfFxcLikpKikkLyxcbiAgVkVSU0lPTjogICAgICAgICAgL14oWzAtOV0pKyhcXC4oKFthLXpdfFtBLVpdKXxbMC05XSkoKCgoW2Etel18W0EtWl0pfFswLTldKXxcXC18XFxfKSkqKSokL1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgRGVmZXJyYWJsZSA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xhc3MoRGVmZXJyYWJsZSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpO1xuXG52YXIgU2NoZWR1bGVyID0gZnVuY3Rpb24obWVzc2FnZSwgb3B0aW9ucykge1xuICB0aGlzLm1lc3NhZ2UgID0gbWVzc2FnZTtcbiAgdGhpcy5vcHRpb25zICA9IG9wdGlvbnM7XG4gIHRoaXMuYXR0ZW1wdHMgPSAwO1xufTtcblxuZXh0ZW5kKFNjaGVkdWxlci5wcm90b3R5cGUsIHtcbiAgZ2V0VGltZW91dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy50aW1lb3V0O1xuICB9LFxuXG4gIGdldEludGVydmFsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmludGVydmFsO1xuICB9LFxuXG4gIGlzRGVsaXZlcmFibGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdHRlbXB0cyA9IHRoaXMub3B0aW9ucy5hdHRlbXB0cyxcbiAgICAgICAgbWFkZSAgICAgPSB0aGlzLmF0dGVtcHRzLFxuICAgICAgICBkZWFkbGluZSA9IHRoaXMub3B0aW9ucy5kZWFkbGluZSxcbiAgICAgICAgbm93ICAgICAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGlmIChhdHRlbXB0cyAhPT0gdW5kZWZpbmVkICYmIG1hZGUgPj0gYXR0ZW1wdHMpXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAoZGVhZGxpbmUgIT09IHVuZGVmaW5lZCAmJiBub3cgPiBkZWFkbGluZSlcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIHNlbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXR0ZW1wdHMgKz0gMTtcbiAgfSxcblxuICBzdWNjZWVkOiBmdW5jdGlvbigpIHt9LFxuXG4gIGZhaWw6IGZ1bmN0aW9uKCkge30sXG5cbiAgYWJvcnQ6IGZ1bmN0aW9uKCkge31cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVkdWxlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICAgPSByZXF1aXJlKCcuLi91dGlsL2NsYXNzJyksXG4gICAgZXh0ZW5kICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgRGVmZXJyYWJsZSA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyk7XG5cbnZhciBTdWJzY3JpcHRpb24gPSBDbGFzcyh7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGNsaWVudCwgY2hhbm5lbHMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fY2xpZW50ICAgID0gY2xpZW50O1xuICAgIHRoaXMuX2NoYW5uZWxzICA9IGNoYW5uZWxzO1xuICAgIHRoaXMuX2NhbGxiYWNrICA9IGNhbGxiYWNrO1xuICAgIHRoaXMuX2NvbnRleHQgICA9IGNvbnRleHQ7XG4gICAgdGhpcy5fY2FuY2VsbGVkID0gZmFsc2U7XG4gIH0sXG5cbiAgd2l0aENoYW5uZWw6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5fd2l0aENoYW5uZWwgPSBbY2FsbGJhY2ssIGNvbnRleHRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGFwcGx5OiBmdW5jdGlvbihjb250ZXh0LCBhcmdzKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBhcmdzWzBdO1xuXG4gICAgaWYgKHRoaXMuX2NhbGxiYWNrKVxuICAgICAgdGhpcy5fY2FsbGJhY2suY2FsbCh0aGlzLl9jb250ZXh0LCBtZXNzYWdlLmRhdGEpO1xuXG4gICAgaWYgKHRoaXMuX3dpdGhDaGFubmVsKVxuICAgICAgdGhpcy5fd2l0aENoYW5uZWxbMF0uY2FsbCh0aGlzLl93aXRoQ2hhbm5lbFsxXSwgbWVzc2FnZS5jaGFubmVsLCBtZXNzYWdlLmRhdGEpO1xuICB9LFxuXG4gIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX2NhbmNlbGxlZCkgcmV0dXJuO1xuICAgIHRoaXMuX2NsaWVudC51bnN1YnNjcmliZSh0aGlzLl9jaGFubmVscywgdGhpcyk7XG4gICAgdGhpcy5fY2FuY2VsbGVkID0gdHJ1ZTtcbiAgfSxcblxuICB1bnN1YnNjcmliZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgfVxufSk7XG5cbmV4dGVuZChTdWJzY3JpcHRpb24ucHJvdG90eXBlLCBEZWZlcnJhYmxlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdWJzY3JpcHRpb247XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUcmFuc3BvcnQgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xuXG5UcmFuc3BvcnQucmVnaXN0ZXIoJ3dlYnNvY2tldCcsIHJlcXVpcmUoJy4vd2ViX3NvY2tldCcpKTtcblRyYW5zcG9ydC5yZWdpc3RlcignZXZlbnRzb3VyY2UnLCByZXF1aXJlKCcuL2V2ZW50X3NvdXJjZScpKTtcblRyYW5zcG9ydC5yZWdpc3RlcignbG9uZy1wb2xsaW5nJywgcmVxdWlyZSgnLi94aHInKSk7XG5UcmFuc3BvcnQucmVnaXN0ZXIoJ2Nyb3NzLW9yaWdpbi1sb25nLXBvbGxpbmcnLCByZXF1aXJlKCcuL2NvcnMnKSk7XG5UcmFuc3BvcnQucmVnaXN0ZXIoJ2NhbGxiYWNrLXBvbGxpbmcnLCByZXF1aXJlKCcuL2pzb25wJykpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zcG9ydDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBTZXQgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3NldCcpLFxuICAgIFVSSSAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvdXJpJyksXG4gICAgZXh0ZW5kICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICB0b0pTT04gICAgPSByZXF1aXJlKCcuLi91dGlsL3RvX2pzb24nKSxcbiAgICBUcmFuc3BvcnQgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpO1xuXG52YXIgQ09SUyA9IGV4dGVuZChDbGFzcyhUcmFuc3BvcnQsIHtcbiAgZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiAnbWVzc2FnZT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRvSlNPTihtZXNzYWdlcykpO1xuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgdmFyIHhockNsYXNzID0gZ2xvYmFsLlhEb21haW5SZXF1ZXN0ID8gWERvbWFpblJlcXVlc3QgOiBYTUxIdHRwUmVxdWVzdCxcbiAgICAgICAgeGhyICAgICAgPSBuZXcgeGhyQ2xhc3MoKSxcbiAgICAgICAgaWQgICAgICAgPSArK0NPUlMuX2lkLFxuICAgICAgICBoZWFkZXJzICA9IHRoaXMuX2Rpc3BhdGNoZXIuaGVhZGVycyxcbiAgICAgICAgc2VsZiAgICAgPSB0aGlzLFxuICAgICAgICBrZXk7XG5cbiAgICB4aHIub3BlbignUE9TVCcsIFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksIHRydWUpO1xuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XG4gICAgICBmb3IgKGtleSBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjbGVhblVwID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXhocikgcmV0dXJuIGZhbHNlO1xuICAgICAgQ09SUy5fcGVuZGluZy5yZW1vdmUoaWQpO1xuICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0geGhyLm9udGltZW91dCA9IHhoci5vbnByb2dyZXNzID0gbnVsbDtcbiAgICAgIHhociA9IG51bGw7XG4gICAgfTtcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXBsaWVzO1xuICAgICAgdHJ5IHsgcmVwbGllcyA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgfSBjYXRjaCAoZXJyb3IpIHt9XG5cbiAgICAgIGNsZWFuVXAoKTtcblxuICAgICAgaWYgKHJlcGxpZXMpXG4gICAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgICBlbHNlXG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcbiAgICB9O1xuXG4gICAgeGhyLm9uZXJyb3IgPSB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhblVwKCk7XG4gICAgICBzZWxmLl9oYW5kbGVFcnJvcihtZXNzYWdlcyk7XG4gICAgfTtcblxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIGlmICh4aHJDbGFzcyA9PT0gZ2xvYmFsLlhEb21haW5SZXF1ZXN0KVxuICAgICAgQ09SUy5fcGVuZGluZy5hZGQoe2lkOiBpZCwgeGhyOiB4aHJ9KTtcblxuICAgIHhoci5zZW5kKHRoaXMuZW5jb2RlKG1lc3NhZ2VzKSk7XG4gICAgcmV0dXJuIHhocjtcbiAgfVxufSksIHtcbiAgX2lkOiAgICAgIDAsXG4gIF9wZW5kaW5nOiBuZXcgU2V0KCksXG5cbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmIChVUkkuaXNTYW1lT3JpZ2luKGVuZHBvaW50KSlcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKTtcblxuICAgIGlmIChnbG9iYWwuWERvbWFpblJlcXVlc3QpXG4gICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBlbmRwb2ludC5wcm90b2NvbCA9PT0gbG9jYXRpb24ucHJvdG9jb2wpO1xuXG4gICAgaWYgKGdsb2JhbC5YTUxIdHRwUmVxdWVzdCkge1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgeGhyLndpdGhDcmVkZW50aWFscyAhPT0gdW5kZWZpbmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDT1JTO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBVUkkgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi4vdXRpbC9jb3B5X29iamVjdCcpLFxuICAgIGV4dGVuZCAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIERlZmVycmFibGUgPSByZXF1aXJlKCcuLi9taXhpbnMvZGVmZXJyYWJsZScpLFxuICAgIFRyYW5zcG9ydCAgPSByZXF1aXJlKCcuL3RyYW5zcG9ydCcpLFxuICAgIFhIUiAgICAgICAgPSByZXF1aXJlKCcuL3hocicpO1xuXG52YXIgRXZlbnRTb3VyY2UgPSBleHRlbmQoQ2xhc3MoVHJhbnNwb3J0LCB7XG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50KSB7XG4gICAgVHJhbnNwb3J0LnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgZGlzcGF0Y2hlciwgZW5kcG9pbnQpO1xuICAgIGlmICghZ2xvYmFsLkV2ZW50U291cmNlKSByZXR1cm4gdGhpcy5zZXREZWZlcnJlZFN0YXR1cygnZmFpbGVkJyk7XG5cbiAgICB0aGlzLl94aHIgPSBuZXcgWEhSKGRpc3BhdGNoZXIsIGVuZHBvaW50KTtcblxuICAgIGVuZHBvaW50ID0gY29weU9iamVjdChlbmRwb2ludCk7XG4gICAgZW5kcG9pbnQucGF0aG5hbWUgKz0gJy8nICsgZGlzcGF0Y2hlci5jbGllbnRJZDtcblxuICAgIHZhciBzb2NrZXQgPSBuZXcgZ2xvYmFsLkV2ZW50U291cmNlKFVSSS5zdHJpbmdpZnkoZW5kcG9pbnQpKSxcbiAgICAgICAgc2VsZiAgID0gdGhpcztcblxuICAgIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuX2V2ZXJDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgc2VsZi5zZXREZWZlcnJlZFN0YXR1cygnc3VjY2VlZGVkJyk7XG4gICAgfTtcblxuICAgIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc2VsZi5fZXZlckNvbm5lY3RlZCkge1xuICAgICAgICBzZWxmLl9oYW5kbGVFcnJvcihbXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnKTtcbiAgICAgICAgc29ja2V0LmNsb3NlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgdmFyIHJlcGxpZXM7XG4gICAgICB0cnkgeyByZXBsaWVzID0gSlNPTi5wYXJzZShldmVudC5kYXRhKSB9IGNhdGNoIChlcnJvcikge31cblxuICAgICAgaWYgKHJlcGxpZXMpXG4gICAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgICBlbHNlXG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKFtdKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fc29ja2V0ID0gc29ja2V0O1xuICB9LFxuXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCkgcmV0dXJuO1xuICAgIHRoaXMuX3NvY2tldC5vbm9wZW4gPSB0aGlzLl9zb2NrZXQub25lcnJvciA9IHRoaXMuX3NvY2tldC5vbm1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMuX3NvY2tldC5jbG9zZSgpO1xuICAgIGRlbGV0ZSB0aGlzLl9zb2NrZXQ7XG4gIH0sXG5cbiAgaXNVc2FibGU6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jYWxsYmFjayhmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0cnVlKSB9KTtcbiAgICB0aGlzLmVycmJhY2soZnVuY3Rpb24oKSB7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpIH0pO1xuICB9LFxuXG4gIGVuY29kZTogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICByZXR1cm4gdGhpcy5feGhyLmVuY29kZShtZXNzYWdlcyk7XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICByZXR1cm4gdGhpcy5feGhyLnJlcXVlc3QobWVzc2FnZXMpO1xuICB9XG5cbn0pLCB7XG4gIGlzVXNhYmxlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgaWQgPSBkaXNwYXRjaGVyLmNsaWVudElkO1xuICAgIGlmICghaWQpIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGZhbHNlKTtcblxuICAgIFhIUi5pc1VzYWJsZShkaXNwYXRjaGVyLCBlbmRwb2ludCwgZnVuY3Rpb24odXNhYmxlKSB7XG4gICAgICBpZiAoIXVzYWJsZSkgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZmFsc2UpO1xuICAgICAgdGhpcy5jcmVhdGUoZGlzcGF0Y2hlciwgZW5kcG9pbnQpLmlzVXNhYmxlKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50KSB7XG4gICAgdmFyIHNvY2tldHMgPSBkaXNwYXRjaGVyLnRyYW5zcG9ydHMuZXZlbnRzb3VyY2UgPSBkaXNwYXRjaGVyLnRyYW5zcG9ydHMuZXZlbnRzb3VyY2UgfHwge30sXG4gICAgICAgIGlkICAgICAgPSBkaXNwYXRjaGVyLmNsaWVudElkO1xuXG4gICAgdmFyIHVybCA9IGNvcHlPYmplY3QoZW5kcG9pbnQpO1xuICAgIHVybC5wYXRobmFtZSArPSAnLycgKyAoaWQgfHwgJycpO1xuICAgIHVybCA9IFVSSS5zdHJpbmdpZnkodXJsKTtcblxuICAgIHNvY2tldHNbdXJsXSA9IHNvY2tldHNbdXJsXSB8fCBuZXcgdGhpcyhkaXNwYXRjaGVyLCBlbmRwb2ludCk7XG4gICAgcmV0dXJuIHNvY2tldHNbdXJsXTtcbiAgfVxufSk7XG5cbmV4dGVuZChFdmVudFNvdXJjZS5wcm90b3R5cGUsIERlZmVycmFibGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50U291cmNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2xhc3MgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBVUkkgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi4vdXRpbC9jb3B5X29iamVjdCcpLFxuICAgIGV4dGVuZCAgICAgPSByZXF1aXJlKCcuLi91dGlsL2V4dGVuZCcpLFxuICAgIHRvSlNPTiAgICAgPSByZXF1aXJlKCcuLi91dGlsL3RvX2pzb24nKSxcbiAgICBUcmFuc3BvcnQgID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcblxudmFyIEpTT05QID0gZXh0ZW5kKENsYXNzKFRyYW5zcG9ydCwge1xuIGVuY29kZTogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICB2YXIgdXJsID0gY29weU9iamVjdCh0aGlzLmVuZHBvaW50KTtcbiAgICB1cmwucXVlcnkubWVzc2FnZSA9IHRvSlNPTihtZXNzYWdlcyk7XG4gICAgdXJsLnF1ZXJ5Lmpzb25wICAgPSAnX19qc29ucCcgKyBKU09OUC5fY2JDb3VudCArICdfXyc7XG4gICAgcmV0dXJuIFVSSS5zdHJpbmdpZnkodXJsKTtcbiAgfSxcblxuICByZXF1ZXN0OiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHZhciBoZWFkICAgICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgICBzY3JpcHQgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSxcbiAgICAgICAgY2FsbGJhY2tOYW1lID0gSlNPTlAuZ2V0Q2FsbGJhY2tOYW1lKCksXG4gICAgICAgIGVuZHBvaW50ICAgICA9IGNvcHlPYmplY3QodGhpcy5lbmRwb2ludCksXG4gICAgICAgIHNlbGYgICAgICAgICA9IHRoaXM7XG5cbiAgICBlbmRwb2ludC5xdWVyeS5tZXNzYWdlID0gdG9KU09OKG1lc3NhZ2VzKTtcbiAgICBlbmRwb2ludC5xdWVyeS5qc29ucCAgID0gY2FsbGJhY2tOYW1lO1xuXG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghZ2xvYmFsW2NhbGxiYWNrTmFtZV0pIHJldHVybiBmYWxzZTtcbiAgICAgIGdsb2JhbFtjYWxsYmFja05hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgdHJ5IHsgZGVsZXRlIGdsb2JhbFtjYWxsYmFja05hbWVdIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB9O1xuXG4gICAgZ2xvYmFsW2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihyZXBsaWVzKSB7XG4gICAgICBjbGVhbnVwKCk7XG4gICAgICBzZWxmLl9yZWNlaXZlKHJlcGxpZXMpO1xuICAgIH07XG5cbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgIHNjcmlwdC5zcmMgID0gVVJJLnN0cmluZ2lmeShlbmRwb2ludCk7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXG4gICAgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFudXAoKTtcbiAgICAgIHNlbGYuX2hhbmRsZUVycm9yKG1lc3NhZ2VzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHthYm9ydDogY2xlYW51cH07XG4gIH1cbn0pLCB7XG4gIF9jYkNvdW50OiAwLFxuXG4gIGdldENhbGxiYWNrTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fY2JDb3VudCArPSAxO1xuICAgIHJldHVybiAnX19qc29ucCcgKyB0aGlzLl9jYkNvdW50ICsgJ19fJztcbiAgfSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCB0cnVlKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSlNPTlA7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBDb29raWUgICA9IHJlcXVpcmUoJy4uL3V0aWwvY29va2llcycpLkNvb2tpZSxcbiAgICBQcm9taXNlICA9IHJlcXVpcmUoJy4uL3V0aWwvcHJvbWlzZScpLFxuICAgIFVSSSAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBhcnJheSAgICA9IHJlcXVpcmUoJy4uL3V0aWwvYXJyYXknKSxcbiAgICBleHRlbmQgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgTG9nZ2luZyAgPSByZXF1aXJlKCcuLi9taXhpbnMvbG9nZ2luZycpLFxuICAgIFRpbWVvdXRzID0gcmVxdWlyZSgnLi4vbWl4aW5zL3RpbWVvdXRzJyksXG4gICAgQ2hhbm5lbCAgPSByZXF1aXJlKCcuLi9wcm90b2NvbC9jaGFubmVsJyk7XG5cbnZhciBUcmFuc3BvcnQgPSBleHRlbmQoQ2xhc3MoeyBjbGFzc05hbWU6ICdUcmFuc3BvcnQnLFxuICBERUZBVUxUX1BPUlRTOiAgICB7J2h0dHA6JzogODAsICdodHRwczonOiA0NDMsICd3czonOiA4MCwgJ3dzczonOiA0NDN9LFxuICBTRUNVUkVfUFJPVE9DT0xTOiBbJ2h0dHBzOicsICd3c3M6J10sXG4gIE1BWF9ERUxBWTogICAgICAgIDAsXG5cbiAgYmF0Y2hpbmc6ICB0cnVlLFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGRpc3BhdGNoZXIsIGVuZHBvaW50KSB7XG4gICAgdGhpcy5fZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XG4gICAgdGhpcy5lbmRwb2ludCAgICA9IGVuZHBvaW50O1xuICAgIHRoaXMuX291dGJveCAgICAgPSBbXTtcbiAgICB0aGlzLl9wcm94eSAgICAgID0gZXh0ZW5kKHt9LCB0aGlzLl9kaXNwYXRjaGVyLnByb3h5KTtcblxuICAgIGlmICghdGhpcy5fcHJveHkub3JpZ2luICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fcHJveHkub3JpZ2luID0gYXJyYXkuaW5kZXhPZih0aGlzLlNFQ1VSRV9QUk9UT0NPTFMsIHRoaXMuZW5kcG9pbnQucHJvdG9jb2wpID49IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICA/IChwcm9jZXNzLmVudi5IVFRQU19QUk9YWSB8fCBwcm9jZXNzLmVudi5odHRwc19wcm94eSlcbiAgICAgICAgICAgICAgICAgICAgICAgICA6IChwcm9jZXNzLmVudi5IVFRQX1BST1hZICB8fCBwcm9jZXNzLmVudi5odHRwX3Byb3h5KTtcbiAgICB9XG4gIH0sXG5cbiAgY2xvc2U6IGZ1bmN0aW9uKCkge30sXG5cbiAgZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiAnJztcbiAgfSxcblxuICBzZW5kTWVzc2FnZTogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIHRoaXMuZGVidWcoJ0NsaWVudCA/IHNlbmRpbmcgbWVzc2FnZSB0byA/OiA/JyxcbiAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksIG1lc3NhZ2UpO1xuXG4gICAgaWYgKCF0aGlzLmJhdGNoaW5nKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMucmVxdWVzdChbbWVzc2FnZV0pKTtcblxuICAgIHRoaXMuX291dGJveC5wdXNoKG1lc3NhZ2UpO1xuICAgIHRoaXMuX2ZsdXNoTGFyZ2VCYXRjaCgpO1xuXG4gICAgaWYgKG1lc3NhZ2UuY2hhbm5lbCA9PT0gQ2hhbm5lbC5IQU5EU0hBS0UpXG4gICAgICByZXR1cm4gdGhpcy5fcHVibGlzaCgwLjAxKTtcblxuICAgIGlmIChtZXNzYWdlLmNoYW5uZWwgPT09IENoYW5uZWwuQ09OTkVDVClcbiAgICAgIHRoaXMuX2Nvbm5lY3RNZXNzYWdlID0gbWVzc2FnZTtcblxuICAgIHJldHVybiB0aGlzLl9wdWJsaXNoKHRoaXMuTUFYX0RFTEFZKTtcbiAgfSxcblxuICBfbWFrZVByb21pc2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuX3JlcXVlc3RQcm9taXNlID0gdGhpcy5fcmVxdWVzdFByb21pc2UgfHwgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgc2VsZi5fcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgIH0pO1xuICB9LFxuXG4gIF9wdWJsaXNoOiBmdW5jdGlvbihkZWxheSkge1xuICAgIHRoaXMuX21ha2VQcm9taXNlKCk7XG5cbiAgICB0aGlzLmFkZFRpbWVvdXQoJ3B1Ymxpc2gnLCBkZWxheSwgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9mbHVzaCgpO1xuICAgICAgZGVsZXRlIHRoaXMuX3JlcXVlc3RQcm9taXNlO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RQcm9taXNlO1xuICB9LFxuXG4gIF9mbHVzaDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVUaW1lb3V0KCdwdWJsaXNoJyk7XG5cbiAgICBpZiAodGhpcy5fb3V0Ym94Lmxlbmd0aCA+IDEgJiYgdGhpcy5fY29ubmVjdE1lc3NhZ2UpXG4gICAgICB0aGlzLl9jb25uZWN0TWVzc2FnZS5hZHZpY2UgPSB7dGltZW91dDogMH07XG5cbiAgICB0aGlzLl9yZXNvbHZlUHJvbWlzZSh0aGlzLnJlcXVlc3QodGhpcy5fb3V0Ym94KSk7XG5cbiAgICB0aGlzLl9jb25uZWN0TWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5fb3V0Ym94ID0gW107XG4gIH0sXG5cbiAgX2ZsdXNoTGFyZ2VCYXRjaDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZyA9IHRoaXMuZW5jb2RlKHRoaXMuX291dGJveCk7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPCB0aGlzLl9kaXNwYXRjaGVyLm1heFJlcXVlc3RTaXplKSByZXR1cm47XG4gICAgdmFyIGxhc3QgPSB0aGlzLl9vdXRib3gucG9wKCk7XG5cbiAgICB0aGlzLl9tYWtlUHJvbWlzZSgpO1xuICAgIHRoaXMuX2ZsdXNoKCk7XG5cbiAgICBpZiAobGFzdCkgdGhpcy5fb3V0Ym94LnB1c2gobGFzdCk7XG4gIH0sXG5cbiAgX3JlY2VpdmU6IGZ1bmN0aW9uKHJlcGxpZXMpIHtcbiAgICBpZiAoIXJlcGxpZXMpIHJldHVybjtcbiAgICByZXBsaWVzID0gW10uY29uY2F0KHJlcGxpZXMpO1xuXG4gICAgdGhpcy5kZWJ1ZygnQ2xpZW50ID8gcmVjZWl2ZWQgZnJvbSA/IHZpYSA/OiA/JyxcbiAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuY2xpZW50SWQsIFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksIHRoaXMuY29ubmVjdGlvblR5cGUsIHJlcGxpZXMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSByZXBsaWVzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuaGFuZGxlUmVzcG9uc2UocmVwbGllc1tpXSk7XG4gIH0sXG5cbiAgX2hhbmRsZUVycm9yOiBmdW5jdGlvbihtZXNzYWdlcywgaW1tZWRpYXRlKSB7XG4gICAgbWVzc2FnZXMgPSBbXS5jb25jYXQobWVzc2FnZXMpO1xuXG4gICAgdGhpcy5kZWJ1ZygnQ2xpZW50ID8gZmFpbGVkIHRvIHNlbmQgdG8gPyB2aWEgPzogPycsXG4gICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmNsaWVudElkLCBVUkkuc3RyaW5naWZ5KHRoaXMuZW5kcG9pbnQpLCB0aGlzLmNvbm5lY3Rpb25UeXBlLCBtZXNzYWdlcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IG1lc3NhZ2VzLmxlbmd0aDsgaSA8IG47IGkrKylcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuaGFuZGxlRXJyb3IobWVzc2FnZXNbaV0pO1xuICB9LFxuXG4gIF9nZXRDb29raWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29va2llcyA9IHRoaXMuX2Rpc3BhdGNoZXIuY29va2llcyxcbiAgICAgICAgdXJsICAgICA9IFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCk7XG5cbiAgICBpZiAoIWNvb2tpZXMpIHJldHVybiAnJztcblxuICAgIHJldHVybiBhcnJheS5tYXAoY29va2llcy5nZXRDb29raWVzU3luYyh1cmwpLCBmdW5jdGlvbihjb29raWUpIHtcbiAgICAgIHJldHVybiBjb29raWUuY29va2llU3RyaW5nKCk7XG4gICAgfSkuam9pbignOyAnKTtcbiAgfSxcblxuICBfc3RvcmVDb29raWVzOiBmdW5jdGlvbihzZXRDb29raWUpIHtcbiAgICB2YXIgY29va2llcyA9IHRoaXMuX2Rpc3BhdGNoZXIuY29va2llcyxcbiAgICAgICAgdXJsICAgICA9IFVSSS5zdHJpbmdpZnkodGhpcy5lbmRwb2ludCksXG4gICAgICAgIGNvb2tpZTtcblxuICAgIGlmICghc2V0Q29va2llIHx8ICFjb29raWVzKSByZXR1cm47XG4gICAgc2V0Q29va2llID0gW10uY29uY2F0KHNldENvb2tpZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IHNldENvb2tpZS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGNvb2tpZSA9IENvb2tpZS5wYXJzZShzZXRDb29raWVbaV0pO1xuICAgICAgY29va2llcy5zZXRDb29raWVTeW5jKGNvb2tpZSwgdXJsKTtcbiAgICB9XG4gIH1cblxufSksIHtcbiAgZ2V0OiBmdW5jdGlvbihkaXNwYXRjaGVyLCBhbGxvd2VkLCBkaXNhYmxlZCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgZW5kcG9pbnQgPSBkaXNwYXRjaGVyLmVuZHBvaW50O1xuXG4gICAgYXJyYXkuYXN5bmNFYWNoKHRoaXMuX3RyYW5zcG9ydHMsIGZ1bmN0aW9uKHBhaXIsIHJlc3VtZSkge1xuICAgICAgdmFyIGNvbm5UeXBlICAgICA9IHBhaXJbMF0sIGtsYXNzID0gcGFpclsxXSxcbiAgICAgICAgICBjb25uRW5kcG9pbnQgPSBkaXNwYXRjaGVyLmVuZHBvaW50Rm9yKGNvbm5UeXBlKTtcblxuICAgICAgaWYgKGFycmF5LmluZGV4T2YoZGlzYWJsZWQsIGNvbm5UeXBlKSA+PSAwKVxuICAgICAgICByZXR1cm4gcmVzdW1lKCk7XG5cbiAgICAgIGlmIChhcnJheS5pbmRleE9mKGFsbG93ZWQsIGNvbm5UeXBlKSA8IDApIHtcbiAgICAgICAga2xhc3MuaXNVc2FibGUoZGlzcGF0Y2hlciwgY29ubkVuZHBvaW50LCBmdW5jdGlvbigpIHt9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VtZSgpO1xuICAgICAgfVxuXG4gICAgICBrbGFzcy5pc1VzYWJsZShkaXNwYXRjaGVyLCBjb25uRW5kcG9pbnQsIGZ1bmN0aW9uKGlzVXNhYmxlKSB7XG4gICAgICAgIGlmICghaXNVc2FibGUpIHJldHVybiByZXN1bWUoKTtcbiAgICAgICAgdmFyIHRyYW5zcG9ydCA9IGtsYXNzLmhhc093blByb3BlcnR5KCdjcmVhdGUnKSA/IGtsYXNzLmNyZWF0ZShkaXNwYXRjaGVyLCBjb25uRW5kcG9pbnQpIDogbmV3IGtsYXNzKGRpc3BhdGNoZXIsIGNvbm5FbmRwb2ludCk7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdHJhbnNwb3J0KTtcbiAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBhIHVzYWJsZSBjb25uZWN0aW9uIHR5cGUgZm9yICcgKyBVUkkuc3RyaW5naWZ5KGVuZHBvaW50KSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uKHR5cGUsIGtsYXNzKSB7XG4gICAgdGhpcy5fdHJhbnNwb3J0cy5wdXNoKFt0eXBlLCBrbGFzc10pO1xuICAgIGtsYXNzLnByb3RvdHlwZS5jb25uZWN0aW9uVHlwZSA9IHR5cGU7XG4gIH0sXG5cbiAgZ2V0Q29ubmVjdGlvblR5cGVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYXJyYXkubWFwKHRoaXMuX3RyYW5zcG9ydHMsIGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHRbMF0gfSk7XG4gIH0sXG5cbiAgX3RyYW5zcG9ydHM6IFtdXG59KTtcblxuZXh0ZW5kKFRyYW5zcG9ydC5wcm90b3R5cGUsIExvZ2dpbmcpO1xuZXh0ZW5kKFRyYW5zcG9ydC5wcm90b3R5cGUsIFRpbWVvdXRzKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDbGFzcyAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9jbGFzcycpLFxuICAgIFByb21pc2UgICAgPSByZXF1aXJlKCcuLi91dGlsL3Byb21pc2UnKSxcbiAgICBTZXQgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9zZXQnKSxcbiAgICBVUkkgICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC91cmknKSxcbiAgICBicm93c2VyICAgID0gcmVxdWlyZSgnLi4vdXRpbC9icm93c2VyJyksXG4gICAgY29weU9iamVjdCA9IHJlcXVpcmUoJy4uL3V0aWwvY29weV9vYmplY3QnKSxcbiAgICBleHRlbmQgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9leHRlbmQnKSxcbiAgICB0b0pTT04gICAgID0gcmVxdWlyZSgnLi4vdXRpbC90b19qc29uJyksXG4gICAgd3MgICAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvd2Vic29ja2V0JyksXG4gICAgRGVmZXJyYWJsZSA9IHJlcXVpcmUoJy4uL21peGlucy9kZWZlcnJhYmxlJyksXG4gICAgVHJhbnNwb3J0ICA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0Jyk7XG5cbnZhciBXZWJTb2NrZXQgPSBleHRlbmQoQ2xhc3MoVHJhbnNwb3J0LCB7XG4gIFVOQ09OTkVDVEVEOiAgMSxcbiAgQ09OTkVDVElORzogICAyLFxuICBDT05ORUNURUQ6ICAgIDMsXG5cbiAgYmF0Y2hpbmc6ICAgICBmYWxzZSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB0aGlzLmNhbGxiYWNrKGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHRydWUpIH0pO1xuICAgIHRoaXMuZXJyYmFjayhmdW5jdGlvbigpIHsgY2FsbGJhY2suY2FsbChjb250ZXh0LCBmYWxzZSkgfSk7XG4gICAgdGhpcy5jb25uZWN0KCk7XG4gIH0sXG5cbiAgcmVxdWVzdDogZnVuY3Rpb24obWVzc2FnZXMpIHtcbiAgICB0aGlzLl9wZW5kaW5nID0gdGhpcy5fcGVuZGluZyB8fCBuZXcgU2V0KCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBtZXNzYWdlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHRoaXMuX3BlbmRpbmcuYWRkKG1lc3NhZ2VzW2ldKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzZWxmLmNhbGxiYWNrKGZ1bmN0aW9uKHNvY2tldCkge1xuICAgICAgICBpZiAoIXNvY2tldCB8fCBzb2NrZXQucmVhZHlTdGF0ZSAhPT0gMSkgcmV0dXJuO1xuICAgICAgICBzb2NrZXQuc2VuZCh0b0pTT04obWVzc2FnZXMpKTtcbiAgICAgICAgcmVzb2x2ZShzb2NrZXQpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuY29ubmVjdCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbigpIHsgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHdzKSB7IHdzLmNsb3NlKCkgfSkgfVxuICAgIH07XG4gIH0sXG5cbiAgY29ubmVjdDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKFdlYlNvY2tldC5fdW5sb2FkZWQpIHJldHVybjtcblxuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5fc3RhdGUgfHwgdGhpcy5VTkNPTk5FQ1RFRDtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IHRoaXMuVU5DT05ORUNURUQpIHJldHVybjtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuQ09OTkVDVElORztcblxuICAgIHZhciBzb2NrZXQgPSB0aGlzLl9jcmVhdGVTb2NrZXQoKTtcbiAgICBpZiAoIXNvY2tldCkgcmV0dXJuIHRoaXMuc2V0RGVmZXJyZWRTdGF0dXMoJ2ZhaWxlZCcpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNvY2tldC5oZWFkZXJzKSBzZWxmLl9zdG9yZUNvb2tpZXMoc29ja2V0LmhlYWRlcnNbJ3NldC1jb29raWUnXSk7XG4gICAgICBzZWxmLl9zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICBzZWxmLl9zdGF0ZSA9IHNlbGYuQ09OTkVDVEVEO1xuICAgICAgc2VsZi5fZXZlckNvbm5lY3RlZCA9IHRydWU7XG4gICAgICBzZWxmLl9waW5nKCk7XG4gICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCdzdWNjZWVkZWQnLCBzb2NrZXQpO1xuICAgIH07XG5cbiAgICB2YXIgY2xvc2VkID0gZmFsc2U7XG4gICAgc29ja2V0Lm9uY2xvc2UgPSBzb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNsb3NlZCkgcmV0dXJuO1xuICAgICAgY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgdmFyIHdhc0Nvbm5lY3RlZCA9IChzZWxmLl9zdGF0ZSA9PT0gc2VsZi5DT05ORUNURUQpO1xuICAgICAgc29ja2V0Lm9ub3BlbiA9IHNvY2tldC5vbmNsb3NlID0gc29ja2V0Lm9uZXJyb3IgPSBzb2NrZXQub25tZXNzYWdlID0gbnVsbDtcblxuICAgICAgZGVsZXRlIHNlbGYuX3NvY2tldDtcbiAgICAgIHNlbGYuX3N0YXRlID0gc2VsZi5VTkNPTk5FQ1RFRDtcbiAgICAgIHNlbGYucmVtb3ZlVGltZW91dCgncGluZycpO1xuXG4gICAgICB2YXIgcGVuZGluZyA9IHNlbGYuX3BlbmRpbmcgPyBzZWxmLl9wZW5kaW5nLnRvQXJyYXkoKSA6IFtdO1xuICAgICAgZGVsZXRlIHNlbGYuX3BlbmRpbmc7XG5cbiAgICAgIGlmICh3YXNDb25uZWN0ZWQgfHwgc2VsZi5fZXZlckNvbm5lY3RlZCkge1xuICAgICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCd1bmtub3duJyk7XG4gICAgICAgIHNlbGYuX2hhbmRsZUVycm9yKHBlbmRpbmcsIHdhc0Nvbm5lY3RlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnNldERlZmVycmVkU3RhdHVzKCdmYWlsZWQnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgcmVwbGllcztcbiAgICAgIHRyeSB7IHJlcGxpZXMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICBpZiAoIXJlcGxpZXMpIHJldHVybjtcblxuICAgICAgcmVwbGllcyA9IFtdLmNvbmNhdChyZXBsaWVzKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSByZXBsaWVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICBpZiAocmVwbGllc1tpXS5zdWNjZXNzZnVsID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgICBzZWxmLl9wZW5kaW5nLnJlbW92ZShyZXBsaWVzW2ldKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3JlY2VpdmUocmVwbGllcyk7XG4gICAgfTtcbiAgfSxcblxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHJldHVybjtcbiAgICB0aGlzLl9zb2NrZXQuY2xvc2UoKTtcbiAgfSxcblxuICBfY3JlYXRlU29ja2V0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXJsICAgICAgICA9IFdlYlNvY2tldC5nZXRTb2NrZXRVcmwodGhpcy5lbmRwb2ludCksXG4gICAgICAgIGhlYWRlcnMgICAgPSB0aGlzLl9kaXNwYXRjaGVyLmhlYWRlcnMsXG4gICAgICAgIGV4dGVuc2lvbnMgPSB0aGlzLl9kaXNwYXRjaGVyLndzRXh0ZW5zaW9ucyxcbiAgICAgICAgY29va2llICAgICA9IHRoaXMuX2dldENvb2tpZXMoKSxcbiAgICAgICAgdGxzICAgICAgICA9IHRoaXMuX2Rpc3BhdGNoZXIudGxzLFxuICAgICAgICBvcHRpb25zICAgID0ge2V4dGVuc2lvbnM6IGV4dGVuc2lvbnMsIGhlYWRlcnM6IGhlYWRlcnMsIHByb3h5OiB0aGlzLl9wcm94eSwgdGxzOiB0bHN9O1xuXG4gICAgaWYgKGNvb2tpZSAhPT0gJycpIG9wdGlvbnMuaGVhZGVyc1snQ29va2llJ10gPSBjb29raWU7XG5cbiAgICByZXR1cm4gd3MuY3JlYXRlKHVybCwgW10sIG9wdGlvbnMpO1xuICB9LFxuXG4gIF9waW5nOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCB8fCB0aGlzLl9zb2NrZXQucmVhZHlTdGF0ZSAhPT0gMSkgcmV0dXJuO1xuICAgIHRoaXMuX3NvY2tldC5zZW5kKCdbXScpO1xuICAgIHRoaXMuYWRkVGltZW91dCgncGluZycsIHRoaXMuX2Rpc3BhdGNoZXIudGltZW91dCAvIDIsIHRoaXMuX3BpbmcsIHRoaXMpO1xuICB9XG5cbn0pLCB7XG4gIFBST1RPQ09MUzoge1xuICAgICdodHRwOic6ICAnd3M6JyxcbiAgICAnaHR0cHM6JzogJ3dzczonXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCkge1xuICAgIHZhciBzb2NrZXRzID0gZGlzcGF0Y2hlci50cmFuc3BvcnRzLndlYnNvY2tldCA9IGRpc3BhdGNoZXIudHJhbnNwb3J0cy53ZWJzb2NrZXQgfHwge307XG4gICAgc29ja2V0c1tlbmRwb2ludC5ocmVmXSA9IHNvY2tldHNbZW5kcG9pbnQuaHJlZl0gfHwgbmV3IHRoaXMoZGlzcGF0Y2hlciwgZW5kcG9pbnQpO1xuICAgIHJldHVybiBzb2NrZXRzW2VuZHBvaW50LmhyZWZdO1xuICB9LFxuXG4gIGdldFNvY2tldFVybDogZnVuY3Rpb24oZW5kcG9pbnQpIHtcbiAgICBlbmRwb2ludCA9IGNvcHlPYmplY3QoZW5kcG9pbnQpO1xuICAgIGVuZHBvaW50LnByb3RvY29sID0gdGhpcy5QUk9UT0NPTFNbZW5kcG9pbnQucHJvdG9jb2xdO1xuICAgIHJldHVybiBVUkkuc3RyaW5naWZ5KGVuZHBvaW50KTtcbiAgfSxcblxuICBpc1VzYWJsZTogZnVuY3Rpb24oZGlzcGF0Y2hlciwgZW5kcG9pbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdGhpcy5jcmVhdGUoZGlzcGF0Y2hlciwgZW5kcG9pbnQpLmlzVXNhYmxlKGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgfVxufSk7XG5cbmV4dGVuZChXZWJTb2NrZXQucHJvdG90eXBlLCBEZWZlcnJhYmxlKTtcblxuaWYgKGJyb3dzZXIuRXZlbnQgJiYgZ2xvYmFsLm9uYmVmb3JldW5sb2FkICE9PSB1bmRlZmluZWQpXG4gIGJyb3dzZXIuRXZlbnQub24oZ2xvYmFsLCAnYmVmb3JldW5sb2FkJywgZnVuY3Rpb24oKSB7IFdlYlNvY2tldC5fdW5sb2FkZWQgPSB0cnVlIH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYlNvY2tldDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzICAgICA9IHJlcXVpcmUoJy4uL3V0aWwvY2xhc3MnKSxcbiAgICBVUkkgICAgICAgPSByZXF1aXJlKCcuLi91dGlsL3VyaScpLFxuICAgIGJyb3dzZXIgICA9IHJlcXVpcmUoJy4uL3V0aWwvYnJvd3NlcicpLFxuICAgIGV4dGVuZCAgICA9IHJlcXVpcmUoJy4uL3V0aWwvZXh0ZW5kJyksXG4gICAgdG9KU09OICAgID0gcmVxdWlyZSgnLi4vdXRpbC90b19qc29uJyksXG4gICAgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcblxudmFyIFhIUiA9IGV4dGVuZChDbGFzcyhUcmFuc3BvcnQsIHtcbiAgZW5jb2RlOiBmdW5jdGlvbihtZXNzYWdlcykge1xuICAgIHJldHVybiB0b0pTT04obWVzc2FnZXMpO1xuICB9LFxuXG4gIHJlcXVlc3Q6IGZ1bmN0aW9uKG1lc3NhZ2VzKSB7XG4gICAgdmFyIGhyZWYgPSB0aGlzLmVuZHBvaW50LmhyZWYsXG4gICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICB4aHI7XG5cbiAgICAvLyBQcmVmZXIgWE1MSHR0cFJlcXVlc3Qgb3ZlciBBY3RpdmVYT2JqZWN0IGlmIHRoZXkgYm90aCBleGlzdFxuICAgIGlmIChnbG9iYWwuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLkFjdGl2ZVhPYmplY3QpIHtcbiAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuICAgIH1cblxuICAgIHhoci5vcGVuKCdQT1NUJywgaHJlZiwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1ByYWdtYScsICduby1jYWNoZScpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLVJlcXVlc3RlZC1XaXRoJywgJ1hNTEh0dHBSZXF1ZXN0Jyk7XG5cbiAgICB2YXIgaGVhZGVycyA9IHRoaXMuX2Rpc3BhdGNoZXIuaGVhZGVycztcbiAgICBmb3IgKHZhciBrZXkgaW4gaGVhZGVycykge1xuICAgICAgaWYgKCFoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pO1xuICAgIH1cblxuICAgIHZhciBhYm9ydCA9IGZ1bmN0aW9uKCkgeyB4aHIuYWJvcnQoKSB9O1xuICAgIGlmIChnbG9iYWwub25iZWZvcmV1bmxvYWQgIT09IHVuZGVmaW5lZClcbiAgICAgIGJyb3dzZXIuRXZlbnQub24oZ2xvYmFsLCAnYmVmb3JldW5sb2FkJywgYWJvcnQpO1xuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF4aHIgfHwgeGhyLnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcblxuICAgICAgdmFyIHJlcGxpZXMgICAgPSBudWxsLFxuICAgICAgICAgIHN0YXR1cyAgICAgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgIHRleHQgICAgICAgPSB4aHIucmVzcG9uc2VUZXh0LFxuICAgICAgICAgIHN1Y2Nlc3NmdWwgPSAoc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDApIHx8IHN0YXR1cyA9PT0gMzA0IHx8IHN0YXR1cyA9PT0gMTIyMztcblxuICAgICAgaWYgKGdsb2JhbC5vbmJlZm9yZXVubG9hZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBicm93c2VyLkV2ZW50LmRldGFjaChnbG9iYWwsICdiZWZvcmV1bmxvYWQnLCBhYm9ydCk7XG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgeGhyID0gbnVsbDtcblxuICAgICAgaWYgKCFzdWNjZXNzZnVsKSByZXR1cm4gc2VsZi5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXBsaWVzID0gSlNPTi5wYXJzZSh0ZXh0KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuXG4gICAgICBpZiAocmVwbGllcylcbiAgICAgICAgc2VsZi5fcmVjZWl2ZShyZXBsaWVzKTtcbiAgICAgIGVsc2VcbiAgICAgICAgc2VsZi5faGFuZGxlRXJyb3IobWVzc2FnZXMpO1xuICAgIH07XG5cbiAgICB4aHIuc2VuZCh0aGlzLmVuY29kZShtZXNzYWdlcykpO1xuICAgIHJldHVybiB4aHI7XG4gIH1cbn0pLCB7XG4gIGlzVXNhYmxlOiBmdW5jdGlvbihkaXNwYXRjaGVyLCBlbmRwb2ludCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgdXNhYmxlID0gKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKVxuICAgICAgICAgICAgICB8fCBVUkkuaXNTYW1lT3JpZ2luKGVuZHBvaW50KTtcblxuICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdXNhYmxlKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gWEhSO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tbW9uRWxlbWVudDogZnVuY3Rpb24obGlzdGEsIGxpc3RiKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBsaXN0YS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmluZGV4T2YobGlzdGIsIGxpc3RhW2ldKSAhPT0gLTEpXG4gICAgICAgIHJldHVybiBsaXN0YVtpXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgaW5kZXhPZjogZnVuY3Rpb24obGlzdCwgbmVlZGxlKSB7XG4gICAgaWYgKGxpc3QuaW5kZXhPZikgcmV0dXJuIGxpc3QuaW5kZXhPZihuZWVkbGUpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBsaXN0Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IG5lZWRsZSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfSxcblxuICBtYXA6IGZ1bmN0aW9uKG9iamVjdCwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBpZiAob2JqZWN0Lm1hcCkgcmV0dXJuIG9iamVjdC5tYXAoY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBvYmplY3QubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBudWxsLCBvYmplY3RbaV0sIGkpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcbiAgICAgICAgcmVzdWx0LnB1c2goY2FsbGJhY2suY2FsbChjb250ZXh0IHx8IG51bGwsIGtleSwgb2JqZWN0W2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBmaWx0ZXI6IGZ1bmN0aW9uKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGlmIChhcnJheS5maWx0ZXIpIHJldHVybiBhcnJheS5maWx0ZXIoY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCB8fCBudWxsLCBhcnJheVtpXSwgaSkpXG4gICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICBhc3luY0VhY2g6IGZ1bmN0aW9uKGxpc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciBuICAgICAgID0gbGlzdC5sZW5ndGgsXG4gICAgICAgIGkgICAgICAgPSAtMSxcbiAgICAgICAgY2FsbHMgICA9IDAsXG4gICAgICAgIGxvb3BpbmcgPSBmYWxzZTtcblxuICAgIHZhciBpdGVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBjYWxscyAtPSAxO1xuICAgICAgaSArPSAxO1xuICAgICAgaWYgKGkgPT09IG4pIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xuICAgICAgaXRlcmF0b3IobGlzdFtpXSwgcmVzdW1lKTtcbiAgICB9O1xuXG4gICAgdmFyIGxvb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChsb29waW5nKSByZXR1cm47XG4gICAgICBsb29waW5nID0gdHJ1ZTtcbiAgICAgIHdoaWxlIChjYWxscyA+IDApIGl0ZXJhdGUoKTtcbiAgICAgIGxvb3BpbmcgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc3VtZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbHMgKz0gMTtcbiAgICAgIGxvb3AoKTtcbiAgICB9O1xuICAgIHJlc3VtZSgpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRXZlbnQgPSB7XG4gIF9yZWdpc3RyeTogW10sXG5cbiAgb246IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uKCkgeyBjYWxsYmFjay5jYWxsKGNvbnRleHQpIH07XG5cbiAgICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKVxuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcHBlZCwgZmFsc2UpO1xuICAgIGVsc2VcbiAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50TmFtZSwgd3JhcHBlZCk7XG5cbiAgICB0aGlzLl9yZWdpc3RyeS5wdXNoKHtcbiAgICAgIF9lbGVtZW50OiAgIGVsZW1lbnQsXG4gICAgICBfdHlwZTogICAgICBldmVudE5hbWUsXG4gICAgICBfY2FsbGJhY2s6ICBjYWxsYmFjayxcbiAgICAgIF9jb250ZXh0OiAgICAgY29udGV4dCxcbiAgICAgIF9oYW5kbGVyOiAgIHdyYXBwZWRcbiAgICB9KTtcbiAgfSxcblxuICBkZXRhY2g6IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgaSA9IHRoaXMuX3JlZ2lzdHJ5Lmxlbmd0aCwgcmVnaXN0ZXI7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgcmVnaXN0ZXIgPSB0aGlzLl9yZWdpc3RyeVtpXTtcblxuICAgICAgaWYgKChlbGVtZW50ICAgICYmIGVsZW1lbnQgICAgIT09IHJlZ2lzdGVyLl9lbGVtZW50KSAgfHxcbiAgICAgICAgICAoZXZlbnROYW1lICAmJiBldmVudE5hbWUgICE9PSByZWdpc3Rlci5fdHlwZSkgICAgIHx8XG4gICAgICAgICAgKGNhbGxiYWNrICAgJiYgY2FsbGJhY2sgICAhPT0gcmVnaXN0ZXIuX2NhbGxiYWNrKSB8fFxuICAgICAgICAgIChjb250ZXh0ICAgICYmIGNvbnRleHQgICAgIT09IHJlZ2lzdGVyLl9jb250ZXh0KSlcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIGlmIChyZWdpc3Rlci5fZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKVxuICAgICAgICByZWdpc3Rlci5fZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHJlZ2lzdGVyLl90eXBlLCByZWdpc3Rlci5faGFuZGxlciwgZmFsc2UpO1xuICAgICAgZWxzZVxuICAgICAgICByZWdpc3Rlci5fZWxlbWVudC5kZXRhY2hFdmVudCgnb24nICsgcmVnaXN0ZXIuX3R5cGUsIHJlZ2lzdGVyLl9oYW5kbGVyKTtcblxuICAgICAgdGhpcy5fcmVnaXN0cnkuc3BsaWNlKGksMSk7XG4gICAgICByZWdpc3RlciA9IG51bGw7XG4gICAgfVxuICB9XG59O1xuXG5pZiAoZ2xvYmFsLm9udW5sb2FkICE9PSB1bmRlZmluZWQpXG4gIEV2ZW50Lm9uKGdsb2JhbCwgJ3VubG9hZCcsIEV2ZW50LmRldGFjaCwgRXZlbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRXZlbnQ6IEV2ZW50XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwYXJlbnQsIG1ldGhvZHMpIHtcbiAgaWYgKHR5cGVvZiBwYXJlbnQgIT09ICdmdW5jdGlvbicpIHtcbiAgICBtZXRob2RzID0gcGFyZW50O1xuICAgIHBhcmVudCAgPSBPYmplY3Q7XG4gIH1cblxuICB2YXIga2xhc3MgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZSkgcmV0dXJuIHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gIH07XG5cbiAgdmFyIGJyaWRnZSA9IGZ1bmN0aW9uKCkge307XG4gIGJyaWRnZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuXG4gIGtsYXNzLnByb3RvdHlwZSA9IG5ldyBicmlkZ2UoKTtcbiAgZXh0ZW5kKGtsYXNzLnByb3RvdHlwZSwgbWV0aG9kcyk7XG5cbiAgcmV0dXJuIGtsYXNzO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBWRVJTSU9OOiAgICAgICAgICAnMS4yLjEnLFxuXG4gIEJBWUVVWF9WRVJTSU9OOiAgICcxLjAnLFxuICBJRF9MRU5HVEg6ICAgICAgICAxNjAsXG4gIEpTT05QX0NBTExCQUNLOiAgICdqc29ucGNhbGxiYWNrJyxcbiAgQ09OTkVDVElPTl9UWVBFUzogWydsb25nLXBvbGxpbmcnLCAnY3Jvc3Mtb3JpZ2luLWxvbmctcG9sbGluZycsICdjYWxsYmFjay1wb2xsaW5nJywgJ3dlYnNvY2tldCcsICdldmVudHNvdXJjZScsICdpbi1wcm9jZXNzJ10sXG5cbiAgTUFOREFUT1JZX0NPTk5FQ1RJT05fVFlQRVM6IFsnbG9uZy1wb2xsaW5nJywgJ2NhbGxiYWNrLXBvbGxpbmcnLCAnaW4tcHJvY2VzcyddXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29weU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgY2xvbmUsIGksIGtleTtcbiAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgY2xvbmUgPSBbXTtcbiAgICBpID0gb2JqZWN0Lmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSBjbG9uZVtpXSA9IGNvcHlPYmplY3Qob2JqZWN0W2ldKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcpIHtcbiAgICBjbG9uZSA9IChvYmplY3QgPT09IG51bGwpID8gbnVsbCA6IHt9O1xuICAgIGZvciAoa2V5IGluIG9iamVjdCkgY2xvbmVba2V5XSA9IGNvcHlPYmplY3Qob2JqZWN0W2tleV0pO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG4iLCIvKlxuQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mXG50aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluXG50aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvXG51c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllc1xub2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvXG5zbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuU09GVFdBUkUuXG4qL1xuXG52YXIgaXNBcnJheSA9IHR5cGVvZiBBcnJheS5pc0FycmF5ID09PSAnZnVuY3Rpb24nXG4gICAgPyBBcnJheS5pc0FycmF5XG4gICAgOiBmdW5jdGlvbiAoeHMpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4cykgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgICB9XG47XG5mdW5jdGlvbiBpbmRleE9mICh4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh4ID09PSB4c1tpXSkgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge31cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc0FycmF5KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKVxuICAgIHtcbiAgICAgIGlmIChhcmd1bWVudHNbMV0gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBhcmd1bWVudHNbMV07IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNhdWdodCwgdW5zcGVjaWZpZWQgJ2Vycm9yJyBldmVudC5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiBmYWxzZTtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGlmICghaGFuZGxlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIGlmIChpc0FycmF5KGhhbmRsZXIpKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PSBcIm5ld0xpc3RlbmVyc1wiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lcnNcIi5cbiAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzZWxmLm9uKHR5cGUsIGZ1bmN0aW9uIGcoKSB7XG4gICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcbiAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0FycmF5KGxpc3QpKSB7XG4gICAgdmFyIGkgPSBpbmRleE9mKGxpc3QsIGxpc3RlbmVyKTtcbiAgICBpZiAoaSA8IDApIHJldHVybiB0aGlzO1xuICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgIGlmIChsaXN0Lmxlbmd0aCA9PSAwKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfSBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0gPT09IGxpc3RlbmVyKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKHR5cGUgJiYgdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkgdGhpcy5fZXZlbnRzW3R5cGVdID0gW107XG4gIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2V2ZW50c1t0eXBlXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVzdCwgc291cmNlLCBvdmVyd3JpdGUpIHtcbiAgaWYgKCFzb3VyY2UpIHJldHVybiBkZXN0O1xuICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG4gICAgaWYgKGRlc3QuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBvdmVyd3JpdGUgPT09IGZhbHNlKSBjb250aW51ZTtcbiAgICBpZiAoZGVzdFtrZXldICE9PSBzb3VyY2Vba2V5XSlcbiAgICAgIGRlc3Rba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG4gIHJldHVybiBkZXN0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwJyk7XG5cbnZhciBQRU5ESU5HICAgPSAwLFxuICAgIEZVTEZJTExFRCA9IDEsXG4gICAgUkVKRUNURUQgID0gMjtcblxudmFyIFJFVFVSTiA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggfSxcbiAgICBUSFJPVyAgPSBmdW5jdGlvbih4KSB7IHRocm93ICB4IH07XG5cbnZhciBQcm9taXNlID0gZnVuY3Rpb24odGFzaykge1xuICB0aGlzLl9zdGF0ZSAgICAgICA9IFBFTkRJTkc7XG4gIHRoaXMuX29uRnVsZmlsbGVkID0gW107XG4gIHRoaXMuX29uUmVqZWN0ZWQgID0gW107XG5cbiAgaWYgKHR5cGVvZiB0YXNrICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG4gIHZhciBzZWxmID0gdGhpcztcblxuICB0YXNrKGZ1bmN0aW9uKHZhbHVlKSAgeyBmdWxmaWxsKHNlbGYsIHZhbHVlKSB9LFxuICAgICAgIGZ1bmN0aW9uKHJlYXNvbikgeyByZWplY3Qoc2VsZiwgcmVhc29uKSB9KTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB2YXIgbmV4dCA9IG5ldyBQcm9taXNlKCk7XG4gIHJlZ2lzdGVyT25GdWxmaWxsZWQodGhpcywgb25GdWxmaWxsZWQsIG5leHQpO1xuICByZWdpc3Rlck9uUmVqZWN0ZWQodGhpcywgb25SZWplY3RlZCwgbmV4dCk7XG4gIHJldHVybiBuZXh0O1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbihvblJlamVjdGVkKSB7XG4gIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG59O1xuXG52YXIgcmVnaXN0ZXJPbkZ1bGZpbGxlZCA9IGZ1bmN0aW9uKHByb21pc2UsIG9uRnVsZmlsbGVkLCBuZXh0KSB7XG4gIGlmICh0eXBlb2Ygb25GdWxmaWxsZWQgIT09ICdmdW5jdGlvbicpIG9uRnVsZmlsbGVkID0gUkVUVVJOO1xuICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKHZhbHVlKSB7IGludm9rZShvbkZ1bGZpbGxlZCwgdmFsdWUsIG5leHQpIH07XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgcHJvbWlzZS5fb25GdWxmaWxsZWQucHVzaChoYW5kbGVyKTtcbiAgfSBlbHNlIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgaGFuZGxlcihwcm9taXNlLl92YWx1ZSk7XG4gIH1cbn07XG5cbnZhciByZWdpc3Rlck9uUmVqZWN0ZWQgPSBmdW5jdGlvbihwcm9taXNlLCBvblJlamVjdGVkLCBuZXh0KSB7XG4gIGlmICh0eXBlb2Ygb25SZWplY3RlZCAhPT0gJ2Z1bmN0aW9uJykgb25SZWplY3RlZCA9IFRIUk9XO1xuICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKHJlYXNvbikgeyBpbnZva2Uob25SZWplY3RlZCwgcmVhc29uLCBuZXh0KSB9O1xuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUEVORElORykge1xuICAgIHByb21pc2UuX29uUmVqZWN0ZWQucHVzaChoYW5kbGVyKTtcbiAgfSBlbHNlIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICBoYW5kbGVyKHByb21pc2UuX3JlYXNvbik7XG4gIH1cbn07XG5cbnZhciBpbnZva2UgPSBmdW5jdGlvbihmbiwgdmFsdWUsIG5leHQpIHtcbiAgYXNhcChmdW5jdGlvbigpIHsgX2ludm9rZShmbiwgdmFsdWUsIG5leHQpIH0pO1xufTtcblxudmFyIF9pbnZva2UgPSBmdW5jdGlvbihmbiwgdmFsdWUsIG5leHQpIHtcbiAgdmFyIG91dGNvbWU7XG5cbiAgdHJ5IHtcbiAgICBvdXRjb21lID0gZm4odmFsdWUpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiByZWplY3QobmV4dCwgZXJyb3IpO1xuICB9XG5cbiAgaWYgKG91dGNvbWUgPT09IG5leHQpIHtcbiAgICByZWplY3QobmV4dCwgbmV3IFR5cGVFcnJvcignUmVjdXJzaXZlIHByb21pc2UgY2hhaW4gZGV0ZWN0ZWQnKSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChuZXh0LCBvdXRjb21lKTtcbiAgfVxufTtcblxudmFyIGZ1bGZpbGwgPSBmdW5jdGlvbihwcm9taXNlLCB2YWx1ZSkge1xuICB2YXIgY2FsbGVkID0gZmFsc2UsIHR5cGUsIHRoZW47XG5cbiAgdHJ5IHtcbiAgICB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICAgIHRoZW4gPSB2YWx1ZSAhPT0gbnVsbCAmJiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JykgJiYgdmFsdWUudGhlbjtcblxuICAgIGlmICh0eXBlb2YgdGhlbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIF9mdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcblxuICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVuY3Rpb24odikge1xuICAgICAgaWYgKCEoY2FsbGVkIF4gKGNhbGxlZCA9IHRydWUpKSkgcmV0dXJuO1xuICAgICAgZnVsZmlsbChwcm9taXNlLCB2KTtcbiAgICB9LCBmdW5jdGlvbihyKSB7XG4gICAgICBpZiAoIShjYWxsZWQgXiAoY2FsbGVkID0gdHJ1ZSkpKSByZXR1cm47XG4gICAgICByZWplY3QocHJvbWlzZSwgcik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKCEoY2FsbGVkIF4gKGNhbGxlZCA9IHRydWUpKSkgcmV0dXJuO1xuICAgIHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gIH1cbn07XG5cbnZhciBfZnVsZmlsbCA9IGZ1bmN0aW9uKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykgcmV0dXJuO1xuXG4gIHByb21pc2UuX3N0YXRlICAgICAgPSBGVUxGSUxMRUQ7XG4gIHByb21pc2UuX3ZhbHVlICAgICAgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fb25SZWplY3RlZCA9IFtdO1xuXG4gIHZhciBvbkZ1bGZpbGxlZCA9IHByb21pc2UuX29uRnVsZmlsbGVkLCBmbjtcbiAgd2hpbGUgKGZuID0gb25GdWxmaWxsZWQuc2hpZnQoKSkgZm4odmFsdWUpO1xufTtcblxudmFyIHJlamVjdCA9IGZ1bmN0aW9uKHByb21pc2UsIHJlYXNvbikge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHJldHVybjtcblxuICBwcm9taXNlLl9zdGF0ZSAgICAgICA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZWFzb24gICAgICA9IHJlYXNvbjtcbiAgcHJvbWlzZS5fb25GdWxmaWxsZWQgPSBbXTtcblxuICB2YXIgb25SZWplY3RlZCA9IHByb21pc2UuX29uUmVqZWN0ZWQsIGZuO1xuICB3aGlsZSAoZm4gPSBvblJlamVjdGVkLnNoaWZ0KCkpIGZuKHJlYXNvbik7XG59O1xuXG5Qcm9taXNlLnJlc29sdmUgPSBQcm9taXNlLmFjY2VwdCA9IFByb21pc2UuZnVsZmlsbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsgcmVzb2x2ZSh2YWx1ZSkgfSk7XG59O1xuXG5Qcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uKHJlYXNvbikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7IHJlamVjdChyZWFzb24pIH0pO1xufTtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihwcm9taXNlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGxpc3QgPSBbXSwgbiA9IHByb21pc2VzLmxlbmd0aCwgaTtcblxuICAgIGlmIChuID09PSAwKSByZXR1cm4gcmVzb2x2ZShsaXN0KTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpKyspIChmdW5jdGlvbihwcm9taXNlLCBpKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBsaXN0W2ldID0gdmFsdWU7XG4gICAgICAgIGlmICgtLW4gPT09IDApIHJlc29sdmUobGlzdCk7XG4gICAgICB9LCByZWplY3QpO1xuICAgIH0pKHByb21pc2VzW2ldLCBpKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJhY2UgPSBmdW5jdGlvbihwcm9taXNlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBwcm9taXNlcy5sZW5ndGg7IGkgPCBuOyBpKyspXG4gICAgICBQcm9taXNlLnJlc29sdmUocHJvbWlzZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLmRlZmVycmVkID0gUHJvbWlzZS5wZW5kaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0dXBsZSA9IHt9O1xuXG4gIHR1cGxlLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0dXBsZS5mdWxmaWxsID0gdHVwbGUucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgdHVwbGUucmVqZWN0ICA9IHJlamVjdDtcbiAgfSk7XG4gIHJldHVybiB0dXBsZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENsYXNzID0gcmVxdWlyZSgnLi9jbGFzcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENsYXNzKHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5faW5kZXggPSB7fTtcbiAgfSxcblxuICBhZGQ6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIga2V5ID0gKGl0ZW0uaWQgIT09IHVuZGVmaW5lZCkgPyBpdGVtLmlkIDogaXRlbTtcbiAgICBpZiAodGhpcy5faW5kZXguaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuX2luZGV4W2tleV0gPSBpdGVtO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIGZvckVhY2g6IGZ1bmN0aW9uKGJsb2NrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2luZGV4KSB7XG4gICAgICBpZiAodGhpcy5faW5kZXguaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgYmxvY2suY2FsbChjb250ZXh0LCB0aGlzLl9pbmRleFtrZXldKTtcbiAgICB9XG4gIH0sXG5cbiAgaXNFbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuX2luZGV4KSB7XG4gICAgICBpZiAodGhpcy5faW5kZXguaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBtZW1iZXI6IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5faW5kZXgpIHtcbiAgICAgIGlmICh0aGlzLl9pbmRleFtrZXldID09PSBpdGVtKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBrZXkgPSAoaXRlbS5pZCAhPT0gdW5kZWZpbmVkKSA/IGl0ZW0uaWQgOiBpdGVtO1xuICAgIHZhciByZW1vdmVkID0gdGhpcy5faW5kZXhba2V5XTtcbiAgICBkZWxldGUgdGhpcy5faW5kZXhba2V5XTtcbiAgICByZXR1cm4gcmVtb3ZlZDtcbiAgfSxcblxuICB0b0FycmF5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkgeyBhcnJheS5wdXNoKGl0ZW0pIH0pO1xuICAgIHJldHVybiBhcnJheTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIGh0dHA6Ly9hc3NhbmthLm5ldC9jb250ZW50L3RlY2gvMjAwOS8wOS8wMi9qc29uMi1qcy12cy1wcm90b3R5cGUvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gKHRoaXNba2V5XSBpbnN0YW5jZW9mIEFycmF5KSA/IHRoaXNba2V5XSA6IHZhbHVlO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc1VSSTogZnVuY3Rpb24odXJpKSB7XG4gICAgcmV0dXJuIHVyaSAmJiB1cmkucHJvdG9jb2wgJiYgdXJpLmhvc3QgJiYgdXJpLnBhdGg7XG4gIH0sXG5cbiAgaXNTYW1lT3JpZ2luOiBmdW5jdGlvbih1cmkpIHtcbiAgICByZXR1cm4gdXJpLnByb3RvY29sID09PSBsb2NhdGlvbi5wcm90b2NvbCAmJlxuICAgICAgICAgICB1cmkuaG9zdG5hbWUgPT09IGxvY2F0aW9uLmhvc3RuYW1lICYmXG4gICAgICAgICAgIHVyaS5wb3J0ICAgICA9PT0gbG9jYXRpb24ucG9ydDtcbiAgfSxcblxuICBwYXJzZTogZnVuY3Rpb24odXJsKSB7XG4gICAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKSByZXR1cm4gdXJsO1xuICAgIHZhciB1cmkgPSB7fSwgcGFydHMsIHF1ZXJ5LCBwYWlycywgaSwgbiwgZGF0YTtcblxuICAgIHZhciBjb25zdW1lID0gZnVuY3Rpb24obmFtZSwgcGF0dGVybikge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UocGF0dGVybiwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgdXJpW25hbWVdID0gbWF0Y2g7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH0pO1xuICAgICAgdXJpW25hbWVdID0gdXJpW25hbWVdIHx8ICcnO1xuICAgIH07XG5cbiAgICBjb25zdW1lKCdwcm90b2NvbCcsIC9eW2Etel0rXFw6L2kpO1xuICAgIGNvbnN1bWUoJ2hvc3QnLCAgICAgL15cXC9cXC9bXlxcL1xcPyNdKy8pO1xuXG4gICAgaWYgKCEvXlxcLy8udGVzdCh1cmwpICYmICF1cmkuaG9zdClcbiAgICAgIHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1teXFwvXSokLywgJycpICsgdXJsO1xuXG4gICAgY29uc3VtZSgncGF0aG5hbWUnLCAvXlteXFw/I10qLyk7XG4gICAgY29uc3VtZSgnc2VhcmNoJywgICAvXlxcP1teI10qLyk7XG4gICAgY29uc3VtZSgnaGFzaCcsICAgICAvXiMuKi8pO1xuXG4gICAgdXJpLnByb3RvY29sID0gdXJpLnByb3RvY29sIHx8IGxvY2F0aW9uLnByb3RvY29sO1xuXG4gICAgaWYgKHVyaS5ob3N0KSB7XG4gICAgICB1cmkuaG9zdCAgICAgPSB1cmkuaG9zdC5zdWJzdHIoMik7XG4gICAgICBwYXJ0cyAgICAgICAgPSB1cmkuaG9zdC5zcGxpdCgnOicpO1xuICAgICAgdXJpLmhvc3RuYW1lID0gcGFydHNbMF07XG4gICAgICB1cmkucG9ydCAgICAgPSBwYXJ0c1sxXSB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdXJpLmhvc3QgICAgID0gbG9jYXRpb24uaG9zdDtcbiAgICAgIHVyaS5ob3N0bmFtZSA9IGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgICAgdXJpLnBvcnQgICAgID0gbG9jYXRpb24ucG9ydDtcbiAgICB9XG5cbiAgICB1cmkucGF0aG5hbWUgPSB1cmkucGF0aG5hbWUgfHwgJy8nO1xuICAgIHVyaS5wYXRoID0gdXJpLnBhdGhuYW1lICsgdXJpLnNlYXJjaDtcblxuICAgIHF1ZXJ5ID0gdXJpLnNlYXJjaC5yZXBsYWNlKC9eXFw/LywgJycpO1xuICAgIHBhaXJzID0gcXVlcnkgPyBxdWVyeS5zcGxpdCgnJicpIDogW107XG4gICAgZGF0YSAgPSB7fTtcblxuICAgIGZvciAoaSA9IDAsIG4gPSBwYWlycy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHBhcnRzID0gcGFpcnNbaV0uc3BsaXQoJz0nKTtcbiAgICAgIGRhdGFbZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdIHx8ICcnKV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0gfHwgJycpO1xuICAgIH1cblxuICAgIHVyaS5xdWVyeSA9IGRhdGE7XG5cbiAgICB1cmkuaHJlZiA9IHRoaXMuc3RyaW5naWZ5KHVyaSk7XG4gICAgcmV0dXJuIHVyaTtcbiAgfSxcblxuICBzdHJpbmdpZnk6IGZ1bmN0aW9uKHVyaSkge1xuICAgIHZhciBzdHJpbmcgPSB1cmkucHJvdG9jb2wgKyAnLy8nICsgdXJpLmhvc3RuYW1lO1xuICAgIGlmICh1cmkucG9ydCkgc3RyaW5nICs9ICc6JyArIHVyaS5wb3J0O1xuICAgIHN0cmluZyArPSB1cmkucGF0aG5hbWUgKyB0aGlzLnF1ZXJ5U3RyaW5nKHVyaS5xdWVyeSkgKyAodXJpLmhhc2ggfHwgJycpO1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH0sXG5cbiAgcXVlcnlTdHJpbmc6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgdmFyIHBhaXJzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIHF1ZXJ5KSB7XG4gICAgICBpZiAoIXF1ZXJ5Lmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuICAgICAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChxdWVyeVtrZXldKSk7XG4gICAgfVxuICAgIGlmIChwYWlycy5sZW5ndGggPT09IDApIHJldHVybiAnJztcbiAgICByZXR1cm4gJz8nICsgcGFpcnMuam9pbignJicpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXJyYXkgPSByZXF1aXJlKCcuL2FycmF5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucywgdmFsaWRLZXlzKSB7XG4gIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG4gICAgaWYgKGFycmF5LmluZGV4T2YodmFsaWRLZXlzLCBrZXkpIDwgMClcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5yZWNvZ25pemVkIG9wdGlvbjogJyArIGtleSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBXUyA9IGdsb2JhbC5Nb3pXZWJTb2NrZXQgfHwgZ2xvYmFsLldlYlNvY2tldDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogZnVuY3Rpb24odXJsLCBwcm90b2NvbHMsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IFdTKHVybCk7XG4gIH1cbn07XG4iXX0=
