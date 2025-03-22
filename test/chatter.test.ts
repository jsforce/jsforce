import assert from 'assert';
import ConnectionManager from './helper/connection-manager';
import config from './config';
import { isObject, isString, isUndefined } from './util';

const connMgr = new ConnectionManager(config);
const conn = connMgr.createConnection();

/**
 *
 */
beforeAll(async () => {
  await connMgr.establishConnection(conn);
});

/**
 *
 */
it('should get chatter api info', async () => {
  const result = await conn.chatter.resource('/').retrieve<any>();
  assert.ok(isString(result.users));
  assert.ok(isString(result.groups));
  assert.ok(isString(result.feeds));
});

/**
 *
 */
describe('users and groups', () => {
  /**
   *
   */
  it('should get users list', async () => {
    const result = await conn.chatter.resource('/users').retrieve<any>();
    assert.ok(isString(result.currentPageUrl));
    assert.ok(Array.isArray(result.users));
    for (const user of result.users) {
      assert.ok(isString(user.id));
      assert.ok(isString(user.url) && user.url[0] === '/');
      assert.ok(isString(user.username));
    }
  });

  /**
   *
   */
  it('should get current user info', async () => {
    const result = await conn.chatter.resource('/users/me').retrieve<any>();
    assert.ok(isString(result.id));
    assert.ok(isString(result.url) && result.url[0] === '/');
    assert.ok(isString(result.username));
  });

  /**
   *
   */
  it('should get groups list', async () => {
    const result = await conn.chatter.resource('/groups').retrieve<any>();
    assert.ok(isString(result.currentPageUrl));
    assert.ok(Array.isArray(result.groups));
    for (const group of result.groups) {
      assert.ok(isString(group.id));
      assert.ok(isString(group.url));
      assert.ok(isString(group.name));
    }
  });
});

/**
 *
 */
describe('feeds', () => {
  /**
   *
   */
  it('should get feeds list', async () => {
    const result = await conn.chatter.resource('/feeds').retrieve<any>();
    assert.ok(Array.isArray(result.feeds));
    assert.ok(Array.isArray(result.favorites));
    for (const feed of result.feeds) {
      assert.ok(isString(feed.label));
      assert.ok(isString(feed.feedUrl) && feed.feedUrl[0] === '/');
      assert.ok(
        isString(feed.feedElementsUrl) && feed.feedElementsUrl[0] === '/',
      );
    }
  });
});

/**
 *
 */
describe('feed item', () => {
  /**
   *
   */
  it('should get items from feed items', async () => {
    const result = await conn.chatter
      .resource('/feeds/company/feed-elements')
      .retrieve<any>();
    assert.ok(Array.isArray(result.elements));
    for (const element of result.elements) {
      assert.ok(isString(element.id));
      assert.ok(isString(element.type));
      assert.ok(isString(element.url) && element.url[0] === '/');
      assert.ok(isObject(element.body));
      if (element.type === 'TextPost') {
        assert.ok(isObject(element.body));
        assert.ok(isString(element.body.text));
      } else if (element.type === 'LinkPost') {
        assert.ok(isObject(element.capabilities.link));
        assert.ok(isString(element.capabilities.link.url));
        assert.ok(isString(element.capabilities.link.urlName));
      }
      assert.ok(isObject(element.capabilities));
      assert.ok(isObject(element.capabilities.comments));
      assert.ok(isObject(element.capabilities.comments.page));
      assert.ok(Array.isArray(element.capabilities.comments.page.items));
      assert.ok(element.capabilities.comments.page.total >= 0);
      assert.ok(isObject(element.capabilities));
      assert.ok(isObject(element.capabilities.chatterLikes));
      assert.ok(isObject(element.capabilities.chatterLikes.page));
      assert.ok(Array.isArray(element.capabilities.chatterLikes.page.items));
      assert.ok(element.capabilities.chatterLikes.page.total >= 0);
      assert.ok(isObject(element.actor));
      assert.ok(isString(element.actor.id));
      assert.ok(isString(element.actor.type));
      assert.ok(isString(element.actor.name));
      assert.ok(isString(element.actor.url) && element.url[0] === '/');
      assert.ok(isObject(element.actor.photo));
      assert.ok(isString(element.actor.photo.url));
      assert.ok(isString(element.actor.photo.smallPhotoUrl));
      assert.ok(isString(element.actor.photo.largePhotoUrl));
    }
  });

  let feedElementUrl: string;

  /**
   *
   */
  it('should create new feed item', async () => {
    const result = await conn.chatter.resource('/feed-elements').create({
      body: {
        messageSegments: [
          {
            type: 'Text',
            text: 'This is new post',
          },
        ],
      },
      feedElementType: 'FeedItem',
      subjectId: 'me',
    });
    assert.ok(isString(result.id));
    assert.ok(result.type === 'TextPost');
    assert.ok(isString(result.url) && result.url[0] === '/');
    assert.ok(isObject(result.body));
    feedElementUrl = result.url;
  });

  /**
   *
   */
  it('should delete feed item', async () => {
    const result = await conn.chatter.resource(feedElementUrl).delete();
    assert.ok(isUndefined(result));
  });
});

/**
 *
 */
describe('feed comment', () => {
  let feedElementUrl: string;
  let commentsUrl: string;

  /**
   *
   */
  beforeAll(async () => {
    const result = await conn.chatter.resource('/feed-elements').create({
      body: {
        messageSegments: [
          {
            type: 'Text',
            text: 'A new post with comments',
          },
        ],
      },
      feedElementType: 'FeedItem',
      subjectId: 'me',
    });
    feedElementUrl = result.url;
    commentsUrl = result.capabilities.comments.page.currentPageUrl;
  });

  /**
   *
   */
  it('should create feed comment', async () => {
    const ret = await conn.chatter.resource(commentsUrl).create({
      body: {
        messageSegments: [
          {
            type: 'Text',
            text: 'This is new comment #1',
          },
        ],
      },
    });
    assert.ok(isObject(ret));
  });

  /**
   *
   */
  afterAll(async () => {
    await conn.chatter.resource(feedElementUrl).delete();
  });
});

/**
 *
 */
describe('like', () => {
  let feedElementUrl: string;
  let itemLikesUrl: string;
  let commentLikesUrl: string;

  /**
   *
   */
  beforeAll(async () => {
    const feedElemResult = await conn.chatter
      .resource('/feed-elements')
      .create({
        body: {
          messageSegments: [
            {
              type: 'Text',
              text: 'A new post with likes',
            },
          ],
        },
        feedElementType: 'FeedItem',
        subjectId: 'me',
      });
    feedElementUrl = feedElemResult.url;
    itemLikesUrl = feedElemResult.capabilities.chatterLikes.page.currentPageUrl;
    const commentsUrl =
      feedElemResult.capabilities.comments.page.currentPageUrl;
    const commentResult = await conn.chatter.resource(commentsUrl).create({
      body: {
        messageSegments: [
          {
            type: 'Text',
            text: 'A new comment with likes',
          },
        ],
      },
    });
    commentLikesUrl = commentResult.likes.currentPageUrl;
  });

  let itemLikeUrl: string;

  /**
   *
   */
  it('should add like to feed item and return result', async () => {
    const result = await conn.chatter.resource(itemLikesUrl).create('');
    assert.ok(isObject(result));
    assert.ok(isString(result.url));
    itemLikeUrl = result.url;
  });

  /**
   *
   */
  it('should remove like from item post', async () => {
    const ret = await conn.chatter.resource(itemLikeUrl).delete();
    assert.ok(isUndefined(ret));
  });

  let commentLikeUrl: string;

  /**
   *
   */
  it('should add like to comment post and return result', async () => {
    const result = await conn.chatter.resource(commentLikesUrl).create('');
    assert.ok(isObject(result));
    assert.ok(isString(result.url));
    commentLikeUrl = result.url;
  });

  /**
   *
   */
  it('should remove like from comment post', async () => {
    const ret = await conn.chatter.resource(commentLikeUrl).delete();
    assert.ok(isUndefined(ret));
  });

  afterAll(async () => {
    await conn.chatter.resource(feedElementUrl).delete();
  });
});

/**
 *
 */
describe('batch', () => {
  let feeds: any[]; // TODO: add typing

  /**
   *
   */
  beforeAll(async () => {
    const result = await conn.chatter.resource('/feeds').retrieve<any>();
    // Exclude PendingReview feed type, which raise 403 error in feed-elements GET request
    feeds = result.feeds.filter(
      (feed: any) => feed.feedType !== 'PendingReview',
    );
  });

  /**
   *
   */
  it('should get all feed items', async () => {
    const resources = feeds.map((feed) =>
      conn.chatter.resource<any>(feed.feedElementsUrl),
    );
    const ret = await conn.chatter.batch(resources);
    assert.ok(ret.hasErrors === false);
    assert.ok(
      Array.isArray(ret.results) && ret.results.length === feeds.length,
    );
    for (const result of ret.results) {
      const res = result.result;
      assert.ok(isString(res.currentPageUrl));
      assert.ok(Array.isArray(res.elements));
    }
  });

  let urls: string[] = [];

  /**
   *
   */
  it('should create new item post and get feed items', async () => {
    const result = await conn.chatter.batch([
      conn.chatter.resource('/feed-elements').create({
        body: {
          messageSegments: [
            {
              type: 'Text',
              text: 'This is a post text',
            },
          ],
        },
        feedElementType: 'FeedItem',
        subjectId: 'me',
      }),
      conn.chatter.resource('/feed-elements').create({
        body: {
          messageSegments: [
            {
              type: 'Text',
              text: 'This is another post text, following to previous.',
            },
          ],
        },
        feedElementType: 'FeedItem',
        subjectId: 'me',
      }),
      conn.chatter.resource('/feeds/news/me/feed-elements', {
        pageSize: 2,
        sort: 'CreatedDateDesc',
      }),
    ]);
    assert.ok(result.hasErrors === false);
    assert.ok(Array.isArray(result.results) && result.results.length === 3);

    const elemsIndex = result.results.findIndex(
      (res) => res.statusCode === 200,
    );

    // get feed elements response and remove it from the results array
    const elems = result.results.splice(elemsIndex, 1)[0].result;

    const [el1, el2] = result.results;
    const elemIDs = [el1.result.id, el2.result.id];

    urls = [el1.result.url, el2.result.url];

    // don't rely on order of elements, just find the ID in the payload
    for (const id of elemIDs) {
      assert.ok(elems.elements.find((el: { id: string }) => el.id === id));
    }
  });

  /**
   *
   */
  afterAll(async () => {
    if (urls && urls.length > 0) {
      await conn.chatter.batch(
        urls.map((url) => conn.chatter.resource(url).delete()),
      );
    }
  });
});
