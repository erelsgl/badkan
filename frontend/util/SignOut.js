/**
 * If the page make too much time to be download, it's deconnect the user.
 */
setTimeout(function() {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert("You're not connected, try to sign in again!");
    document.location.href = "index.html";
  }
}, 3000);
