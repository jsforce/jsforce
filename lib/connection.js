/*global Buffer */
/**
 * @file Connection class to keep the API session information and manage requests
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var events  = require('events'),
    inherits = require('inherits'),
    _       = require('lodash/core'),
    Promise = require('./promise'),
    Logger  = require('./logger'),
    OAuth2  = require('./oauth2'),
    Query   = require('./query'),
    SObject = require('./sobject'),
    QuickAction = require('./quick-action'),
    HttpApi = require('./http-api'),
    Transport = require('./transport'),
    Process = require('./process'),
    Cache   = require('./cache');

var defaults = {
  loginUrl: "https://login.salesforce.com",
  instanceUrl: "",
  version: "42.0"
};

/*
 * Constant of maximum records num in DML operation (update/delete)
 */
var MAX_DML_COUNT = 200;

/*
 * Constant of maximum number of requests that can be batched
 */
var MAX_BATCH_REQUESTS = 25;

/**
 * Connection class to keep the API session information and manage requests
 *
 * @constructor
 * @extends events.EventEmitter
 * @param {Object} [options] - Connection options
 * @param {OAuth2|Object} [options.oauth2] - OAuth2 instance or options to be passed to OAuth2 constructor
 * @param {String} [options.logLevel] - Output logging level (DEBUG|INFO|WARN|ERROR|FATAL)
 * @param {String} [options.version] - Salesforce API Version (without "v" prefix)
 * @param {Number} [options.maxRequest] - Max number of requests allowed in parallel call
 * @param {String} [options.loginUrl] - Salesforce Login Server URL (e.g. https://login.salesforce.com/)
 * @param {String} [options.instanceUrl] - Salesforce Instance URL (e.g. https://na1.salesforce.com/)
 * @param {String} [options.serverUrl] - Salesforce SOAP service endpoint URL (e.g. https://na1.salesforce.com/services/Soap/u/28.0)
 * @param {String} [options.accessToken] - Salesforce OAuth2 access token
 * @param {String} [options.sessionId] - Salesforce session ID
 * @param {String} [options.refreshToken] - Salesforce OAuth2 refresh token
 * @param {String|Object} [options.signedRequest] - Salesforce Canvas signed request (Raw Base64 string, JSON string, or deserialized JSON)
 * @param {String} [options.proxyUrl] - Cross-domain proxy server URL, used in browser client, non Visualforce app.
 * @param {String} [options.httpProxy] - URL of HTTP proxy server, used in server client.
 * @param {Object} [options.callOptions] - Call options used in each SOAP/REST API request. See manual.
 */
var Connection = module.exports = function(options) {
  options = options || {};

  this._logger = new Logger(options.logLevel);

  var oauth2 = options.oauth2 || {
    loginUrl : options.loginUrl,
    clientId : options.clientId,
    clientSecret : options.clientSecret,
    redirectUri : options.redirectUri,
    proxyUrl: options.proxyUrl,
    httpProxy: options.httpProxy
  };

  /**
   * OAuth2 object
   * @member {OAuth2} Connection#oauth2
   */
  this.oauth2 = oauth2 = oauth2 instanceof OAuth2 ? oauth2 : new OAuth2(oauth2);

  this.loginUrl = options.loginUrl || oauth2.loginUrl || defaults.loginUrl;
  this.version = options.version || defaults.version;
  this.maxRequest = options.maxRequest || this.maxRequest || 10;

  /** @private */
  if (options.proxyUrl) {
    this._transport = new Transport.ProxyTransport(options.proxyUrl);
  } else if (options.httpProxy) {
    this._transport = new Transport.HttpProxyTransport(options.httpProxy);
  } else {
    this._transport = new Transport();
  }

  this.callOptions = options.callOptions;

  /*
   * Fire connection:new event to notify jsforce plugin modules
   */
  var jsforce = require('./core');
  jsforce.emit('connection:new', this);

  /**
   * Streaming API object
   * @member {Streaming} Connection#streaming
   */
  // this.streaming = new Streaming(this);
  /**
   * Bulk API object
   * @member {Bulk} Connection#bulk
   */
  // this.bulk = new Bulk(this);
  /**
   * Tooling API object
   * @member {Tooling} Connection#tooling
   */
  // this.tooling = new Tooling(this);
  /**
   * Analytics API object
   * @member {Analytics} Connection#analytics
   */
  // this.analytics = new Analytics(this);
  /**
   * Chatter API object
   * @member {Chatter} Connection#chatter
   */
  // this.chatter = new Chatter(this);
  /**
   * Metadata API object
   * @member {Metadata} Connection#metadata
   */
  // this.metadata = new Metadata(this);

  /**
   * SOAP API object
   * @member {SoapApi} Connection#soap
   */
  // this.soap = new SoapApi(this);

  /**
   * Apex REST API object
   * @member {Apex} Connection#apex
   */
  // this.apex = new Apex(this);

  /**
   * @member {Process} Connection#process
   */
  this.process = new Process(this);

  /**
   * Cache object for result
   * @member {Cache} Connection#cache
   */
  this.cache = new Cache();

  // Allow to delegate connection refresh to outer function
  var self = this;
  var refreshFn = options.refreshFn;
  if (!refreshFn && this.oauth2.clientId) {
    refreshFn = oauthRefreshFn;
  }
  if (refreshFn) {
    this._refreshDelegate = new HttpApi.SessionRefreshDelegate(this, refreshFn);
  }

  var cacheOptions = {
    key: function(type) { 
      return type 
        ? type.type ? "describe." + type.type : "describe." + type
        : "describe"; 
    }
  };
  this.describe$ = this.cache.makeCacheable(this.describe, this, cacheOptions);
  this.describe = this.cache.makeResponseCacheable(this.describe, this, cacheOptions);
  this.describeSObject$ = this.describe$;
  this.describeSObject = this.describe;

  var batchCacheOptions = {
    key: function(options) {
      var types = options.types;
      var autofetch = options.autofetch || false;
      var typesToFetch = types.length > MAX_BATCH_REQUESTS 
        ? (autofetch ? types : types.slice(0, MAX_BATCH_REQUESTS))
        : types;
      var keys = [];
      typesToFetch.forEach(function (type) { keys.push('describe.' + type); });
      return keys;
    }
  };
  this.batchDescribe = this.cache.makeResponseCacheable(this.batchDescribe, this, batchCacheOptions);
  this.batchDescribeSObjects = this.batchDescribe;

  cacheOptions = { key: 'describeGlobal' };
  this.describeGlobal$ = this.cache.makeCacheable(this.describeGlobal, this, cacheOptions);
  this.describeGlobal = this.cache.makeResponseCacheable(this.describeGlobal, this, cacheOptions);

  this.initialize(options);
};

inherits(Connection, events.EventEmitter);

/**
 * Initialize connection.
 *
 * @protected
 * @param {Object} options - Initialization options
 * @param {String} [options.instanceUrl] - Salesforce Instance URL (e.g. https://na1.salesforce.com/)
 * @param {String} [options.serverUrl] - Salesforce SOAP service endpoint URL (e.g. https://na1.salesforce.com/services/Soap/u/28.0)
 * @param {String} [options.accessToken] - Salesforce OAuth2 access token
 * @param {String} [options.sessionId] - Salesforce session ID
 * @param {String} [options.refreshToken] - Salesforce OAuth2 refresh token
 * @param {String|Object} [options.signedRequest] - Salesforce Canvas signed request (Raw Base64 string, JSON string, or deserialized JSON)
 * @param {UserInfo} [options.userInfo] - Logged in user information
 */
Connection.prototype.initialize = function(options) {
  if (!options.instanceUrl && options.serverUrl) {
    options.instanceUrl = options.serverUrl.split('/').slice(0, 3).join('/');
  }
  this.instanceUrl = options.instanceUrl || options.serverUrl || this.instanceUrl || defaults.instanceUrl;

  this.accessToken = options.sessionId || options.accessToken || this.accessToken;
  this.refreshToken = options.refreshToken || this.refreshToken;
  if (this.refreshToken && !this._refreshDelegate) {
    throw new Error("Refresh token is specified without oauth2 client information or refresh function");
  }

  this.signedRequest = options.signedRequest && parseSignedRequest(options.signedRequest);
  if (this.signedRequest) {
    this.accessToken = this.signedRequest.client.oauthToken;
    if (Transport.CanvasTransport.supported) {
      this._transport = new Transport.CanvasTransport(this.signedRequest);
    }
  }

  if (options.userInfo) {
    this.userInfo = options.userInfo;
  }

  this.limitInfo = {};

  this.sobjects = {};
  this.cache.clear();
  this.cache.get('describeGlobal').removeAllListeners('value');
  this.cache.get('describeGlobal').on('value', _.bind(function(res) {
    if (res.result) {
      var types = _.map(res.result.sobjects, function(so) { return so.name; });
      types.forEach(this.sobject, this);
    }
  }, this));

  if (this.tooling) {
    this.tooling.initialize();
  }

  this._sessionType = options.sessionId ? "soap" : "oauth2";

};

/** @private **/
function oauthRefreshFn(conn, callback) {
  conn.oauth2.refreshToken(conn.refreshToken, function(err, res) {
    if (err) { return callback(err); }
    var userInfo = parseIdUrl(res.id);
    conn.initialize({
      instanceUrl : res.instance_url,
      accessToken : res.access_token,
      userInfo : userInfo
    });
    callback(null, res.access_token, res);
  });
}

/** @private **/
function parseSignedRequest(sr) {
  if (_.isString(sr)) {
    if (sr[0] === '{') { // might be JSON
      return JSON.parse(sr);
    } else { // might be original base64-encoded signed request
      var msg = sr.split('.').pop(); // retrieve latter part
      var json = Buffer.from(msg, 'base64').toString('utf-8');
      return JSON.parse(json);
    }
    return null;
  }
  return sr;
}


/** @private **/
Connection.prototype._baseUrl = function() {
  return [ this.instanceUrl, "services/data", "v" + this.version ].join('/');
};

/**
 * Convert path to absolute url
 * @private
 */
Connection.prototype._normalizeUrl = function(url) {
  if (url[0] === '/') {
    if (url.indexOf('/services/') === 0) {
      return this.instanceUrl + url;
    } else {
      return this._baseUrl() + url;
    }
  } else {
    return url;
  }
};

/**
 * Send REST API request with given HTTP request info, with connected session information.
 *
 * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
 * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
 * , or relative path from version root ('/sobjects/Account/describe').
 *
 * @param {String|Object} request - HTTP request object or URL to GET request
 * @param {String} request.method - HTTP method URL to send HTTP request
 * @param {String} request.url - URL to send HTTP request
 * @param {Object} [request.headers] - HTTP request headers in hash object (key-value)
 * @param {Object} [options] - HTTP API request options
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Connection.prototype.request = function(request, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};
  var self = this;

  // if request is simple string, regard it as url in GET method
  if (_.isString(request)) {
    request = { method: 'GET', url: request };
  }
  // if url is given in relative path, prepend base url or instance url before.
  request.url = this._normalizeUrl(request.url);

  var httpApi = new HttpApi(this, options);

  // log api usage and its quota
  httpApi.on('response', function(response) {
    if (response.headers && response.headers["sforce-limit-info"]) {
      var apiUsage = response.headers["sforce-limit-info"].match(/api\-usage=(\d+)\/(\d+)/);
      if (apiUsage) {
        self.limitInfo = {
          apiUsage: {
            used: parseInt(apiUsage[1], 10),
            limit: parseInt(apiUsage[2], 10)
          }
        };
      }
    }
  });
  return httpApi.request(request).thenCall(callback);
};

/**
 * Send HTTP GET request
 *
 * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
 * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
 * , or relative path from version root ('/sobjects/Account/describe').
 *
 * @param {String} url - Endpoint URL to request HTTP GET
 * @param {Object} [options] - HTTP API request options
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Connection.prototype.requestGet = function(url, options, callback) {
  var request = {
    method: "GET",
    url: url
  };
  return this.request(request, options, callback);
};


/**
 * Send HTTP POST request with JSON body, with connected session information
 *
 * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
 * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
 * , or relative path from version root ('/sobjects/Account/describe').
 *
 * @param {String} url - Endpoint URL to request HTTP POST
 * @param {Object} body - Any JS object which can be serialized to JSON
 * @param {Object} [options] - HTTP API request options
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Connection.prototype.requestPost = function(url, body, options, callback) {
  var request = {
    method: "POST",
    url: url,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" }
  };
  return this.request(request, options, callback);
};

/**
 * Send HTTP PUT request with JSON body, with connected session information
 *
 * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
 * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
 * , or relative path from version root ('/sobjects/Account/describe').
 *
 * @param {String} url - Endpoint URL to request HTTP PUT
 * @param {Object} body - Any JS object which can be serialized to JSON
 * @param {Object} [options] - HTTP API request options
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Connection.prototype.requestPut = function(url, body, options, callback) {
  var request = {
    method: "PUT",
    url: url,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" }
  };
  return this.request(request, options, callback);
};

/**
 * Send HTTP PATCH request with JSON body
 *
 * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
 * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
 * , or relative path from version root ('/sobjects/Account/describe').
 *
 * @param {String} url - Endpoint URL to request HTTP PATCH
 * @param {Object} body - Any JS object which can be serialized to JSON
 * @param {Object} [options] - HTTP API request options
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Connection.prototype.requestPatch = function(url, body, options, callback) {
  var request = {
    method: "PATCH",
    url: url,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" }
  };
  return this.request(request, options, callback);
};

/**
 * Send HTTP DELETE request
 *
 * Endpoint URL can be absolute URL ('https://na1.salesforce.com/services/data/v32.0/sobjects/Account/describe')
 * , relative path from root ('/services/data/v32.0/sobjects/Account/describe')
 * , or relative path from version root ('/sobjects/Account/describe').
 *
 * @param {String} url - Endpoint URL to request HTTP DELETE
 * @param {Object} [options] - HTTP API request options
 * @param {Callback.<Object>} [callback] - Callback function
 * @returns {Promise.<Object>}
 */
Connection.prototype.requestDelete = function(url, options, callback) {
  var request = {
    method: "DELETE",
    url: url
  };
  return this.request(request, options, callback);
};


/** @private */
function formatDate(date) {
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  return date.getUTCFullYear() +
    '-' + pad(date.getUTCMonth() + 1) +
    '-' + pad(date.getUTCDate()) +
    'T' + pad(date.getUTCHours()) +
    ':' + pad(date.getUTCMinutes()) +
    ':' + pad(date.getUTCSeconds()) +
    '+00:00';
}


/** @private **/
function parseIdUrl(idUrl) {
  var idUrls = idUrl.split("/");
  var userId = idUrls.pop(), orgId = idUrls.pop();
  return {
    id: userId,
    organizationId: orgId,
    url: idUrl
  };
}

/**
 * @callback Callback
 * @type {Function}
 * @param {Error} err - Callback error
 * @param {T} response - Callback response
 * @template T
 */

/**
 * @typedef {Object} QueryResult
 * @prop {Boolean} done - Flag if the query is fetched all records or not
 * @prop {String} [nextRecordsUrl] - URL locator for next record set, (available when done = false)
 * @prop {Number} totalSize - Total size for query
 * @prop {Array.<Record>} [records] - Array of records fetched
 */

/**
 * Execute query by using SOQL
 *
 * @param {String} soql - SOQL string
 * @param {Object} [options] - Query options
 * @param {Object} [options.headers] - Additional HTTP request headers sent in query request
 * @param {Callback.<QueryResult>} [callback] - Callback function
 * @returns {Query.<QueryResult>}
 */
Connection.prototype.query = function(soql, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  var query = new Query(this, soql, options);
  if (callback) {
    query.run(callback);
  }
  return query;
};

/**
 * Execute query by using SOQL, including deleted records
 *
 * @param {String} soql - SOQL string
 * @param {Object} [options] - Query options
 * @param {Object} [options.headers] - Additional HTTP request headers sent in query request
 * @param {Callback.<QueryResult>} [callback] - Callback function
 * @returns {Query.<QueryResult>}
 */
Connection.prototype.queryAll = function(soql, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  var query = new Query(this, soql, options);
  query.scanAll(true);
  if (callback) {
    query.run(callback);
  }
  return query;
};

/**
 * Query next record set by using query locator
 *
 * @param {String} locator - Next record set locator
 * @param {Object} [options] - Query options
 * @param {Object} [options.headers] - Additional HTTP request headers sent in query request
 * @param {Callback.<QueryResult>} [callback] - Callback function
 * @returns {Query.<QueryResult>}
 */
Connection.prototype.queryMore = function(locator, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  var query = new Query(this, { locator: locator }, options);
  if (callback) {
    query.run(callback);
  }
  return query;
};

/** @private */
Connection.prototype._ensureVersion = function(majorVersion) {
  var versions = this.version.split('.');
  return parseInt(versions[0], 10) >= majorVersion;
}

/** @private */
Connection.prototype._supports = function(feature) {
  switch (feature) {
    case 'sobject-collection':
      return this._ensureVersion(42);
    default:
      return false;
  }
}

/**
 * Retrieve specified records
 *
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A record ID or array of record IDs
 * @param {Object} [options] - Options for rest api.
 * @param {Array.<String>} [options.fields] - Fetching field names in retrieving record
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<Record|Array.<Record>>} [callback] - Callback function
 * @returns {Promise.<Record|Array.<Record>>}
 */
Connection.prototype.retrieve = function(type, ids, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  return (
    _.isArray(ids) ?
      (this._supports('sobject-collection') ? // check whether SObject collection API is supported
        this._retrieveMany(type, ids, options) :
        this._retrieveParallel(type, ids, options)) :
      this._retrieveSingle(type, ids, options)
  ).thenCall(callback);
};

/** @private */
Connection.prototype._retrieveSingle = function(type, id, options) {
  if (!id) {
    return Promise.reject(new Error('Invalid record ID. Specify valid record ID value'));
  }
  var url = [ this._baseUrl(), "sobjects", type, id ].join('/');
  if (options.fields) {
    url += '?fields=' + options.fields.join(',');
  }
  return this.request({
    method: 'GET',
    url: url,
    headers: options.headers,
  });
};

/** @private */
Connection.prototype._retrieveParallel = function(type, ids, options) {
  if (ids.length > this.maxRequest) {
    return Promise.reject(new Error("Exceeded max limit of concurrent call"));
  }
  var self = this;
  return Promise.all(
    ids.map(function(id) {
      return self._retrieveSingle(type, id, options).catch(function(err) {
        if (options.allOrNone || err.errorCode !== 'NOT_FOUND') {
          throw err;
        }
        return null;
      });
    })
  );
};

/** @private */
Connection.prototype._retrieveMany = function(type, ids, options) {
  if (ids.length === 0) {
    return Promise.resolve([]);
  }
  var url = [ this._baseUrl(), "composite", "sobjects", type ].join('/');
  var self = this;
  return (
    options.fields ?
      Promise.resolve(options.fields) :
      new Promise(function(resolve, reject) {
        self.describe$(type, function(err, so) {
          if (err) {
            reject(err);
          } else {
            var fields = so.fields.map(function(field) {
              return field.name;
            });
            resolve(fields);
          }
        });
      })
  ).then(function(fields) {
    return self.request({
      method : 'POST',
      url : url,
      body : JSON.stringify({
        ids : ids,
        fields : fields
      }),
      headers : _.defaults(options.headers || {}, {
        "Content-Type" : "application/json"
      })
    });
  });
};


/**
 * @typedef RecordResult
 * @prop {Boolean} success - The result is succeessful or not
 * @prop {String} [id] - Record ID
 * @prop {Array.<Object>} [errors] - Errors (available when success = false)
 */

/** @private */
Connection.prototype._toRecordResult = function(id, err) {
  var error = {
    statusCode: err.errorCode,
    message: err.message
  };
  if (err.content) { error.content = err.content; } // preserve External id duplication message
  if (err.fields) { error.fields = err.fields; } // preserve DML exception occurred fields
  var result = {
    success: false,
    errors: [error]
  };
  if (id) { result.id = id; }
  return result;
};

/**
 * Synonym of Connection#create()
 *
 * @method Connection#insert
 * @param {String} type - SObject Type
 * @param {Object|Array.<Object>} records - A record or array of records to create
 * @param {Object} [options] - Options for rest api.
 * @param {Boolean} [options.allOrNone] - If true, any failed records in a call cause all changes for the call to be rolled back
 * @param {Boolean} [options.allowRecursive] - If true, when records goes over the max num of collection API (=200), records are divided into several chunks and requested recursively.
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
/**
 * Create records
 *
 * @method Connection#create
 * @param {String} type - SObject Type
 * @param {Record|Array.<Record>} records - A record or array of records to create
 * @param {Object} [options] - Options for rest api.
 * @param {Boolean} [options.allOrNone] - If true, any failed records in a call cause all changes for the call to be rolled back
 * @param {Boolean} [options.allowRecursive] - If true, when records goes over the max num of collection API (=200), records are divided into several chunks and requested recursively.
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
Connection.prototype.insert =
Connection.prototype.create = function(type, records, options, callback) {
  if (!_.isString(type)) {
    // reverse order
    callback = options;
    options = records;
    records = type;
    type = null;
  }
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  return (
    _.isArray(records) ?
      (this._supports('sobject-collection') ? // check whether SObject collection API is supported
        this._createMany(type, records, options) :
        this._createParallel(type, records, options)) :
      this._createSingle(type, records, options)
  ).thenCall(callback);
};

/** @private */
Connection.prototype._createSingle = function(type, record, options) {
  var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
  if (!sobjectType) {
    return Promise.reject(new Error('No SObject Type defined in record'));
  }
  record = _.clone(record);
  delete record.Id;
  delete record.type;
  delete record.attributes;
  var url = [ this._baseUrl(), "sobjects", sobjectType ].join('/');
  return this.request({
    method : 'POST',
    url : url,
    body : JSON.stringify(record),
    headers : _.defaults(options.headers || {}, {
      "Content-Type" : "application/json"
    })
  });
};

/** @private */
Connection.prototype._createParallel = function(type, records, options) {
  if (records.length > this.maxRequest) {
    return Promise.reject(new Error("Exceeded max limit of concurrent call"));
  }
  var self = this;
  return Promise.all(
    records.map(function(record) {
      return self._createSingle(type, record, options).catch(function(err) {
        // be aware that allOrNone in parallel mode will not revert the other successful requests
        // it only raises error when met at least one failed request.
        if (options.allOrNone || !err.errorCode) {
          throw err;
        }
        return this._toRecordResult(null, err);
      });
    })
  );
};

/** @private */
Connection.prototype._createMany = function(type, records, options) {
  if (records.length === 0) {
    return Promise.resolve([]);
  }
  if (records.length > MAX_DML_COUNT && options.allowRecursive) {
    var self = this;
    return self._createMany(type, records.slice(0, MAX_DML_COUNT), options).then(function(rets1) {
      return self._createMany(type, records.slice(MAX_DML_COUNT), options).then(function(rets2) {
        return rets1.concat(rets2);
      });
    });
  }
  records = _.map(records, function(record) {
    var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
    if (!sobjectType) {
      return Promise.reject(new Error('No SObject Type defined in record'));
    }
    record = _.clone(record);
    delete record.Id;
    delete record.type;
    record.attributes = { type : sobjectType };
    return record;
  });
  var url = [ this._baseUrl(), "composite", "sobjects" ].join('/');
  return this.request({
    method : 'POST',
    url : url,
    body : JSON.stringify({
      allOrNone : options.allOrNone || false,
      records : records
    }),
    headers : _.defaults(options.headers || {}, {
      "Content-Type" : "application/json"
    })
  });
};

/**
 * Update records
 *
 * @param {String} type - SObject Type
 * @param {Record|Array.<Record>} records - A record or array of records to update
 * @param {Object} [options] - Options for rest api.
 * @param {Boolean} [options.allOrNone] - If true, any failed records in a call cause all changes for the call to be rolled back
 * @param {Boolean} [options.allowRecursive] - If true, when records goes over the max num of collection API (=200), records are divided into several chunks and requested recursively.
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
Connection.prototype.update = function(type, records, options, callback) {
  if (!_.isString(type)) {
    // reverse order
    callback = options;
    options = records;
    records = type;
    type = null;
  }
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  return (
    _.isArray(records) ?
      (this._supports('sobject-collection') ? // check whether SObject collection API is supported
        this._updateMany(type, records, options) :
        this._updateParallel(type, records, options)) :
      this._updateSingle(type, records, options)
  ).thenCall(callback);
};

/** @private */
Connection.prototype._updateSingle = function(type, record, options) {
  var id = record.Id;
  if (!id) {
    return Promise.reject(new Error('Record id is not found in record.'));
  }
  var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
  if (!sobjectType) {
    return Promise.reject(new Error('No SObject Type defined in record'));
  }
  record = _.clone(record);
  delete record.Id;
  delete record.type;
  delete record.attributes;
  var url = [ this._baseUrl(), "sobjects", sobjectType, id ].join('/');
  return this.request({
    method : 'PATCH',
    url : url,
    body : JSON.stringify(record),
    headers : _.defaults(options.headers || {}, {
      "Content-Type" : "application/json"
    })
  }, {
    noContentResponse: { id : id, success : true, errors : [] }
  });
};

/** @private */
Connection.prototype._updateParallel = function(type, records, options) {
  if (records.length > this.maxRequest) {
    return Promise.reject(new Error("Exceeded max limit of concurrent call"));
  }
  var self = this;
  return Promise.all(
    records.map(function(record) {
      return self._updateSingle(type, record, options).catch(function(err) {
        // be aware that allOrNone in parallel mode will not revert the other successful requests
        // it only raises error when met at least one failed request.
        if (options.allOrNone || !err.errorCode) {
          throw err;
        }
        return this._toRecordResult(record.Id, err);
      });
    })
  );
};

/** @private */
Connection.prototype._updateMany = function(type, records, options) {
  if (records.length === 0) {
    return Promise.resolve([]);
  }
  if (records.length > MAX_DML_COUNT && options.allowRecursive) {
    var self = this;
    return self._updateMany(type, records.slice(0, MAX_DML_COUNT), options).then(function(rets1) {
      return self._updateMany(type, records.slice(MAX_DML_COUNT), options).then(function(rets2) {
        return rets1.concat(rets2);
      });
    });
  }
  records = _.map(records, function(record) {
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
    record.id = id;
    delete record.type;
    record.attributes = { type : sobjectType };
    return record;
  });
  var url = [ this._baseUrl(), "composite", "sobjects" ].join('/');
  return this.request({
    method : 'PATCH',
    url : url,
    body : JSON.stringify({
      allOrNone : options.allOrNone || false,
      records : records
    }),
    headers : _.defaults(options.headers || {}, {
      "Content-Type" : "application/json"
    })
  });
};

/**
 * Upsert records
 *
 * @param {String} type - SObject Type
 * @param {Record|Array.<Record>} records - Record or array of records to upsert
 * @param {String} extIdField - External ID field name
 * @param {Object} [options] - Options for rest api.
 * @param {Boolean} [options.allOrNone] - If true, any failed records in a call cause all changes for the call to be rolled back
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
Connection.prototype.upsert = function(type, records, extIdField, options, callback) {
  // You can omit "type" argument, when the record includes type information.
  if (!_.isString(type)) {
    // reverse order
    callback = options;
    options = extIdField;
    extIdField = records;
    records = type;
    type = null;
  }
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  var self = this;
  var isArray = _.isArray(records);
  records = isArray ? records : [ records ];
  if (records.length > this.maxRequest) {
    return Promise.reject(new Error("Exceeded max limit of concurrent call")).thenCall(callback);
  }
  return Promise.all(
    _.map(records, function(record) {
      var sobjectType = type || (record.attributes && record.attributes.type) || record.type;
      var extId = record[extIdField];
      record = _.clone(record);
      delete record[extIdField];
      delete record.type;
      delete record.attributes;

      var url = [ self._baseUrl(), "sobjects", sobjectType, extIdField, extId ].join('/');
      return self.request({
        method : 'PATCH',
        url : url,
        body : JSON.stringify(record),
        headers : _.defaults(options.headers || {}, {
          "Content-Type" : "application/json"
        })
      }, {
        noContentResponse: { success : true, errors : [] }
      })
      .catch(function(err) {
        // be aware that `allOrNone` option in upsert method will not revert the other successful requests
        // it only raises error when met at least one failed request.
        if (!isArray || options.allOrNone || !err.errorCode) { throw err; }
        return self._toRecordResult(null, err);
      })
    })
  ).then(function(results) {
    return !isArray && _.isArray(results) ? results[0] : results;
  }).thenCall(callback);
};

/**
 * Synonym of Connection#destroy()
 *
 * @method Connection#delete
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A ID or array of IDs to delete
 * @param {Object} [options] - Options for rest api.
 * @param {Boolean} [options.allOrNone] - If true, any failed records in a call cause all changes for the call to be rolled back
 * @param {Boolean} [options.allowRecursive] - If true, when ids goes over the max num of collection API (=200), ids are divided into several chunks and requested recursively.
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
/**
 * Synonym of Connection#destroy()
 *
 * @method Connection#del
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A ID or array of IDs to delete
 * @param {Object} [options] - Options for rest api.
 * @param {Boolean} [options.allOrNone] - If true, any failed records in a call cause all changes for the call to be rolled back
 * @param {Boolean} [options.allowRecursive] - If true, when ids goes over the max num of collection API (=200), ids are divided into several chunks and requested recursively.
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
/**
 * Delete records
 *
 * @method Connection#destroy
 * @param {String} type - SObject Type
 * @param {String|Array.<String>} ids - A ID or array of IDs to delete
 * @param {Object} [options] - Options for rest api.
 * @param {Boolean} [options.allOrNone] - If true, any failed records in a call cause all changes for the call to be rolled back
 * @param {Boolean} [options.allowRecursive] - If true, when ids goes over the max num of collection API (=200), ids are divided into several chunks and requested recursively.
 * @param {Object} [options.headers] - Additional HTTP request headers sent in retrieve request
 * @param {Callback.<RecordResult|Array.<RecordResult>>} [callback] - Callback
 * @returns {Promise.<RecordResult|Array.<RecordResult>>}
 */
Connection.prototype["delete"] =
Connection.prototype.del =
Connection.prototype.destroy = function(type, ids, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  return (
    _.isArray(ids) ?
      (this._supports('sobject-collection') ? // check whether SObject collection API is supported
        this._destroyMany(type, ids, options) :
        this._destroyParallel(type, ids, options)) :
      this._destroySingle(type, ids, options)
  ).thenCall(callback);
};

/** @private */
Connection.prototype._destroySingle = function(type, id, options) {
  var url = [ this._baseUrl(), "sobjects", type, id ].join('/');
  return this.request({
    method : 'DELETE',
    url : url,
    headers: options.headers || null
  }, {
    noContentResponse: { id : id, success : true, errors : [] }
  });
};

/** @private */
Connection.prototype._destroyParallel = function(type, ids, options) {
  if (ids.length > this.maxRequest) {
    return Promise.reject(new Error("Exceeded max limit of concurrent call"));
  }
  var self = this;
  return Promise.all(
    ids.map(function(id) {
      return self._destroySingle(type, id, options).catch(function(err) {
        // be aware that `allOrNone` option in parallel mode will not revert the other successful requests
        // it only raises error when met at least one failed request.
        if (options.allOrNone || !err.errorCode) {
          throw err;
        }
        return this._toRecordResult(id, err);
      });
    })
  );
};


/** @private */
Connection.prototype._destroyMany = function(type, ids, options) {
  if (ids.length === 0) {
    return Promise.resolve([]);
  }
  if (ids.length > MAX_DML_COUNT && options.allowRecursive) {
    var self = this;
    return self._destroyMany(type, ids.slice(0, MAX_DML_COUNT), options).then(function(rets1) {
      return self._destroyMany(type, ids.slice(MAX_DML_COUNT), options).then(function(rets2) {
        return rets1.concat(rets2);
      });
    });
  }
  var url = [ this._baseUrl(), "composite", "sobjects?ids=" ].join('/') + ids.join(',');
  if (options.allOrNone) {
    url += '&allOrNone=true';
  }
  return this.request({
    method : 'DELETE',
    url : url,
    headers: options.headers || null
  });
};

/**
 * Execute search by SOSL
 *
 * @param {String} sosl - SOSL string
 * @param {Callback.<Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<Array.<RecordResult>>}
 */
Connection.prototype.search = function(sosl, callback) {
  var url = this._baseUrl() + "/search?q=" + encodeURIComponent(sosl);
  return this.request(url).thenCall(callback);
};

/**
 * Result returned by describeSObject call
 *
 * @typedef {Object} DescribeSObjectResult
 */
/**
 * Parameter for describeSObject call
 * 
 * @typedef {Object} DescribeSObjectOptions
 */
/**
 * Synonym of Connection#describe()
 *
 * @method Connection#describeSObject
 * @param {String|DescribeSObjectOptions} type - SObject Type or options object
 * @param {String} type.type - The name of the SObject
 * @param {String} type.ifModifiedSince - Date value for If-Modified-Since header; undefined resolved if not modified after this date
 * @param {Callback.<DescribeSObjectResult>} [callback] - Callback function
 * @returns {Promise.<DescribeSObjectResult>}
 */
/**
 * Describe SObject metadata
 *
 * @method Connection#describe
 * @param {String|DescribeSObjectOptions} type - SObject Type or options object
 * @param {String} type.type - The name of the SObject
 * @param {String} type.ifModifiedSince - Date value for If-Modified-Since header; undefined resolved if not modified after this date
 * @param {Callback.<DescribeSObjectResult>} [callback] - Callback function
 * @returns {Promise.<DescribeSObjectResult>}
 */
Connection.prototype.describe =
Connection.prototype.describeSObject = function(type, callback) {
  var name = type.type ? type.type : type;
  var url = [ this._baseUrl(), "sobjects", name, "describe" ].join('/');
  var headers = type.ifModifiedSince 
    ? { 'If-Modified-Since': type.ifModifiedSince } 
    : {};
  return this.request({
    method: 'GET',
    url: url,
    headers: headers
  }).then(function (resp) {
    if (resp === '') {
      return Promise.resolve(undefined);
    } else {
      return Promise.resolve(resp);
    }
  }).thenCall(callback);
};

/**
 * Result returned by batchDescribeSObjects call
 *
 * @typedef {Object[]} DescribeSObjectResult
 */
/**
 * Parameter for describeSObject call
 * 
 * @typedef {Object} BatchDescribeSObjectOptions
 */
/**
 * Synonym of Connection#batchDescribe()
 *
 * @method Connection#batchDescribeSObjects
 * @param {BatchDescribeSObjectOptions} options - options for function
 * @param {String[]} options.types - names of objects to fetch
 * @param {Boolean} options.autofetch - whether to automatically fetch metadata for large numbers of 
 *                         types (one batch request returns a maximum of 25 results); when true, will make 
 *                         subsequent requests until all object metadata is fetched; when false (default), 
 *                         will make one batch request for maximum of 25 results
 * @param {number} options.maxConcurrentRequests - maximum number of concurrent requests sent to the org; 
 *                         default and maximum is 15
 * @param {Callback.<DescribeSObjectResult[]>} [callback] - Callback function
 * @returns {Promise.<DescribeSObjectResult[]>}
 */
/**
 * Batch describe SObject metadata
 *
 * @method Connection#batchDescribe
 * @param {BatchDescribeSObjectOptions} options - options for function
 * @param {String[]} options.types - names of objects to fetch
 * @param {Boolean} options.autofetch - whether to automatically fetch metadata for large numbers of 
 *                         types (one batch request returns a maximum of 25 results); when true, will make 
 *                         subsequent requests until all object metadata is fetched; when false (default), 
 *                         will make one batch request for maximum of 25 results
 * @param {number} options.maxConcurrentRequests - maximum number of concurrent requests sent to the org; 
 *                         default and maximum is 15
 * @param {Callback.<DescribeSObjectResult[]>} [callback] - Callback function
 * @returns {Promise.<DescribeSObjectResult[]>}
 */
Connection.prototype.batchDescribe = Connection.prototype.batchDescribeSObjects = function (
  options,
  callback
) {
  var self = this;
  var types = options.types;
  var autofetch = options.autofetch || false;
  var maxConcurrentRequests = Math.min((options.maxConcurrentRequests || 15), 15);
  var batches = [];
  do {
    var batch = types.length > MAX_BATCH_REQUESTS ? types.slice(0, MAX_BATCH_REQUESTS) : types;
    batches.push(batch);
    types = types.length > MAX_BATCH_REQUESTS ? types.slice(MAX_BATCH_REQUESTS) : [];
  } while (types.length > 0 && autofetch);
  var requestBatches = [];
  do {
    var requestBatch = batches.length > maxConcurrentRequests ? batches.slice(0, maxConcurrentRequests) : batches;
    requestBatches.push(requestBatch);
    batches = batches.length > maxConcurrentRequests ? batches.slice(maxConcurrentRequests) : [];
  } while (batches.length > 0);
  return self.doBatchDescribeRequestBatches(requestBatches)
    .thenCall(callback);
};

Connection.prototype.doBatchDescribeRequestBatches = function(requestBatches) {
  // make each batch of requests sequentially to avoid org limits of max concurrent requests
  var self = this;
  var sobjects = [];
  var firstBatch = requestBatches.shift();
  return self.doBatchOfBatchDescribeRequests(firstBatch).then(
    function (sobjectArray) {
      sobjectArray.forEach(function (sobject) { sobjects.push(sobject); });
      if (requestBatches.length > 0) {
        return self.doBatchDescribeRequestBatches(requestBatches).then(
          function (results) {
            results.forEach(function (result) { sobjects.push(result); });
            return Promise.resolve(sobjects);
          }
        )
      } else {
        return Promise.resolve(sobjects);
      }
    }
  )
}

/** private */
Connection.prototype.doBatchOfBatchDescribeRequests = function(requestBatch) {
  // make up to maxConcurrentRequest requests in parallel
  var self = this;
  return Promise.all(
    requestBatch.map(function (batch) { return self.doBatchDescribeRequest(batch); } )
  ).then(function (results) {
    var sobjects = [];
    results.forEach(function (sobjectArray) {
      sobjectArray.forEach(function (sobject) { sobjects.push(sobject); })
    });
    return Promise.resolve(sobjects);
});
}

/** private */
Connection.prototype.doBatchDescribeRequest = function(types) {
  var self = this;
  var sobjects = [];
  var url = [self._baseUrl(), "composite/batch"].join("/");
  var version = "v" + self.version;
  var batchRequests = [];
  types.forEach(function (type) {
    batchRequests.push({
      method: "GET",
      url: [version, "sobjects", type, "describe"].join("/")
    });
  });
  return this.request({
    method: "POST",
    url: url,
    body: JSON.stringify({ batchRequests: batchRequests }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function (response) {
    if (response.results) {
      var i = 0;
      for (var i = 0; i < response.results.length; i++) {
        var subResp = response.results[i];
        if (Array.isArray(subResp.result)) {
          if (subResp.result[0].errorCode && subResp.result[0].message) {
            this._logger.error(
              'Error: ' + subResp.result[0].errorCode + ' ' +  
              subResp.result[0].message + ' - ' + typesToFetch[i]
            );
          }
        } else {
          sobjects.push(subResp.result);
        }
      }
    }
    return Promise.resolve(sobjects);
  }); 
}

/**
 * Result returned by describeGlobal call
 *
 * @typedef {Object} DescribeGlobalResult
 */
/**
 * Describe global SObjects
 *
 * @param {Callback.<DescribeGlobalResult>} [callback] - Callback function
 * @returns {Promise.<DescribeGlobalResult>}
 */
Connection.prototype.describeGlobal = function(callback) {
  var url = this._baseUrl() + "/sobjects";
  return this.request(url).thenCall(callback);
};


/**
 * Get SObject instance
 *
 * @param {String} type - SObject Type
 * @returns {SObject}
 */
Connection.prototype.sobject = function(type) {
  this.sobjects = this.sobjects || {};
  var sobject = this.sobjects[type] =
    this.sobjects[type] || new SObject(this, type);
  return sobject;
};

/**
 * Get identity information of current user
 *
 * @param {Object} [options] - Identity call options
 * @param {Object} [options.headers] - Additional HTTP request headers sent in identity request
 * @param {Callback.<IdentityInfo>} [callback] - Callback function
 * @returns {Promise.<IdentityInfo>}
 */
Connection.prototype.identity = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  var self = this;
  var idUrl = this.userInfo && this.userInfo.url;
  return Promise.resolve(
    idUrl ?
    { identity: idUrl } :
    this.request({ method: 'GET', url: this._baseUrl(), headers: options.headers })
  ).then(function(res) {
    var url = res.identity;
    return self.request({ method: 'GET', url: url });
  }).then(function(res) {
    self.userInfo = {
      id: res.user_id,
      organizationId: res.organization_id,
      url: res.id
    };
    return res;
  }).thenCall(callback);
};

/**
 * @typedef UserInfo
 * @prop {String} id - User ID
 * @prop {String} organizationId - Organization ID
 * @prop {String} url - Identity URL of the user
 */

/**
 * Authorize (using oauth2 web server flow)
 *
 * @param {String} code - Authorization code
 * @param {Object} [params] - Optional parameters to send in token retrieval
 * @param {String} [params.code_verifier] - Code verifier value (RFC 7636 - Proof Key of Code Exchange)
 * @param {Callback.<UserInfo>} [callback] - Callback function
 * @returns {Promise.<UserInfo>}
 */
Connection.prototype.authorize = function(code, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }
  var self = this;
  var logger = this._logger;

  return this.oauth2.requestToken(code, params).then(function(res) {
    var userInfo = parseIdUrl(res.id);
    self.initialize({
      instanceUrl : res.instance_url,
      accessToken : res.access_token,
      refreshToken : res.refresh_token,
      userInfo: userInfo
    });
    logger.debug("<login> completed. user id = " + userInfo.id + ", org id = " + userInfo.organizationId);
    return userInfo;

  }).thenCall(callback);

};


/**
 * Login to Salesforce
 *
 * @param {String} username - Salesforce username
 * @param {String} password - Salesforce password (and security token, if required)
 * @param {Callback.<UserInfo>} [callback] - Callback function
 * @returns {Promise.<UserInfo>}
 */
Connection.prototype.login = function(username, password, callback) {
  // register refreshDelegate for session expiration
  this._refreshDelegate = new HttpApi.SessionRefreshDelegate(this, createUsernamePasswordRefreshFn(username, password));
  if (this.oauth2 && this.oauth2.clientId && this.oauth2.clientSecret) {
    return this.loginByOAuth2(username, password, callback);
  } else {
    return this.loginBySoap(username, password, callback);
  }
};

/** @private **/
function createUsernamePasswordRefreshFn(username, password) {
  return function(conn, callback) {
    conn.login(username, password, function(err) {
      if (err) { return callback(err); }
      callback(null, conn.accessToken);
    });
  };
}

/**
 * Login by OAuth2 username & password flow
 *
 * @param {String} username - Salesforce username
 * @param {String} password - Salesforce password (and security token, if required)
 * @param {Callback.<UserInfo>} [callback] - Callback function
 * @returns {Promise.<UserInfo>}
 */
Connection.prototype.loginByOAuth2 = function(username, password, callback) {
  var self = this;
  var logger = this._logger;
  return this.oauth2.authenticate(username, password).then(function(res) {
    var userInfo = parseIdUrl(res.id);
    self.initialize({
      instanceUrl : res.instance_url,
      accessToken : res.access_token,
      userInfo: userInfo
    });
    logger.debug("<login> completed. user id = " + userInfo.id + ", org id = " + userInfo.organizationId);
    return userInfo;

  }).thenCall(callback);

};

/**
 * @private
 */
function esc(str) {
  return str && String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Login by SOAP web service API
 *
 * @param {String} username - Salesforce username
 * @param {String} password - Salesforce password (and security token, if required)
 * @param {Callback.<UserInfo>} [callback] - Callback function
 * @returns {Promise.<UserInfo>}
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

  var soapLoginEndpoint = [ this.loginUrl, "services/Soap/u", this.version ].join('/');

  return this._transport.httpRequest({
    method : 'POST',
    url : soapLoginEndpoint,
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
    var idUrl = soapLoginEndpoint.split('/').slice(0, 3).join('/');
    idUrl += "/id/" + orgId + "/" + userId;
    var userInfo = {
      id: userId,
      organizationId: orgId,
      url: idUrl
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
 * Logout the current session 
 *
 * @param {Boolean} [revoke] - Revokes API Access if set to true
 * @param {Callback.<undefined>} [callback] - Callback function
 * @returns {Promise.<undefined>}
 */
Connection.prototype.logout = function(revoke, callback) {
  if (typeof revoke === 'function') {
    callback = revoke;
    revoke = false;
  }

  if (this._sessionType === "oauth2") {
    return this.logoutByOAuth2(revoke, callback);
  } else {
    return this.logoutBySoap(revoke, callback);
  }
};

/**
 * Logout the current session by revoking access token via OAuth2 session revoke
 *
 * @param {Boolean} [revoke] - Revokes API Access if set to true
 * @param {Callback.<undefined>} [callback] - Callback function
 * @returns {Promise.<undefined>}
 */
Connection.prototype.logoutByOAuth2 = function(revoke, callback) {
  if (typeof revoke === 'function') {
    callback = revoke;
    revoke = false;
  }
  var self = this;
  var logger = this._logger;

  return this.oauth2.revokeToken(revoke ? this.refreshToken : this.accessToken).then(function() {
    // Destroy the session bound to this connection
    self.accessToken = null;
    self.userInfo = null;
    self.refreshToken = null;
    self.instanceUrl = null;
    self.cache.clear();

    // nothing useful returned by logout API, just return
    return undefined;
  }).thenCall(callback);
};


/**
 * Logout the session by using SOAP web service API
 *
 * @param {Boolean} [revoke] - Revokes API Access if set to true
 * @param {Callback.<undefined>} [callback] - Callback function
 * @returns {Promise.<undefined>}
 */
Connection.prototype.logoutBySoap = function(revoke, callback) {
  if (typeof revoke === 'function') {
    callback = revoke;
    revoke = false;
  }
  var self = this;
  var logger = this._logger;

  var body = [
    '<se:Envelope xmlns:se="http://schemas.xmlsoap.org/soap/envelope/">',
      '<se:Header>',
        '<SessionHeader xmlns="urn:partner.soap.sforce.com">',
          '<sessionId>' + esc(revoke ? this.refreshToken : this.accessToken) + '</sessionId>',
        '</SessionHeader>',
      '</se:Header>',
      '<se:Body>',
        '<logout xmlns="urn:partner.soap.sforce.com"/>',
      '</se:Body>',
    '</se:Envelope>'
  ].join('');

  return this._transport.httpRequest({
    method : 'POST',
    url : [ this.instanceUrl, "services/Soap/u", this.version ].join('/'),
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
    return undefined;

  }).thenCall(callback);
};

/**
 * List recently viewed records
 *
 * @param {String} [type] - SObject type
 * @param {Number} [limit] - Limit num to fetch
 * @param {Callback.<Array.<RecordResult>>} [callback] - Callback function
 * @returns {Promise.<Array.<RecordResult>>}
 */
Connection.prototype.recent = function(type, limit, callback) {
  if (!_.isString(type)) {
    callback = limit;
    limit = type;
    type = undefined;
  }
  if (!_.isNumber(limit)) {
    callback = limit;
    limit = undefined;
  }
  var url;
  if (type) {
    url = [ this._baseUrl(), "sobjects", type ].join('/');
    return this.request(url).then(function(res) {
      return limit ? res.recentItems.slice(0, limit) : res.recentItems;
    }).thenCall(callback);
  } else {
    url = this._baseUrl() + "/recent";
    if (limit) {
      url += "?limit=" + limit;
    }
    return this.request(url).thenCall(callback);
  }

};

/**
 * @typedef {Object} UpdatedRecordsInfo
 * @prop {String} latestDateCovered - The timestamp of the last date covered.
 * @prop {Array.<String>} ids - Updated record IDs.
 */

/**
 * Retrieve updated records
 *
 * @param {String} type - SObject Type
 * @param {String|Date} start - start date or string representing the start of the interval
 * @param {String|Date} end - start date or string representing the end of the interval must be > start
 * @param {Callback.<UpdatedRecordsInfo>} [callback] - Callback function
 * @returns {Promise.<UpdatedRecordsInfo>}
 */
Connection.prototype.updated = function (type, start, end, callback) {
  var url = [ this._baseUrl(), "sobjects", type, "updated" ].join('/');

  if (typeof start === 'string') {
    start = new Date(start);
  }

  if (start instanceof Date) {
    start = formatDate(start);
  }

  if (start) {
    url += "?start=" + encodeURIComponent(start);
  }

  if (typeof end === 'string') {
    end = new Date(end);
  }

  if (end instanceof Date) {
    end = formatDate(end);
  }

  if (end) {
    url += "&end=" + encodeURIComponent(end);
  }

  return this.request(url).thenCall(callback);
};

/**
 * @typedef {Object} DeletedRecordsInfo
 * @prop {String} earliestDateAvailable - The timestamp of the earliest date available
 * @prop {String} latestDateCovered - The timestamp of the last date covered
 * @prop {Array.<Object>} deletedRecords - Updated records
 * @prop {String} deletedRecords.id - Record ID
 * @prop {String} deletedRecords.deletedDate - The timestamp when this record was deleted
 */

/**
 * Retrieve deleted records
 *
 * @param {String} type - SObject Type
 * @param {String|Date} start - start date or string representing the start of the interval
 * @param {String|Date} end - start date or string representing the end of the interval
 * @param {Callback.<DeletedRecordsInfo>} [callback] - Callback function
 * @returns {Promise.<DeletedRecordsInfo>}
 */
Connection.prototype.deleted = function (type, start, end, callback) {
  var url = [ this._baseUrl(), "sobjects", type, "deleted" ].join('/');

  if (typeof start === 'string') {
    start = new Date(start);
  }

  if (start instanceof Date) {
    start = formatDate(start);
  }

  if (start) {
    url += "?start=" + encodeURIComponent(start);
  }

  if (typeof end === 'string') {
    end = new Date(end);
  }

  if (end instanceof Date) {
    end = formatDate(end);
  }

  if (end) {
    url += "&end=" + encodeURIComponent(end);
  }

  return this.request(url).thenCall(callback);
};


/**
 * @typedef {Object} TabsInfo - See the API document for detail structure
 */

/**
 * Returns a list of all tabs
 *
 * @param {Callback.<TabsInfo>} [callback] - Callback function
 * @returns {Promise.<TabsInfo>}
 */
Connection.prototype.tabs = function(callback) {
  var url = [ this._baseUrl(), "tabs" ].join('/');
  return this.request(url).thenCall(callback);
};


/**
 * @typedef {Object} LimitsInfo - See the API document for detail structure
 */

/**
 * Returns curren system limit in the organization
 *
 * @param {Callback.<LimitsInfo>} [callback] - Callback function
 * @returns {Promise.<LimitsInfo>}
 */
Connection.prototype.limits = function(callback) {
  var url = [ this._baseUrl(), "limits" ].join('/');
  return this.request(url).thenCall(callback);
};


/**
 * @typedef {Object} ThemeInfo - See the API document for detail structure
 */

/**
 * Returns a theme info
 *
 * @param {Callback.<ThemeInfo>} [callback] - Callback function
 * @returns {Promise.<ThemeInfo>}
 */
Connection.prototype.theme = function(callback) {
  var url = [ this._baseUrl(), "theme" ].join('/');
  return this.request(url).thenCall(callback);
};

/**
 * Returns all registered global quick actions
 *
 * @param {Callback.<Array.<QuickAction~QuickActionInfo>>} [callback] - Callback function
 * @returns {Promise.<Array.<QuickAction~QuickActionInfo>>}
 */
Connection.prototype.quickActions = function(callback) {
  return this.request("/quickActions").thenCall(callback);
};

/**
 * Get reference for specified global quick aciton
 *
 * @param {String} actionName - Name of the global quick action
 * @returns {QuickAction}
 */
Connection.prototype.quickAction = function(actionName) {
  return new QuickAction(this, "/quickActions/" + actionName);
};
