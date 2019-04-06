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
    document.getElementById("form").submit();
    document.location.href = "manageCourses.html";
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
}

/**
 * This function upload an exercise.
 * @param {exercise} exercise 
 * @param {String} exerciseId 
 */
function writeExercise(exercise, exerciseId) {
  firebase.database().ref("exercises/" + exerciseId).set({
    exercise
  });
}

function editCourse(course, courseId) {
  firebase.database().ref("courses/" + courseId).set({
    course
  });
}

function writeCourse(course, courseId) {
  firebase.database().ref("courses/" + courseId).set({
    course
  }).then(function () {
    document.getElementById("form").submit();
    document.location.href = "manageCourses.html";
  });
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
function loadCurrentUser(userId) {
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
      loading("div1");
      loading("loading");
    }
  });
}

/**
 * This function load the collab.
 * @param {int} userId 342533064
 * @param {grade} grade
 */
function loadCollabById(userId, grade) {
  database.ref('/users/').orderByChild("/user/id").equalTo(userId).once('value').then(function (snapshot) {
    snapshot.forEach(function (child) {
      let uid = child.key;
      database.ref('/users/' + uid).once('value').then(function (snapshot) {
        let collab1 = snapshot.val().user;
        uploadCollabGrade(grade, collab1, uid);
      });
    });
  });
}

/**
 * This method download any user by is country id.
 * @param {int} id 
 * @param {String} giturl 
 */
function loadUidById(id, giturl) {
  database.ref('/users/').orderByChild("/user/id").equalTo(id).once('value').then(function (snapshot) {
    snapshot.forEach(function (child) {
      let uid = child.key;
      uploadGradeWithOneCollab(grade, uid, giturl)
    });
  });
}

/**
 * This method download two users by their country ids.
 * @param {int} id1 
 * @param {int} id2 
 * @param {String} giturl 
 */
function loadUidByIds(id1, id2, giturl) {
  database.ref('/users/').orderByChild("/user/id").equalTo(id1).once('value').then(function (snapshot) {
    snapshot.forEach(function (child) {
      let uid1 = child.key;
      database.ref('/users/').orderByChild("/user/id").equalTo(id2).once('value').then(function (snapshot) {
        snapshot.forEach(function (child) {
          let uid2 = child.key;
          uploadGradeWithTwoCollab(grade, uid1, uid2, giturl);
        });
      });
    });
  });
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

function loadCoursesByOwner() {
  database.ref().child('courses/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      if (data.val().course.ownerId === firebase.auth().currentUser.uid) {
        addCourseHTML(data.key, data.val().course)
      }
    })
  });
}

function loadAllCourses() {
  database.ref().child('courses/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      addAllCoursesHTML(data.key, data.val().course);
    })
  });
}

/**
 * This function load all the exercises of the database.
 */
function loadAllExercisesAsync(exercises) {
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      exercises.set(data.key, data.val().exercise);
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

/**
 * This function load all the exercises of the database.
 */
function loadAllExercisesAndAddOptions(exercisesMap) {
  var flag = false;
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      addOption(data.val().exercise, data.key);  // defined in SolveEx.js and in EditDeleteEx.js
      exercisesMap.set(data.key, data.val().exercise);
      onOptionChange();      // defined in SolveEx.js
      flag = true;
    });
    loading("div3");
    loading("loading3");
  });
}

function loadUserByOwner(usersMap, coursesMap) {
  for (let pair of coursesMap) {
    let key = pair[0];
    let value = pair[1]
    for (var j = 0; j < value.students.length; j++) {
      if (value.students[j] != "dummyStudentId") {
        database.ref().child('users/' + value.students[j]).once('value').then(function (snapshot) {
          usersMap.set(snapshot.key, snapshot.val().user);
        })
      }
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

/**
 * This function remove a course from the database.
 * @param {string} courseId 
 */
function deleteCourseById(courseId) {
  database.ref().child('courses/' + courseId).remove();
}

/**
 * This function refresh the historic of the user.
 * @param {int} selectedValue
 * @param {grade} grade
 */
function writeExerciseHistoric(selectedValue, grade) {
  database.ref('exercises/' + selectedValue).once('value').then(function (snapshot) {
    var exercise = snapshot.val().exercise;
    for (var i = 0; i < grade.length; i++) {
      let index = checkIfIdExist(exercise, grade[i].id);
      if (index != -1) {
        exercise.grades.gradeObj[index] = grade[i];
      } else {
        exercise.grades.gradeObj.push(grade[i]);
      }
    }
    firebase.database().ref("exercises/" + selectedValue).set({
      exercise
    });
  });
}

/**
 * This function check if the id country exist or not in the database.
 * @param {exercise} exercise 
 * @param {int} id 
 */
function checkIfIdExist(exercise, id) {
  for (var i = 1; i < exercise.grades.gradeObj.length; i++) {
    if (exercise.grades.gradeObj[i].id === id) {
      return i;
    }
  }
  return -1;
}
