// Mobile menu
$('.burger').on('click', function () {
	$('.menu').toggleClass('active');
	$('.burger').toggleClass('active');
	$('.sub_menu').slideUp(300);
});

$('.menu_item_has_children > a').on('click', function (e) {
	if ($(window).width() <= 1199) {
		e.preventDefault();
		$(this).closest('.menu_item_has_children').find('.sub_menu').slideToggle(300);
		$(this).toggleClass('active');
	}
});

$(document).on('click', function (e) {
	console.log($(e.target));
	if (!$(e.target).closest('.header').length) {
		console.log('out');
		closeMobMenu();
	}
	e.stopPropagation();
});

function closeMobMenu() {
	$('.menu').removeClass('active');
	$('.sub_menu').slideUp(300);
	$('.burger').removeClass('active');
}

// To top
$('body').on('click', '.to_top_btn', function(){
	$('html, body').animate({ scrollTop: 0}, 1000);
	return false;
});

// Home slider
$('.home_slider').owlCarousel({
	loop: true,
	items:	1,
	mouseDrag: false,
	touchDrag: false,
	dots: false,
	nav: false,
	smartSpeed: 500,
	autoplay: true,
	autoplayTimeout: 4000
});