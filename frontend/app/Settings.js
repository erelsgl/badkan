var currentUser = JSON.parse(localStorage.getItem("homeUserKey"));

document.getElementById("txtName").defaultValue = currentUser.name
document.getElementById("txtLastName").defaultValue = currentUser.lastName
document.getElementById("txtId").defaultValue = currentUser.id

/**
 * BUTTON CONFIRM.
 */
document.getElementById("confirm").addEventListener('click', e=>{

  console.log("confirm");

  const name = document.getElementById("txtName").value; 
  const lastName = document.getElementById("txtLastName").value;
  const id = document.getElementById("txtId").value;

  var emptyField = document.getElementById("emptyField");

  if(name === "" || lastName === "" || id === "") {
    emptyField.className = "show";
    setTimeout(function(){ emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  } 

  var user = firebase.auth().currentUser;
  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));

  let currentUser = new User(name, lastName, id, homeUser.email, homeUser.createdEx, 
  homeUser.deletedEx, homeUser.editedEx, homeUser.exerciseSolved);
  writeUserData(currentUser, user.uid);

  document.location.href = "home.html";

});
