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

courses = [];


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

function addAllCoursesHTML(course) {
  courses.push(course);
  // SEE IF REGISTER OR NOT: HERE ASSUMING NOT.         // If the user click here check if he registered if yes dl the pdf or something like this.
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
        let exerciseObj =  exercisesMap.get(course.exercises[i]);
          text_html += "Exercise name: " + exerciseObj.name + "<br />";
          text_html += "Exercise example: " + exerciseObj.example + "<br />";
          text_html += "Exercise description: " + exerciseObj.description + "<br />";
          text_html += "<br />";
      }
  }
  // Ask for the user the password if there is one.
  text_html += "<button id=\"submit\" class=\"btn btn-success\">Register</button>";
  $newPanel.find(".panel-body").append(text_html);
  $("#accordion").append($newPanel.fadeIn());
}

