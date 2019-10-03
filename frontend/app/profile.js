function onLoadMain() {
    doPostJSON("", "get_profile_data/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    displayDataUser()
    if (userDetails.instructor == "True") {
        displayGuide();
    }
    if (!jQuery.isEmptyObject(data.submissions)) {
        createHistoryTable(data.submissions, data.exercise_name)
    } else {
        noTableGrades()
    }
    if (data.exercises && !jQuery.isEmptyObject(data.exercises[0])) {
        graderPrivilege(data.graders, data.exercises)
    }
    hideLoader()
}

function displayGuide() {
    $('#guide').append('<button class="btn btn-link" onclick="downloadGuide()">Download Guide</button>');
}

function noTableGrades() {
    $("#submissions_table").append('<div class="no_grade"><img src="images/msg-err.png"> No grade available</div>')
}
function displayDataUser() {
    consoleText([userDetails.name + " " + userDetails.last_name, "id " + userDetails.country_id, userEmail,
    (userDetails.instructor == "True" ? "Instructor access" : "")
    ],
        'user_data',
        ['white']);
}

function consoleText(words, id, colors) {
    if (colors === undefined) colors = ['#fff'];
    var visible = true;
    var con = document.getElementById('console');
    var letterCount = 1;
    var x = 1;
    var waiting = false;
    var target = document.getElementById(id)
    target.setAttribute('style', 'color:' + colors[0])
    window.setInterval(function () {
        if (letterCount === 0 && waiting === false) {
            waiting = true;
            target.innerHTML = words[0].substring(0, letterCount)
            window.setTimeout(function () {
                var usedColor = colors.shift();
                colors.push(usedColor);
                var usedWord = words.shift();
                words.push(usedWord);
                x = 1;
                target.setAttribute('style', 'color:' + colors[0])
                letterCount += x;
                waiting = false;
            }, 1000)
        } else if (letterCount === words[0].length + 1 && waiting === false) {
            waiting = true;
            window.setTimeout(function () {
                x = -1;
                letterCount += x;
                waiting = false;
            }, 1000)
        } else if (waiting === false) {
            target.innerHTML = words[0].substring(0, letterCount)
            letterCount += x;
        }
    }, 120)
    window.setInterval(function () {
        if (visible === true) {
            con.className = 'console-underscore hidden'
            visible = false;

        } else {
            con.className = 'console-underscore'

            visible = true;
        }
    }, 400)
}

function createHistoryTable(submissions, exercise_name) {
    let content = '<table class="pure-table pure-table-bordered"><thead>'
    content += '<tr><th>Exercise</th><th>Grade</th><th>Manual Grade</th><th>Comment</th><th>Collaborators</th><th>URL</th><th>Timestamp</th><th></th></tr></thead><tbody>'
    for (submissionObj of Object.entries(submissions)) {
        submission = submissionObj[1]
        let collaborators_filtered = deleteBlank(submission.collaborators)
        content += '<tr><td>' + exercise_name[submission.exercise_id] +
            '</td><td>' + submission.grade +
            '</td><td>' + (submission.manual_grade ? submission.manual_grade : "None") +
            '</td><td>' + (submission.comment ? submission.comment : "None") +
            '</td><td>' + collaborators_filtered +
            '</td><td>' + submission.url +
            '</td><td>' + submission.timestamp +
            '</td><td><button class="btn blue_enjoy" onclick="solveExercise(' + "'" + submission.exercise_id + "'" +
            ')">Solve Again <i class="glyphicon glyphicon-fire"></i></button></tr>'
    }
    content += "</tbody></table>"
    $('#submissions_table').append(content);
}

function solveExercise(exerciseId) {
    document.location.href = 'badkan.html?exercise=' + exerciseId;
}

function graderPrivilege(courses, exercises) {
    for (courseObj of Object.entries(courses)) {
        let courseId = courseObj[0]
        let course = courseObj[1]
        let index = getExercisesItem(exercises, courseId)
        createGraderTable(course.course_name, exercises[index])
    }
}

function createGraderTable(courseName, exercises) {
    let content = '<label class="label_grader_table"><h1 style="border-bottom: 2px solid black">Grader Privilege for the course ' + courseName + ' :</h1></label>' +
        '<div><table class="pure-table pure-table-bordered"><tbody>'
    for (exercisesObj of Object.entries(exercises)) {
        let exerciseId = exercisesObj[0]
        let exercise = exercisesObj[1]
        if (exercise.submissions) {
            content += '<tr><td>' + exercise.exercise_name +
                '</td><td><button class="btn btn_submission" onclick="downloadGradesExercise(' + myStringify(exercise.submissions) + "'" + exercise.exercise_name + "'" + ')" style="border:1px solid green"><span>Download Grades</button>' +
                '</td><td><button class="btn btn_submission" onclick="currentSubmissionView(' + "'" + exerciseId + "'" + ')" style="border:1px solid blue"><span>Current Submissions</button>' +
                '</td><td><button class="btn btn_submission" onclick="mossCommand(' + "'" + exerciseId + "'" + ')" style="border:1px solid red"><span>Check Plagiarism</button>' +
                '</td><td><button class="btn btn_submission" onclick="downloadStatistics(' + "'" + exerciseId + "'" + ')" style="border:1px solid grey"><span>Download Statistics</button>' +
                '</td><td><button class="btn btn_submission" onclick="downloadSubmissions(' + "'" + exerciseId + "','" + exercise.exercise_name + "'" + ')" style="border:1px solid orange"><span>Download Submissions</button></tr>'
        }
    }
    content += "</tbody></table></div>"
    $('#grader_privilege').append(content);
}