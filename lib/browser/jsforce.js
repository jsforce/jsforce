'use strict';

var jsforce = require('../jsforce');
var crequire;

// core-require code will be automatically generated in grunt process before making browser build
try {
  crequire = require('../core-require'); 
} catch(e) {}

jsforce.browser = require('./client');
jsforce.modules = jsforce.modules || {};
jsforce.require = function(name) {
  try {
    return crequire(name);
  } catch(e) {
    if (name === "jsforce" || name === "./jsforce") { return jsforce; }
    if (name.substring(0, 2) === "./") {
      var paths = name.substring(2).split("/");
      var p = paths.pop();
      paths.push(p.replace(/(^|\-)([a-zA-Z])/g, function(_0, _1, _2) {
        return _2.toUpperCase();
      }));
      var o = jsforce.modules;
      while (o && paths.length > 0) {
        o = o[paths.shift()];
      }
      return o;
    }
  }
};

module.exports = jsforce;