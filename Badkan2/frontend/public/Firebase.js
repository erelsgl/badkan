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

function loadCurrentUser(userId) {
  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var user = snapshot.val().user;
    document.getElementById("name").innerHTML = user.name  + " " + user.lastName + " " + user.id + " " + user.email;
    return user;
  });
}

/**
 * TODO: NEED TO FINISH THIS: CHECK THE PROBLEM WHILE UPLAODING MULTIPLE FILES.
 * @param {*} testCase 
 * @param {*} hiddenTestCase 
 * @param {*} solution 
 */
function uploadExercise(testCase, hiddenTestCase, solution) {
  var storageRef = firebase.storage().ref();
  var testCaseRef = storageRef.child('testCase/');

  testCaseRef.put(testCase[0]).then(function(snapshot) {
    console.log('Uploaded folder!');
  })
}
