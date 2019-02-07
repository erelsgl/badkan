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

function writeUserData(user, userId) {
  firebase.database().ref("users/" + userId).set({
  user
  });
}