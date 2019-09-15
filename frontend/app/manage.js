function onLoadMain() {
    // The user will have a field "myCourses" and retreive all the course by this field.
    // Each course will have a field "My exercises"...
    doPostJSON("", "get_courses_manager/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    // TODO: make the first active at the beginning.
    // TODO: use form to save the input.
    if (data.courses) {
        const entries = Object.entries(data.courses)
        for (course of entries) {
            createAccordionManage(course); // Example.
        }
    }
    $('#main').show();
}

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

function createAccordionBodyManageCourse(courseId, course) {
    let html = '<div class="panel">' +
        '<div class="course">' +
        '<label for="course_name' + courseId + '"><div class="explanation" data-toggle="tooltip" title="Required field" style="margin-top: 17px">Course name *</div></label>' +
        '<input id="course_name' + courseId + '" class="courseExerciseInputEdit" value="' + course.course_name + '"></input><br><br>' +
        '<label for="course_grader' + courseId + '"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
        '<input id="course_grader' + courseId + '" class="courseExerciseInputEdit" value="' + course.grader_uid + '" style="margin-left:88px"></input><br><br>' +
        '<label for="privacyEdit"><div class="explanation" data-toggle="tooltip" title="The course is shared only with the students you want.">Privacy</div></label><br>' +
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
        '<label for="course_ids' + courseId + '"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
        '<input id="course_ids' + courseId + '" class="ids courseExerciseInputEdit" value="' + String(course.uids).replace(",", " ") + '" value="000000000 000000000""></input><br><br><br><br>' +
        '</div>' + '<br>' +
        '<button class="btn btn_edit" onclick="editCourse(' + "'" + courseId + "'" + ')">Edit course <i class="glyphicon glyphicon-edit"></i></button>' +
        '<button class="btn btn_delete" onclick="deleteCourse(' + "'" + courseId + "'" + ')">Delete course <i class="glyphicon glyphicon-trash"></i></button>' +
        '</div></div>' +
        '<div class="manage_button"><button class="btn btn_manage btn_course" onclick="downloadGradesCourse(' + "'" + courseId + "'" + ')" style="border:1px solid green"><span>Download Course Grades</button></div>';
    return html;
}

function createAccordionBodyManageExercise(exerciseId, exercise) {
    let html = '<div class="panel">' +
        '<div class="exercise">' +
        '<label for="exercise_name' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="Required field" style="margin-top: 17px">Exercise name *</div></label>' +
        '<input id="exercise_name' + exerciseId + '" class="courseExerciseInputEdit" value="' + exercise.exercise_name + '"></input><br><br>' +
        '<label for="exercise_compiler' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The compiler for the exercise.">Exercise compiler *</div></label>' +
        '<select id="exercise_compiler' + exerciseId + '" class="swal2-input input">' + /* For Jeremy you can play with the class swal2 if you want. */
        '<option  value="javac"' + (exercise.exercise_compiler == "javac" ? "selected" : "") + '>javac</option>' +
        '<option  value="g++"' + (exercise.exercise_compiler == "g++" ? "selected" : "") + '>g++ (c or c++)</option>' +
        '<option  value="python3"' + (exercise.exercise_compiler == "python3" ? "selected" : "") + '>python3</option>' +
        '</select>' +
        '<label for="submission_option' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="For each method checked, the student will be able to submit his exercise via the method.' +
        'If you want the student only submit via GitHub, then check only the GitHub button .">Submission option *</div></label>' +
        '<div id="submission_option' + exerciseId + '" ></div>' +
        '<div class="radio_checkbox"><input class="btn_checkbox"  id="github' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="github" required="" ' +
        (exercise.submission_via_github ? "checked" : "") +
        '/><label class="btn_checkbox" for="github' + exerciseId + '">GitHub</label> <br>' +
        '<input class="btn_checkbox"  id="zip' + exerciseId + '" name="BoxSelect[]" type="checkbox" value="zip" required="" ' +
        (exercise.submission_via_zip ? "checked" : "") +
        '/><label class="btn_checkbox" for="zip' + exerciseId + '">Zip</label></div> <br>' +
        '<label for="main_file' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="The file where the main function resides">Main file *</div></label>' +
        '<input id="main_file' + exerciseId + '" class="courseExerciseInputEdit" value="' + exercise.main_file + '"></input><br><br>' +
        '<label for="exercise_description' + exerciseId + '"><div class="explanation" data-toggle="tooltip" title="A short description of the exercise.">Exercise description</div></label>' +
        '<textarea id="exercise_description' + exerciseId + '" class="swal2-input input"> </textarea><br><br>' +
        (exercise.pdf_instruction ? '<a href="' + exercise.pdf_instruction + '" class="btn btn-link"> Current pdf</a><br><br>' : '') +
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
            '<textarea id="input_' + exerciseId + item + '" class="swal2-input input">' + exercise.input_output_points[item].input + '</textarea><br><br>' +
            '<label for="output_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="The first given output.">Given output *</div></label>' +
            '<textarea id="output_' + exerciseId + item + '" class="swal2-input input">' + exercise.input_output_points[item].output + '</textarea><br><br>' +
            '<label for="points_' + exerciseId + item + '"><div class="explanation" data-toggle="tooltip" title="The number of point for a good answer.">Points number * </div></label>' +
            '<input id="points_' + exerciseId + item + '" class="courseExerciseInputEdit" type="number" value="' + exercise.input_output_points[item].point + '"></input><br><br>'
    }
    html += '<button class="btn btn_edit" onclick="editExercise(' + "'" + exerciseId + "','" + exercise.input_output_points.length + "'" + ')">Edit exercise <i class="glyphicon glyphicon-edit"></i></button>' +
        '<button class="btn btn_delete" onclick="deleteExercise(' + "'" + exerciseId + "'" + ')">Delete exercise <i class="glyphicon glyphicon-trash"></i></button>' +
        '</div></div>' +
        (exercise.submissions ?
            '<div class="manage_button">' +
            '<button class="btn btn_manage" onclick="downloadGradesExercise(' + myStringify(exercise.submissions) + ')" style="border:1px solid green"><span>Download Exercise Grades</button>' +
            '<button class="btn btn_manage" onclick="currentSubmissionView(' + myStringify(exercise.submissions) + ')" style="border:1px solid blue"><span>Current Submissions</button>' +
            '<button class="btn btn_manage" onclick="mossCommand(' + "'" + exerciseId + "'" + ')" style="border:1px solid red"><span>Check Plagiarism</button>' +
            '<button class="btn btn_manage" onclick="downloadStatistics(' + "'" + exerciseId + "'" + ')" style="border:1px solid grey"><span>Download Statistics</button>' +
            '<button class="btn btn_manage" onclick="downloadSubmissions(' + "'" + exerciseId + "','" + exercise.exercise_name + "'" + ')" style="border:1px solid orange"><span>Download Submissions</button>' +
            '</div>' : "");
    return html;
}

$("#newCourse").click(function () {
    var info = newCourse();
    info.then((json) => {
        doPostJSON(json, "create_course", "text", reloadManage)
        $("#main").hide()
    })
})

function reloadManage() {
    document.location.reload();
}

async function newCourse() {
    const {
        value: formValues
    } = await Swal.fire({
        allowOutsideClick: false,
        title: 'New course',
        html: '<label for="course_name"><div class="explanation" data-toggle="tooltip" title="Required field">Course name *</div></label>' +
            '<input id="course_name" class="swal2-input" placeholder="C++...">' +
            '<label for="grader"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
            '<input id="grader" class="swal2-input" placeholder="000000000">' +
            '<label for="privacy"><div class="explanation" data-toggle="tooltip" title="The course is shared only with the students you want.">Privacy</div></label>' +
            '<div id=privacy>' +
            '<input type="radio" name="privacy" value="public" onclick=\'$(\"#pass\").hide()\' checked> Public<br>' +
            '<input type="radio" name="privacy" value="private" onclick=\'$(\"#pass\").show()\'> Private<br><br>' +
            '</div>' +
            '<div id="pass" style=display:none;>' +
            '<label for="ids"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
            '<input id="ids" class="swal2-input" placeholder="000000000 000000000">' +
            '</div>',
        focusConfirm: false,

        preConfirm: () => {
            const course_name = escapeHtml($("#course_name").val())
            const grader = escapeHtml($("#grader").val())
            const privacy = $("input[name='privacy']:checked").val()
            const ids = escapeHtml($("#ids").val())
            if (!(course_name == "" || (ids == "" && privacy == "private"))) {
                return JSON.stringify({
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
    })
    if (formValues) {
        return formValues
    }
}

$('input[type=radio][name=privacy]').change(function () {
    var x = document.getElementById("pass");
    if (this.value == 'public') {
        alert("hi")
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
        doPostJSON(json, "edit_course/" + courseId, "text", reloadManage)
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
            doPostJSON(null, "delete_course/" + courseId, "text", reloadManage)
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
        confirmButtonText: "Normal exercise",
        cancelButtonText: "Peer exercise",
    }).then(result => {
        if (result.value) {
            newNormalExercise(courseId)
        } else {
            alert("peer")
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
 * Input code (standart bt default)
 * Output code (standart by default)
 * 
 * Not required fields:
 *  
 * Exercise description
 * Exercise instruction (PDF)
 * Deadline
 * Penatlies (TODO if needed)
 * @param {string} courseId 
 */
async function newNormalExercise(courseId) {
    let exerciseName, exerciseCompiler, submissionViaGithub, submissionViaZip, mainFile,
        exerciseDescription, instructionPdf, deadline, inputFileName, outputFileName
    let inputOutputPoints = []
    Swal.mixin({
        allowOutsideClick: false,
        showCancelButton: true,
        progressSteps: ['1', '2', '3', '4']
    }).queue([{
            confirmButtonText: 'Next &rarr;',
            title: 'New exercise 1/4',
            html: '<label for="exercise_name"><div class="explanation" data-toggle="tooltip" title="Required field">Exercise name *</div></label>' +
                '<input id="exercise_name" class="swal2-input" placeholder="First assignment...">' +
                '<label for="exercise_compiler"><div class="explanation" data-toggle="tooltip" title="The compiler for the exercise. ">Exercise compiler *</div></label>' +
                '<select id="exercise_compiler" class="swal2-input">' +
                '<option value="javac">javac</option>' +
                '<option value="g++">g++ (c or c++)</option>' +
                '<option value="python3">python3</option>' +
                '</select>' +
                '<label for="submission_option"><div class="explanation" data-toggle="tooltip" title="For each method checked, the student will be able to submit his exercise via the method.' +
                'If you want the student only submit via GitHub, then check only the GitHub button .">Submission option *</div></label>' +
                '<div id="submission_option" class="swal2-input" >' +
                '<input id="github" name="BoxSelect[]" type="checkbox" value="github" required="" checked>GitHub</input> <br>' +
                '<input id="zip" name="BoxSelect[]" type="checkbox" value="zip" required="" checked>Zip</input>' +
                '</div>' +
                '<label for="main_file"><div class="explanation" data-toggle="tooltip" title="The file where the main function resides">Main file *</div></label>' +
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
            html: '<label for="exercise_description"><div class="explanation" data-toggle="tooltip" title="A short description of the exercise.">Exercise description</div></label>' +
                '<textarea id="exercise_description" class="swal2-input" placeholder="Your short description of the exercise... "></textarea>' +
                '<label for="exercise_instruction"><div class="explanation" data-toggle="tooltip" title="Must be a pdf file.">Pdf instruction file</div></label>' +
                '<input id="exercise_instruction" class="swal2-input" type="file" accept="application/pdf">' +
                '<label for="deadline"><div class="explanation" data-toggle="tooltip" title="The deadline of the exercise.">Deadline</div></label>' +
                '<input id="deadline" class="swal2-input" type="date" name="dealine"></input>',
            focusConfirm: false,
            preConfirm: () => {
                exerciseDescription = escapeHtml($("#exercise_description").val())
                instructionPdf = $('#exercise_instruction').prop('files')[0];
                deadline = $("#deadline").val()
            }
        },
        {
            confirmButtonText: 'Next &rarr;',
            title: 'New exercise 3/4',
            html: '<label for="input_file_name"><div class="explanation" data-toggle="tooltip" title="The default input is the standart input. Let standart if you do not want to change it.">Input file name *</div></label>' +
                '<input id="input_file_name" class="swal2-input" value="standart" placeholder="input.txt, input.csv...">' +
                '<label for="output_file_name"><div class="explanation" data-toggle="tooltip" title="The default output is the standart output.  Let standart if you do not want to change it.">Output file name *</div></label>' +
                '<input id="output_file_name" class="swal2-input" value="standart" placeholder="output.txt, output.csv...">',
            focusConfirm: false,
            preConfirm: () => {
                inputFileName = escapeHtml($("#input_file_name").val())
                outputFileName = escapeHtml($("#output_file_name").val())
                if (inputFileName == "" || outputFileName == "") {
                    Swal.showValidationMessage(
                        `Please fill all the required fields.`
                    )
                } else {
                    moreIO(1, inputOutputPoints)
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
                input_file_name: inputFileName,
                output_file_name: outputFileName,
                input_output_points: inputOutputPoints
            })
            var fd = new FormData();
            fd.append("file", instructionPdf);
            fd.append("json", json);
            doPostJSONAndFile(fd, "create_exercise", "text", reloadManage)
        }
    })
}

function moreIO(i, inputOutputPoints) {
    swal.insertQueueStep({
        allowOutsideClick: false,
        title: 'More input',
        confirmButtonText: 'Next &rarr;',
        html: '<label for="input_' + i + '"><div class="explanation" data-toggle="tooltip" title="The first given input.">Given input *</div></label>' +
            '<textarea id="input_' + i + '" class="swal2-input" placeholder="2, abcd..."></textarea>' +
            '<label for="output_' + i + '"><div class="explanation" data-toggle="tooltip" title="The first expected output.">Expected output *</div></label>' +
            '<textarea id="output_' + i + '" class="swal2-input" placeholder="4, a b c d..."></textarea>' +
            '<label for="points_' + i + '"><div class="explanation" data-toggle="tooltip" title="The number of point for a good answer.">Points number * </div></label>' +
            '<input id="points_' + i + '"s class="swal2-input" type="number" ></input>',
        preConfirm: function () {
            let input = escapeHtml($("#input_" + i).val())
            let output = escapeHtml($("#output_" + i).val())
            let point = escapeHtml($("#points_" + i).val())
            if (input == "" || output == "" || point == "") {
                Swal.showValidationMessage(
                    `Please fill all the fields.`
                )
            } else {
                inputOutputPoints.push({
                    input: input,
                    output: output,
                    point: point
                })
                // TODO: Improve style and overide text cancel.
                if (confirm("More input/output?") == true) {
                    moreIO(i++, inputOutputPoints)
                }
            }
        }
    });
}

function editExercise(exerciseId, inputOutputPointsSize) {
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
            $("#main").hide()
            let json = JSON.stringify({
                // No need to update the course id since the exercise can't move.
                exercise_name: exerciseName,
                exercise_compiler: exerciseCompiler,
                submission_via_github: submissionViaGithub,
                submission_via_zip: submissionViaZip, // TODO: fix the case where the admin delete one submission option.
                main_file: mainFile,
                exercise_description: exerciseDescription,
                deadline: deadline,
                input_file_name: inputFileName,
                output_file_name: outputFileName,
                input_output_points: inputOutputPoints
            })
            var fd = new FormData();
            fd.append("file", instructionPdf);
            fd.append("json", json);
            doPostJSONAndFile(fd, "edit_exercise/" + exerciseId, "text", reloadManage)
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
            doPostJSON(null, "delete_exercise/" + exerciseId, "text", reloadManage)
        }
    })
}

function downloadGradesCourse(courseId) {
    alert("Dowload Grades course " + courseId)
}

function downloadGradesExercise(...submissionsId) {
    json = JSON.stringify({
        submissions_id: submissionsId
    })
    doPostJSON(json, "download_grades_exercise", 'json', onDownloadGradeExerciseFinish) // Async to change
}

function onDownloadGradeExerciseFinish(data) {
    var lineArray = [];
    data.grades[0].forEach(function (infoArray, index) {
        var line = infoArray.join(",");
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exercises_grades.csv");
    document.body.appendChild(link);
    link.click();
}

function currentSubmissionView(...submissionsId) {
    json = JSON.stringify({
        submissions_id: submissionsId
    })
    doPostJSON(json, "retreive_submissions", "json", displayCurrentSubmissions)
}

function mossCommand(exerciseId) {
    doPostJSON(null, "moss_command/" + exerciseId, "text", onCheckPlagiatFinish, 7000) // Async
}

function onCheckPlagiatFinish(data) {
    window.open(data)
}

function downloadStatistics(exerciseId) {
    alert("Dowload summary " + exerciseId)
}

function downloadSubmissions(exerciseId, exerciseName) {
    doGETJSON(null, "download_submissions/" + exerciseId + "/" + exerciseName, '', onSubmissionsReceive) // Async
}

function displayCurrentSubmissions(data) {
    let html = '<div id="submissions">'
    for (submission of data.submissions) {
        html += '<button class="btn btn-link" onclick="focusSubmission(' +
            "'" + submission[0].exercise_id + "','" +
            submission[0].grade + "','" +
            submission[0].manual_grade + "','" +
            submission[0].uid + "','" +
            submission[1] + "','" +
            submission[2] + "'" +
            ')">' +
            submission[2] + '</button><br>'
    }

    html += '<br><button class="btn btn_submission" onclick="runSubmissions(' + "'" + data.submissions[0][0].exercise_id + "'" + ')" style="border:1px solid green"><span>Run Submissions</button></div>'
    Swal.fire({
        title: 'Current submissions',
        html: html,
        focusConfirm: false,
    })
}

function myStringify(submissions) {
    stringify = ""
    for (submission of Object.values(submissions)) {
        stringify += "'" + submission + "', ";
    }
    return stringify
}

function focusSubmission(exerciseId, grade, manualGrade, submiterId, submissionId, submiterCountryId) {
    let html = '<div id="submission">' +
        '<button class="btn btn_submission" onclick="runSubmission(' + "'" + exerciseId + "','" + submiterId + "'" + ')" style="border:1px solid green"><span>Run Submission</button><br>' +
        '<button class="btn btn_submission" onclick="downloadSubmission(' + "'" + exerciseId + "','" + submiterId + "'" + ')" style="border:1px solid orange"><span>Download Submission</button><br>' +
        '<button class="btn btn_submission" onclick="editGrade(' + "'" + submissionId + "','" + grade + "','" +
        (manualGrade ? manualGrade + "'" : "") +
        ')" style="border:1px solid red"><span>Edit Grade</button><br>' +
        '<button class="btn btn_submission" onclick="manualGrade(' + "'" + submissionId + "','" + grade + "'" + ')" style="border:1px solid grey"><span>Grade Manually</button>' +
        '<div>'
    Swal.fire({
        title: 'Submission of ' + submiterCountryId,
        html: html,
        focusConfirm: false,
    })
}

function editGrade(submissionId, grade, manualGrade) {
    Swal.fire({
        title: 'Choose a new grade',
        html: '<div class="edit_grade">The actual grade is ' + grade + '<br><br>' +
            '<label for="new_grade">Enter the new grade</label>' +
            '<input id="new_grade" class="courseExerciseInputEdit" placeholder="' + grade + '"></input><br><br>' +
            (manualGrade != "undefined" ?
                '<br>The actual manual grade is ' + manualGrade + '<br><br>' +
                '<label for="new_manual_grade">Enter the new manual grade</label>' +
                '<input id="new_manual_grade" class="courseExerciseInputEdit" placeholder="' + manualGrade + '"></input><br><br>' :
                "") +
            '<div/>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: function () {
            const newGrade = escapeHtml($("#new_grade").val())
            const newManualGrade = escapeHtml($("#new_manual_grade").val())
            if (newGrade != "") {
                if (newManualGrade == "") {
                    doPostJSON(null, "edit_grade/" + submissionId + "/" + newGrade, "text", reloadManage)
                } else {
                    doPostJSON(null, "edit_grade_and_manual_grade/" + submissionId + "/" + newGrade + "/" + newManualGrade, "text", reloadManage)
                }
            } else {
                Swal.showValidationMessage(
                    `Please enter a new grade.`
                )
            }
        }
    })
}

function downloadSubmission(exerciseId, submiterId) {
    doPostJSON(null, "download_submission/" + exerciseId + "/" + submiterId, "text", onSubmissionReceive)
}

function onSubmissionReceive(data) {
    window.open(data)
}

function onSubmissionsReceive(data) {
    const blob = new Blob([data], {
        type: "application/zip"
    });
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = window.URL.createObjectURL(blob);
    link.download = "submissions.zip";
    link.click();
}

function manualGrade(submissionId, grade) {
    Swal.fire({
        title: 'Manual Grade',
        html: '<div class="manual_grade">The actual grade given by the badkan is ' + grade + '<br><br>' +
            '<label for="manual_grade">Enter the manual grade</label>' +
            '<input id="manual_grade" class="courseExerciseInputEdit"></input><br><br>' +
            '<div/>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: function () {
            const manualGrade = escapeHtml($("#manual_grade").val())
            if (manualGrade != "") {
                doPostJSON(null, "manual_grade/" + submissionId + "/" + manualGrade, "text", reloadManage)
            } else {
                Swal.showValidationMessage(
                    `Please enter a manual grade.`
                )
            }
        }
    })
}

function runSubmissions(exerciseId) {
    json = JSON.stringify({
        target: "run_submissions_admin",
        exercise_id: exerciseId,
    })
    sendWebsocket(json, onOpen, onMessage, onClose, onError)
}

function runSubmission(exerciseId, submiterId) {
    json = JSON.stringify({
        target: "run_submission_admin",
        exercise_id: exerciseId,
        uid: submiterId
    })
    sendWebsocket(json, onOpen, onMessage, onClose, onError)
}

function onOpen(_event) {
    Swal.fire({
        title: 'Running submission(s)',
        html: ' <div id="submissionResult">' +
            '<h2>Submission(s) result</h2>' +
            '<div id="output" dir="ltr">' +
            '</div>',
        focusConfirm: false,
    })
    logServer("color:blue", "Submission(s) starting!");
}

function onError(_event) {
    logServer("color:red", "Error in websocket.");
}

function onMessage(_event) {
    if (_event.data.includes('Submission of the student')) {
        logServer("color:green", _event.data);
    } else {
        logServer("color:black", _event.data);
    }
}

function onClose(event) {
    if (event.code === 1000) {
        logServer("color:blue", "Submission completed!");
    } else {
        logServer("color:red", "Connection closed abnormally!");
    }
}