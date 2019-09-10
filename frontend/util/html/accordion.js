function createAccordionMenu(courseName, myClass = null) {
	let menu = '<div class="courseName ' + (myClass ? myClass : "") + '"><span class="light"></span><span>' + courseName + '</span></div>'
	$(".menu").append(menu)
}

$(document).on("click", ".naccs .menu div", function () {
	var numberIndex = $(this).index();
	if (!$(this).is("active")) {
		$(".naccs .menu div").removeClass("active");
		$(".naccs ul li").removeClass("active");
		$(this).addClass("active");
		$(".naccs ul").find("li:eq(" + numberIndex + ")").addClass("active");
		var listItemHeight = $(".naccs ul")
			.find("li:eq(" + numberIndex + ")")
			.innerHeight();
		$(".naccs ul").height(listItemHeight + "px");
	}
});