/**
 * BUTTON CONFIRM.
 * Here we first authentificate the user, then we register the user in the
 * realtime database, then, we redirected the user to the home page.
 */
document.getElementById("confirm").addEventListener('click', e => {
  const name = document.getElementById("txtName").value;
  const lastName = document.getElementById("txtLastName").value;
  const id = document.getElementById("txtId").value;
  if (checkEmptyFields([name, lastName, id])) {
    var user = firebase.auth().currentUser;
    let peerExerciseSolved = new PeerGrade("id", 90, 90, "urlTest", "urlSolution");
    let notif = new MyNotification("Welcome to the Badkan, this is your first notification.", false, "home.html")
    let checked = document.getElementById("admin").checked;
    if (!adminPrivilege(checked)) {
      return;
    }
    let currentUser = new User(name, lastName, id, user.email, 0, 0, 0, [],
      [peerExerciseSolved], checked, [notif]);
    writeUserData(currentUser, user.uid);
  }
});