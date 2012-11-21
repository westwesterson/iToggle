/*global jQuery: true*/
/*---------------
 * Based on jQuery iToggle Plugin by Engage Interactive
 * Examples and documentation at: http://labs.engageinteractive.co.uk/itoggle/
 * Copyright (c) 2009 Engage Interactive; and updated release imbee.inc
 * Version: 1.1 (25-OCT-2012)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3 or later
 ---------------*/
(function ($) {
  'use strict';
  var methods = {
    init : function (options) {
      var clickEnabled = true,
        defaults = {
          type: 'checkbox',
          keepLabel: true,
          easing: false,
          speed: 200,
          onClick: function () {},
          onClickOn: function () {},
          onClickOff: function () {},
          onSlide: function () {},
          onSlideOn: function () {},
          onSlideOff: function () {}
        },
        settings = $.extend({}, defaults, options);

      // First define label handling.
      function label(e, id) {
        var $label = $('label[for=' + id + ']');
        if (e === true) {
          if (settings.type === 'radio') {
            $label.addClass('ilabel_radio');
          } else {
            $label.addClass('ilabel');
          }
        } else {
          $label.remove();
        }
      }

      // Define slide handling.
      function slide($object, radio) {
        // Define variables
        var h = $object.innerHeight(),
          t = $object.attr('for');

        settings.onClick.call($object); // Generic click callback for click at any state

        if ($object.hasClass('iTon')) {
          settings.onClickOff.call($object); // Click that turns the toggle to off position
          $object.animate({backgroundPosition: '100% -' + h + 'px'}, settings.speed, settings.easing, function () {
            $object.removeClass('iTon').addClass('iToff');
            clickEnabled = true;
            settings.onSlide.call(this); // Generic callback after the slide has finished.
            settings.onSlideOff.call(this); // Callback after the slide turns the toggle off.
          });
          $('input#' + t).removeAttr('checked');
        } else {
          settings.onClickOn.call($object);
          $object.animate({backgroundPosition: '0% -' + h + 'px'}, settings.speed, settings.easing, function () {
            $object.removeClass('iToff').addClass('iTon');
            clickEnabled = true;
            settings.onSlide.call(this); // Generic callback after the slide has finished.
            settings.onSlideOn.call(this); // Callback after the slide turns the toggle on.
          });
          $('input#' + t).attr('checked', 'checked');
        }
        if (radio === true) {
          slide($object.siblings('label[for]'));
        }
      }

      // iterate through each instance.
      this.each(function () {
        var $this = $(this),
          id = $this.attr('id');

        if ($this.attr('tagName') === 'INPUT') {
          label(settings.keepLabel, id);
          $this.addClass('iT_checkbox').before('<label class="itoggle" for="' + id + '"><span></span></label>');
          if ($this.attr('checked')) {
            $this.prev('label').addClass('iTon');
          } else {
            $this.prev('label').addClass('iToff');
          }
        } else {
          $this.children('input:' + settings.type).each(function () {
            label(settings.keepLabel, id);
            $(this).addClass('iT_checkbox').before('<label class="itoggle" for="' + id + '"><span></span></label>');
            if ($(this).attr('checked')) {
              $(this).prev('label').addClass('iTon');
            } else {
              $(this).prev('label').addClass('iToff');
            }
            if (settings.type === 'radio') {
              $(this).prev('label').addClass('iT_radio');
            }
          });
        }
      });
      $('label.itoggle').click(function () {
        if (clickEnabled === true) {
          clickEnabled = false;
          if ($(this).hasClass('iT_radio')) {
            if ($(this).hasClass('iTon')) {
              clickEnabled = true;
            } else {
              slide($(this), true);
            }
          } else {
            slide($(this));
          }
        }
        return false;
      });
      $('label.ilabel').click(function () {
        if (clickEnabled === true) {
          clickEnabled = false;
          slide($(this).next('label.itoggle'));
        }
        return false;
      });
    }
  };

  $.fn.iToggle = function (method) {

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    // If no method was called, we have an error.
    $.error('Method ' +  method + ' does not exist on jQuery.tooltip');
  };

}(jQuery));