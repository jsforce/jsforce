var env = require('./env');
module.exports = {
  loginUrl :       env.SF_LOGIN_URL || "https://login.salesforce.com",
  username :       env.SF_USERNAME,
  password :       env.SF_PASSWORD,
  clientId :       env.SF_OAUTH2_CLIENT_ID,
  clientSecret :   env.SF_OAUTH2_CLIENT_SECRET,
  redirectUri :    env.SF_OAUTH2_REDIRECT_URI || "http://localhost:4000/oauth2/callback",
  pushTopicName :  "AccountUpdates",
  proxyUrl :       env.SF_AJAX_PROXY_URL || "http://localhost:3123/proxy",
  logLevel :       env.DEBUG,
  isolateTest:     env.DISABLE_TEST_ISOLATION !== "true"
};
