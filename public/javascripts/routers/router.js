App.Router = Backbone.Router.extend({
  routes: {
    "":           "average",
    // "#":          "average",
    "/:id":       "profile"
  },

  average: function() {
    var profiles = new App.Collections.Profiles();

    profiles.fetch({
      add: true,
      success: function ( profiles ) {
        new App.Views.Graph({ collection: profiles });
      },
      error: function() {
        alert( "Error fetching profiles." );
      }
    });
  },

  profile: function(id) {
    // var profile = new Profile({ id: id });
    // task.fetch({
      // success: function(model) {
        // new App.Views.Edit({ model: task });
      // },
      // error: function() {
        // new Error({ message: 'Could not find that task.' });
        // window.location.hash = '#';
      // }
    // });
    debugger;
  }

});
