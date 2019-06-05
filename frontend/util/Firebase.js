/**
 * Here are all the function for firebase use.
 */

// Get a reference to the database service
var database = firebase.database();
var storage = firebase.storage();

/**
 * This method upload the user in firebase.
 * @param {user} user 
 * @param {String} userId 
 */
function writeUserData(user, userId) {
  database.ref("users/" + userId).set({
    user
  }).then(function () {
    document.location.href = "home.html";
  });
}

/**
 * This method upload the user on firebase and then submit the form.
 * @param {user} user 
 * @param {String} userId 
 */
function writeUserDataAndSubmit(user, userId) {
  database.ref("users/" + userId).set({
    user
  }).then(function () {
    document.getElementById("form").submit();
    document.location.href = "home.html";
  });
}

/**
 * This method upload the user on firebase and then submit the form.
 * @param {user} user 
 * @param {String} userId 
 */
function writeUserDataAndSubmitCourse(user, userId) {
  database.ref("users/" + userId).set({
    user
  }).then(function () {
    console.log("success")
  });
}

/**
 * This method upload the user in firebase.
 * Note that we're not comming home here.
 * @param {user} user 
 * @param {String} userId 
 */
function writeUserDataWithoutComingHome(user, userId) {
  database.ref("users/" + userId).set({
    user
  });
  localStorage.setItem("homeUserKey", JSON.stringify(user));
}

/**
 * This function upload an exercise.
 * @param {exercise} exercise 
 * @param {String} exerciseId 
 */
function writeExercise(exercise, exerciseId) {
  if (!exercise.deadline) {
    exercise.deadline = null;
  }
  firebase.database().ref("exercises/" + exerciseId).set({
    exercise
  });
}

function writePeerExercise(peerExercise, peerExerciseId) {
  firebase.database().ref("peerExercises/" + peerExerciseId).set({
    peerExercise
  });
}

function editCourse(course, courseId) {
  firebase.database().ref("courses/" + courseId).set({
    course
  }).then(() => {
    json = JSON.stringify({
      target: "edit_course",
    }); // the variable "submission_json" is read in server.py
    simpleWebsocket(json)
  });
}

function writeCourse(course, courseId) {
  firebase.database().ref("courses/" + courseId).set({
    course
  }).then(function () {
    json = JSON.stringify({
      target: "create_course",
    }); // the variable "submission_json" is read in server.py
    simpleWebsocket(json)
  });
}

/**
 * This function remove a course from the database.
 * @param {string} courseId 
 */
function deleteCourseById(courseId) {
  database.ref().child('courses/' + courseId).remove();
  json = JSON.stringify({
    target: "delete_course",
  }); // the variable "submission_json" is read in server.py
  simpleWebsocket(json)
}

/**
 * This function increment the number of created exercise.
 * @param {String} userId 
 * @param {user}homeUser 
 */
function incrementCreatedEx(userId, homeUser) {
  homeUser.createdEx++;
  writeUserData(homeUser, userId);
}

/**
 * This function increment the number of created exercise.
 * @param {String} userId 
 * @param {user}homeUser 
 */
function incrementCreatedExWithoutCommingHome(userId, homeUser) {
  homeUser.createdEx++;
  writeUserDataWithoutComingHome(homeUser, userId);
  localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
}

/**
 * This function increment the number of created exercise.
 * Note that this function submit the form.
 * @param {String} userId 
 * @param {user}homeUser 
 */
function incrementCreatedExAndSubmitCourse(userId, homeUser) {
  homeUser.createdEx++;
  localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
  writeUserDataAndSubmitCourse(homeUser, userId);
}

/**
 * This function increment the number of deleted exercise.
 * @param {String} userId 
 * @param {user}homeUser 
 */
function incrementDeletedEx(userId, homeUser) {
  console.log("increment delete");
  homeUser.deletedEx++;
  writeUserData(homeUser, userId);
}

/**
 * This function increment the number of edited exercise.
 * @param {String} userId 
 * @param {user}homeUser 
 */
function incrementEditEx(userId, homeUser) {
  homeUser.editedEx++;
  writeUserData(homeUser, userId);
}

/**
 * This function increment the number of edited exercise.
 * Note that this function is not bring you at home.
 * @param {String} userId 
 * @param {user}homeUser 
 */
function incrementEditExWithoutCommingHome(userId, homeUser) {
  homeUser.editedEx++;
  writeUserDataWithoutComingHome(homeUser, userId);
}

/**
 * This function downloads the user from the firebase given his id.
 * @param {String} userId 
 */
function loadCurrentUser(userId, onLoaded) {
  database.ref('/users/' + userId).once('value').then(function (snapshot) {
    var data = snapshot.val();
    if (!data || (typeof data === 'undefined')) {
      // User object does not exist
      document.location.href = "completeInfo.html";
    } else {
      // User object exists
      var homeUser = snapshot.val().user;
      localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
      document.getElementById("name").innerHTML =
        "Hello " + homeUser.name + " " + homeUser.lastName + "! <br />" +
        "ID number: " + homeUser.id + "<br />" +
        "Email: " + homeUser.email + "<br />";
      if (homeUser.admin) {
        document.getElementById("name").innerHTML += "You have access to the \"instructor privilege\"."
      }
      if (homeUser.admin) {
        if (homeUser.admin === true) {
          $("#btnManageCourses").show()
        }
      }
      onLoaded(homeUser)
    }
  });
}

function uploadGrade(homeUserId, collab1Id, collab2Id, createSubmission) {
  let collaboratorsId = [homeUserId]
  if (collab1Id != "") {
    collaboratorsId.push(collab1Id)
  }
  if (collab2Id != "") {
    collaboratorsId.push(collab2Id)
  }
  let collaboratorsUid = []
  for (let i = 0; i < collaboratorsId.length; i++) {
    let id = collaboratorsId[i];
    if (id != "") {
      database.ref('/users/').orderByChild("/user/id").equalTo(id).once('value').then(function (snapshot) {
        if (snapshot.val() == null) {
          alert("Please check the collaborator's ids");
          return;
        }
        snapshot.forEach(function (child) {
          collaboratorsUid.push(child.key);
          if (collaboratorsId.length == collaboratorsUid.length) {
            createSubmission(collaboratorsId, collaboratorsUid);
          }
        });
      });
    }
  }
}

function writeSubmission(submission, submissionId) {
  database.ref("submissions/" + submissionId).set({
    submission
  })
}

function pushArraySubmissionIdUserSide(collaboratorUid, submissionId, exerciseId) {
  database.ref("users/" + collaboratorUid + "/user/submissionsId/" + submissionId).set({
    exerciseId
  })
}

function pushArraySubmissionIdExerciseSide(exerciseId, submissionId, collaboratorsId, collaboratorsUid) {
  database.ref("exercises/" + exerciseId + "/exercise/submissionsId/" + submissionId).set({
    collaboratorsId,
    collaboratorsUid
  })
}

/**
 * This function load all the exercise the current user create.
 */
function loadExerciseByOwner(ownExercises) {
  var flag = false;
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      if (data.val().exercise.ownerId === firebase.auth().currentUser.uid) {
        addOption(data.val().exercise, data.key);
        ownExercises.set(data.key, data.val().exercise);
        flag = true;
      }
    });
    loading("div2");
    loading("loading2");
    if (!flag) {
      alert("You didn't create any exercise yet!");
      window.location.href = 'home.html';
    }
  });
}


function loadAllSubmissionsByUserAsync(submissionsArray, submissionsId, onUserSubmissionsLoaded) {
  if (submissionsId) {
    var len = Object.keys(submissionsId).length
    for (let i = 0; i < len; i++) {
      database.ref('/submissions/' + Object.keys(submissionsId)[i]).once('value').then(function (snapshot) {
        submissionsArray.push(snapshot.val().submission);
        if (submissionsArray.length == len) {
          onUserSubmissionsLoaded()
        }
      })
    }
  }
}


/**
 * Load all the courses from Firebase,
 *      filter only the courses owned by the currently authenticated user,
 *      and for each such course, call:
 *          onCourse(key, course)
 * After all courses are read, call onFinish()
 */
function loadCoursesOwnedByCurrentUser(onCourse, onFinish, homeUserForAdmin) {
  database.ref().child('courses/').on("value", function (snapshot) {
    if(!snapshot) {
      finishLoading()
    }
    var numToProcess = snapshot.numChildren()
    //console.log("num courses to process="+numToProcess)
    snapshot.forEach(function (course_data) { // for each course do

      if (course_data.val().course.ownerId === firebase.auth().currentUser.uid ||
        course_data.val().course.grader === homeUserForAdmin.id ||
        firebase.auth().currentUser.uid == "l54uXZrXdrZDTcDb2zMwObhXbxm1") {
        onCourse(course_data.key, course_data.val().course)
      }
      --numToProcess
      if (numToProcess <= 0) { // done all courses
        onFinish();
        finishLoading()
      }
    })
  });
}


// Loads all courses from Firebase,
//    and for each course, call:
//    onCourse(key, course)
//  After all courses are read, call onFinish()
function loadAllCourses(onCourse, onFinish) {
  database.ref().child('courses/').on("value", function (snapshot) {
    var numToProcess = snapshot.numChildren()
    snapshot.forEach(function (data) {
      onCourse(data.key, data.val().course);
      numToProcess--;
      if (numToProcess <= 0) { // done all courses
        onFinish();
      }
    })
  });
}

/**
 * This function load all the exercises of the database.
 */
function loadAllExercisesAsync(exercisesMap) {
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      exercisesMap.set(data.key, data.val().exercise);
    });
  });
}

/**
 * This function load all the peer-to-peer exercises of the database.
 */
function loadAllPeerExercisesAsync(peerExercises) {
  database.ref().child('peerExercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      peerExercises.set(data.key, data.val().peerExercise);
    });
  });
}

/**
 * This function load all the exercises of the database.
 */
function loadAllExercises(onFinish) {
  exercises = new Map()
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      exercises.set(data.key, data.val().exercise);
    });
    onFinish(exercises)
  });
}

function loadAllSubmissionsByExerciseAsync(submissionsArray, submissionsId) {
  if (submissionsId) {
    for (let i = 0; i < Object.keys(submissionsId).length; i++) {
      database.ref('/submissions/' + Object.keys(submissionsId)[i]).once('value').then(function (snapshot) {
        submissionsArray.push(snapshot.val().submission);
      })
    }
  }
}

/**
 * This function load all the exercises of the database.
 */

function loadAllExercisesAndSubmissions(exercisesMap, submissionsArray) {
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      loadAllSubmissionsByExerciseAsync(submissionsArray, data.val().exercise.submissionsId)
      exercisesMap.set(data.key, data.val().exercise);
    })
  });
}

/**
 * This function load all the peer-to-peer exercises of the database.
 */
function loadAllPeerExercises(peerExercisesMap) {
  database.ref().child('peerExercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      peerExercisesMap.set(data.key, data.val().peerExercise);
    });
  });
}

/**
 *     Read from Firebase the data of all users registered to the course,
 *     and for each user, call:
 *         onUser(key, user)
 */
function loadUsersOfCourse(course, onUser) {
  for (var j = 0; j < course.students.length; j++) {
    let current_student = course.students[j]
    if (current_student != "dummyStudentId") {
      database.ref().child('users/' + current_student).once('value').then(
        function (snapshot) {
          onUser(snapshot.key, snapshot.val().user)
        }
      )
    }
  }
}

/**
 * This function remove an exercise from the database.
 * @param {string} exerciseId 
 */
function deleteExerciseById(exerciseId) {
  database.ref().child('exercises/' + exerciseId).remove();
}

/**
 * This function remove an user from the database.
 * @param {string} userId 
 */
function deleteUserById(userId) {
  database.ref().child('users/' + userId).remove();
}


function writeNewReclamationIds(id, peerSolutionExercise, testId, functionName, functionContent) {
  database.ref('/conflicts/' + peerSolutionExercise + "/" + testId + "/" + functionName + "/" + "about").set({
    "content": functionContent
  })
  database.ref('/conflicts/' + peerSolutionExercise + "/" + testId + "/" + functionName + "/ids/" + id).set({
    "reclam": "true"
  }).then( /*document.location.href = "home.html"*/);
}

function getConflictsByUid(exerciseId, uid, addItemToList, noConflicts) {
  let flag = false;
  database.ref('/conflicts/' + exerciseId + "/" + uid).once('value').then(function (snapshot) {
    snapshot.forEach(function (child) {
      if (child.val().ids) {
        flag = true;
        let arr = Object.keys(child.val().ids);
        addItemToList(child.key, arr.length, child.val().about.content)
      }
    })
  }).then(function () {
    if (!flag) {
      noConflicts();
    }
  });
}

function changeReclamation(uid, exerciseId, functionName) {
  database.ref('/conflicts/' + exerciseId + "/" + uid + "/" + functionName).set({
    "deprecated": "true"
  }).then(document.location.href = "conflicts.html?exercise=" + exerciseId);
}

function changeSubmissionGrade(submissionId, newGrade) {
  console.log("connected")
  database.ref("submissions/" + submissionId + "/submission").update({
    grade: newGrade
  });
}