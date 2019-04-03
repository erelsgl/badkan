var currentUser = JSON.parse(localStorage.getItem("homeUserKey"));
document.getElementById("txtName").defaultValue = currentUser.name
document.getElementById("txtLastName").defaultValue = currentUser.lastName
document.getElementById("txtId").defaultValue = currentUser.id

/**
 * BUTTON CONFIRM.
 */
document.getElementById("confirm").addEventListener('click', e => {
  const name = escapeHtml(document.getElementById("txtName").value);
  const lastName = escapeHtml(document.getElementById("txtLastName").value);
  const id = escapeHtml(document.getElementById("txtId").value);
  if (checkEmptyFields(name, lastName, id)) {
    var user = firebase.auth().currentUser;
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    let currentUser = new User(name, lastName, id, homeUser.email, homeUser.createdEx,
      homeUser.deletedEx, homeUser.editedEx, homeUser.exerciseSolved, homeUser.myCourses);
    writeUserData(currentUser, user.uid);
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
