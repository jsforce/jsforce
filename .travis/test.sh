#!/bin/sh
if [ "${BROWSER_TEST}" = "true" ]; then
  echo "ava does not support browser yet"
else
  npm run lint && npm run typec && npm test
fi
