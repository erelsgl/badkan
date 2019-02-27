/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnConfirm").addEventListener('click', e => {
  
  const name = document.getElementById("exName").value;
  const descr = document.getElementById("exDescr").value;
  const example = document.getElementById("exEx").value;
  const link = document.getElementById("link").value;
  const exFolder = document.getElementById("exFolder").value;
  const username = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  var emptyField = document.getElementById("emptyField");

  if (name === "" || descr === "" || example == "" || exFolder == "" || user == "" || pass == "" || link == "") {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  }

  uploadExercise(name, descr, example, link, username, pass, exFolder);

});

/**
 * BUTTON HELP.
 */
document.getElementById("btnHelp").addEventListener('click', e => {
  alert("To upload a new exercise, you need first to create a GitLab account. \n" +
  "Then, create a private repository with all the files. Once the repository created, \n" + 
  "go to the settings of the repository, and then click in the Repository button. \n" +
  "Expand the deploy key and create one. you need to copy and paste the user name and the password \n" +
  "in the fields at the bottom.");
});

function uploadExercise(name, descr, example, link, username, pass, exFolder) {
  // The ref of the folder must be PK.
  var user = firebase.auth().currentUser;

  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var folderName = user.uid + "_" + homeUser.createdEx;

  sendLinkHTTP(link, folderName, username, pass, exFolder);

  let exercise = new Exercise(name, descr, example, user.uid, link, exFolder);

  incrementCreatedEx(user.uid, homeUser);
  writeExercise(exercise, folderName);

}

function sendLinkHTTP(link, folderName, username, pass, exFolder) {
  var backendPort = getParameterByName("backend");     // in utils.js
  if (!backendPort)
    backendPort = 5670; // default port - same as in ../server.py
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"

  var submission_json = JSON.stringify({
    git_url: link,
    folderName: folderName,
    username: username,
    exFolder: exFolder,
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