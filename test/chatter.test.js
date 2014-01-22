/*global describe, it, before, after */
var assert = require('power-assert'),
    _      = require('underscore'),
    sf     = require('../lib/salesforce'),
    config = require('./config/salesforce');

/**
 *
 */
describe("chatter", function() {

  this.timeout(20000); // set timeout to 20 sec.

  var conn = new sf.Connection({ logLevel : config.logLevel });

  /**
   *
   */
  before(function(done) {
    conn.login(config.username, config.password, function(err) {
      if (err) { return done(err); }
      if (!conn.accessToken) { done(new Error("No access token. Invalid login.")); }
    }.check(done));
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
    var feedItemUrl;

    it("should get feeds list", function(done) {
      conn.chatter.resource("/feeds").retrieve(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isArray(result.feeds));
        assert.ok(_.isArray(result.favorites));
        _.forEach(result.feeds, function(feed) {
          assert.ok(_.isString(feed.label));
          assert.ok(_.isString(feed.feedUrl) && feed.feedUrl[0] === '/');
          assert.ok(_.isString(feed.feedItemsUrl) && feed.feedItemsUrl[0] === '/');
        });
      }.check(done));
    });

    it("should get items from feed items", function(done) {
      conn.chatter.resource("/feeds/company/feed-items").retrieve(function(err, result) {
        assert.ok(_.isArray(result.items));
        _.forEach(result.items, function(item) {
          assert.ok(_.isString(item.id));
          assert.ok(_.isString(item.type));
          assert.ok(_.isString(item.url) && item.url[0] === '/');
          assert.ok(_.isObject(item.body));
          if (item.type === 'TextPost') {
            assert.ok(_.isObject(item.body));
            assert.ok(_.isString(item.body.text));
          } else if (item.type === 'LinkPost') {
            assert.ok(_.isObject(item.attachment));
            assert.ok(_.isString(item.attachment.url));
          }
          assert.ok(_.isObject(item.comments));
          assert.ok(item.comments.total >= 0);
          assert.ok(_.isObject(item.likes));
          assert.ok(item.likes.total >= 0);
          assert.ok(_.isObject(item.actor));
          assert.ok(_.isString(item.actor.id));
          assert.ok(_.isString(item.actor.type));
          assert.ok(_.isString(item.actor.name));
          assert.ok(_.isString(item.actor.url) && item.url[0] === '/');
          assert.ok(_.isObject(item.actor.photo));
          assert.ok(_.isString(item.actor.photo.url));
          assert.ok(_.isString(item.actor.photo.smallPhotoUrl));
          assert.ok(_.isString(item.actor.photo.largePhotoUrl));
        });
      }.check(done));
    });

    it("should create new item", function(done) {
      conn.chatter.resource("/feeds/news/me/feed-items").create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'This is new post'
          }]
        }
      }, function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isString(result.id));
        assert.ok(result.type === 'TextPost');
        assert.ok(_.isString(result.url) && result.url[0] === '/');
        assert.ok(_.isObject(result.body));
        feedItemUrl = result.url;
      }.check(done));
    });

    it("should delete feed item", function(done) {
      conn.chatter.resource(feedItemUrl).delete(function(err, result) {
        if (err) { throw err; }
        assert.ok(_.isUndefined(result));
      }.check(done));
    });

  });

  /**
   *
   */
  describe("feed comments", function() {
    var feedItemUrl, commentsUrl;

    before(function(done) {
      conn.chatter.resource("/feeds/news/me/feed-items").create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'A new post with comments'
          }]
        }
      }, function(err, result) {
        if (err) { throw err; }
        feedItemUrl = result.url;
        commentsUrl = result.comments.currentPageUrl;
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
      conn.chatter.resource(feedItemUrl).delete(function(err, result) {
        if (err) { throw err; }
      }.check(done));
    });

  });


  /**
   *
   */
  describe("feed likes", function() {
    var feedItemUrl, commentUrl, itemLikesUrl, commentLikesUrl;

    before(function(done) {
      conn.chatter.resource("/feeds/news/me/feed-items").create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'A new post with likes'
          }]
        }
      }).then(function(result) {
        feedItemUrl = result.url;
        itemLikesUrl = result.likes.currentPageUrl;
        return conn.chatter.resource(result.comments.currentPageUrl).create({
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
      conn.chatter.resource(itemLikesUrl).create(null, function(err, result) {
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
      conn.chatter.resource(commentLikesUrl).create(null, function(err, result) {
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
      conn.chatter.resource(feedItemUrl).delete(function(err, result) {
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
        return chatter.resource(feed.feedItemsUrl);
      });
      chatter.batch(resources, function(err, result) {
        if (err) { throw err; }
        assert.ok(result.hasErrors === false);
        assert.ok(_.isArray(result.results) && result.results.length === feeds.length);
        _.forEach(result.results, function(result) {
          var res = result.result;
          assert.ok(_.isString(res.currentPageUrl));
          assert.ok(_.isArray(res.items));
        });
      }.check(done));
    });

    it("should create new item post and get feed items", function(done) {
      chatter.batch([
        chatter.resource('/feeds/news/me/feed-items').create({
          body: {
            messageSegments: [{
              type: 'Text',
              text: 'This is a post text'
            }]
          }
        }),
        chatter.resource('/feeds/news/me/feed-items').create({
          body: {
            messageSegments: [{
              type: 'Text',
              text: 'This is another post text, following to previous.'
            }]
          }
        }),
        chatter.resource('/feeds/news/me/feed-items', { pageSize: 2, sort: "CreatedDateDesc" }),
      ], function(err, result) {
        assert.ok(result.hasErrors === false);
        assert.ok(_.isArray(result.results) && result.results.length === 3);
        var item1 = result.results[0].result;
        var item2 = result.results[1].result;
        var items = result.results[2].result;
        urls.push(item1.url);
        urls.push(item2.url);
        assert.ok(items.items[1].id === item1.id);
        assert.ok(items.items[0].id === item2.id);
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

});
