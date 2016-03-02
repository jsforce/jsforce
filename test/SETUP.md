# Setup test environment

## Overview

As the `jsforce` is the library which accesses Salesforce API, it depends deeply on Salesforce behavior.

In general, the unit testing usually put a stub implementation aligning with the API in interface.
However, we do not use any stubs for API connection in JSforce test.

It is because their interface may change very frequently in each Salesforce seasonal updates, which is a little impossible to check all.
Additionally the official document is not accurate, not reflecting the latest, and sometime contains documentation bugs.
So we cannot rely on the API specification proposed by official.

By the reasons stated above, we choose to use the real Salesforce connection in executing the test script instead of putting a stub implementation.

As there are test scripts which assume certain records or metadata is existing in Salesforce organization before executing the test, you must follow the following setup procedure written below.
Thanks to Developer Edition it is not so difficult to prepare the dedicated organization for JSforce testing.

## Setting up and Executing Tests

1. Get a developer edition organization account from [developer.salsforce.com](http://developer.salesforce.com) (or any organization API-accessible and under your control)

2. Checkout the source code from the repository (Assuming it is checked out to `${PROJECT_ROOT}` directory).

3. Run setup script with your Salesforce account username and password (with security token).

```
$ cd ${PROJECT_ROOT}
$ SF_USERNAME=<yourusername@example.com> SF_PASSWORD=<yourpassword_and_securitytoken> ./test/bin/org-setup
```

4. Execute test scripts by `npm test`.

```
$ SF_USERNAME=<yourusername@example.com> SF_PASSWORD=<yourpassword_and_securitytoken> npm test
```

If you have `.env` file in the project root it reads the environment value automatically.

```
$ npm test
```

5. If you want to run a specific test script in `test/` directory, specify the test script name after `npm test`.
For example, if you want to run `test/streaming.test.js`, type following :

```
$ npm test streaming
```
