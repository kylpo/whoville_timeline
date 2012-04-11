var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

ProfileDAO = function(host, port) {
  this.db = new Db('test', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

ProfileDAO.prototype.getCollection = function(callback) {
  this.db.collection('whoville_timeline', function(error, profile_collection) {
    if (error) callback(error);
    else callback(null, profile_collection);
  });
};

/**
 * returns array of ALL profiles in JSON form
 */
ProfileDAO.prototype.findAll = function(callback) {
    this.getCollection(function(error, profile_collection) {
      if (error) callback(error);
      else {
        var results = [];
        var cursor = profile_collection.find();

        while (cursor.hasNext()) results.push(cursor.next());

        callback(null, results);
      }
    });
};

/**
 * returns array of user profiles in JSON form
 * requires valid id
 */
ProfileDAO.prototype.findById = function(id, callback) {
    this.getCollection(function(error, profile_collection) {
      if (error) callback(error);
      else {
        var results = [];
        var cursor = profile_collection.find({id: id});

        while (cursor.hasNext()) results.push(cursor.next());

        callback(null, results);
      }
    });
};

exports.ProfileDAO = ProfileDAO;
