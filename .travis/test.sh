#!/bin/sh
if [ "${BROWSER_TEST}" = "true" ]; then
  npm run build:all && npm run test:browser -- ci
else
  npm test
fi
