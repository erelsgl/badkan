/**
 * This file is used when the student clicks "Submit".
 */

finishLoading()

// Map with key: function name, value, function content.
let tests = new Map();
let owner_test_id = ""
let function_name = ""

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


/** Handling button */

/**
 * The button to clear the submission terminal.
 */
$("button#clear").click(() => {
  $("div#output").html("")
  return false;  // This is MANDATORY: just lost two days for that sh*t!!!!!! https://stackoverflow.com/questions/11184276/return-false-from-jquery-click-event
})

/**
 * The button to submit the exercise.
 */
$("button#submit").click(() => {
  submitSubmission()
  return false;  // This is MANDATORY: just lost two days for that sh*t!!!!!! https://stackoverflow.com/questions/11184276/return-false-from-jquery-click-event
})

/**
 * The button to submit the exercise.
 */
$("button#clear_and_submit").click(() => {
  $("div#output").html("")
  submitSubmission() 
  return false;  // This is MANDATORY: just lost two days for that sh*t!!!!!! https://stackoverflow.com/questions/11184276/return-false-from-jquery-click-event
})

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


/*
 * From here only function are writed.
 */

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

function submitSubmission() {
  if (exerciseId) {
    submitNormal();
  } else {
    submitPeer();
  }
}

function submitNormal() {
  reload();
  if ($('.nav-pills .active').text() === 'Zip file') {
    url = "Zip";
    var file = document.getElementById('filename').files[0];
    if (!file) {
      alert("Please attach a zip file");
      return;
    }
    doPost(file, ['Accept-Language', uid], dealWithFile);
  } else if ($('.nav-pills .active').text() === 'GitLab private clone') {
    url = escapeHtmlWithRespectGit(document.getElementById("link").value);
    var tokenUsername = escapeHtmlWithRespectGit(document.getElementById("user").value);
    var tokenPassword = escapeHtmlWithRespectGit(document.getElementById("pass").value);
    dealWithPrivate(tokenUsername, tokenPassword, url);
  } else {
    url = escapeHtmlWithRespectGit(document.getElementById("giturl").value);
    dealWithUrl();
  }
}

function submitPeer() {
  if (!file) {
    alert("You didn't upload a zip file")
    return;
  }
  var file = document.getElementById('filename').files[0];
  if (peerTestExercise) {
    doPost(file, ['Accept-Language', uid], onSuccessHttpPeerTest)
  } else {
    doPost(file, ['Accept-Language', uid], onSuccessHttpPeerSolution)
  }
}

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

function dealWithPrivate(tokenUsername, tokenPassword, url) {
  // Create the json for submission
  let json = JSON.stringify({
    target: "check_private_submission",
    exercise: exerciseId,
    solution: url,
    tokenUsername: tokenUsername,
    tokenPassword: tokenPassword,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: exercise.name,
    owner_firebase_id: uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName
  }); 
  sendWebsocket(json, onOpenTemplate, onMessageWebsocketSubmissionNormal, onCloseWebsocketSubmissionNormal, onErrorTemplate);
}

function dealWithUrl() {
  // Create the json for submission
  let json = JSON.stringify({
    target: "check_url_submission",
    exercise: exerciseId,
    solution: url,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: exercise.name,
    owner_firebase_id: uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName
  }); 
  sendWebsocket(json, onOpenTemplate, onMessageWebsocketSubmissionNormal, onCloseWebsocketSubmissionNormal, onErrorTemplate);
}

function dealWithFile() {
  // Create the json for submission
  let json = JSON.stringify({
    target: "check_file_submission",
    exercise: exerciseId,
    solution: uid,
    ids: homeUser.id + "-" + collab1Id + "-" + collab2Id,
    name: exercise.name,
    owner_firebase_id: uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName
  }); 
  sendWebsocket(json, onOpenTemplate, onMessageWebsocketSubmissionNormal, onCloseWebsocketSubmissionNormal, onErrorTemplate);
}

function onSuccessHttpPeerSolution() {
  // Create the json for submission
  let json = JSON.stringify({
    target: "check_solution_peer_submission",
    exerciseId: peerSolutionExercise,
    name: exercise.name,
    owner_firebase_id: firebase.auth().currentUser.uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName,
    country_id: homeUser.id,
  }); 
  sendWebsocket(json, onOpenTemplate, onMessageWebsocketSubmissionPeer, onCloseWebsocketSubmissionPeer, onErrorTemplate);
}

function onSuccessHttpPeerTest() {
  // Create the json for submission
  let json = JSON.stringify({
    target: "check_test_peer_submission",
    exerciseId: peerTestExercise,
    name: exercise.name,
    owner_firebase_id: firebase.auth().currentUser.uid,
    student_name: homeUser.name,
    student_last_name: homeUser.lastName,
    country_id: homeUser.id,
    min_test: exercise.minTest,
    signature_map: exercise.signatureMap
  }); 
  sendWebsocket(json, onOpenTemplate, onMessageWebsocketSubmissionPeer, onCloseWebsocketSubmissionPeer, onErrorTemplate);
}
