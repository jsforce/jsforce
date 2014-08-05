/**
 * @file JSforce API root object
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
exports.Connection = require('./connection');
exports.OAuth2 = require('./oauth2');
exports.Date = exports.SfDate = require("./date");
exports.RecordStream = require('./record-stream');

// only available in browser environment
if (typeof window !== 'undefined') {
  exports.browser = require('./browser/client');
}

exports.modules = {}
exports.require = function(name) {
  try {
    return require(name);
  } catch(e) {
    if (name.substring(0, 2) === "./") {
      var paths = name.substring(2).split("/").map(function(p) {
        return p.replace(/(^|\-)([a-zA-Z])/g, function(_0, _1, _2) {
          return _2.toUpperCase()
        })
      });
      var o = exports.modules;
      while (o && paths.length > 0) {
        o = o[paths.shift()]
      }
      return o;
    }
  }
}
