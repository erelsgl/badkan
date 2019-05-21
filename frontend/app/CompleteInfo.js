/**
 * BUTTON CONFIRM.
 * Here we first authentificate the user, then we register the user in the
 * realtime database, then, we redirected the user to the home page.
 */
document.getElementById("confirm").addEventListener('click', e => {
  const name = document.getElementById("txtName").value;
  const lastName = document.getElementById("txtLastName").value;
  const id = document.getElementById("txtId").value;
  if (checkEmptyFields(name, lastName, id)) {
    var user = firebase.auth().currentUser;
    let exerciseSolved = new ExerciseSolved(90, "id");
    let peerExerciseSolved = new PeerGrade("id", 90, 90, "urlTest", "urlSolution");
    let notif = new Notification("Welcome to the Badkan, this is your first notification.", false)
    let checked = document.getElementById("admin").checked;
    if (checked) {
      var response = prompt("Please enter the password to get admin privilege:");
      if (response === "3ubf2e9-cb") {
        //success 
      } else {
        alert("wrong password");
        return;
      }
    }
    let currentUser = new User(name, lastName, id, user.email, 0, 0, 0, [exerciseSolved], 
      [peerExerciseSolved], checked, [notif]);
    writeUserData(currentUser, user.uid);
    document.location.href = "home.html";
  }
});

/**
 * This method check that all the field are filed.
 * @param {String} name 
 * @param {String} lastName 
 * @param {Stirng} id 
 */
function checkEmptyFields(name, lastName, id) {
  var emptyField = document.getElementById("emptyField");
  if (name === "" || lastName === "" || id === "") {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return false;
  }
  return true;
}