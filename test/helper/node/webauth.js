var async  = require('async'),
    phantom = require('node-phantom');

module.exports = function(url, username, password, callback) {
  var ph, page;
  async.waterfall([
    function(cb) {
      phantom.create(cb);
    },
    function(_ph, cb) {
      ph = _ph;
      ph.createPage(cb);
    },
    function(_page, cb) {
      page = _page;
      page.open(url, cb);
    },
    function(status, cb) {
      setTimeout(function() {
        page.evaluate(function(username, password) {
          document.querySelector('#username').value = username;
          document.querySelector('#password').value = password;
          var e = document.createEvent('MouseEvents');
          e.initEvent("click", false, true);
          document.querySelector('button[name=Login]').dispatchEvent(e);
          return true;
        }, cb, username, password);
      }, 4000);
    },
    function(status, cb) {
      setTimeout(function() {
        page.evaluate(function() {
          if (location.href.indexOf("RemoteAccessAuthorizationPage.apexp") > 0) {
            var e = document.createEvent('MouseEvents');
            e.initEvent("click", false, true);
            document.querySelector('#oaapprove').dispatchEvent(e);
            return false;
          }
          return true;
        }, cb);
      }, 4000);
    },
    function(loaded, cb) {
      setTimeout(function() {
        page.evaluate(function() {
          var params = {};
          var m = document.querySelector('head script').innerText.match(/\/callback\?([^'"]+)/);
          if (m) {
            var qparams = m[1].split('&');
            for (var i=0; i<qparams.length; i++) {
              var qparam = qparams[i];
              var pair = qparam.split('=');
              params[pair[0]] = decodeURIComponent(pair[1]);
            }
          }
          return params;
        }, cb);
      }, loaded ? 0 : 4000);
    }
  ], function(err, params) {
    ph.exit();
    callback(err, params);
  });
};
