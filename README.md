# node-salesforce 

Salesforce API Connection Library for Node.js Applications

[![Build Status](https://secure.travis-ci.org/stomita/node-salesforce.png?branch=travis-ci)](http://travis-ci.org/stomita/node-salesforce)

## Abstract

Node-salesforce, which is designed to be a wrapper of Salesforce REST API in Node.js, enables Salesforce application development in event-driven style.
It capsulates the access to REST API end point in asynchronous JavaScript function call.
You can use both OAuth2 authorization scheme and SOAP API login for API authentication.


## Install

If you are using node-salesforce as an API library in your Node.js project :

<pre>
  $ npm install node-salesforce
</pre>

If you want to utilize node-salesforce REPL (interactive API console) in tty:

<pre>
  $ npm install node-salesforce -g
</pre>

If you want to get the latest from GitHub :

<pre>
  $ git clone git://github.com/stomita/node-salesforce.git 
  $ cd node-salesforce
  $ npm link
</pre>


## API Usage

### Connection

#### Username and Password Login

When you have Salesforce username and password (and maybe security token if required), you can use `Connection#login(username, password)` to establish connection to Salesforce.

By default, it uses SOAP login API (so no OAuth2 client information is required).

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com'
});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ...
});
```

#### Username and Password Login (OAuth2 Resource Owner Password Credential)

When OAuth2 client information is given, `Connection#login(username, password)` uses OAuth2 Resource Owner Password Credential flow to login to Salesforce.

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    // loginUrl : 'https://test.salesforce.com',
    clientId : '<your Salesforce OAuth2 client ID is here>',
    clientSecret : '<your Salesforce OAuth2 client secret is here>',
    redirectUri : '<callback URI is here>'
  }
});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ...
});
```

#### Session ID

If Salesforce session ID and its server URL information is passed from Salesforce (from 'Custom Link' or something), you can pass it to constructor.


```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  serverUrl : '<your Salesforce server URL (e.g. https://na1.salesforce.com) is here>',
  sessionId : '<your Salesforce session ID is here>'
});
```

#### Access Token

After the login API call or OAuth2 authorization, you can get Salesforce access token and its instance URL. Next time you can use them to establish connection.

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  instanceUrl : '<your Salesforce server URL (e.g. https://na1.salesforce.com) is here>',
  accessToken : '<your Salesforrce OAuth2 access token is here>'
});
```

#### Access Token with Refresh Token

If refresh token is given in constructor, the connection will automatically refresh access token when it has expired 

NOTE: Refresh token is only available for OAuth2 authorization code flow.

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  oauth2 : {
    clientId : '<your Salesforce OAuth2 client ID is here>',
    clientSecret : '<your Salesforce OAuth2 client secret is here>',
    redirectUri : '<your Salesforce OAuth2 redirect URI is here>'
  },
  instanceUrl : '<your Salesforce server URL (e.g. https://na1.salesforce.com) is here>',
  accessToken : '<your Salesforrce OAuth2 access token is here>',
  refreshToken : '<your Salesforce OAuth2 refresh token is here>'
});
conn.on("refresh", function(accessToken, res) {
  // Refresh event will be fired when renewed access token
  // to store it in your storage for next request
});
```


#### Logout

`Connection#logout()` to logout from server and invalidate current session. Currently this method only works for SOAP API session.

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  sessionId : '<session id to logout>',
  serverUrl : '<your Salesforce Server url to logout is here>'
});
conn.logout(function(err) {
  if (err) { return console.error(err); }
  // now the session has been expired.
});
```

### OAuth2 Authorization

(Following examples are assuming running on express.js framework.)

#### Authorization Request

First, you should redirect user to Salesforce page to get authorized. You can get Salesforce authorization page URL by `OAuth2#getAuthorizationUrl(options)`.

```javascript
var sf = require('node-salesforce');
//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new sf.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  clientId : '<your Salesforce OAuth2 client ID is here>',
  clientSecret : '<your Salesforce OAuth2 client secret is here>',
  redirectUri : '<callback URI is here>'
});
//
// Get authz url and redirect to it.
//
app.get('/oauth2/auth', function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});
```


#### Access Token Request

After the acceptance of authorization request, your app is callbacked from Salesforce with authorization code in URL parameter. Pass the code to `Connection#authorize(code)` and get access token.

```javascript
//
// Pass received authz code and get access token
//
app.get('/oauth2/callback', function(req, res) {
  var conn = new sf.Connection({ oauth2 : oauth2 });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
  });
});
```


### Query

#### Using SOQL

By using `Connection#query(soql)`, you can achieve very basic SOQL query to fetch Salesforce records.

```javascript
var records = [];
conn.query("SELECT Id, Name FROM Account", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
});
```

##### Callback Style

There are two ways to retrieve the result records.

As we have seen above, our package provides widely-used callback style API call for query execution. It returns one API call result in its callback.

```javascript
var records = [];
conn.query("SELECT Id, Name FROM Account", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
  console.log("done ? : " + result.done);
  if (!result.done) {
    // you can use the locator to fetch next records set.
    // Connection#queryMore()
    console.log("next records URL : " + result.nextRecordsUrl);
  }
});
```

##### Event-Driven Style

When a query is executed, it emits "record" event for each fetched record. By listening the event you can collect fetched records.

If you want to fetch records exceeding the limit number of returning records per one query, you can use `autoFetch` option in `Query#execute(options)` (or its synonym `Query#exec(options)`, `Query#run(options)`) method. It is recommended to use `maxFetch` option also, if you have no idea how large the query result will become.

When query is completed, `end` event will be fired. The `error` event occurs something wrong when doing query.

```javascript
var records = [];
conn.query("SELECT Id, Name FROM Account")
  .on("record", function(record) {
    records.push(record);
  })
  .on("end", function(query) {
    console.log("total in database : " + query.totalSize);
    console.log("total fetched : " + query.totalFetched);
  })
  .on("error", function(err) {
    console.error(err);
  })
  .run({ autoFetch : true, maxFetch : 4000 }); // synonym of Query#execute();
```

#### Using Query Method-Chain

##### Basic Method Chaining

By using `SObject#find(conditions, fields)`, you can do query in JSON-based condition expression (like MongoDB). By chaining other query construction methods, you can create a query programatically.

```javascript
//
// Following query is equivalent to this SOQL
//
// "SELECT Id, Name, CreatedDate FROM Contact
//  WHERE LastName LIKE 'A%' AND CreatedDate >= YESTERDAY AND Account.Name = 'Sony, Inc.'
//  ORDER BY CreatedDate DESC, Name ASC
//  LIMIT 5 OFFSET 10"
//
conn.sobject("Contact")
  .find(
    // conditions in JSON object
    { LastName : { $like : 'A%' },
      CreatedDate: { $gte : sf.Date.YESTERDAY },
      'Account.Name' : 'Sony, Inc.' },
    // fields in JSON object
    { Id: 1,
      Name: 1,
      CreatedDate: 1 }
  )
  .sort({ CreatedDate: -1, Name : 1 })
  .limit(5)
  .skip(10)
  .execute(function(err, records) {
    if (err) { return console.error(err); }
    console.log("fetched : " + records.length);
  });
```

Another representation of the query above.

```javascript
conn.sobject("Contact")
  .find({
    LastName : { $like : 'A%' },
    CreatedDate: { $gte : sf.Date.YESTERDAY },
    'Account.Name' : 'Sony, Inc.'
  },
    'Id, Name, CreatedDate' // fields can be string of comma-separated field names
                            // or array of field names (e.g. [ 'Id', 'Name', 'CreatedDate' ])
  )
  .sort('-CreatedDate Name') // if "-" is prefixed to field name, considered as descending.
  .limit(5)
  .skip(10)
  .execute(function(err, records) {
    for (var i=0; i<records.length; i++) {
      var record = records[i];
      console.log("Name: " + record.Name);
      console.log("Created Date: " + record.CreatedDate);
    }
  });
```

##### Wildcard Fields

When `fields` argument is omitted in `SObject#find(conditions, fields)` call, it will implicitly describe current SObject fields before the query (lookup cached result first, if available) and then fetch all fields defined in the SObject.

NOTE: In the version less than 0.6, it fetches only `Id` field if `fields` argument is omitted.

```javascript
conn.sobject("Contact")
  .find({ CreatedDate: sf.Date.TODAY }) // "fields" argument is omitted
  .execute(function(err, records) {
    // ...
  });
```

The above query is equivalent to:

```javascript
conn.sobject("Contact")
  .find({ CreatedDate: sf.Date.TODAY }, '*') // fields in asterisk, means wildcard.
  .execute(function(err, records) {
    // …
  });
```


Query can also be represented in more SQL-like verbs - `SObject#select(fields)`, `Query#where(conditions)`, `Query#orderby(sort, dir)`, and `Query#offset(num)`.

```javascript
conn.sobject("Contact")
  .select('*, Account.*') // asterisk means all fields in specified level are target.
  .where("CreatedDate = TODAY") // conditions in raw SOQL where clause.
  .limit(10)
  .offset(20) // synonym of "skip"
  .execute(function(err, records) {
    for (var i=0; i<records.length; i++) {
      var record = records[i];
      console.log("First Name: " + record.FirstName);
      console.log("Last Name: " + record.LastName);
      // fields in Account relationship are fetched
      console.log("Account Name: " + record.Account.Name); 
    }
  });
```

You can also include child relationship records into query result by calling `Query#include(childRelName)`. After `Query#include(childRelName)` call, it enters into the context of child query. In child query context, query construction call is applied to the child query. Use `SubQuery#end()` to recover from the child context.


```javascript
//
// Following query is equivalent to this SOQL
//
// "SELECT Id, FirstName, LastName, ..., 
//         Account.Id, Acount.Name, ...,
//         (SELECT Id, Subject, … FROM Cases
//          WHERE Status = 'New' AND OwnerId = :conn.userInfo.id
//          ORDER BY CreatedDate DESC)
//  FROM Contact
//  WHERE CreatedDate = TODAY
//  LIMIT 10 OFFSET 20"
//
conn.sobject("Contact")
  .select('*, Account.*')
  .include("Cases") // include child relationship records in query result. 
     // after include() call, entering into the context of child query.
     .select("*")
     .where({
        Status: 'New',
        OwnerId : conn.userInfo.id,
     })
     .orderby("CreatedDate", "DESC")
     .end() // be sure to call end() to exit child query context
  .where("CreatedDate = TODAY")
  .limit(10)
  .offset(20)
  .execute(function(err, records) {
    for (var i=0; i<records.length; i++) {
      var record = records[i];
      console.log("First Name: " + record.FirstName);
      console.log("Last Name: " + record.LastName);
      // fields in Account relationship are fetched
      console.log("Account Name: " + record.Account.Name); 
      // 
      if (record.Cases) {
        console.log("Cases total: " + record.Cases.totalSize);
        console.log("Cases fetched: " + record.Cases.records.length);
      }
    }
  });
```



### CRUD Operation

We support basic "CRUD" operation for records. It also supports multiple record manipulation, but it consumes one API request per record. Be careful for the API quota.

#### Retrieve

`SObject#retrieve(id)` fetches a record or records specified by id(s) in first argument.

```javascript
//
//
conn.sobject("Account").retrieve("0017000000hOMChAAO", function(err, account) {
  if (err) { return console.error(err); }
  console.log("Name : " + account.Name);
  // ...
});
//
//
conn.sobject("Account").retrieve([
  "0017000000hOMChAAO",
  "0017000000iKOZTAA4"
], function(err, accounts) {
  if (err) { return console.error(err); }
  for (var i=0; i < accounts.length; i++) {
    console.log("Name : " + accounts[i].Name);
  }
  // ...
});
```

#### Create 

`SObject#create(record)` (or its synonym `SObject#insert(record)`) creates a record or records given in first argument.

```javascript
//
//
conn.sobject("Account").create({ Name : 'My Account #1' }, function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log("Created record id : " + ret.id);
  // ...
});
//
//
conn.sobject("Account").create([
  { Name : 'My Account #1' },
  { Name : 'My Account #2' }
],
function(err, rets) {
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("Created record id : " + rets[i].id);
    }
  }
  // ...
});
```

#### Update

`SObject#update(record)` updates a record or records given in first argument.

```javascript
//
//
conn.sobject("Account").update({ 
  Id : '0017000000hOMChAAO',
  Name : 'Updated Account #1'
}, function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log('Updated Successfully : ' + ret.id);
  // ...
});
//
//
conn.sobject("Account").update([
  { Id : '0017000000hOMChAAO', Name : 'Updated Account #1' },
  { Id : '0017000000iKOZTAA4', Name : 'Updated Account #2' }
],
function(err, rets) {
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("Updated Successfully : " + rets[i].id);
    }
  }
});
```

#### Delete

`SObject#destroy(id)` (or its synonym `SObject#del(id)`, `SObject#delete(id)`) deletes a record or records given in first argument.

```javascript
//
//
conn.sobject("Account").destroy('0017000000hOMChAAO', function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log('Deleted Successfully : ' + ret.id);
});
//
//
conn.sobject("Account").del([ // synonym of "destroy"
  '0017000000hOMChAAO',
  '0017000000iKOZTAA4'
}], 
function(err, rets) {
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("Deleted Successfully : " + rets[i].id);
    }
  }
});
```


#### Upsert

`SObject#upsert(record, extIdField)` will upsert a record or records given in first argument. External ID field name must be specified in second argument.


```javascript
//
//
conn.sobject("UpsertTable__c").upsert({ 
  Name : 'Record #1',
  ExtId__c : 'ID-0000001'
}, 'ExtId__c', function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log('Upserted Successfully');
  // ...
});
//
//
conn.sobject("UpsertTable__c").upsert([
 { Name : 'Record #1', ExtId__c : 'ID-0000001' },
 { Name : 'Record #2', ExtId__c : 'ID-0000002' }
],
'ExtId__c',
function(err, rets) {
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("Upserted Successfully");
    }
  }
  // ...
});
```


### Metadata Description

Metadata description API for Salesforce object.

#### Describe SObject

You can use `SObject#describe()` to fetch SObject metadata,

```javascript
conn.sobject("Account").describe(function(err, meta) {
  if (err) { return console.error(err); }
  console.log('Label : ' + meta.label);
  console.log('Num of Fields : ' + meta.fields.length);
  // ...
});
```

or can use `Connection#describe(sobjectType)` alternatively.

```javascript
conn.describe("Account", function(err, meta) {
  if (err) { return console.error(err); }
  console.log('Label : ' + meta.label);
  console.log('Num of Fields : ' + meta.fields.length);
  // ...
});
```

#### Describe Global

`SObject#describeGlobal()` returns all SObject information registered in Salesforce (without detail information like fields, childRelationships).

```javascript
conn.describeGlobal(function(err, res) {
  if (err) { return console.error(err); }
  console.log('Num of SObjects : ' + res.sobjects.length);
  // ...
});
```

#### Cache

Each description API has "cached" version with suffix of `$` (coming from similar pronounce "cash"), which keeps the API call result for later use.

```javascript
//
// First lookup local cache, and then call remote API if cache doesn't exist.
//
conn.sobject("Account").describe$(function(err, meta) {
  if (err) { return console.error(err); }
  console.log('Label : ' + meta.label);
  console.log('Num of Fields : ' + meta.fields.length);
  // ...
});
//
// If you can assume it should have already cached the result,
// you can use synchronous call to access the result;
//
var meta = conn.sobject("Account").describe$();
console.log('Label : ' + meta.label);
console.log('Num of Fields : ' + meta.fields.length);
// ...
```

Cache clearance should be done explicitly by developers.

```javascript
//
// Delete cache of 'Account' SObject description result
//
conn.sobject('Account').describe$.clear();
//
// Delete cache of global sobject description
//
conn.describeGlobal$.clear();
//
// Delete all API caches in connection.
//
conn.cache.clear();
```



### Streaming API

You can subscribe topic and receive message from Salesforce Streaming API, by using `Topic#subscribe(topicName, listener)`.

Before the subscription, you should insert appropriate PushTopic record (in this example, "InvoiceStatementUpdates") as written in Streaming API guide.

```javascript
conn.streaming.topic("InvoiceStatementUpdates").subscribe(function(message) {
  console.log('Event Type : ' + message.event.type);
  console.log('Event Created : ' + message.event.createdDate);
  console.log('Object Id : ' + message.sobject.Id);
});
```

NOTE: Before version 0.6, there are `Connection#topic(topicName)` to access streaming topic object, and `Connection#subscribe(topicName, listener)` is used to subscribe altenatively. These methods are now obsolete and use `Streaming#topic(topicName)` and `Streaming#subscribe(topicName, listener)` through `streaming` API object in connection object instead.


### Tooling API

You can use Tooling API to execute anonymous Apex Code, by passing apex code string text to `Tooling#executeAnonymous`.

```javascript
// execute anonymous Apex Code
var apexBody = "System.debug('Hello, World');";
conn.tooling.executeAnonymous(apexBody, function(err, res) {
  if (err) { return console.error(err); }
  console.log(res.compiled); // compiled successfully
  console.log(res.success); // executed successfully
  // ...
});
```

### Analytics API

By using Analytics API, you can get the output result from a report registered in Salesforce.

`Analytics#reports()` lists recently accessed reports.

```javascript
// get recent reports
conn.analytics.reports(function(err, reports) {
  if (err) { return console.error(err); }
  for (var i=0; i < reports.length; i++) {
    console.log(reports[i].id);
    console.log(reports[i].name);
  }
  // ...
});
```

`Analytics#report(reportId)` gives a reference to the report object specified in `reportId`.
By calling `Report#execute(options)`, the report is exected in Salesforce, and returns executed result synchronously.
Please refer to Analytics API document about the format of retruning result.

```javascript
// get report reference
var reportId = '00O10000000pUw2EAE';
var report = conn.analytics.report(reportId);

// execute report synchronously
report.execute(function(err, result) {
  if (err) { return console.error(err); }
  console.log(result.reportMetadata);
  console.log(result.factMap);
  console.log(result.factMap["T!T"]);
  console.log(result.factMap["T!T"].aggregates);
  // ...
});
```

Setting `details` to true in `options`, it returns execution result with detail rows.

```javascript
// execute report synchronously with details option,
// to get detail rows in execution result.
report.execute({ details: true }, function(err, result) {
  if (err) { return console.error(err); }
  console.log(result.reportMetadata);
  console.log(result.factMap);
  console.log(result.factMap["T!T"]);
  console.log(result.factMap["T!T"].aggregates);
  console.log(result.factMap["T!T"].rows); // <= detail rows in array
  // ...
});
```

You can override report behavior by putting `metadata` object in `options`.
For example, following code shows how to update filtering conditions of a report on demand.

```javascript
// overriding report metadata
var metadata = { 
  reportMetadata : {
    reportFilters : [{
      column: 'COMPANY',
      operator: 'contains',
      value: ',Inc.'
    }]
  }
};
// execute report synchronously with overridden filters.
report.execute({ metadata : metadata }, function(err, result) {
  if (err) { return console.error(err); }
  console.log(result.reportMetadata);
  console.log(result.reportMetadata.reportFilters.length); // <= 1
  console.log(result.reportMetadata.reportFilters[0].column); // <= 'COMPANY' 
  console.log(result.reportMetadata.reportFilters[0].operator); // <= 'contains' 
  console.log(result.reportMetadata.reportFilters[0].value); // <= ',Inc.' 
  // ...
});
```

`Report#executeAsync(options)` executes the report asynchronously in Salesforce, registering an instance to the report to lookup the executed result in future.

```javascript
var instanceId;

// execute report asynchronously
report.executeAsync({ details: true }, function(err, instance) {
  if (err) { return console.error(err); }
  console.log(instance.id); // <= registered report instance id
  instanceId = instance.id;
  // ...
});

// retrieve asynchronously executed result afterward.
report.instance(instanceId).retrieve(function(err, result) {
  if (err) { return console.error(err); }
  console.log(result.reportMetadata);
  console.log(result.factMap);
  console.log(result.factMap["T!T"]);
  console.log(result.factMap["T!T"].aggregates);
  console.log(result.factMap["T!T"].rows);
  // ...
});
```

### Apex REST

If you have a static Apex class in Salesforce and are exposing it using "Apex REST" feature, you can call it by using `Apex#get(path)`, `Apex#post(path, body)`, `Apex#put(path, body)`, `Apex#patch(path, body)`, and `Apex#del(path, body)` (or its synonym `Apex#delete(path, body)`) through `apex` API object in connection object.

```javascript
// body payload structure is depending to the Apex REST method interface.
var body = { title: 'hello', num : 1 };
conn.apex.post("/MyTestApexRest/", body, function(res) {
  // the response object structure depends on the definition of apex class
});
```


### Bulk API

Node-salesforce package also supports Bulk API. It is not only mapping each Bulk API endpoint in low level, but also introducing utility interface in bulk load operations.


#### Loading From Records

First, assume that you have record set in array object to insert into Salesforce.

```javascript
//
// Records to insert in bulk.
//
var accounts = [
{ Name : 'Account #1', ... }, 
{ Name : 'Account #2', ... }, 
{ Name : 'Account #3', ... }, 
...
];
```

You can use `SObject#create(record)`, but it consumes API quota per record, so not practical for large set of records. We can use bulk API interface to load them.

Similar to Salesforce Bulk API, first create bulk job by `Bulk#createJob(sobjectType, operation)` through `bulk` API object in connection object.

Next, create a new batch in the job, by calling `Job#createBatch()` through the job object created previously.

```javascript
var job = conn.bulk.createJob("Account", "insert");
var batch = job.createBatch();
```

Then bulk load the records by calling `Batch#execute(input)` of created batch object, passing the records in `input` argument.
 
When the batch is queued in Salesforce, it is notified by `queue` event, and you can get job ID and batch ID.

```javascript
batch.execute(accounts);
batch.on("queue", function(batchInfo) { // fired when batch request is queued in server.
  batchId = batchInfo.id);
  jobId = batchInfo.jobId);
  // ...
});
```

After the batch is queued and job / batch ID is created, wait the batch completion by polling.

When the batch process in Salesforce has been completed, it is notified by `response` event with batch result information.

```javascript
var job = conn.bulk.job(jobId);
var batch = job.batch(batchId);
batch.poll(1000 /* interval(ms) */, 20000 /* timeout(ms) */); // start polling
batch.on("response", function(rets) { // fired when batch finished and result retrieved
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("#" + (i+1) + " loaded successfully, id = " + rets[i].id);
    } else {
      console.log("#" + (i+1) + " error occurred, message = " + rets[i].errors.join(', '));
    }
  }
  // ...
});
```

Alternatively, you can use `Bulk#load(sobjectType, operation, input)` interface to achieve the above process in one method call.

```javascript
conn.bulk.load("Account", "insert", accounts, function(err, rets) {
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("#" + (i+1) + " loaded successfully, id = " + rets[i].id);
    } else {
      console.log("#" + (i+1) + " error occurred, message = " + rets[i].errors.join(', '));
    }
  }
  // ...
});
```

Following are same calls but in different interfaces :

```javascript
conn.sobject("Account").insertBulk(accounts, function(err, rets) {
  // ...
});
```

```javascript
conn.sobject("Account").bulkload("insert").execute(accounts, function(err, rets) {
  // ...
});
```

#### Loading From CSV File

It also supports bulk loading from CSV file. Just use CSV file input stream as `input` argument in `Bulk#load(sobjectType, operation, input)`, instead of passing records in array.

```javascript
//
// Create readable stream for CSV file to upload
//
var csvFileIn = require('fs').createReadStream("path/to/Account.csv");
//
// Call Bulk#load(sobjectType, operation, input) - use CSV file stream as "input" argument
//
conn.bulk.load("Account", "insert", csvFileIn, function(err, rets) {
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("#" + (i+1) + " loaded successfully, id = " + rets[i].id);
    } else {
      console.log("#" + (i+1) + " error occurred, message = " + rets[i].errors.join(', '));
    }
  }
  // ...
});
```

`Batch#stream()` returns a Node.js standard writable stream which accepts batch input. You can pipe input stream to it afterward.


```javascript
var batch = conn.bulk.load("Account", "insert");
batch.on("response", function(rets) { // fired when batch finished and result retrieved
  if (err) { return console.error(err); }
  for (var i=0; i < rets.length; i++) {
    if (rets[i].success) {
      console.log("#" + (i+1) + " loaded successfully, id = " + rets[i].id);
    } else {
      console.log("#" + (i+1) + " error occurred, message = " + rets[i].errors.join(', '));
    }
  }
);
//
// When input stream becomes available, pipe it to batch stream.
//
csvFileIn.pipe(batch.stream());
```
  

#### Updating/Deleting Queried Records

If you want to update / delete records in Salesforce which match specified condition in bulk, now you don't have to write a code which download & upload records information. `Query#update(mapping)` / `Query#destroy()` will directly manipulate records.


```javascript
//
// DELETE FROM Account WHERE CreatedDate < LAST_YEAR
//
conn.sobject('Account')
    .find({ CreatedDate : sf.Date.TODAY })
    .destroy(function(err, rets) {
      // ...
    });
```

```javascript
//
// UPDATE Opportunity 
// SET CloseDate = '2013-08-31'
// WHERE Account.Name = 'Salesforce.com'
//
conn.sobject('Opportunity')
    .find({ 'Account.Name' : 'Salesforce.com' })
    .update({ CloseDate: '2013-08-31' }, function(err, rets) {
      // ...
    });
```

In `Query#update(mapping)`, you can include simple templating notation in mapping record.

```javascript
//
// UPDATE Task 
// SET Description = CONCATENATE(Subject || ' ' || Status)
// WHERE ActivityDate = TODAY
//
conn.sobject('Task')
    .find({ ActivityDate : sf.Date.TODAY })
    .update({ Descritpion: '${Subject}  ${Status}' }, function(err, rets) {
      //
    });
```

To achieve further complex mapping, `Query#update(mapping)` accepts mapping function in `mapping` argument.

```javascript
conn.sobject('Task')
    .find({ ActivityDate : sf.Date.TODAY })
    .update(function(rec) {
      return {
        Descritpion: rec.Subject + ' ' + rec.Status
      }
    }, function(err, rets) {
      // ...
    });
```

If you are creating query object from SOQL by using `Connection#query(soql)`, the bulk delete/update operation cannot be achieved because no sobject type information available initially. You can avoid it by passing optional argument `sobjectType` in `Query#destroy(sobjectType)` or `Query#update(mapping, sobjectType)`.

```javascript
conn.query("SELECT Id FROM Account WHERE CreatedDate = TODAY")
    .destroy('Account', function(err, rets) {
      // ...
    });
```

```javascript
conn.query("SELECT Id FROM Task WHERE ActivityDate = TODAY")
    .update({ Descritpion: '${Subject}  ${Status}' }, 'Task', function(err, rets) {
      // ...
    });
```

NOTE: Be careful when using this feature not to break/lose existing data in Salesforce. Careful testing is recommended before applying the code to your production environment.



### Record Stream Pipeline

Record stream is a stream system which regards records in its stream, similar to Node.js's standard readable/writable streams.

Query object - usually returned by `Connection#query(soql)` / `SObject#find(conditions, fields)` methods - is considered as `InputRecordStream` which emits event `record` when received record from server.

Batch object - usually returned by `Job#createBatch()` / `Bulk#load(sobjectType, operation, input)` / `SObject#bulkload(operation, input)` methods - is considered as `OutputRecordStream` and have `send()` and `end()` method to accept incoming record.

You can use `InputRecordStream#pipe(outputRecordStream)` to pipe record stream.

RecordStream can be converted to usual Node.js's stream object by calling `RecordStream#stream()` method.

By default (and only currently) records are serialized to CSV string.


#### Piping Query Record Stream to Batch Record Stream

The idea of record stream pipeline is the base of bulk operation for queried record. For example, the same process of `Query#destroy()` can be expressed as following:


```javascript
//
// This is much more complex version of Query#destroy().
//
var Account = conn.sobject('Account');
Account.find({ CreatedDate: { $lt: sf.Date.LAST_YEAR }})
       .pipe(Account.deleteBulk())
       .on('response', function(rets){
         // ...
       })
       .on('error', function(err) {
         // ...
       });
```

And `Query#update(mapping)` can be expressed as following:

```javascript
//
// This is much more complex version of Query#update().
//
var Opp = conn.sobject('Opportunity');
Opp.find({ "Account.Id" : accId },
         { Id: 1, Name: 1, "Account.Name": 1 })
   .pipe(sf.RecordStream.map(function(r) {
     return { Id: r.Id,
              Name: r.Account.Name + ' - ' + r.Name };
   }))
   .pipe(Opp.updateBulk())
   .on('response', function(rets) {
     // ...
   })
   .on('error', function(err) {
     // ...
   });
```

Following is an example using `Query#stream()` (inherited `RecordStream#stream()`) to convert record stream to Node.js stream, in order to export all queried records to CSV file.

```javascript
var csvFileOut = require('fs').createWriteStream('path/to/Account.csv');
conn.query("SELECT Id, Name, Type, BillingState, BillingCity, BillingStreet FROM Account")
    .stream() // Convert to Node.js's usual readable stream.
    .pipe(csvFileOut);
```

#### Record Stream Filtering / Mapping

You can also filter / map queried records to output record stream. Static functions like `InputRecordStream#map(mappingFn)` and `InputRecordStream#filter(filterFn)` create a record stream which accepts records from upstream and pass to downstream, applying given filtering / mapping function.

```javascript
//
// Write down Contact records to CSV, with header name converted.
//
conn.sobject('Contact')
    .find({}, { Id: 1, Name: 1 })
    .map(function() {
      return { ID: r.Id, FULL_NAME: r.Name };
    })
    .stream().pipe(fs.createWriteStream("Contact.csv"));
//
// Write down Lead records to CSV file, eliminating duplicated entry with same email address.
//
var emails = {};
conn.sobject('Lead')
    .find({}, { Id: 1, Name: 1, Company: 1, Email: 1 })
    .filter(function(r) {
      var dup = emails[r.Email];
      if (!dup) { emails[r.Email] = true; }
      return !dup;
    })
    .stream().pipe(fs.createWriteStream("Lead.csv"));
```

Here is much lower level code to achieve the same result using `InputRecordStream#pipe()`.


```javascript
//
// Write down Contact records to CSV, with header name converted.
//
conn.sobject('Contact')
    .find({}, { Id: 1, Name: 1 })
    .pipe(sf.RecordStream.map(function(r) {
      return { ID: r.Id, FULL_NAME: r.Name };
    }))
    .stream().pipe(fs.createWriteStream("Contact.csv"));
//
// Write down Lead records to CSV file, eliminating duplicated entry with same email address.
//
var emails = {};
conn.sobject('Lead')
    .find({}, { Id: 1, Name: 1, Company: 1, Email: 1 })
    .pipe(sf.RecordStream.filter(function(r) {
      var dup = emails[r.Email];
      if (!dup) { emails[r.Email] = true; }
      return !dup;
    }))
    .stream().pipe(fs.createWriteStream("Lead.csv"));
```

#### Example: Data Migration

By using record stream pipeline, you can achieve data migration in a simple code.

```javascript
//
// Connection for org which migrating data from
//
var conn1 = new sf.Connection({
  // ...
});
//
// Connection for org which migrating data to
//
var conn2 = new sf.Connection({
  // ...
});
//
// Get query record stream from Connetin #1
// and pipe it to batch record stream from connection #2
//
var query = conn1.query("SELECT Id, Name, Type, BillingState, BillingCity, BillingStreet FROM Account");
var job = conn2.bulk.createJob("Account", "insert");
var batch = job.createBatch();
query.pipe(batch);
batch.on('queue', function() {
  jobId = job.id;
  batchId = batch.id;
  //...
})
```

## API Reference

See API Reference document in https://stomita.github.io/node-salesforce/doc/ .


## REPL (Interactive API Console) Usage

Node-salesforce is not merely an API library, but gives `sfjs` and `sfcoffee` REPL interface to test and inspect node-salesforce APIs in interactive JavaScript/CoffeeScript shell.

It includes buit-in support of node-salesforce package, default connection instance. In the REPL context, package root objects and API methods of default connection are exposed.

Because the REPL automatically waits the promised object during its evaluation, no callback required for all async API calls. The `_` variable keeps evaluated result in previous statement (as usual Node.JS REPL).

```
$ sfjs
> login("username@example.org", "mypassword123");
{ id: '005xxxxxxxxxxxxxxx',
  organizationId: '00Dyyyyyyyyyyyyyyy' }
> sobject('Account').find({}, "Id, Name").sort({ CreatedDate: 1}).limit(5);
[ { attributes: 
     { type: 'Account',
       url: '/services/data/v28.0/sobjects/Account/001i0000009PyDrAAK' },
    Id: '001i0000009PyDrAAK',
    Name: 'GenePoint' },
  { attributes: 
     { type: 'Account',
       url: '/services/data/v28.0/sobjects/Account/001i0000009PyDsAAK' },
    Id: '001i0000009PyDsAAK',
    Name: 'United Oil & Gas, UK' },
  { attributes: 
     { type: 'Account',
       url: '/services/data/v28.0/sobjects/Account/001i0000009PyDtAAK' },
    Id: '001i0000009PyDtAAK',
    Name: 'United Oil & Gas, Singapore' },
  { attributes: 
     { type: 'Account',
       url: '/services/data/v28.0/sobjects/Account/001i0000009PyDuAAK' },
    Id: '001i0000009PyDuAAK',
    Name: 'Edge Communications' },
  { attributes: 
     { type: 'Account',
       url: '/services/data/v28.0/sobjects/Account/001i0000009PyDvAAK' },
    Id: '001i0000009PyDvAAK',
    Name: 'Burlington Textiles Corp of America' } ]
> _[0].Name
'GenePoint'
>
```


## Change History

v0.8.0 (Jan 22, 2014):

* Support Chatter API.

* Support Metadata API.


v0.7.2 (Jan 16, 2014):

* Removed unneeded files in npm-published package.


v0.7.1 (Dec 19, 2013):

* Support SObject get updated/deleted.


v0.7.0 (Dec 11, 2013):

* Support Analytics API and Tooling API.

* Add Connection#queryAll to include deleted/archived records in query.

* Add Connection#recent to fetch recently viewed record information.

* Add RecordReference#blob(fieldName) to access blob in a record field.

* Fix installation issue in Windows environment.


v0.6.4 (Dec 5, 2013):

* Add Topic#unsubscribe for unsubscribing from a topic in Streaming API.

v0.6.3 (Oct 31, 2013):

* Fix issue in building query using $exists operator in SObject#find()

v0.6.2 (Oct 15, 2013):

* Change default Salesforce API ver. to 29.0 (Winter '14)

* Fix issue in Connection#queryMore

* Add identity URL information in the callback response of Connection#login/authorize.


v0.6.0 (Aug 23, 2013):

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

v0.5.1 (Jan 11, 2013):

* Move Query#stream() method to RecordStream#stream() to support stream serialization even in filtered stream.

v0.5.0 (Jan 11, 2013):

* Support Bulk API for insert/update/upsert/delete/hardDelete operation (except for 'query').

* Refine Query#pipe to pipe to other output record stream (like bulk upload batch).

* Add Query#stream() method to convert record stream to general node.js readable stream (generates CSV data).


v0.4.0 (Nov 05, 2012):

* Support JSON-style query object to query records other than SOQL, inspired by MongoDB query interface.

* Change default API version to 26.0 (Winter '13).

* Return logged-in user info in the callback response of Connection#login() and Connection#authorize().

* Add Connection#logout() method to terminate session explicitly (Note: only useful for SOAP API login session).


v0.3.4 (Oct 19, 2012):

* Fix issue to refresh access token multiple time in concurrent requests.

* Change to use "Bearer", not "OAuth" in HTTP Authorization header to attach access token.

* Separate oauth2 configuration into different hash object in connection constructor option
 (old style is still supported for backward compatiblity).


v0.3.2 (Oct 18, 2012):

* Fix error handling in access token refresh flow.


v0.3.1 (Jun 26, 2012):

* Add support of Node.js 0.8.x.


v0.3.0 (May 10, 2012):

* Support Salesforce Streaming API.

