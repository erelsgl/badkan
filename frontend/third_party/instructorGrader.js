function myStringify(submissions) {
    stringify = ""
    if (submissions) {
        for (submission of Object.values(submissions)) {
            stringify += "'" + submission + "', ";
        }
    }
    return stringify
}

function downloadGradesExercise(...submissionsId) {
    showLoader()
    exerciseName = submissionsId.pop()
    json = JSON.stringify({
        submissions_id: submissionsId
    })
    doPostJSON(json, "download_grades_exercise/" + exerciseName, 'json', onDownloadGradeFinish)
}

function onDownloadGradeFinish(data) {
    var lineArray = [];
    data.grades.forEach(function (infoArray, index) {
        var line = infoArray.join(",");
        lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    });
    var csvContent = lineArray.join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exercises_grades.csv");
    document.body.appendChild(link);
    hideLoader()
    link.click();
}

function currentSubmissionView(exerciseId) {
    doPostJSON(null, "retreive_submissions/" + exerciseId, "json", displayCurrentSubmissions)
}

function displayCurrentSubmissions(data) {
    let html = '<div id="submissions">'
    let exerciseId = ""
    for (submissionObj of Object.entries(data)) {
        let submission_id = submissionObj[0]
        let submission = submissionObj[1]
        let collaborators_filtered = submission.collaborators.filter(function (el) {
            return el != "";
        });
        html += '<button class="btn btn-link" onclick="focusSubmission(' +
            "'" + submission.exercise_id + "','" +
            submission.grade + "','" +
            submission.manual_grade + "','" +
            submission.comment + "','" +
            submission.uid + "','" +
            submission_id + "','" +
            collaborators_filtered.join(" && ") + "'" +
            ')">' +
            collaborators_filtered.join(" && ") + '</button><br>'
        exerciseId = submission.exercise_id
    }
    html += '<br><button class="btn btn_submission" onclick="runSubmissions(' + "'" + exerciseId + "'" + ')" style="border:1px solid green"><span>Run Submissions</button></div>'
    Swal.fire({
        title: 'Current submissions',
        html: html,
        focusConfirm: false,
    })
}

function focusSubmission(exerciseId, grade, manualGrade, comment, submiterId, submissionId, submiterCountryId) {
    let html = '<div id="submission">' +
        '<button class="btn btn_submission" onclick="runSubmission(' + "'" + exerciseId + "','" + submiterId + "'" + ')" style="border:1px solid green"><span>Run Submission</button><br>' +
        '<button class="btn btn_submission" onclick="downloadSubmission(' + "'" + exerciseId + "','" + submiterId + "'" + ')" style="border:1px solid orange"><span>Download Submission</button><br>' +
        '<button class="btn btn_submission" onclick="editGrade(' + "'" + submissionId + "','" + grade + "'" +
        (manualGrade ? ",'" + manualGrade + "'" : "") + (comment ? ",'" + comment + "'" : '') +
        ')" style="border:1px solid red"><span>Edit Grade</button><br>' +
        '<button class="btn btn_submission" onclick="manualGrade(' + "'" + submissionId + "','" + grade + "'" + ')" style="border:1px solid grey"><span>Grade Manually</button>' +

        '<div>'
    Swal.fire({
        title: 'Submission of ' + submiterCountryId,
        html: html,
        focusConfirm: false,
    })
}

function editGrade(submissionId, grade, manualGrade, comment) {
    Swal.fire({
        title: 'Choose a new grade',
        html: '<div class="edit_grade">The actual grade is ' + grade + '<br><br>' +
            '<label for="new_grade" class="text">Enter the new grade</label>' +
            '<input id="new_grade" class="courseExerciseInputEdit" value="' + grade + '"></input><br><br>' +
            (manualGrade != "false" ?
                '<br>The actual manual grade is ' + manualGrade + '<br><br>' +
                '<label for="new_manual_grade" class="text">Enter the new manual grade</label>' +
                '<input id="new_manual_grade" class="courseExerciseInputEdit" value="' + manualGrade + '"></input><br><br>' :
                "") +
            (comment != "false" ?
                '<label for="new_comment" class="text">Enter the new comment</label>' +
                '<textarea id="new_comment" class="instructorGrader input">' + comment + '</textarea><br><br>' :
                '') +
            '<div/>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: function () {
            const newGrade = escapeHtml($("#new_grade").val())
            const newManualGrade = escapeHtml($("#new_manual_grade").val())
            const newComment = escapeHtml($("#new_comment").val())
            if (newGrade != "") {
                let json = JSON.stringify({
                    "new_manual_grade": newManualGrade,
                    "new_comment": newComment
                })
                doPostJSON(json, "edit_grade/" + submissionId + "/" + newGrade, "text", reload)
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
    hideLoader()
    link.click();
}

function manualGrade(submissionId, grade) {
    Swal.fire({
        title: 'Manual Grade',
        html: '<div class="manual_grade">The actual grade given by the badkan is ' + grade + '<br><br>' +
            '<label for="manual_grade" class="text">Enter the manual grade</label>' +
            '<input id="manual_grade" class="courseExerciseInputEdit"></input><br><br>' +
            '<label for="comment" class="text">Enter a comment</label>' +
            '<textarea id="comment" class="instructorGrader input"></textarea><br><br>' +
            '<div/>',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: function () {
            const manualGrade = escapeHtml($("#manual_grade").val())
            const comment = escapeHtml($("#comment").val())
            let json = JSON.stringify({
                "manual_grade" : manualGrade,
                "comment": comment
            })
            doPostJSON(json, "manual_grade/" + submissionId, "text", reload)
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

function mossCommand(exerciseId) {
    showLoader()
    doPostJSON(null, "moss_command/" + exerciseId, "text", onCheckPlagiatFinish, 7000) // Async
}

function onCheckPlagiatFinish(data) {
    hideLoader()
    window.open(data)
}

function downloadStatistics(exerciseId) {
    doPostJSON(null, "download_statistics/" + exerciseId, "text", onSubmissionReceive)
}

function downloadSubmissions(exerciseId, exerciseName) {
    showLoader()
    doGETJSON(null, "download_submissions/" + exerciseId + "/" + exerciseName, '', onSubmissionsReceive) // Async
}

function reload() {
    document.location.reload();
}