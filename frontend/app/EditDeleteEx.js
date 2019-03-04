/**
 * When the user is directed in this page, we should first reload all the submited exercise.
 */

var backendPort = getParameterByName("backend");     // in utils.js
if (!backendPort)
    backendPort = 5670; // default port - same as in ../server.py
var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"

loadExerciseByOwner();
var ownExercises = new Map();

var select = document.getElementById("exercises");

function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}

/**
 * BUTTON EDIT.
 */
document.getElementById("btnEdit").addEventListener('click', e => {
    localStorage.setItem("selectedEx", JSON.stringify(select.value));
    localStorage.setItem("selectedExObj", JSON.stringify(ownExercises.get(select.value)));
    document.location.href = "editEx.html";
});

/**
 * BUTTON DELETE
 */
document.getElementById("btnDelete").addEventListener('click', e => {
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    var user = firebase.auth().currentUser;

    deleteExerciseById(select.value);
    incrementDeletedEx(user.uid, homeUser);

    var submission_json = JSON.stringify({
        delete_exercise: select.value,
    });

    logClient("color:#888", submission_json);  // in utils.js
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
        }
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
        if (event.data.includes("Final Grade:")) {
            console.log(event.data.substring(12, event.data.length));
            grade = event.data.substring(12, event.data.length);
            uploadGrade(grade);
        }
    }
});

/**
 * BUTTON GRADES
 */
document.getElementById("grades").addEventListener('click', e => {
    
});
