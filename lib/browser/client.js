/**
 * @file Browser client connection management class
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
var events = require('events'),
    util = require('util'),
    qs = require('querystring'),
    _ = require('underscore'),
    Connection = require('../connection'),
    OAuth2 = require('../oauth2');

/**
 * @private
 */
function popupWin(url, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, null, 'toolbar=no,status=no,menubar=no,width='+w+',height='+h+',top='+top+',left='+left);
}

/**
 * @private
 */
function checkCallbackResponse(w) {
  var params;
  if (isSameOrigin(w)) {
    if (w.location.hash) {
      params = qs.parse(w.location.hash.substring(1));
      if (params.access_token) {
        return { success: true, body: params };
      }
    } else if (w.location.search) {
      params = qs.parse(w.location.search.substring(1));
      if (params.error) {
        return { success: false, error: params };
      }
    }
  }
}

/**
 * @private
 */
function isSameOrigin(w) {
  return location.origin ? 
    location.origin === w.location.origin :
    (location.hostname === w.location.hostname && 
     location.port === w.location.port &&
     location.protocol === w.location.protocol);
}

/** @private **/
var clientIdx = 0;


/**
 * @class
 * @todo add document
 */
var Client = function() {
  this._prefix = 'sf' + clientIdx++;
  this.connection = null;
};

util.inherits(Client, events.EventEmitter);

/**
 *
 */
Client.prototype.init = function(config) {
  this.config = config;
  this.connection = new Connection(config);
  var tokens = this._getTokens();
  if (tokens) {
    this.connection.initialize(tokens);
    var self = this;
    setTimeout(function() {
      self.emit('connect', self.connection);
    }, 10);
  }
};

/** 
 *
 */
Client.prototype.login = function(options, callback) {
  if (_.isFunction(options)) {
    callback = options;
    options = {};
  }
  options = options || {}; 
  callback = callback || function(){ };
  _.extend(options, this.config);
  var self = this;
  var oauth2 = new OAuth2(options);
  var state = Math.random().toString(36).substring(2);
  var authzUrl = oauth2.getAuthorizationUrl({
    response_type: 'token',
    scope : options.scope,
    state: state
  });
  var size = options.popup || {};
  var w = popupWin(authzUrl, size.width || 912, size.height || 513);
  var pid = setInterval(function() {
    try {
      if (w.closed) {
        clearInterval(pid);
        callback(null, { status: 'cancel' });
      } else {
        var res = checkCallbackResponse(w);
        w.close();
        clearInterval(pid);
        if (res.success && res.body.state === state) {
          self._storeTokens(res.body);
          self.connection.initialize({
            accessToken: res.body.access_token,
            instanceUrl: res.body.instance_url
          });
          self.emit('connect', self.connection);
          callback(null, { status: 'connect', body: res.body });
        } else if (!res.success) {
          var error = new Error(res.error.error + ": " + res.error.error_description);
          callback(error);
        }
      }
    } catch(e) {}
  }, 1000);
};

/**
 *
 */
Client.prototype.isLoggedIn = function() {
  return !!(this.connection && this.connection.accessToken);
};

/**
 * 
 */
Client.prototype.logout = function() {
  this.connection.logout();
  this._removeTokens();
  this.emit('disconnect');
};

/**
 * @private
 */
Client.prototype._getTokens = function() {
  var regexp = new RegExp("(^|;\\s*)"+this._prefix+"_loggedin=true(;|$)");
  if (document.cookie.match(regexp)) {
    var issuedAt = Number(localStorage.getItem(this._prefix+'_issued_at'));
    if (Date.now() < issuedAt + 2 * 60 * 60 * 1000) { // 2 hours
      return {
        accessToken: localStorage.getItem(this._prefix + '_access_token'),
        instanceUrl: localStorage.getItem(this._prefix + '_instance_url'),
      };
    }
  }
  return null;
};

/**
 * @private
 */
Client.prototype._storeTokens = function(params) {
  localStorage.setItem(this._prefix + '_access_token', params.access_token);
  localStorage.setItem(this._prefix + '_instance_url', params.instance_url);
  localStorage.setItem(this._prefix + '_issued_at', params.issued_at);
  document.cookie = this._prefix + '_loggedin=true;';
};

/**
 * @private
 */
Client.prototype._removeTokens = function() {
  localStorage.removeItem(this._prefix + '_access_token');
  localStorage.removeItem(this._prefix + '_instance_url');
  localStorage.removeItem(this._prefix + '_issued_at');
  document.cookie = this._prefix + '_loggedin=';
};

/**
 *
 */
module.exports = new Client();

module.exports.Client = Client;
