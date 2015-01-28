(function() {
  "use strict";

  var trackOutboundLink = function(event) {
    var anchor = $(event.currentTarget);
    var url = anchor.attr('href');
    var trk = anchor.attr('data-trk');
    var target = anchor.attr('target');

    var props = {
      'hitType': 'event',
      'eventCategory': 'outbound',
      'eventAction': 'click-' + trk,
      'eventLabel': url
    };

    if (target !== "_blank") {
      event.preventDefault();
      props['hitCallback'] = function() {
        window.location = url;
      };
    }

    ga('send', props);
  };

  $('.tracked').on('click', trackOutboundLink);
})();