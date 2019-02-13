var ex = JSON.parse(localStorage.getItem("selectedExObj"));

document.getElementById("exName").defaultValue = ex.name
document.getElementById("exDescr").defaultValue = ex.description


/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnEdit").addEventListener('click', e => {

  const name = document.getElementById("exName").value;
  const descr = document.getElementById("exDescr").value;
  const grading = document.getElementById("grading").value;
  const username = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const testCase = document.getElementById("testCase").files;

  var emptyField = document.getElementById("emptyField");

  if (name === "" || descr === "" || user == "" || pass == "" || grading == "" || testCase.length == 0) {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  }

  uploadExercise(name, descr, testCase, grading, username, pass);

});

function uploadExercise(name, descr, testCases, grading, username, pass) {
  // The ref of the folder must be PK.

  var user = firebase.auth().currentUser;

  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var folderName = JSON.parse(localStorage.getItem("selectedEx"));

  var storageRef = firebase.storage().ref(folderName);

  var testCaseRef = storageRef.child('testCase/');
  testCaseRef.put(testCases[0]).then(function (snapshot) {
    console.log('Uploaded folder!');
  })

  sendLinkHTTP(grading, folderName, username, pass);

  let exercise = new Exercise(name, descr, user.uid);

  incrementEditEx(user.uid, homeUser);
  writeExercise(exercise, folderName);

}

function sendLinkHTTP(grading, folderName, username, pass) {
  var backendPort = getParameterByName("backend");     // in utils.js
  if (!backendPort)
    backendPort = 5670; // default port - same as in ../server.py
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"

  var submission_json = JSON.stringify({
    edit_git_url: grading,
    folderName: folderName,
    username: username,
    pass: pass,
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
}