/**
 * This js file is linked with the home page.
 */

// Import the User object.
import User from './User.js'

/**
 * BUTTON SIGNUP.
 * Here we first authentificate the user, then we register the user in the
 * realtime database, then, we redirected the user to the home page.
 */
document.getElementById("btnSignUp").addEventListener('click', e=>{

  console.log("Sign up");

  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  const name = document.getElementById("txtName").value; 
  const lastName = document.getElementById("txtLastName").value;
  const id = document.getElementById("txtId").value;

  var emptyField = document.getElementById("emptyField");
  var mailUsed = document.getElementById("mailUsed");
  var passShort = document.getElementById("passShort");
  var idUsed = document.getElementById("idUsed");

  if(email === "" || pass === "" || name === "" || lastName === "" || id === "") {
    emptyField.className = "show";
    setTimeout(function(){ emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  } 

  /** Check if the id is not in use, must be PK!! */

  firebase.database().ref("users/").once("value", snapshot => {
    if (snapshot.exists()) {
      if(Object.keys(snapshot.val())[0] === id) {
        idUsed.className = "show";
        setTimeout(function(){ idUsed.className = idUsed.className.replace("show", ""); }, 2500);
        return;
      }
    }
   
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
      console.log(error.message);
      if(error.message === "The email address is already in use by another account.") {
        mailUsed.className = "show";
        setTimeout(function(){ mailUsed.className = mailUsed.className.replace("show", ""); }, 2500);
        return;
      }
      if(error.message === "Password should be at least 6 characters") {
        passShort.className = "show";
        setTimeout(function(){ passShort.className = passShort.className.replace("show", ""); }, 2500);
        return;
      }
    }).then(function() {
      let currentUser = new User(name, lastName, id, email);
      var user = firebase.auth().currentUser;
      writeUserData(currentUser, user.uid);
    });
  
  });

});

/**
 * BUTTON LOGIN.
 * Here we're checking if the mail and password correspond 
 * and send he user to the home page.
 */
document.getElementById("btnLogin").addEventListener('click', e=>{

  console.log("Log in");

  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  const promise = firebase.auth().signInWithEmailAndPassword(email, pass);
  promise.catch(e=>{ console.log(e.massage)})
});

/**
 * BUTTON GITHUB.
 * Attention !! Must use an HTTP or HTTPS adress. 
 * It can't be on the local server but with a web server.
 * Run configuration:
 * Open a terminal and write: 
 * python3 -m http.server 
 * Then, in the bowser, write: http://localhost:8000/
 * and go to the html file and we're done.
 */
document.getElementById('withGithub').addEventListener( 'click', e=>{ 

  console.log("Log with github");

  const provider = new firebase.auth.GithubAuthProvider();
  const promise = firebase.auth().signInWithPopup(provider);
  promise.then(function(result) {
    /*
    TODO:
    Here we need to create the object user or load it.
    */
   /**
    * Two cases here: if the user is new need to register him in the realtime database
    * and then go to home, if the user is old need to go to home.
    */
    console.log(result)
    // ...
  }).catch(function(error) {
    console.log("error");
    console.log(error.message);
          // ...
  });
})

/**
 * ON STATE CHANGE.
 */
firebase.auth().onAuthStateChanged(user=>{ 
  if(user){
    document.location.href = "home.html";
  }
});
  




