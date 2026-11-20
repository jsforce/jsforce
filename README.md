# jsforce

Salesforce API Library for JavaScript applications (both on web browser and Node.js)

## Overview

JSforce (f.k.a. Node-Salesforce) is an isomorphic JavaScript Library utilizing Salesforce's API: It works both in the browser and with Node.js.

It capsulates the access to various APIs provided by Salesforce in asynchronous JavaScript function calls.

It also has command line interface (CLI) which gives interactive console (REPL), so you can learn the usage without hassle.

Supported Salesforce APIs are the following:

- REST API (SOQL, SOSL, describe, etc.)
- Apex REST
- Analytics API
- Bulk API
- Chatter API
- Metadata API
- SOAP API
- Streaming API
- Tooling API

## Documentation

See documentation in https://jsforce.github.io/

v3 API reference:
https://jsforce.github.io/jsforce/

v1 API reference:
https://jsforce.github.io/jsforce/doc/

## Migration
Migrating from v1 → v3? Find the [migration guide here](./MIGRATING_V1-V3.md)

Migrating from v2 → v3? Find the [migration guide here](./MIGRATING_V2-V3.md)

## Releases

See [Releases](https://github.com/jsforce/jsforce/releases).

## Node-specific release

See [jsforce-node](./JSFORCE-NODE.md).

## License

See [license](LICENSE) (MIT License).

## Authors

- Shinichi Tomita <shinichi.tomita@gmail.com>

## Notes

### Username/Password Login Deprecation Notice
Salesforce is retiring both ways that `Connection#login()` authenticates with a username and password:

- The OAuth 2.0 Username-Password Flow (`loginByOAuth2`, used by `login()` when a client ID and secret are set) will be blocked on February 20, 2027. External Client Apps do not support this flow.
- The SOAP login() API (`loginBySoap`, used by `login()` otherwise) will be retired in Summer '27 (API version 65.0). For more information, see [Salesforce Release Notes](https://help.salesforce.com/s/articleView?id=release-notes.rn_api_upcoming_retirement_258rn.htm&release=258&type=5).

Session refresh with a username and password stops working at the same time. Please migrate to one of the following flows:

- OAuth 2.0 Web Server Flow with PKCE, for interactive login (create `OAuth2` with `useVerifier: true`, then use `OAuth2#getAuthorizationUrl()` and `Connection#authorize()`)
- OAuth 2.0 JWT Bearer Flow, for server-to-server integration
- OAuth 2.0 Client Credentials Flow, for server-to-server integration

If you have any questions first file it on [issues](https://github.com/jsforce/jsforce/issues) before contacting authors via e-mail.

## How to build/run tests:
See [DEVELOPING.md](./DEVELOPING.md)


## Contributions

Your contributions are welcome: both by reporting issues on [GitHub issues](https://github.com/jsforce/jsforce/issues) or pull-requesting patches.

If you want to implement any additional features, to be added to JSforce to our main branch, which may or may not be merged please first check current [opening issues](https://github.com/jsforce/jsforce/issues?q=is%3Aopen) with milestones and confirm whether the feature is on road map or not.

If your feature implementation is brand-new or fixing unsupposed bugs in the library's test cases, please include additional test codes in the `test/` directory.
