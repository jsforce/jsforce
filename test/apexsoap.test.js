/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("apexsoap", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
  });

  /**
   *
   */
  describe("run tests synchronous", function() {
    it("should execute one unit test and run successfully", function(done) {
      var params = {
        allTests: false,
        classes: [
          'JSforceTestUnitTest'
        ]
      };
      conn.apexsoap.runTests(params, function(err, results) {
        if (err) { throw err; }
        assert.ok(0 === results.numFailures);
        assert.ok(1 === results.numTestsRun);
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
