(function() {
  "use strict";

  var isMobile = $('body').hasClass('mobile');
  var changeHeaderOn = 90;
  var enableDynamicNav = $('body').hasClass('dynamic-nav');
  var nav = $('.navbar');
  var navCollapse = $('.navbar-collapse');
  var NAVBAR_CLASS_DEFAULT = "navbar-default";
  var NAVBAR_CLASS_INVERSE = "navbar-inverse";
  var NAVBAR_ANIMATE_OPTIONS = {duration: 400, easing: 'linear', children: false};

  var scrollSmoothly = function(event) {
    var $anchor = $(this);
    var fudgeFactor = $anchor.hasClass('js-fudge-scroll') ? changeHeaderOn : 0;
    $('html, body').stop().animate({scrollTop: $($anchor.attr('href')).offset().top - fudgeFactor}, 1500, 'easeInOutExpo');
    event.preventDefault();
  };

  // Some people block Google Analytics (e.g. with AdBlock), so we need to check if it's working, or our links will
  // be broken.
  var isGoogleAnalyticsWorking = function() {
    return typeof ga == 'function' && ga.hasOwnProperty('loaded') && ga.loaded === true;
  };

  var trackOutboundLink = function(event) {
    if (!isGoogleAnalyticsWorking()) {
      return true;
    }

    var anchor = $(event.currentTarget);
    var url = anchor.attr('href');
    var trk = anchor.attr('data-trk');
    var target = anchor.attr('target');
    var valueString = anchor.attr('data-value');
    var value = valueString ? parseInt(valueString, 10) : 0;

    var props = {
      'hitType': 'event',
      'eventCategory': 'outbound',
      'eventAction': 'click-' + trk,
      'eventLabel': url,
      'eventValue': value
    };

    if (target !== "_blank") {
      event.preventDefault();
      props['hitCallback'] = function() {
        window.location = url;
      };
    }

    ga('send', props);
  };

  var showDefaultNav = function() {
    nav.switchClass(NAVBAR_CLASS_INVERSE, NAVBAR_CLASS_DEFAULT, NAVBAR_ANIMATE_OPTIONS);
  };

  var showDarkNav = function() {
    nav.switchClass(NAVBAR_CLASS_DEFAULT, NAVBAR_CLASS_INVERSE, NAVBAR_ANIMATE_OPTIONS);
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

  var newsletterModal = $('#newsletter-modal');
  var newsLetterModalShown = false;
  var showNesletterModal = function(event) {
    if (newsletterModal.length > 0 && !newsLetterModalShown) {
      newsletterModal.modal();
    }
  };

  var newsletterModalVisible = function(event) {
    newsLetterModalShown = true;
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
    $.getScript("//platform.linkedin.com/in.js?async=true", function success() {
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

    window.optimizely = window.optimizely || [];
    window.optimizely.push("activateUniversalAnalytics");

    ga('send', 'pageview');
  };

  var truncateText = function() {
    $('.book-outline dd').jTruncate({
      length: 125,
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
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
  };

  var toggleMobileNav = function(event) {
    if ($('.navbar-toggle').is(':visible')) {
      $('.navbar-collapse').collapse('toggle');
    }
  };

  $('.tracked').on('click', trackOutboundLink);
  $('a.page-scroll').on('click', scrollSmoothly);
  $("img").unveil();
  $('.navbar-collapse a.page-scroll').on('click', toggleMobileNav);
  $('#news .learn-more').appear().on('appear', showNesletterModal);
  newsletterModal.on('shown.bs.modal', newsletterModalVisible);
  loadTooltips();
  dynamicNav();
  truncateText();
  loadShareButtons();
  loadGoogleAnalytics();
})();