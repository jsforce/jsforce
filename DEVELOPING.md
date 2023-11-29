# Getting started

1. Clone the project and `cd` into it:
```
git clone git@github.com:jsforce/jsforce.git
cd jsforce
```

2. Install dependencies:
```
npm install
```

3. Build

If you use `jsforce`:
<details>

```
npm run build
```

`npm run build` will generate all the distributions for node and browsers:
* Node CJS build (dir: `lib`)
* Browser ESM build (dir: `browser`)
* Browser bundles (dir: `dist`)
</details>


or if you use `@jsforce/jsforce-node`:
<details>

```
npm install
npm run jsforce-node:dev
npm run build:node:cjs
```

**IMPORTANT:**

`npm run jsforce-node:dev` will only change the `name` field in the `package.json` to `@jsforce/jsforce-node`.
This helps reducing changes to the package.json (smaller diff) and allows you to `yarn | npm` link it, but you should never commit the change back to the repo.

You could also run `npm run jsforce-node` instead to get the full changes we do at release time, see: [JSFORCE_NODE.md](./JSFORCE-NODE.md#how-does-it-work)

</details>

# Type-checking

Babel doesn't perform type-checking when transpiling TS to JS, run `npm run typecheck` to validate the code and tests with the TypeScript compiler. 

# Linting
Run `npm run lint` to lint the project with ESLint.

# Tests
jsforce has mostly E2E tests, written in TS (file name ends with `test.ts`, use `.ts` for test utils) and are located under the `test` folder.
Keep in mind these tests are executed in a browser and node env, so you have to be careful not to use browser/node-specific code or they will fail, or write node-only tests like this:
https://github.com/jsforce/jsforce/blob/7c8e6a130a149cc7f310e6628f786f94a98c91b9/test/bulk2.test.ts#L136

We run them on latest Chrome and Node (`Current`, `LTS` and `Maintenance` releases) on CI.

## Scratch org setup for testing

> [!NOTE] 
> The Salesforce CLI is required for this, install instructions:
>
> https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm

E2E tests need an org to run tests against, if you have a dev hub and the `sf` CLI you can create a scratch org for testing with the `org-setup` script:

1) Set a default dev hub globally: `sf config set target-dev-hub <hub-username> --global`.
2) Run `npx zx scripts/org-setup.mjs`, if it finishes successfully you'll see the following output:
```
Run tests using this scratch org by appending SF_LOGIN_URL=<login-url> SF_USERNAME=<username> SF_PASSWORD=<password>
```

Set these 3 env vars in you current shell session, tests will use them to establish a connection to the org.

## Running tests on the browser
Due to the Same-origin policy we can't make API requests to Salesforce without a proxy server (REST API supports CORS but jsforce also uses the SOAP API which doesn't), to start the proxy server and run the tests:

1) Set the proxy URL env var: `SF_AJAX_PROXY_URL="http://localhost:3123/proxy"`. If you want to use a different port, use the `PORT` env var and update the URL.
2) Run `npm run test:browser-ci`

This will start a proxy server ([`jsforce-ajax-proxy`](https://github.com/jsforce/jsforce-ajax-proxy)), wait until it is ready and then run `karma start` to launch Chrome and run the tests.
If you host your own proxy server or want to use a 3rd party one set it via `SF_AJAX_PROXY_URL` and run `npm run test:browser` (will only run `karma start`). 

We use [`karma`](https://karma-runner.github.io/latest/index.html) as the test runner and [`jasmine`](https://github.com/jasmine/jasmine/) for testing.
`karma` is set up to use `webpack` + `babel` ([`babel-loader`](https://github.com/babel/babel-loader)) to transpile and load TS tests in the browser.

## Running tests on node
Run all tests by running the `npm run test:node` script or pass it a file path if you want to run a specific one, e.g. `npm run test:node -- test/cache.test.ts`.

[`jest`](https://jestjs.io/) is used both as the test runner and testing framework.
