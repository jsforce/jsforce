/*global describe, it, before */
var assert = require('power-assert'),
    async  = require('async'),
    _      = require('underscore'),
    fs     = require('fs'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

var conn = new sf.Connection({ logLevel : config.logLevel });

describe("tooling", function() {

  this.timeout(20000);

  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { return done(err); }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
      done();
    });
  });

  /**
   *
   */
  describe("execute anonymous apex", function() {
    it("should execute successfully", function(done) {
      var body = [
        "System.debug('Hello, World');"
      ].join('\n');
      conn.tooling.executeAnonymous(body, function(err, res) {
        if (err) { return done(err); }
        assert.ok(res.compiled === true);
        assert.ok(res.success === true);
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get completions", function() {
    it("should return completions", function(done) {
      conn.tooling.completions("apex", function(err, res) {
        if (err) { return done(err); }
        assert.ok(_.isObject(res));
        assert.ok(_.isObject(res.publicDeclarations));
      }.check(done));
    });
  });

});
