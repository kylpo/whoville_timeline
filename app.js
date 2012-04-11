/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , app = module.exports = express.createServer();

var ProfileDAO = require('./profileDAO').ProfileDAO;
var profileDAO = new ProfileDAO('localhost', 27017);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// ----- Begin Routes -----
app.get('/profiles', function(req, res) {
  console.log( '/profiles requested' );
  res.render('average_timeline', {title: 'Express'});
});

app.get('/profiles/:id', function(req, res) {
  console.log( '/profiles/' + req.params.id + ' requested' );
  res.render('single_timeline', {title: 'Express', id: req.params.id });
});

// ----- Begin API -----

/**
 * return all profiles in database
 */
app.get('/api/profiles', function(req, res) {
    profileDAO.findAll( function(error, profiles) {
      res.json(profiles);
      console.log( 'profiles requested' );
    });
});

/**
 * return all profiles, of user :id, in database
 */
app.get('/api/profiles/:id', function(req, res) {
    profileDAO.findById(req.params.id, function(error, profiles) {
      res.json(profiles);
      console.log( 'profile requested' + req.params.id );
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
