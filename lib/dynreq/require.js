'use strict';

// Listing all required scripts in core module to be used in `jsforce.require`.
// The content is maintained in build script.
//
// START_REQUIRE
require('inherits');
require('util');
require('events');
require('lodash/core');
require('readable-stream');
require('../cache');
require('../connection');
require('../core');
require('../csv');
require('../date');
require('../http-api');
require('../logger');
require('../oauth2');
require('../process');
require('../promise');
require('../query');
require('../quick-action');
require('../record-stream');
require('../record');
require('../soap');
require('../sobject');
require('../soql-builder');
require('../transport');
// END_REQUIRE

var requireCalled;
module.exports = function(name) {
  // prevent recursive require call
  if (requireCalled) { throw new Error("Cannot find module '" + name + "'"); }
  if (name === './jsforce' || name === 'jsforce') {
    return require('../core');
  }
  requireCalled = true;
  try {
    return require(name.indexOf("./") === 0 ? "../" + name.substring(2) : name);
  } finally {
    requireCalled = false;
  }
};
