# node-salesforce -- Connecting Salesforce via REST Api

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


## Create Connection by giving OAuth2 Token

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  serverUrl : 'https://na1.salesforce.com',
  accessToken : '<your oauth2 access token is here>'
});
```

## Create Connection and Login via SOAP API

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection({
  loginUrl : 'https://login.salesforce.com'
});
conn.login(username, password, function(err) {
  if (!err) {
    // console.log(conn.accessToken);

    //
    // ... logics after authentication ...
    //
  }
});
```

## Query Records in Event-Driven Style

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

## Query Records in Callback Style

```javascript
var records = [];
conn.query("SELECT Id, Name FROM Account", function(err, result) {
  if (!err) {
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  }
});
```

## Retrieve Records by Record ID(s)

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

## Create Record(s)

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

## Update Record(s)

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

## Delete Record(s)

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


