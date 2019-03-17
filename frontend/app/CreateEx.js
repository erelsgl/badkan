/**
* BUTTON CONFIRM.
*/
document.getElementById("btnConfirm").addEventListener('click', e => {

  const name = escapeHtml(document.getElementById("exName").value);
  const descr = escapeHtml(document.getElementById("exDescr").value);
  const example = escapeHtml(document.getElementById("exEx").value);
  const link = escapeHtmlWithRespectGit(document.getElementById("link").value);
  const exFolder = escapeHtml(document.getElementById("exFolder").value);
  const username = escapeHtml(document.getElementById("user").value);
  const pass = escapeHtml(document.getElementById("pass").value);

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
  alert("On this page, you can create a new exercise. \n" +
    "To upload a new exercise, you need first to create a GitLab account. \n" +
    "Then, create a private repository with all the files. Once the repository created you need to get a deploy token. \n" +
    "To get a deploy-token, go to GitLab -> Settings -> Repository -> Deploy Tokens -> Expand, \n" +
    "choose a name for the new token, and click \"Create deploy token\".");
});

/**
 * This function upload the exercise on the database and on the server using websocket.
 * @param {string} name 
 * @param {string} descr 
 * @param {string} example 
 * @param {string} link 
 * @param {string} username 
 * @param {string} pass 
 * @param {string} exFolder 
 */
function uploadExercise(name, descr, example, link, username, pass, exFolder) {

  // The ref of the folder must be PK.
  var user = firebase.auth().currentUser;

  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var folderName = user.uid + "_" + homeUser.createdEx;

  sendLinkHTTP(link, folderName, username, pass, exFolder);

  let grade = new Grade("id", 90, "url");
  let grades = new Grades(name, [grade]);

  let exercise = new Exercise(name, descr, example, user.uid, link, exFolder, grades);

  incrementCreatedExAndSubmit(user.uid, homeUser);
  writeExercise(exercise, folderName);

}

/**
 * This function send the exercise to the server using websockets.
 * @param {string} link 
 * @param {string} folderName 
 * @param {string} username 
 * @param {string} pass 
 * @param {string} exFolder 
 */
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
