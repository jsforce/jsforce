# node-salesforce -- Salesforce API Connection Library for Node.js Applications

[![Build Status](https://secure.travis-ci.org/stomita/node-salesforce.png?branch=travis-ci)](http://travis-ci.org/stomita/node-salesforce)

## Abstract

Node-salesforce, which is designed to be a wrapper of Salesforce REST API in Node.js, enables Salesforce application development in event-driven style.
It capsulates the access to REST API end point in asynchronous JavaScript function call.
You can use both OAuth2 access token and SOAP login sessionId for API authentication.


## Install

<pre>
  npm install node-salesforce
</pre>

or

<pre>
  git clone git://github.com/stomita/node-salesforce.git 
  cd node-salesforce
  npm link
</pre>


## Establish Connection 

### Using Session ID

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  serverUrl : '<your Salesforce server URL (e.g. https://na1.salesforce.com) is here>',
  sessionId : '<your Salesforce session ID is here>'
});
```

### Using OAuth2 Access Token

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  instanceUrl : '<your Salesforce server URL (e.g. https://na1.salesforce.com) is here>',
  accessToken : '<your Salesforrce OAuth2 access token is here>'
});
```

### Using OAuth2 Access Token with Refresh Token (automatically refresh access token when expired)

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


### Username and Password Login (SOAP API)

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com'
});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  console.log(conn.accessToken);
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ...
});
```

### Username and Password Login (OAuth2 Resource Owner Password Credential)

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  oauth2 : {
    clientId : '<your Salesforce OAuth2 client ID is here>',
    clientSecret : '<your Salesforce OAuth2 client secret is here>',
    redirectUri : '<callback URI is here>'
  }
});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  console.log(conn.accessToken);
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ...
});
```

### Logout (Only for SOAP API session)

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

## OAuth2 Web Server Flow

### Authorization Request

```javascript
var sf = require('node-salesforce');

//
// Following example is using express.js framework
// 
// get authz url and redirect to it.
app.get('/oauth2/auth', function(req, res) {
  var conn = new sf.Connection({
    oauth2 : {
      clientId : '<your Salesforce OAuth2 client ID is here>',
      clientSecret : '<your Salesforce OAuth2 client secret is here>',
      redirectUri : '<callback URI is here>'
    }
  });
  res.redirect(conn.oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});
```

### Access Token Request

```javascript
// pass received authz code and get access token
app.get('/oauth2/callback', function(req, res) {
  var conn = new sf.Connection({
    oauth2 : {
      clientId : '<your Salesforce OAuth2 client ID is here>',
      clientSecret : '<your Salesforce OAuth2 client secret is here>',
      redirectUri : '<callback URI is here>'
    }
  });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    console.log(conn.accessToken);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
  });
});
```


## Query Records

### Using SOQL

#### Event-Driven Style

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
  .run({ autoFetch : true, maxFetch : 4000 });
```

#### Callback Style

```javascript
var records = [];
conn.query("SELECT Id, Name FROM Account", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
});
```

### Using JSON-style Query object and method chaining (like MongoDB)

```javascript
// following query is equivalent to this SOQL
// "SELECT Id, Name, CreatedDate FROM Contact
//  WHERE LastName LIKE 'A%' AND CreatedDate >= YESTERDAY AND Account.Name = 'Sony, Inc.'
//  ORDER BY CreatedDate DESC, Name ASC
//  LIMIT 5 OFFSET 10"
conn.sobject("Contact")
  .find({
    LastName : { $like : 'A%' },
    CreatedDate: { $gte : sf.Date.YESTERDAY },
    'Account.Name' : 'Sony, Inc.'
  }, {
    Id: 1,
    Name: 1,
    CreatedDate: 1
  })
  .sort({ CreatedDate: -1, Name : 1 })
  .limit(5)
  .skip(10)
  .execute(function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  });
```

## CRUD Operation

### Retrieve

```javascript
conn.sobject("Account").retrieve("0017000000hOMChAAO", function(err, account) {
  if (err) { return console.error(err); }
  console.log("Name : " + account.Name);
  // ...
});

// Multiple records retrieval consumes one API request per record.
// Be careful for the API quota.
conn.sobject("Account").retrieve(["0017000000hOMChAAO", "0017000000iKOZTAA4"], function(err, accounts) {
  if (err) { return console.error(err); }
  for (var i=0; i < accounts.length; i++) {
    console.log("Name : " + accounts[i].Name);
  }
  // ...
});
```

### Create 

```javascript
conn.sobject("Account").create({ Name : 'My Account #1' }, function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log("Created record id : " + ret.id);
  // ...
});
// Multiple records creation consumes one API request per record.
// Be careful for the API quota.
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

### Update

```javascript
conn.sobject("Account").update({ 
  Id : '0017000000hOMChAAO',
  Name : 'Updated Account #1'
}, function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log('Updated Successfully : ' + ret.id);
  // ...
});

// Multiple records modification consumes one API request per record.
// Be careful for the API quota.
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

### Delete

```javascript
conn.sobject("Account").del('0017000000hOMChAAO', function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log('Deleted Successfully : ' + ret.id);
});

// Multiple records deletion consumes one API request per record.
// Be careful for the API quota.
conn.sobject("Account").destroy([ // synonym of "del"
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


### Upsert

```javascript
conn.sobject("UpsertTable__c").upsert({ 
  Name : 'Record #1',
  ExtId__c : 'ID-0000001'
}, 'ExtId__c', function(err, ret) {
  if (err || !ret.success) { return console.error(err, ret); }
  console.log('Upserted Successfully');
  // ...
});
// Multiple records modification consumes one API request per record.
// Be careful for the API quota.
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


## Describe

### SObject

```javascript
conn.sobject("Account").describe(function(err, meta) {
  if (err) { return console.error(err); }
  console.log('Label : ' + meta.label);
  console.log('Num of Fields : ' + meta.fields.length);
  // ...
});
```

### Global Object

```javascript
conn.describeGlobal(function(err, res) {
  if (err) { return console.error(err); }
  console.log('Num of SObjects : ' + res.sobjects.length);
  // ...
});
```

## Streaming

```javascript
/**
 Before the subscription, you should insert appropriate PushTopic record (in this example, "InvoiceStatementUpdates") as written in Streaming API guide.
 */
conn.topic("InvoiceStatementUpdates").subscribe(function(message) {
  console.log('Event Type : ' + message.event.type);
  console.log('Event Created : ' + message.event.createdDate);
  console.log('Object Id : ' + message.sobject.Id);
});
```


## Bulk Operation

### Loading records

```javascript
// Records to insert in bulk.
var accounts = [
{ Name : 'Account #1', ... }, 
{ Name : 'Account #2', ... }, 
{ Name : 'Account #3', ... }, 
...
];

// Create bulkload job and add batch to execute loading,
var job = conn.bulk.createJob("Account", "insert");
var batch = job.createBatch();
batch.on("queue", function(batchInfo) { // fired when batch request is queued in server.
  batchId = batchInfo.id);
  jobId = batchInfo.jobId);
  // ...
});
batch.execute(acconts);

// and check the status later.
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

// or use Bulk#load() method in one call to upload records and fetch results. 
conn.bulk.load("Account", "insert", acconts, function(err, rets) {
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

// same as following calls
conn.sobject("Account").insertBulk(acconts, function(err, rets) {
  // ...
});

// 
conn.sobject("Account").bulkload("insert").execute(acconts, function(err, rets) {
  // ...
});
```

### Loading CSV file

```javascript
// CSV file to upload
var csvFileIn = require('fs').createReadStream("path/to/Account.csv");

// Create bulkload job and add batch to execute loading,
var job = conn.bulk.createJob("Account", "insert");
var batch = job.createBatch();
batch.on("queue", function(batchInfo) { // fired when batch request is queued in server.
  batchId = batchInfo.id);
  jobId = batchInfo.jobId);
  // ...
});

// connect any readable stream via pipe method
csvFileIn.pipe(batch.stream());


// or use Bulk#load() method in one call to upload file and fetch results. 
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

## Record Stream Pipeline

### 
```javascript
// DELETE FROM Account WHERE CreatedDate < LAST_YEAR
var Account = conn.sobject('Account');
Account.find({ CreatedDate: { $lt: sf.Date.LAST_YEAR }})
       .pipe(Account.deleteBulk())
       .on('response', function(rets){
         // ...
       })
       .on('error', function(err) {
         // ...
       });

// UPDATE Opportunity SET Name = Accout.Name + ' - ' + Name WHERE Account.Id = :accId
var Opportunity = conn.sobject('Opportunity');
Opportunity.find({ "Account.Id" : accId },
                 { Id: 1, Name: 1, "Account.Name": 1 })
           .pipe(sf.RecordStream.map(function(r) {
             r.Name = r.Account.Name + ' - ' + r.Name;
             return r;
           }))
           .pipe(Opportunity.updateBulk())
           .on('response', function(rets) {
             // ...
           })
           .on('error', function(err) {
             // ...
           });

// Export all account records to CSV file
var csvFileOut = require('fs').createWriteStream('path/to/Account.csv');
conn.query("SELECT Id, Name, Type, BillingState, BillingCity, BillingStreet FROM Account")
    .stream()
    .pipe(csvFileOut);

```

### Data migration via bulk stream

```javascript

// Connection for org which migrate to
var conn1 = new sf.Connection(
  // ...
);

// Connection for org which migrate to
var conn2 = new sf.Connection(
  // ...
);

var query = conn1.query("SELECT Id, Name, Type, BillingState, BillingCity, BillingStreet FROM Account");
var job = conn2.bulk.createJob("Account", "insert");
var batch = job.createBatch();
query.pipe(batch);
batch.on('queue', function() {
  //...
  jobId = job.id;
  batchId = batch.id;
})

```


## Change History

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



