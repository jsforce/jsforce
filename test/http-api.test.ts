import { HttpApi } from '../src/http-api';
import { SOAP } from '../src/soap';
import { Connection } from '../src/connection';
import { HttpRequest } from '../src/types';
import { Transport } from '../src/transport';
import assert from 'assert';
import xml2js from 'xml2js';
import {MockAgent, setGlobalDispatcher, getGlobalDispatcher, Dispatcher, errors} from 'undici';
import { HttpRequestOptions, HttpResponse } from '../src/types/common';

const loginUrl = 'https://heaven-party-2429-dev-ed.scratch.my.salesforce.com';

let mockAgent: MockAgent;
let originalDispatcher: Dispatcher;

beforeEach(() => {
  originalDispatcher = getGlobalDispatcher();
  mockAgent = new MockAgent();
  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);
});

afterEach(async () => {
  setGlobalDispatcher(originalDispatcher);
  await mockAgent.close();
});

describe('HTTP API', () => {
  const accessToken = '1234';

  const conn = new Connection({
    accessToken,
    loginUrl,
  });

  describe('network retry', () => {
    async function fetch(req: HttpRequest, httpOpts?: HttpRequestOptions) {
      let retryCounter = 0;
      const transport = new Transport();

      const requestPromise = transport.httpRequest(req, httpOpts ?? {});
      const stream = requestPromise.stream();

      stream.on('retry', () => {
        retryCounter++;
      });

      let res: HttpResponse;
      try {
        res = await requestPromise;
      } catch (err) {
        return { res: {}, retryCounter, err };
      }
      return { res, retryCounter };
    }

    it('returns response after retry limit is reached', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(429, JSON.stringify({
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: 'Invalid AiEvaluation identifier'
      })).times(4);

      const { retryCounter,res } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      }, {
          retry: {
            maxRetries: 3
          }
        });
      assert.ok('body' in res)
      assert.equal(res.body, '{"errorCode":"INTERNAL_SERVER_ERROR","message":"Invalid AiEvaluation identifier"}')
      assert.ok(retryCounter === 3);
    })

    it('retries on specified status code', async () => {
      const attempts = 2;
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(429).times(attempts);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200, JSON.stringify({ success: true }));

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(retryCounter === attempts);
    });

    it('does not retry on unsupported status codes', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v60.0', method: 'GET' }).reply(404);

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v60.0`,
      });
      assert.ok(retryCounter === 0);
    });

    it('retries on socket error until it succeeds', async () => {
      const attempts = 2;
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).replyWithError(Object.assign(new Error('ECONNRESET'), {code: 'ECONNRESET'})).times(attempts);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200, JSON.stringify({ success: true }));

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(retryCounter === attempts);
    });

    it('stops retries after max is reached', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).replyWithError(Object.assign(new Error('ECONNRESET'), {code: 'ECONNRESET'})).times(6);

      const { retryCounter, err } = await fetch(
        {
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0`,
        },
        {
          retry: {
            maxRetries: 5,
          },
        },
      );
      assert.ok(retryCounter === 5);
      assert.ok(err instanceof Error);
    });

    it('retries only on specified methods', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/limits', method: 'GET' }).replyWithError(new Error('ECONNRESET'));

      const { retryCounter } = await fetch(
        {
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0/limits`,
        },
        {
          retry: {
            methods: ['DELETE'],
          },
        },
      );
      assert.ok(retryCounter === 0);
    });

    it('retries only on specified errors', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/limits', method: 'GET' }).replyWithError(new Error('ECONNRESET'));

      const { retryCounter } = await fetch(
        {
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0/limits`,
        },
        {
          retry: {
            errorCodes: ['ECONNREFUSED'],
          },
        },
      );
      assert.ok(retryCounter === 0);
    });

    it('does not retry on unsupported errors', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/limits', method: 'GET' }).replyWithError(new Error('UNKNOWN_ERROR'));

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0/limits`,
      });
      assert.ok(retryCounter === 0);
    });

    it('should retry only 2 times on 420 response', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(420, JSON.stringify({ error: "We've hit a snag" })).times(3);

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(retryCounter === 2);
    });

    it('does not retry on unsupported methods', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'POST' }).replyWithError(new Error('ECONNRESET'));

      const { retryCounter } = await fetch({
        method: 'POST',
        url: `${loginUrl}/services/data/v59.0`,
        body: 'body',
      });

      assert.ok(retryCounter === 0);
    });

    it('does not retry cancelled requests', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v60.0', method: 'GET' }).reply(200, JSON.stringify({ success: true })).delay(5000);

      const { retryCounter } = await fetch(
        {
          method: 'GET',
          url: `${loginUrl}/services/data/v60.0`,
        },
        {
          timeout: 1,
        },
      );
      assert.ok(retryCounter === 0);
    });

    it('throws after 5 seconds timeout', async () => {
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200, JSON.stringify({ success: true })).delay(7000);

      const { err } = await fetch(
        {
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0`,
        },
        {
          timeout: 5000,
        },
      );

      assert.ok(err instanceof DOMException);
      assert.ok(err.name === 'AbortError' || err.message.includes('aborted'));
    });
  });

  describe('headers', () => {
    it('sets `Authorization` header', async () => {
      let testPassed = false;

      const httpApi = new HttpApi(conn, {});

      httpApi.on('request', (req: HttpRequest) => {
        assert.ok(req?.headers?.['Authorization'] === `Bearer ${accessToken}`);
        testPassed = true;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200, JSON.stringify({}));

      await httpApi.request({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(testPassed);
    });

    it('sets `Call Options` header', async () => {
      const conn = new Connection({
        accessToken,
        loginUrl,
        callOptions: {
          client: 'caseSensitiveToken',
          defaultNamespace: 'battle',
        },
      });

      const httpApi = new HttpApi(conn, {});

      let testPassed = false;

      httpApi.on('request', (req: HttpRequest) => {
        assert.equal(
          req?.headers?.['Sforce-Call-Options'],
          'client=caseSensitiveToken, defaultNamespace=battle',
        );
        testPassed = true;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200, JSON.stringify({}));

      await httpApi.request({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(testPassed);
    });

    it('sets `Content-Length` header', async () => {
      let testPassed = false;

      const httpApi = new HttpApi(conn, {});

      httpApi.on('request', (req: HttpRequest) => {
        assert.equal(req?.headers?.['content-length'], '19');
        testPassed = true;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/sobjects/Account', method: 'POST' }).reply(200, JSON.stringify({}));

      await httpApi.request({
        method: 'POST',
        body: JSON.stringify({
          Name: 'John Doe',
        }),
        url: `${loginUrl}/services/data/v59.0/sobjects/Account`,
      });
      assert.ok(testPassed);
    });

    it('does not set `Content-Length` when `Transfer-Encoding` header is set', async () => {
      let testPassed = false;

      const httpApi = new HttpApi(conn, {});

      httpApi.on('request', (req: HttpRequest) => {
        assert.equal(req?.headers?.['content-length'], undefined);
        testPassed = true;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/sobjects/Account', method: 'POST' }).reply(200, JSON.stringify({}));

      await httpApi.request({
        method: 'POST',
        headers: {
          'transfer-encoding': 'chunked',
        },
        body: JSON.stringify({
          Name: 'John Doe',
        }),
        url: `${loginUrl}/services/data/v59.0/sobjects/Account`,
      });
      assert.ok(testPassed);
    });
  });

  describe('session refresh', () => {
    it('refreshes expired session', async () => {
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          setTimeout(() => callback(null, 'refreshed_token' ?? undefined), 200);
        },
      });

      const httpApi = new HttpApi(conn, {});

      let testPassed = false;
      let firstRoundTrip = true;

      httpApi.on('request', (req: HttpRequest) => {
        if (firstRoundTrip) {
          assert.equal(req?.headers?.['Authorization'], 'Bearer invalid_token');
          firstRoundTrip = false;
        } else {
          assert.equal(
            req?.headers?.['Authorization'],
            'Bearer refreshed_token',
          );
          testPassed = true;
        }
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200);

      await httpApi.request({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(testPassed);
    });

    it('does not refresh session when response contains "This session is not valid for use with the REST API"', async () => {
      let refreshCalled = false;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCalled = true;
          setTimeout(() => callback(null, 'refreshed_token' ?? undefined), 200);
        },
      });

      const httpApi = new HttpApi(conn, {});

      let requestCount = 0;
      httpApi.on('request', (req: HttpRequest) => {
        requestCount++;
        assert.equal(req?.headers?.['Authorization'], 'Bearer invalid_token');
      });

      const errorBody = JSON.stringify({
        errorCode: 'INVALID_SESSION_ID',
        message: 'This session is not valid for use with the REST API',
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401, errorBody, {
        headers: { 'content-type': 'application/json' },
      });

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'GET',
            url: `${loginUrl}/services/data/v59.0`,
          });
        },
        {
          errorCode: 'INVALID_SESSION_ID',
        },
      );

      assert.ok(!refreshCalled, 'Refresh function should not be called');
      assert.equal(requestCount, 1, 'Should only make one request');
    });

    it('does not refresh session when response contains "BlackTab users cannot perform API operations"', async () => {
      let refreshCalled = false;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCalled = true;
          setTimeout(() => callback(null, 'refreshed_token' ?? undefined), 200);
        },
      });

      const httpApi = new HttpApi(conn, {});

      let requestCount = 0;
      httpApi.on('request', (req: HttpRequest) => {
        requestCount++;
        assert.equal(req?.headers?.['Authorization'], 'Bearer invalid_token');
      });

      const errorBody = JSON.stringify([
        {
          errorCode: 'INVALID_SESSION_ID',
          message: 'BlackTab users cannot perform API operations',
        },
      ]);

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401, errorBody, {
        headers: { 'content-type': 'application/json' },
      });

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'GET',
            url: `${loginUrl}/services/data/v59.0`,
          });
        },
        {
          message: 'BlackTab users cannot perform API operations',
          errorCode: 'INVALID_SESSION_ID',
        },
      );

      assert.ok(!refreshCalled, 'Refresh function should not be called');
      assert.equal(requestCount, 1, 'Should only make one request');
    });

    it('honors _maxSessionRefreshRetries = 0 (no refresh)', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          callback(null, `refreshed_token_${refreshCount}`);
        },
      });
      conn._maxSessionRefreshRetries = 0;

      const httpApi = new HttpApi(conn, {});

      let requestCount = 0;
      httpApi.on('request', () => {
        requestCount++;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401);

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'GET',
            url: `${loginUrl}/services/data/v59.0`,
          });
        },
        {
          errorCode: 'ERROR_HTTP_401',
        },
      );

      assert.equal(requestCount, 1);
      assert.equal(refreshCount, 0);
    });

    it('gives up after a bounded number of refresh attempts when session stays expired', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          // Refresh always "succeeds", but the server keeps rejecting the new token.
          callback(null, `refreshed_token_${refreshCount}`);
        },
      });

      const httpApi = new HttpApi(conn, {});

      let requestCount = 0;
      httpApi.on('request', () => {
        requestCount++;
      });

      const pool = mockAgent.get(loginUrl);
      pool
        .intercept({ path: '/services/data/v59.0', method: 'GET' })
        .reply(401)
        .persist();

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'GET',
            url: `${loginUrl}/services/data/v59.0`,
          });
        },
        {
          errorCode: 'ERROR_HTTP_401',
        },
      );

      // 1 initial request + 3 retries after refresh = 4; 3 refresh attempts.
      // Pinning exact numbers (not just "< 10") so a future change to the cap
      // or an accidental removal of the guard is caught precisely.
      assert.equal(
        requestCount,
        4,
        `Expected exactly 4 requests (1 initial + MAX_SESSION_REFRESH_RETRIES), got ${requestCount}`,
      );
      assert.equal(
        refreshCount,
        3,
        `Expected exactly 3 refresh attempts, got ${refreshCount}`,
      );
    });

    it('does not give up early if the session recovers within the retry budget', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          callback(null, `refreshed_token_${refreshCount}`);
        },
      });

      const httpApi = new HttpApi(conn, {});

      let requestCount = 0;
      httpApi.on('request', () => {
        requestCount++;
      });

      const pool = mockAgent.get(loginUrl);
      // Fails on the initial request and the first retry, succeeds on the second retry
      // (3rd request overall) -- well within MAX_SESSION_REFRESH_RETRIES.
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200, JSON.stringify({}));

      const result = await httpApi.request({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });

      assert.equal(result, '{}');
      assert.equal(requestCount, 3);
      assert.equal(refreshCount, 2);
    });

    it('succeeds when recovery happens on the very last allowed retry', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          callback(null, `refreshed_token_${refreshCount}`);
        },
      });

      const httpApi = new HttpApi(conn, {});

      let requestCount = 0;
      httpApi.on('request', () => {
        requestCount++;
      });

      const pool = mockAgent.get(loginUrl);
      // 1 initial failure + 2 more failures, then success on the 4th request,
      // i.e. exactly on the last retry the cap allows (sessionRefreshCount === 3).
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0', method: 'GET' }).reply(200, JSON.stringify({}));

      const result = await httpApi.request({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });

      assert.equal(result, '{}');
      assert.equal(requestCount, 4);
      assert.equal(refreshCount, 3);
    });

    it('stops retrying if the refresh function itself keeps failing', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          callback(new Error('refresh backend unreachable'));
        },
      });

      const httpApi = new HttpApi(conn, {});

      let requestCount = 0;
      httpApi.on('request', () => {
        requestCount++;
      });

      const pool = mockAgent.get(loginUrl);
      pool
        .intercept({ path: '/services/data/v59.0', method: 'GET' })
        .reply(401)
        .persist();

      await assert.rejects(async () => {
        await httpApi.request({
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0`,
        });
      });

      // The refresh delegate itself throws on the first failure (it doesn't retry
      // internally), so this should fail fast rather than exhaust the request-level cap.
      assert.equal(requestCount, 1);
      assert.equal(refreshCount, 1);
    });

    it('resets the retry budget for each independent request', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          callback(null, `refreshed_token_${refreshCount}`);
        },
      });

      const httpApi = new HttpApi(conn, {});

      const pool = mockAgent.get(loginUrl);
      pool
        .intercept({ path: '/services/data/v59.0', method: 'GET' })
        .reply(401)
        .persist();

      // First independent request exhausts its own budget and fails.
      await assert.rejects(async () => {
        await httpApi.request({
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0`,
        });
      });
      assert.equal(refreshCount, 3);

      // A brand new request should get its own fresh budget, not inherit
      // the previous request's exhausted counter.
      await assert.rejects(async () => {
        await httpApi.request({
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0`,
        });
      });
      assert.equal(refreshCount, 6);
    });

    it('coalesces concurrent 401s into a single refresh when the session recovers', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          setTimeout(() => callback(null, 'refreshed_token'), 50);
        },
      });

      const httpApi = new HttpApi(conn, {});
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/a', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0/b', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0/c', method: 'GET' }).reply(401);
      pool.intercept({ path: '/services/data/v59.0/a', method: 'GET' }).reply(200, JSON.stringify({ ok: 'a' }));
      pool.intercept({ path: '/services/data/v59.0/b', method: 'GET' }).reply(200, JSON.stringify({ ok: 'b' }));
      pool.intercept({ path: '/services/data/v59.0/c', method: 'GET' }).reply(200, JSON.stringify({ ok: 'c' }));

      const results = await Promise.all([
        httpApi.request({ method: 'GET', url: `${loginUrl}/services/data/v59.0/a` }),
        httpApi.request({ method: 'GET', url: `${loginUrl}/services/data/v59.0/b` }),
        httpApi.request({ method: 'GET', url: `${loginUrl}/services/data/v59.0/c` }),
      ]);

      assert.equal(refreshCount, 1, 'Concurrent 401s should share a single refresh');
      assert.deepEqual(results, [
        JSON.stringify({ ok: 'a' }),
        JSON.stringify({ ok: 'b' }),
        JSON.stringify({ ok: 'c' }),
      ]);
    });

    it('bails out of concurrent chains without the retry budget multiplying across them', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          setTimeout(() => callback(null, `refreshed_token_${refreshCount}`), 20);
        },
      });

      const httpApi = new HttpApi(conn, {});
      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/x', method: 'GET' }).reply(401).persist();
      pool.intercept({ path: '/services/data/v59.0/y', method: 'GET' }).reply(401).persist();

      const outcomes = await Promise.allSettled([
        httpApi.request({ method: 'GET', url: `${loginUrl}/services/data/v59.0/x` }),
        httpApi.request({ method: 'GET', url: `${loginUrl}/services/data/v59.0/y` }),
      ]);

      assert.ok(outcomes.every((o) => o.status === 'rejected'));
      // Two concurrent chains sharing one refresh delegate shouldn't need anywhere
      // near 2x MAX_SESSION_REFRESH_RETRIES worth of refreshes to both give up.
      assert.ok(
        refreshCount < 15,
        `Refresh count grew unexpectedly across concurrent chains: ${refreshCount}`,
      );
    }, 15000);
  });

  describe('error handling', () => {
    it('JSON response', async () => {
      const conn = new Connection({
        accessToken,
        loginUrl,
      });

      const httpApi = new HttpApi(conn, {});

      const missingRequiredFieldErr = [
        {
          message: 'Required fields are missing: [Name]',
          errorCode: 'REQUIRED_FIELD_MISSING',
          fields: ['Name'],
        },
      ];

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'POST' }).reply(400, JSON.stringify(missingRequiredFieldErr), {
        headers: { 'content-type': 'application/json' },
      });

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'POST',
            body: JSON.stringify({
              Description: 'Accountant',
            }),
            url: `${loginUrl}/services/data/v59.0`,
          });
        },
        {
          errorCode: missingRequiredFieldErr[0].errorCode,
          message: missingRequiredFieldErr[0].message,
          content: {...missingRequiredFieldErr[0]}
        },
      );
    });

    it('XML response', async () => {
      const conn = new Connection({
        accessToken,
        loginUrl,
      });

      const httpApi = new HttpApi(conn, {});

      const xmlErr = `
<?xml version="1.0" encoding="UTF-8"?>
<Errors>
	<Error>
		<errorCode>NOT_FOUND</errorCode>
		<message>The requested resource does not exist</message>
	</Error>
</Errors>`;

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA', method: 'GET' }).reply(400, xmlErr, {
        headers: { 'content-type': 'application/xml' },
      });

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'GET',
            url: `${loginUrl}/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA`,
          });
        },
        {
          errorCode: 'NOT_FOUND',
          message: 'The requested resource does not exist',
        },
      );
    });

    it('HTML response', async () => {
      const conn = new Connection({
        accessToken,
        loginUrl,
      });

      const httpApi = new HttpApi(conn, {});

      const htmlErr = `
<!DOCTYPE HTML>
<html lang=en-US>
<head>
<meta charset=UTF-8>
<title>Error Page</title>
</head>
<body>
    <p>Error</p>
</body>
</html>
`;

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA', method: 'GET' }).reply(404, htmlErr, {
        headers: { 'content-type': 'text/html' },
      });

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'GET',
            url: `${loginUrl}/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA`,
          });
        },
        {
          errorCode: 'ERROR_HTTP_404',
          message: `HTTP response contains html content.
Check that the org exists and can be reached.

HTTP status code: 404.
REST API Status Codes and Error Responses:
https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm

See \`error.data\` for the full html response.`,
        },
      );
    });

    it('returns `noContentResponse` on 204', async () => {
      const conn = new Connection({
        accessToken,
        loginUrl,
      });

      const noContentResponse = {
        id: 'a008N0000032UmoQAA ',
        success: true,
        errors: [],
      };

      const httpApi = new HttpApi(conn, {
        noContentResponse,
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA', method: 'DELETE' }).reply(204);

      const body = await httpApi.request({
        method: 'DELETE',
        url: `${loginUrl}/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA`,
      });

      assert.deepEqual(body, noContentResponse);
    });

    it('JSON: handle multiple errors', async () => {
      const conn = new Connection({
        accessToken,
        loginUrl,
      });

      const httpApi = new HttpApi(conn, {});

      const errors = [
        {
          message: 'no ACME accounts',
          errorCode: 'FIELD_CUSTOM_VALIDATION_EXCEPTION',
          fields: [],
        },
        {
          message: 'no 123 phone',
          errorCode: 'FIELD_CUSTOM_VALIDATION_EXCEPTION',
          fields: [],
        }
      ];

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/data/v59.0', method: 'POST' }).reply(400, JSON.stringify(errors), {
        headers: { 'content-type': 'application/json' },
      });

      await assert.rejects(
        async () => {
          await httpApi.request({
            method: 'POST',
            body: JSON.stringify({
              Description: 'Accountant',
            }),
            url: `${loginUrl}/services/data/v59.0`,
          });
        },
        {
          errorCode: 'MULTIPLE_API_ERRORS',
          content: errors,
        },
      );
    })


  });
});

describe('SOAP API', () => {
  async function parseXML(str: string) {
    return xml2js.parseStringPromise(str, { explicitArray: false });
  }

  describe('headers', () => {
    it('sets required HTTP headers', async () => {
      let testPassed = false;

      const conn = new Connection({
        loginUrl,
        accessToken: 'access_token',
      });

      const soapApi = new SOAP(conn, {
        xmlns: 'urn:partner.soap.sforce.com',
        endpointUrl: `${loginUrl}/services/Soap/u/59`,
      });

      soapApi.on('request', (req: HttpRequest) => {
        assert.equal(req?.headers?.['Content-Type'], 'text/xml');
        assert.equal(req?.headers?.['SOAPAction'], '""');
        testPassed = true;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/Soap/u/59', method: 'POST' }).reply(200);

      await soapApi.invoke('describeMetadata', {
        asOfVersion: '59.0',
      });

      assert.ok(testPassed);
    });

    it('sets SOAP "Session" header', async () => {
      let testPassed = false;

      const conn = new Connection({
        loginUrl,
        accessToken: 'access_token',
      });

      const soapApi = new SOAP(conn, {
        xmlns: 'urn:partner.soap.sforce.com',
        endpointUrl: `${loginUrl}/services/Soap/u/59`,
      });

      soapApi.on('request', async (req: HttpRequest) => {
        const parsedBody = await parseXML(req.body as string);
        assert.deepEqual(
          parsedBody['soapenv:Envelope']['soapenv:Header']['SessionHeader'],
          { sessionId: conn.accessToken },
        );
        testPassed = true;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/Soap/u/59', method: 'POST' }).reply(200);

      await soapApi.invoke('describeMetadata', {
        asOfVersion: '59.0',
      });

      assert.ok(testPassed);
    });

    it('sets SOAP "Call options" header', async () => {
      let testPassed = false;

      const conn = new Connection({
        loginUrl,
        accessToken: 'access_token',
        callOptions: {
          client: 'caseSensitiveToken',
          defaultNamespace: 'battle',
        },
      });

      const soapApi = new SOAP(conn, {
        xmlns: 'urn:partner.soap.sforce.com',
        endpointUrl: `${loginUrl}/services/Soap/u/59`,
      });

      soapApi.on('request', async (req: HttpRequest) => {
        const parsedBody = await parseXML(req.body as string);
        assert.deepEqual(
          parsedBody['soapenv:Envelope']['soapenv:Header']['CallOptions'],
          conn._callOptions,
        );
        testPassed = true;
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/Soap/u/59', method: 'POST' }).reply(200);

      await soapApi.invoke('describeMetadata', {
        asOfVersion: '59.0',
      });

      assert.ok(testPassed);
    });
  });

  describe('session refresh', () => {
    it('fails if passwordExpired=true', async () => {
      const conn = new Connection({
        loginUrl,
      });

      const passwordExpiredXml =
`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
	xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
	xmlns="urn:partner.soap.sforce.com"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<soapenv:Body>
		<loginResponse>
			<result>
				<passwordExpired>true</passwordExpired>
			</result>
		</loginResponse>
	</soapenv:Body>
</soapenv:Envelope>`

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/Soap/u/50.0', method: 'POST' }).reply(200, passwordExpiredXml);


      await assert.rejects(async () => {
        await conn.login('username','password')
      }, {
          message: 'Unable to login because the used password has expired.'
        })
    })

    it('handle `Content-Length` header after session refresh', async () => {
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          setTimeout(() => callback(null, 'refreshed_token' ?? undefined), 200);
        },
      });

      const soapApi = new SOAP(conn, {
        xmlns: 'urn:partner.soap.sforce.com',
        endpointUrl: `${loginUrl}/services/Soap/u/59`,
      });

      let testPassed = false;
      let firstRoundTrip = true;

      /*
       * SOAP requests include the access token in the body.
       * The first req will have `content-length` calculated with the invalid AT,
       * the second one should have it re-calculated with the refreshed AT.
       */
      soapApi.on('request', (req: HttpRequest) => {
        if (firstRoundTrip) {
          assert.equal(req?.headers?.['content-length'], '473');
          firstRoundTrip = false;
        } else {
          assert.equal(req?.headers?.['content-length'], '475');
          testPassed = true;
        }
      });

      const pool = mockAgent.get(loginUrl);
      pool.intercept({ path: '/services/Soap/u/59', method: 'POST' }).reply(500, '<faultcode>test:INVALID_SESSION_ID</faultcode>');
      pool.intercept({ path: '/services/Soap/u/59', method: 'POST' }).reply(200);

      await soapApi.invoke('create', {
        Account: 'test',
      });
      assert.ok(testPassed);
    });

    it('gives up after a bounded number of refresh attempts when SOAP session stays expired', async () => {
      let refreshCount = 0;
      const conn = new Connection({
        loginUrl,
        accessToken: 'invalid_token',
        refreshFn: (_c, callback) => {
          refreshCount++;
          callback(null, `refreshed_token_${refreshCount}`);
        },
      });

      const soapApi = new SOAP(conn, {
        xmlns: 'urn:partner.soap.sforce.com',
        endpointUrl: `${loginUrl}/services/Soap/u/59`,
      });

      let requestCount = 0;
      soapApi.on('request', () => {
        requestCount++;
      });

      const pool = mockAgent.get(loginUrl);
      pool
        .intercept({ path: '/services/Soap/u/59', method: 'POST' })
        .reply(500, '<faultcode>test:INVALID_SESSION_ID</faultcode>')
        .persist();

      await assert.rejects(async () => {
        await soapApi.invoke('create', {
          Account: 'test',
        });
      });

      assert.equal(requestCount, 4);
      assert.equal(refreshCount, 3);
    });
  });

  it('parses errors in XML responses', () => {
    const conn = new Connection({
      loginUrl,
      accessToken: 'access_token',
    });

    const soapApi = new SOAP(conn, {
      xmlns: 'urn:partner.soap.sforce.com',
      endpointUrl: `${loginUrl}/services/Soap/u/59`,
    });

    const xmlErr = `
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sf="http://soap.sforce.com/2006/04/metadata">
    <soapenv:Body>
        <soapenv:Fault>
            <faultcode>sf:INVALID_SESSION_ID</faultcode>
            <faultstring>INVALID_SESSION_ID: Invalid Session ID found in SessionHeader: Illegal Session</faultstring>
        </soapenv:Fault>
    </soapenv:Body>
</soapenv:Envelope>
`;
    const pool = mockAgent.get(loginUrl);
    pool.intercept({ path: '/services/Soap/u/59', method: 'POST' }).reply(400, xmlErr, {
      headers: { 'content-type': 'application/xml' },
    });

    void assert.rejects(
      async () => {
        await soapApi.invoke('create', {
          Account: 'test',
        });
      },
      {
        errorCode: 'sf:INVALID_SESSION_ID',
        message:
          'INVALID_SESSION_ID: Invalid Session ID found in SessionHeader: Illegal Session',
      },
    );
  });
});
