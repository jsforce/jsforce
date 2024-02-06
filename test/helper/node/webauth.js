'use strict';

var puppeteer = require('puppeteer' + ''); // avoid puppeteer to become browserify target

module.exports = function(url, username, password, callback) {
  var browser, page;

  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  .then(function(_browser) {
    browser = _browser;
    return browser.newPage();
  })
  .then(function(_page) {
    page = _page;
    return page.setRequestInterception(true);
  })
  .then(function() {
    page.on('request', function(request) {
      var url = request.url();
      if (url.indexOf('http://localhost') === 0) {
        request.respond({
          status: 200,
          contentType: 'text/html',
          body: '<html><body></body></html>'
        });
      } else {
        request.continue();
      }
    });
    return page.goto(url, { waitUntil: "networkidle2" });
  })
  .then(function() {
    return loginAndApprove();
  })
  .then(function(ret) {
    if (browser) { browser.close(); }
    return ret;
  })
  .catch(function(err) {
    if (browser) { browser.close(); }
    throw err;
  })
  .then(function(ret) {
    if (callback) {
      callback(null, ret);
      callback = null;
    }
  }, function(err) {
    if (callback) {
      callback(err);
      callback = null;
    }
  });

  function loginAndApprove() {
    const url = page.url();
    if (url.indexOf("/setup/secur/RemoteAccessAuthorizationPage.apexp") > 0) { // authorization page
      return page.click('#oaapprove').then(function() {
        return page.waitForNavigation({ waitUntil: "networkidle2" });
      }).then(function() {
        return page.waitFor(1000);
      }).then(function() {
        return loginAndApprove();
      });
    } else if (url.indexOf("/?ec=302") > 0) { // login page
      return page.waitFor(0).then(function() {
        return page.type("#username", username);
      })
      .then(function() {
        return page.type("#password", password);
      })
      .then(function() {
        return page.click("[name=Login]");
      })
      .then(function() {
        return page.waitForNavigation({ waitUntil: "networkidle2" });
      })
      .then(function() {
        return loginAndApprove();
      })
    } else if (url.indexOf("http://localhost") === 0) { // callback response
      return retrieveCallbackedParameters(url);
    } else if (url.indexOf("/setup/secur/RemoteAccessErrorPage.apexp") > 0) { // authorization error
      throw new Error('invalid authorization error');
    } else {
      return page.waitFor(1000).then(loginAndApprove);
    }
  }

  function retrieveCallbackedParameters(url) {
    var params = {};
    var qparams = url.split('?').pop().split('&');
    for (var i=0; i<qparams.length; i++) {
      var qparam = qparams[i];
      var pair = qparam.split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }

};
