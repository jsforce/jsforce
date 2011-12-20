var request = require('request')
  , async   = require('async')
  , _       = require('underscore')._
  , Query   = require('./query')
  , SObject = require('./sobject')
  ;

/**
 * constructor
 */
var Connection = module.exports = function(options) {
  this.initialize(options);
};

var loginUrl = "https://login.salesforce.com"
  , serverUrl  = "https://instance.salesforce.com"
  , version  = "23.0"
  ;

/**
 * initialize
 */
Connection.prototype.initialize = function(options) {
  this.loginUrl  = options.loginUrl || this.loginUrl || loginUrl;
  this.version   = options.version || this.version || version;
  this.serverUrl = options.serverUrl || this.serverUrl || serverUrl.replace("instance", options.instance || "na1");
  this.urls = {
    soap : {
      login : [ this.loginUrl, "services/Soap/u", this.version ].join('/')
    },
    rest : {
      base : [ this.serverUrl, "services/data", "v" + this.version ].join('/')
    }
  };
  this.urls.rest.query = this.urls.rest.base + "/query";
  this.accessToken = options.sessionId || options.accessToken || this.accessToken;
//  this.flattenNS = options.flattenNS || false; 
  this.maxRequest = options.maxRequest || this.maxRequest || 10;
};


/**
 * _request
 * @private
 */
Connection.prototype._request = function(params, callback, noContentResponse) {
  params.headers = params.headers || {};
  if (this.accessToken) {
    params.headers.Authorization = "OAuth " + this.accessToken;
  }
  request(params, function(err, response) {
    if (err) {
      callback(err);
    } else {
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
      record = JSON.parse(JSON.stringify(record));
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
      record = JSON.parse(JSON.stringify(record));
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
      record = JSON.parse(JSON.stringify(record));
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
    this._sobjects[type] || new SObject(type, this);
  return sobject;
};

/**
 * login
 */
Connection.prototype.login = function(username, password, callback) {
  function esc(str) {
    return str && String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var self = this;
  var body = [
    '<se:Envelope xmlns:se="http://schemas.xmlsoap.org/soap/envelope/">',
    '<se:Header xmlns:sfns="urn:partner.soap.sforce.com"/>',
    '<se:Body>',
    '<login xmlns="urn:partner.soap.sforce.com" xmlns:ns1="sobject.partner.soap.sforce.com">',
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
    var m = response.body.match(/<serverUrl>([^<]+)<\/serverUrl>/);
    var serverUrl = m && m[1];
    m = response.body.match(/<sessionId>([^<]+)<\/sessionId>/);
    var sessionId = m && m[1];
    self.initialize({ 
      serverUrl: serverUrl.split('/').slice(0, 3).join('/'), 
      sessionId: sessionId
    });
    callback(null);
  });
};



