(function($) {

	function initCF7() {
		console.log('initCF7');
		if (window.tgpLazyItems !== undefined) {
			var isShowed = window.tgpLazyItems.checkGroupShowed(this, function(node) {
				initCF7.call(node);
			});
			if (!isShowed) {
				return;
			}
		}
		var $contactForm = $(this);

		$('select', $contactForm).combobox();
		$('input[type="checkbox"]', $contactForm).checkbox();
		$('input[type="radio"]', $contactForm).checkbox();

		$('p', $contactForm).each(function () {
			if ($(this).find('.wpcf7-radio').length || $(this).find('.wpcf7-checkbox').length) {
				$(this).addClass('with-radio');
			} else if (!$(this).hasClass('with-label') ) {
				var label = $(this).find('label');
				if (label.length) {
					$(this).addClass('with-label');
					$(this).append(label.find('.wpcf7-form-control-wrap'));
				}
			}
		});

		// labelEqualWidth();
		if($('input[type="submit"]', $contactForm).parent().children().length > 1) {
			$('input[type="submit"]', $contactForm).wrap('<p>');
		}
		$('input[type="submit"]', $contactForm).parent().addClass('submit-outer');
	}

	function labelEqualWidthCF7() {
		console.log('labelEqualWidthCF7');
		var $contactForm = $(this);

		if (!$contactForm.hasClass('label-left')) {
			return;
		}

		var max_width = 0;
		var $labels = $('p.with-label label', $contactForm);
		$labels.removeAttr("style");
		$labels.each(function () {
			if ($(this).width() > max_width) {
				max_width = $(this).width() + 1;
			}
		});
		$labels.css('width', max_width);
	}

	$.fn.initCF7s = function() {
		$(this).each(initCF7);
	};

	$.fn.labelEqualWidthCF7s = function() {
		$(this).each(labelEqualWidthCF7);
	};

	$('.thegem-cf7').initCF7s();
	$('.thegem-cf7').labelEqualWidthCF7s();

})(jQuery);
