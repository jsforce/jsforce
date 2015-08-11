var env = require('./env');
module.exports = {
  loginUrl :      env.SF_LOGIN_URL || "https://login.salesforce.com",
  poolClient :    env.SF_POOL_CLIENT,
  poolUsername :  env.SF_POOL_USERNAME,
  poolPassword :  env.SF_POOL_PASSWORD,
  username :      env.SF_USERNAME,
  password :      env.SF_PASSWORD,
  clientId :      env.SF_OAUTH2_CLIENT_ID,
  clientSecret :  env.SF_OAUTH2_CLIENT_SECRET,
  redirectUri :   env.SF_OAUTH2_REDIRECT_URI || "http://localhost:4000/oauth2/callback",
  bigTable :      "BigTable__c",
  upsertTable :   "UpsertTable__c",
  upsertField :   "ExtId__c",
  proxyUrl :      env.SF_AJAX_PROXY_URL,
  logLevel :      env.DEBUG,
};
