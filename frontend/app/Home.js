/**
 * Here the current user must be loaded and all the data needed must be loaded in the internal storage.
 * Really important.
 */

/**
 * ON STATE CHANGE.
 * Every time the state of the user is changed, this function is called.
 */
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    var userId = firebase.auth().currentUser.uid;
    loadCurrentUser(userId);   // Load current user data to localStorage. in file  util/Firebase.js
  }
});

var exercisesMap = new Map();

// We need to load all the exercise since it's possible that the owner of the course is not 
// the owner of the exercise. 
loadAllExercisesAsync(exercisesMap);  // defined in Firebase.js. 

loadAllCourses();

var coursesMap = new Map();

// /**
//  * BUTTON SOLVEEX.
//  * Send he user to the createEx page.
//  */
// document.getElementById("btnSolveEx").addEventListener('click', e => {
//   document.location.href = "solveEx.html";
// });

// /**
//  * BUTTON RECORDS.
//  * Send he user to the createEx page.
//  */
// document.getElementById("records").addEventListener('click', e => {
//   document.location.href = "records.html";
// });

/**
 * BUTTON MANAGE COURSE.
 * Send he user to the manage course page.
 */
document.getElementById("btnManageCourses").addEventListener('click', e => {
  document.location.href = "manageCourses.html";
});

/**
 * BUTTON SETTINGS.
 * Send he user to the settings page.
 */
document.getElementById("btnSettings").addEventListener('click', e => {
  document.location.href = "settings.html";
});

/**
 * BUTTON LOGOUT.
 * Log out the user and redirect hinm to the register page.
 */
document.getElementById("btnLogOut").addEventListener('click', e => {
  console.log('logged out');
  firebase.auth().signOut();
  document.location.href = "index.html";
});


var $template = $(".template");

function addAllCoursesHTML(key, course) {
  coursesMap.set(key, course);
  // SEE IF REGISTER OR NOT: HERE ASSUMING NOT.         // If the user click here check if he registered if yes dl the pdf or something like this.
  if (isRegistered(course)) {
    registered(key, course);
  }
  else {
    notRegistered(key, course);
  }
}

function isRegistered(course) {
  if (course.students.indexOf(firebase.auth().currentUser.uid) > -1) {
    return true;
  }
  else {
    return false;
  }
}

function notRegistered(key, course) {
  var $newPanel = $template.clone();
  $newPanel.find(".collapse").removeClass("in");
  $newPanel.find(".accordion-toggle").attr("href", "#" + (course.name))
    .text(course.name);
  $newPanel.find(".panel-collapse").attr("id", course.name).addClass("collapse").removeClass("in");
  $newPanel.find(".panel-body").text('')
  text_html = "";
  if (course.exercises.length === 1 && course.exercises[0] === "dummyExerciseId") {
    text_html += "<h5>There is not available exercise for this course!</h5>"
  }
  for (var i = 0; i < course.exercises.length; i++) {
    if (course.exercises[i] != "dummyExerciseId") {
      let exerciseObj = exercisesMap.get(course.exercises[i]);
      text_html += "Exercise name: " + exerciseObj.name + "<br />";
      text_html += "Exercise example: " + exerciseObj.example + "<br />";
      text_html += "Exercise description: " + exerciseObj.description + "<br />";
      text_html += "<br />";
    }
  }
  // Ask for the user the password if there is one.
  text_html += "<button name =\"" + key + "\" id=\"register\" class=\"btn btn-success\"\">Register</button>";
  $newPanel.find(".panel-body").append(text_html);
  $("#accordion").append($newPanel.fadeIn());
}

function registered(key, course) {
  var $newPanel = $template.clone();
  $newPanel.find(".collapse").removeClass("in");
  $newPanel.find(".accordion-toggle").attr("href", "#" + (course.name))
    .text(course.name);
  $newPanel.find(".panel-collapse").attr("id", course.name).addClass("collapse").removeClass("in");
  $newPanel.find(".panel-body").text('')
  text_html = "";
  if (course.exercises.length === 1 && course.exercises[0] === "dummyExerciseId") {
    text_html += "<h5>There is not available exercise for this course!</h5>"
  }
  for (var i = 0; i < course.exercises.length; i++) {
    if (course.exercises[i] != "dummyExerciseId") {
      let exerciseId = course.exercises[i];
      let exerciseObj = exercisesMap.get(exerciseId);
      text_html += "Exercise name: " + exerciseObj.name + "<br />";
      text_html += "Exercise example: " + exerciseObj.example + "<br />";
      text_html += "Exercise description: " + exerciseObj.description + "<br />";
      text_html += "<br />";
      var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
      let grade = -1;
      for (var i = 0; i < homeUser.exerciseSolved.length; i ++) {
        if (homeUser.exerciseSolved[i] === exerciseId) {
          grade = homeUser.exerciseSolved[i].grade;
        }
      }
      text_html += "My actual grades: " + grade + "<br />";
      text_html +=  "<button name =\"" + exerciseId + "\" id=\"solve\" class=\"btn btn-success\"\">Solve</button>";
    }
    console.log(text_html);
  }
  $newPanel.find(".panel-body").append(text_html);
  $("#accordion").append($newPanel.fadeIn());
}

// $('body').on('click', '#solve', function (e) {

// });

$('body').on('click', '#register', function (e) {
  let courseId = e.target.name;
  let course = coursesMap.get(courseId);
  if (course.password) {
    var response = prompt("Please enter the password:");
    if (response === course.password) {
      //success the student is registered.
      registerSuccess(course, courseId);
    }
    else {
      alert("wrong password");
    }
  }
  else {
    registerSuccess(course, courseId);
  }
});

function registerSuccess(course, courseId) {
  course.students.push(firebase.auth().currentUser.uid);
  editCourse(course, courseId)
  document.location.href = "home.html";
}
