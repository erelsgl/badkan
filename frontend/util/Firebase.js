/**
 * Here are all the function for firebase use.
 */



// Get a reference to the database service
var database = firebase.database();
var storage = firebase.storage();

function writeUserData(user, userId) {
  database.ref("users/" + userId).set({
    user
  }).then(function () {
    document.location.href = "home.html";
  });
}

function writeUserDataAndSubmit(user, userId) {
  database.ref("users/" + userId).set({
    user
  }).then(function () {
    document.getElementById("form").submit();
    document.location.href = "home.html";
  });
}

function writeUserDataWithoutComingHome(user, userId) {
  database.ref("users/" + userId).set({
    user
  });
}

function writeExercise(exercise, exerciseId) {
  firebase.database().ref("exercises/" + exerciseId).set({
    exercise
  });
}

function incrementCreatedEx(userId, homeUser) {
  homeUser.createdEx++;
  writeUserData(homeUser, userId);
}

function incrementCreatedExAndSubmit(userId, homeUser) {
  homeUser.createdEx++;
  writeUserDataAndSubmit(homeUser, userId);
}

function incrementDeletedEx(userId, homeUser) {
  console.log("increment delete");
  homeUser.deletedEx++;
  writeUserData(homeUser, userId);
}

function incrementEditEx(userId, homeUser) {
  homeUser.editedEx++;
  writeUserData(homeUser, userId);
}

function incrementEditExWithoutCommingHome(userId, homeUser) {
  homeUser.editedEx++;
  writeUserDataWithoutComingHome(homeUser, userId);
}

function loadCurrentUser(userId) {
  database.ref('/users/' + userId).once('value').then(function (snapshot) {
    var homeUser = snapshot.val().user;
    localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
    document.getElementById("name").innerHTML = "Hello " + homeUser.name + " " + homeUser.lastName
      + "! <br />" + "ID number: " + homeUser.id + "<br />" + "Email: " + homeUser.email + "<br />" +
      "Created exercise(s): " + homeUser.createdEx + "<br />" + "Deleted exercise(s): " + homeUser.deletedEx
      + "<br />" + "Edited exercise(s): " + homeUser.editedEx + "<br />" + "Solved exercise(s): " +
      (homeUser.exerciseSolved.length - 1);
    loading("div1");
    loading("loading");
  });
}

/**
 * @param {*} userId 342533064
 * @param {*} grade
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

function loadExerciseByOwner() {
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

function loadAllExercise() {
  var flag = false;
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
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

function deleteExerciseById(exerciseId) {
  database.ref().child('exercises/' + exerciseId).remove();
}

function deleteUserById(userId) {
  database.ref().child('users/' + userId).remove();
}

function deleteAuthById() {
  firebase.auth().currentUser.delete();
}

/**
 *
 * @param {*} selectedValue
 * @param {*} grade
 */
function writeExerciseHistoric(selectedValue, grade) {
  database.ref('exercises/' + selectedValue).once('value').then(function (snapshot) {
    var exercise = snapshot.val().exercise;
    for (var i = 0; i < grade.length; i++) {
      let index = checkIfIdExist(exercise, grade[i].id);
      if (index != -1) {
        exercise.grades.gradeObj[index]= grade[i];
      }
      else {
        exercise.grades.gradeObj.push(grade[i]);
      }
    }
    firebase.database().ref("exercises/" + selectedValue).set({
      exercise
    });
  });
}

function checkIfIdExist(exercise, id) {
  for (var i = 1; i < exercise.grades.gradeObj.length; i++) {
    if (exercise.grades.gradeObj[i].id === id) {
      return i;
    }
  }
  return -1;
}
