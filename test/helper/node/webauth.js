'use strict';

var webdriverio = require('webdriverio'),
    Promise = require('promise');

module.exports = function(url, username, password, callback) {
  var client = webdriverio.remote({
    desiredCapabilities: { browserName: 'phantomjs' },
    port: process.env.WEBDRIVER_PORT || 4444
  });
  return Promise.resolve().then(function() {
    return client.init();
  }).then(function() {
    return client.url(url);
  })
  .then(function() {
    return loginAndApprove();
  })
  .then(function() {
    return retrieveCallbackedParameters();
  })
  .then(function(ret) {
    client.end();
    return ret;
  }, function(err) {
    client.end();
    throw err;
  })
  .nodeify(callback)

  function loginAndApprove() {
    var approved = false;
    return Promise.resolve().then(function() {
      return client.url().then(function(ret) { return ret.value; });
    }).then(function(url) {
      if (url.indexOf("/setup/secur/RemoteAccessAuthorizationPage.apexp") > 0) { // authorization page
        approved = true;
        return client.click('#oaapprove').then(null, function(){});
      } else if (url.indexOf("/?ec=302") > 0) { // login page
        return client.setValue("#username", username)
                     .setValue("#password", password)
                     .click("[name=Login]");
      } else {
        return client.pause(1000);
      }
    }).catch(function(err) {
      console.error(err);
      throw err;
    }).then(function() {
      return approved || loginAndApprove();
    });
  }

  function retrieveCallbackedParameters() {
    return client.url().then(function(ret) {
      return client.getSource();
    }).then(function(txt) {
      var params = {};
      var m = txt.match(/\/callback\?([^'"]+)/);
      if (m) {
        var qparams = m[1].split('&');
        for (var i=0; i<qparams.length; i++) {
          var qparam = qparams[i];
          var pair = qparam.split('=');
          params[pair[0]] = decodeURIComponent(pair[1]);
        }
      }
      return params;
    });
  }

};
