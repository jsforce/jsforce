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
Apex.prototype.get = function(path, callback) {
  this._conn._request({
    method: 'GET',
    url: this._baseUrl() + path
  }, callback);
};

/**
 *
 */
Apex.prototype.post = function(path, body, callback) {
  this._conn._request({
    method: 'POST',
    url: this._baseUrl() + path,
    body: JSON.stringify(body),
    headers : {
      "Content-Type" : "application/json"
    }
  }, callback);
};

/**
 *
 */
Apex.prototype.put = function(path, body, callback) {
  this._conn._request({
    method: 'PUT',
    url: this._baseUrl() + path,
    body: JSON.stringify(body),
    headers : {
      "Content-Type" : "application/json"
    }
  }, callback);
};

/**
 *
 */
Apex.prototype.patch = function(path, body, callback) {
  this._conn._request({
    method: 'PATCH',
    url: this._baseUrl() + path,
    body: JSON.stringify(body),
    headers : {
      "Content-Type" : "application/json"
    }
  }, callback);
};

/**
 *
 */
Apex.prototype.delete = function(path, callback) {
  this._conn._request({
    method: 'DELETE',
    url: this._baseUrl() + path
  }, callback);
};


/**
 *
 */
module.exports = Apex;
