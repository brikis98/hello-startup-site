(function($, googleAnalytics) {
  "use strict";

  var trackOutboundLink = function(event) {
    var anchor = $(event.currentTarget);
    var url = anchor.attr('href');
    var trk = anchor.attr('data-trk');
    var target = anchor.attr('target');

    var props = {};
    if (target !== "_blank") {
      event.preventDefault();
      props['hitCallback'] = function() {
        window.location = url;
      };
    }

    googleAnalytics('send', 'event', 'outbound-link', trk, url, props);
  };

  $('.tracked').on('click', trackOutboundLink);
})($, ga);