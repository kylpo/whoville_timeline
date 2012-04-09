var Profile = Backbone.Model.extend({
  // use Mongo's _id as unique id
  idAttribute: "_id",

  attrCount: function() {
    var count = 0;

    for (var prop in this.attributes) {

      // ommit non-profile attributes
      if ( prop !== '_id' && prop !== 'id' && prop !== 'date' ){
        count++;
      }
    }

    return count;
  }


});
