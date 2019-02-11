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
  firebase.database().ref("users/" + userId).set({
    user
  }).then(function() {
    document.location.href = "home.html";
  });
}

function writeExercise(exercise, exerciseId) {
  firebase.database().ref("exercises/" + exerciseId).set({
    exercise
  });
}

function incrementNbExercise(userId, homeUser) {
  homeUser.exerciseNb++;
  writeUserData(homeUser, userId);
}

function loadCurrentUser(userId) {
  firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
    var homeUser = snapshot.val().user;
    localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
    document.getElementById("name").innerHTML = "Hello " + homeUser.name + " " + homeUser.lastName
      + "<br />" + "ID: " + homeUser.id + "<br />" + "Email: " + homeUser.email + "<br />" +
      "Created exercise(s): " + homeUser.exerciseNb;
  });
}

