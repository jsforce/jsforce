# node-salesforce -- Salesforce API Connection Library for Node.js Applications

## Abstract

Node-salesforce, which is designed to be a wrapper of Salesforce REST API in Node.js, enables Salesforce application development in event-driven style.
It only capsulates the access of REST API end point, so it works both on OAuth2 access token and SOAP API sessionId.

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
  serverUrl : 'https://na1.salesforce.com',
  sessionId : '<your Salesforce session ID is here>'
});
```

### Using OAuth2 Access Token

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  instanceUrl : 'https://na1.salesforce.com',
  accessToken : '<your Salesforrce OAuth2 access token is here>'
// refreshToken : '<your Salesforce OAuth2 refresh token is here>'
});
```


### Username and Password Login (SOAP API)

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  loginUrl : 'https://login.salesforce.com'
// loginUrl : 'https://test.salesforce.com' // you can change login URL to point sandbox env.
});
conn.login(username, password, function(err) {
  if (!err) {
    // console.log(conn.accessToken);
    // ...
  }
});
```

### Username and Password Login (OAuth2 Resource Owner Password Credential)

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
//  loginUrl : 'https://login.salesforce.com'
  clientId : '<your Salesforce OAuth2 client ID is here>',
  clientSecret : '<your Salesforce OAuth2 client secret is here>',
  redirectUri : '<callback URI is here>'
});
conn.login(username, password, function(err) {
  if (!err) {
    // console.log(conn.accessToken);
    // ...
  }
});
```


## OAuth2 Web Server Flow

### Authorization Request

```javascript
var sf = require('node-salesforce');

// Following sample is using express
// 
// get authz url and redirect to it.
app.get('/oauth2/auth', function(req, res) {
  var conn = new sf.Connection({
    clientId : '<your Salesforce OAuth2 client ID is here>',
    clientSecret : '<your Salesforce OAuth2 client secret is here>',
    redirectUri : '<callback URI is here>'
  });
  res.redirect(conn.oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});
```

### Access Token Request

```javascript
// pass received authz code and get access token
app.get('/oauth2/callback', function(req, res) {
  var conn = new sf.Connection({
    clientId : '<your Salesforce OAuth2 client ID is here>',
    clientSecret : '<your Salesforce OAuth2 client secret is here>',
    redirectUri : '<callback URI is here>'
  });
  var code = req.param('code');
  conn.authorize(code, function(err) {
    if (!err) {
      // console.log(conn.accessToken);
      // console.log(conn.refreshToken);
      // ...
    }
  });
});
```


## Query Records 

### In Event-Driven Style

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
  .run({ autoFetch : true, maxFetch : 4000 });
```

### In Callback Style

```javascript
var records = [];
conn.query("SELECT Id, Name FROM Account", function(err, result) {
  if (!err) {
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  }
});
```

## CRUD Operation

### Retrieve

```javascript
conn.sobject("Account").retrieve("0017000000hOMChAAO", function(err, account) {
  if (!err) {
    console.log("Name : " + account.Name);
  }
});

// Multiple records retrieval consumes one API request per record.
// Be careful for the API quota.
conn.sobject("Account").retrieve(["0017000000hOMChAAO", "0017000000iKOZTAA4"], function(err, accounts) {
  if (!err) {
    for (var i=0; i<accounts.length; i++) {
      console.log("Name : " + accounts[i].Name);
    }
  }
});
```

### Create 

```javascript
conn.sobject("Account").create({ Name : 'My Account #1' }, function(err, ret) {
  if (!err && ret.success) {
    console.log("Created record id : " + ret.id);
  }
});
// Multiple records creation consumes one API request per record.
// Be careful for the API quota.
conn.sobject("Account").create([{
  Name : 'My Account #1'
}, {
  Name : 'My Account #2'
}], 
function(err, rets) {
  if (!err) {
    for (var i=0; i<rets.length; i++) {
      if (rets[i].success) {
        console.log("Created record id : " + rets[i].id);
      }
    }
  }
});
```

### Update

```javascript
conn.sobject("Account").update({ 
  Id : '0017000000hOMChAAO',
  Name : 'Updated Account #1'
}, function(err, ret) {
  if (!err && ret.success) {
    console.log('Updated Successfully : ' + ret.id);
  }
});

// Multiple records modification consumes one API request per record.
// Be careful for the API quota.
conn.sobject("Account").update([{
  Id : '0017000000hOMChAAO',
  Name : 'Updated Account #1'
}, {
  Id : '0017000000iKOZTAA4',
  Name : 'Updated Account #2'
}], 
function(err, rets) {
  if (!err) {
    for (var i=0; i<rets.length; i++) {
      if (rets[i].success) {
        console.log("Updated Successfully : " + rets[i].id);
      }
    }
  }
});
```

### Delete

```javascript
conn.sobject("Account").del('0017000000hOMChAAO', function(err, ret) {
  if (!err && ret.success) {
    console.log('Deleted Successfully : ' + ret.id);
  }
});

// Multiple records deletion consumes one API request per record.
// Be careful for the API quota.
conn.sobject("Account").destroy([ // synonym of "del"
  '0017000000hOMChAAO',
  '0017000000iKOZTAA4'
}], 
function(err, rets) {
  if (!err) {
    for (var i=0; i<rets.length; i++) {
      if (rets[i].success) {
        console.log("Deleted Successfully : " + rets[i].id);
      }
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
  if (!err && ret.success) {
    console.log('Upserted Successfully');
  }
});
// Multiple records modification consumes one API request per record.
// Be careful for the API quota.
conn.sobject("UpsertTable__c").upsert([{
  Name : 'Record #1',
  ExtId__c : 'ID-0000001'
}, {
  Name : 'Record #2',
  ExtId__c : 'ID-0000002'
}], 
'ExtId__c',
function(err, rets) {
  if (!err) {
    for (var i=0; i<rets.length; i++) {
      if (rets[i].success) {
        console.log("Upserted Successfully");
      }
    }
  }
});
```


## Describe

### SObject

```javascript
conn.sobject("Account").describe(function(err, meta) {
  if (!err) {
    console.log('Label : ' + meta.label);
    console.log('Num of Fields : ' + meta.fields.length);
  }
});
```

### Global Object

```javascript
conn.describeGlobal(function(err, res) {
  if (!err) {
    console.log('Num of SObjects : ' + res.sobjects.length);
  }
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




