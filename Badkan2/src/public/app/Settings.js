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

  let currentUser = new User(name, lastName, id, homeUser.email, homeUser.exerciseNb);
  writeUserData(currentUser, user.uid);

  document.location.href = "home.html";

});
