var OAuth2 = require('../../lib/oauth2.js')
  , config = require('../config/oauth2.js')
  , app    = require('./app')
  ;

var oauth2 = new OAuth2(config);

/**
 *
 */
app.get('/oauth2/auth', function(req, res){
  res.redirect(oauth2.getAuthorizationUrl({ }));
});

/**
 *
 */
app.get('/oauth2/callback', function(req, res){
  res.send('ok');
});


