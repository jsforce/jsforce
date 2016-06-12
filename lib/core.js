/**
 * @file JSforce Core
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

var jsforce = module.exports = new EventEmitter();
jsforce.VERSION = require('./VERSION');
jsforce.Connection = require('./connection');
jsforce.OAuth2 = require('./oauth2');
jsforce.Date = jsforce.SfDate = require("./date");
jsforce.RecordStream = require('./record-stream');
jsforce.Promise = require('./promise');
jsforce.require = require('./require');
