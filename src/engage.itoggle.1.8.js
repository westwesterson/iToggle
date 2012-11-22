/*global jQuery: true, fn: true*/
/*---------------
 * jQuery iToggle Plugin by Engage Interactive
 * Examples and documentation at: http://labs.engageinteractive.co.uk/itoggle/
 * Copyright (c) 2009 Engage Interactive
 * Version: 1.8 (20-Nov-2012) by westwesterson (based on changes by pshiryaev)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.7 or later
---------------*/

(function ($) {
  'use strict';
	$.fn.iToggle = function (options) {

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

    function label(e, id) {
      if (e === true) {
        if (settings.type === 'radio') {
          $('label[for=' + id + ']').addClass('ilabel_radio');
        } else {
          $('label[for=' + id + ']').addClass('ilabel');
        }
      } else {
        $('label[for=' + id + ']').remove();
      }
    }

		this.each(function () {
			var $this = $(this),
        h = '',
        lbl = '',
        id = '';
			if ($this.is("input")) {
				id = $this.attr('id');
				label(settings.keepLabel, id);
        lbl = $('<label class="itoggle" for="' + id + '"><span></span></label>');
				if ($this.attr('checked')) {
					$this.addClass('iT_checkbox').before(lbl);
					h = $(lbl).innerHeight();
					$(lbl).css({'background-position-x': '0%', 'background-position-y': '-' + h + 'px'});
					$this.prev('label').addClass('iTon');
				} else {
					$this.addClass('iT_checkbox').before(lbl);
					h = $(lbl).innerHeight();
					$(lbl).css({'background-position-x': '100%', 'background-position-y': '-' + h + 'px'});
					$this.prev('label').addClass('iToff');
				}
			} else {
				$this.children('input:' + settings.type).each(function () {
					id = $(this).attr('id');
					label(settings.keepLabel, id);
					//$(this).addClass('iT_checkbox').before('<label class="itoggle" for="'+id+'"><span></span></label>');
          lbl = $('<label class="itoggle" for="' + id + '"><span></span></label>');
					if ($(this).attr('checked')) {
						$(this).addClass('iT_checkbox').before(lbl);
						h = $(lbl).innerHeight();
						$(lbl).css({'background-position-x': '0%', 'background-position-y': '-' + h + 'px'});
						$(this).prev('label').addClass('iTon');
					} else {
						$(this).addClass('iT_checkbox').before(lbl);
						h = $(lbl).innerHeight();
						$(lbl).css({'background-position-x': '100%', 'background-position-y': '-' + h + 'px'});
						$(this).prev('label').addClass('iToff');
					}
					if (settings.type === 'radio') {
						$(this).prev('label').addClass('iT_radio');
					}
				});
			}
		});

    function slide($object, radio, keypress) {
      settings.onClick.call($object); // Generic click callback for click at any state.

      var name = '',
        h = $object.innerHeight(),
        t = $object.prop('for');

      if ($object.hasClass('iTon')) {
        settings.onClickOff.call($object); // Click that turns the toggle to off position.
        $object.animate(
          {
            backgroundPositionX: '100%',
            backgroundPositionY: '-' + h + 'px'
          },
          {
            duration: settings.speed,
            easing: settings.easing,
            complete: function () {
              $object.removeClass('iTon').addClass('iToff');
              clickEnabled = true;
              settings.onSlide.call(this); // Generic callback after the slide has finished.
              settings.onSlideOff.call(this); // Callback after the slide turns the toggle off.
            }
          }
        );
        if (keypress !== true) {
          $('input#' + t).removeAttr('checked');
        }
      } else {
        settings.onClickOn.call($object);
        $object.animate(
          {
            backgroundPositionX: '0%',
            backgroundPositionY: '-' + h + 'px'
          },
          {
            duration: settings.speed,
            easing: settings.easing,
            complete: function () {
              $object.removeClass('iToff').addClass('iTon');
              clickEnabled = true;
              settings.onSlide.call(this); // Generic callback after the slide has finished.
              settings.onSlideOn.call(this); // Callback after the slide turns the toggle on.
            }
          }
        );
        if (keypress !== true) {
          $('input#' + t).prop('checked', 'checked');
        }
      }
      if (radio === true) {
        name = $('#' + t).prop('name');
        slide($object.siblings('label[for]'));
      }
    }

		$('label.itoggle').click(function () {
			if (clickEnabled === true) {
				clickEnabled = false;
				if ($(this).hasClass('iT_radio')) {
					if ($(this).hasClass('iTon')) {
						clickEnabled = true;
					} else {
						slide($(this), true, false);
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

    // Add keypress function
    $('input.iT_checkbox').keypress(function (event) {
      if (event.which === 32) {
        if (clickEnabled === true) {
          clickEnabled = false;
          slide($(this).prev('label.itoggle'), false, true);
        }
      }
      return true;
    });
	};
}(jQuery));