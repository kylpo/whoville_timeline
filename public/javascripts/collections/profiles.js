App.Collections.Profiles = Backbone.Collection.extend({

  // Reference to this collection's model
  model: Profile,

  // Set user_id if it is passed in
  initialize: function(id) {
    _.bindAll(this, 'url');
    this.user_id = id;
  },

  // Url changes if constructor creates user_id
  url: function() {
    if (this.user_id) {
      return '/api/profiles/' + this.user_id;
    } else {
      return '/api/profiles';
    }
  }

});
