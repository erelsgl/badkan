function onLoadMain() {
    doPostJSON("", "get_profile_data/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    createHistoryTable(data.submissions, data.exercise_name)
    graderPrivilege(data.graders, data.exercises)
    $('#loader').hide();
    $('#main').show()
}

function createHistoryTable(submissions, exercise_name) {
    let content = '<table class="pure-table pure-table-bordered"><thead>'
    content += '<tr><th>Exercise</th><th>Grade</th><th>Manual Grade</th><th>Collaborators</th><th>URL</th><th>Timestamp</th><th></th></tr></thead><tbody>'
    for (submissionObj of Object.entries(submissions)) {
        submission = submissionObj[1]
        content += '<tr><td>' + exercise_name[submission.exercise_id] +
            '</td><td>' + submission.grade +
            '</td><td>' + (submission.manual_grade ? submission.manual_grade : "None") +
            '</td><td>' + submission.collaborators +
            '</td><td>' + submission.url +
            '</td><td>' + submission.timestamp +
            '</td><td><button class="btn btn_edit" onclick="solveExercise(' + "'" + submission.exercise_id + "'" +
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
    let content = '<label  class="label_grader_table"><h1>Grader Privilege for the course ' + courseName + '.</h1></label>' +
        '<label id=><div class="grader_table"><table class="pure-table pure-table-bordered"><tbody>'
    for (exercisesObj of Object.entries(exercises)) {
        let exerciseId = exercisesObj[0]
        let exercise = exercisesObj[1]
        if (exercise.submissions) {
            content += '<tr><td>' + exercise.exercise_name +
                '</td><td><button class="btn btn_manage" onclick="downloadGradesExercise(' + myStringify(exercise.submissions) + "'" + exercise.exercise_name + "'" + ')" style="border:1px solid green"><span>Download Grades</button>' +
                '</td><td><button class="btn btn_manage" onclick="currentSubmissionView(' + "'" + exerciseId + "'" + ')" style="border:1px solid blue"><span>Current Submissions</button>' +
                '</td><td><button class="btn btn_manage" onclick="mossCommand(' + "'" + exerciseId + "'" + ')" style="border:1px solid red"><span>Check Plagiarism</button>' +
                '</td><td><button class="btn btn_manage" onclick="downloadStatistics(' + "'" + exerciseId + "'" + ')" style="border:1px solid grey"><span>Download Statistics</button>' +
                '</td><td><button class="btn btn_manage" onclick="downloadSubmissions(' + "'" + exerciseId + "','" + exercise.exercise_name + "'" + ')" style="border:1px solid orange"><span>Download Submissions</button></tr>'
        }
    }
    content += "</tbody></table></div>"
    $('#grader_privilege').append(content);
}