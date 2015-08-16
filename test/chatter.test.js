/*global describe, it, before, after */
var TestEnv = require('./helper/testenv'),
    assert = TestEnv.assert;

var _      = require('underscore'),
    sf     = require('../lib/jsforce'),
    config = require('./config/salesforce');

var testEnv = new TestEnv(config);

/**
 *
 */
describe("chatter", function() {

  this.timeout(20000); // set timeout to 20 sec.

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
  describe("chatter api info", function() {
    it("should get chatter api info", function(done) {
      conn.chatter.resource("/").retrieve(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isString(result.users));
        assert.ok(_.isString(result.groups));
        assert.ok(_.isString(result.feeds));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("users", function() {
    it("should get users list", function(done) {
      conn.chatter.resource("/users").retrieve(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isString(result.currentPageUrl));
        assert.ok(_.isArray(result.users));
        _.forEach(result.users, function(user) {
          assert.ok(_.isString(user.id));
          assert.ok(_.isString(user.url) && user.url[0] === '/');
          assert.ok(_.isString(user.username));
        });
      }.check(done));
    });

    it("should get current user info", function(done) {
      conn.chatter.resource("/users/me").retrieve(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isString(result.id));
        assert.ok(_.isString(result.url) && result.url[0] === '/');
        assert.ok(_.isString(result.username));
      }.check(done));
    });
  });

  /**
   *
   */
  describe("groups", function() {
    it("should get groups list", function(done) {
      conn.chatter.resource("/groups").retrieve(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isString(result.currentPageUrl));
        assert.ok(_.isArray(result.groups));
        _.forEach(result.groups, function(group) {
          assert.ok(_.isString(group.id));
          assert.ok(_.isString(group.url));
          assert.ok(_.isString(group.name));
        });
      }.check(done));
    });
  });

  /**
   *
   */
  describe("feeds", function() {
    var feedElementUrl;

    it("should get feeds list", function(done) {
      conn.chatter.resource("/feeds").retrieve(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isArray(result.feeds));
        assert.ok(_.isArray(result.favorites));
        _.forEach(result.feeds, function(feed) {
          assert.ok(_.isString(feed.label));
          assert.ok(_.isString(feed.feedUrl) && feed.feedUrl[0] === '/');
          assert.ok(_.isString(feed.feedElementsUrl) && feed.feedElementsUrl[0] === '/');
        });
      }.check(done));
    });

    it("should get items from feed items", function(done) {
      conn.chatter.resource("/feeds/company/feed-elements").retrieve(function(err, result) {
        assert.ok(_.isArray(result.elements));
        _.forEach(result.elements, function(element) {
          assert.ok(_.isString(element.id));
          assert.ok(_.isString(element.type));
          assert.ok(_.isString(element.url) && element.url[0] === '/');
          assert.ok(_.isObject(element.body));
          if (element.type === 'TextPost') {
            assert.ok(_.isObject(element.body));
            assert.ok(_.isString(element.body.text));
          } else if (element.type === 'LinkPost') {
            assert.ok(_.isObject(element.capabilities.link));
            assert.ok(_.isString(element.capabilities.link.url));
            assert.ok(_.isString(element.capabilities.link.urlName));
          }
          assert.ok(_.isObject(element.capabilities));
          assert.ok(_.isObject(element.capabilities.comments));
          assert.ok(_.isObject(element.capabilities.comments.page));
          assert.ok(_.isArray(element.capabilities.comments.page.items));
          assert.ok(element.capabilities.comments.page.total >= 0);
          assert.ok(_.isObject(element.capabilities));
          assert.ok(_.isObject(element.capabilities.chatterLikes));
          assert.ok(_.isObject(element.capabilities.chatterLikes.page));
          assert.ok(_.isArray(element.capabilities.chatterLikes.page.items));
          assert.ok(element.capabilities.chatterLikes.page.total >= 0);
          assert.ok(_.isObject(element.actor));
          assert.ok(_.isString(element.actor.id));
          assert.ok(_.isString(element.actor.type));
          assert.ok(_.isString(element.actor.name));
          assert.ok(_.isString(element.actor.url) && element.url[0] === '/');
          assert.ok(_.isObject(element.actor.photo));
          assert.ok(_.isString(element.actor.photo.url));
          assert.ok(_.isString(element.actor.photo.smallPhotoUrl));
          assert.ok(_.isString(element.actor.photo.largePhotoUrl));
        });
      }.check(done));
    });

    it("should create new item", function(done) {
      conn.chatter.resource("/feed-elements").create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'This is new post'
          }]
        },
        feedElementType : "FeedItem",
        subjectId: "me"
      }, function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isString(result.id));
        assert.ok(result.type === 'TextPost');
        assert.ok(_.isString(result.url) && result.url[0] === '/');
        assert.ok(_.isObject(result.body));
        feedElementUrl = result.url;
      }.check(done));
    });

    it("should delete feed item", function(done) {
      conn.chatter.resource(feedElementUrl).delete(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isUndefined(result));
      }.check(done));
    });

  });

  /**
   *
   */
  describe("feed comments", function() {
    var feedElementUrl, commentsUrl;

    before(function(done) {
      conn.chatter.resource("/feed-elements").create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'A new post with comments'
          }],
        },
        feedElementType : "FeedItem",
        subjectId: "me"
      }, function(err, result) {
        if (err) { throw err; }
        feedElementUrl = result.url;
        commentsUrl = result.capabilities.comments.page.currentPageUrl;
      }.check(done));
    });

    it("should create new comment post", function(done) {
      conn.chatter.resource(commentsUrl).create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'This is new comment #1'
          }]
        }
      }, function(err, result) {
        if (err) { throw err; }
      }.check(done));
    });

    after(function(done) {
      conn.chatter.resource(feedElementUrl).delete(function(err, result) {
        if (err) { throw err; }
      }.check(done));
    });

  });


  /**
   *
   */
  describe("feed likes", function() {
    var feedElementUrl, commentUrl, itemLikesUrl, commentLikesUrl;

    before(function(done) {
      conn.chatter.resource("/feed-elements").create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'A new post with likes'
          }]
        },
        feedElementType : "FeedItem",
        subjectId: "me"
      }).then(function(result) {
        feedElementUrl = result.url;
        itemLikesUrl = result.capabilities.chatterLikes.page.currentPageUrl;
        return conn.chatter.resource(result.capabilities.comments.page.currentPageUrl).create({
          body: {
            messageSegments: [{
              type: 'Text',
              text: 'A new comment with likes'
            }]
          }
        });
      }).thenCall(function(err, result) {
        if (err) { throw err; }
        commentUrl = result.url;
        commentLikesUrl = result.likes.currentPageUrl;
      }.check(done));
    });

    var likeUrl;

    it("should add like to item post", function(done) {
      conn.chatter.resource(itemLikesUrl).create("", function(err, result) {
        if (err) { throw err; }
        likeUrl = result.url;
      }.check(done));
    });

    it("should remove like from item post", function(done) {
      conn.chatter.resource(likeUrl).delete(function(err, result) {
        if (err) { throw err; }
      }.check(done));
    });

    it("should add like to comment post", function(done) {
      conn.chatter.resource(commentLikesUrl).create("", function(err, result) {
        if (err) { throw err; }
        likeUrl = result.url;
      }.check(done));
    });

    it("should remove like from comment post", function(done) {
      conn.chatter.resource(likeUrl).delete(function(err, result) {
        if (err) { throw err; }
      }.check(done));
    });

    after(function(done) {
      conn.chatter.resource(feedElementUrl).delete(function(err, result) {
        if (err) { throw err; }
      }.check(done));
    });

  });


  /**
   *
   */
  describe("batch", function() {
    var chatter = conn.chatter;
    var feeds;
    var urls = [];

    before(function(done) {
      chatter.resource('/feeds').retrieve(function(err, result) {
        if (err) { throw err; }
        feeds = result.feeds;
      }.check(done));
    });

    it("should get all feed items", function(done) {
      var resources = _.map(feeds, function(feed) {
        return chatter.resource(feed.feedElementsUrl);
      });
      chatter.batch(resources, function(err, result) {
        if (err) { throw err; }
        assert.ok(result.hasErrors === false);
        assert.ok(_.isArray(result.results) && result.results.length === feeds.length);
        _.forEach(result.results, function(result) {
          var res = result.result;
          assert.ok(_.isString(res.currentPageUrl));
          assert.ok(_.isArray(res.elements));
        });
      }.check(done));
    });

    it("should create new item post and get feed items", function(done) {
      chatter.batch([
        chatter.resource('/feed-elements').create({
          body: {
            messageSegments: [{
              type: 'Text',
              text: 'This is a post text'
            }]
          },
          feedElementType: "FeedItem",
          subjectId: "me"
        }),
        chatter.resource('/feed-elements').create({
          body: {
            messageSegments: [{
              type: 'Text',
              text: 'This is another post text, following to previous.'
            }]
          },
          feedElementType: "FeedItem",
          subjectId: "me"
        }),
        chatter.resource('/feeds/news/me/feed-elements', { pageSize: 2, sort: "CreatedDateDesc" }),
      ], function(err, result) {
        assert.ok(result.hasErrors === false);
        assert.ok(_.isArray(result.results) && result.results.length === 3);
        var elem1 = result.results[0].result;
        var elem2 = result.results[1].result;
        var elems = result.results[2].result;
        urls.push(elem1.url);
        urls.push(elem2.url);
        assert.ok(elems.elements[1].id === elem1.id);
        assert.ok(elems.elements[0].id === elem2.id);
      }.check(done));
    });

    it("should delete all created resources", function(done) {
      if (urls.length > 0) {
        chatter.batch(_.map(urls, function(url) {
          return chatter.resource(url).delete();
        }), function(err, result) {
          if (err) { throw err; }
        }.check(done));
      } else {
        done();
      }
    });

  });

  /**
   *
   */
  after(function(done) {
    testEnv.closeConnection(conn, done);
  });

});
