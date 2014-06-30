/*global describe, it, before */
var testUtils = require('./helper/test-utils'),
    assert = testUtils.assert;

var _      = require('underscore'),
    fs     = require('fs'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

/**
 *
 */
describe("tooling", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new testUtils.createConnection(config);

  /**
   *
   */
  before(function(done) {
    testUtils.establishConnection(conn, config, done);
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
        if (err) { throw err; }
        assert.ok(res.compiled === true);
        assert.ok(res.success === true);
      }.check(done));
    });
  });

  /**
   *
   */
  /**
   * exclude this test till Tooling API service can correctly handle without content-type request header
   *
  describe("get completions", function() {
    this.timeout(40000); // set timeout to 40 sec, because it tends to be long-time query

    it("should return completions", function(done) {
      conn.tooling.completions("apex", function(err, res) {
        if (err) { throw err; }
        assert.ok(_.isObject(res));
        assert.ok(_.isObject(res.publicDeclarations));
      }.check(done));
    });
  });
   */

});
