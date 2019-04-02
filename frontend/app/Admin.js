/**
 * Here the current user must be loaded and all the data needed must be loaded in the internal storage.
 * Really important.
 * 
 * 
 * 
 * This page is only for the admin privilege use.
 * You can access it by typing in the url "admin".
 */

/**
 * ON STATE CHANGE.
 * Every time the state of the user is changed, this function is called.
 */
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    var userId = firebase.auth().currentUser.uid;
    loadCurrentUser(userId);  // in file util/Firebase.js
  }
});

/**
 * BUTTON CREATEEX.
 * Send he user to the createEx page.
 */
document.getElementById("btnCreateEx").addEventListener('click', e => {
  document.location.href = "createEx.html";
});

/**
 * BUTTON EDITEX.
 * Send he user to the createEx page.
 */
document.getElementById("btnEditEx").addEventListener('click', e => {
  document.location.href = "myExercises.html";
});

/**
 * BUTTON SOLVEEX.
 * Send he user to the solveEx page.
 */
document.getElementById("btnSolveEx").addEventListener('click', e => {
  document.location.href = "solveEx.html";
});

/**
 * BUTTON RECORDS.
 * Send he user to the records page.
 */
document.getElementById("records").addEventListener('click', e => {
  document.location.href = "records.html";
});

/**
 * BUTTON SETTINGS.
 * Send he user to the settings page.
 */
document.getElementById("btnSettings").addEventListener('click', e => {
  document.location.href = "settings.html";
});

/**
 * BUTTON LOGOUT.
 * Log out the user and redirect hinm to the register page.
 */
document.getElementById("btnLogOut").addEventListener('click', e => {
  console.log('logged out');
  firebase.auth().signOut();
  document.location.href = "index.html";
});
