/**
 * This file is used when the student clicks "Submit".
 */

 finishLoading()
 
// This line should be the same as in myExercises.js.

var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679];
var BACKEND_FILE_PORTS = [9000];

//var BACKEND_PORTS = [5670];

var homeUser = JSON.parse(localStorage.getItem("homeUserKey")); // The current user.
let uid = JSON.parse(localStorage.getItem("homeUserId"));

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
let url = ""
let collab1Id = escapeHtml(document.getElementById("collab1").value);
let collab2Id = escapeHtml(document.getElementById("collab2").value);
let penality = 0;
if (exercise.deadline) {
  penality = isPenalized(exercise.deadline); // The grade by default.
}
// to here we are in the normal=(!peer_to_peer) section.

function reload() {
  grade = 0;
  url = ""
  collab1Id = escapeHtml(document.getElementById("collab1").value);
  collab2Id = escapeHtml(document.getElementById("collab2").value);
  penality = 0;
  if (exercise.deadline) {
    penality = isPenalized(exercise.deadline); // The grade by default.
  }
}
/*
 * From here only function are writed.
 */

function submit() {
  reload();
  if ($('.nav-pills .active').text() === 'Zip file') {
    url = "Zip";
    var file = document.getElementById('filename').files[0];
    if (!file) {
      alert("Please attach a zip file");
      return;
    }
    dealWithFile(file);
  } else if ($('.nav-pills .active').text() === 'GitLab private clone') {
    url = escapeHtmlWithRespectGit(document.getElementById("link").value);
    var tokenUsername = escapeHtmlWithRespectGit(document.getElementById("user").value);
    var tokenPassword = escapeHtmlWithRespectGit(document.getElementById("pass").value);
    dealWithPrivate(tokenUsername, tokenPassword);
  } else {
    url = escapeHtmlWithRespectGit(document.getElementById("giturl").value);
    dealWithUrl();
  }
}


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
    xhr.setRequestHeader('Accept-Language', uid); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        // Create the json for submission
        json = JSON.stringify({
          target: "check_submission",
          exercise: exerciseId,
          solution: uid,
          ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
          name: exercise.name,
          owner_firebase_id: uid,
          student_name: homeUser.name,
          student_last_name: homeUser.lastName
        }); // the variable "submission_json" is read in server.py:run
        sendWebsocket(json);
      }
    };
    xhr.send(rawData);
  }
}

function dealWithPrivate(tokenUsername, tokenPassword) {
  // Create the json for submission
  json = JSON.stringify({
    target: "check_private_submission",
    exercise: exerciseId,
    solution: urlSubmission,
    tokenUsername: tokenUsername,
    tokenPassword: tokenPassword,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: exercise.name,
    owner_firebase_id: uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName
  }); // the variable "submission_json" is read in server.py:run
  sendWebsocket(json);
}

function dealWithUrl() {
  // Create the json for submission
  json = JSON.stringify({
    target: "check_submission",
    exercise: exerciseId,
    solution: url,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: exercise.name,
    owner_firebase_id: uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName
  }); // the variable "submission_json" is read in server.py:run
  sendWebsocket(json);
}

function sendWebsocket(json) {
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
      uploadGrade(homeUser.id, collab1Id, collab2Id, createSubmission)
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

function createSubmission(collaboratorsId, collaboratorsUid) {
  // We sort the array by alphabetical.
  collaboratorsUid.sort();
  let currentTime = new Date()
  submission = new Submission(exerciseId, homeUser.id,
    uid, grade, -1, url, currentTime.toString(), collaboratorsId, collaboratorsUid, "TODO");
  let submissionId = ""
  for (let i = 0; i < collaboratorsUid.length; i++) {
    submissionId += collaboratorsUid[i] + "_";
  }
  submissionId += exerciseId;
  writeSubmission(submission, submissionId);
  // Push the array submissionId
  for (let j = 0; j < collaboratorsUid.length; j++) {
    pushArraySubmissionIdUserSide(collaboratorsUid[j], submissionId, exerciseId);
  }
  pushArraySubmissionIdExerciseSide(exerciseId, submissionId, collaboratorsId, collaboratorsUid);

}

/** In link with peer to peer */
$("button#reclamationTest").click(() => {
  //  Next release: First we remove the last reclamation since only the last reclamation count.
  var checkedBoxes = getCheckedBoxes("wrong"); // in util/utils.js
  for (var i = 0; i < checkedBoxes.length; i++) {
    array_info = checkedBoxes[i].id.split("_");
    testId = array_info[0];
    functionName = array_info[1];
    functionContent = tests.get(functionName)
    writeNewReclamationIds(uid, peerSolutionExercise, testId, functionName, functionContent)
  }
})