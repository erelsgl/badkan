/**
 * TODO: UPDATE THE GRADING OF THE STUDENT FOR THE EXERCISE.
 */

var backendPort = getParameterByName("backend");     // in utils.js
if (!backendPort)
    backendPort = 5678; // default port - same as in ../server.py
var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
var exercise = getParameterByName("exercise");     // in utils.js
if (!exercise)
    exercise = "00-multiply"; // default exercise
$("#exercise").html(exercise);


$("button#clear").click(() => {
    $("div#output").html("")
    return false;
})

$("button#submit").click(() => {
    var submission_json = JSON.stringify({
        exercise: exercise,
        git_url: $("input#giturl").val(),
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
})
