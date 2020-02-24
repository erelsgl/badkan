$(document).ready(function() {
    if (location.hash === "#tutorial")
        playTutorialVideo()
});

$('a[href="#mycourses"]').click(function() {
    showMyCourses()
})

$('a[href="#public"]').click(function() {
    showPublic()
})

function showPublic() {
    $('a[href="#mycourses"]').removeClass("current");
    $('a[href="#public"]').addClass("current");
    $(".public").show()
    $(".myCourse").hide()
    if ($('.public')[0]) {
        $('.public')[0].click();
    }
}

function showMyCourses() {
    $('a[href="#public"]').removeClass("current");
    $('a[href="#mycourses"]').addClass("current");
    $(".myCourse").show()
    $(".public").hide()
    if ($('.myCourse')[0]) {
        $('.myCourse')[0].click();
    }
}

function onLoadMain() {
    if (userDetails.instructor == "False") {
        $("#becomeInstructor").show()
    } else {
        $("#instructorZone").show()
    }
    doPostJSON("", "get_courses_and_exercises/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    if (data.courses) {
        for (course of data.courses) {
            createAccordionHome(course, data.exercises, Object.values(data.submissions))
        }
    }
    if (($('.public').length) == 0) {
        noPublicCourseAvailable()
    }
    if (($('.myCourse').length) == 0) {
        noMyCourseAvailable()
    }
    hideLoader()
    showMyCourses()
}

function noPublicCourseAvailable() {
    $(".nacc").append('<div class="public no_course"><img class=warning src="images/msg-err.png">No public course available</div>')
}

function noMyCourseAvailable() {
    $(".nacc").append('<div class="myCourse no_course"><img class=warning src="images/msg-err.png">No my course available</div>')
}

function noExerciseAvailable(myClass) {
    return '<div class="' + myClass + ' no_exercise"><img class=warning src="images/msg-err.png">No exercise available</div>'
}

function createAccordionHome(courseObj, exercises, submissions) {
    let courseId = courseObj[0]
    let course = courseObj[1]
    let myClass = "public"
    if (course.uids) {
        myClass = getClass(course.uids, userUid)
    }
    createAccordionMenu(course.course_name, myClass)
    let panel = "<li>";
    let index = getExercisesItem(exercises, courseId)
    if (index != -1) {
        for (exerciseObj of Object.entries(exercises[index])) {
            let exerciseId = exerciseObj[0]
            let exercise = exerciseObj[1]
            if (myClass == "myCourse") {
                panel += createAccordionBodyHomeSolve(exerciseId, exercise, submissions)
            } else if (myClass == "public") {
                panel += createAccordionBodyHomeRegister(courseId, exercise)
            }
        }
    } else {
        panel += noExerciseAvailable(myClass)
    }
    $(".nacc").append(panel + "</li>")
}

function getClass(uids, id) {
    if (Object.values(uids).includes(id)) {
        return "myCourse"
    } else {
        return "public"
    }
}

function createAccordionBodyHomeRegister(courseId, exercise) {
    return '<div class="white_square_1 public">' + // Check in the class here for the style
        '<div class="exerciseName title_font">' + exercise.exercise_name + '</div><br><br>' +
        '<div class="description">Compiler : </div>' + '<div class="data">' + exercise.exercise_compiler + '</div><br><br>' +
        (exercise.exercise_description ? '<div class="description"> Description : </div>' + '<div class="data">' +
            exercise.exercise_description + '</div><br><br>' : "") +
        (exercise.deadline ? '<div class=timestamp>Deadline : ' +
            exercise.deadline + '</div>' + (exercise.deadline_hours ? '<div class=timestamp>' +
                exercise.deadline_hours + '</div><br><br>' : "") : "") +
        '<button class="btn blue_enjoy" onclick="registeringToCourse(' + "'" + courseId + "'" +
        ')">Register to the course <i class="glyphicon glyphicon-plus"></i></button>' +
        '</div>';
}

function createAccordionBodyHomeSolve(exerciseId, exercise, submissions) {
    return '<div class="white_square_1 myCourse">' + // Check in the class here for the style
        '<div class="exerciseName title_font">' + exercise.exercise_name + '</div><br><br>' +
        '<div class="description">Compiler : </div>' + '<div class="data">' + exercise.exercise_compiler + '</div><br><br>' +
        (exercise.exercise_description ? '<div class="description"> Description : </div>' + '<div class="data">' +
            exercise.exercise_description + '</div><br><br>' : "") +
        (exercise.pdf_instruction ? '<button class="btn btn-link"  onclick="downloadPdfInstruction(' + "'" + exerciseId + "'" + ')">Current pdf</button><br><br>' : "") +
        (exercise.deadline ? '<div class=timestamp>Deadline : ' +
            exercise.deadline + '</div>' + (exercise.deadline_hours ? '<div class=timestamp>' +
                exercise.deadline_hours + '</div><br><br>' : "") : "") + (exercise.main_file ?
            '<div class="description">The main function of your submission must be : </div>' + '<div class="data">' + exercise.main_file + '</div><br><br>' : "") + (exercise.input_file_name ?
            '<div class="description">You need to read the input from : </div>' + '<div class="data">' + exercise.input_file_name + '</div><br><br>' : "") + (exercise.output_file_name ?
            '<div class="description">You need to read the output from : </div>' + '<div class="data">' + exercise.output_file_name + '</div><br><br><br><br>' : "") + (exercise.url_exercise ? '<div class="description"> The URL from the instructor : </div>' + '<div class="data">' +
            exercise.url_exercise + '</div><br><br>' : "") +
        getSubmission(submissions, exerciseId) +
        '<br><br><button class="btn blue_enjoy" onclick="solveExercise(' + "'" + exerciseId + "'" +
        ')">Solve <i class="glyphicon glyphicon-fire"></i></button>' +
        '</div>';
}


function getSubmission(submissions, exerciseId) {
    for (submission of submissions) {
        if (submission.exercise_id == exerciseId) {
            return '<div class=white_smoke_square><div class="timestamp text_lastSubmission">Your last stored submission timestamp is: ' + submission.timestamp + '</div><br><br>' +
                (submission.url == "zip" ?
                    '<div class="timestamp text_lastSubmission">Your solution was submitted via a ZIP file.</div><br><br>' :
                    '<div class="timestamp text_lastSubmission">Your solution was submitted via a GitHub URL :' + submission.url + '</div><br><br>') +
                '<div class="timestamp text_lastSubmission grade">Your current grade: ' + submission.grade + '</div><br><br>' +
                (submission.manual_grade ? '<div class="timestamp text_lastSubmission grade">Your current manual grade: ' + submission.manual_grade + '</div><br><br>' :
                    '') +
                (submission.comment ? '<div class="timestamp text_lastSubmission">comment :' + submission.comment + '</div><br><br></div><br><br>' :
                    '</div><br><br>')
        }
    }
    return ""
}

function registeringToCourse(courseId) {
    doPostJSON(null, "registering_to_course/" + courseId + "/" + userUid, "text", reloadHome)
    $("#main").hide()
}

function reloadHome() {
    document.location.reload();
}

function solveExercise(exerciseId) {
    document.location.href = 'badkan.html?exercise=' + exerciseId;
}

function playTutorialVideo() {
    let html = '<video class="tuto" autoplay muted controls>' +
        '<source src="videos/video_tutorial.mp4" type="video/mp4">' +
        '</video>'
    Swal.fire({
        title: 'Tutorial',
        html: html,
        showConfirmButton: false
    });
}