/**
 * This file is used when the student clicks "Submit".
 */

// This line should be the same as in myExercises.js.
var BACKEND_PORTS = [5670];

var flag = true  // True = github url, false = file.

var grade = 0;  // The grade by default.
var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));  // The current user.

document.getElementById("currentId").value = homeUser.id;  // The country id of the current user.
document.getElementById('currentId').readOnly = true;  // Make it as readonly.

var exercise = getParameterByName("exercise"); // in utils.js
if (!exercise)
  exercise = "multiply"; // default exercise
var ex = JSON.parse(localStorage.getItem("exercise"));
var selectedValue = JSON.parse(localStorage.getItem("selectedValue"));
$("#exercise").html(ex.name);

function submit() {
  // Choose a backend port at random
  var backendPort = getParameterByName("backend"); // in utils.js
  if (!backendPort)
    backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
  logClient("color:#888", "Submitting to backend port: " + backendPort); // in utils.js

  // Create the json for submission
  const collab1Id = escapeHtml(document.getElementById("collab1").value);
  const collab2Id = escapeHtml(document.getElementById("collab2").value);
  var solution;
  if (flag) {
    solution = escapeHtmlWithRespectGit(document.getElementById("giturl").value);
  }
  else {
    solution = document.getElementById('filename').files[0];
    var reader = new FileReader();
    solution = new ArrayBuffer();
    reader.loadend = function () {
    }
    reader.onload = function (e) {
      solution = e.target.result;
    }
    reader.readAsArrayBuffer(file);
    
  }
  var submission_json = JSON.stringify({
    exercise: exercise + "/" + ex.exFolder,
    solution: solution,
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
}

/**
 * The button to clear the submission terminal.
 */
$("button#clear").click(() => {
  $("div#output").html("")
  submit();
  return false;
})

/**
 * The button to submit the exercise.
 */
$("button#submit").click(() => {
  submit();
  return false;
})

/**
 * This function upload the grade of the users (if collaborator) in the database.
 * @param {grade} grade 
 * @param {String} giturl 
 */
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

/**
 * If there is only one collab.
 * @param {grade} grade 
 * @param {int} collab1Id 
 * @param {String} giturl 
 */
function uploadGradeWithOneCollab(grade, collab1Id, giturl) {
  uploadHomeUserGrade(grade);
  var uid = firebase.auth().currentUser.uid;
  let newGrade1 = new Grade(uid, grade, giturl)
  let newGrade2 = new Grade(collab1Id, grade, giturl)
  let gradevector = [newGrade1, newGrade2];
  writeExerciseHistoric(selectedValue, gradevector);
}

/**
 * If there is two collab.
 * @param {grade} grade 
 * @param {int} collab1Id 
 * @param {int} collab1Id 
 * @param {String} giturl 
 */
function uploadGradeWithTwoCollab(grade, collab1Id, collab2Id, giturl) {
  uploadHomeUserGrade(grade);
  var uid = firebase.auth().currentUser.uid;
  let newGrade1 = new Grade(uid, grade, giturl)
  let newGrade2 = new Grade(collab1Id, grade, giturl)
  let newGrade3 = new Grade(collab2Id, grade, giturl)
  let gradevector = [newGrade1, newGrade2, newGrade3];
  writeExerciseHistoric(selectedValue, gradevector);

}

/**
 * This function upload the collab grade in the database.
 * @param {grade} grade 
 * @param {user} collab 
 * @param {int} collabId 
 * @param {String} giturl 
 */
function uploadCollabGrade(grade, collab, collabId, giturl) {
  exerciseSolved = new ExerciseSolved(grade, selectedValue);
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

/**
 * This function upload the current user grade in the database.
 * @param {grade} grade 
 */
function uploadHomeUserGrade(grade) {
  exerciseSolved = new ExerciseSolved(grade, selectedValue);
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
