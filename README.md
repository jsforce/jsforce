# node-salesforce -- Connecting Salesforce via REST Api

## Abstract

node-salesforce is designed to be the wrapper of salesforce REST API from Node.js, much more style. Authentication module is separated so light-weight. It works both on OAuth2 access token and session Id from Session ID.

## Install

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
    alert(conn.accessToken);
    //...logic after authentication
  }
});
```

```javascript
var sf = require('node-salesforce');
var conn = new sf.Connection();
conn.login(username, password, function(err) {
  if (!err) {
    alert(conn.accessToken);
    //...logic after authentication
  }
});
```


