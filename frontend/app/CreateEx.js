// This line should be the same as in myExercises.js.

var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679];
var BACKEND_FILE_PORTS = [9000];

//var BACKEND_PORTS = [5670];

/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnConfirm").addEventListener('click', e => {
  document.getElementById("page").style.display = "none";
  document.getElementById("loadingEx").style.display = "block";
  const name = escapeHtml(document.getElementById("exName").value);
  const descr = escapeHtml(document.getElementById("exDescr").value);
  const compiler = escapeHtml(document.getElementById("exCompiler").value);

  let github = document.getElementById("github").checked;
  let zip = document.getElementById("zip").checked;
  let gitlab = document.getElementById("gitlab").checked;

  // Here we first check that the user at least check one of the parameter.
  if (!github && !zip && !gitlab) {
    document.getElementById("page").style.display = "block";
    document.getElementById("loadingEx").style.display = "none";
    alert("Please check at least one submission option.");
    return;
  }

  let submission = new ViaSubmission(github, zip, gitlab);

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
    if (checkEmptyFieldsFile(name, descr, file, compiler)) {
      uploadExerciseFile(name, descr, file, deadline, compiler, submission);
    }
  } else {
    const link = escapeHtmlWithRespectGit(document.getElementById("link").value);
    const exFolder = escapeHtml(document.getElementById("exFolder").value);
    const username = escapeHtml(document.getElementById("user").value);
    const pass = escapeHtml(document.getElementById("pass").value);
    if (checkEmptyFieldsGit(name, descr, link, exFolder, username, pass, compiler)) {
      uploadExerciseGit(name, descr, link, username, pass, exFolder, deadline, compiler, submission);
    }
  }
});

function checkEmptyFieldsGit(name, descr, exFolder, user, pass, link, compiler) {
  var emptyField = document.getElementById("emptyField");
  if (name === "" || descr === "" || exFolder == "" || user == "" || pass == "" || compiler === "" || link == "") {
    document.getElementById("page").style.display = "block";
    document.getElementById("loadingEx").style.display = "none";
    emptyField.className = "show";
    setTimeout(function () {
      emptyField.className = emptyField.className.replace("show", "");
    }, 2500);
    return false;
  }
  return true;
}

function checkEmptyFieldsFile(name, descr, file, compiler) {
  var emptyField = document.getElementById("emptyField");
  if (name === "" || descr === "" || compiler === "" || !file) {
    document.getElementById("page").style.display = "block";
    document.getElementById("loadingEx").style.display = "none";
    emptyField.className = "show";
    setTimeout(function () {
      emptyField.className = emptyField.className.replace("show", "");
    }, 2500);
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
 * @param {S342533064tring} descr 
 * @param {String} link 
 * @param {String} username 
 * @param {String} pass 
 * @param {String} exFolder 
 */
function uploadExerciseGit(name, descr, link, username, pass, exFolder, deadline, compiler, submission) {
  var user = firebase.auth().currentUser;
  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  folderName = user.uid + "_" + homeUser.createdEx;
  sendLinkWEBSOCKET(link, folderName, username, pass, exFolder);
  let grade = new Grade("id", 90, "url");
  let grades = new Grades([grade]);
  let example = "deprecated"
  var pdf = document.getElementById('instruction').files[0];
  if (pdf) {
    example = "PDF"
  }
  let exercise = new Exercise(name, descr, example, user.uid, link, exFolder, grades, deadline, compiler, submission);
  incrementCreatedExAndSubmitCourse(user.uid, homeUser);
  writeExercise(exercise, folderName);
  editCourseCreate(folderName);
  uploadPdf(folderName);
  checkGrade(folderName);
}

function uploadExerciseFile(name, descr, file, deadline, compiler, submission) {
  var user = firebase.auth().currentUser;
  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  folderName = user.uid + "_" + homeUser.createdEx;
  sendFileHTTP(file, folderName)
  let grade = new Grade("id", 90, "url");
  let grades = new Grades([grade]);
  let example = "deprecated"
  var pdf = document.getElementById('instruction').files[0];
  if (pdf) {
    example = "PDF"
  }
  let exercise = new Exercise(name, descr, example, user.uid, "zip", "", grades, deadline, compiler, submission);
  incrementCreatedExAndSubmitCourse(user.uid, homeUser);
  writeExercise(exercise, folderName);
  editCourseCreate(folderName);
  uploadPdf(folderName);
  checkGrade(folderName);
}

function sendFileHTTP(file, folderName) {
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
    xhr.setRequestHeader('Accept-Language', folderName); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    if (isGrade()) {
      xhr.setRequestHeader('Accept', 'create-template'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    } else {
      xhr.setRequestHeader('Accept', 'create'); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    }
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        onFinish();
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
  var backendPort = getParameterByName("backend"); // in utils.js
  if (!backendPort)
    backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
  var submission_json = JSON.stringify({
    target: "load_ex",
    git_url: link,
    folderName: folderName,
    username: username,
    exFolder: exFolder,
    pass: pass,
  });
  logClient("color:#888", submission_json); // in utils.js
  var websocket = new WebSocket(websocketurl);
  websocket.onopen = (event) => {
    logServer("color:blue", "Submission starting!"); // in utils.js
    logClient("color:green; font-style:italic", submission_json)
    websocket.send(submission_json);
  }
  websocket.onclose = (event) => {
    onFinish();
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
  } else {
    document.getElementById("3-4").style.display = 'block';
    document.getElementById("5-6").style.display = 'block';
  }
});


function uploadPdf(exerciseId) {
  // If a pdf exist:
  var file = document.getElementById('instruction').files[0];
  if (file) {
    console.log("pdddf")
    storage.ref(exerciseId).put(file).then(function (snapshot) {
      onFinish();
    }).catch(error => {
      alert(error)
    })
  } else {
    onFinish();
  }
}

var count = 0;

function onFinish() {
  console.log(count);
  count++;
  if (count == 2) {
    document.getElementById("form").submit();
    document.location.href = "manageCourses.html";
  }
}

function checkGrade(exerciseFolderName) {
  if (document.getElementById('use').checked) {
    createGrade(exerciseFolderName);
  } else {
    console.log("notUse")
  }
}


function isGrade() {
  if (document.getElementById('use').checked) {
    return true;
  } else {
    return false;
  }
}