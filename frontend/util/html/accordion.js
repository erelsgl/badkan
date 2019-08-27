function createAccordionManage(courseObj) {
	let courseId = courseObj[0]
	let course = courseObj[1]
	createAccordionMenu(course.course_name)
	let panel = "<li>";
	panel += createAccordionBodyManageCourse(courseObj)
	for (exerciseObj of Object.entries(course.exercises)) {
		panel += createAccordionBodyManageExercise(exerciseObj)
	}
	panel += '<button id=newExercise data-toggle="tooltip" title="New exercise" ' +
		'class="plus-button addExercise" onclick="newExercise(' + "'" + courseId + "'" + ')"></button>'
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
	return '<div class="panel" style="background: transparent">' +
		'<div class="exercise" name="Vu1XBFXwv7aXLWnWuTADwBUOzQD2_1">' +
		'<div class="exerciseName">' + exerciseName + '</div>' +
		'<br>' +
		'<div class="description" style="font-family:monospace">Short description: ' + description + '</div>' +
		'<div class="btn btn-link">Download PDF</div>' +
		'<div class="result">' +
		'<div class=countryId style="font-family:monospace">For the submission with the id(s): ' + userDetails.country_id + '</div>' +
		'<div class=grade style="font-family:monospace">Your current grade is: ' + grade + '</div>' +
		'<br>' +
		'<div class=timestamp style="font-family:URW Chancery L, cursive">Submitted on:' + timeStamp + '</div>' +
		'<br>' +
		'<div class="btn btn-success">Solve</button>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';
}

function createAccordionBodyManageCourse(courseObj) {
	let courseId = courseObj[0]
	let course = courseObj[1]
	let html = '<div class="panel" style="background:transparent">' +
		'<div class="course">' +
		'<label for="course_name"><div class="explanation" data-toggle="tooltip" title="Required field">Course name *</div></label>' +
		'<input id="course_name' + courseId + '" class="courseExerciseInputEdit" value="' + course.course_name + '"></input><br>' + '<br>' +
		'<label for="course_grader"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
		'<input id="course_grader' + courseId + '" class="courseExerciseInputEdit" value="' + course.grader_uid + '" style="margin-left:88px"></input><br>' + '<br>' +
		'<label for="privacyEdit"><div class="explanation" data-toggle="tooltip" title="The course is shared only with the students you want.">Privacy</div></label><br>' +
		'<input type="radio" name="privacy' + courseId + '" value="public" onclick=\'$(\"#pass' + courseId + '\").hide()\'' +
		((course.privacy == 'public') ? "checked" : "") +
		'> Public</input><br>' +
		'<input type="radio" name="privacy' + courseId + '" value="private" onclick=\'$(\"#pass' + courseId + '\").show()\'' +
		((course.privacy == 'private') ? "checked" : "") +
		'> Private</input><br><br>' +
		'<div id="pass' + courseId + '"' +
		((course.privacy == 'public') ? "style=display:none;>" : ">") +
		'<label for="course_ids"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
		'<input id="course_ids' + courseId + '" class="ids courseExerciseInputEdit" value="' + String(course.uids).replace(",", " ") + '" placeholder="000000000 000000000"" style="margin-left:47px"></input><br>' +
		'</div>' + '<br>' +
		'<button class="btn btn_edit" onclick="editCourse(' + "'" + courseId + "'" + ')">Edit course <i class="glyphicon glyphicon-edit"></i></button>' +
		'<button class="btn btn_edit" onclick="deleteCourse(' + "'" + courseId + "'" + ')">Delete course <i class="glyphicon glyphicon-trash"></i></button>' +
		'</div></div>';
	return html;
}

function createAccordionBodyManageExercise(exerciseObj) {
	let exerciseId = exerciseObj[0]
	let exercise = exerciseObj[1]
	let html = '<div class="panel" style="background:transparent">' +
		'<div class="exercise">' +
		// '<label for="course_name"><div class="explanation" data-toggle="tooltip" title="Required field">Course name *</div></label>' +
		// '<input id="course_name' + courseId + '" class="courseInputEdit" value="' + course.course_name + '"></input><br>' + '<br>' +
		// '<label for="course_grader"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
		// '<input id="course_grader' + courseId + '" class="courseInputEdit" value="' + course.grader_uid + '" style="margin-left:88px"></input><br>' + '<br>' +
		// '<label for="privacyEdit"><div class="explanation" data-toggle="tooltip" title="The course is shared only with the students you want.">Privacy</div></label><br>' +
		// '<input type="radio" name="privacy' + courseId + '" value="public" onclick=\'$(\"#pass' + courseId + '\").hide()\'' +
		// ((course.privacy == 'public') ? "checked" : "") +
		// '> Public</input><br>' +
		// '<input type="radio" name="privacy' + courseId + '" value="private" onclick=\'$(\"#pass' + courseId + '\").show()\'' +
		// ((course.privacy == 'private') ? "checked" : "") +
		// '> Private</input><br><br>' +
		// '<div id="pass' + courseId + '"' +
		// ((course.privacy == 'public') ? "style=display:none;>" : ">") +
		// '<label for="course_ids"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
		// '<input id="course_ids' + courseId + '" class="ids" value="' + String(course.uids).replace(",", " ") + '" placeholder="000000000 000000000"" style="margin-left:47px"></input><br>' +
		// '</div>' + '<br>' +
		// '<button class="btn btn_edit" onclick="editCourse(' + "'" + courseId + "'" + ')">Edit course <i class="glyphicon glyphicon-edit"></i></button>' +
		// '<button class="btn btn_edit" onclick="deleteCourse(' + "'" + courseId + "'" + ')">Delete course <i class="glyphicon glyphicon-trash"></i></button>' +
		'</div></div>';
	return html;
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