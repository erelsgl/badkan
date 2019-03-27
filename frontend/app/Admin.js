/**
 * Here the current user must be loaded and all the data needed must be loaded in the internal storage.
 * Really important.
 */

/**
 * ON STATE CHANGE.
 */
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    var userId = firebase.auth().currentUser.uid;
    loadCurrentUser(userId);
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
  document.location.href = "editDeleteEx.html";
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

/**
 * This function hide the loading circle of active him.
 */
function hideLoading() {
  var x = document.getElementById("loading");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
