/*global process */
var http = require('http'),
    url = require('url'),
    open = require('open'),
    commander = require('commander'),
    prompt = require('co-prompt'),
    registry = require('./registry'),
    Repl = require('./repl'),
    sf = require('../salesforce');

var repl;
var conn = null;
var connName = null;
var outputEnabled = true;

/**
 *
 */
function start(replModule) {
  var self = this;
  var program = new commander.Command();
  program.option('-u, --username [username]', 'Salesforce username')
         .option('-p, --password [password]', 'Salesforce password (and security token, if available)')
         .option('-c, --connection [connection]', 'Connection name stored in connection registry')
         .option('-e, --evalScript [evalScript]', 'Script to evaluate')
         .parse(process.argv);
  var options = { username: program.username, password: program.password };
  outputEnabled = !program.evalScript;
  connect(program.connection, options, function(err, res) {
    if (err) {
      console.error(err);
      process.exit();
    } else {
      if (program.evalScript) {
        repl = new Repl(self, replModule).start({
          interactive: false,
          evalScript: program.evalScript
        });
      } else {
        repl = new Repl(self, replModule).start();
      }
    }
  });
}

/**
 *
 */
function getCurrentConnection() {
  return conn;
}

function print(message) {
  if (outputEnabled) { console.log(message); }
}

/**
 *
 */
function authorize(clientName, callback) {
  clientName = clientName || 'default';
  var oauth2Config = registry.getClient(clientName);
  if (!oauth2Config || !oauth2Config.clientId || !oauth2Config.clientSecret) {
    return callback(new Error("No OAuth2 client information registered for : '"+clientName+"'"));
  }
  var oauth2 = new sf.OAuth2(oauth2Config);
  var state = Math.random().toString(36).substring(2);
  var authzUrl = oauth2.getAuthorizationUrl({ state: state });
  print('Opening authorization page in browser...');
  print('URL: ' + authzUrl);
  open(authzUrl);
  waitCallback(oauth2Config.redirectUri, state, function(err, params) {
    if (err) { return callback(err); }
    conn = new sf.Connection({ oauth2: oauth2 });
    if (!params.code) {
      return callback(new Error('No authorization code returned.'));
    }
    if (params.state !== state) {
      return callback(new Error('Invalid state parameter returned.'));
    }
    print('Received authorization code. Please close the opened browser window.');
    conn.authorize(params.code).then(function(res) {
      print('Authorized. Fetching user info...');
      return conn._request(conn.userInfo.url);
    }).then(function(identity) {
      print('Logged in as: ' + identity.username);
      connName = identity.username;
      saveCurrentConnection();
    }).thenCall(callback);
  });
}


/**
 *
 */
function waitCallback(serverUrl, state, callback) {
  if (serverUrl.indexOf('http://localhost:') === 0) {
    var server = http.createServer(function(req, res) {
      var qparams = url.parse(req.url, true).query;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<html><script>location.href="about:blank";</script></html>');
      res.end();
      callback(null, qparams);
      server.close();
      req.connection.end();
      req.connection.destroy();
    });
    var port = url.parse(serverUrl).port;
    server.listen(port, "localhost");
  } else {
    var msg = 'Copy & paste authz code passed in redirected URL: ';
    if (repl) { repl.pause(); }
    prompt(msg)(function(err, code) {
      if (repl) { repl.resume(); }
      if (err) {
        callback(err);
      } else {
        callback(null, { code: decodeURIComponent(code), state: state });
      }
    });
  }
}

/**
 *
 */
function saveCurrentConnection() {
  if (conn && connName) {
    var connConfig = {
      oauth2: conn.oauth2 && {
        clientId: conn.oauth2.clientId,
        clientSecret: conn.oauth2.clientSecret,
        redirectUri: conn.oauth2.redirectUri
      },
      accessToken: conn.accessToken,
      instanceUrl: conn.instanceUrl,
      refreshToken: conn.refreshToken
    };
    registry.saveConnection(connName, connConfig);
  }
}

/**
 *
 */
function connect(name, options, callback) {
  connName = name;
  options = options || {};
  var connConfig = registry.getConnection(name);
  var username, password;
  if (!connConfig) {
    connConfig = {};
    username = name;
  }
  conn = new sf.Connection(connConfig);
  username = username || options.username || connConfig.username;
  password = options.password || connConfig.password;
  if (username) {
    loginByPassword(username, password, 2, function(err) {
      if (err) { return callback(err); }
      if (!connConfig || !connConfig.username) {
        saveCurrentConnection();
      }
      callback(null, conn);
    });
  } else {
    if (connName) {
      print("Connect to '" + connName + "'");
    }
    callback(null, conn);
  }
}

/**
 *
 */
function disconnect(name) {
  name = name || connName;
  if (registry.getConnection(name)) {
    registry.removeConnection(name);
    print("Disconnect connection '" + name + "'");
  }
  connName = null;
  conn = new sf.Connection();
}

/**
 *
 */
function listConnections() {
  var names = registry.getConnectionNames();
  for (var i=0; i<names.length; i++) {
    var name = names[i];
    print((name === connName ? '* ' : '  ') + name);
  }
}

/**
 *
 */
function getConnectionNames() {
  return registry.getConnectionNames();
}

/**
 *
 */
function getClientNames() {
  return registry.getClientNames();
}

/**
 *
 */
function loginByPassword(username, password, retry, callback) {
  if (!password) {
    if (repl) { repl.pause(); }
    prompt.password('Password: ')(function(err, pass) {
      if (!pass) { return process.exit(); }
      loginByPassword(username, pass, retry, callback);
    });
    return;
  }
  conn.login(username, password, function(err, result) {
    if (err) {
      console.error(err.message);
      if (retry > 0) {
        loginByPassword(username, null, --retry, callback);
      } else {
        process.exit();
      }
    } else {
      if (repl) { repl.resume(); }
      print("Logged in as : " + username);
      callback(null, result);
    }
  });
}

/**
 *
 */
module.exports = {
  start: start,
  getCurrentConnection: getCurrentConnection,
  saveCurrentConnection: saveCurrentConnection,
  listConnections: listConnections,
  getConnectionNames: getConnectionNames,
  getClientNames: getClientNames,
  connect: connect,
  disconnect: disconnect,
  authorize: authorize
};

