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

let exerciseMap = new Map(JSON.parse(localStorage.getItem("exerciseMap")));
let exercise = exercisesMap.get(exerciseId);

let usersMap = new Map(JSON.parse(localStorage.getItem("usersMap")));

let homeUserId = JSON.parse(localStorage.getItem("homeUserId"));
if (exercise.ownerId != homeUserId) {
    alert("You have no access to this page...");
    document.location.href = "manageCourses.html";
}

$("#exercise").html(exercise.name);

document.getElementById("exName").defaultValue = exercise.name
document.getElementById("exNameZip").defaultValue = exercise.name

document.getElementById("exDescr").defaultValue = exercise.description
document.getElementById("exDescrZip").defaultValue = exercise.description

document.getElementById("link").defaultValue = exercise.link
document.getElementById("exFolder").defaultValue = exercise.exFolder
document.getElementById("link").readOnly = true
document.getElementById("exFolder").readOnly = true

if (exercise.link == 'zip') {
    document.getElementById("git").style.display = "none";
    document.getElementById("zip").style.display = "block";
} else {
    document.getElementById("git").style.display = "block";
    document.getElementById("zip").style.display = "none";
}

let html_text = "";
for (var i = 1; i < exercise.grades.gradeObj.length; i++) {
    html_text +=
        "<button name =\"" + exercise.grades.gradeObj[i].id + "\" id=\"exercise\" class=\"btn btn-link\">" +
        usersMap.get(exercise.grades.gradeObj[i].id).name + " " +
        usersMap.get(exercise.grades.gradeObj[i].id).lastName + " " +
        usersMap.get(exercise.grades.gradeObj[i].id).id +
        "</button>";
    html_text += "<br />";
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
    document.location.href = "manageExercise.html";
});

document.getElementById("btnEditZip").addEventListener('click', e => {
    const name = escapeHtml(document.getElementById("exNameZip").value);
    const descr = escapeHtml(document.getElementById("exDescrZip").value);
    var file = document.getElementById('filename').files[0];
    if (checkEmptyFields(name, descr)) {
        var pdf = document.getElementById('instructionZIP').files[0];
        uploadExerciseFile(name, descr, file);
        editPdf(pdf);
    }
});

/**
 * BUTTON CONFIRM (SAVE CHANGES).
 */
document.getElementById("btnEdit").addEventListener('click', e => {
    const name = escapeHtml(document.getElementById("exName").value);
    const descr = escapeHtml(document.getElementById("exDescr").value);
    if (checkEmptyFields(name, descr)) {
        var pdf = document.getElementById('instructionGIT').files[0];
        uploadExercise(name, descr);
        editPdf(pdf);
    }
});

function checkEmptyFields(name, descr) {
    var emptyField = document.getElementById("emptyField");
    if (name === "" || descr === "") {
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
function uploadExercise(name, descr) {
    // The ref of the folder must be PK.
    var user = firebase.auth().currentUser;
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    sendLinkHTTP(exerciseId, exercise.exFolder);
    let ex = new Exercise(name, descr, "deprecated", user.uid, exercise.link, exercise.exFolder, exercise.grades, exercise.deadline);
    incrementEditExWithoutCommingHome(user.uid, homeUser);
    writeExercise(ex, exerciseId);
}

function uploadExerciseFile(name, descr, file) {
    // The ref of the folder must be PK.
    var user = firebase.auth().currentUser;
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    if (file) {
        sendFileHTTP(exerciseId, file);
    }
    let ex = new Exercise(name, descr, "deprecated", user.uid, 'zip', "", exercise.grades, exercise.deadline);
    incrementEditExWithoutCommingHome(user.uid, homeUser);
    writeExercise(ex, exerciseId);
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
        backendPort = 5670; // default port - same as in ../server.py
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
    reader.loadend = function () {}
    reader.onload = function (e) {
        rawData = e.target.result;
        // create the request
        const xhr = new XMLHttpRequest();
        var backendPort = getParameterByName("backend"); // in utils.js
        if (!backendPort)
            backendPort = 9000;
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
        backendPort = 5670; // default port - same as in ../server.py
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    let keys = Array.from(usersMap.keys());
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
    var parts = exerciseId + "-";
    let keys = Array.from(usersMap.keys());
    for (var i = 0; i < keys.length; i++) {
        parts += keys[i] + "/";
    }
    downloadProject(parts);
});

function downloadProject(parts) {
    // create the request
    const xhr = new XMLHttpRequest();
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = 9000;
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
        backendPort = 9000;
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