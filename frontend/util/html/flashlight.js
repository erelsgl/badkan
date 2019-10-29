$(document).ready(function () {
	let widthShow = 400
	let widthShadow1 = 350
	let widthShadow2 = 300
	var spotLight = $('<div>').addClass('spotLight');
	var spotLight2 = $('<div>').addClass('spotLight2');
	var spotLight3 = $('<div>').addClass('spotLight3');
	$('body').append(spotLight3, spotLight2, spotLight);
	event.preventDefault();
	$('.spotLight3').toggleClass('shadow_2').width(widthShadow2).height(widthShadow2);
	$('.spotLight2').toggleClass('shadow_1').width(widthShadow1).height(widthShadow1);
	$('.spotLight').toggleClass('show').width(widthShow).height(widthShow);
	$('.show').css({
		// Change here to 1.
		boxShadow: '0 0 0 20000px rgba(0,0,0,1.0)'
	});
	$('.shadow_1').css({
		boxShadow: '0 0 0 20000px rgba(0,0,0,0.5)'
	});
	$('.shadow_2').css({
		boxShadow: '0 0 0 20000px rgba(0,0,0,0.3)'
	});
	let offsetShow = widthShow / 2;
	let offsetShadow1 = widthShadow1 / 2
	let offsetShadow2 = widthShadow2 / 2
	$(window).on('mousemove', function (event) {
		var mouseX = event.pageX;
		var mouseY = event.pageY;
		$('.shadow_2').css({
			top: mouseY,
			left: mouseX,
			transform: 'translate(-' + offsetShadow2 + 'px , -' + offsetShadow2 + 'px)'
		});
		$('.shadow_1').css({
			top: mouseY,
			left: mouseX,
			transform: 'translate(-' + offsetShadow1 + 'px , -' + offsetShadow1 + 'px)'
		});
		$('.show').css({
			top: mouseY,
			left: mouseX,
			transform: 'translate(-' + offsetShow + 'px , -' + offsetShow + 'px)'
		});
	});
});