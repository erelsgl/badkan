/**
 * This file is used when the student clicks "Submit".
 */

// This line should be the same as in myExercises.js.

var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679];
var BACKEND_FILE_PORTS = [9000];

//var BACKEND_PORTS = [5670];

var homeUser = JSON.parse(localStorage.getItem("homeUserKey")); // The current user.

document.getElementById("currentId").value = homeUser.id; // The country id of the current user.
document.getElementById('currentId').readOnly = true; // Make it as readonly.

var exerciseId = getParameterByName("exercise"); // in utils.js
let peerTestExercise = getParameterByName("peerTestExercise"); // in utils.js
let peerSolutionExercise = getParameterByName("peerSolutionExercise"); // in utils.js

if (!exerciseId && !peerTestExercise && !peerSolutionExercise)
  exerciseId = "multiply"; // default exercise

var exercise = JSON.parse(localStorage.getItem("exercise"));
$("#exercise").html(exercise.name);

if (exercise.submission) {
  if (!exercise.submission.gitlab) {
    document.getElementById("gitlab").style.display = "none";
  } else {
    $('[href="#menu2"]').tab('show');
  }

  if (!exercise.submission.zip) {
    document.getElementById("zip").style.display = "none";
  } else {
    $('[href="#menu1"]').tab('show');
  }

  if (!exercise.submission.github) {
    document.getElementById("github").style.display = "none";
  } else {
    $('[href="#home"]').tab('show');
  }
}

// If we are in peer to peer process, we want to hide the "save grade" radio button 
// and remove collaborators 
if (peerTestExercise || peerSolutionExercise) {
  document.getElementById("saveGrade").style.display = "none";
  var display_collaborators = document.getElementsByClassName("collaborators");
  for (var i = 0; i < display_collaborators.length; i++) {
    display_collaborators[i].style.display = "none";
  }
}
if (!peerSolutionExercise) {
  document.getElementById("reclamation").style.display = "none";
}


// From Here 
let grade = 0;
let penality = 0;
if (exercise.deadline) {
  penality = isPenalized(exercise.deadline); // The grade by default.
}
// to here we are in the normal=(!peer_to_peer) section.


/*
 * From here only function are writed.
 */


/**
 * This function send the file to the server.
 * @param {File} file 
 */
function dealWithFile(file) {
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
      backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    xhr.open('POST', httpurl, true);
    xhr.setRequestHeader('Accept-Language', firebase.auth().currentUser.uid,); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        // Create the json for submission
        const collab1Id = escapeHtml(document.getElementById("collab1").value);
        const collab2Id = escapeHtml(document.getElementById("collab2").value);
        json = JSON.stringify({
          target: "check_submission",
          exercise: exerciseId,
          solution: firebase.auth().currentUser.uid,
          ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
          name: exercise.name,
          owner_firebase_id: firebase.auth().currentUser.uid,
          student_name: homeUser.name,
          student_last_name: homeUser.lastName
        }); // the variable "submission_json" is read in server.py:run
        sendWebsocket(json, "Zip");
      }
    };
    xhr.send(rawData);
  }
}


function dealWithPrivate(url, tokenUsername, tokenPassword) {
  // Create the json for submission
  const collab1Id = escapeHtml(document.getElementById("collab1").value);
  const collab2Id = escapeHtml(document.getElementById("collab2").value);
  json = JSON.stringify({
    target: "check_private_submission",
    exercise: exerciseId,
    solution: url,
    tokenUsername: tokenUsername,
    tokenPassword: tokenPassword,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: exercise.name,
    owner_firebase_id: firebase.auth().currentUser.uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName
  }); // the variable "submission_json" is read in server.py:run
  sendWebsocket(json, url);
}

function dealWithUrl(url) {
  // Create the json for submission
  const collab1Id = escapeHtml(document.getElementById("collab1").value);
  const collab2Id = escapeHtml(document.getElementById("collab2").value);
  json = JSON.stringify({
    target: "check_submission",
    exercise: exerciseId,
    solution: url,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: exercise.name,
    owner_firebase_id: firebase.auth().currentUser.uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName
  }); // the variable "submission_json" is read in server.py:run
  sendWebsocket(json, url);
}

function submit() {
  if ($('.nav-pills .active').text() === 'Zip file') {
    var file = document.getElementById('filename').files[0];
    dealWithFile(file);
  } else if ($('.nav-pills .active').text() === 'GitLab private clone') {
    var url = escapeHtmlWithRespectGit(document.getElementById("link").value);
    var tokenUsername = escapeHtmlWithRespectGit(document.getElementById("user").value);
    var tokenPassword = escapeHtmlWithRespectGit(document.getElementById("pass").value);
    dealWithPrivate(url, tokenUsername, tokenPassword);
  } else {
    dealWithUrl(escapeHtmlWithRespectGit(document.getElementById("giturl").value));
  }
}

function sendWebsocket(json, giturl) {
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
      if (document.getElementById("grade").checked) {
        grade = event.data.substring(12, event.data.length) - penality;
        if (penality) {
          alert("you grade is registered with a penalty of " + penality + " points.")
        }
        uploadGrade(grade, giturl);
      } else {
        grade = -1
      }
    }
  }
}

/**
 * The button to clear the submission terminal.
 */
$("button#clear").click(() => {
  $("div#output").html("")
  return false;
})

/**
 * The button to submit the exercise.
 */
$("button#submit").click(() => {
  if (exerciseId) {
    submit();
  } else if (peerTestExercise) {
    var file = document.getElementById('filename').files[0];
    if (!file)
      alert("You didn't upload a zip file")
    else
      dealWithFilePeerToPeerTest(file);
  } else {
    var file = document.getElementById('filename').files[0];
    if (!file)
      alert("You didn't upload a zip file")
    else
      dealWithFilePeerToPeerSolution(file);
  }
  return false;
})

/**
 * The button to submit the exercise.
 */
$("button#clear_and_submit").click(() => {
  $("div#output").html("")
  if (exerciseId) {
    submit();
  } else if (peerTestExercise) {
    var file = document.getElementById('filename').files[0];
    if (!file)
      alert("You didn't upload a zip file")
    else
      dealWithFilePeerToPeerTest(file);
  } else {
    var file = document.getElementById('filename').files[0];
    if (!file)
      alert("You didn't upload a zip file")
    else
      dealWithFilePeerToPeerSolution(file);
  }
  return false;
})

/**
 * This function upload the grade of the users (if collaborator) in the database.
 * @param {grade} grade 
 * @param {String} giturl 
 */
function uploadGrade(grade, giturl) {
  console.log(giturl)
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
    writeExerciseHistoric(exerciseId, [newGrade]);
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
  writeExerciseHistoric(exerciseId, gradevector);
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
  writeExerciseHistoric(exercise, gradevector);

}

/**
 * This function upload the collab grade in the database.
 * @param {grade} grade 
 * @param {user} collab 
 * @param {int} collabId 
 * @param {String} giturl 
 */
function uploadCollabGrade(grade, collab, collabId, giturl) {
  exerciseSolved = new ExerciseSolved(grade, exerciseId);
  flag = true;
  for (i = 0; i < collab.exerciseSolved.length; i++) {
    if (collab.exerciseSolved[i].exerciseId === exerciseId) {
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
  exerciseSolved = new ExerciseSolved(grade, exerciseId);
  flag = true;
  for (i = 0; i < homeUser.exerciseSolved.length; i++) {
    if (homeUser.exerciseSolved[i].exerciseId === exercise) {
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


// TODO: Finish here

/** In link with peer to peer */
$("button#reclamationTest").click(() => {
  var checkedBoxes = getCheckedBoxes("wrong");
  for (var i = 0; i < checkedBoxes.length; i++) {
    array_info = checkedBoxes[i].id.split("_");
    writeNewReclamationIds(firebase.auth().currentUser.uid, peerSolutionExercise, array_info[0], array_info[1])
  }
})

