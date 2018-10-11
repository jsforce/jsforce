#!/bin/sh
if [ "${BROWSER_TEST}" = "true" ]; then
  echo "ava does not support browser yet"
else
  # npm run lint && npm run flow && npm test
  npm run lint && npm test
fi
