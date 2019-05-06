// This line should be the same as in myExercises.js.

var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679];
var BACKEND_FILE_PORTS = [9000];

//var BACKEND_PORTS = [5670];

/**
 * From there, he can:
 * - Run a code of the user.
 * - Read and edit any file of any user.
 */

let exerciseId = JSON.parse(localStorage.getItem("selectedValue"));
let exercise = JSON.parse(localStorage.getItem("exercise"));
let userId = JSON.parse(localStorage.getItem("userId"));
let user = JSON.parse(localStorage.getItem("user"));

$("#student").html(user.name + " " + user.lastName + " " + user.id);

document.getElementById("btnDl").addEventListener('click', e => {
    // create the request
    const xhr = new XMLHttpRequest();
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    xhr.open('GET', httpurl, true);
    xhr.setRequestHeader('Accept-Language', userId + "/" + exerciseId); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.setRequestHeader('Accept', 'dlProject'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.onreadystatechange = function () {
        if (xhr.readyState == xhr.DONE && this.status == 200) {
            var resptxt = xhr.response;
            if (resptxt) {
                var blob = new Blob([xhr.response], {
                    type: "application/zip"
                });
                if (navigator.msSaveOrOpenBlob) {
                    navigator.msSaveOrOpenBlob(blob, user.name + "_" + user.lastName + ".zip");
                } else {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display:none";
                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download =  user.name + "_" + user.lastName + ".zip";
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

document.getElementById("btnRun").addEventListener('click', e => {
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
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