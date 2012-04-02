App = {
  Views: {},
  Collections: {},
  init: function() {
    new App.Router();
    Backbone.history.start();
  }
};

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
  App.init();
});
