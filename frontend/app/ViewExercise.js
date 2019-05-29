// This line should be the same as in myExercises.js.

var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679];
var BACKEND_FILE_PORTS = [9000];

//var BACKEND_PORTS = [5670];

/**
 * From there, he can:
 * - Edit the exercise.
 * - Run a code of any user of all of them.
 * - Read and edit any file of any user.
 * - Run the moss command.
 * - dl the summary of the input/output of the student.
 */
//let exerciseId = JSON.parse(localStorage.getItem("selectedValue"));
//let exercise = JSON.parse(localStorage.getItem("exercise"));

var exerciseId = getParameterByName("exerciseId"); // in utils.js
if (!exerciseId)
    exerciseId = "multiply"; // default exercise

let exercisesMap = new Map(JSON.parse(localStorage.getItem("exercisesMap")));
let exercise = exercisesMap.get(exerciseId);

let usersMap = new Map(JSON.parse(localStorage.getItem("usersMap")));

let course = JSON.parse(localStorage.getItem("courseForGrader"));

let homeUserId = JSON.parse(localStorage.getItem("homeUserId"));
let homeUser = JSON.parse(localStorage.getItem("homeUserKey"));


if ((exercise.ownerId != homeUserId && homeUserId != "l54uXZrXdrZDTcDb2zMwObhXbxm1") &&
    !(course.ownerId == exercise.ownerId && course.grader == homeUser.id)) {
    alert("You have no access to this page...");
    document.location.href = "manageCourses.html";
}

$("#exercise").html(exercise.name);

document.getElementById("exName").defaultValue = exercise.name
document.getElementById("exNameZip").defaultValue = exercise.name

document.getElementById("exDescr").defaultValue = exercise.description
document.getElementById("exDescrZip").defaultValue = exercise.description

if (exercise.compiler) {
    document.getElementById("exCompiler").defaultValue = exercise.compiler
    document.getElementById("exCompilerZip").defaultValue = exercise.compiler
}

if (exercise.submission) {
    document.getElementById("githubGitHub").checked = exercise.submission.github
    document.getElementById("githubZip").checked = exercise.submission.github

    document.getElementById("zipGitHub").checked = exercise.submission.zip
    document.getElementById("zipZip").checked = exercise.submission.zip

    document.getElementById("gitlabGitHub").checked = exercise.submission.gitlab
    document.getElementById("gitlabZip").checked = exercise.submission.gitlab
}

document.getElementById("link").defaultValue = exercise.link
document.getElementById("exFolder").defaultValue = exercise.exFolder
document.getElementById("link").readOnly = true
document.getElementById("exFolder").readOnly = true

if (exercise.deadline) {
    document.getElementById("deadline").defaultValue = exercise.deadline.date
    if (exercise.deadline.penalities) {
        for (let i = 0; i < exercise.deadline.penalities.length; i++) {
            document.getElementById("penalityLate" + (i + 1)).defaultValue = exercise.deadline.penalities[i].late
            document.getElementById("penalityGrade" + (i + 1)).defaultValue = exercise.deadline.penalities[i].point
        }
    }
}

if (exercise.link == 'zip') {
    document.getElementById("git").style.display = "none";
    document.getElementById("zip").style.display = "block";
} else {
    document.getElementById("git").style.display = "block";
    document.getElementById("zip").style.display = "none";
}

let html_text = "";
// usersMap.get is undefined iff there are no users registered to the course.
// TODO: Handle this case more precisely
for ([key, value] of usersMap) {
    if (course.students.includes(key)) {
        html_text +=
            "<button name =\"" + key + "\" id=\"exercise\" class=\"btn btn-link\">" +
            value.name + " " +
            value.lastName + " " +
            value.id +
            "</button>";
        html_text += "<br />";
    }
}

if (html_text) {
    $("#submissions").append(html_text);
} else {
    $("#submissions").append("There is no submission yet.");
}

document.getElementById("loading").style.display = "none";


$('body').on('click', '#exercise', function (e) {
    let userId = e.target.name;
    let user = usersMap.get(userId);
    localStorage.setItem("userId", JSON.stringify(userId));
    localStorage.setItem("user", JSON.stringify(user));
    document.location.href = "manageExercise.html?exerciseId=" + exerciseId;
});

/**
 * BUTTON CONFIRM (SAVE CHANGES). ZIP
 */
document.getElementById("btnEditZip").addEventListener('click', e => {
    const name = escapeHtml(document.getElementById("exNameZip").value);
    const descr = escapeHtml(document.getElementById("exDescrZip").value);
    const compiler = escapeHtml(document.getElementById("exCompilerZip").value);
    var file = document.getElementById('filename').files[0];

    let githubZip = document.getElementById("githubZip").checked;
    let zipZip = document.getElementById("zipZip").checked;
    let gitlabZip = document.getElementById("gitlabZip").checked;

    const date = document.getElementById("deadline").value;
    let penalities = [];
    for (var i = 1; i < 7; i++) {
        if (document.getElementById("penalityLate" + i).value) {
            let late = document.getElementById("penalityLate" + i).value;
            let point = document.getElementById("penalityGrade" + i).value;
            penalities.push(new Penality(late, point));
        }
    }

    let deadline = new Deadline(date, penalities);

    // Here we first check that the user at least check one of the parameter.
    if (!githubZip && !zipZip && !gitlabZip) {
        alert("Please check at least one submission option.");
        return;
    }

    let submissionZip = new ViaSubmission(githubZip, zipZip, gitlabZip);


    if (checkEmptyFields(name, descr, compiler)) {
        var pdf = document.getElementById('instructionZIP').files[0];
        if (pdf) {
            exercise.example = "PDF"
        }
        uploadExerciseFile(name, descr, file, deadline, compiler, submissionZip);
        editPdf(pdf);
    }
});

/**
 * BUTTON CONFIRM (SAVE CHANGES). GITHUB
 */
document.getElementById("btnEdit").addEventListener('click', e => {
    const name = escapeHtml(document.getElementById("exName").value);
    const descr = escapeHtml(document.getElementById("exDescr").value);
    const compiler = escapeHtml(document.getElementById("exCompiler").value);

    let githubGitHub = document.getElementById("githubGitHub").checked;
    let zipGitHub = document.getElementById("zipGitHub").checked;
    let gitlabGitHub = document.getElementById("gitlabGitHub").checked;

    // Here we first check that the user at least check one of the parameter.
    if (!githubGitHub && !zipGitHub && !gitlabGitHub) {
        alert("Please check at least one submission option.");
        return;
    }

    let submissionGitHub = new ViaSubmission(githubGitHub, zipGitHub, gitlabGitHub);

    if (checkEmptyFields(name, descr, compiler)) {
        var pdf = document.getElementById('instructionGIT').files[0];
        if (pdf) {
            exercise.example = "PDF"
        }
        uploadExercise(name, descr, compiler, submissionGitHub);
        editPdf(pdf);
    }
});

function checkEmptyFields(name, descr, compiler) {
    var emptyField = document.getElementById("emptyField");
    if (name === "" || descr === "" || compiler === "") {
        emptyField.className = "show";
        setTimeout(function () {
            emptyField.className = emptyField.className.replace("show", "");
        }, 2500);
        return false;
    }
    return true;
}

/**
 * This function edit on the firebase the exercise.
 * Also, on the server, we proceed a push command for the repo.
 * @param {string} name 
 * @param {string} descr 
 */
function uploadExercise(name, descr, compiler, submissionGitHub) {
    // The ref of the folder must be PK.
    var user = firebase.auth().currentUser;
    sendLinkHTTP(exerciseId, exercise.exFolder);
    let ex = new Exercise(name, descr, exercise.example, user.uid, exercise.link, exercise.exFolder, exercise.submissionsId, exercise.deadline, compiler, submissionGitHub);
    incrementEditExWithoutCommingHome(user.uid, homeUser);
    writeExercise(ex, exerciseId);
}

function uploadExerciseFile(name, descr, file, deadline, compiler, submissionZip) {
    // The ref of the folder must be PK.
    var user = firebase.auth().currentUser;
    if (file) {
        sendFileHTTP(exerciseId, file);
    }
    let ex = new Exercise(name, descr, exercise.example, user.uid, 'zip', "", exercise.submissionsId, deadline, compiler, submissionZip);
    incrementEditExWithoutCommingHome(user.uid, homeUser);
    writeExercise(ex, exerciseId);
    if (isGrade() && !file) {
        flagCp = true;
    }
    checkGrade(exerciseId);
}
/**
 * Send a push request on the backend server.
 * @param {string} folderName 
 * @param {string} exFolder 
 */
function sendLinkHTTP(folderName, exFolder) {
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    var submission_json = JSON.stringify({
        target: "edit_ex",
        folderName: folderName,
        exFolder: exFolder,
    });
    logClient("color:#888", submission_json); // in utils.js
    var websocket = new WebSocket(websocketurl);
    websocket.onopen = (event) => {
        logServer("color:blue", "Submission starting!"); // in utils.js
        logClient("color:green; font-style:italic", submission_json)
        websocket.send(submission_json);
    }
    websocket.onclose = (event) => {
        if (event.code === 1000)
            logServer("color:blue", "Submission completed!");
        else if (event.code === 1006)
            logServer("color:red", "Connection closed abnormally!");
        else
            logServer("color:red", "Connection closed abnormally! Code=" + event.code + ". Reason=" + websocketCloseReason(event.code));
        log("&nbsp;", "&nbsp;")
    }
    websocket.onerror = (event) => {
        logServer("color:red", "Error in websocket.");
    }
    websocket.onmessage = (event) => {
        logServer("color:black; margin:0 1em 0 1em", event.data);
    }
    return false;
}

function sendFileHTTP(folderName, file) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    var rawData = new ArrayBuffer();
    reader.loadend = function () { }
    reader.onload = function (e) {
        rawData = e.target.result;
        // create the request
        const xhr = new XMLHttpRequest();
        var backendPort = getParameterByName("backend"); // in utils.js
        if (!backendPort)
            backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
        var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
        xhr.open('POST', httpurl, true);
        xhr.setRequestHeader('Accept-Language', folderName); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        if (isGrade()) {
            xhr.setRequestHeader('Accept', 'create-template'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        } else {
            xhr.setRequestHeader('Accept', 'create'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
        }
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                // success.
            }
        };
        xhr.send(rawData);
    }
}

function editPdf(file) {
    if (file) {
        storage.ref(exerciseId).put(file).then(function (snapshot) {
            pullSuccess.className = "show";
            setTimeout(function () {
                pullSuccess.className = pullSuccess.className.replace("show", "");
            }, 2500);
        }).catch(error => {
            alert(error)
        })
    } else {
        pullSuccess.className = "show";
        setTimeout(function () {
            pullSuccess.className = pullSuccess.className.replace("show", "");
        }, 2500);
    }
}

document.getElementById("btnRunAll").addEventListener('click', e => {
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    let keys = []
    for ([key, value] of usersMap) {
        if (course.students.includes(key)) {
            keys.push(key)
        }
    }
    var submission_json = JSON.stringify({
        target: "run_all",
        users_map: keys,
        exercise_id: exerciseId,
    });
    logClient("color:#888", submission_json); // in utils.js
    var websocket = new WebSocket(websocketurl);
    websocket.onopen = (event) => {
        logServer("color:blue", "Submission starting!"); // in utils.js
        logClient("color:green; font-style:italic", submission_json)
        websocket.send(submission_json);
    }
    websocket.onmessage = (event) => {
        console.log(event);
    }
    websocket.onclose = (event) => {
        if (event.code === 1000) {
            logServer("color:blue", "Submission completed!");
        } else if (event.code === 1006)
            logServer("color:red", "Connection closed abnormally!");
        else
            logServer("color:red", "Connection closed abnormally! Code=" + event.code + ". Reason=" + websocketCloseReason(event.code));
        log("&nbsp;", "&nbsp;")
    }
    websocket.onerror = (event) => {
        logServer("color:red", "Error in websocket.");
    }
    websocket.onmessage = (event) => {
        if (event.data.includes("THE GRADE FOR THE STUDENT WITH THE ID")) {
            let uid = event.data.substring(38, event.data.length)
            var res = event.data.replace(uid, usersMap.get(uid).id);
            let name = "WITH THE NAME: " + usersMap.get(uid).name + " " + usersMap.get(uid).lastName;
            logServer("color:black; margin:0 1em 0 1em", res);
            logServer("color:black; margin:0 1em 0 1em", name);
        } else {
            logServer("color:black; margin:0 1em 0 1em", event.data);
            // The line "Final Grade:<grade>" is written in server.py:check_submission
        }
    }
    return false;
});


document.getElementById("btnDlProjects").addEventListener('click', e => {
    var parts = exerciseId + "@$@";
    for (var [key, value] of usersMap) {
        var position = value.name.search(/[\u0590-\u05FF]/);
        if (position >= 0) {
            value.name = "unknown";
            value.lastName = "unknown";
        }
        parts += key + "/" + value.name + "_" + value.lastName + "-";
    }
    console.log(parts)
    downloadProject(parts);
});

function downloadProject(parts) {
    // create the request
    const xhr = new XMLHttpRequest();
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    xhr.open('GET', httpurl, true);
    xhr.setRequestHeader('Accept-Language', parts); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.setRequestHeader('Accept', 'dlAllProjects'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.onreadystatechange = function () {
        if (xhr.readyState == xhr.DONE && this.status == 200) {
            var resptxt = xhr.response;
            if (resptxt) {
                var blob = new Blob([xhr.response], {
                    type: "application/zip"
                });
                if (navigator.msSaveOrOpenBlob) {
                    navigator.msSaveOrOpenBlob(blob, exercise.name + ".zip");
                } else {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display:none";
                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = exercise.name + ".zip";
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                }
            } else {
                console.log("no response")
            }
        }
    };
    xhr.responseType = "arraybuffer";
    xhr.send();
}


document.getElementById("btnDlSummary").addEventListener('click', e => {
    const xhr = new XMLHttpRequest();
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    xhr.open('GET', httpurl, true);
    xhr.setRequestHeader('Accept-Language', exerciseId); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.setRequestHeader('Accept', 'dlSummary'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.onreadystatechange = function () {
        if (xhr.readyState == xhr.DONE && this.status == 200) {
            var resptxt = xhr.response;
            if (resptxt) {
                var blob = new Blob([resptxt], {
                    type: "text/plain"
                });
                if (navigator.msSaveOrOpenBlob) {
                    navigator.msSaveOrOpenBlob(blob, exercise.name + "_summary" + ".csv");
                } else {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display:none";
                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = exercise.name + "_summary" + ".csv";
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                }
            } else {
                console.log("no response")
            }
        }
    };
    xhr.responseType = "arraybuffer";
    xhr.send();
});

function checkGrade(exerciseFolderName) {
    if (document.getElementById('use').checked) {
        createGrade(exerciseFolderName);
    } else {
        console.log("notUse")
    }
}

function isGrade() {
    if (document.getElementById('use').checked) {
        return true;
    } else {
        return false;
    }
}

document.getElementById("btnMoss").addEventListener('click', e => {
    if (!exercise.compiler) {
        alert("There is no compiler for your exercise, please edit it.");
        return;
    }
    let information = "";
    for (var [key, value] of usersMap) {
        information += key + "/" + value.name + "_" + value.lastName + "-";
    }
    json = JSON.stringify({
        target: "moss_command",
        compiler: exercise.compiler,
        exercise_id: exerciseId,
        info: information
    }); // the variable "submission_json" is read in server.py:run
    sendWebsocket(json);
})

document.getElementById("btnDeleteEx").addEventListener('click', e => {
    var r = confirm("Are you sure to delete this exercise?");
    if (r == true) {
        deleteExerciseById(exerciseId);
        document.location.href = "manageCourses.html";
    }
});

function sendWebsocket(json) {
    // Choose a backend port at random
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    logClient("color:#888", "Submitting to backend port: " + backendPort); // in utils.js
    var submission_json = json
    logClient("color:#888", submission_json); // in utils.js
    var websocket = new WebSocket(websocketurl);
    websocket.onopen = (event) => {
        logServer("color:blue", "Submission starting!"); // in utils.js
        logClient("color:green; font-style:italic", submission_json)
        websocket.send(submission_json);
    }
    websocket.onmessage = (event) => {
        logServer("color:black; margin:0 1em 0 1em", event.data);
        if (event.data.includes("http://moss.stanford")) {
            var index = event.data.search("http://moss.stanford");
            var url = event.data.substring(index, event.data.length);
            console.log(url);
            window.open(url, '_blank');
        }
    }
    websocket.onclose = (event) => {
        if (event.code === 1000) {
            logServer("color:blue", "Submission completed!");
        } else if (event.code === 1006)
            logServer("color:red", "Connection closed abnormally!");
        else
            logServer("color:red", "Connection closed abnormally! Code=" + event.code + ". Reason=" + websocketCloseReason(event.code));
        log("&nbsp;", "&nbsp;")
    }
    websocket.onerror = (event) => {
        logServer("color:red", "Error in websocket.");
    }
}


function showTemplateEdit() {
    document.getElementById('accordion2').style.display = "block";
}


function hideTemplateEdit() {
    document.getElementById('accordion2').style.display = "none";
}

document.getElementById("morePenalities").addEventListener('click', e => {
    if (document.getElementById("3-4").style.display === 'block') {
        document.getElementById("3-4").style.display = 'none';
        document.getElementById("5-6").style.display = 'none';
    } else {
        document.getElementById("3-4").style.display = 'block';
        document.getElementById("5-6").style.display = 'block';
    }
});