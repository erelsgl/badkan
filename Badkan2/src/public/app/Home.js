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
 * BUTTON SETTINGS.
 * Send he user to the settings page.
 */
document.getElementById("btnSettings").addEventListener('click', e => {
  document.location.href = "settings.html";
});

/**
 * BUTTON CREATEEX.
 * Send he user to the createEx page.
 */
document.getElementById("btnCreateEx").addEventListener('click', e => {
  document.location.href = "createEx.html";
});

/**
 * BUTTON LOGOUT.
 * Log out the user and redirect hinm to the register page.
 */
document.getElementById("btnLogOut").addEventListener('click', e=>{
  console.log('logged out')
  firebase.auth().signOut();
  document.location.href = "register.html";
});

