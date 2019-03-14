setTimeout(function() {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert("You're not connected, try to sign in again!");
    document.location.href = "index.html";
  }
}, 3000);
