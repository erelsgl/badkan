function onLoadMain() {
    // The user will have a field "myCourses" and retreive all the course by this field.
    // Each course will have a field "My exercises"...
    doPostJSON("", "get_courses_manager/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    // TODO: make the first active at the beginning.
    if (data.courses) {
        const entries = Object.entries(data.courses)
        for (course of entries) {
            // course[0] -> courseId
            // course[1] -> course (the value)
            createAccordionManage(course); // Example.
        }
    }
    $('#main').show();

}

$("#newCourse").click(function () {
    var info = newCourse();
    info.then((json) => {
        doPostJSON(json, "create_course", "text", onCreateEditCourseExerciseSuccess)
        $("#main").hide()
    })
})

function onCreateEditCourseExerciseSuccess() {
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
    if (checkEmptyFields([courseName])) {
        let json = JSON.stringify({
            owner_uid: userUid,
            course_name: escapeHtml($("#course_name" + courseId).val()),
            grader_uid: escapeHtml($("#course_grader" + courseId).val()),
            privacy: ($("#pass" + courseId).is(":visible") ? "private" : "public"),
            uids: escapeHtml($("#course_ids" + courseId).val())
        })
        doPostJSON(json, "edit_course/" + courseId, "text", onCreateEditCourseExerciseSuccess)
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
            doPostJSON(null, "delete_course/" + courseId, "text", onCreateEditCourseExerciseSuccess)
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
                '<option value="gcc">gcc</option>' +
                '<option value="clang">clang</option>' +
                '</select>' +
                '<label for="submission_option"><div class="explanation" data-toggle="tooltip" title="For each method checked, the student will be able to submit his exercise via the method.' +
                'If you want the student only submit via GitHub, then check only the GitHub button .">Submission option *</div></label>' +
                '<div id="submission_option" class="swal2-input" >' +
                '<input id="github" name="BoxSelect[]" type="checkbox" value="github" required="" checked>GitHub</input> <br>' +
                '<input id="zip" name="BoxSelect[]" type="checkbox" value="zip" required="" checked>Zip</input>' +
                '</div>' +
                '<label for="main_file"><div class="explanation" data-toggle="tooltip" title="The file where the main function resides">Main file *</div></label>' +
                '<input id="main_file" class="swal2-input" placeholder="Main, Ex01, a...">',
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
            doPostJSONAndFile(fd, "create_exercise", "text", onCreateEditCourseExerciseSuccess)
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
