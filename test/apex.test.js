/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var async  = require('async'),
    _      = require('underscore'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("apex", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
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
      conn.apex.post('/JSforceTestApexRest/', params, function(err, id) {
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
      conn.apex.get('/JSforceTestApexRest/' + accountId, function(err, acc) {
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
      conn.apex.put('/JSforceTestApexRest/' + accountId, params, function(err, acc) {
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
      conn.apex.patch('/JSforceTestApexRest/' + accountId, params, function(err, acc) {
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
          conn.apex.delete('/JSforceTestApexRest/' + accountId, cb);
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

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
