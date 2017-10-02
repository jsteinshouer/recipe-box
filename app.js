
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

/* Config File*/
var config = require('./config.js');

/* Routes */
var routes = require('./routes');
var recipes = require('./routes/recipes');

routes.configure({config: config});

/* Model */
var mongoose = require('mongoose');

var recipesModel = require('./model/recipes');
var usersModel = require('./model/users');

/* Configure model */
recipesModel.configure({mongoose: mongoose});
usersModel.configure({mongoose: mongoose});

/* Configure Routes */
recipes.configure({model: recipesModel});

/* configure passport authentication */
passport.use(new LocalStrategy(usersModel.authenticate));

// all environments
app.set('port', config.port);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(app.router);


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


app.all('*',routes.sslRedirect);
app.use('/', express.static(__dirname + '/public'));
app.get('/recipes',routes.validateToken, recipes.index);
app.post('/recipes',routes.validateToken, recipes.create);
app.get('/recipes/:key',routes.validateToken, recipes.get);
app.put('/recipes/:key',routes.validateToken, recipes.update);
app.delete('/recipes/:key',routes.validateToken, recipes.remove);
app.get('/myrecipes',routes.validateToken, recipes.myrecipes);
app.get('/tags',routes.validateToken, recipes.tags);
app.get('/tags/:tag',routes.validateToken, recipes.tag);
app.post('/authorize', passport.authenticate('local',{ session: false }), routes.grantToken);

var connectWithRetry = function() {
  
  return mongoose.connect(config.mongo.url,{ }, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
    else {
    	http.createServer(app).listen(config.port,config.host, function(){
		  console.log('Express server listening at http://' + config.host + ':' + config.port);
		});
    }
  });
  
};
connectWithRetry();

/* https://devcenter.heroku.com/articles/mean-apps-restful-api#connect-mongodb-and-the-app-server-using-the-node-js-driver */
// mongoose.connect(config.mongo.url,{ }, function(err) {

// 	if (err) {
// 		console.log(err);
// 		process.exit(1);
// 	}
	
// 	http.createServer(app).listen(config.port,config.host, function(){
// 	  console.log('Express server listening at http://' + config.host + ':' + config.port);
// 	});

// });
