/**
* BUTTON CONFIRM.
*/
document.getElementById("btnConfirm").addEventListener('click', e => {
  const name = escapeHtml(document.getElementById("exName").value);
  const descr = escapeHtml(document.getElementById("exDescr").value);
  const example = escapeHtml(document.getElementById("exEx").value);

  const date = document.getElementById("deadline").value;
  let penalities = [];
  for (var i = 1; i < 7; i++) {
    if (document.getElementById("penalityLate" + i).value) {
      let late = document.getElementById("penalityLate" + i).value;
      let point = document.getElementById("penalityGrade" + i).value;
      penalities.push(new Penality(late, point));
    }
  }

  let deadline = new Deadline(date, penalities);

  if ($('.nav-pills .active').text() === 'Zip file') {
    var file = document.getElementById('filename').files[0];
    if (checkEmptyFieldsFile(name, descr, example, file)) {
      uploadExerciseFile(name, descr, example, file, deadline);
    }
  }
  else {
    const link = escapeHtmlWithRespectGit(document.getElementById("link").value);
    const exFolder = escapeHtml(document.getElementById("exFolder").value);
    const username = escapeHtml(document.getElementById("user").value);
    const pass = escapeHtml(document.getElementById("pass").value);
    if (checkEmptyFieldsGit(name, descr, example, link, exFolder, username, pass)) {
      uploadExerciseGit(name, descr, example, link, username, pass, exFolder, deadline);
    }
  }
});

function checkEmptyFieldsGit(name, descr, example, exFolder, user, pass, link) {
  var emptyField = document.getElementById("emptyField");
  if (name === "" || descr === "" || example == "" || exFolder == "" || user == "" || pass == "" || link == "") {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return false;
  }
  return true;
}

function checkEmptyFieldsFile(name, descr, example, file) {
  var emptyField = document.getElementById("emptyField");
  if (name === "" || descr === "" || example == "" || !file) {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return false;
  }
  return true;
}

function editCourseCreate(exerciseId) {
  let courseId = JSON.parse(localStorage.getItem("courseId"));
  let course = JSON.parse(localStorage.getItem("course"));
  course.exercises.push(exerciseId);
  editCourse(course, courseId);
}

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
 * @param {String} name 
 * @param {String} descr 
 * @param {String} example 
 * @param {String} link 
 * @param {String} username 
 * @param {String} pass 
 * @param {String} exFolder 
 */
function uploadExerciseGit(name, descr, example, link, username, pass, exFolder, deadline) {
  var user = firebase.auth().currentUser;
  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  folderName = user.uid + "_" + homeUser.createdEx;
  sendLinkWEBSOCKET(link, folderName, username, pass, exFolder);
  let grade = new Grade("id", 90, "url");
  let grades = new Grades([grade]);
  let exercise = new Exercise(name, descr, example, user.uid, link, exFolder, grades, deadline);
  incrementCreatedExAndSubmitCourse(user.uid, homeUser);
  writeExercise(exercise, folderName);
  editCourseCreate(folderName)
}

function uploadExerciseFile(name, descr, example, file, deadline) {
  var user = firebase.auth().currentUser;
  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  folderName = user.uid + "_" + homeUser.createdEx;
  sendFileHTTP(file, folderName)
  let grade = new Grade("id", 90, "url");
  let grades = new Grades([grade]);
  let exercise = new Exercise(name, descr, example, user.uid, "zip", "", grades, deadline);
  incrementCreatedExAndSubmitCourse(user.uid, homeUser);
  writeExercise(exercise, folderName);
  editCourseCreate(folderName);
}

function sendFileHTTP(file, folderName) {
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  var rawData = new ArrayBuffer();
  reader.loadend = function () {
  }
  reader.onload = function (e) {
    rawData = e.target.result;
    // create the request
    const xhr = new XMLHttpRequest();
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
      backendPort = 9000;
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    xhr.open('POST', httpurl, true);
    xhr.setRequestHeader('Accept-Language', folderName);  // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.setRequestHeader('Accept', 'create');  // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        console.log("success");
      }
    };
    xhr.send(rawData);
  }
}

/**
 * This function send the exercise to the server using websockets.
 * @param {String} link 
 * @param {String} folderName 
 * @param {String} username 
 * @param {String} pass 
 * @param {String} exFolder 
 */
function sendLinkWEBSOCKET(link, folderName, username, pass, exFolder) {
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


document.getElementById("morePenalities").addEventListener('click', e => {
  if (document.getElementById("3-4").style.display === 'block') {
    document.getElementById("3-4").style.display = 'none';
    document.getElementById("5-6").style.display = 'none';
  }
  else {
    document.getElementById("3-4").style.display = 'block';
    document.getElementById("5-6").style.display = 'block';
  }
});