/*global process */
/**
 * @file Command line interface for JSforce
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */

'use strict';

var http = require('http'),
    url = require('url'),
    openUrl = require('open'),
    commander = require('commander'),
    coprompt = require('co-prompt'),
    Repl = require('./repl'),
    jsforce = require('../jsforce'),
    registry = jsforce.registry,
    Promise = require('../promise'),
    pkg = require('../../package.json');

var repl;
var conn = null;
var connName = null;
var outputEnabled = true;
var defaultLoginUrl = null;

/**
 * @private
 */
function start() {
  var program = new commander.Command();
  program.option('-u, --username [username]', 'Salesforce username')
         .option('-p, --password [password]', 'Salesforce password (and security token, if available)')
         .option('-c, --connection [connection]', 'Connection name stored in connection registry')
         .option('-e, --evalScript [evalScript]', 'Script to evaluate')
         .option('-l, --loginUrl [loginUrl]', 'Salesforce login url')
         .option('--sandbox', 'Login to Salesforce sandbox')
         .option('--coffee', 'Using CoffeeScript')
         .version(pkg.version)
         .parse(process.argv);
  var replModule = program.coffee ? require('coffee-script/lib/coffee-script/repl') : require('repl');
  repl = new Repl(cli, replModule);
  outputEnabled = !program.evalScript;
  var options = { username: program.username, password: program.password };
  var loginUrl = program.loginUrl ? program.loginUrl :
                 program.sandbox ? 'sandbox' :
                 null;
  setLoginServer(loginUrl);
  connect(program.connection, options, function(err, res) {
    if (err) {
      console.error(err.message);
      process.exit();
    } else {
      if (program.evalScript) {
        repl.start({
          interactive: false,
          evalScript: program.evalScript
        });
      } else {
        repl.start();
      }
    }
  });
}

/**
 * @private
 */
function getCurrentConnection() {
  return conn;
}

function print(message) {
  if (outputEnabled) { console.log(message); }
}

/**
 * @private
 */
function saveCurrentConnection() {
  if (conn && connName) {
    var connConfig = {
      oauth2: conn.oauth2 && {
        clientId: conn.oauth2.clientId,
        clientSecret: conn.oauth2.clientSecret,
        redirectUri: conn.oauth2.redirectUri,
        loginUrl: conn.oauth2.loginUrl
      },
      accessToken: conn.accessToken,
      instanceUrl: conn.instanceUrl,
      refreshToken: conn.refreshToken
    };
    registry.saveConnectionConfig(connName, connConfig);
  }
}

/**
 * @private
 */
function setLoginServer(loginServer) {
  if (!loginServer) { return; }
  if (loginServer === 'production') {
    defaultLoginUrl = 'https://login.salesforce.com';
  } else if (loginServer === 'sandbox') {
    defaultLoginUrl = 'https://test.salesforce.com';
  } else if (loginServer.indexOf('https://') !== 0) {
    defaultLoginUrl = 'https://' + loginServer;
  } else {
    defaultLoginUrl = loginServer;
  }
  print('Using "' + defaultLoginUrl + '" as default login URL.');
}

/**
 * @private
 */
function connect(name, options, callback) {
  connName = name;
  options = options || {};
  var connConfig = registry.getConnectionConfig(name);
  var username, password;
  if (!connConfig) {
    connConfig = {};
    if (defaultLoginUrl) {
      connConfig.loginUrl = defaultLoginUrl;
    }
    username = name;
  }
  conn = new jsforce.Connection(connConfig);
  username = username || options.username;
  password = options.password;
  var handleLogin = function(err) {
    if (err) { return callback(err); }
    saveCurrentConnection();
    callback();
  };
  if (username) {
    loginByPassword(username, password, 2, handleLogin);
  } else {
    if (connName && conn.accessToken) {
      conn.on('refresh', function(accessToken) {
        print('Refreshing access token ... ');
        saveCurrentConnection();
      });
      conn.identity(function(err, identity) {
        if (err) {
          print(err.message);
          if (conn.oauth2) {
            callback(new Error('Please re-authorize connection.'));
          } else {
            loginByPassword(connName, null, 2, handleLogin);
          }
        } else {
          print('Logged in as : ' + identity.username);
          callback();
        }
      });
    } else {
      callback();
    }
  }
}

/**
 * @private
 */
function loginByPassword(username, password, retry, callback) {
  if (!password) {
    promptPassword('Password: ', function(err, pass) {
      if (err) { return callback(err); }
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
        callback(new Error());
      }
    } else {
      print("Logged in as : " + username);
      callback(null, result);
    }
  });
}

/**
 * @private
 */
function disconnect(name) {
  name = name || connName;
  if (registry.getConnectionConfig(name)) {
    registry.removeConnectionConfig(name);
    print("Disconnect connection '" + name + "'");
  }
  connName = null;
  conn = new jsforce.Connection();
}

/**
 * @private
 */
function authorize(clientName, callback) {
  clientName = clientName || 'default';
  var oauth2Config = registry.getClient(clientName);
  if (!oauth2Config || !oauth2Config.clientId || !oauth2Config.clientSecret) {
    return callback(new Error("No OAuth2 client information registered : '"+clientName+"'. Please register client info first."));
  }
  var oauth2 = new jsforce.OAuth2(oauth2Config);
  var state = Math.random().toString(36).substring(2);
  var authzUrl = oauth2.getAuthorizationUrl({ state: state });
  print('Opening authorization page in browser...');
  print('URL: ' + authzUrl);
  openUrl(authzUrl);
  waitCallback(oauth2Config.redirectUri, state, function(err, params) {
    if (err) { return callback(err); }
    conn = new jsforce.Connection({ oauth2: oauth2 });
    if (!params.code) {
      return callback(new Error('No authorization code returned.'));
    }
    if (params.state !== state) {
      return callback(new Error('Invalid state parameter returned.'));
    }
    print('Received authorization code. Please close the opened browser window.');
    conn.authorize(params.code).then(function(res) {
      print('Authorized. Fetching user info...');
      return conn.identity();
    }).then(function(identity) {
      print('Logged in as : ' + identity.username);
      connName = identity.username;
      saveCurrentConnection();
    }).thenCall(callback);
  });
}


/**
 * @private
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
    promptMessage(msg, function(err, code) {
      if (err) {
        callback(err);
      } else {
        callback(null, { code: decodeURIComponent(code), state: state });
      }
    });
  }
}

/**
 * @private
 */
function register(clientName, clientConfig, callback) {
  if (!clientName) {
    clientName = "default";
  }

  var prompts = {
    "clientId": "Input client ID (consumer key) : ",
    "clientSecret": "Input client secret (consumer secret) : ",
    "redirectUri": "Input redirect URI : ",
    "loginUrl": "Input login URL (default is https://login.salesforce.com) : "
  };
  Promise.resolve().then(function() {
    var deferred = Promise.defer();
    if (registry.getClient(clientName)) {
      var msg = "Client '"+clientName+"' is already registered. Are you sure you want to override ? [yN] : ";
      promptConfirm(msg, function(err, ok) {
        if (ok) {
          deferred.resolve();
        } else {
          deferred.reject(new Error('Registration canceled.'));
        }
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  })
  .then(function() {
    return Object.keys(prompts).reduce(function(promise, name) {
      return promise.then(function() {
        var message = prompts[name];
        var deferred = Promise.defer();
        if (!clientConfig[name]) {
          promptMessage(message, function(err, value) {
            if (err) { return deferred.reject(err); }
            if (value) { clientConfig[name] = value; }
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      });
    }, Promise.resolve());
  }).then(function() {
    registry.registerClient(clientName, clientConfig);
    print("Client registered successfully.");
  }).thenCall(callback);
}

/**
 * @private
 */
function listConnections() {
  var names = registry.getConnectionNames();
  for (var i=0; i<names.length; i++) {
    var name = names[i];
    print((name === connName ? '* ' : '  ') + name);
  }
}

/**
 * @private
 */
function getConnectionNames() {
  return registry.getConnectionNames();
}

/**
 * @private
 */
function getClientNames() {
  return registry.getClientNames();
}

/**
 * @private
 */
function promptMessage(message, callback) {
  repl.pause();
  coprompt(message)(function(err, res) {
    repl.resume();
    callback(err, res);
  });
}

/**
 * @private
 */
function promptPassword(message, callback) {
  repl.pause();
  coprompt.password(message)(function(err, res) {
    repl.resume();
    callback(err, res);
  });
}

/**
 * @private
 */
function promptConfirm(message, callback) {
  repl.pause();
  coprompt.confirm(message)(function(err, res) {
    repl.resume();
    callback(err, res);
  });
}

/**
 * @private
 */
function openUrlUsingSession(url) {
  var frontdoorUrl = conn.instanceUrl + '/secur/frontdoor.jsp?sid=' + conn.accessToken;
  if (url) {
    frontdoorUrl += "&retURL=" + encodeURIComponent(url);
  }
  openUrl(frontdoorUrl);
}

/* ------------------------------------------------------------------------- */

var cli = {
  start: start,
  getCurrentConnection: getCurrentConnection,
  saveCurrentConnection: saveCurrentConnection,
  listConnections: listConnections,
  setLoginServer: setLoginServer,
  getConnectionNames: getConnectionNames,
  getClientNames: getClientNames,
  connect: connect,
  disconnect: disconnect,
  authorize: authorize,
  register: register,
  openUrl: openUrlUsingSession
};

module.exports = cli;
