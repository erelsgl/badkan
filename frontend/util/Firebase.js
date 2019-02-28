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
  });
}

function loadExerciseByOwner() {
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      if (data.val().exercise.ownerId === firebase.auth().currentUser.uid) {
        addOption(data.val().exercise, data.key);
        ownExercises.set(data.key, data.val().exercise);
      }
    });
  });
}

function loadAllExercise() {
  database.ref().child('exercises/').on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      addOption(data.val().exercise, data.key);
      exercises.set(data.key, data.val().exercise);
      onOptionChange();
    });
  });

}

function deleteExerciseById(exerciseId) {
  console.log("here");
  // Need to delete from the realtime database and then from storage.
  database.ref().child('exercises/' + exerciseId).remove();
  // It's currently not possible to delete a folder in the storage firebase, may be an issue but
  // I actually don't implement the deleting in the storage.
  document.location.href = "home.html";
}

