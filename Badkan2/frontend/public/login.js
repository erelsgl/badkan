document.getElementById("btnSignUp").addEventListener('click', e=>{
  console.log("Sign up");
  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
    console.log(error.message);
  });
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
    console.log(result)
    // ...
  }).catch(function(error) {
    console.log("error");
    console.log(error.message);
          // ...
  });
})



