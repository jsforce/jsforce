import { HttpApi } from '../src/http-api';
import { SOAP } from '../src/soap';
import { Connection } from '../src/connection';
import { HttpRequest, HttpResponse } from '../src/types';
import assert from 'assert';
import nock = require('nock');

describe('HTTP API', () => {
  const loginUrl = 'https://heaven-party-2429-dev-ed.scratch.my.salesforce.com';

  const accessToken = '1234';

  const conn = new Connection({
    accessToken,
    loginUrl,
  });

  const httpApi = new HttpApi(conn, {});

  it('sets authorization header', async () => {
    let testPassed = false;

    httpApi.on('request', (req: HttpRequest) => {
      assert.ok(req?.headers?.['Authorization'] === `Bearer ${accessToken}`);
      testPassed = true;
    });

    nock(loginUrl).get('/services/data/v59.0').reply(200, {});

    await httpApi.request<HttpResponse>({
      method: 'GET',
      url: `${loginUrl}/services/data/v59.0`,
    });
    assert.ok(testPassed);
  });

  it('sets content-length header', async () => {
    let testPassed = false;

    httpApi.on('request', (req: HttpRequest) => {
      assert.equal(req?.headers?.['content-length'], '19');
      testPassed = true;
    });

    nock(loginUrl).post('/services/data/v59.0/sobjects/Account').reply(200, {});

    await httpApi.request<HttpResponse>({
      method: 'POST',
      body: JSON.stringify({
        Name: 'John Doe',
      }),
      url: `${loginUrl}/services/data/v59.0/sobjects/Account`,
    });
    assert.ok(testPassed);
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
          // bearer token set in the connection.
          assert.equal(req?.headers?.['Authorization'], `Bearer invalid_token`);
          firstRoundTrip = false;
        } else {
          // bearer token set in the connection's refresh function.
          assert.equal(
            req?.headers?.['Authorization'],
            `Bearer refreshed_token`,
          );
          testPassed = true;
        }
      });

      nock(loginUrl)
        .get('/services/data/v59.0')
        .reply(401)
        .get('/services/data/v59.0')
        .reply(200);

      await httpApi.request<HttpResponse>({
        method: 'GET',
        url: `${loginUrl}/services/data/v59.0`,
      });
      assert.ok(testPassed);
    });

    it('SOAP: handle `content-length` header after session refresh', async () => {
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

      /* SOAP requests include the access token in the body,
       * the first req will have `content-length` calculated with the invalid AT
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

  it('handles bad responses', async () => {
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

    assert.rejects(
      async () => {
        await httpApi.request<HttpResponse>({
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
      },
    );
  });
});
