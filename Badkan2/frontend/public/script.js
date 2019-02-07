const auth = firebase.auth();

const promise = auth.signInWithEmailAndPassword(email, pass);
auth.createUserWithEmailAndPassword(email, pass);

const githubProvider = new firebase.auth.GithubAuthProvider();
const githubPromise = firebase.auth().signInWithPopup(githubProvider);

firebase.auth().onAuthStateChanged()

document.getElementById("btnSignUp").addEventListener('click', e=>{
  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  //var number = 123;
  //document.write(number)
  console.log("hello");
  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
    console.log(error.message);
  });
})