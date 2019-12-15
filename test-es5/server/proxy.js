/*global process */

/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    request = require('request');

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3123);
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

var proxyCounter = 0;

app.all('/proxy/?*', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,Salesforceproxy-Endpoint,X-Authorization,X-SFDC-Session,SOAPAction');
  if (req.method === 'OPTIONS') {
    return res.end();
  }
  var contentType = "application/x-www-form-urlencoded";
  var sfEndpoint = req.headers["salesforceproxy-endpoint"];
  if (!/^https:\/\/[a-zA-Z0-9\.\-]+\.(force|salesforce|database)\.com\//.test(sfEndpoint)) {
    return res.send(400, "Proxying endpoint is not allowed.");
  }
  var params = {
    url: sfEndpoint || "https://login.salesforce.com//services/oauth2/token",
    method: req.method,
    headers: {
      "Content-Type": req.headers["content-type"],
      "Authorization": req.headers["x-authorization"] || req.headers.authorization,
      "X-SFDC-Session": req.headers["x-sfdc-session"]
    }
  };
  proxyCounter++;
  console.log("(++req++) " + new Array(proxyCounter+1).join('*'));
  console.log("method=" + params.method + ", url=" + params.url);
  req.pipe(request(params))
    .on('response', function() {
      proxyCounter--;
      console.log("(--res--) " + new Array(proxyCounter+1).join('*'));
    })
    .on('error', function() {
      proxyCounter--;
      console.log("(--err--) " + new Array(proxyCounter+1).join('*'));
    })
    .pipe(res);
});

app.get('/', function(req, res) {
  res.send('Node-Salesforce AJAX Proxy');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
