App.Collections.Profiles = Backbone.Collection.extend({

  // Reference to this collection's model
  model: Profile,

  url: '/profiles',

  // parse: function(response) {
    // // debugger;
    // return response;
  // }

});
