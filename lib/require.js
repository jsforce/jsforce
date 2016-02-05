'use strict';

// START_REQUIRE
require('inherits');
require('util');
require('events');
require('lodash/core');
require('readable-stream');
require('./cache');
require('./connection');
require('./core');
require('./csv');
require('./date');
require('./http-api');
require('./logger');
require('./oauth2');
require('./process');
require('./promise');
require('./query');
require('./quick-action');
require('./record-stream');
require('./record');
require('./soap');
require('./sobject');
require('./soql-builder');
require('./transport');
// END_REQUIRE

var requireCalled;
module.exports = function(name) {
  // prevent recursive require call
  if (requireCalled) { throw new Error("Cannot find module '" + name + "'"); }
  requireCalled = true;
  try {
    return require(name);
  } finally {
    requireCalled = false;
  }
};
