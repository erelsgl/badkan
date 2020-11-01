let allSubmissions = new Map();
let inputOutputPointsNew = []

function onLoadMain() {
    // The user will have a field "myCourses" and retreive all the course by this field.
    // Each course will have a field "My exercises"...
    doPostJSON("", "get_courses_manager/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {

    // TODO: use form to save the input.
    if (data.courses) {
        for (courseObj of Object.entries(data.courses)) {
            let courseId = courseObj[0]
            let course = courseObj[1]
            let index = getExercisesItem(data.exercises, courseId)
            if (index != -1) {
                createAccordionManage(courseId, course, data.exercises[index], data.ids);
            } else {
                createAccordionManage(courseId, course, [], data.ids);
            }
        }
    }
    if ($('.courseName')[0]) {
        $('.courseName')[0].click();
    }
    hideLoader()
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function createAccordionManage(courseId, course, exercises, ids) {
    createAccordionMenu(course.course_name)
    let panel = "<li>";
    panel += createAccordionBodyManageCourse(courseId, course, ids)
    for (exerciseObj of Object.entries(exercises)) {
        let exerciseId = exerciseObj[0]
        let exercise = exerciseObj[1]
        panel += createAccordionBodyManageExercise(exerciseId, exercise, courseId)
    }
    panel += '<button id=newExercise data-toggle="tooltip" title="New exercise" ' +
        'class="plus-button addExercise" onclick="newExercise(' + "'" + courseId + "'" + ')"></button>'
    $(".nacc").append(panel + "</li>")
}

function createAccordionBodyManageCourse(courseId, course, ids) {
    let html = '<div class="panel">' +
        '<div class="course">' +
        '<label for="course_name' + courseId + '"><div class="explanation" data-toggle="tooltip" title="Required field" style="margin-top: 17px">Course name *</div></label>' +
        '<input id="course_name' + courseId + '" class="my_input" value="' + course.course_name + '"></input><br><br>' +
        '<label for="course_grader' + courseId + '"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
        '<input id="course_grader' + courseId + '" class="my_input" value="' + (course.grader_uid ? extract_grader_id(course.grader_uid, ids) : course.grader_uid) + '" style="margin-left:88px"></input><br><br>' +
        '<label for="privacyEdit"><div class="explanation" data-toggle="tooltip" title="Share this course only with specific students.">Privacy</div></label><br>' +
        '<div class="radio_checkbox border_radio">' +
        '<input id="radio_public' + courseId + '" class="btn_radio" type="radio" name="privacy' + courseId + '" value="public" onclick=\'$(\"#pass' + courseId + '\").hide()\'' +
        ((course.privacy == 'public') ? "checked" : "") +
        '/>' +
        '<label class="btn_radio" for="radio_public' + courseId + '">Public</label><br>' +
        '<input id="radio_private' + courseId + '" class="btn_radio" type="radio" name="privacy' + courseId + '" value="private" onclick=\'$(\"#pass' + courseId + '\").show()\'' +
        ((course.privacy == 'private') ? "checked" : "") +
        '/><label class="btn_radio" for="radio_private' + courseId + '">Private</label>' +
        '</div><br><br>' +
        '<div id="pass' + courseId + '"' +
        ((course.privacy == 'public') ? "style=display:none;>" : ">") +
        '<label for="course_ids' + courseId + '"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Student ids *</div></label>' +
        '<input id="course_ids' + courseId + '" class="ids my_input" value="' + (course.uids ? uidToCountryIds(course.uids, ids) : course.uids) + '" value="000000000 000000000""></input><br><br><br><br>' +
        '</div>' + '<br>' +
        '<button class="btn blue_enjoy" onclick="editCourse(' + "'" + courseId + "'" + ')">Edit course <i class="glyphicon glyphicon-edit"></i></button>' +
        '<button class="btn white_enjoy" onclick="deleteCourse(' + "'" + courseId + "'" + ')">Delete course <i class="glyphicon glyphicon-trash"></i></button>' +
        '</div></div>' +
        '<div class="manage_button"><button class="btn btn_manage btn_course" onclick="downloadGradesCourse(' + "'" + courseId + "'" + ')" style="border:1px solid green"><span>Download Course Grades</button></div>';
    return html;
}

function extract_grader_id(grader_uid, ids) {
    answer = ""
    if (Array.isArray(grader_uid))
        for (grader of grader_uid) {
            answer += ids[grader] + " "
        }
    else
        answer += ids[grader_uid]
    return answer
}

function createAccordionBodyManageExercise(exerciseId, exercise, courseId) {
    if (exercise.submissions) {
        if (allSubmissions.get(courseId)) {
            allSubmissions.get(courseId).push([Object.values(exercise.submissions), exercise.exercise_name])
        } else {
            allSubmissions.set(courseId, [])
            allSubmissions.get(courseId).push([Object.values(exercise.submissions), exercise.exercise_name])
        }
    }
    let html = '<button type="button" class="collapsible">' + exercise.exercise_name + '</button>' + '<div class="content">' + '<div class="panel">' +
        '<div class="exercise">' +
        '<label for="exercise_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="Required field" style="margin-top: 17px">Exercise name *</div></label>' +
        '<input id="exercise_name' + exerciseId + '" class="my_input" value="' + exercise.exercise_name + '"></input><br><br>' +
        '<label for="exercise_compiler' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The compiler for the exercise.">Exercise compiler *</div></label>' +
        '<select id="exercise_compiler' + exerciseId + '" class="swal2-input input">' +
        '<option  value="javac"' + (exercise.exercise_compiler == "javac" ? "selected" : "") + '>javac</option>' +
        '<option  value="g++"' + (exercise.exercise_compiler == "g++" ? "selected" : "") + '>g++ (c or c++)</option>' +
        '<option  value="python3"' + (exercise.exercise_compiler == "python3" ? "selected" : "") + '>python3</option>' +
        '<option  value="perl"' + (exercise.exercise_compiler == "perl" ? "selected" : "") + '>perl</option>' +
        '</select>' +
        '<label for="submission_option' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The student can submit his exercise via each method checked.' +
        'If you want the student to submit only via GitHub, check only the GitHub box .">Submission option *</div></label>' +
        '<div id="submission_option' + exerciseId + '" ></div>' +
        '<div class="radio_checkbox"><input class="btn_checkbox"  id="github' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="github" required="" ' +
        (exercise.submission_via_github ? "checked" : "") +
        '/><label class="btn_checkbox" for="github' + exerciseId + '">GitHub</label> <br>' +
        '<input class="btn_checkbox"  id="zip' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="zip" required="" ' +
        (exercise.submission_via_zip ? "checked" : "") +
        '/><label class="btn_checkbox" for="zip' + exerciseId + '">Zip</label></div> <br>'
    if (!exercise.input_output_points) {} else {
        html += '<label for="main_file' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The file where the main function resides">Main file *</div></label>' +
            '<input id="main_file' + exerciseId + '" class="my_input" value="' + exercise.main_file + '"></input><br><br>'
    }
    html += '<label for="exercise_description' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="A short description of the exercise.">Exercise description</div></label>' +
        '<textarea id="exercise_description' + exerciseId + '" class="swal2-input input">' + exercise.exercise_description + ' </textarea><br><br>' +
        (exercise.pdf_instruction ? '<button id="current_pdf' + exerciseId + '" class="btn btn-link"  onclick="downloadPdfInstruction(' + "'" + exerciseId + "'" + ')">Current pdf</button>' +
            '<button id="delete_pdf' + exerciseId + '" class="astext" onclick="deletePdfInstruction(' + "'" + exerciseId + "'" + ')"><i class="glyphicon glyphicon-remove-circle"></i></button><br><br>' :
            "") +
        '<label for="exercise_instruction' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="Must be a pdf file.">Pdf instruction file</div></label>' +
        '<input id="exercise_instruction' + exerciseId + '" type="file" accept="application/pdf"><br><br>' +
        '<label for="deadline' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The deadline of the exercise.">Deadline</div></label>' +
        '<input id="deadline' + exerciseId + '" class="my_input" type="date" name="dealine" value="' + exercise.deadline + '"></input> <input id="deadline_hours' + exerciseId + '" type="time" class="my_input" name="dealine_hours" value="' + exercise.deadline_hours + '"></input><br><br>'
    if (!exercise.input_output_points) {
        html += '<label for="input_url_exercise' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The URL from the instructor">URL from the instructor *</div></label>' +
            '<input id="url_exercise' + exerciseId + '"  class="my_input" value="' + exercise.url_exercise + '"></input><br><br>'
    } else {
        html += '<label for="show' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The student will be able to see every option checked while submitting.' +
            'If you want the student to see the output of his program, check output.">Show input/output</div></label>' +
            '<div id="show' + exerciseId + '" ></div>' +
            '<div class="radio_checkbox"><input class="btn_checkbox" id="input' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="input" required="" ' +
            (exercise.show_input ? "checked" : "") +
            '/><label class="btn_checkbox" for="input' + exerciseId + '">Input</label> <br>' +
            '<input class="btn_checkbox"  id="output' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="output" required="" ' +
            (exercise.show_output ? "checked" : "") +
            '/><label class="btn_checkbox" for="output' + exerciseId + '">Output</label></div> <br>' +
            '<label for="input_file_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The default input is the standard input.">Input file name *</div></label>' +
            '<input id="input_file_name' + exerciseId + '" class="my_input" value="' + exercise.input_file_name + '"></input><br><br>' +
            '<label for="output_file_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The default output is the standard output.">Output file name *</div></label>' +
            '<input id="output_file_name' + exerciseId + '" class="my_input" value="' + exercise.output_file_name + '"></input><br><br>'
        for (item in exercise.input_output_points) {
            html +=
                '<label for="input_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="The first given input.">Given input *</div></label>' +
                '<textarea id="input_' + exerciseId + item + '" class="swal2-input input">' + exercise.input_output_points[item].input + '</textarea><br><br>' +
                '<label for="output_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="The first given output.">Given output *</div></label>' +
                '<textarea id="output_' + exerciseId + item + '" class="swal2-input input">' + exercise.input_output_points[item].output + '</textarea><br><br>' +
                '<label for="points_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="Number of points per correct answer.">Points number * </div></label>' +
                '<input id="points_' + exerciseId + item + '" class="my_input" type="number" value="' + exercise.input_output_points[item].point + '"></input><br><br>'
        }
    }
    if (!exercise.input_output_points) {
        let temp = 0
        html += '<button class="btn blue_enjoy" onclick="editExercise(' + "'" + exerciseId + "','" + temp + "'" + ')">Edit exercise <i class="glyphicon glyphicon-edit"></i></button>'
    } else {
        html += '<button class="btn blue_enjoy" onclick="editExercise(' + "'" + exerciseId + "','" + exercise.input_output_points.length + "'" + ')">Edit exercise <i class="glyphicon glyphicon-edit"></i></button>'
    }
    html += '<button class="btn white_enjoy" onclick="deleteExercise(' + "'" + exerciseId + "'" + ')">Delete exercise <i class="glyphicon glyphicon-trash"></i></button>' +
        '</div></div>' +
        (exercise.submissions ?
            '<div class="manage_button">' +
            '<button class="btn btn_manage" onclick="downloadGradesExercise(' + myStringify(exercise.submissions) + "'" + exercise.exercise_name + "'" + ')" style="border:1px solid green"><span>Download Exercise Grades</button>' +
            '<button class="btn btn_manage" onclick="currentSubmissionView(' + "'" + exerciseId + "'" + ')" style="border:1px solid blue"><span>Current Submissions</button>' +
            '<button class="btn btn_manage" onclick="mossCommand(' + "'" + exerciseId + "'" + ')" style="border:1px solid red"><span>Check Plagiarism</button>' +
            '<button class="btn btn_manage" onclick="downloadStatistics(' + "'" + exerciseId + "'" + ')" style="border:1px solid grey"><span>Download Statistics</button>' +
            '<button class="btn btn_manage" onclick="downloadSubmissions(' + "'" + exerciseId + "','" + exercise.exercise_name + "'" + ')" style="border:1px solid orange"><span>Download Submissions</button>' +
            '</div></div></div>' : '<div class="manage_button">No submission available</div></div>');

    return html;
}

function deletePdfInstruction(exerciseId) {
    if ($("#delete_pdf" + exerciseId).html().includes('remove')) {
        $("#current_pdf" + exerciseId).hide()
        $("#delete_pdf" + exerciseId).html('<i class="glyphicon glyphicon-ok-circle"></i>')
    } else {
        $("#current_pdf" + exerciseId).show()
        $("#delete_pdf" + exerciseId).html('<i class="glyphicon glyphicon-remove-circle"></i>')
    }

}

function uidToCountryIds(uids, ids) {
    let answer = ""
    for (uid of Object.values(uids)) {
        answer += ids[uid] + " "
    }
    return answer
}

$("#newCourse").click(function() {
    Swal.fire({
        allowOutsideClick: false,
        title: 'New course',
        html: '<label for="course_name"><div class="explanation" data-toggle="tooltip" title="Required field">Course name *</div></label>' +
            '<input id="course_name" class="swal2-input" placeholder="C++...">' +
            '<label for="grader"><div class="explanation" data-toggle="tooltip" title="Give access to the manage course.">Grader id \n </div></label>' +
            '<input id="grader" class="swal2-input" placeholder="000000000">' +
            '<label for="privacy"><div class="explanation" data-toggle="tooltip" title="Share this course only with specific students.">Privacy</div></label>' +
            '<div id=privacy>' +
            '<input type="radio" name="privacy" value="public" onclick=\'$(\"#pass\").hide()\' checked> Public<br>' +
            '<input type="radio" name="privacy" value="private" onclick=\'$(\"#pass\").show()\'> Private<br><br>' +
            '</div>' +
            '<div id="pass" style=display:none;>' +
            '<label for="ids"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
            '<input id="ids" class="swal2-input" placeholder="000000000 000000000">' +
            '</div>',
        showCancelButton: true,
        preConfirm: () => {
            const course_name = escapeHtml($("#course_name").val())
            const grader = escapeHtml($("#grader").val())
            const privacy = $("input[name='privacy']:checked").val()
            const ids = escapeHtml($("#ids").val())
            if (!(course_name == "" || (ids == "" && privacy == "private"))) {
                json = JSON.stringify({
                    owner_uid: userUid,
                    course_name: course_name,
                    grader_uid: grader,
                    privacy: privacy,
                    uids: ids
                })
            } else {
                Swal.showValidationMessage(
                    `Please fill all the required fields.`
                )
            }
        }
    }).then(result => {
        if (result.value) {
            $("#main").hide()
            doPostJSON(json, "create_course", "text", reload)
        }
    })

})

$('input[type=radio][name=privacy]').change(function() {
    var x = document.getElementById("pass");
    if (this.value == 'public') {
        public = true;
        x.style.display = "none";
    } else if (this.value == 'private') {
        public = false;
        x.style.display = "block";
    }
});

function editCourse(courseId) {
    const courseName = escapeHtml($("#course_name" + courseId).val())
    if (checkEmptyFieldsAlert([courseName])) {
        let json = JSON.stringify({
            owner_uid: userUid,
            course_name: escapeHtml($("#course_name" + courseId).val()),
            grader_uid: escapeHtml($("#course_grader" + courseId).val()),
            privacy: ($("#pass" + courseId).is(":visible") ? "private" : "public"),
            uids: escapeHtml($("#course_ids" + courseId).val())
        })
        doPostJSON(json, "edit_course/" + courseId, "text", reload)
    }
}

/**
 * Notice that currently only the course object is deleted, the exercises remains stored in the db.
 * @param {String} courseId 
 */
function deleteCourse(courseId) {
    Swal.fire({
        title: 'Delete course',
        text: 'Are you sure that you want to delete the course?',
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: true,
    }).then(result => {
        if (result.value) {
            doPostJSON(null, "delete_course/" + courseId, "text", reload)
        }
    })
}

function newExercise(courseId) {
    Swal.fire({
        title: 'Create exercise',
        text: 'Which type of exercise do you want to create?',
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        confirmButtonText: "Normal exercise",
        cancelButtonText: "Custom exercise",
    }).then(result => {
        if (result.value) {
            newNormalExercise(courseId)
        } else {
            newCustomExercise(courseId)
        }
    })
}

/**
 * Here are the fields for the form:
 * 
 * Required fields:
 * 
 * Exercise name -> String
 * Exercise compiler -> Javac/Clang/G++
 * Submission option -> Github and/or Zip
 * Main file -> String (file where remain the main function)
 * I/O zip file -> inputs/outputs files (.txt) (input files must begin with the char "i" and output must begin with the char "o").
 * Input code (standard bt default)
 * Output code (standard by default)
 * 
 * Not required fields:
 *  
 * Exercise description
 * Exercise instruction (PDF)
 * Deadline
 * Penatlies (TODO if needed)
 * @param {string} courseId 
 */

htmlStepCreateExercise = (step) => {
    if (step == 'New exercise 1/4' || step == 'New exercise 1/3') {
        return '<label for="exercise_name"><div class="explanation" data-toggle="tooltip" title="Required field">Exercise name *</div></label>' +
            '<input id="exercise_name" class="swal2-input" placeholder="First assignment...">' +
            '<label for="exercise_compiler"><div class="explanation" data-toggle="tooltip" title="The compiler for the exercise. ">Exercise compiler *</div></label>' +
            '<select id="exercise_compiler" class="swal2-input">' +
            '<option value="javac">javac</option>' +
            '<option value="g++">g++ (c or c++)</option>' +
            '<option value="python3">python3</option>' +
            '<option value="perl">perl</option>' +
            '</select>' +
            '<label for="submission_option"><div class="explanation" data-toggle="tooltip" title="The student can submit his exercise via each method checked.' +
            'If you want the student to submit only via GitHub, check only the GitHub box .">Submission option *</div></label>' +
            '<div id="submission_option" class="swal2-input" >' +
            '<input id="github" name="BoxSelect[]" type="checkbox" value="github" required="" checked>GitHub</input> <br>' +
            '<input id="zip" name="BoxSelect[]" type="checkbox" value="zip" required="" checked>Zip</input>' +
            '</div>'
    } else if (step == 'New exercise 2/4' || step == 'New exercise 2/3') {
        return '<label for="exercise_description"><div class="explanation" data-toggle="tooltip" title="A short description of the exercise.">Exercise description</div></label>' +
            '<textarea id="exercise_description" class="swal2-input" placeholder="Your short description of the exercise... "></textarea>' +
            '<label for="exercise_instruction"><div class="explanation" data-toggle="tooltip" title="Must be a pdf file.">Pdf instruction file</div></label>' +
            '<input id="exercise_instruction" class="swal2-input" type="file" accept="application/pdf">' +
            '<label for="deadline"><div class="explanation" data-toggle="tooltip" title="The deadline of the exercise.">Deadline</div></label>' +
            '<input id="deadline" class="swal2-input" type="date" name="dealine"></input> <input id="deadline_hours" class="swal2-input" type="time" name="dealine_hours"></input>'
    }

}
async function newCustomExercise(courseId) {
    let exerciseName, exerciseCompiler, submissionViaGithub, submissionViaZip,
        exerciseDescription, instructionPdf, deadline, urlExercise, zipExercise
    Swal.mixin({
        allowOutsideClick: false,
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
    }).queue([{
        confirmButtonText: 'Next &rarr;',
        title: 'New exercise 1/3',
        html: htmlStepCreateExercise('New exercise 1/3'),
        focusConfirm: false,
        preConfirm: () => {
            exerciseName = escapeHtml($("#exercise_name").val())
            exerciseCompiler = escapeHtml($("#exercise_compiler").val())
            submissionViaGithub = $("input[id='github']:checked").val()
            submissionViaZip = $("input[id='zip']:checked").val()

        }
    }, {
        confirmButtonText: 'Next &rarr;',
        title: 'New exercise 2/3',
        html: htmlStepCreateExercise('New exercise 2/3'),
        focusConfirm: false,
        preConfirm: () => {
            exerciseDescription = escapeHtml($("#exercise_description").val())
            instructionPdf = $('#exercise_instruction').prop('files')[0];
            deadline = $("#deadline").val()
            deadline_hours = $("#deadline_hours").val()

        }
    }, {
        confirmButtonText: 'Next &rarr;',
        title: 'New exercise 3/3',
        html: '<label for="urlExercise">Enter the URL.</label>' +
            '<input id="urlExercise" type="text" class="form-control" />' +
            '<h5>Or</h5>' +
            '<label for="custom_ex_zip">Exercise Zip File</label>' +
            '<input id="custom_ex_zip" class="swal2-input" type="file" accept="application/zip">',
        focusConfirm: false,
        preConfirm: () => {
            urlExercise = escapeHtml($("#urlExercise").val())
            if ($("#urlExercise").val() == 0 && $('#custom_ex_zip').prop('files')[0] == undefined) {
                Swal.showValidationMessage(
                    `Please fill all the required fields.`
                )
            }
            if ($('#custom_ex_zip').prop('files')[0] != 0) {
                console.log($('#custom_ex_zip').prop('files')[0])
                zipExercise = $('#custom_ex_zip').prop('files')[0]
            } else {
                console.log('None')
            }
        }
    }]).then((result) => {
        if (result.value) {
            $("#main").hide()
                // console.log(zipExercise)
                // console.log(urlExercise)
            let json = JSON.stringify({
                course_id: courseId,
                exercise_name: exerciseName,
                exercise_compiler: exerciseCompiler,
                submission_via_github: submissionViaGithub,
                submission_via_zip: submissionViaZip,
                exercise_description: exerciseDescription,
                deadline: deadline,
                deadline_hours: deadline_hours,
                url_exercise: (urlExercise ? urlExercise : false),
                zip_exercise: (zipExercise ? true : false),
                pdf_instruction: (instructionPdf ? true : false)
            })
            var fd = new FormData();
            fd.append("file", instructionPdf);
            fd.append("zip", zipExercise);
            fd.append("json", json);
            doPostJSONAndFile(fd, "create_exercise", "text", reload)
        }
    })
}

async function newNormalExercise(courseId) {
    let exerciseName, exerciseCompiler, submissionViaGithub, submissionViaZip, mainFile,
        exerciseDescription, instructionPdf, deadline, inputFileName, outputFileName, showInput, showOutput
    Swal.mixin({
        allowOutsideClick: false,
        showCancelButton: true,
        progressSteps: ['1', '2', '3', '4']
    }).queue([{
            confirmButtonText: 'Next &rarr;',
            title: 'New exercise 1/4',
            html: htmlStepCreateExercise('New exercise 1/4') + '<label for="main_file"><div class="explanation" data-toggle="tooltip" title="The file where the main function resides">Main file *</div></label>' +
                '<input id="main_file" class="swal2-input" placeholder="Main.java, Ex01.cpp, a.c...">',
            focusConfirm: false,
            preConfirm: () => {
                exerciseName = escapeHtml($("#exercise_name").val())
                exerciseCompiler = escapeHtml($("#exercise_compiler").val())
                submissionViaGithub = $("input[id='github']:checked").val()
                submissionViaZip = $("input[id='zip']:checked").val()
                mainFile = escapeHtml($("#main_file").val())
                if (exerciseName == "" || exerciseCompiler == "" || mainFile == "" || (!submissionViaGithub && !submissionViaZip)) {
                    Swal.showValidationMessage(
                        `Please fill all the required fields.`
                    )
                }
            }
        },
        {
            confirmButtonText: 'Next &rarr;',
            title: 'New exercise 2/4',
            html: htmlStepCreateExercise('New exercise 2/4') +
                '<label for="show"><div class="explanation" data-toggle="tooltip" title="The student will see every option checked while submitting.' +
                '.If you want the student to see the output of his program, check output.">Show input/output</div></label>' +
                '<div id="show" class="swal2-input" >' +
                '<input id="input" name="BoxSelect[]" type="checkbox" value="input" required="">Input</input> <br>' +
                '<input id="output" name="BoxSelect[]" type="checkbox" value="output" required="">Output</input>' +
                '</div>',
            focusConfirm: false,
            preConfirm: () => {
                exerciseDescription = escapeHtml($("#exercise_description").val())
                instructionPdf = $('#exercise_instruction').prop('files')[0];
                deadline = $("#deadline").val()
                deadline_hours = $("#deadline_hours").val()
                showInput = $("input[id='input']:checked").val()
                showOutput = $("input[id='output']:checked").val()
            }
        },
        {
            confirmButtonText: 'Next &rarr;',
            title: 'New exercise 3/4',
            html: '<label for="input_file_name"><div class="explanation" data-toggle="tooltip" title="The default input is the standard input.">Input file name *</div></label>' +
                '<input id="input_file_name" class="swal2-input" value="standard" placeholder="input.txt, input.csv...">' +
                '<label for="output_file_name"><div class="explanation" data-toggle="tooltip" title="The default output is the standard output.">Output file name *</div></label>' +
                '<input id="output_file_name" class="swal2-input" value="standard" placeholder="output.txt, output.csv...">',
            focusConfirm: false,
            preConfirm: () => {
                inputFileName = escapeHtml($("#input_file_name").val())
                outputFileName = escapeHtml($("#output_file_name").val())
                if (inputFileName == "" || outputFileName == "") {
                    Swal.showValidationMessage(
                        `Please fill all the required fields.`
                    )
                } else {
                    moreIO(1)
                }
            }
        }
    ]).then((result) => {
        if (result.value) {
            $("#main").hide()
            let json = JSON.stringify({
                course_id: courseId,
                exercise_name: exerciseName,
                exercise_compiler: exerciseCompiler,
                submission_via_github: submissionViaGithub,
                submission_via_zip: submissionViaZip,
                main_file: mainFile,
                exercise_description: exerciseDescription,
                deadline: deadline,
                deadline_hours: deadline_hours,
                input_file_name: inputFileName,
                output_file_name: outputFileName,
                input_output_points: inputOutputPointsNew,
                show_input: (showInput ? true : false),
                show_output: (showOutput ? true : false),
                pdf_instruction: (instructionPdf ? true : false)
            })
            var fd = new FormData();
            fd.append("file", instructionPdf);
            fd.append("json", json);
            doPostJSONAndFile(fd, "create_exercise", "text", reload)
        }
    })
}

function moreIO(i) {
    swal.insertQueueStep({
        allowOutsideClick: false,
        title: 'More input',
        confirmButtonText: 'Next &rarr;',
        html: '<label for="input_' + i + '"><div class="explanation" data-toggle="tooltip" title="The first given input.">Given input *</div></label>' +
            '<textarea id="input_' + i + '" class="swal2-input" placeholder="2, abcd..."></textarea>' +
            '<label for="output_' + i + '"><div class="explanation" data-toggle="tooltip" title="The first expected output.">Expected output *</div></label>' +
            '<textarea id="output_' + i + '" class="swal2-input" placeholder="4, a b c d..."></textarea>' +
            '<label for="points_' + i + '"><div class="explanation" data-toggle="tooltip" title="Number of point per correct answer.">Points number * </div></label>' +
            '<input id="points_' + i + '"s class="swal2-input" type="number" ></input><br>' +
            '<button data-toggle="tooltip" title="More input output" class="plus-button" onclick=addMoreIO(' + i + ')></button>',
        confirmButtonText: "Done",
        preConfirm: function() {
            let input = escapeHtml($("#input_" + i).val())
            let output = escapeHtml($("#output_" + i).val())
            let point = escapeHtml($("#points_" + i).val())
            if (input == "" || output == "" || point == "") {
                Swal.showValidationMessage(
                    `Please fill all the fields.`
                )
            } else {
                inputOutputPointsNew.push({
                    input: input,
                    output: output,
                    point: point
                })
            }
        }
    })
}

function addMoreIO(i) {
    let input = escapeHtml($("#input_" + i).val())
    let output = escapeHtml($("#output_" + i).val())
    let point = escapeHtml($("#points_" + i).val())
    if (!(input == "" || output == "" || point == "")) {
        moreIO(++i)
    }
    $('.swal2-confirm').click()
}

function editExercise(exerciseId, inputOutputPointsSize) {
    if (inputOutputPointsSize == 0) {
        const exerciseName = escapeHtml($("#exercise_name" + exerciseId).val())
        const exerciseCompiler = escapeHtml($("#exercise_compiler" + exerciseId).val())
        const urlExercise = escapeHtml($("#url_exercise" + exerciseId).val())
        const submissionViaGithub = $('input[id="github' + exerciseId + '"]:checked').val()
        const submissionViaZip = $('input[id="zip' + exerciseId + '"]:checked').val()
        if (!submissionViaGithub && !submissionViaZip) {
            alert("Please check at least one of the two submission option.")
        } else {
            if (checkEmptyFieldsAlert([exerciseName, exerciseCompiler])) {
                exerciseDescription = escapeHtml($("#exercise_description" + exerciseId).val())
                instructionPdf = $("#exercise_instruction" + exerciseId).prop('files')[0];
                deadline = $("#deadline" + exerciseId).val()
                deadline_hours = $("#deadline_hours" + exerciseId).val()
                    // urlExercise = escapeHtml($("#urlExercise" + exerciseId).val())
                $("#main").hide()
                let is_pdf_exists = false
                if ($("#delete_pdf" + exerciseId).html()) {
                    if ($("#delete_pdf" + exerciseId).html().includes('remove')) {
                        is_pdf_exists = true
                    } else {
                        is_pdf_exists = false
                    }
                }
                let json = JSON.stringify({
                    // No need to update the course id since the exercise can't move.
                    exercise_name: exerciseName,
                    exercise_compiler: exerciseCompiler,
                    submission_via_github: (submissionViaGithub ? true : false),
                    submission_via_zip: (submissionViaZip ? true : false),
                    exercise_description: exerciseDescription,
                    deadline: deadline,
                    deadline_hours: deadline_hours,
                    url_exercise: urlExercise,
                    pdf_instruction: (instructionPdf ? true : is_pdf_exists)
                })
                var fd = new FormData();
                fd.append("file", instructionPdf);
                fd.append("json", json);
                doPostJSONAndFile(fd, "edit_exercise/" + exerciseId, "text", reload)
            }
        }
    } else {
        const exerciseName = escapeHtml($("#exercise_name" + exerciseId).val())
        const exerciseCompiler = escapeHtml($("#exercise_compiler" + exerciseId).val())
        const submissionViaGithub = $('input[id="github' + exerciseId + '"]:checked').val()
        const submissionViaZip = $('input[id="zip' + exerciseId + '"]:checked').val()
        const mainFile = escapeHtml($("#main_file" + exerciseId).val())
        const inputFileName = escapeHtml($("#input_file_name" + exerciseId).val())
        const outputFileName = escapeHtml($("#output_file_name" + exerciseId).val())
        let inputOutputPoints = [];
        for (let i = 0; i < inputOutputPointsSize; i++) {
            const input = escapeHtml($("#input_" + exerciseId + i).val())
            const output = escapeHtml($("#output_" + exerciseId + i).val())
            const point = escapeHtml($("#points_" + exerciseId + i).val())
            if (checkEmptyFieldsAlert([input, output, point])) {
                inputOutputPoints.push({
                    input: input,
                    output: output,
                    point: point
                })
            } else {
                return;
            }
        }
        if (!submissionViaGithub && !submissionViaZip) {
            alert("Please check at least one of the two submission option.")
        } else {
            if (checkEmptyFieldsAlert([exerciseName, exerciseCompiler,
                    mainFile, inputFileName, outputFileName
                ])) {
                exerciseDescription = escapeHtml($("#exercise_description" + exerciseId).val())
                instructionPdf = $("#exercise_instruction" + exerciseId).prop('files')[0];
                deadline = $("#deadline" + exerciseId).val()
                deadline_hours = $("#deadline_hours" + exerciseId).val()
                const showInput = $('input[id="input' + exerciseId + '"]:checked').val()
                const showOutput = $('input[id="output' + exerciseId + '"]:checked').val()
                $("#main").hide()
                let is_pdf_exists = false
                if ($("#delete_pdf" + exerciseId).html()) {
                    if ($("#delete_pdf" + exerciseId).html().includes('remove')) {
                        is_pdf_exists = true
                    } else {
                        is_pdf_exists = false
                    }
                }
                let json = JSON.stringify({
                    // No need to update the course id since the exercise can't move.
                    exercise_name: exerciseName,
                    exercise_compiler: exerciseCompiler,
                    submission_via_github: (submissionViaGithub ? true : false),
                    submission_via_zip: (submissionViaZip ? true : false),
                    main_file: mainFile,
                    exercise_description: exerciseDescription,
                    deadline: deadline,
                    deadline_hours: deadline_hours,
                    input_file_name: inputFileName,
                    output_file_name: outputFileName,
                    input_output_points: inputOutputPoints,
                    show_input: (showInput ? true : false),
                    show_output: (showOutput ? true : false),
                    pdf_instruction: (instructionPdf ? true : is_pdf_exists)
                })
                var fd = new FormData();
                fd.append("file", instructionPdf);
                fd.append("json", json);
                doPostJSONAndFile(fd, "edit_exercise/" + exerciseId, "text", reload)
            }
        }
    }

}

function deleteExercise(exerciseId) {
    Swal.fire({
        title: 'Delete exercise',
        text: 'Are you sure that you want to delete the exercise?',
        allowOutsideClick: false,
        showConfirmButton: true,
        showCancelButton: true,
    }).then(result => {
        if (result.value) {
            doPostJSON(null, "delete_exercise/" + exerciseId, "text", reload)
        }
    })
}

function downloadGradesCourse(courseId) {
    if (!allSubmissions.get(courseId)) {
        alert("There is no grade to download...");
        return;
    }
    showLoader()
    json = JSON.stringify({
        all_submissions: allSubmissions.get(courseId)
    })

    doPostJSON(json, "download_grades_course", 'json', onDownloadGradeFinish)

}