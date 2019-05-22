/**
 * Here the current user must be loaded and all the data needed must be loaded
 * in the internal storage. Really important.
 */


// var admin = getParameterByName("admin"); // in utils.js
// if (admin == "1") {
//   $("#btnManageCourses").show()
// }

/**
 * ON STATE CHANGE.
 * Every time the state of the user is changed, this function is called.
 */
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    var userId = firebase.auth().currentUser.uid;
    loadCurrentUser(userId);  // Load current user data to localStorage. in file
                              // util/Firebase.js
    flag = true;
    localStorage.setItem('homeUserId', JSON.stringify(userId));
  }
});

var homeUser = JSON.parse(localStorage.getItem('homeUserKey'));
if (homeUser) {
  if (homeUser.admin) {
    if (homeUser.admin === true) {
      $('#btnManageCourses').show()
    }
  }
}

// We need to load all the exercise since it's possible that the owner of the
// course is not the owner of the exercise.
var exercisesMap = new Map();
loadAllExercisesAsync(exercisesMap);  // defined in Firebase.js.

var peerExercisesMap = new Map();
loadAllPeerExercisesAsync(peerExercisesMap);  // defined in Firebase.js.


function addCourseHTML(key, course) {
  coursesMap.set(key, course);
  // SEE IF REGISTER OR NOT: HERE ASSUMING NOT.         // If the user click
  // here check if he registered if yes dl the pdf or something like this. First
  // see if course if private or not:
  if (course.ids) {
    // private
    var homeUser = JSON.parse(localStorage.getItem('homeUserKey'));
    let arrayIds = course.ids.split(' ')
    if (arrayIds.includes(homeUser.id)) {
      if (isRegistered(course)) {
        registered(key, course);
      } else {
        let courseId = key;
        registerSuccess(course, courseId);
      }
    }
  } else {
    if (isRegistered(course)) {
      registered(key, course);
    } else {
      notRegistered(key, course);
    }
  }
}

var numRegistered = 0, numUnregistered = 0

function onAllCoursesLoaded() {
  if (numUnregistered == 0) {
    $('#accordion-unregistered').append('<p>No other courses!</p>');
  }
  if (numRegistered == 0) {
    $('#accordion-registered')
        .append('<p>You are not registered to any course yet!</p>');
  }
}

var coursesMap = new Map()
loadAllCourses(addCourseHTML, onAllCoursesLoaded)  // in util/Firebase.js


// var flag = JSON.parse(localStorage.getItem("flag"));

// if (flag) {
//   refresh();
// }

function refresh() {
  var userId = firebase.auth().currentUser.uid;
  loadCurrentUser(userId);  // Load current user data to localStorage. in file
                            // util/Firebase.js
}

/**
 * BUTTON MANAGE COURSE.
 * Send he user to the manage course page.
 */
document.getElementById('btnManageCourses').addEventListener('click', e => {
  document.location.href = 'manageCourses.html';
});

/**
 * BUTTON SETTINGS.
 * Send he user to the settings page.
 */
document.getElementById('btnSettings').addEventListener('click', e => {
  document.location.href = 'settings.html';
});

/**
 * BUTTON LOGOUT.
 * Log out the user and redirect him to the register page.
 */
document.getElementById('btnLogOut').addEventListener('click', e => {
  document.getElementById('btnManageCourses').style.display = 'none'
  firebase.auth().signOut();
  document.location.href = 'index.html';
});



function isRegistered(course) {
  if (course.students.indexOf(firebase.auth().currentUser.uid) > -1) {
    return true;
  } else {
    return false;
  }
}

var $template = $('.template');
let hash = 2;


// Show a course to which the current user is not registered.
function notRegistered(key, course) {
  numUnregistered++;
  var $newPanel = $template.clone();
  $newPanel.find('.collapse').removeClass('in');
  $newPanel.find('.accordion-toggle')
      .attr('href', '#' + (hash))
      .text(course.name);
  $newPanel.find('.panel-collapse')
      .attr('id', hash++)
      .addClass('collapse')
      .removeClass('in');
  $newPanel.find('.panel-body').text('')
  text_html = '';
  text_html += '<button name ="' + key +
      '" id="register" class="btn btn-success"">Register to ' + course.name +
      '</button>';
  if (course.exercises.length === 1 &&
      course.exercises[0] === 'dummyExerciseId') {
    text_html += '<p>There are no available exercises for this course!</p>'
  } else {
    text_html += '<h3>Exercises in ' + course.name + '</h3>'
    for (var i = 0; i < course.exercises.length; i++) {
      if (course.exercises[i] != 'dummyExerciseId') {
        let exerciseObj = exercisesMap.get(course.exercises[i]);
        let peerExerciseObj = peerExercisesMap.get(course.exercises[i]);
        if (exerciseObj) {
          text_html += '<div class=\'exercise\'>'
          text_html += '<h4>' + exerciseObj.name + '</h4>';
          text_html += '<p>' + exerciseObj.description + '</p>';
          if (exerciseObj.deadline && exerciseObj.deadline.date) {
            text_html += '<br />';
            text_html +=
                'Exercise deadline: ' + exerciseObj.deadline.date + '<br />';
            let penalities = exerciseObj.deadline.penalities;
            if (penalities) {
              text_html += '<strong> Penalties </strong>: <br />';
              for (var p = 0; p < penalities.length; p++) {
                text_html += 'Submitted with ' + penalities[p].late +
                    ' day(s) late is penalized with ' + penalities[p].point +
                    ' point(s)' +
                    '<br />';
              }
            }
          }
          text_html += '</div><!--exercise-->'
        }

        if (peerExerciseObj) {
          text_html += '<div class=\'exercise\'>'
          text_html += '<h4>' +
              '<span class="glyphicon glyphicon-transfer"></span>  ' +
              peerExerciseObj.name +
              '  <span class="glyphicon glyphicon-transfer"></span>' +
              '</h4>';
          text_html += '<p>' + peerExerciseObj.description + '</p>';
          text_html +=
              'Test deadline: ' + peerExerciseObj.deadlineTest + '<br />';
          text_html +=
              'Solution deadline: ' + peerExerciseObj.deadlineSolution +
              '<br />';
          text_html +=
              'Conflicts deadline: ' + peerExerciseObj.deadlineConflicts +
              '<br />';
          text_html += '</div><!--exercise-->'
        }
      }
    }
  }
  $newPanel.find('.panel-body').append(text_html);
  $('#accordion-unregistered').append($newPanel.fadeIn());
}

// Show a course to which the current user is registered.
function registered(key, course) {
  numRegistered++;
  var $newPanel = $template.clone();
  $newPanel.find('.collapse').removeClass('in');
  $newPanel.find('.accordion-toggle')
      .attr('href', '#' + (hash))
      .text(course.name);
  $newPanel.find('.panel-collapse')
      .attr('id', hash++)
      .addClass('collapse')
      .removeClass('in');
  $newPanel.find('.panel-body').text('')
  text_html = '';

  if (course.exercises.length === 1 &&
      course.exercises[0] === 'dummyExerciseId') {
    text_html += '<h5>There are no available exercise for this course!</h5>'
  } else {
    text_html += '<h3>Exercises in ' + course.name + '</h3>'
    for (var i = 0; i < course.exercises.length; i++) {
      if (course.exercises[i] != 'dummyExerciseId') {
        let exerciseId = course.exercises[i];
        let exerciseObj = exercisesMap.get(exerciseId);
        let peerExerciseObj = peerExercisesMap.get(exerciseId);

        if (exerciseObj) {
          text_html += '<div class=\'exercise\'>'
          text_html += '<h4>' + exerciseObj.name + '</h4>';
          text_html += '<p>' + exerciseObj.description + '</p>';
          if (exerciseObj.example === 'PDF') {
            text_html += '<button name ="' + exerciseId +
                '" id="dl" class="btn btn-link"">Download PDF</button>';
            text_html += '<br /> <br />'
          }

          if (exerciseObj.deadline && exerciseObj.deadline.date) {
            text_html += '<br />';
            text_html +=
                'Exercise deadline: ' + exerciseObj.deadline.date + '<br />';

            let penalities = exerciseObj.deadline.penalities;

            if (penalities) {
              text_html += '<strong> Penalties </strong>: <br />';
              for (var p = 0; p < penalities.length; p++) {
                text_html += 'Submitted with ' + penalities[p].late +
                    ' day(s) late is penalized with ' + penalities[p].point +
                    ' point(s)' +
                    '<br />';
              }
            }
          }
          var homeUser = JSON.parse(localStorage.getItem('homeUserKey'));
          let grade = -1;
          for (var j = 0; j < homeUser.exerciseSolved.length; j++) {
            if (homeUser.exerciseSolved[j]) {
              if (homeUser.exerciseSolved[j].exerciseId === exerciseId) {
                grade = homeUser.exerciseSolved[j].grade;
              }
            }
          }
          text_html += '<p>';
          if (grade === -1) {
            text_html += 'You have not solved this exercise yet. ';
          } else {
            text_html += 'Your current grade is: ' + grade + '. ';
          }
          text_html += '<button name ="' + exerciseId +
              '" id="solve" class="btn btn-success"">Solve</button>';
          text_html += '</p>';
          text_html += '</div><!--exercise-->'
        }

        /* @param {string} name
         * @param {string} description
         * @param {date} deadlineTest
         * @param {date} deadlineSolution
         * @param {date} deadlineConflicts
         * @param {string} compilerSolution // java by default (on the frontend readonly).
         * @param {string} compilerTest // junit by default (on the frontend readonly).
         */
        if (peerExerciseObj) {
          text_html += '<div class=\'exercise\'>'
          text_html += '<h4>' +
              '<span class="glyphicon glyphicon-transfer"></span>  ' +
              peerExerciseObj.name +
              '  <span class="glyphicon glyphicon-transfer"></span>' +
              '</h4>';

          text_html += '<p>' + peerExerciseObj.description + '</p>';
          text_html += '<button name ="' + exerciseId +
              '" id="dl" class="btn btn-link"">Download PDF</button>';
          text_html += '<br /> <br />'


          text_html +=
              'Test deadline: ' + peerExerciseObj.deadlineTest + '<br />';
          text_html +=
              'Solution deadline: ' + peerExerciseObj.deadlineSolution +
              '<br />';
          text_html +=
              'Conflicts deadline: ' + peerExerciseObj.deadlineConflicts +
              '<br />';

          text_html +=
              'Test language: ' + peerExerciseObj.compilerTest + '<br />';
          text_html +=
              'Solution language: ' + peerExerciseObj.compilerSolution +
              '<br />';

          let phase = whichPhase(peerExerciseObj);
          text_html += '<h5><strong>' + phase + ':</strong></h5>'

          switch (phase) {
            case 'Test Phase':
              testPhase(peerExerciseObj, exerciseId);
              break;
            case 'Solution Phase':
              solutionPhase(peerExerciseObj, exerciseId);
              break;
            case 'Conflicts Phase':
              conflictsPhase(exerciseId);
              break;
            default:
              endGame(exerciseId);
          }

          text_html += '</p>';
          text_html += '</div><!--exercise-->'
        }
      }
    }
  }
  $newPanel.find('.panel-body').append(text_html);
  $('#accordion-registered').append($newPanel.fadeIn());
}

/*
 * @param {int} minTest
 * @param {map} signatureMap
 */
function testPhase(peerExerciseObj, exerciseId) {
  text_html += 'You need to implement at least : ' + peerExerciseObj.minTest +
      ' tests.' +
      '<br />';
  text_html += 'Here is the list of the function you have to test: <br />';
  for (let sign of peerExerciseObj.signatureMap) {
    text_html += 'The function signature is: <strong>' + sign.func +
        '</strong> -> The class where the function reside is: <strong>' +
        sign.cla + '</strong> <br />';
  }
  text_html += '<button name ="' + exerciseId +
      '" id="btnTestPhase" class="btn btn-primary"">Submit test</button>';
}

/*
 * @param {map} signatureMap
 */
function solutionPhase(peerExerciseObj, exerciseId) {
  text_html +=
      'Here is the list of the function you have to implements: <br />';
  for (let sign of peerExerciseObj.signatureMap) {
    text_html += 'The function signature is: <strong>' + sign.func +
        '</strong> -> The class where the function reside is: <strong>' +
        sign.cla + '</strong> <br />';
  }

  text_html += '<button name ="' + exerciseId +
      '" id="btnSolutionPhase" class="btn btn-success"">Submit Solution</button>';
}

function conflictsPhase(exerciseId) {
  text_html += '<button name ="' + exerciseId +
      '" id="btnConflictsPhase" class="btn btn-danger"">Check for conflicts</button>';
}

/* @param {Object} peerGrades // Object we created with the grades. */
// TODO: Fix the bug includes not fun
function endGame(exerciseId) {
  // if (homeUser.peerExerciseSolved) {
  //   if (homeUser.peerExerciseSolved.includes(exerciseId)) {
  //     // The user has been graded.
  //     // The show the grades.
  //   } else {
  //     text_html += 'You will receive a grade soon.'
  //   }
  // } else {
  //   text_html += 'You will receive a grade soon.'
  // }
}


$('body').on('click', '#btnTestPhase', function(e) {
  let exerciseId = e.target.name;
  let exercise = peerExercisesMap.get(exerciseId);
  localStorage.setItem('exercise', JSON.stringify(exercise));
  document.location.href = 'badkan.html?peerTestExercise=' + exerciseId;
});


$('body').on('click', '#btnSolutionPhase', function(e) {
  let exerciseId = e.target.name;
  let exercise = peerExercisesMap.get(exerciseId);
  localStorage.setItem('exercise', JSON.stringify(exercise));
  document.location.href = 'badkan.html?peerSolutionExercise=' + exerciseId;
});


$('body').on('click', '#btnConflictsPhase', function(e) {
  let exerciseId = e.target.name;
  document.location.href = 'conflicts.html?exercise=' + exerciseId;
});

$('body').on('click', '#dl', function(e) {
  let exerciseId = e.target.name;
  const file = firebase.storage().ref().child(exerciseId);
  file.getDownloadURL()
      .then((url) => {
        window.open(url);
      })
      .catch(function(error) {
        alert('There is no PDF for this exercise!')
      })
});

$('body').on('click', '#solve', function(e) {
  let exerciseId = e.target.name;
  let exercise = exercisesMap.get(exerciseId);
  if (exercise.deadline && exercise.deadline.date) {
    if (isOpen(exercise.deadline)) {
      localStorage.setItem('exercise', JSON.stringify(exercise));
      document.location.href = 'badkan.html?exercise=' + exerciseId;
    } else {
      alert('The deadline for this exercise is over.')
    }
  } else {
    localStorage.setItem('exercise', JSON.stringify(exercise));
    document.location.href = 'badkan.html?exercise=' + exerciseId;
  }
});

$('body').on('click', '#register', function(e) {
  let courseId = e.target.name;
  let course = coursesMap.get(courseId);
  registerSuccess(course, courseId);
});

function registerSuccess(course, courseId) {
  course.students.push(firebase.auth().currentUser.uid);
  editCourse(course, courseId)
  document.location.href = 'home.html';
}