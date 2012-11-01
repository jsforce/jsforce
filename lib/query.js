var util   = require('util'),
    events = require('events'),
    _      = require('underscore')._,
    SfDate = require("./date");

/**
 * Query
 */
var Query = module.exports = function(conn, query, locator) {
  this._conn = conn;
  if (_.isString(query)) { // if query is string, it is given in SOQL.
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
Query.prototype.limit = function(limit) {
  if (this._soql) {
    throw Error("SOQL is explicitly set in query");
  }
  this._query.limit = limit;
  return this;
};

/**
 *
 */
Query.prototype.skip =
Query.prototype.offset = function(offset) {
  if (this._soql) {
    throw new Error("SOQL is explicitly set in query");
  }
  this._query.offset = offset;
  return this;
};

/**
 *
 */
Query.prototype.sort = function(sort, dir) {
  if (this._soql) {
    throw new Error("SOQL is explicitly set in query");
  }
  if (_.isString(sort) && _.isString(dir)) {
    sort = [ [ sort, dir ] ];
  }
  this._query.sort = sort;
  return this;
};

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
var ResponseTargets = Query.ResponseTargets = {};
[ "QueryResult", "Records", "SingleRecord", "Count" ].forEach(function(f) {
  ResponseTargets[f] = f;
});

Query.prototype._responseTarget = ResponseTargets.QueryResult;
Query.prototype.setResponseTarget = function(responseTarget) {
  if (responseTarget in ResponseTargets) {
    this._responseTarget = responseTarget;
  }
  return this;
};

/**
 *
 */
Query.prototype.run = 
Query.prototype.exec = 
Query.prototype.execute = function(options, callback) {
  var self = this;
  var logger = this._conn._logger;

  options = options || {};
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  var responseTarget = options.responseTarget || self._responseTarget;
  if (typeof callback === "function") {
    this.once('response', function(res) {
      switch(responseTarget) {
        case ResponseTargets.SingleRecord:
          var rec = res.records && res.records.length > 0 ? res.records[0] : null;
          callback(null, rec);
          break;
        case ResponseTargets.Records:
          callback(null, res.records);
          break;
        case ResponseTargets.Count:
          callback(null, res.totalSize);
          break;
        default:
          callback(null, res);
      }
    });
    this.once('error', function(err) { callback(err); });
  }
  var autoFetch = options.autoFetch || self._autoFetch;
  var maxFetch = options.maxFetch || self._maxFetch;

  var url;
  if (self._locator) {
    url = self._conn.urls.rest.base + "/query/" + self._locator;
  } else {
    self.totalFetched = 0;
    var soql = self._soql || Query.createSOQL(self._query);
    url = self._conn.urls.rest.base + "/query?q=" + encodeURIComponent(soql);
    logger.debug("SOQL = " + soql);
  }

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
  var orderby = createOrderByClause(query.sort);
  if (orderby) {
    soql += " ORDER BY " + orderby;
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
  conditions = conditions || [];
  operator = operator || "AND";
  depth = depth || 0;
  if (!isArray(conditions)) { // if passed in hash object
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


/**
 *
 */
function createOrderByClause(sort) {
  sort = sort || [];
  if (_.isString(sort)) {
    sort = sort.split(/\s+/).map(function(field) {
      var dir = "ASC"; // ascending
      var flag = field[0];
      if (flag === '-') {
        dir = "DESC";
        field = field.substring(1);
      } else if (flag === '+') {
        field = field.substring(1);
      }
      return [ field, dir ];
    });
  } else if (!isArray(sort)) {
    sort = _.keys(sort).map(function(field) {
      var dir = sort[field];
      return [ field, dir ];
    });
  }
  return sort.map(function(s) {
    var field = s[0], dir = s[1];
    switch (String(dir)) {
      case "DESC":
      case "desc":
      case "descending":
      case "-":
      case "-1":
        dir = "DESC";
        break;
      default:
        dir = "ASC";
    }
    return field + " " + dir;
  }).join(", ");
}
