/**
 * @file JSforce API root object
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var pkg = require('../package.json');
exports.VERSION = pkg.version;
exports.Connection = require('./connection');
exports.OAuth2 = require('./oauth2');
exports.Date = exports.SfDate = require("./date");
exports.RecordStream = require('./record-stream');
exports.Promise = require('./promise');

var FileRegistry = require('./registry/file-registry');
exports.registry = new FileRegistry();
