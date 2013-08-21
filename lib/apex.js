/**
 * API class for Apex REST endpoint call
 */
var Apex = function(conn) {
  this._conn = conn;
};

/**
 *
 */
Apex.prototype._baseUrl = function() {
  return this._conn.instanceUrl + "/services/apexrest";
};

/**
 *
 */
Apex.prototype._createRequestParams = function(method, path, body) {
  var params = {
    method: method,
    url: this._baseUrl() + path
  };
  if (!/^(GET|DELETE)$/i.test(method)) {
    params.headers = {
      "Content-Type" : "application/json"
    };
  }
  if (body) {
    params.body = JSON.stringify(body);
  }
  return params;
};

/**
 *
 */
Apex.prototype.get = function(path, callback) {
  return this._conn._request(this._createRequestParams('GET', path)).thenCall(callback);
};

/**
 *
 */
Apex.prototype.post = function(path, body, callback) {
  if (typeof body === 'function') {
    callback = body;
    body = undefined;
  }
  var params = this._createRequestParams('POST', path, body);
  return this._conn._request(params).thenCall(callback);
};

/**
 *
 */
Apex.prototype.put = function(path, body, callback) {
  if (typeof body === 'function') {
    callback = body;
    body = undefined;
  }
  var params = this._createRequestParams('PUT', path, body);
  return this._conn._request(params).thenCall(callback);
};

/**
 *
 */
Apex.prototype.patch = function(path, body, callback) {
  if (typeof body === 'function') {
    callback = body;
    body = undefined;
  }
  var params = this._createRequestParams('PATCH', path, body);
  return this._conn._request(params).thenCall(callback);
};

/**
 *
 */
Apex.prototype.delete = function(path, callback) {
  return this._conn._request(this._createRequestParams('DELETE', path)).thenCall(callback);
};


/**
 *
 */
module.exports = Apex;
