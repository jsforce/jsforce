import test from 'ava';
import { Connection } from '..';
import authorize from '../test/helper/webauth';
import config from '../test/config/salesforce';


function delay(msec) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), msec);
  });
}

function authorisePromised(...args) {
  return new Promise((resolve, reject) => {
    authorize(...args, (err, res) => err ? reject(err) : resolve(res))
  });
}

let conn;

test.serial('login - login by username and password', async (t) => {
  conn = new Connection({ logLevel: config.logLevel, proxyUrl: config.proxyUrl });
  const userInfo = await conn.login(config.username, config.password);
  t.true(typeof conn.accessToken === 'string');
  t.true(typeof userInfo.id === 'string');
  t.true(typeof userInfo.organizationId === 'string');
  t.true(typeof userInfo.url === 'string');
});

test.serial('login - execute query and return some records', async (t) => {
  const res = await conn.query("SELECT Id FROM User");
  t.true(Array.isArray(res.records));
});

test.serial('login - catch/handle bad access token', async (t) => {
  let newAccessToken, refreshCount = 0;
  conn.accessToken = "invalid access token";
  conn.removeAllListeners("refresh");
  conn.on("refresh", (at) => {
    newAccessToken = at;
    refreshCount++;
  });
  const res = await conn.query("SELECT Id FROM User LIMIT 5");
  t.true(refreshCount === 1);
  t.true(typeof newAccessToken === 'string');
  t.true(Array.isArray(res.records));
});


let sessionInfo;

test.serial('logout - logout from soap session', async (t) => {
  const conn1 = new Connection({ logLevel: config.logLevel, proxyUrl: config.proxyUrl });
  await conn1.loginBySoap(config.username, config.password);
  sessionInfo = {
    sessionId : conn1.accessToken,
    serverUrl : conn1.instanceUrl
  };
  await conn1.logout();
  t.true(conn1.accessToken === null);
});


test.serial('logout - connect with previous session info to raise auth error', async (t) => {
  const conn2 = new Connection({
    sessionId: sessionInfo.sessionId,
    serverUrl: sessionInfo.serverUrl,
    logLevel: config.logLevel,
    proxyUrl: config.proxyUrl,
  });
  await delay(10000);
  try {
    const res = await conn2.query('SELECT Id FROM User');
    t.fail();
  } catch (err) {
    t.true(err && typeof err.message === 'string');
  }
});


test.serial('oauth2 session - logout oauth2 session', async (t) => {
  const conn1 = new Connection({
    oauth2: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
    },
    logLevel: config.logLevel,
  });
  await conn1.loginByOAuth2(config.username, config.password);
  sessionInfo = {
    accessToken: conn1.accessToken,
    instanceUrl: conn1.instanceUrl,
  };
  await conn1.logout();
  t.true(conn1.accessToken === null);
});


test.serial('oauth2 session - connect with previous session info and raise auth error', async (t) => {
  const conn2 = new Connection({
    accessToken: sessionInfo.accessToken,
    instanceUrl: sessionInfo.instanceUrl,
    logLevel: config.logLevel,
  });
  await delay(10000);
  try {
    await conn2.query('SELECT Id FROM User');
    t.fail();
  } catch (err) {
    t.true(err && typeof err.message === 'string');
  }
});


let newConn, accessToken, instanceUrl;

test.serial('oauth2 session - authorize web server flow to get access tokens', async (t) => {
  newConn = new Connection({
    oauth2: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
    },
    logLevel: config.logLevel,
  });
  const authzUrl = newConn.oauth2.getAuthorizationUrl();
  const params = await authorisePromised(authzUrl, config.username, config.password);
  const userInfo = await newConn.authorize(params.code);
  t.true(typeof userInfo.id === 'string');
  t.true(typeof userInfo.organizationId === 'string');
  t.true(typeof userInfo.url === 'string');
  t.true(typeof newConn.accessToken === 'string');
  t.true(typeof newConn.refreshToken === 'string');
  accessToken = newConn.accessToken;
  instanceUrl = newConn.instanceUrl;
  const res = await newConn.query('SELECT Id FROM User');
  t.true(Array.isArray(res.records));
});

test.serial('oauth2 session - make access token invalid and return responses', async (t) => {
  let newAccessToken, refreshCount = 0;
  newConn.accessToken = 'invalid access token';
  newConn.removeAllListeners('refresh');
  newConn.on('refresh', (at) => {
    newAccessToken = at;
    refreshCount++;
  });
  const res = await newConn.query('SELECT Id FROM User');
  t.true(refreshCount === 1);
  t.true(typeof newAccessToken === 'string');
  t.true(Array.isArray(res.records));
  accessToken = newAccessToken;
});

test.serial('oauth2 session - make access token invalid and call in parallel and return responses', async (t) => {
  let newAccessToken, refreshCount = 0;
  newConn.accessToken = 'invalid access token';
  newConn.removeAllListeners('refresh');
  newConn.on('refresh', (at) => {
    newAccessToken = at;
    refreshCount++;
  });
  const results = await Promise.all([
    newConn.query('SELECT Id FROM User'),
    newConn.describeGlobal(),
    newConn.sobject('User').describe(),
  ]);
  t.true(refreshCount === 1);
  t.true(typeof newAccessToken === 'string');
  t.true(Array.isArray(results));
  t.true(Array.isArray(results[0].records));
  t.true(Array.isArray(results[1].sobjects));
  t.true(Array.isArray(results[2].fields));
  accessToken = newAccessToken;
});

test.serial('oauth2 session - expire both access token and refresh token and return error', async (t) => {
  newConn.accessToken = 'invalid access token';
  newConn.refreshToken = 'invalid refresh token';
  try {
    await newConn.query('SELECT Id FROM User');
    t.fail();
  } catch (err) {
    t.true(err instanceof Error);
    t.true(err.name === 'invalid_grant');
  }
});
