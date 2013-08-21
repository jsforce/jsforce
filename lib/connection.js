var events  = require('events'),
    async   = require('async'),
    _       = require('underscore')._,
    request = require('./request'),
    Promise = require('./promise'),
    Logger  = require('./logger'),
    OAuth2  = require('./oauth2'),
    Query   = require('./query'),
    SObject = require('./sobject'),
    Bulk    = require('./bulk'),
    Streaming = require('./streaming'),
    Apex    = require('./apex'),
    Cache   = require('./cache');
  

var defaults = {
  loginUrl: "https://login.salesforce.com",
  instanceUrl: "https://{instance}.salesforce.com",
  version: "28.0"
};

/**
 * constructor
 */
var Connection = module.exports = function(options) {
  options = options || {};

  this._logger = new Logger(options.logLevel);

  var oauth2 = options.oauth2;
  if (!oauth2 && options.clientId) { // if oauth2 client config is written in flat (for compatibility)
    oauth2 = {
      loginUrl : options.loginUrl,
      clientId : options.clientId,
      clientSecret : options.clientSecret,
      redirectUri : options.redirectUri
    };
  }
  if (oauth2) {
    this.oauth2 = oauth2 instanceof OAuth2 ? oauth2 : new OAuth2(oauth2);
  }

  this.loginUrl = options.loginUrl || (oauth2 && oauth2.loginUrl) || defaults.loginUrl;
  this.version = options.version || defaults.version;
  this.maxRequest = options.maxRequest || this.maxRequest || 10;

  this.streaming = new Streaming(this);
  this.bulk = new Bulk(this);
  this.apex = new Apex(this);

  this.cache = new Cache();

  var cacheOptions = {
    key: function(type) { return type ? "describe." + type : "describe"; }
  };
  this.describe$ = this.cache.makeCacheable(this.describe, this, cacheOptions);
  this.describe = this.cache.makeResponseCacheable(this.describe, this, cacheOptions);

  cacheOptions = { key: 'describeGlobal' };
  this.describeGlobal$ = this.cache.makeCacheable(this.describeGlobal, this, cacheOptions);
  this.describeGlobal = this.cache.makeResponseCacheable(this.describeGlobal, this, cacheOptions);

  this.initialize(options);
};

/**
 *
 */
Connection.prototype = new events.EventEmitter();

/**
 * initialize
 */
Connection.prototype.initialize = function(options) {
  this.instanceUrl = options.instanceUrl || options.serverUrl || this.instanceUrl || 
                     defaults.instanceUrl.replace("{instance}", options.instance || "na1");
  this.urls = {
    soap : {
      login : [ this.loginUrl, "services/Soap/u", this.version ].join('/'),
      service : [ this.instanceUrl, "services/Soap/u", this.version ].join('/')
    },
    rest : {
      base : [ this.instanceUrl, "services/data", "v" + this.version ].join('/')
    }
  };

  this.accessToken = options.sessionId || options.accessToken || this.accessToken;
  this.refreshToken = options.refreshToken || this.refreshToken;
  if (this.refreshToken && !this.oauth2) {
    throw new Error("Refersh token is specified without oauth2 client information");
  }
  this.userInfo = options.userInfo;

  this.sobjects = {};
  this.cache.clear();
  this.cache.get('describeGlobal').on('value', _.bind(function(res) {
    if (res.result) {
      var types = _.map(res.result.sobjects, function(so) { return so.name; });
      _.each(types, this.sobject, this);
    }
  }, this));

  this._initializedAt = Date.now();
};


/**
 * Sending request to API endpoint
 * @private
 */
Connection.prototype._request = function(params, callback, options) {
  options = options || {};
  var self = this;
  var logger = this._logger;

  var deferred = Promise.defer();

  var onResume = function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    self._request(params, callback, options).then(function(response) {
      deferred.resolve(response);
    }, function(err) {
      deferred.reject(err);
    });
  };

  if (self._suspended) {
    self.once('resume', onResume);
    return deferred.promise;
  }

  params.headers = params.headers || {};
  if (this.accessToken) {
    params.headers.Authorization = "Bearer " + this.accessToken;
  }

  // hook in sending
  if (options.beforesend) { options.beforesend(this, params); }

  self.emit('request', params.method, params.url, params);

  logger.debug("<request> method=" + params.method + ", url=" + params.url);
  var requestTime = Date.now();

  return request(params, function(err, response) {

    var responseTime = Date.now();
    logger.debug("elappsed time : " + (responseTime - requestTime) + "msec");

    if (err) {
      logger.error(err);
      throw err;
    }

    logger.debug("<response> status=" + response.statusCode + ", url=" + params.url);

    self.emit('response', response.statusCode, response.body, response);
    // Refresh token if status code requires authentication
    // when oauth2 info and refresh token is available.
    if (response.statusCode === 401 && self.oauth2 && self.refreshToken) {
      // Access token may be refreshed before the response
      if (self._initializedAt > requestTime) {
        onResume();
      } else {
        self.once('resume', onResume);
        if (!self._suspended) {
          self._suspended = true;
          self._refresh();
        }
      }
      return deferred.promise;
    }

    // check response content type to choose parser
    var contentType = options.responseContentType || response.headers["content-type"];
    var parseBody = /^application\/xml(;|$)/.test(contentType) ? parseXML : 
                    /^application\/json(;|$)/.test(contentType) ? parseJSON :
                    /^text\/csv(;|$)/.test(contentType) ? parseCSV :
                    parseText;

    if (response.statusCode >= 400) {
      var error;
      try {
        var parseError = options.parseError || function(errs) { return errs[0]; };
        error = parseError(parseBody(response.body));
      } catch(e) {
        error = { message : response.body };
      }
      err = new Error(error.message);
      err.name = error.errorCode;
      for (var key in error) { err[key] = error[key]; }
      throw err;
    } else if (response.statusCode === 204) {
      return options.noContentResponse;
    } else {
      var res = parseBody(response.body);
      if (response.statusCode === 300) { // Multiple Choices
        err = new Error('Multiple records found');
        err.name = "MULTIPLE_CHOICES";
        err.content = res;
        throw err;
      }
      return res;
    }

  }).thenCall(callback);
};

/**
 *
 */
function parseJSON(str) {
  return JSON.parse(str);
}

function parseXML(str) {
  return require('xml2json').toJson(str, { object: true });
}

function parseCSV(str) {
  return require('./csv').parseCSV(str);
}

function parseText(str) { return str; }

/**
 * Refresh access token
 * @private
 */
Connection.prototype._refresh = function() {
  var self = this;
  var logger = this._logger;
  logger.debug("<refresh token>");
  return this.oauth2.refreshToken(this.refreshToken, function(err, res) {
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
    return Promise.reject(new Error("Exceeded max limit of concurrent call")).thenCall(callback);
  }
  return Promise.all(
    _.map(ids, function(id) {
      var url = [ self.urls.rest.base, "sobjects", type, id ].join('/');
      return self._request({
        method : 'GET',
        url : url
      });
    })
  ).then(function(results) {
    return !isArray && _.isArray(results) ? results[0] : results;
  }).thenCall(callback);
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
    return Promise.reject(new Error("Exceeded max limit of concurrent call")).thenCall(callback);
  }
  return Promise.all(
    _.map(records, function(record) {
      var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
      if (!sobjectType) {
        throw new Error('No SObject Type defined in record');
      }
      record = _.clone(record);
      delete record.Id;
      delete record.type;
      delete record.attributes;

      var url = [ self.urls.rest.base, "sobjects", sobjectType ].join('/');
      return self._request({
        method : 'POST',
        url : url,
        body : JSON.stringify(record),
        headers : {
          "Content-Type" : "application/json"
        }
      });
    })
  ).then(function(results) {
    return !isArray && _.isArray(results) ? results[0] : results;
  }).thenCall(callback);
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
    return Promise.reject(new Error("Exceeded max limit of concurrent call")).thenCall(callback);
  }
  return Promise.all(
    _.map(records, function(record) {
      var id = record.Id;
      if (!id) {
        throw new Error('Record id is not found in record.');
      }
      var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
      if (!sobjectType) {
        throw new Error('No SObject Type defined in record');
      }
      record = _.clone(record);
      delete record.Id;
      delete record.type;
      delete record.attributes;

      var url = [ self.urls.rest.base, "sobjects", sobjectType, id ].join('/');
      return self._request({
        method : 'PATCH',
        url : url,
        body : JSON.stringify(record),
        headers : {
          "Content-Type" : "application/json"
        }
      }, null, {
        noContentResponse: { id : id, success : true, errors : [] }
      });
    })
  ).then(function(results) {
    return !isArray && _.isArray(results) ? results[0] : results;
  }).thenCall(callback);
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
    return Promise.reject(new Error("Exceeded max limit of concurrent call")).thenCall(callback);
  }
  return Promise.all(
    _.map(records, function(record) {
      var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
      var extId = record[extIdField];
      if (!extId) {
        return Promise.reject(new Error('External ID is not defined in the record'));
      }
      record = _.clone(record);
      delete record[extIdField];
      delete record.type;
      delete record.attributes;

      var url = [ self.urls.rest.base, "sobjects", sobjectType, extIdField, extId ].join('/');
      return self._request({
        method : 'PATCH',
        url : url,
        body : JSON.stringify(record),
        headers : {
          "Content-Type" : "application/json"
        }
      }, null, {
        noContentResponse: { success : true, errors : [] }
      });
    })
  ).then(function(results) {
    return !isArray && _.isArray(results) ? results[0] : results;
  }).thenCall(callback);
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
    return Promise.reject(new Error("Exceeded max limit of concurrent call")).thenCall(callback);
  }
  return Promise.all(
    _.map(ids, function(id) {
      var url = [ self.urls.rest.base, "sobjects", type, id ].join('/');
      return self._request({
        method : 'DELETE',
        url : url
      }, null, {
        noContentResponse: { id : id, success : true, errors : [] }
      });
    })
  ).then(function(results) {
    return !isArray && _.isArray(results) ? results[0] : results;
  }).thenCall(callback);
};


/**
 * describe
 */
Connection.prototype.describe = function(type, callback) {
  var url = [ this.urls.rest.base, "sobjects", type, "describe" ].join('/');
  return this._request({
    method : 'GET',
    url : url
  }).thenCall(callback);
};

/**
 * describeGlobal
 */
Connection.prototype.describeGlobal = function(callback) {
  var url = this.urls.rest.base + "/sobjects";
  return this._request({
    method : 'GET',
    url : url
  }).thenCall(callback);
};


/**
 * sobject
 */
Connection.prototype.sobject = function(type) {
  this.sobjects = this.sobjects || {};
  var sobject = this.sobjects[type] = 
    this.sobjects[type] || new SObject(this, type);
  return sobject;
};


/**
 * Authorize (using oauth2 web server flow)
 */
Connection.prototype.authorize = function(code, callback) {
  var self = this;
  var logger = this._logger;

  return this.oauth2.requestToken(code).then(function(res) {
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
    return userInfo;

  }).thenCall(callback);

};


/**
 * login (using oauth2 username & password flow)
 */
Connection.prototype.login = function(username, password, callback) {
  if (this.oauth2) {
    return this.loginByOAuth2(username, password, callback);
  } else {
    return this.loginBySoap(username, password, callback);
  }
};


/**
 * Login by OAuth2 username & password flow
 */
Connection.prototype.loginByOAuth2 = function(username, password, callback) {
  var self = this;
  var logger = this._logger;

  return this.oauth2.authenticate(username, password).then(function(res) {
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
    return userInfo;

  }).thenCall(callback);

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

  return request({
    method : 'POST',
    url : this.urls.soap.login,
    body : body,
    headers : {
      "Content-Type" : "text/xml",
      "SOAPAction" : '""'
    }
  }).then(function(response) {
    var m;
    if (response.statusCode >= 400) {
      m = response.body.match(/<faultstring>([^<]+)<\/faultstring>/);
      var faultstring = m && m[1];
      throw new Error(faultstring || response.body);
    }
    logger.debug("SOAP response = " + response.body);
    m = response.body.match(/<serverUrl>([^<]+)<\/serverUrl>/);
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
    return userInfo;

  }).thenCall(callback);

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

  return request({
    method : 'POST',
    url : this.urls.soap.service,
    body : body,
    headers : {
      "Content-Type" : "text/xml",
      "SOAPAction" : '""'
    }
  }).then(function(response) {
    logger.debug("SOAP statusCode = " + response.statusCode + ", response = " + response.body);
    if (response.statusCode >= 400) {
      var m = response.body.match(/<faultstring>([^<]+)<\/faultstring>/);
      var faultstring = m && m[1];
      throw new Error(faultstring || response.body);
    }

    // Destroy the session bound to this connection
    self.accessToken = null;
    self.userInfo = null;
    self.refreshToken = null;
    self.instanceUrl = null;
    self.cache.clear();

    // nothing useful returned by logout API, just return
    return null;

  }).thenCall(callback);
};