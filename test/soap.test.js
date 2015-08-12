/*global describe, it, before, after, __dirname */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _ = require('underscore'),
    sf = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);


/**
 *
 */
describe("soap", function() {

  this.timeout(40000); // set timeout to 40 sec.

  var conn = testEnv.createConnection();

  /**
   *
   */
  before(function(done) {
    this.timeout(600000); // set timeout to 10 min.
    testEnv.establishConnection(conn, done);
  });

/*------------------------------------------------------------------------*/

  /**
   *
   */
  it("should describe tabs", function(done) {
    conn.soap.describeTabs(function(err, apps) {
      if (err) { throw err; }
      assert(apps.length > 0);
      apps.forEach(function(app) {
        assert(_.isString(app.label));
        assert(_.isString(app.logoUrl));
        assert(_.isBoolean(app.selected));
        assert(_.isArray(app.tabs));
        app.tabs.forEach(function(tab) {
          assert(_.isArray(tab.icons));
          assert(_.isBoolean(tab.custom));
          assert(_.isString(tab.name));
          assert(_.isString(tab.label));
          assert(_.isString(tab.url));
          assert(_.isString(tab.miniIconUrl));
          assert(_.isString(tab.sobjectName));
        });
      });
    }.check(done));
  });


  /**
   *
   */
  describe("convert and merge", function() {
    var leadIds, convertedStatus;
    var accountIds = [], contactIds = [], oppIds = [];
    var leads = [{
      FirstName: 'Convert Test #1',
      LastName: 'Lead',
      Company: 'JSforce Test'
    }, {
      FirstName: 'Convert Test #2',
      LastName: 'Lead',
      Company: 'JSforce Test'
    }, {
      FirstName: 'Merge Test (Master)',
      LastName: 'Lead',
      Company: 'JSforce Test'
    }, {
      FirstName: 'Merge Test (Merging #1)',
      LastName: 'Lead',
      Company: 'JSforce Test'
    }, {
      FirstName: 'Merge Test (Merging #2)',
      LastName: 'Lead',
      Company: 'JSforce Test'
    }];

    before(function(done) {
      sf.Promise.all([
        conn.sobject('Lead').create(leads),
        conn.metadata.read('CustomField', 'Lead.Status')
      ]).then(function(rrets) {
        var rets = rrets[0], statusField = rrets[1];
        leadIds = rets.map(function(r){ return r.id; });
        convertedStatus = statusField.picklist.picklistValues
          .filter(function(pv){ return pv.converted === 'true'; })
          .map(function(pv){ return pv.fullName; })[0];
        done();
      })
      .catch(done);
    });

    it("should convert lead", function(done) {
      conn.soap.convertLead({
        leadId: leadIds[0],
        convertedStatus: convertedStatus
      }, function(err, ret) {
        if (err) { throw err; }
        assert(ret.success === true);
        assert(_.isString(ret.accountId));
        assert(_.isString(ret.contactId));
        assert(_.isString(ret.opportunityId));
        accountIds.push(ret.accountId);
        contactIds.push(ret.contactId);
        oppIds.push(ret.opportunityId);
      }.check(done));
    });

    it("should convert lead by specifying accountId and without creating opportunity", function(done) {
      conn.soap.convertLead({
        leadId: leadIds[1],
        accountId: accountIds[0],
        convertedStatus: convertedStatus,
        doNotCreateOpportunity: true
      }, function(err, ret) {
        if (err) { throw err; }
        assert(ret.success === true);
        assert(_.isString(ret.accountId));
        assert(_.isString(ret.contactId));
        assert(_.isNull(ret.opportunityId) || _.isUndefined(ret.OpportunityId));
        contactIds.push(ret.contactId);
      }.check(done));
    });

    it("should merge records", function(done) {
      var masterRecord = _.extend({ type: 'Lead' }, { Id: leadIds[2] }, leads[2]);
      var recordToMergeIds = [ leadIds[3], leadIds[4] ];
      conn.soap.merge({
        masterRecord: masterRecord,
        recordToMergeIds: recordToMergeIds
      }, function(err, ret) {
        if (err) { throw err; }
        assert(ret.success === true);
        assert(ret.id === leadIds[2]);
        assert(ret.mergedRecordIds.length === 2);
        leadIds = leadIds.slice(0, 3);
      }.check(done));
    });

    after(function(done) {
      conn.sobject('Opportunity').destroy(oppIds)
        .then(function() {
          return conn.sobject('Contact').destroy(contactIds);
        })
        .then(function() {
          return conn.sobject('Account').destroy(accountIds);
        })
        .then(function() {
          return conn.sobject('Lead').destroy(leadIds);
        })
        .then(function() { done(); })
        .catch(done);
    });

  });

/*------------------------------------------------------------------------*/

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
