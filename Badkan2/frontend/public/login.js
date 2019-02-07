document.getElementById("btnSignUp").addEventListener('click', e=>{
  console.log("Sign up");
  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
    console.log(error.message);
  });
});

firebase.auth().onAuthStateChanged(user=>{ 
  console.log("status change");
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



