function createAccordion(div, courseName, exercises) {
	let menu = '<div class="courseName"><span class="light"></span><span>' + courseName + '</span></div>'
	$(".menu").append(menu)
	let panel = "<li>";
	for (exercise of exercises) {
		panel += accordionBody(exercise)
	}
	$(".nacc").append(panel + "</li>")
}

function accordionBody(exercise) {
	let exerciseName = "Exercise Name"
	let grade = 0;
	let description = "Short description:";
	let timeStamp = "Thu Jun 06 2019 12:21:34 GMT+0300 (Israel Daylight Time)."
	return '<div class="panel">' +
		'<div class="exercise" name="Vu1XBFXwv7aXLWnWuTADwBUOzQD2_1">' +
		'<div class="exerciseName">' + exerciseName + '</div>' +
		'<div class="description">Short description: ' + description + '</div>' +
		'<div class="btn btn-link">Download PDF</div>' +
		'<div class="result">' +
		'<div class=countryId>For the submission with the id(s): ' + userDetails.country_id + '</div>' +
		'<div class=grade>Your current grade is: ' + grade + '</div>' +
		'<div class=timestamp>Submitted on:' + timeStamp + '</div>' +
		'<div class="btn btn-success">Solve</button>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';

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