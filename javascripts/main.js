(function() {
  "use strict";

  var isMobile = $('body').hasClass('mobile');

  var scrollSmoothly = function(event) {
    var $anchor = $(this);
    console.log($anchor);
    console.log($anchor.attr('href'));
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

  var changeHeaderOn = 90;
  var enableDynamicNav = $('body').hasClass('dynamic-nav');
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

  var loadTwitter = function() {
    var load = function(d,s,id) {
      var js,
          fjs=d.getElementsByTagName(s)[0],
          p=/^http:/.test(d.location)?'http':'https';

      if (!d.getElementById(id)) {
        js=d.createElement(s);
        js.id=id;
        js.async=true;
        js.src=p+'://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js,fjs);
      }
    };

    load(document, 'script', 'twitter-wjs');
  };

  var loadLinkedIn = function() {
    $.getScript("http://platform.linkedin.com/in.js?async=true", function success() {
      IN.init({});
    });
  };

  var loadFacebook = function() {
    var load = function(d, s, id) {
      var js,
          fjs = d.getElementsByTagName(s)[0];

      if (d.getElementById(id)) return;
      
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=180189308723492&version=v2.0";
      js.async = true;
      fjs.parentNode.insertBefore(js, fjs);
    };

    load(document, 'script', 'facebook-jssdk');
  };

  var loadGoogle = function() {
    $.getScript('https://apis.google.com/js/platform.js');
  };

  var loadShareButtons = function() {
    loadTwitter();
    loadLinkedIn();
    loadFacebook();
    loadGoogle();
  };

  var loadGoogleAnalytics = function() {
    var load = function(i,s,o,g,r,a,m) {
      i['GoogleAnalyticsObject']=r;
      i[r]=i[r]||function() {
        (i[r].q=i[r].q||[]).push(arguments);
      };
      i[r].l=1*new Date();
      a=s.createElement(o);
      m=s.getElementsByTagName(o)[0];
      a.async=1;
      a.src=g;
      m.parentNode.insertBefore(a,m);
    };

    load(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-57853211-1', 'auto');
    ga('send', 'pageview');
  };

  var truncateText = function() {
    $('.book-outline dd').jTruncate({
      length: 200,
      moreText: " (more)",
      lessText: " (less)"
    });

    $('p.truncate').jTruncate({
      length: 224,
      moreText: " (more)",
      lessText: " (less)"
    });
  };

  var dynamicNav = function() {
    if (enableDynamicNav) {
      navCollapse.on('shown.bs.collapse', invertNav);
      navCollapse.on('hidden.bs.collapse', invertNav);
      $(window).on('scroll', invertNav);
    }
  };

  var loadTooltips = function() {
    if (!isMobile) {
      $('[data-toggle="tooltip"]').tooltip();
    }
  };

  $('.tracked').on('click', trackOutboundLink);
  $('a.page-scroll').on('click', scrollSmoothly);
  $("img").unveil();
  $('#valuation-slider').slider();
  loadTooltips();
  dynamicNav();
  truncateText();
  loadShareButtons();
  loadGoogleAnalytics();
})();