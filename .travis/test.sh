#!/bin/sh
if [ "${BROWSER_TEST}" = "true" ]; then
  echo "ava does not support browser yet"
#  npm run build:all
#  npm run test:browser -- ci
else
  npm run lint && npm run flow && npm test
fi
