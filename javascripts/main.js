(function() {
  "use strict";

  var scrollSmoothly = function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({scrollTop: $($anchor.attr('href')).offset().top}, 1500, 'easeInOutExpo');
    event.preventDefault();
  };

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

  var changeHeaderOn = 50;
  var nav = $('.navbar');
  var navCollapse = $('.navbar-collapse');
  var NAVBAR_CLASS_DEFAULT = "navbar-default";
  var NAVBAR_CLASS_INVERSE = "navbar-inverse";

  var showDefaultNav = function() {
    nav.removeClass(NAVBAR_CLASS_INVERSE);
    nav.addClass(NAVBAR_CLASS_DEFAULT);    
  };

  var showDarkNav = function() {
    nav.removeClass(NAVBAR_CLASS_DEFAULT);
    nav.addClass(NAVBAR_CLASS_INVERSE);
  };

  var invertNav = function(event) {
    var top = $(window).scrollTop();
    var isExpanded = navCollapse.attr('aria-expanded') === "true";
    if (isExpanded || top >= changeHeaderOn) {
      showDarkNav();
    } else {
      showDefaultNav();
    }
  };

  $('.tracked').on('click', trackOutboundLink);
  $('a.page-scroll').on('click', scrollSmoothly);
  navCollapse.on('show.bs.collapse', showDarkNav);
  navCollapse.on('hidden.bs.collapse', showDefaultNav);
  $(window).on('scroll', invertNav);
})();