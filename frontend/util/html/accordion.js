function createAccordionManage(courseObj, exercises) {
	let course = courseObj[1]
	createAccordionMenu(course.course_name)
	let panel = "<li>";
	panel += createAccordionBodyManageExercise(courseObj)
	// for (exercise of exercises) {
	// 	panel += createAccordionBodyManage(course, exercise)
	// }
	$(".nacc").append(panel + "</li>")
}

function createAccordionHomeRegister(courseName, exercises) {
	createAccordionMenu(courseName)
	let panel = "<li>";
	for (exercise of exercises) {
		panel += createAccordionBodyHomeRegister(exercise)
	}
	$(".nacc").append(panel + "</li>")
}

function createAccordionMenu(courseName) {
	let menu = '<div class="courseName"><span class="light"></span><span>' + courseName + '</span></div>'
	$(".menu").append(menu)
}

function createAccordionBodyHomeRegister(exercise) {
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

function createAccordionBodyManageExercise(courseObj) {
	let courseId = courseObj[0]
	let course = courseObj[1]
	let html = '<div class="panel">' +
		'<div class="course" name="' + courseId + '">' +
		'<label for="courseInputEdit"><div class="explanation" data-toggle="tooltip" title="Required field">Course name *</div></label>' +
		'<input class="courseInputEdit" value="' + course.course_name + '"></input><br>' +
		'<label for="courseInputEdit"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
		'<input class="courseInputEdit" value="' + course.grader + '"></input><br>' +
		'<label for="privacyEdit"><div class="explanation" data-toggle="tooltip" title="The course is shared only with the students you want.">Privacy</div></label><br>' +
		'<input type="radio" name="privacy' + courseId + '" value="public" onclick=\'$(\"#pass' + courseId + '\").hide()\'' +
		((course.privacy == 'public') ? "checked" : "") +
		'> Public</input><br>' +
		'<input type="radio" name="privacy' + courseId + '" value="private" onclick=\'$(\"#pass' + courseId + '\").show()\'' +
		((course.privacy == 'private') ? "checked" : "") +
		'> Private</input><br><br>' +
		'<div id="pass' + courseId + '"' + 
		((course.privacy == 'public') ? "style=display:none;>" : ">") + 
		'<label for="ids"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
		'<input class="ids" class="swal2-input" placeholder="000000000 000000000">' +
		'<input class="ids" value="' + course.uids + ' placeholder="000000000 000000000""></input><br>' +

		'</div>' +
		'</div>';
	return html;
}

// function createAccordionBodyManageExercise(exercise) {

// }

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