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
		'<div class="text-register description" style="font-family:monospace">Short description: ' + description + '</div>' +
		'<div class="btn btn-link">Download PDF</div>' +
		'<div class="result">' +
		'<div class="text-register countryId" style="font-family:monospace">For the submission with the id(s): ' + userDetails.country_id + '</div>' +
		'<div class="text-register grade" style="font-family:monospace">Your current grade is: ' + grade + '</div>' +
		'<br>' +
		'<div class=timestamp>Submitted on:' + timeStamp + '</div>' +
		'<br>' +
		'<div class="btn btn-solve">Solve</button>' +
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
		'<label for="course_name' + courseId + '"><div class="explanation" data-toggle="tooltip" title="Required field">Course name *</div></label>' +
		'<input id="course_name' + courseId + '" class="courseExerciseInputEdit" value="' + course.course_name + '"></input><br><br>' +
		'<label for="course_grader' + courseId + '"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
		'<input id="course_grader' + courseId + '" class="courseExerciseInputEdit" value="' + course.grader_uid + '" style="margin-left:88px"></input><br><br>' +
		'<label for="privacyEdit"><div class="explanation" data-toggle="tooltip" title="The course is shared only with the students you want.">Privacy</div></label><br>' +
		'<input type="radio" name="privacy' + courseId + '" value="public" onclick=\'$(\"#pass' + courseId + '\").hide()\'' +
		((course.privacy == 'public') ? "checked" : "") +
		'> Public</input><br>' +
		'<input type="radio" name="privacy' + courseId + '" value="private" onclick=\'$(\"#pass' + courseId + '\").show()\'' +
		((course.privacy == 'private') ? "checked" : "") +
		'> Private</input><br><br>' +
		'<div id="pass' + courseId + '"' +
		((course.privacy == 'public') ? "style=display:none;>" : ">") +
		'<label for="course_ids' + courseId + '"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
		'<input id="course_ids' + courseId + '" class="ids courseExerciseInputEdit" value="' + String(course.uids).replace(",", " ") + '" placeholder="000000000 000000000"" style="margin-left:47px"></input><br>' +
		'</div>' + '<br>' +
		'<button class="btn btn_edit" onclick="editCourse(' + "'" + courseId + "'" + ')">Edit course <i class="glyphicon glyphicon-edit"></i></button>' +
		'<button class="btn btn_delete" onclick="deleteCourse(' + "'" + courseId + "'" + ')">Delete course <i class="glyphicon glyphicon-trash"></i></button>' +
		'</div></div>';
	return html;
}

function createAccordionBodyManageExercise(exerciseObj) {
	let exerciseId = exerciseObj[0]
	let exercise = exerciseObj[1]
	let html = '<div class="panel" style="background:transparent">' +
		'<div class="exercise">' +
		'<label for="exercise_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="Required field">Exercise name *</div></label>' +
		'<input id="exercise_name' + exerciseId + '" class="courseExerciseInputEdit exerciseComplete" value="' + exercise.exercise_name + '"></input><br><br>' +
		'<label for="exercise_compiler' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The compiler for the exercise.">Exercise compiler *</div></label>' +
		'<select id="exercise_compiler' + exerciseId + '" class="swal2-input">' +
		'<option value="javac"' + (exercise.exercise_compiler == "javac" ? "selected" : "") + '>javac</option>' +
		'<option value="gcc"' + (exercise.exercise_compiler == "gcc" ? "selected" : "") + '>gcc</option>' +
		'<option value="clang"' + (exercise.exercise_compiler == "clang" ? "selected" : "") + '>clang</option>' +
		'</select>' +
		'<label for="submission_option' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="For each method checked, the student will be able to submit his exercise via the method.' +
		'If you want the student only submit via GitHub, then check only the GitHub button .">Submission option *</div></label>' +
		'<div id="submission_option' + exerciseId + '" >' +
		'<input id="github' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="github" required="" ' +
		(exercise.submission_via_github ? "checked" : "") +
		'>GitHub</input> <br>' +
		'<input id="zip' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="zip" required="" ' +
		(exercise.submission_via_zip ? "checked" : "") +
		'>Zip</input>' +
		'</div>' +
		'<label for="main_file' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The file where the main function resides">Main file *</div></label>' +
		'<input id="main_file' + exerciseId + '" class="courseExerciseInputEdit exerciseComplete" value="' + exercise.main_file + '"></input><br><br>' +
		'<label for="exercise_description' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="A short description of the exercise.">Exercise description</div></label>' +
		'<textarea id="exercise_description' + exerciseId + '" class="swal2-input">' + exercise.exercise_description + '</textarea><br><br>' +

		// TODO: Handle the pdf instruction

		'<a href="' + exercise.pdf_instruction + '" class="btn btn-link" style=""> Download pdf</a><br><br>' +

		'<label for="deadline' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The deadline of the exercise.">Deadline</div></label>' +
		'<input id="deadline' + exerciseId + '" class="courseExerciseInputEdit exerciseComplete" type="date" name="dealine" value="' + exercise.deadline + '"></input><br><br>' +
		'<label for="exercise_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="Required field">Exercise name *</div></label>' +
		'<input id="exercise_name' + exerciseId + '" class="courseExerciseInputEdit exerciseComplete" value="' + exercise.exercise_name + '"></input><br><br>' +
		'<label for="input_file_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The default input is the standart input. Let standart if you do not want to change it.">Input file name *</div></label>' +
		'<input id="input_file_name' + exerciseId + '" class="courseExerciseInputEdit exerciseComplete" value="' + exercise.input_file_name + '"></input><br><br>' +
		'<label for="output_file_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The default output is the standart output.  Let standart if you do not want to change it.">Output file name *</div></label>' +
		'<input id="output_file_name' + exerciseId + '" class="courseExerciseInputEdit exerciseComplete" value="' + exercise.output_file_name + '"></input><br><br>' +

		// TODO: Handle multiple input/output

		'<button class="btn btn_edit" onclick="editExercise(' + "'" + exerciseId + "'" + ')">Edit exercise <i class="glyphicon glyphicon-edit"></i></button>' +
		'<button class="btn btn_delete" onclick="deleteExercise(' + "'" + exerciseId + "'" + ')">Delete exercise <i class="glyphicon glyphicon-trash"></i></button>' +
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