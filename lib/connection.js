var events  = require('events'),
    request = require('request'),
    async   = require('async'),
    _       = require('underscore')._,
    Logger  = require('./logger'),
    OAuth2  = require('./oauth2'),
    Query   = require('./query'),
    SObject = require('./sobject');
  

/**
 * constructor
 */
var Connection = module.exports = function(options) {
  this._logger = new Logger(options && options.logLevel);
  this.initialize(options || {});
};

/**
 *
 */
Connection.prototype = new events.EventEmitter();

var loginUrl = "https://login.salesforce.com",
    instanceUrl = "https://{instance}.salesforce.com",
    version  = "26.0";

/**
 * initialize
 */
Connection.prototype.initialize = function(options) {
  this.loginUrl  = options.loginUrl || this.loginUrl || loginUrl;
  this.version   = options.version || this.version || version;
  this.instanceUrl = options.instanceUrl || options.serverUrl || this.instanceUrl || 
                     instanceUrl.replace("{instance}", options.instance || "na1");
  this.urls = {
    soap : {
      login : [ this.loginUrl, "services/Soap/u", this.version ].join('/'),
      service : [ this.instanceUrl, "services/Soap/u", this.version ].join('/')
    },
    rest : {
      base : [ this.instanceUrl, "services/data", "v" + this.version ].join('/')
    },
    streaming: {
      base : [ this.instanceUrl, "cometd", this.version ].join('/')
    }
  };
  var oauth2 = options.oauth2;
  if (!oauth2 && options.clientId) { // if oauth2 client config is written in flat (for compatibility)
    oauth2 = {
      clientId : options.clientId,
      clientSecret : options.clientSecret,
      redirectUri : options.redirectUri
    };
  }
  if (oauth2) {
    if (!(oauth2 instanceof OAuth2)) {
      oauth2 = new OAuth2(_.extend({
        authzServiceUrl : this.loginUrl + "/services/oauth2/authorize",
        tokenServiceUrl : this.loginUrl + "/services/oauth2/token"
      }, oauth2));
    }
    this.oauth2 = oauth2;
  }
  this.accessToken = options.sessionId || options.accessToken || this.accessToken;
  this.refreshToken = options.refreshToken || this.refreshToken;
  if (this.refreshToken && !this.oauth2) {
    throw new Error("Refersh token is specified without oauth2 client information");
  }
  this.userInfo = options.userInfo;
  this.maxRequest = options.maxRequest || this.maxRequest || 10;
  this._initializedAt = Date.now();
};


/**
 * Sending request to API endpoint
 * @private
 */
Connection.prototype._request = function(params, callback, noContentResponse) {
  var self = this;
  var logger = this._logger;
  var onResume = function(err) {
    if (err) {
      callback(err);
      return;
    }
    self._request(params, callback, noContentResponse); 
  };
  if (self._suspended) {
    self.once('resume', onResume);
    return;
  }
  params.headers = params.headers || {};
  if (this.accessToken) {
    params.headers.Authorization = "Bearer " + this.accessToken;
  }
  self.emit('request', params.method, params.url, params);

  logger.debug("<request> method=" + params.method + ", url=" + params.url);
  var requestTime = Date.now();

  request(params, function(err, response) {

    var responseTime = Date.now();
    logger.debug("<response> status=" + response.statusCode + ", url=" + params.url);
    logger.debug("elappsed time : " + (responseTime - requestTime) + "msec");

    if (err) {
      logger.error(err);
      callback(err);
    } else {
      self.emit('response', response.statusCode, response.body, response);
      // Refresh token if status code requires authentication
      // when oauth2 info and refresh token is available.
      if (response.statusCode === 401 && self.oauth2 && self.refreshToken) {
        // Access token may be refreshed before the response
        if (self._initializedAt > requestTime) {
          onResume();
        } else {
          if (!self._suspended) {
            self._suspended = true;
            self._refresh();
          }
          self.once('resume', onResume);
        }
        return;
      }
      if (response.statusCode >= 400) {
        var errors;
        try {
          errors = JSON.parse(response.body);
        } catch(e) {
          errors = [{ message : response.body }];
        }
        callback(errors[0]);
      } else if (response.statusCode === 204) {
        callback(null, noContentResponse);
      } else {
        var res;
        try {
          res = JSON.parse(response.body);
        } catch(e2) {
          err = e2;
        }
        if (response.statusCode === 300) { // Multiple Choices
          err = { message : 'Multiple records found' };
        }
        callback(err, res);
      }
    }
  });
};

/**
 * Refresh access token
 * @private
 */
Connection.prototype._refresh = function() {
  var self = this;
  var logger = this._logger;
  logger.debug("<refresh token>");
  this.oauth2.refreshToken(this.refreshToken, function(err, res) {
    if (!err) {
      self.initialize({
        instanceUrl : res.instance_url,
        accessToken : res.access_token
      });
      logger.debug("token refresh completed. result = " + JSON.stringify(res));
      self.emit("refresh", res.access_token, res);
    }
    self._suspended = false;
    self.emit('resume', err);
  });
};


/**
 * query
 */
Connection.prototype.query = function(soql, callback) {
  var query = new Query(this, soql);
  if (callback) {
    query.run(callback);
  }
  return query;
};

/**
 * queryMore
 */
Connection.prototype.queryMore = function(locator, callback) {
  var query = new Query(this, null, locator);
  if (callback) {
    query.run(callback);
  }
  return query;
};


/**
 * retrieve
 */
Connection.prototype.retrieve = function(type, ids, callback) {
  var self = this;
  var isArray = _.isArray(ids);
  ids = isArray ? ids : [ ids ];
  if (ids.length > self.maxRequest) {
    callback({ message : "Exceeded max limit of concurrent call" });
    return;
  }
  async.parallel(_.map(ids, function(id) {
    return function(cb) {
      var url = [ self.urls.rest.base, "sobjects", type, id ].join('/');
      self._request({
        method : 'GET',
        url : url
      }, cb);
    };
  }), function(err, results) {
    callback(err, !isArray && _.isArray(results) ? results[0] : results);
  });
};


/**
 * create
 */
Connection.prototype.create = function(type, records, callback) {
  if (arguments.length === 2) {
    type = null;
    records = type;
    callback = records;
  }
  var self = this;
  var isArray = _.isArray(records);
  records = isArray ? records : [ records ];
  if (records.length > self.maxRequest) {
    callback({ message : "Exceeded max limit of concurrent call" });
    return;
  }
  async.parallel(_.map(records, function(record) {
    return function(cb) {
      var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
      if (!sobjectType) {
        cb({ message : 'No SObject Type defined in record' });
        return;
      }
      record = _.clone(record);
      delete record.Id;
      delete record.type;
      delete record.attributes;

      var url = [ self.urls.rest.base, "sobjects", sobjectType ].join('/');
      self._request({
        method : 'POST',
        url : url,
        body : JSON.stringify(record),
        headers : {
          "Content-Type" : "application/json"
        }
      }, cb);
    };
  }), function(err, results) {
    callback(err, !isArray && _.isArray(results) ? results[0] : results);
  });
};

/**
 * update
 */
Connection.prototype.update = function(type, records, callback) {
  if (arguments.length === 2) {
    type = null;
    records = type;
    callback = records;
  }
  var self = this;
  var isArray = _.isArray(records);
  records = isArray ? records : [ records ];
  if (records.length > self.maxRequest) {
    callback({ message : "Exceeded max limit of concurrent call" });
    return;
  }
  async.parallel(_.map(records, function(record) {
    return function(cb) {
      var id = record.Id;
      if (!id) {
        cb({ message : 'Record id is not found in record.' });
        return;
      }
      var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
      if (!sobjectType) {
        cb({ message : 'No SObject Type defined in record' });
        return;
      }
      record = _.clone(record);
      delete record.Id;
      delete record.type;
      delete record.attributes;

      var url = [ self.urls.rest.base, "sobjects", sobjectType, id ].join('/');
      self._request({
        method : 'PATCH',
        url : url,
        body : JSON.stringify(record),
        headers : {
          "Content-Type" : "application/json"
        }
      }, cb, { id : id, success : true, errors : [] });
    };
  }), function(err, results) {
    callback(err, !isArray && _.isArray(results) ? results[0] : results);
  });
};

/**
 * upsert
 */
Connection.prototype.upsert = function(type, records, extIdField, callback) {
  // You can omit "type" argument, when the record includes type information.
  if (arguments.length === 3) {
    type = null;
    records = type;
    extIdField = records;
    callback = extIdField;
  }
  var self = this;
  var isArray = _.isArray(records);
  records = isArray ? records : [ records ];
  if (records.length > self.maxRequest) {
    callback({ message : "Exceeded max limit of concurrent call" });
    return;
  }
  async.parallel(_.map(records, function(record) {
    return function(cb) {
      var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
      var extId = record[extIdField];
      if (!extId) {
        cb({ message : 'External ID is not defined in the record' });
        return;
      }
      record = _.clone(record);
      delete record[extIdField];
      delete record.type;
      delete record.attributes;

      var url = [ self.urls.rest.base, "sobjects", sobjectType, extIdField, extId ].join('/');
      self._request({
        method : 'PATCH',
        url : url,
        body : JSON.stringify(record),
        headers : {
          "Content-Type" : "application/json"
        }
      }, cb, { success : true, errors : [] });
    };
  }), function(err, results) {
    callback(err, !isArray && _.isArray(results) ? results[0] : results);
  });
};



/**
 * destroy
 */
Connection.prototype.del =
Connection.prototype.destroy = function(type, ids, callback) {
  var self = this;
  var isArray = _.isArray(ids);
  ids = isArray ? ids : [ ids ];
  if (ids.length > self.maxRequest) {
    callback({ message : "Exceeded max limit of concurrent call" });
    return;
  }
  async.parallel(_.map(ids, function(id) {
    return function(cb) {
      var url = [ self.urls.rest.base, "sobjects", type, id ].join('/');
      self._request({
        method : 'DELETE',
        url : url
      }, cb, { id : id, success : true, errors : [] });
    };
  }), function(err, results) {
    callback(err, !isArray && _.isArray(results) ? results[0] : results);
  });
};


/**
 * describe
 */
Connection.prototype.describe = function(type, callback) {
  var url = [ this.urls.rest.base, "sobjects", type, "describe" ].join('/');
  this._request({
    method : 'GET',
    url : url
  }, callback);
};

/**
 * describeGlobal
 */
Connection.prototype.describeGlobal = function(callback) {
  var url = this.urls.rest.base + "/sobjects";
  this._request({
    method : 'GET',
    url : url
  }, callback);
};


/**
 * sobject
 */
Connection.prototype.sobject = function(type) {
  this._sobjects = this._sobjects || {};
  var sobject = this._sobjects[type] = 
    this._sobjects[type] || new SObject(this, type);
  return sobject;
};


/**
 * Authorize (using oauth2 web server flow)
 */
Connection.prototype.authorize = function(code, callback) {
  var self = this;
  var logger = this._logger;
  this.oauth2.requestToken(code, function(err, res) {
    if (err) {
      logger.error(err);
      callback(err);
      return;
    }
    logger.debug("OAuth2 token response = " + JSON.stringify(res));
    var idUrls = res.id.split("/");
    var userId = idUrls.pop(), orgId = idUrls.pop();
    var userInfo = {
      id: userId,
      organizationId: orgId
    };
    self.initialize({
      instanceUrl : res.instance_url,
      accessToken : res.access_token,
      refreshToken : res.refresh_token,
      userInfo : userInfo
    });
    logger.debug("<login> completed. user id = " + userId + ", org id = " + orgId);
    callback(null, userInfo);
  });
};


/**
 * login (using oauth2 username & password flow)
 */
Connection.prototype.login = function(username, password, callback) {
  if (this.oauth2) {
    this.loginByOAuth2(username, password, callback);
  } else {
    this.loginBySoap(username, password, callback);
  }
};


/**
 * Login by OAuth2 username & password flow
 */
Connection.prototype.loginByOAuth2 = function(username, password, callback) {
  var self = this;
  var logger = this._logger;
  this.oauth2.authenticate(username, password, function(err, res) {
    if (err) {
      callback(err);
      return;
    }
    logger.debug("OAuth2 token response = " + JSON.stringify(res));

    var idUrls = res.id.split("/");
    var userId = idUrls.pop(), orgId = idUrls.pop();
    var userInfo = {
      id: userId,
      organizationId: orgId
    };
    self.initialize({
      instanceUrl : res.instance_url,
      accessToken : res.access_token,
      userInfo : userInfo
    });
    logger.debug("<login> completed. user id = " + userId + ", org id = " + orgId);
    callback(null, userInfo);
  });
};

/**
 *
 */
function esc(str) {
  return str && String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Login by SOAP web service API
 */
Connection.prototype.loginBySoap = function(username, password, callback) {
  var self = this;
  var logger = this._logger;
  var body = [
    '<se:Envelope xmlns:se="http://schemas.xmlsoap.org/soap/envelope/">',
      '<se:Header/>',
      '<se:Body>',
        '<login xmlns="urn:partner.soap.sforce.com">',
          '<username>' + esc(username) + '</username>',
          '<password>' + esc(password) + '</password>',
        '</login>',
      '</se:Body>',
    '</se:Envelope>'
  ].join('');

  request({
    method : 'POST',
    url : this.urls.soap.login,
    body : body,
    headers : {
      "Content-Type" : "text/xml",
      "SOAPAction" : '""'
    }
  }, function(err, response) {
    if (err) {
      callback(err);
      return;
    } 
    if (response.statusCode >= 400) {
      callback({ message : response.body });
      return;
    }
    logger.debug("SOAP response = " + response.body);
    var m = response.body.match(/<serverUrl>([^<]+)<\/serverUrl>/);
    var serverUrl = m && m[1];
    m = response.body.match(/<sessionId>([^<]+)<\/sessionId>/);
    var sessionId = m && m[1];
    m = response.body.match(/<userId>([^<]+)<\/userId>/);
    var userId = m && m[1];
    m = response.body.match(/<organizationId>([^<]+)<\/organizationId>/);
    var orgId = m && m[1];
    var userInfo = {
      id: userId,
      organizationId: orgId
    };
    self.initialize({ 
      serverUrl: serverUrl.split('/').slice(0, 3).join('/'), 
      sessionId: sessionId,
      userInfo: userInfo
    });
    logger.debug("<login> completed. user id = " + userId + ", org id = " + orgId);
    callback(null, userInfo);
  });
};

/**
 * Logout the session by using SOAP web service API
 */
Connection.prototype.logout = function(callback) {
  var self = this;
  var logger = this._logger;

  var body = [
    '<se:Envelope xmlns:se="http://schemas.xmlsoap.org/soap/envelope/">',
      '<se:Header>',
        '<SessionHeader xmlns="urn:partner.soap.sforce.com">',
          '<sessionId>' + esc(this.accessToken) + '</sessionId>',
        '</SessionHeader>',
      '</se:Header>',
      '<se:Body>',
        '<logout xmlns="urn:partner.soap.sforce.com"/>',
      '</se:Body>',
    '</se:Envelope>'
  ].join('');

  request({
    method : 'POST',
    url : this.urls.soap.service,
    body : body,
    headers : {
      "Content-Type" : "text/xml",
      "SOAPAction" : '""'
    }
  }, function(err, response) {
    if (err) {
      callback(err);
      return;
    }
    logger.debug("SOAP response = " + response.body);
    if (response.statusCode >= 400) {
      callback({ message : response.body });
      return;
    }

    // Destroy the session bound to this connection
    self.accessToken = null;
    self.userInfo = null;
    self.refreshToken = null;
    self.instanceUrl = null;

    // nothing useful returned by logout API, just return
    callback(null);
  });


};