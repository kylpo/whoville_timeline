/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes');
var app = module.exports = express.createServer();

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

// Routes

/**
 * display all profiles in database
 */
app.get('/', function(req, res) {
    profileDAO.findAll( function(error, profiles) {
      console.log( profiles );
        res.render('average_timeline.jade',
        { locals: {
          title: 'Average',
          profiles: profiles
        }
        });
    });
});

/**
 * display all profiles, of user :id, in database
 */
app.get('/:id', function(req, res) {
    profileDAO.findById(req.params.id, function(error, profiles) {
      console.log( profiles );
        res.render('timeline.jade',
        { locals: {
          title: req.params.id,
          profiles: profiles
        }
        });
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
