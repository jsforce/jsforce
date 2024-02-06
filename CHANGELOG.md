## 1.9.0 (Jul 25, 2018)
* Change API ver to 42.0
* Catch csv parsing errors and emit (#775)
* Use composite collection API for multiple records manipulation (#777)
* Use SObject collection API for query update/destroy operation (#781)
* Allow auto client registration for default client in CLI (#782)
* Add Streaming API extensions, replay extension, & auth failure detection (#740)
* Fix browser build error (#783)
* Remove JSONP endpoint as it is not working in modern browsers (#785)


## 1.8.5 (Jul 9, 2018)
* Remove the vulnerable `node-open` library (#772)


## 1.8.3 (Jul 9, 2018)
* Support OAuth PKCE, OAuth2 authz code flow without client secret (#735)


## 1.8.0 (Apr 27, 2018)
* Change API ver to 39.0 (#630)
* Fix to convert boolean to string when inserting record from bulk (#627)
* Add destroy report functionality to Analytics API (#568)
* Add dashboard functionality to Analytics API (#584, #592)
* Check that data.records isn't undefined or null before checking the num of records (#567, #575)
* Make external ID not mandantory in upsert (#589)
* Remove secure information from log outputs (#598, #608, #609)
* Add ability to specify a HTTP proxy when creating connection in Node.js (#581)


## 1.7.1 (Oct 28, 2016)
* Add `$includes` and `$excludes` operator in query builder (#530)
* Added batchId and jobId information in error object (#542)
* Fix REPL completion in node v6+ env (#554)
* Fix runTestsAsynchronous in v37.0 API to invoke via HTTP POST (#522)
* Add options in crud method to pass HTTP header information (#507)
* Add `sort` config in `Query#include()` options (#513)


## 1.7.0 (Jul 6, 2016)
* Change default API ver to 37.0 (#502)
* Update streaming API endpoint for durable generic streaming (changed from 37.0) (#502)
* Change to use stream-based CSV parser in bulk query result (#500)
* Fix identity() to use JSONP in browser env (#375)
* Fix error in Salesforce Canvas env (#464)
* Support for query options (#465)
* Fix error in logout() to remove authorized OAuth token (#466)


## 1.6.5 (May 30, 2016)
* Remove pacakge.json reference in require() call to prevent local info leackage in browserify (#479,#485)


## 1.6.3 (May 9, 2016)
* Add support of webpack bundling (#381, #452, #457)
* Fix warnings/errors in CI execution (#459, #461)


## 1.6.1 (Apr 22, 2016)
* Fix the npm published package in 1.6.0 (#420)
* Add support for Run Tests Synchronous Tooling API (#424)


## 1.6.0 (Mar 2, 2016)
* Optimize the build result when used with browserify
* Added support for custom headers in Apex REST (#372)
* Change default API ver to 36.0 (#365)
* Fix streaming api update from spring 16 (#364)
* Change underscore to lodash (#336)
* Remove support of Node.js ver 0.10.x (#334)
* Change build script from Grunt to gulp (#333)
* Setting default connection version to the latest version (#290)
* Bulk query with large result set fails silently bug enhancement (#162)


## 1.5.1 (Mar 2, 2016)
* Fix problem in using IE9 (#283)
* Fix memory leak in refreshing token when instance url has been changed (#197, #247)


## 1.5.0 (Aug 12, 2015)
* Change API version to 34.0
* Add version info in jsforce object root (#254)
* Change to accept options in all type of bulkload operation (#235)
* Fix to bubble up errors in bulk API execution (#231)
* Support explain execution plan in report and list view (#156)
* Support Force.com SOAP API method interface (#201)
* Streaming API: Generic Streaming Support (#157)
* Streaming API: Change to return subscription object in topic#subscribe() (#232)
* Tooling API: Add runTestsAsynchronous support (#191)
* Open REPL's connection registry to use in custom batch scripts (#190)
* Change to use stream3 for better stability (#176)
* Change Promise implementation (#202)
* Fix error in deploying metadata on Node 0.12 (#246)
* Refine testing environment (#244)


## 1.4.1 (Feb 25, 2015)
* Fix error in bulk API hard delete (#167) 
* Fix version num in bower.json


## 1.4.0 (Feb 17, 2015)
* Support explaining query plan for SOQL query
* Support system limits REST API endpoint
* Support describing SObject layouts/approval layouts/compact layouts in REST API
* Support describing and executing SObject listview in REST API
* Support describing and executing quick actions
* Support listing and triggering process rules
* Support submitting/approving/rejecting approvals
* Support describing themes in REST API
* Support describing tabs in REST API
* Open public `request` method in `Connection` class
* Add `.open` command in REPL to access Salesforce page
* Call option support
* Enable Bulk API to refresh session automatically
* Enable Metadata API to refresh session automatically
* Fix not to close bulk job when polling timeout occurred
* Fire progress event when polling async Metadata request status
* Change default API ver. to 33.0

## 1.3.1 (Sep 15, 2014)
* Add bower support
* Support bulk query in bulk API
* Fix issue that updating field value to null would not work in `Query#update()`
* Change the behavior of query in `autoFetch` option to return all of records in callback/promise, not only records in first query fetch.
* Add `-l <loginUrl>` or  `--sandbox` option to specify login server URL in CLI.
* Enhance bulk API not to use temporary memory in execution.
* Change metadata async api to obsolete.
* Support `logout()` even in OAuth2 sessions.
* Add API limit info in `Connection#limitInfo` object
* Separate each API object modules into multiple files in browser environment, to reduce the minimum required foot print size.
* Change default API ver to 31.0.

## v1.2.0 (May 15, 2014):

* Add `Metadata#read()` method to read metadata info in CRUD method

* Change existing asyncronous CRUD method names of Metadata API to `Metadata#createAsync()`, `Metadata#updateAsync()`, `Metadata#deleteAsync()`, as synchronous APIs are introduced in Metadata API in Spring'14

* Change default API ver. to 30.0

* Fix all errors in asynchronous callback function to raise up to top without being catched in promise chain.


## v1.1.1 (Mar 10, 2014):

* Check `Metadata#deploy()` zipInput argument type to raise error properly when unexpected input comes.

* Enable switching default login server URL in REPL by ".use" command.

* Enable option to delegate refresh token process to outer function (supposing Salesforce Hybrid SDK)


## v1.1.1 (Mar 10, 2014):

* Fix web browser client login sequence to work in mobile safari


## v1.1.0 (Feb 19, 2014):

* Added Salesforce Canvas environment support (requires canvas-all.js)


## v1.0.2 (Feb 17, 2014):

* Added web browser client utility in `jsforce.browser` object.

* Added `SObject#recent()` to get recent record items only in target SObject.

* Moved examples, api docs from README to http://jsforce.github.io/


## v1.0.1 (Feb 13, 2014):

* Enabled HTTP proxy when environment variable 'HTTP_PROXY' is available.


## v1.0.0 (Jan 30, 2014):

* Renamed the project from "Node-Salesforce" to "JSforce".

* Support running web browser environment.

* Enhanced CLI to allow OAuth2 authorization and keep connection info in local file registry.

* Support retrieving user identity information by `Connection#identity()`.


## v0.8.0 (Jan 22, 2014):

* Support Chatter API.

* Support Metadata API.


## v0.7.2 (Jan 16, 2014):

* Removed unneeded files in npm-published package.


## v0.7.1 (Dec 19, 2013):

* Support SObject get updated/deleted.


## v0.7.0 (Dec 11, 2013):

* Support Analytics API and Tooling API.

* Add Connection#queryAll to include deleted/archived records in query.

* Add Connection#recent to fetch recently viewed record information.

* Add RecordReference#blob(fieldName) to access blob in a record field.

* Fix installation issue in Windows environment.


## v0.6.4 (Dec 5, 2013):

* Add Topic#unsubscribe for unsubscribing from a topic in Streaming API.

## v0.6.3 (Oct 31, 2013):

* Fix issue in building query using $exists operator in SObject#find()

## v0.6.2 (Oct 15, 2013):

* Change default Salesforce API ver. to 29.0 (Winter '14)

* Fix issue in Connection#queryMore

* Add identity URL information in the callback response of Connection#login/authorize.


## v0.6.0 (Aug 23, 2013):

* Change default Salesforce API ver. to 28.0 (Summer '13)

* Add REPL interface for interactive API inspection.

* Return Promises/A+ interface object for all async call. The interface is also added to Query / Batch.

* Accept "*" in fields argument in `SObject#find()` to select all fields defined in SObject.

* Add `Connection#describe$()`, `Connection#describeGlobal$()`, and `SObject#describe$()`, as caching versions of correspondings.

* Changed `SObject#find(conditions, fields)` behavior in fields argument omission.

* Add `SObject#select()` and `Query#where()` methods to construct a query in SQL-like verb.

* Add `Query#update()` and `Query#destroy()` to apply bulk operation for queried records.

* Add child relationship query support in `Query#include()`

* Add Apex REST support.

* Move streaming API methods from connection object to separated object.

## v0.5.1 (Jan 11, 2013):

* Move Query#stream() method to RecordStream#stream() to support stream serialization even in filtered stream.

## v0.5.0 (Jan 11, 2013):

* Support Bulk API for insert/update/upsert/delete/hardDelete operation (except for 'query').

* Refine Query#pipe to pipe to other output record stream (like bulk upload batch).

* Add Query#stream() method to convert record stream to general node.js readable stream (generates CSV data).


## v0.4.0 (Nov 05, 2012):

* Support JSON-style query object to query records other than SOQL, inspired by MongoDB query interface.

* Change default API version to 26.0 (Winter '13).

* Return logged-in user info in the callback response of Connection#login() and Connection#authorize().

* Add Connection#logout() method to terminate session explicitly (Note: only useful for SOAP API login session).


## v0.3.4 (Oct 19, 2012):

* Fix issue to refresh access token multiple time in concurrent requests.

* Change to use "Bearer", not "OAuth" in HTTP Authorization header to attach access token.

* Separate oauth2 configuration into different hash object in connection constructor option
 (old style is still supported for backward compatiblity).


## v0.3.2 (Oct 18, 2012):

* Fix error handling in access token refresh flow.


## v0.3.1 (Jun 26, 2012):

* Add support of Node.js 0.8.x.


## v0.3.0 (May 10, 2012):

* Support Salesforce Streaming API.

