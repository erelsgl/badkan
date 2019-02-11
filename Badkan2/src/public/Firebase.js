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
  });
}

function writeExercise(name, descr, folderName, userId) {
  // Create the exercise and upload it in the real time database.
  let exercise = new Exercise(name, descr, userId);
  firebase.database().ref("exercises/" + folderName).set({
    exercise
  });
}

function incrementNbExercise(userId, homeUser) {
  homeUser.exerciseNb++;
  writeUserData(homeUser, userId);
}

function loadCurrentUser(userId) {
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var homeUser = snapshot.val().user;
    localStorage.setItem("homeUserKey", JSON.stringify(homeUser));
    document.getElementById("name").innerHTML = "Hello " + homeUser.name  + " " + homeUser.lastName
    + "<br />" + "ID: " + homeUser.id + "<br />" + "Email: " + homeUser.email + "<br />" + 
    "Created exercise(s): " + homeUser.exerciseNb;
    return user;
  });
}

/**
 * @param {*} testCase 
 * @param {*} hiddenTestCase 
 * @param {*} solution 
 */
function uploadExercise(name, descr, testCases, hiddenTestCases, solution) {
  // The ref of the folder must be PK.

  // TODO: Check with Erel what about the other files.
  // TODO FROM LAST COMMIT : finishing to import exercise: 
  // need to speak with erel, then, edit and delete (so need to implement access to exercise), then part III
  var user = firebase.auth().currentUser;
  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var folderName = user.uid + "_" + homeUser.exerciseNb;
  var storageRef = firebase.storage().ref(folderName);
  console.log(testCases.length);
  for (i = 0; i < testCases.length; i++) {
    var testCaseRef = storageRef.child('testCase/'+i);
    testCaseRef.put(testCases[i]).then(function(snapshot) {
      console.log('Uploaded folder!');
      if (i === testCases.length) {
        document.location.href = "home.html";
      }
    })
  }
  incrementNbExercise(user.uid, homeUser);
  writeExercise(name, descr, folderName, user.uid);

}
