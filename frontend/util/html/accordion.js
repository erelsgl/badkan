function createAccordionMenu(courseName, myClass = null) {
	let menu = '<div class="courseName ' + (myClass ? myClass : "") + '"><span class="light"></span><span>' + courseName + '</span></div>'
	$(".menu").append(menu)
}

$(document).on("click", ".naccs .menu div", function () {
	var numberIndex = $(this).index();
	if (!$(this).is("active")) {
		$(".naccs .menu div").removeClass("active");
		$(".naccs ul li").removeClass("active");
		$(".naccs ul li").show();
		$(this).addClass("active");
		setTimeout(() => {$(".naccs ul li").not(".active").hide()}, 400);
		$(".naccs ul").find("li:eq(" + numberIndex + ")").addClass("active");
		var listItemHeight = $(".naccs ul")
			.find("li:eq(" + numberIndex + ")")
			.innerHeight();
		$(".naccs ul").height(listItemHeight + "px");
	}
});