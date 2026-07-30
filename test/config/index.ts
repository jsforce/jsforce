export default {
  loginUrl: process.env.SF_LOGIN_URL ?? 'https://login.salesforce.com',
  username: process.env.SF_USERNAME ?? '',
  password: process.env.SF_PASSWORD ?? '',
  accessToken: process.env.SF_ACCESS_TOKEN ?? '',
  clientId: process.env.SF_OAUTH2_CLIENT_ID ?? '',
  clientSecret: process.env.SF_OAUTH2_CLIENT_SECRET ?? '',
  redirectUri:
    process.env.SF_OAUTH2_REDIRECT_URI ??
    'http://localhost:4000/oauth2/callback',
  bigTable: 'BigTable__c',
  upsertTable: 'UpsertTable__c',
  upsertField: 'ExtId__c',
  proxyUrl: process.env.SF_AJAX_PROXY_URL ?? '',
  logLevel: process.env.DEBUG,
};
