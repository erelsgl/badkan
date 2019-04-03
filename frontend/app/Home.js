/**
 * Here the current user must be loaded and all the data needed must be loaded in the internal storage.
 * Really important.
 */

/**
 * ON STATE CHANGE.
 * Every time the state of the user is changed, this function is called.
 */
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    var userId = firebase.auth().currentUser.uid;
    loadCurrentUser(userId);   // Load current user data to localStorage. in file  util/Firebase.js
  }
});

/**
 * BUTTON SOLVEEX.
 * Send he user to the createEx page.
 */
document.getElementById("btnSolveEx").addEventListener('click', e => {
  document.location.href = "solveEx.html";
});

/**
 * BUTTON RECORDS.
 * Send he user to the createEx page.
 */
document.getElementById("records").addEventListener('click', e => {
  document.location.href = "records.html";
});


document.getElementById("btnManageCourses").addEventListener('click', e => {
  document.location.href = "manageCourses.html";
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
