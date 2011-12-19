var events  = require('events')
  , util    = require('util')
  , request = require('request')
  , async   = require('async')
  , _       = require('underscore')._
  ;

var loginUrl = "https://login.salesforce.com"
  , serverUrl  = "https://instance.salesforce.com"
  , version  = "23.0"
  ;

/**
 * Connection
 */
var Connection = exports.Connection = function(options) {
  this.initialize(options);
};

/**
 *
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
        callback(err, res);
      }
    }
  });
};

/**
 *
 */
Connection.prototype.query = function(soql, callback) {
  var query = new Query(this, soql);
  if (callback) {
    query.run(callback);
  }
  return query;
};

/**
 *
 */
Connection.prototype.queryMore = function(locator, callback) {
  var query = new Query(this, null, locator);
  if (callback) {
    query.run(callback);
  }
  return query;
};


/**
 *
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
      var url = self.urls.rest.base + "/sobjects/" + type + "/" + id;
      self._request({
        method : 'GET',
        url : url
      }, cb);
    };
  }), function(err, results) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, isArray ? results : results[0]);
  });
};


/**
 *
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
      var so = record.type || type;
      if (!so) {
        cb({ message : 'No SObject Type defined in record' });
        return;
      }
      if (record.type) {
        record = JSON.parse(JSON.stringify(record));
        delete record.type;
      }
      var url = self.urls.rest.base + "/sobjects/" + so;
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
    if (err) {
      callback(err);
      return;
    }
    callback(null, isArray ? results : results[0]);
  });
};

/**
 *
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
      var so = record.type || type;
      if (!so) {
        cb({ message : 'No SObject Type defined in record' });
        return;
      }
      record = JSON.parse(JSON.stringify(record));
      if (record.type) {
        delete record.type;
      }
      var id = record.Id;
      delete record.Id;
      var url = self.urls.rest.base + "/sobjects/" + so + "/" + id;
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
    if (err) {
      callback(err);
      return;
    }
    callback(null, isArray ? results : results[0]);
  });
};

/**
 *
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
      var url = self.urls.rest.base + "/sobjects/" + type + "/" + id;
      self._request({
        method : 'DELETE',
        url : url
      }, cb, { id : id, success : true, errors : [] });
    };
  }), function(err, results) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, isArray ? results : results[0]);
  });
};


/**
 *
 */
Connection.prototype.sobject = function(type) {
  return new SObjectCollection(type, this);
};

/**
 *
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



/**
 * Query
 */
var Query = exports.Query = function(conn, soql, locator) {
  this._conn = conn;
  this._soql = soql;
  if (locator && locator.indexOf("/") >= 0) {
    locator = locator.split("/").pop();
  }
  this._locator = locator;
};

util.inherits(Query, events.EventEmitter);

/**
 *
 */
Query.prototype._maxFetch = 10000;
Query.prototype.maxFetch = function(maxFetch) {
  this._maxFetch = maxFetch;
  return this;
};

/**
 *
 */
Query.prototype._autoFetch = false;
Query.prototype.autoFetch = function(autoFetch) {
  this._autoFetch = autoFetch;
  return this;
};


/**
 *
 */
Query.prototype.run = 
Query.prototype.exec = 
Query.prototype.execute = function(options, callback) {
  options = options || {};
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (typeof callback === "function") {
    this.once('response', function(res) { callback(null, res); });
  }
  var self = this;
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  if (!self._locator) { self.totalFetched = 0; }

  var url = self._locator ?
            self._conn.urls.rest.query + "/" + self._locator :
            self._conn.urls.rest.query + "?q=" + encodeURIComponent(self._soql);
  self._conn._request({
    method : 'GET',
    url : url
  }, function(err, data) {
    if (err) {
      self.emit("error", err);
      return;
    }
    self.emit("response", data, self);
    self.totalSize = data.totalSize;
    _.forEach(data.records, function(record, i) {
      if (!self._stop) {
        self.emit('record', record, i, self.totalFetched++, self);
        self._stop = self.totalFetched >= maxFetch;
      }
    });
    if (!data.done && autoFetch && !self._stop) {
      self._locator = data.nextRecordsUrl.split('/').pop();
      self.execute(options, callback);
    } else {
      self._stop = true;
      self.emit('end', self);
    }
  });
};

/**
 *
 */
var SObjectCollection = exports.SObjectCollection = function(type, conn) {
  this.type = type;
  this._conn = conn;
};

SObjectCollection.prototype.create = function(records, callback) {
  this._conn.create(this.type, records, callback);
};

SObjectCollection.prototype.retrieve = function(ids, callback) {
  this._conn.retrieve(this.type, ids, callback);
};

SObjectCollection.prototype.update = function(records, callback) {
  this._conn.update(this.type, records, callback);
};

SObjectCollection.prototype.del = SObjectCollection.prototype.destroy = function(ids, callback) {
  this._conn.del(this.type, ids, callback);
};

