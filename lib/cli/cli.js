/*global process */
var http = require('http'),
    url = require('url'),
    open = require('open'),
    commander = require('commander'),
    prompt = require('co-prompt'),
    registry = require('./registry'),
    Repl = require('./repl'),
    sf = require('../salesforce');

var sfrepl;
var conn = null;
var connName = null;
var outputMessage = true;

/**
 *
 */
function start(replModule) {
  var self = this;
  var program = new commander.Command();
  program.option('-u, --username [username]', 'Salesforce username')
         .option('-p, --password [password]', 'Salesforce password (and security token, if available)')
         .option('-c, --connection [connection]', 'Connection name stored in connection registry')
         .option('-e, --eval [evalScript]', 'Evaluate script')
         .parse(process.argv);
  var autoExec = function() {
    try {
      sfrepl = new Repl(self, replModule).start();
    } catch(e) {
      console.error(e.stack);
      process.exit();
    }
  };
  if (program.evalScript) {
    autoExec = function() {
      sfrepl = new Repl(self, replModule).start({
        interactive: false,
        evalScript: program.evalScript
      });
    };
    outputMessage = false;
  }
  var options = { username: program.username, password: program.password };
  connect(program.connection, options, function(err, res) {
    if (err) {
      console.error(err);
      process.exit();
    } else {
      autoExec();
    }
  });
}

/**
 *
 */
function getCurrentConnection() {
  return conn;
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
  console.log(oauth2Config);
  var oauth2 = new sf.OAuth2(oauth2Config);
  var state = Math.random().toString(36).substring(2);
  var authzUrl = oauth2.getAuthorizationUrl({ state: state });
  open(authzUrl);
  startServer(oauth2Config.redirectUri, function(err, params) {
    if (err) { return callback(err); }
    conn = new sf.Connection({ oauth2: oauth2 });
    console.log(params);
    conn.authorize(params.code).then(function(res) {
      return conn._request(conn.userInfo.url);
    }).then(function(identity) {
      connName = identity.username;
      console.log('Logged in as: ' + identity.username);
      registry.saveCurrentConnection();
    }).thenCall(callback);
  });
  callback(null);
}

/**
 *
 */
function startServer(serverUrl, callback) {
  if (serverUrl.indexOf('http://localhost:') === 0) {
    var server = http.createServer(function (req, res) {
      var qparams = url.parse(req.url, true).query;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<html><script>window.close();</script></html>');
      res.end();
      server.close();
      callback(null, qparams);
    });
    server.listen(url.parse(serverUrl).port);
  } else {
    var msg = 'Copy & paste authorization code from query parameter in redirected URL';
    if (sfrepl) { sfrepl.pause(); }
    prompt(msg)(function(err, code) {
      if (sfrepl) { sfrepl.resume(); }
      if (err) {
        callback(err);
      } else {
        callback(null, { code: decodeURIComponent(code) });
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
      if (!connConfig || !connConfig.username) {
        saveCurrentConnection();
      }
      callback(err, conn);
    });
  } else {
    callback(null, conn);
  }
}

/**
 *
 */
function loginByPassword(username, password, retry, callback) {
  if (!password) {
    if (sfrepl) { sfrepl.pause(); }
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
      if (sfrepl) { sfrepl.resume(); }
      if (outputMessage) {
        console.log("Logged in as : " + username);
      }
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
  connect: connect,
  authorize: authorize
};

