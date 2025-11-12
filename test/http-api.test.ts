import { HttpApi } from '../src/http-api';
import { SOAP } from '../src/soap';
import { Connection } from '../src/connection';
import { HttpRequest } from '../src/types';
import { Transport } from '../src/transport';
import assert from 'assert';
import xml2js from 'xml2js';
import nock = require('nock');
import { HttpRequestOptions, HttpResponse } from '../src/types/common';

const loginUrl = 'https://heaven-party-2429-dev-ed.scratch.my.salesforce.com';

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
      nock(loginUrl)
        .get('/services/data/v59.0')
        .times(4)
        .reply(429, JSON.stringify({
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'Invalid AiEvaluation identifier'
        }))

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
      nock(loginUrl)
        .get('/services/data/v59.0')
        .times(attempts)
        .reply(429)
        .get('/services/data/v59.0')
        .reply(200, { success: true });

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(retryCounter === attempts);
    });

    it('does not retry on unsupported status codes', async () => {
      const attempts = 2;
      nock(loginUrl)
        .get('/services/data/v60.0')
        .times(attempts)
        .reply(404)
        .get('/services/data/v60.0')
        .reply(200, { success: true });

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v60.0`,
      });
      assert.ok(retryCounter === 0);
    });

    it('retries on socket error until it succeeds', async () => {
      const attempts = 2;
      nock(loginUrl)
        .get('/services/data/v59.0')
        .times(attempts)
        .replyWithError({
          message: `request to ${loginUrl} failed, reason: socket hang up`,
          code: 'ECONNRESET',
        })
        .get('/services/data/v59.0')
        .reply(200, { success: true });

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(retryCounter === attempts);
    });

    it('stops retries after max is reached', async () => {
      nock(loginUrl)
        .get('/services/data/v59.0')
        .times(6)
        .replyWithError({
          message: `request to ${loginUrl} failed, reason: socket hang up`,
          code: 'ECONNRESET',
        });

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
      assert.ok(err.name === 'FetchError');
    });

    it('retries only on specified methods', async () => {
      nock(loginUrl)
        .get('/services/data/v59.0/limits')
        .times(2)
        .replyWithError({
          message: `request to ${loginUrl} failed, reason: socket hang up`,
          code: 'ECONNRESET',
        })
        .get('/services/data/v59.0/limits')
        .reply(200, { success: true });

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
      nock(loginUrl)
        .get('/services/data/v59.0/limits')
        .times(2)
        .replyWithError({
          message: `request to ${loginUrl} failed, reason: socket hang up`,
          code: 'ECONNRESET',
        })
        .get('/services/data/v59.0/limits')
        .reply(200, { success: true });

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
      nock(loginUrl)
        .get('/services/data/v59.0/limits')
        .times(2)
        .replyWithError({
          message: `request to ${loginUrl} failed, reason: socket hang up`,
          code: 'UNKNOWN_ERROR',
        })
        .get('/services/data/v59.0/limits')
        .reply(200, { success: true });

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0/limits`,
      });
      assert.ok(retryCounter === 0);
    });

    it('should retry only 2 times on 420 & html response', async () => {
      const htmlBody = '<html><body>If it takes too long, please contact support or visit our support page</body></html>';
      nock(loginUrl)
        .get('/services/data/v59.0')
        .times(3)
        .reply(420, htmlBody, {
          'content-type': 'text/html',
        });

      const { retryCounter } = await fetch({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(retryCounter === 2);
    });

    it('does not retry on unsupported methods', async () => {
      nock(loginUrl)
        .post('/services/data/v59.0', 'body')
        .replyWithError({
          message: `request to ${loginUrl} failed, reason: socket hang up`,
          code: 'ECONNRESET',
        })
        .post('/services/data/v59.0', 'body')
        .reply(200, { success: true });

      const { retryCounter } = await fetch({
        method: 'POST',
        url: `${loginUrl}/services/data/v59.0`,
        body: 'body',
      });

      assert.ok(retryCounter === 0);
    });

    it('does not retry cancelled requests', async () => {
      // setting a timeout makes the AbortController instance cancel the request.
      nock(loginUrl)
        .get('/services/data/v60.0')
        .times(2)
        .replyWithError({
          message: `request to ${loginUrl} failed, reason: socket hang up`,
          code: 'ECONNRESET',
        })
        .get('/services/data/v60.0')
        .reply(200, { success: true });

      const { retryCounter } = await fetch(
        {
          method: 'GET',
          url: `${loginUrl}/services/data/v60.0`,
        },
        {
          timeout: 1, // 1ms to ensure it fails before a retry happens.
        },
      );
      assert.ok(retryCounter === 0);
    });

    it('throws after 5 seconds timeout', async () => {
      nock(loginUrl)
        .get('/services/data/v59.0')
        .delay(7000) // Delay response by 7 seconds to exceed timeout
        .reply(200, { success: true });

      const { err } = await fetch(
        {
          method: 'GET',
          url: `${loginUrl}/services/data/v59.0`,
        },
        {
          timeout: 5000, // 5 second timeout
        },
      );

      assert.ok(err instanceof Error);
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

      nock(loginUrl).get('/services/data/v59.0').reply(200, {});

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

      nock(loginUrl).get('/services/data/v59.0').reply(200, {});

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

      nock(loginUrl)
        .post('/services/data/v59.0/sobjects/Account')
        .reply(200, {});

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

      nock(loginUrl)
        .post('/services/data/v59.0/sobjects/Account')
        .reply(200, {});

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
          // access token set in the connection.
          assert.equal(req?.headers?.['Authorization'], 'Bearer invalid_token');
          firstRoundTrip = false;
        } else {
          // access token set in the connection's refresh function.
          assert.equal(
            req?.headers?.['Authorization'],
            'Bearer refreshed_token',
          );
          testPassed = true;
        }
      });

      nock(loginUrl)
        .get('/services/data/v59.0')
        .reply(401)
        .get('/services/data/v59.0')
        .reply(200);

      await httpApi.request({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(testPassed);
    });
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

      nock(loginUrl)
        .post('/services/data/v59.0')
        .reply(400, JSON.stringify(missingRequiredFieldErr), {
          'content-type': 'application/json',
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

      nock(loginUrl)
        .get('/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA')
        .reply(400, xmlErr, {
          'content-type': 'application/xml',
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

      nock(loginUrl)
        .get('/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA')
        .reply(404, htmlErr, {
          'content-type': 'text/html',
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

      nock(loginUrl)
        .delete('/services/data/v59.0/sobjects/Broker__c/a008N0000032UmoQAA')
        .reply(204);

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

      nock(loginUrl)
        .post('/services/data/v59.0')
        .reply(400, JSON.stringify(errors), {
          'content-type': 'application/json',
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

      nock(loginUrl).post('/services/Soap/u/59').reply(200);

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

      nock(loginUrl).post('/services/Soap/u/59').reply(200);

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

      nock(loginUrl).post('/services/Soap/u/59').reply(200);

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

      nock(loginUrl)
        .post('/services/Soap/u/50.0')
        .reply(200, passwordExpiredXml);


      await assert.rejects(async () => {
        // SOAP login requests will return 200 even with an expired password:
        // https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_login_loginresult.htm?q=passwordExpired
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

      nock(loginUrl)
        .post('/services/Soap/u/59')
        .reply(500, '<faultcode>test:INVALID_SESSION_ID</faultcode>')
        .post('/services/Soap/u/59')
        .reply(200);

      await soapApi.invoke('create', {
        Account: 'test',
      });
      assert.ok(testPassed);
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
    nock(loginUrl).post('/services/Soap/u/59').reply(400, xmlErr, {
      'content-type': 'application/xml',
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
