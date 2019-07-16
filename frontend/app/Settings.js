var homeUser = JSON.parse(localStorage.getItem("homeUser"));
var uid = JSON.parse(localStorage.getItem("homeUserId"));

document.getElementById("txtName").defaultValue = homeUser.name
document.getElementById("txtLastName").defaultValue = homeUser.lastName
document.getElementById("txtId").defaultValue = homeUser.id

if (homeUser.admin === true) {
  document.getElementById("admin").style.display = "none";
  document.getElementById("text").innerHTML = "You already admin";
}


/**
 * BUTTON CONFIRM.
 */
document.getElementById("confirm").addEventListener('click', e => {
  const name = escapeHtml(document.getElementById("txtName").value);
  const lastName = escapeHtml(document.getElementById("txtLastName").value);
  const id = escapeHtml(document.getElementById("txtId").value);
  let checked = homeUser.admin;
  if (checkEmptyFields([name, lastName, id])) {
    if (!checked) {
      const checked = document.getElementById("admin").checked;
      if (!adminPrivilege(checked)) {
        return;
      }
    }
    if (!homeUser.peerExerciseSolved) {
      homeUser.peerExerciseSolved = [new PeerGrade("id", 90, 90, "urlTest", "urlSolution")];
    }
    if (!homeUser.notif) {
      homeUser.notif = [new MyNotification("Welcome to the Badkan, this is your first notification.", false, "home.html")];
    }
    let newUser = new User(name, lastName, id, homeUser.email, homeUser.createdEx,
      homeUser.deletedEx, homeUser.editedEx, homeUser.submissionsId,
      homeUser.peerExerciseSolved, checked, homeUser.notif);
    writeUserData(newUser, uid);
  }
});

/**
 * BUTTON DELETE ACCOUNT.
 */
document.getElementById("deleteAc").addEventListener('click', e => {
  if (confirm("Are you sure? All your data will be deleted.")) {
    let user = firebase.auth().currentUser
    user.delete().catch(function (error) {
      alert(error.message);
      return;
    }).then(function () {
      deleteUserByIdAndGoIndex(user.uid);
    });
  }
});