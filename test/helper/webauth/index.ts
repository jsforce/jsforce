import puppeteer, { Page } from 'puppeteer';

const AUTHORIZATION_TIMEOUT = 120000;

type AuthorizationParameters = Record<string, string>;

export function retrieveCallbackedParameters(url: string): AuthorizationParameters {
  const params: AuthorizationParameters = {};
  const qparams = (url.split('?').pop() || '').split('&');
  for (const qparam of qparams) {
    const pair = qparam.split('=');
    if (pair.length === 2) {
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
  }
  return params;
}

async function loginAndApprove(
  page: Page,
  username: string,
  password: string,
): Promise<AuthorizationParameters> {
  const deadline = Date.now() + AUTHORIZATION_TIMEOUT;

  while (Date.now() < deadline) {
    const url = page.url();
    if (url.startsWith('http://localhost')) {
      return retrieveCallbackedParameters(url);
    }
    if (url.includes('/setup/secur/RemoteAccessErrorPage.apexp')) {
      throw await authorizationError(page, 'Salesforce rejected OAuth authorization');
    }

    const usernameField = await page.$('#username');
    if (usernameField) {
      await page.type('#username', username);
      const passwordField = await page.$('#password');
      if (passwordField) {
        await page.type('#password', password);
      }
      await clickAndWaitForPageChange(page, '[name=Login]');
      continue;
    }

    const passwordField = await page.$('#password');
    if (passwordField) {
      await page.type('#password', password);
      await clickAndWaitForPageChange(page, '[name=Login]');
      continue;
    }

    const approveButton = await page.$('#oaapprove');
    if (approveButton) {
      await clickAndWaitForPageChange(page, '#oaapprove');
      continue;
    }

    await delay(500);
  }

  throw await authorizationError(page, 'Timed out waiting for Salesforce OAuth authorization');
}

async function clickAndWaitForPageChange(page: Page, selector: string) {
  const url = page.url();
  await Promise.all([
    page.waitForFunction((previousUrl) => location.href !== previousUrl, {}, url),
    page.click(selector),
  ]);
}

async function authorizationError(page: Page, message: string): Promise<Error> {
  const screenshotPath = `/tmp/jsforce-oauth-${Date.now()}.png`;
  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch {
    // Keep the original authorization error even when screenshot capture fails.
  }
  return new Error(
    `${message}; URL: ${page.url()}; title: ${await page.title()}; screenshot: ${screenshotPath}`,
  );
}

export default async function authorize(
  url: string,
  username: string,
  password: string,
) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}),
  });
  let ret;
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const reqUrl = request.url();
      if (reqUrl.startsWith('http://localhost')) {
        request.respond({
          status: 200,
          contentType: 'text/html',
          body: '<html><body></body></html>',
        });
      } else {
        request.continue();
      }
    });
    await page.goto(url);
    ret = await loginAndApprove(page, username, password);
  } finally {
    if (browser) {
      browser.close();
    }
  }
  return ret;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
