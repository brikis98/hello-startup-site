(function() {
  "use strict";

  var onDeviceReady = function() {
    // TODO
  };

  var initialize = function() {
    document.addEventListener('deviceready', onDeviceReady, false);
  };

  var interceptLinks = function(event) {
    var anchor = $(event.currentTarget);
    var ignore = anchor.attr("data-ignore");
    if (ignore !== "push") {
      event.preventDefault();
      var url = anchor.attr("href") + " #the-resources";
      $('.content').load(url);
    }
  };

  initialize();
  $('a').on('click', interceptLinks);
})();


