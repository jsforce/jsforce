import puppeteer from 'puppeteer';

function retrieveCallbackedParameters(url) {
  const params = {};
  const qparams = url.split('?').pop().split('&');
  for (const qparam of qparams) {
    const pair = qparam.split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
}

async function loginAndApprove(page, username, password) {
  const url = page.url();
  if (url.indexOf('/setup/secur/RemoteAccessAuthorizationPage.apexp') > 0) { // authorization page
    await page.click('#oaapprove');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitFor(1000);
    return loginAndApprove(page, username, password);
  } else if (url.indexOf('/?ec=302') > 0) { // login page
    await page.waitFor(0);
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('[name=Login]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    return loginAndApprove(page, username, password);
  } else if (url.indexOf('http://localhost') === 0) { // callback response
    return retrieveCallbackedParameters(url);
  } else if (url.indexOf('/setup/secur/RemoteAccessErrorPage.apexp') > 0) { // authorization error
    throw new Error('invalid authorization error');
  } else {
    await page.waitFor(1000);
    return loginAndApprove(page, username, password);
  }
}

export default async function authorize(url, username, password) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  let ret;
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const reqUrl = request.url();
      if (reqUrl.indexOf('http://localhost') === 0) {
        request.respond({
          status: 200,
          contentType: 'text/html',
          body: '<html><body></body></html>'
        });
      } else {
        request.continue();
      }
    });
    await page.goto(url, { waitUntil: 'networkidle2' });
    ret = await loginAndApprove(page, username, password);
  } finally {
    if (browser) { browser.close(); }
  }
  return ret;
}
