/**
 * Here the current user must be loaded and all the data needed must be loaded.
 * Really important.
 */

 /**
  * To load the user, we can use his uid given by firebase.
  */

/**
 * ON STATE CHANGE.
 */
firebase.auth().onAuthStateChanged(user=>{ 
  if(user){
    var userId = firebase.auth().currentUser.uid;
    var user = loadCurrentUser(userId);
  }
  else {
    console.log("not user");
  }
});

/**
 * BUTTON SETTINGS.
 * Send he user to the settings page.
 */
document.getElementById("btnSettings").addEventListener('click', e=>{

  console.log("Settings");

  document.location.href = "settings.html";

});
  

