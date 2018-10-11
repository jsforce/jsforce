import test from './util/ava/ext';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isUndefined } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
test.before('establish connection', async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
test('get chatter api info', async (t) => {
  const result = await conn.chatter.resource('/').retrieve();
  t.true(isString(result.users));
  t.true(isString(result.groups));
  t.true(isString(result.feeds));
});

/**
 *
 */
test.group('users and groups', (test) => {
  /**
   *
   */
  test('get users list', async (t) => {
    const result = await conn.chatter.resource('/users').retrieve();
    t.true(isString(result.currentPageUrl));
    t.true(Array.isArray(result.users));
    for (const user of result.users) {
      t.true(isString(user.id));
      t.true(isString(user.url) && user.url[0] === '/');
      t.true(isString(user.username));
    }
  });

  /**
   *
   */
  test('get current user info', async (t) => {
    const result = await conn.chatter.resource('/users/me').retrieve();
    t.true(isString(result.id));
    t.true(isString(result.url) && result.url[0] === '/');
    t.true(isString(result.username));
  });

  /**
   *
   */
  test('get groups list', async (t) => {
    const result = await conn.chatter.resource('/groups').retrieve();
    t.true(isString(result.currentPageUrl));
    t.true(Array.isArray(result.groups));
    for (const group of result.groups) {
      t.true(isString(group.id));
      t.true(isString(group.url));
      t.true(isString(group.name));
    }
  });
});


/**
 *
 */
test.group('feeds', (test) => {
  /**
   *
   */
  test('get feeds list', async (t) => {
    const result = await conn.chatter.resource('/feeds').retrieve();
    t.true(Array.isArray(result.feeds));
    t.true(Array.isArray(result.favorites));
    for (const feed of result.feeds) {
      t.true(isString(feed.label));
      t.true(isString(feed.feedUrl) && feed.feedUrl[0] === '/');
      t.true(isString(feed.feedElementsUrl) && feed.feedElementsUrl[0] === '/');
    }
  });
});


/**
 *
 */
test.group('feed item', (test) => {
  /**
   *
   */
  test('get items from feed items', async (t) => {
    const result = await conn.chatter.resource('/feeds/company/feed-elements').retrieve();
    t.true(Array.isArray(result.elements));
    for (const element of result.elements) {
      t.true(isString(element.id));
      t.true(isString(element.type));
      t.true(isString(element.url) && element.url[0] === '/');
      t.true(isObject(element.body));
      if (element.type === 'TextPost') {
        t.true(isObject(element.body));
        t.true(isString(element.body.text));
      } else if (element.type === 'LinkPost') {
        t.true(isObject(element.capabilities.link));
        t.true(isString(element.capabilities.link.url));
        t.true(isString(element.capabilities.link.urlName));
      }
      t.true(isObject(element.capabilities));
      t.true(isObject(element.capabilities.comments));
      t.true(isObject(element.capabilities.comments.page));
      t.true(Array.isArray(element.capabilities.comments.page.items));
      t.true(element.capabilities.comments.page.total >= 0);
      t.true(isObject(element.capabilities));
      t.true(isObject(element.capabilities.chatterLikes));
      t.true(isObject(element.capabilities.chatterLikes.page));
      t.true(Array.isArray(element.capabilities.chatterLikes.page.items));
      t.true(element.capabilities.chatterLikes.page.total >= 0);
      t.true(isObject(element.actor));
      t.true(isString(element.actor.id));
      t.true(isString(element.actor.type));
      t.true(isString(element.actor.name));
      t.true(isString(element.actor.url) && element.url[0] === '/');
      t.true(isObject(element.actor.photo));
      t.true(isString(element.actor.photo.url));
      t.true(isString(element.actor.photo.smallPhotoUrl));
      t.true(isString(element.actor.photo.largePhotoUrl));
    }
  });

  let feedElementUrl;

  /**
   *
   */
  test('create new feed item', async (t) => {
    const result = await conn.chatter.resource('/feed-elements').create({
      body: {
        messageSegments: [{
          type: 'Text',
          text: 'This is new post'
        }]
      },
      feedElementType: 'FeedItem',
      subjectId: 'me'
    });
    t.true(isString(result.id));
    t.true(result.type === 'TextPost');
    t.true(isString(result.url) && result.url[0] === '/');
    t.true(isObject(result.body));
    feedElementUrl = result.url;
  });

  /**
   *
   */
  test('delete feed item', async (t) => {
    const result = await conn.chatter.resource(feedElementUrl).delete();
    t.true(isUndefined(result));
  });
});


/**
 *
 */
test.group('feed comment', (test) => {
  let feedElementUrl;
  let commentsUrl;

  /**
   *
   */
  test.before(async () => {
    const result = await conn.chatter.resource('/feed-elements').create({
      body: {
        messageSegments: [{
          type: 'Text',
          text: 'A new post with comments'
        }],
      },
      feedElementType: 'FeedItem',
      subjectId: 'me'
    });
    feedElementUrl = result.url;
    commentsUrl = result.capabilities.comments.page.currentPageUrl;
  });

  /**
   *
   */
  test('create feed comment', async (t) => {
    const ret = await conn.chatter.resource(commentsUrl).create({
      body: {
        messageSegments: [{
          type: 'Text',
          text: 'This is new comment #1'
        }]
      }
    });
    t.true(isObject(ret));
  });

  /**
   *
   */
  test.after(async () => {
    await conn.chatter.resource(feedElementUrl).delete();
  });
});


/**
 *
 */
test.group('like', (test) => {
  let feedElementUrl;
  let itemLikesUrl;
  let commentLikesUrl;

  /**
   *
   */
  test.before(async () => {
    const feedElemResult = await conn.chatter.resource('/feed-elements').create({
      body: {
        messageSegments: [{
          type: 'Text',
          text: 'A new post with likes'
        }]
      },
      feedElementType: 'FeedItem',
      subjectId: 'me'
    });
    feedElementUrl = feedElemResult.url;
    itemLikesUrl = feedElemResult.capabilities.chatterLikes.page.currentPageUrl;
    const commentsUrl = feedElemResult.capabilities.comments.page.currentPageUrl;
    const commentResult = await conn.chatter.resource(commentsUrl).create({
      body: {
        messageSegments: [{
          type: 'Text',
          text: 'A new comment with likes'
        }]
      }
    });
    commentLikesUrl = commentResult.likes.currentPageUrl;
  });


  let itemLikeUrl;

  /**
   *
   */
  test('add like to feed item and return result', async (t) => {
    const result = await conn.chatter.resource(itemLikesUrl).create('');
    t.true(isObject(result));
    t.true(isString(result.url));
    itemLikeUrl = result.url;
  });

  /**
   *
   */
  test('remove like from item post', async (t) => {
    const ret = await conn.chatter.resource(itemLikeUrl).delete();
    t.true(isUndefined(ret));
  });

  let commentLikeUrl;

  /**
   *
   */
  test('add like to comment post and return result', async (t) => {
    const result = await conn.chatter.resource(commentLikesUrl).create('');
    t.true(isObject(result));
    t.true(isString(result.url));
    commentLikeUrl = result.url;
  });

  /**
   *
   */
  test('remove like from comment post', async (t) => {
    const ret = await conn.chatter.resource(commentLikeUrl).delete();
    t.true(isUndefined(ret));
  });

  test.after(async () => {
    await conn.chatter.resource(feedElementUrl).delete();
  });
});


/**
 *
 */
test.group('batch', (test) => {
  let feeds;

  /**
   *
   */
  test.before(async () => {
    const result = await conn.chatter.resource('/feeds').retrieve();
    // Exclude PendingReview feed type, which raise 403 error in feed-elements GET request
    feeds = result.feeds.filter(feed => feed.feedType !== 'PendingReview');
  });

  /**
   *
   */
  test('get all feed items', async (t) => {
    const resources = feeds.map(feed => conn.chatter.resource(feed.feedElementsUrl));
    const ret = await conn.chatter.batch(resources);
    t.true(ret.hasErrors === false);
    t.true(Array.isArray(ret.results) && ret.results.length === feeds.length);
    for (const result of ret.results) {
      const res = result.result;
      t.true(isString(res.currentPageUrl));
      t.true(Array.isArray(res.elements));
    }
  });

  let urls = [];

  /**
   *
   */
  test('create new item post and get feed items', async (t) => {
    const result = await conn.chatter.batch([
      conn.chatter.resource('/feed-elements').create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'This is a post text'
          }]
        },
        feedElementType: 'FeedItem',
        subjectId: 'me'
      }),
      conn.chatter.resource('/feed-elements').create({
        body: {
          messageSegments: [{
            type: 'Text',
            text: 'This is another post text, following to previous.'
          }]
        },
        feedElementType: 'FeedItem',
        subjectId: 'me'
      }),
      conn.chatter.resource('/feeds/news/me/feed-elements', { pageSize: 2, sort: 'CreatedDateDesc' }),
    ]);
    t.true(result.hasErrors === false);
    t.true(Array.isArray(result.results) && result.results.length === 3);
    const elem1 = result.results[0].result;
    const elem2 = result.results[1].result;
    const elems = result.results[2].result;
    urls = [elem1.url, elem2.url];
    t.true(elems.elements[1].id === elem1.id);
    t.true(elems.elements[0].id === elem2.id);
  });

  /**
   *
   */
  test.after('delete all created resources', async () => {
    if (urls && urls.length > 0) {
      await conn.chatter.batch(
        urls.map(url => conn.chatter.resource(url).delete())
      );
    }
  });
});


/**
 *
 */
test.after('close connection', async () => {
  await connMgr.closeConnection(conn);
});
