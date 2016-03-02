#!/bin/sh
npm test
if [ "${BROWSER_TEST}" = "true" ]; then
  npm run build:all
  npm run test:browser -- ci
fi
