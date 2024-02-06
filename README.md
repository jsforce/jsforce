# jsforce 

Salesforce API Library for JavaScript applications (both on web browser and Node.js)

[![CircleCI](https://circleci.com/gh/jsforce/jsforce.svg?style=svg)](https://circleci.com/gh/jsforce/jsforce)

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

See documentation in http://jsforce.github.io/ .

## Releases

See [Releases](https://github.com/jsforce/jsforce/releases).

## License

See [license](LICENSE) (MIT License).

## Authors

- Shinichi Tomita <shinichi.tomita@gmail.com>


## Notes

If you have any questions first file it on [issues](https://github.com/jsforce/jsforce/issues) before contacting authors via e-mail.

## Tests

In order to run tests you will need a [Salesforce Developer Org](https://developer.salesforce.com/signup)

You will also need to install the JsforceTestSuite package, which can be done by running:

    SF_USERNAME=myusername SF_PASSWORD=password+securityToken ./test/bin/org-setup

You may need to run this more then once if you encounter timeouts or dropped connections/

Finally, to run the tests simply do:

    SF_USERNAME=myusername SF_PASSWORD=password+securityToken npm run test:node

    SF_USERNAME=myusername SF_PASSWORD=password+securityToken npm run test:browser

## Contributions

Your contributions are welcome: both by reporting issues on [GitHub issues](https://github.com/jsforce/jsforce/issues) or pull-requesting patches.

If you want to implement any additional features, to be added to JSforce to our master branch, which may or may not be merged please first check current [opening issues](https://github.com/jsforce/jsforce/issues?q=is%3Aopen) with milestones and confirm whether the feature is on road map or not.

If your feature implementation is brand-new or fixing unsupposed bugs in the library's test cases, please include addtional test codes in the `test/` directory.




