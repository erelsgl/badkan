/**
 * Here are all the function for firebase use.
 */

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCLsZO2x5fZQP1woZV0z3WUWaXI_VvMd0M",
  authDomain: "badkan-9d48d.firebaseapp.com",
  databaseURL: "https://badkan-9d48d.firebaseio.com",
  projectId: "badkan-9d48d",
  storageBucket: "badkan-9d48d.appspot.com",
  messagingSenderId: "253448259334"
};
firebase.initializeApp(config);

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

function loadCurrentUser(userId) {
  database.ref('/users/' + userId).once('value').then(function (snapshot) {
    var homeUser = snapshot.val().user;
    localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
    document.getElementById("name").innerHTML = "Hello " + homeUser.name + " " + homeUser.lastName
      + "<br />" + "ID: " + homeUser.id + "<br />" + "Email: " + homeUser.email + "<br />" +
      "Created exercise(s): " + homeUser.createdEx + "<br />" + "Deleted exercise(s): " + homeUser.deletedEx
      + "<br />" + "Edited exercise(s): " + homeUser.editedEx + "<br />" + "Solved exercise(s): " +
      (homeUser.exerciseSolved.length - 1);
    loading("div1");
    loading("loading");
  });
}

/**
 * TODO: no need local storage so change this.
 * finish here.
 * @param {*} userId 
 * @param {*} grade 
 */
function loadCollabById(userId, grade) {
  database.ref('/users/').orderByChild("/user/id").equalTo(userId).once('value').then(function (snapshot) {
    snapshot.forEach(function(child) {
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
  // Need to delete from the realtime database.
  database.ref().child('exercises/' + exerciseId).remove();
}

