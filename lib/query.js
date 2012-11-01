var util   = require('util'),
    events = require('events'),
    _      = require('underscore')._,
    SfDate = require("./date");

/**
 * Query
 */
var Query = module.exports = function(conn, query, locator) {
  this._conn = conn;
  if (_.isString(query)) {
    this._soql = query;
  } else {
    this._query = query;
  }
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
Query.prototype._responseFormat = "QueryResult";
Query.prototype.setResponseFormat = function(responseFormat) {
  if (responseFormat in [ "QueryResult", "Records", "SingleRecord", "Count" ]) {
    this._responseFormat = responseFormat;
  }
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
  var self = this;
  var responseFormat = options.responseFormat || self._responseFormat;
  if (typeof callback === "function") {
    this.once('response', function(res) {
      switch(responseFormat) {
        case "SingleRecord":
          var rec = res.records && res.records.length > 0 ? res.records[0] : null;
          callback(null, rec);
          break;
        case "Records":
          callback(null, res.records);
          break;
        case "Count":
          callback(null, res.size);
          break;
        default:
          callback(null, res);
      }
    });
    this.once('error', function(err) { callback(err); });
  }
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  if (!self._locator) { self.totalFetched = 0; }

  var url = self._locator ?
            self._conn.urls.rest.base + "/query/" + self._locator :
            self._conn.urls.rest.base + "/query?q=" +
              encodeURIComponent(self._soql || Query.createSOQL(self._query));

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
Query.createSOQL = function(query) {
  var soql = [
    "SELECT ",
    createFieldsClause(query.fields),
    " FROM ",
    query.table
  ].join("");
  var cond = createConditionClause(query.conditions);
  if (cond) {
    soql += " WHERE " + cond;
  }
  if (query.limit) {
    soql += " LIMIT " + query.limit;
  }
  if (query.offset) {
    soql += " OFFSET " + query.offset;
  }
  return soql;
};

function createFieldsClause(fields) {
  return (fields || [ "Id" ]).join(', ');
}

function createConditionClause(conditions, operator, depth) {
  operator = operator || "AND";
  depth = depth || 0;
  if (!isArray(conditions)) {
    conditions = _.keys(conditions).map(function(key) {
      return {
        key: key,
        value: conditions[key]
      };
    });
  } else {
    conditions = conditions.map(function(cond) {
      var conds = [];
      for (var key in cond) {
        conds.push({
          key: key,
          value: cond[key]
        });
      }
      return conds.length>1 ? conds : conds[0];
    });
  }
  conditions = conditions.map(function(cond) {
    var d = depth+1, op;
    switch (cond.key) {
      case "$or" :
      case "$and" :
      case "$not" :
        if (operator !== "NOT" && conditions.length === 1) {
          d = depth; // not change tree depth
        }
        op = cond.key === "$or" ? "OR" :
             cond.key === "$and" ? "AND" :
             "NOT";
        return createConditionClause(cond.value, op, d);
      default:
        return createFieldExpression(cond.key, cond.value);
    }
  }).filter(function(expr) { return expr; });

  var paren;
  if (operator === 'NOT') {
    paren = depth > 0;
    return (paren ? "(" : "") + "NOT " + conditions[0] + (paren ? ")" : "");
  } else {
    paren = depth > 0 && conditions.length > 1;
    return (paren ? "(" : "") + conditions.join(" "+operator+" ") + (paren ? ")" : "");
  }
}

var opMap = {
  "="     : "=",
  "$eq"   : "=",
  "!="    : "!=",
  "$ne"   : "!=",
  ">"     : ">",
  "$gt"   : ">",
  "<"     : "<",
  "$lt"   : "<",
  ">="    : ">=",
  "$gte"  : ">=",
  "<="    : "<=",
  "$lte"  : "<=",
  "$like" : "LIKE",
  "$nlike" : "NOT LIKE",
  "$in"   : "IN",
  "$nin"  : "NOT IN",
  "$exists" : "EXISTS"
};

function createFieldExpression(field, value) {
  var op = "$eq";
  if (_.isObject(value)) {
    var _value;
    for (var k in value) {
      if (k[0] === "$") {
        op = k;
        value = value[k];
        break;
      }
    }
  }
  var sfop = opMap[op];
  if (!sfop || _.isUndefined(value)) { return null; }
  var valueExpr = createValueExpression(value);
  if (!valueExpr) { return null; }
  switch (sfop) {
    case "NOT LIKE":
      return "(" + [ "NOT", field, 'LIKE', valueExpr ].join(" ") + ")";
    case "EXISTS":
      return [ field, value ? "=" : "!=", "null" ].join(" ");
    default:
      return [ field, sfop, valueExpr ].join(" ");
  }
}

function createValueExpression(value) {
  if (isArray(value)) {
    return value.length > 0 ?
           "(" + value.map(createValueExpression).join(", ") + ")" :
           null;
  }
  if (value instanceof SfDate) {
    return value.toString();
  }
  if (_.isString(value)) {
    return "'" + escapeSOQLString(value) + "'";
  }
  if (_.isNumber(value)) {
    return (value).toString();
  }
  if (_.isNull(value)) {
    return "null";
  }
  return value;
}

function escapeSOQLString(str) {
  return String(str || '').replace(/'/g, "\\'");
}

function isArray(a) {
  return _.isObject(a) && _.isFunction(a.pop);
}
