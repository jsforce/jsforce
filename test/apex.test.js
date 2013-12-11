/*global describe, it, before */
var assert = require('power-assert'),
    async  = require('async'),
    _      = require('underscore'),
    fs     = require('fs'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

/**
 *
 */
describe("apex", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { throw err; }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
      done();
    });
  });

  var accountId;

  /**
   *
   */
  describe("post account info", function() {
    it("should return created account id", function(done) {
      var params = {
        name: 'My Apex Rest Test #1',
        phone: '654-321-0000',
        website: 'http://www.google.com'
      };
      conn.apex.post('/MyApexRestTest/', params, function(err, id) {
        if (err) { throw err; }
        assert.ok(_.isString(id));
        accountId = id;
      }.check(done));
    });
  });

  /**
   *
   */
  describe("get account info", function() {
    it("should return updated account", function(done) {
      conn.apex.get('/MyApexRestTest/' + accountId, function(err, acc) {
        if (err) { throw err; }
        assert.ok(_.isObject(acc));
        assert.ok(acc.Name ==='My Apex Rest Test #1');
        assert.ok(acc.Phone === '654-321-0000');
        assert.ok(acc.Website === 'http://www.google.com');
      }.check(done));
    });
  });

  /**
   *
   */
  describe("put account info", function() {
    it("should return updated account", function(done) {
      var params = {
        account: {
          Name : 'My Apex Rest Test #1 (put)',
          Phone : null
        }
      };
      conn.apex.put('/MyApexRestTest/' + accountId, params, function(err, acc) {
        if (err) { throw err; }
        assert.ok(_.isObject(acc));
        assert.ok(acc.Name === 'My Apex Rest Test #1 (put)');
        assert.ok(_.isUndefined(acc.Phone));
        assert.ok(acc.Website === 'http://www.google.com');
      }.check(done));
    });
  });

  /**
   *
   */
  describe("patch account info", function() {
    it("should return updated account", function(done) {
      var params = {
        name: 'My Apex Rest Test #1 (patch)'
      };
      conn.apex.patch('/MyApexRestTest/' + accountId, params, function(err, acc) {
        if (err) { throw err; }
        assert.ok(_.isObject(acc));
        assert.ok(acc.Name === 'My Apex Rest Test #1 (patch)');
        assert.ok(_.isUndefined(acc.Phone));
        assert.ok(acc.Website === 'http://www.google.com');
      }.check(done));
    });
  });

  /**
   *
   */
  describe("delete account info", function() {
    it("should not get any account for delete account id", function(done) {
      async.waterfall([
        function(cb) {
          conn.apex.delete('/MyApexRestTest/' + accountId, cb);
        },
        function(ret, cb) {
          conn.sobject('Account').find({ Id: accountId }, cb);
        }
      ], function(err, records) {
        if (err) { throw err; }
        assert.ok(records.length === 0);
      }.check(done));
    });
  });

});
