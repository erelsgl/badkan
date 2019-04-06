let exerciseId = JSON.parse(localStorage.getItem("selectedValue"));
let exercise = JSON.parse(localStorage.getItem("exercise"));


document.getElementById("exName").defaultValue = exercise.name
document.getElementById("exDescr").defaultValue = exercise.description
document.getElementById("exEx").defaultValue = exercise.example
document.getElementById("link").defaultValue = exercise.link
document.getElementById("exFolder").defaultValue = exercise.exFolder
document.getElementById("link").readOnly = true
document.getElementById("exFolder").readOnly = true

/**
 * BUTTON CONFIRM (SAVE CHANGES).
 */
document.getElementById("btnEdit").addEventListener('click', e => {
    const name = escapeHtml(document.getElementById("exName").value);
    const descr = escapeHtml(document.getElementById("exDescr").value);
    const example = escapeHtml(document.getElementById("exEx").value);
    if (checkEmptyFields(name, descr, example)) {
        uploadExercise(name, descr, example);
    }
});

function checkEmptyFields(name, descr, example) {
    var emptyField = document.getElementById("emptyField");
    if (name === "" || descr === "" || example == "") {
        emptyField.className = "show";
        setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
        return false;
    }
    return true;
}

/**
 * This function edit on the firebase the exercise.
 * Also, on the server, we proceed a push command for the repo.
 * @param {string} name 
 * @param {string} descr 
 * @param {string} example 
 */
function uploadExercise(name, descr, example) {
    // The ref of the folder must be PK.
    var user = firebase.auth().currentUser;
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    var folderName = JSON.parse(localStorage.getItem("selectedEx"));
    sendLinkHTTP(folderName, ex.exFolder);
    let exercise = new Exercise(name, descr, example, user.uid, ex.link, ex.exFolder, ex.grades);
    incrementEditExWithoutCommingHome(user.uid, homeUser);
    writeExercise(exercise, folderName);
    pullSuccess.className = "show";
    setTimeout(function () { pullSuccess.className = pullSuccess.className.replace("show", ""); }, 2500);
}

/**
 * Send a push request on the backend server.
 * @param {string} folderName 
 * @param {string} exFolder 
 */
function sendLinkHTTP(folderName, exFolder) {
    var backendPort = getParameterByName("backend");     // in utils.js
    if (!backendPort)
        backendPort = 5670; // default port - same as in ../server.py
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    var submission_json = JSON.stringify({
        folderName: folderName,
        exFolder: exFolder,
    });
    logClient("color:#888", submission_json);  // in utils.js
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
