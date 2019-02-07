// Must change this and create a class user.
function User(name, lastName, id, email) {
  this.name = name;
  this.lastName = lastName;
  this.id = id;
  this.email = email;
}

/**
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

  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
    console.log(error.message);
  });

  /** TODO: Check if the id is not in use, must be PK!! */

  var currentUser = new User(name, lastName, id, email);
  writeUserData(currentUser, id);

});

firebase.auth().onAuthStateChanged(user=>{ 
  if(user){
    console.log("user");
    document.location.href = "home.html";
  }
});

document.getElementById("btnLogin").addEventListener('click', e=>{
  console.log("Log in");
  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  const promise = firebase.auth().signInWithEmailAndPassword(email, pass);
  promise.catch(e=>{ console.log(e.massage)})
});

/**
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



