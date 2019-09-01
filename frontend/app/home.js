$('a[href="#mycourses"]').click(function () {
  showMyCourses()
});

$('a[href="#public"]').click(function () {
  showPublic()
});

function showPublic() {
  $('a[href="#mycourses"]').removeClass("current");
  $('a[href="#public"]').addClass("current");
  $(".public").show()
  $(".myCourse").hide()
}

function showMyCourses() {
  $('a[href="#public"]').removeClass("current");
  $('a[href="#mycourses"]').addClass("current");
  $(".myCourse").show()
  $(".public").hide()
}

function onLoadMain() {
  // TODO: Make this part much more secure...
  if (userDetails.instructor == "False") {
    $("#becomeInstructor").show()
  } else {
    $("#instructorZone").show()
  }
  doPostJSON("", "get_courses_and_exercises/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
  // TODO: make the first active at the beginning.
  if (data.courses) {
    for (let course of data.courses[0]) {
      createAccordionHome(course, "myCourse"); // myCourse
    }
    for (let course of data.courses[1]) {
      createAccordionHome(course, "public"); // public
    }
  }
  $('#main').show();
  showPublic()
}

function registeringToCourse(courseId) {
  doPostJSON(null, "registering_to_course/" + courseId + "/" + userUid, "text", reloadHome)
  $("#main").hide()
}

function reloadHome() {
  document.location.reload();
}

function solveExercise(exerciseId) {
  document.location.href = 'badkan.html?exercise=' + exerciseId;
}

// var $template = $('.template');
// let hash = 2;

// var numRegistered = 0,
//   numUnregistered = 0

// var exercisesMap = new Map();
// var peerExercisesMap = new Map();
// var submissionsArray = []

// /**
//  * ON STATE CHANGE.
//  * Every time the state of the user is changed, this function is called.
//  */
// firebase.auth().onAuthStateChanged(authUser => {
//   localStorage.clear()
//   /*** This code runs if there is a logged-in user. ***/
//   if (authUser) {
//     var userId = authUser.uid
//     // For the next pages
//     localStorage.setItem('homeUserId', JSON.stringify(userId))
//     // For the Home page.
//     window.uid = userId;
//     loadCurrentUser(userId, (homeUser) => {   // in utils/Firebase.js

//       document.getElementById("name").innerHTML =
//         "Hello " + homeUser.name + " " + homeUser.lastName + "! <br />" +
//         "ID number: " + homeUser.id + "<br />" +
//         "Email: " + homeUser.email + "<br />";
//       if (homeUser.admin) {
//         if (homeUser.admin === true) {
//           document.getElementById("name").innerHTML += "You have access to the \"instructor privilege\"."
//           $("#btnManageCourses").show()
//         }
//       }

//       // For the next pages
//       localStorage.setItem('homeUser', JSON.stringify(homeUser))
//       // For the Home page.
//       window.homeUser = homeUser;

//       if (exercisesObject) {  // defined in file data/exercises.js
//         // synchronous
//         for (key in exercisesObject) {
//           exercisesMap.set(key, exercisesObject[key].exercise)
//         }
//       } else {
//         alert("Exercises object not found - please try again or contact the programmer")
//         finishLoading()  // defined in util/Loading.js
//       }
//       loadAllPeerExercisesAsync(peerExercisesMap); // TODO: Change this like the "exercises" above.
//       loadAllSubmissionsByUserAsync(submissionsArray, homeUser.submissionsId, () => {
//         if (coursesObject) {  // defined in file data/courses.js
//           // synchronous
//           for (key in coursesObject) {
//             course = coursesObject[key].course
//             addCourseHTML(key, course)
//           }

//           // on all courses loaded:
//           if (numUnregistered == 0) {
//             $('#accordion-unregistered').append('<p>No other courses!</p>');
//           }
//           if (numRegistered == 0) {
//             $('#accordion-registered')
//               .append('<p>You are not registered to any course yet!</p>');
//           }

//           // Finally, stop the loading
//           finishLoading()
//    try to sign in again!
//    try to sign in again!found - please try again or contact the programmer")
//    try to sign in again!
//    try to sign in again!
//    try to sign in again!
//    try to sign in again!
//   }try to sign in again!
//   /*** This code runs if there is NO logged-in user. ***/
//   else {
//     alert("You're not connected, try to sign in again!")
//     document.location.href = "index.html"
//   }
// })

// function addCourseHTML(key, course) {
//   //  First see if course if private or not:
//   if (course.ids) {
//     // The course is private
//     let arrayIds = course.ids.split(' ')
//     if (arrayIds.includes(window.homeUser.id)) {
//       if (isRegistered(course)) {
//         numRegistered++;
//         showRegisteredCourse(course);
//       } else {
//         let courseId = key;
//         registerSuccess(course, courseId);
//       }
//     }
//   } else {
//     // The course is public
//     if (isRegistered(course)) {
//       numRegistered++;
//       showRegisteredCourse(course)
//     } else {
//       numUnregistered++;
//       showUnregisteredCourse(key, course);
//     }
//   }
// }


// function isRegistered(course) {
//   if (course.students.indexOf(window.uid) > -1) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function registerSuccess(course, courseId) {
//   course.students.push(window.uid);
//   editCourse(course, courseId, "home.html")
// }

// // Show a course to which the current user is not registered.
// function showUnregisteredCourse(key, course) {
//   var $newPanel = $template.clone();
//   $newPanel.find('.collapse').removeClass('in');
//   $newPanel.find('.accordion-toggle')
//     .attr('href', '#' + (hash))
//     .text(course.name);
//   $newPanel.find('.panel-collapse')
//     .attr('id', hash++)
//     .addClass('collapse')
//     .removeClass('in');
//   $newPanel.find('.panel-body').text('')
//   text_html = '';
//   text_html += '<button name ="' + key +
//     '" id="register" class="btn btn-success"">Register to ' + course.name +
//     '</button>';
//   if (course.exercises.length === 1 &&
//     course.exercises[0] === 'dummyExerciseId') {
//     text_html += '<p>There are no available exercises for this course!</p>'
//   } else {
//     text_html += '<h3>Exercises in ' + course.name + '</h3>'
//     for (var i = 0; i < course.exercises.length; i++) {
//       if (course.exercises[i] != 'dummyExerciseId') {
//         let exerciseObj = exercisesMap.get(course.exercises[i]);
//         let peerExerciseObj = peerExercisesMap.get(course.exercises[i]);
//         if (exerciseObj) {
//           text_html += '<div class=\'exercise\'>'
//           text_html += '<h4>' + exerciseObj.name + '</h4>';
//           text_html += '<p>' + exerciseObj.description + '</p>';
//           if (exerciseObj.deadline && exerciseObj.deadline.date) {
//             text_html += '<br />';
//             text_html +=
//               'Exercise deadline: ' + exerciseObj.deadline.date + '<br />';
//             let penalities = exerciseObj.deadline.penalities;
//             if (penalities) {
//               text_html += '<strong> Penalties </strong>: <br />';
//               for (var p = 0; p < penalities.length; p++) {
//                 text_html += 'Submitted with ' + penalities[p].late +
//                   ' day(s) late is penalized with ' + penalities[p].point +
//                   ' point(s)' +
//                   '<br />';
//               }
//             }
//           }
//           text_html += '</div><!--exercise-->'
//         }

//         if (peerExerciseObj) {
//           text_html += '<div class=\'exercise\'>'
//           text_html += '<h4>' +
//             '<span class="glyphicon glyphicon-transfer"></span>  ' +
//             peerExerciseObj.name +
//             '  <span class="glyphicon glyphicon-transfer"></span>' +
//             '</h4>';
//           text_html += '<p>' + peerExerciseObj.description + '</p>';
//           text_html +=
//             'Test deadline: ' + peerExerciseObj.deadlineTest + '<br />';
//           text_html +=
//             'Solution deadline: ' + peerExerciseObj.deadlineSolution +
//             '<br />';
//           text_html +=
//             'Conflicts deadline: ' + peerExerciseObj.deadlineConflicts +
//             '<br />';
//           text_html += '</div><!--exercise-->'
//         }
//       }
//     }
//   }
//   $newPanel.find('.panel-body').append(text_html);
//   $('#accordion-unregistered').append($newPanel.fadeIn());
// }

// // Show a course to which the current user is registered.
// function showRegisteredCourse(course) {
//   var $newPanel = $template.clone();
//   $newPanel.find('.collapse').removeClass('in');
//   $newPanel.find('.accordion-toggle')
//     .attr('href', '#' + (hash))
//     .text(course.name);
//   $newPanel.find('.panel-collapse')
//     .attr('id', hash++)
//     .addClass('collapse')
//     .removeClass('in');
//   $newPanel.find('.panel-body').text('')
//   text_html = '';
//   if (!course.exercises) {
//     text_html += '<h5>There are no available exercises for this course!</h5>'
//   } else {
//     text_html += '<h3>Exercises in ' + course.name + '</h3>'
//     for (var i = 0; i < course.exercises.length; i++) {
//       let exerciseId = course.exercises[i];
//       let exerciseObj = exercisesMap.get(exerciseId);
//       if (exerciseObj) {
//         text_html += htmlOfExerciseInRegisteredCourse(exerciseId, exerciseObj)
//       }
//       let peerExerciseObj = peerExercisesMap.get(exerciseId);
//       if (peerExerciseObj) {
//         text_html += htmlOfPeerExerciseInRegisteredCourse(exerciseId, peerExerciseObj)
//       }
//     }
//   }
//   $newPanel.find('.panel-body').append(text_html);
//   $('#accordion-registered').append($newPanel.fadeIn());
// }

// function solveButton(exerciseId) {
//   return '<button name ="' + exerciseId + '" class="btn btn-success btn-solve">Solve</button>';
// }

// function htmlOfExerciseInRegisteredCourse(exerciseId, exerciseObj) {
//   text_html = ''
//   text_html += '<div class=\'exercise\'>'
//   text_html += '<h4>' + exerciseObj.name + '</h4>';
//   text_html += '<p>' + exerciseObj.description + '</p>';
//   if (exerciseObj.example === 'PDF') {
//     text_html += '<button name ="' + exerciseId +
//       '" id="dl" class="btn btn-link"">Download PDF</button>';
//     text_html += '<br /> <br />'
//   }

//   if (exerciseObj.deadline && exerciseObj.deadline.date) {
//     text_html += '<br />';
//     text_html +=
//       'Exercise deadline: ' + exerciseObj.deadline.date + '<br />';

//     let penalities = exerciseObj.deadline.penalities;

//     if (penalities) {
//       text_html += '<strong> Penalties </strong>: <br />';
//       for (var p = 0; p < penalities.length; p++) {
//         text_html += 'Submitted with ' + penalities[p].late +
//           ' day(s) late is penalized with ' + penalities[p].point +
//           ' point(s)' +
//           '<br />';
//       }
//     }
//   }
//   let grade = -1;
//   if (submissionsArray) {
//     for (value of submissionsArray) {
//       if (value.exerciseId === exerciseId) {
//         grade = parseInt(value.grade)
//         text_html += '<pre>For the submission with the id(s): ' + value.collaboratorsId + '. <br />';
//         text_html += 'Your current grade is: <strong> <font color="dc2f0a">' + grade + '</font></strong>. <br />';
//         text_html += 'Submitted on: ' + value.timestamp + '. </pre>';
//       }
//     }
//   }
//   text_html += '<p>';
//   if (grade === -1) {
//     text_html += 'You have not solved this exercise yet. ';
//   }
//   text_html += solveButton(exerciseId);
//   text_html += '</p>';
//   text_html += '</div><!--exercise-->'
//   return text_html
// }


// function htmlOfPeerExerciseInRegisteredCourse(exerciseId, peerExerciseObj) {
//   text_html = ''
//   text_html += '<div class=\'exercise\'>'
//   text_html += '<h4>' +
//     '<span class="glyphicon glyphicon-transfer"></span>  ' +
//     peerExerciseObj.name +
//     '  <span class="glyphicon glyphicon-transfer"></span>' +
//     '</h4>';

//   text_html += '<p>' + peerExerciseObj.description + '</p>';
//   text_html += '<button name ="' + exerciseId +
//     '" id="dl" class="btn btn-link"">Download PDF</button>';
//   text_html += '<br /> <br />'


//   text_html +=
//     'Test deadline: ' + peerExerciseObj.deadlineTest + '<br />';
//   text_html +=
//     'Solution deadline: ' + peerExerciseObj.deadlineSolution +
//     '<br />';
//   text_html +=
//     'Conflicts deadline: ' + peerExerciseObj.deadlineConflicts +
//     '<br />';

//   text_html +=
//     'Test language: ' + peerExerciseObj.compilerTest + '<br />';
//   text_html +=
//     'Solution language: ' + peerExerciseObj.compilerSolution +
//     '<br />';

//   let phase = whichPhase(peerExerciseObj);
//   text_html += '<h5><strong>' + phase + ':</strong></h5>'

//   switch (phase) {
//     case 'Test Phase':
//       testPhase(peerExerciseObj, exerciseId);
//       break;
//     case 'Solution Phase':
//       solutionPhase(peerExerciseObj, exerciseId);
//       break;
//     case 'Conflicts Phase':
//       conflictsPhase(exerciseId);
//       break;
//     default:
//       endGame(exerciseId);
//   }

//   text_html += '</p>';
//   text_html += '</div><!--exercise-->'
//   return text_html
// }

// /*
//  * @param {int} minTest
//  * @param {map} signatureMap
//  */
// function testPhase(peerExerciseObj, exerciseId) {
//   text_html += 'You need to implement at least : ' + peerExerciseObj.minTest +
//     ' tests.' +
//     '<br />';
//   text_html += 'Here is the list of the function you have to test: <br />';
//   for (let sign of peerExerciseObj.signatureMap) {
//     text_html += 'The function signature is: <strong>' + sign.func +
//       '</strong> -> The class where the function reside is: <strong>' +
//       sign.cla + '</strong> <br />';
//   }
//   text_html += '<button name ="' + exerciseId +
//     '" id="btnTestPhase" class="btn btn-primary"">Submit test</button>';
// }

// /*
//  * @param {map} signatureMap
//  */
// function solutionPhase(peerExerciseObj, exerciseId) {
//   text_html +=
//     'Here is the list of the function you have to implements: <br />';
//   for (let sign of peerExerciseObj.signatureMap) {
//     text_html += 'The function signature is: <strong>' + sign.func +
//       '</strong> -> The class where the function reside is: <strong>' +
//       sign.cla + '</strong> <br />';
//   }

//   text_html += '<button name ="' + exerciseId +
//     '" id="btnSolutionPhase" class="btn btn-success"">Submit Solution</button>';
// }

// function conflictsPhase(exerciseId) {
//   text_html += '<button name ="' + exerciseId +
//     '" id="btnConflictsPhase" class="btn btn-danger"">Check for conflicts</button>';
// }

// /* @param {Object} peerGrades // exerciseObject we created with the grades. */
// // TODO: Fix the bug includes notexercise fun
// function endGame(exerciseId) {
//   // if (homeUser.peerExerciseSolved) {
//   //   if (homeUser.peerExerciseSolved.includes(exerciseId)) {
//   //     // The user has been graded.
//   //     // The show the grades.
//   //   } else {
//   //     text_html += 'You will receive a grade soon.'
//   //   }
//   // } else {
//   //   text_html += 'You will receive a grade soon.'
//   // }
// }

// // /**
// //  * BUTTON MANAGE COURSE.
// //  * Send he user to the manage course page.
// //  */
// // document.getElementById('btnManageCourses').addEventListener('click', e => {
// //   document.location.href = 'manageCourses.html';
// // });


// $('body').on('click', '#btnTestPhase', function (e) {
//   let exerciseId = e.target.name;
//   let exercise = peerExercisesMap.get(exerciseId);
//   localStorage.setItem('exercise', JSON.stringify(exercise));
//   document.location.href = 'badkan.html?peerTestExercise=' + exerciseId;
// });


// $('body').on('click', '#btnSolutionPhase', function (e) {
//   let exerciseId = e.target.name;
//   let exercise = peerExercisesMap.get(exerciseId);
//   localStorage.setItem('exercise', JSON.stringify(exercise));
//   document.location.href = 'badkan.html?peerSolutionExercise=' + exerciseId;
// });


// $('body').on('click', '#btnConflictsPhase', function (e) {
//   let exerciseId = e.target.name;
//   document.location.href = 'conflicts.html?exercise=' + exerciseId;
// });

// $('body').on('click', '#dl', function (e) {
//   let exerciseId = e.target.name;
//   const file = firebase.storage().ref().child(exerciseId);
//   file.getDownloadURL()
//     .then((url) => {
//       window.open(url);
//     })
//     .catch(function (error) {
//       alert('There is no PDF for this exercise!')
//     })
// });

// $('body').on('click', '.btn-solve', function (e) {
//   let exerciseId = e.target.name;
//   let exercise = exercisesMap.get(exerciseId);
//   if (exercise.deadline && exercise.deadline.date) {
//     if (isOpen(exercise.deadline)) {
//       localStorage.setItem('exercise', JSON.stringify(exercise));
//       document.location.href = 'badkan.html?exercise=' + exerciseId;
//     } else {
//       alert('The deadline for this exercise is over.')
//     }
//   } else {
//     localStorage.setItem('exercise', JSON.stringify(exercise));
//     document.location.href = 'badkan.html?exercise=' + exerciseId;
//   }
// });

// $('body').on('click', '#register', function (e) {
//   onLoading();
//   let courseId = e.target.name;
//   let course = coursesObject[courseId].course;
//   registerSuccess(course, courseId);
// });