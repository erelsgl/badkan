var grade = 0;

var backendPort = getParameterByName("backend");     // in utils.js
if (!backendPort)
    backendPort = 5670; // default port - same as in ../server.py
var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
var exercise = getParameterByName("exercise");     // in utils.js
if (!exercise)
    exercise = "00-multiply"; // default exercise
var ex = JSON.parse(localStorage.getItem("exercise"));
var selectedValue = JSON.parse(localStorage.getItem("selectedValue"));
$("#exercise").html(ex.name);


$("button#clear").click(() => {
    $("div#output").html("")
    return false;
})

$("button#submit").click(() => {
    var submission_json = JSON.stringify({
        exercise: exercise + "/" + ex.exFolder,
        git_url: $("input#giturl").val(),
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
        if (event.data.includes("Final Grade:")) {
            console.log(event.data.substring(12, event.data.length));
            grade = event.data.substring(12, event.data.length);
            var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));

            exerciseSolved = new ExerciseSolved(ex, grade, selectedValue);

            flag = true;
            for (i = 0; i < homeUser.exerciseSolved.length; i++) {
                if (homeUser.exerciseSolved[i].exerciseId === selectedValue) {
                    homeUser.exerciseSolved[i] = exerciseSolved;
                    flag = false;
                }
            }

            if (flag) {
                homeUser.exerciseSolved.push(exerciseSolved);
            }

            var userId = firebase.auth().currentUser.uid;
            writeUserDataWithoutComingHome(homeUser, userId);
        }
    }

    return false;
})

$("button#home").click(() => {
    document.location.href = "home.html";
})

