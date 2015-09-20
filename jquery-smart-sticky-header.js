/*
 * Smart Sticky Header
 * https://github.com/yaplas/smart-sticky-header
 *
 * Copyright (c) 2015 Agustin Lascialandare
 * MIT license
 */
(function($) {
  var count=0;

  $.isSmartStickyHeader = function(elem) {
    return !!$(elem).data('SmartStickyHeader');
  };

  $.SmartStickyHeader = function(elem, options) {

    options = options || {};
    options.railClass = options.railClass || 'sticky-header-rail';

    var $window = $(window);
    var $body = $(window.document.body);
    var $elem = $(elem);
    $elem.data('SmartStickyHeader', true);
    var railId = 'ssr' + (++count);

    var width, height, offset, $rail, $replacement , $shadow;

    mount();

    waitForContent(200);

    $window.on('scroll', scrollHandler);
    $window.on('resize', debounce(function(){
      unmount();
      mount();
      waitForContent(1);
    }, 500));

    function mount() {
      offset = $elem.offset();
      width = $elem.outerWidth();
      height = $elem.outerHeight();

      $rail = $('<div id="' + railId + '" class="' + options.railClass + '"></div>').css({
        top:0,
        padding:0,
        left: offset.left + 'px',
        width: width + 'px',
        height: height + 'px',
        overflow:'hidden',
        position:'fixed'
      });

      $shadow = $('<div class="sticky-header-shadow"></div>').css({
        height: height + 'px'
      });

      $replacement = $('<div class="sticky-header-replacement"></div>').css({
        height: height + 'px'
      });

      $elem.before($replacement);
      $elem.before($rail);
      $rail.append($elem);
      $rail.append($shadow);
    }

    function unmount() {
      $replacement.remove();
      $rail.replaceWith($elem);
    }

    var lastScroll;
    function scrollHandler(){
      lastScroll = lastScroll || 0;
      var scroll = $(window).scrollTop();
      var diff = scroll - lastScroll;
      lastScroll = scroll;
      var value = $rail.scrollTop()+diff;
      if (value < height && scroll > height) {
        $('.sticky-header-offset').css({height: (value > 0 ? height - value : height) + 'px'});
      } else {
        $('.sticky-header-offset').css({height: 0});
      }
      $rail.scrollTop(value);
    }

    function waitForContent(times) {
      times = times || 0;
      if (times>=0 && exists()) {
        scrollHandler();
        setTimeout(function() { waitForContent(times-1); }, 100);
      }
    }

    function exists() {
      return $('#'+railId).length;
    }

    function debounce(func, milliseconds) {
      var args, self, debouncing=0;
      return function() {
        debouncing++;
        args = Array.prototype.slice.call(arguments);
        self = this;
        if (debouncing===1) {
          executeFunc(0);
        }
      };
      function executeFunc(current) {
        if(current===debouncing) {
          func.apply(self, args);
          debouncing=0;
        } else {
          setTimeout(function(){ executeFunc(debouncing); }, milliseconds);
        }
      }
    }
  };

  $.fn.smartStickyHeader = function(options) {
    return this.each(function() {
      return $.SmartStickyHeader(this, options);
    });
  };
})(jQuery);