/**
 * Here are all the function for firebase use.
 */

// Get a reference to the database service
var database = firebase.database();
var storage = firebase.storage();

/**
 * This method upload the user in firebase.
 * @param {user} user 
 * @param {string} userId 
 */
function writeUserData(user, userId) {
  database.ref("users/" + userId).set({
    user
  }).then(function() {
    document.location.href = "home.html";
  });
}

/**
 * This method upload the user on firebase and then submit the form.
 * @param {user} user 
 * @param {string} userId 
 */
function writeUserDataAndSubmit(user, userId) {
  database.ref("users/" + userId).set({
    user
  }).then(function() {
    document.getElementById("form").submit();
    document.location.href = "home.html";
  });
}

/**
 * This method upload the user in firebase.
 * Note that we're not comming home here.
 * @param {user} user 
 * @param {string} userId 
 */
function writeUserDataWithoutComingHome(user, userId) {
  database.ref("users/" + userId).set({
    user
  });
}

/**
 * This function upload an exercise.
 * @param {exercise} exercise 
 * @param {string} exerciseId 
 */
function writeExercise(exercise, exerciseId) {
  firebase.database().ref("exercises/" + exerciseId).set({
    exercise
  });
}

/**
 * This function increment the number of created exercise.
 * @param {string} userId 
 * @param {user}homeUser 
 */
function incrementCreatedEx(userId, homeUser) {
  homeUser.createdEx++;
  writeUserData(homeUser, userId);
}

/**
 * This function increment the number of created exercise.
 * Note that this function submit the form.
 * @param {string} userId 
 * @param {user}homeUser 
 */
function incrementCreatedExAndSubmit(userId, homeUser) {
  homeUser.createdEx++;
  writeUserDataAndSubmit(homeUser, userId);
}

/**
 * This function increment the number of deleted exercise.
 * @param {string} userId 
 * @param {user}homeUser 
 */
function incrementDeletedEx(userId, homeUser) {
  console.log("increment delete");
  homeUser.deletedEx++;
  writeUserData(homeUser, userId);
}

/**
 * This function increment the number of edited exercise.
 * @param {string} userId 
 * @param {user}homeUser 
 */
function incrementEditEx(userId, homeUser) {
  homeUser.editedEx++;
  writeUserData(homeUser, userId);
}

/**
 * This function increment the number of edited exercise.
 * Note that this function is not bring you at home.
 * @param {string} userId 
 * @param {user}homeUser 
 */
function incrementEditExWithoutCommingHome(userId, homeUser) {
  homeUser.editedEx++;
  writeUserDataWithoutComingHome(homeUser, userId);
}

/**
 * This function download the user from the firebase given his id.
 * @param {string} userId 
 */
function loadCurrentUser(userId) {
  database.ref('/users/' + userId).once('value').then(function(snapshot) {
    if (!snapshot || !snapshot.val()) {
        // User object does not exist
        document.location.href = "completeInfo.html";
    } else {
        // User object exists
        var homeUser = snapshot.val().user;
        localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
        document.getElementById("name").innerHTML =
            "Hello " + homeUser.name + " " + homeUser.lastName +"! <br />" +
            "ID number: " + homeUser.id + "<br />" +
            "Email: " + homeUser.email + "<br />" +
            "Created exercise(s): " + homeUser.createdEx + "<br />" +
            "Deleted exercise(s): " + homeUser.deletedEx + "<br />" +
            "Edited exercise(s): " + homeUser.editedEx + "<br />" +
            "Solved exercise(s): " + (homeUser.exerciseSolved.length - 1);
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
  database.ref('/users/').orderByChild("/user/id").equalTo(userId).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      let uid = child.key;
      database.ref('/users/' + uid).once('value').then(function(snapshot) {
        let collab1 = snapshot.val().user;
        uploadCollabGrade(grade, collab1, uid);
      });
    });
  });
}

/**
 * This method download any user by is country id.
 * @param {int} id 
 * @param {string} giturl 
 */
function loadUidById(id, giturl) {
  database.ref('/users/').orderByChild("/user/id").equalTo(id).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      let uid = child.key;
      uploadGradeWithOneCollab(grade, uid, giturl)
    });
  });
}

/**
 * This method download two users by their country ids.
 * @param {int} id1 
 * @param {int} id2 
 * @param {string} giturl 
 */
function loadUidByIds(id1, id2, giturl) {
  database.ref('/users/').orderByChild("/user/id").equalTo(id1).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
      let uid1 = child.key;
      database.ref('/users/').orderByChild("/user/id").equalTo(id2).once('value').then(function(snapshot) {
        snapshot.forEach(function(child) {
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
function loadExerciseByOwner() {
  var flag = false;
  database.ref().child('exercises/').on("value", function(snapshot) {
    snapshot.forEach(function(data) {
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

/**
 * This function load all the exercises of the database.
 */
function loadAllExercise() {
  var flag = false;
  database.ref().child('exercises/').on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      addOption(data.val().exercise, data.key);
      exercises.set(data.key, data.val().exercise);
      onOptionChange();
      flag = true;
    });
    loading("div3");
    loading("loading3");
    if (!flag) {
      alert("There is no available exercise!");
      window.location.href = 'home.html';
    }
  });
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
 * This function refresh the historic of the user.
 * @param {int} selectedValue
 * @param {grade} grade
 */
function writeExerciseHistoric(selectedValue, grade) {
  console.log(grade);
  database.ref('exercises/' + selectedValue).once('value').then(function(snapshot) {
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
