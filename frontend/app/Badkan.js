var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679, ];
//var BACKEND_PORTS = [5670]

var grade = 0;
var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));

document.getElementById("currentId").value = homeUser.id;
document.getElementById('currentId').readOnly = true;

var exercise = getParameterByName("exercise"); // in utils.js
if (!exercise)
  exercise = "multiply"; // default exercise
var ex = JSON.parse(localStorage.getItem("exercise"));
var selectedValue = JSON.parse(localStorage.getItem("selectedValue"));
$("#exercise").html(ex.name);

$("button#clear").click(() => {
  $("div#output").html("")
  return false;
})

$("button#submit").click(() => {
  // Choose a backend port at random
  var backendPort = getParameterByName("backend"); // in utils.js
  if (!backendPort)
    backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
  logClient("color:#888", "Submitting to backend port: " + backendPort); // in utils.js

  // Create the json for submission
  const collab1Id = escapeHtml(document.getElementById("collab1").value);
  const collab2Id = escapeHtml(document.getElementById("collab2").value);
  const giturl = escapeHtmlWithRespectGit(document.getElementById("giturl").value);
  var submission_json = JSON.stringify({
    exercise: exercise + "/" + ex.exFolder,
    git_url: giturl,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: ex.name
  }); // the variable "submission_json" is read in server.py:run
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
      if (grade === 0) {
        uploadGrade(0, giturl);
      }
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
    if (event.data.includes("Final Grade:")) {
      grade = event.data.substring(12, event.data.length);
      uploadGrade(grade, giturl);
    }
  }
  return false;
})

function uploadGrade(grade, giturl) {
  const collab1Id = document.getElementById("collab1").value;
  const collab2Id = document.getElementById("collab2").value;
  if (collab1Id != "" && collab2Id != "") {
    loadCollabById(collab1Id, grade);
    loadCollabById(collab2Id, grade);
    loadUidByIds(collab1Id, collab2Id, giturl);
  } else if (collab1Id != "") {
    loadCollabById(collab1Id, grade);
    loadUidById(collab1Id, giturl);
  } else if (collab2Id != "") {
    loadCollabById(collab1Id, grade);
    loadUidById(collab2Id, giturl);
  } else {
    uploadHomeUserGrade(grade);
    var uid = firebase.auth().currentUser.uid;
    let newGrade = new Grade(uid, grade, giturl)
    writeExerciseHistoric(selectedValue, [newGrade]);
  }
}

function uploadGradeWithOneCollab(grade, collab1Id, giturl) {
  uploadHomeUserGrade(grade);
  var uid = firebase.auth().currentUser.uid;
  let newGrade1 = new Grade(uid, grade, giturl)
  let newGrade2 = new Grade(collab1Id, grade, giturl)
  let gradevector = [newGrade1, newGrade2];
  writeExerciseHistoric(selectedValue, gradevector);
}

function uploadGradeWithTwoCollab(grade, collab1Id, collab2Id, giturl) {
  uploadHomeUserGrade(grade);
  var uid = firebase.auth().currentUser.uid;
  let newGrade1 = new Grade(uid, grade, giturl)
  let newGrade2 = new Grade(collab1Id, grade, giturl)
  let newGrade3 = new Grade(collab2Id, grade, giturl)
  let gradevector = [newGrade1, newGrade2, newGrade3];
  writeExerciseHistoric(selectedValue, gradevector);

}

function uploadCollabGrade(grade, collab, collabId, giturl) {
  exerciseSolved = new ExerciseSolved(ex, grade, selectedValue);
  flag = true;
  for (i = 0; i < collab.exerciseSolved.length; i++) {
    if (collab.exerciseSolved[i].exerciseId === selectedValue) {
      collab.exerciseSolved[i] = exerciseSolved;
      flag = false;
    }
  }
  if (flag) {
    collab.exerciseSolved.push(exerciseSolved);
  }
  writeUserDataWithoutComingHome(collab, collabId);
}

function uploadHomeUserGrade(grade) {
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
