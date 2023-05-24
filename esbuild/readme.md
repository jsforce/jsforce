## Web Test Runner + esbuild setup

This doc shows some of the limitations I found when trying to replace karma with web-test-runner.

#### Context:

Tests in the `test` are executed in node and browser (expect those skipped by the `isNodeJs` utility) when running `npm run test`.
Jest handles this fine but karma relies on babel and a webpack preprocessor to compile TS tests and polyfill nodejs core modules.


web-test-runner doesn't have an integration with webpack so we need to use its esbuild plugin to compile tests on the fly:
https://modern-web.dev/docs/dev-server/plugins/esbuild/

This works fine for code not using node-specific modules, as an example this branch includes a runnable soql-builder test file:
`npx web-test-runner test/soql-builder.test.ts` will run these tests on a chrome instance in headless mode.


Now, if you run `npx web-test-runner test/bulk.test.ts` you start getting errors from esbuild failing to resolve nodejs core modules:
```
Error while transforming src/api/bulk.ts: Could not resolve import "stream".
  1 | import { EventEmitter } from "events";
> 2 | import { Writable } from "stream";
...
```

webpack handles this by polyfilling these modules (see webpack config files):
https://webpack.js.org/configuration/resolve/#resolvefallback
.

### Node polyfills with esbuild

The web-test-runner plugin for esbuild doesn't expose all the options so we can do this by calling esbuild:

This example tries to transpile `test/bulk.test.ts`:

```
npx esbuild test/bulk.test.ts \
  --inject:./esbuild/browser.js \
  --define:global=window \
  --bundle \
  --target=chrome58 \
  --alias:crypto=crypto-browserify \
  --alias:stream=stream-browserify \
  --alias:path=path-browserify \
  --alias:querystring=querystring-es3 \
  --alias:timers=timers-browserify  \
  --alias:asser=assert/ \
  --external:url \
  --external:tls \
  --external:fs \
  --external:net \
  --external:child_process \
  --outfile=test/bulk-test.js
```

then running it:
`npx web-test-runner test/bulk-test.js`

```
Error: Dynamic require of "net" is not supported
        at test/bulk-test.js:31:11
        at node_modules/https-proxy-agent/dist/agent.js (test/bulk-test.js:5670:35)
        at __require2 (test/bulk-test.js:50:52)
        at node_modules/https-proxy-agent/dist/index.js (test/bulk-test.js:5806:37)
        at __require2 (test/bulk-test.js:50:52)
        at test/bulk-test.js:55389:42
        at test/bulk-test.js:74136:3
```

