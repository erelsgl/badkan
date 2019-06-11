finishLoading()

let uid = JSON.parse(localStorage.getItem("homeUserId"));
let homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
let folderName = uid + "_" + homeUser.createdEx;


/** Handling button */

/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnConfirm").addEventListener('click', e => {
  onLoading();
  let github = document.getElementById("github").checked;
  let zip = document.getElementById("zip").checked;
  let gitlab = document.getElementById("gitlab").checked;
  let submission = getSubmission(github, zip, gitlab)
  const date = document.getElementById("deadline").value;
  let deadline = getDeadline(date)
  const name = escapeHtml(document.getElementById("exName").value);
  const descr = escapeHtml(document.getElementById("exDescr").value);
  const compiler = escapeHtml(document.getElementById("exCompiler").value);
  if ($('.nav-pills .active').text() === 'Zip file') {
    var file = document.getElementById('filename').files[0];
    if (checkEmptyFields([name, descr, file, compiler])) {
      dealWithFile(file)
      uploadExercise(name, descr, file, deadline, compiler, submission, "zip", "");
    } else {
      finishLoading();
      return;
    }
  } else {
    const link = escapeHtmlWithRespectGit(document.getElementById("link").value);
    const exFolder = escapeHtml(document.getElementById("exFolder").value);
    const username = escapeHtml(document.getElementById("user").value);
    const pass = escapeHtml(document.getElementById("pass").value);
    if (checkEmptyFields([name, descr, link, exFolder, username, pass, compiler])) {
      dealWithGitLab(link, username, pass, exFolder);
      uploadExercise(name, descr, file, deadline, compiler, submission, link, exFolder);
    } else {
      finishLoading();
      return;
    }
  }
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
 * BUTTON MORE PENALTIES.
 */
document.getElementById("morePenalities").addEventListener('click', e => {
  if (document.getElementById("3-4").style.display === 'block') {
    document.getElementById("3-4").style.display = 'none';
    document.getElementById("5-6").style.display = 'none';
  } else {
    document.getElementById("3-4").style.display = 'block';
    document.getElementById("5-6").style.display = 'block';
  }
});


/*
 * From here only function are writed.
 */

function uploadExercise(name, descr, deadline, compiler, submission, link, exFolder) {
  let example = "deprecated"
  var pdf = document.getElementById('instruction').files[0];
  if (pdf) {
    example = "PDF"
  }
  let exercise = new Exercise(name, descr, example, uid, link, exFolder, [], deadline, compiler, submission);
  incrementCreatedExAndSubmitCourse(uid, homeUser);
  writeExercise(exercise, folderName);
  editCourseCreate(folderName);
  uploadPdf(folderName);
  checkGrade(folderName);
}

function editCourseCreate(exerciseId) {
  let courseId = JSON.parse(localStorage.getItem("courseId"));
  let course = JSON.parse(localStorage.getItem("course"));
  if (course.exercises) {
    course.exercises.push(exerciseId);
  } else {
    course.exercises = [exerciseId]
  }
  editCourse(course, courseId, "None");
}

function uploadPdf(exerciseId) {
  // If a pdf exist:
  var file = document.getElementById('instruction').files[0];
  if (file) {
    storage.ref(exerciseId).put(file).then(function (snapshot) {
      onFinish();
    }).catch(error => {
      alert(error)
    })
  } else {
    onFinish();
  }
}

function checkGrade(exerciseFolderName) {
  if (document.getElementById('use').checked) {
    createGrade(exerciseFolderName);
  }
}

var count = 0;

function onFinish() {
  count++;
  if (count == 2) {
    document.getElementById("form").submit();
    document.location.href = "manageCourses.html";
  }
}

function isGrade() {
  if (document.getElementById('use').checked) {
    return true;
  } else {
    return false;
  }
}

function onZip() {
  document.getElementById('use').checked = true;
}

function dealWithGitLab(link, username, pass, exFolder) {
  let json = JSON.stringify({
    target: "load_ex",
    git_url: link,
    folderName: folderName,
    username: username,
    pass: pass,
    exFolder: exFolder,
  });
  sendWebsocket(json, undefined, undefined, onFinish, onErrorCourseChange);
}

function dealWithFile(file) {
  let args = ['Accept-Language', folderName, 'Accept'];
  if (isGrade()) {
    args.push('create-template');
  } else {
    args.push('create');
  }
  doPost(file, args, onFinish)
}
