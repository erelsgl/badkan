/**
* From there, he can:
* - Run a code of the user.
* - Read and edit any file of any user.
*/

let exerciseId = JSON.parse(localStorage.getItem("selectedValue"));
let exercise = JSON.parse(localStorage.getItem("exercise"));
let userId = JSON.parse(localStorage.getItem("userId"));
let user = JSON.parse(localStorage.getItem("user"));

console.log(exerciseId)
console.log(exercise)
console.log(user)
console.log(userId)

loadPage();

function loadPage() {
    var backendPort = getParameterByName("backend");     // in utils.js
    if (!backendPort)
        backendPort = 5670; // default port - same as in ../server.py
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    var submission_json = JSON.stringify({
        target: "load_project",
        owner_firebase_id: userId,
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
        logServer("color:black; margin:0 1em 0 1em", event.data);
        // The line "Final Grade:<grade>" is written in server.py:check_submission
    }
    return false;
}

$("#student").html(user.name + " " + user.lastName + " " + user.id);

document.getElementById("btnRun").addEventListener('click', e => {
    var backendPort = getParameterByName("backend");     // in utils.js
    if (!backendPort)
        backendPort = 5670; // default port - same as in ../server.py
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    var submission_json = JSON.stringify({
        target: "run_admin",
        owner_firebase_id: userId,
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
        logServer("color:black; margin:0 1em 0 1em", event.data);
        // The line "Final Grade:<grade>" is written in server.py:check_submission
    }
    return false;
});