/**
 * Module dependencies.
 */
var express = require('express')
  , fs = require('fs')
  ;

var app = module.exports = express.createServer();
  
app.configure(function(){
//  app.set('views', __dirname + '/views');
//  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
//  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.send('hello', 200);
});

// Routes
require('./oauth2.js');

// SSL Listen
app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

