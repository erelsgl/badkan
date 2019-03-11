var ex = JSON.parse(localStorage.getItem("selectedExObj"));

document.getElementById("exName").defaultValue = ex.name
document.getElementById("exDescr").defaultValue = ex.description
document.getElementById("exEx").defaultValue = ex.example
document.getElementById("link").defaultValue = ex.link
document.getElementById("exFolder").defaultValue = ex.exFolder
//document.getElementById("user").defaultValue = ex.username

/**
 * BUTTON CONFIRM (SAVE CHANGES).
 */
document.getElementById("btnEdit").addEventListener('click', e => {

  const name = document.getElementById("exName").value;
  const descr = document.getElementById("exDescr").value;
  const example = document.getElementById("exEx").value;

  var emptyField = document.getElementById("emptyField");

  if (name === "" || descr === "" || example == "") {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  }

  uploadExercise(name, descr, example);

});

function uploadExercise(name, descr, example) {
  // The ref of the folder must be PK.

  var user = firebase.auth().currentUser;

  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var folderName = JSON.parse(localStorage.getItem("selectedEx"));

  
  sendLinkHTTP(folderName, ex.exFolder);

  let exercise = new Exercise(name, descr, example, user.uid, ex.link, ex.exFolder, ex.grades);

  incrementEditEx(user.uid, homeUser);
  writeExercise(exercise, folderName);

}

function sendLinkHTTP(folderName, exFolder) {
  var backendPort = getParameterByName("backend");     // in utils.js
  if (!backendPort)
    backendPort = 5670; // default port - same as in ../server.py
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"

  var submission_json = JSON.stringify({
    folderName: folderName,
    exFolder: exFolder,
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
