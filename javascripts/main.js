(function($, googleAnalytics) {
  "use strict";

  var trackOutboundLink = function(event) {
    var anchor = $(event.currentTarget);
    var url = anchor.attr('href');
    var trk = anchor.attr('data-trk');
    var target = anchor.attr('target');

    googleAnalytics.push(['_trackEvent', 'outbound-link', trk, url]);

    if (target !== "_blank") {
      event.preventDefault();
      googleAnalytics.push(function() {
        window.location = url;
      });
    }
  };

  $('.tracked').on('click', trackOutboundLink);
})($, _gaq);