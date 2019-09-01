function createAccordionManage(courseObj) {
	let courseId = courseObj[0]
	let course = courseObj[1]
	createAccordionMenu(course.course_name)
	let panel = "<li>";
	panel += createAccordionBodyManageCourse(courseId, course)
	for (exerciseObj of Object.entries(course.exercises)) {
		let exerciseId = exerciseObj[0]
		let exercise = exerciseObj[1]
		panel += createAccordionBodyManageExercise(exerciseId, exercise)
	}
	panel += '<button id=newExercise data-toggle="tooltip" title="New exercise" ' +
		'class="plus-button addExercise" onclick="newExercise(' + "'" + courseId + "'" + ')"></button>'
	$(".nacc").append(panel + "</li>")
}

function createAccordionHome(courseObj, myClass) {
	let courseId = courseObj[0]
	let course = courseObj[1]
	createAccordionMenu(course.course_name, myClass)
	let panel = "<li>";
	for (exerciseObj of Object.entries(course.exercises)) {
		let exerciseId = exerciseObj[0]
		let exercise = exerciseObj[1]
		if (myClass == "myCourse") {
			panel += createAccordionBodyHomeSolve(exerciseId, exercise)
		} else if (myClass == "public") {
			panel += createAccordionBodyHomeRegister(courseId, exercise)
		}
	}
	$(".nacc").append(panel + "</li>")
}

function createAccordionMenu(courseName, myClass = null) {
	let menu = '<div class="courseName ' + (myClass ? myClass : "") + '"><span class="light"></span><span>' + courseName + '</span></div>'
	$(".menu").append(menu)
}

function createAccordionBodyHomeRegister(courseId, exercise) {
	return '<div class="exercise panel public">' + // Check in the class here for the style
		'<div class="exerciseName">' + exercise.exercise_name + '</div><br><br>' +
		'<div class="description">Compiler: ' + exercise.exercise_compiler + '</div><br><br>' +
		(exercise.exercise_description ? '<div class="description" style="font-family:monospace"> Description: ' +
			exercise.exercise_description + '</div><br><br>' : "") +
		(exercise.pdf_instruction ? '<a href="' + exercise.pdf_instruction +
			'" style="">Current pdf</a><br><br>' : "") +
		(exercise.deadline ? '<div class=timestamp style="font-family:URW Chancery L, cursive">Deadline: ' +
			exercise.deadline + '</div><br><br>' : "") +
		'<button class="btn btn_edit" onclick="registeringToCourse(' + "'" + courseId + "'" +
		')">Register to the course <i class="glyphicon glyphicon-plus"></i></button>' +
		'</div>';
}


function createAccordionBodyHomeSolve(exerciseId, exercise) {
	return '<div class="exercise panel myCourse">' + // Check in the class here for the style
		'<div class="exerciseName">' + exercise.exercise_name + '</div><br><br>' +
		'<div class="description">Compiler: ' + exercise.exercise_compiler + '</div><br><br>' +
		(exercise.exercise_description ? '<div class="description" style="font-family:monospace"> Description: ' +
			exercise.exercise_description + '</div><br><br>' : "") +
		(exercise.pdf_instruction ? '<a href="' + exercise.pdf_instruction +
			'" style="">Current pdf</a><br><br>' : "") +
		(exercise.deadline ? '<div class=timestamp style="font-family:URW Chancery L, cursive">Deadline: ' +
			exercise.deadline + '</div><br><br>' : "") +
		'<div class="">The filename where the main function of your submission must be: ' + exercise.main_file + '</div><br><br>' +
		'<button class="btn btn_edit" onclick="solveExercise(' + "'" + exerciseId + "'" +
		// Need to add the last(s) submission.
		')">Solve <i class="glyphicon glyphicon-fire"></i></button>' +
		'</div>';
}

function createAccordionBodyManageCourse(courseId, course) {
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
		'<button class="btn btn_edit" onclick="deleteCourse(' + "'" + courseId + "'" + ')">Delete course <i class="glyphicon glyphicon-trash"></i></button>' +
		'</div></div>';
	return html;
}

function createAccordionBodyManageExercise(exerciseId, exercise) {
	let html = '<div class="panel" style="background:transparent">' +
		'<div class="exercise">' +
		'<label for="exercise_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="Required field">Exercise name *</div></label>' +
		'<input id="exercise_name' + exerciseId + '" class="courseExerciseInputEdit" value="' + exercise.exercise_name + '"></input><br><br>' +
		'<label for="exercise_compiler' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The compiler for the exercise.">Exercise compiler *</div></label>' +
		'<select id="exercise_compiler' + exerciseId + '" class="swal2-input">' + /* For Jeremy you can play with the class swal2 if you want. */
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
		'<input id="main_file' + exerciseId + '" class="courseExerciseInputEdit" value="' + exercise.main_file + '"></input><br><br>' +
		'<label for="exercise_description' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="A short description of the exercise.">Exercise description</div></label>' +
		'<textarea id="exercise_description' + exerciseId + '" class="swal2-input">' + exercise.exercise_description + '</textarea><br><br>' +
		(exercise.pdf_instruction ? '<a href="' + exercise.pdf_instruction + '" style=""> Current pdf</a><br><br>' : '') +
		'<label for="exercise_instruction' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="Must be a pdf file.">Pdf instruction file</div></label>' +
		'<input id="exercise_instruction' + exerciseId + '" type="file" accept="application/pdf"><br><br>' +
		'<label for="deadline' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The deadline of the exercise.">Deadline</div></label>' +
		'<input id="deadline' + exerciseId + '" class="courseExerciseInputEdit" type="date" name="dealine" value="' + exercise.deadline + '"></input><br><br>' +
		'<label for="input_file_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The default input is the standart input. Let standart if you do not want to change it.">Input file name *</div></label>' +
		'<input id="input_file_name' + exerciseId + '" class="courseExerciseInputEdit" value="' + exercise.input_file_name + '"></input><br><br>' +
		'<label for="output_file_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The default output is the standart output.  Let standart if you do not want to change it.">Output file name *</div></label>' +
		'<input id="output_file_name' + exerciseId + '" class="courseExerciseInputEdit" value="' + exercise.output_file_name + '"></input><br><br>';
	for (item in exercise.input_output_points) {
		html +=
			'<label for="input_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="The first given input.">Given input *</div></label>' +
			'<textarea id="input_' + exerciseId + item + '" class="courseExerciseInputEdit">' + exercise.input_output_points[item].input + '</textarea><br><br>' +
			'<label for="output_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="The first given output.">Given output *</div></label>' +
			'<textarea id="output_' + exerciseId + item + '" class="courseExerciseInputEdit">' + exercise.input_output_points[item].output + '</textarea><br><br>' +
			'<label for="points_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="The number of point for a good answer.">Points number * </div></label>' +
			'<input id="points_' + exerciseId + item + '" class="courseExerciseInputEdit" type="number" value="' + exercise.input_output_points[item].point + '"></input><br><br>'
	}
	html += '<button class="btn btn_edit" onclick="editExercise(' + "'" + exerciseId + "','" + exercise.input_output_points.length + "'" + ')">Edit exercise <i class="glyphicon glyphicon-edit"></i></button>' +
		'<button class="btn btn_edit" onclick="deleteExercise(' + "'" + exerciseId + "'" + ')">Delete exercise <i class="glyphicon glyphicon-trash"></i></button>' +
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