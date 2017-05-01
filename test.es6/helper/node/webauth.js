import { remote } from 'webdriverio';

async function loginAndApprove(client, username, password) {
  let approved = false;
  try {
    const { value: url } = await client.url();
    if (url.indexOf('/setup/secur/RemoteAccessAuthorizationPage.apexp') > 0) { // authorization page
      approved = true;
      try {
        await client.click('#oaapprove');
      } catch (e) { /* eslint-disable-line no-empty-block */ }
    } else if (url.indexOf('/?ec=302') > 0) { // login page
      await client.setValue('#username', username)
                  .setValue('#password', password)
                  .click('[name=Login]');
    } else {
      await client.pause(1000);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
  return approved || loginAndApprove(client, username, password);
}

async function retrieveCallbackedParameters(client) {
  await client.url();
  const txt = await client.getSource();
  const params = {};
  const m = txt.match(/\/callback\?([^'"]+)/);
  if (m) {
    const qparams = m[1].split('&');
    for (let i = 0; i < qparams.length; i++) {
      const qparam = qparams[i];
      const pair = qparam.split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
  }
  return params;
}

export default async function authorize(url, username, password) {
  const client = remote({
    desiredCapabilities: { browserName: 'phantomjs' },
    port: process.env.WEBDRIVER_PORT || 4444,
  });
  try {
    await client.init();
    await client.url(url);
    await loginAndApprove(client, username, password);
    const ret = await retrieveCallbackedParameters(client);
    client.end();
    return ret;
  } catch (err) {
    client.end();
    throw err;
  }
}
