var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
document.getElementById("txtName").defaultValue = homeUser.name
document.getElementById("txtLastName").defaultValue = homeUser.lastName
document.getElementById("txtId").defaultValue = homeUser.id

var flagAlreadyAdmin = false;

if (homeUser.admin === true) {
  document.getElementById("admin").style.display = "none";
  document.getElementById("text").innerHTML = "You already admin";
  flagAlreadyAdmin = true;
}

/**
 * BUTTON CONFIRM.
 */
document.getElementById("confirm").addEventListener('click', e => {
  const name = escapeHtml(document.getElementById("txtName").value);
  const lastName = escapeHtml(document.getElementById("txtLastName").value);
  const id = escapeHtml(document.getElementById("txtId").value);
  if (checkEmptyFields(name, lastName, id)) {
    let checked = document.getElementById("admin").checked;
    var user = firebase.auth().currentUser;
    if (!flagAlreadyAdmin) {
      if (checked) {
        var response = prompt("Please enter the password to get admin privilege:");
        if (response === "3ubf2e9-cb") {
          //success 
        } else {
          alert("wrong password");
          return;
        }
      }
    } else {
      checked = true;
    }
    if (!homeUser.peerExerciseSolved) {
      homeUser.peerExerciseSolved = [new PeerGrade("id", 90, 90, "urlTest", "urlSolution")];
    }
    if (!homeUser.notif) {
      homeUser.notif = [new Notification("Welcome to the Badkan, this is your first notification.", false)];
    }
    let newUser = new User(name, lastName, id, homeUser.email, homeUser.createdEx,
      homeUser.deletedEx, homeUser.editedEx, homeUser.exerciseSolved,
      homeUser.peerExerciseSolved, checked, homeUser.notif);
    writeUserData(newUser, user.uid);
    document.location.href = "home.html";
  }
});

function checkEmptyFields(name, lastName, id) {
  var emptyField = document.getElementById("emptyField");
  if (name === "" || lastName === "" || id === "") {
    emptyField.className = "show";
    setTimeout(function () {
      emptyField.className = emptyField.className.replace("show", "");
    }, 2500);
    return false;
  }
  return true;
}

/**
 * BUTTON DELETE ACCOUNT.
 */
document.getElementById("deleteAc").addEventListener('click', e => {
  if (confirm("Are you sure? All your data will be deleted.")) {
    var user = firebase.auth().currentUser
    user.delete().catch(function (error) {
      console.log(error.message);
      alert(error.message);
      return;
    }).then(function () {
      deleteUserById(user.uid);
      document.location.href = "index.html";
    });
  }
});