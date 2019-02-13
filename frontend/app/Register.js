/**
 * This js file is linked with the register page.
 */

/**
 * BUTTON SIGNUP.
 * Here we first authentificate the user, then we register the user in the
 * realtime database, then, we redirected the user to the home page.
 */
document.getElementById("btnSignUp").addEventListener('click', e => {

  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  const name = document.getElementById("txtName").value;
  const lastName = document.getElementById("txtLastName").value;
  const id = document.getElementById("txtId").value;

  var emptyField = document.getElementById("emptyField");
  var mailUsed = document.getElementById("mailUsed");
  var passShort = document.getElementById("passShort");
  var badMail = document.getElementById("badMail");

  if (email === "" || pass === "" || name === "" || lastName === "" || id === "") {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, pass).then(function () {
    exerciseSolved = new ExerciseSolved(new Exercise("0", "0", "0"), 90, "id");

    let homeUser = new User(name, lastName, id, email, 0, 0, 0, [exerciseSolved]);
    var user = firebase.auth().currentUser;
    writeUserData(homeUser, user.uid);
  }).catch(function (error) {
    console.log(error.message);
    if (error.message === "The email address is already in use by another account.") {
      mailUsed.className = "show";
      setTimeout(function () { mailUsed.className = mailUsed.className.replace("show", ""); }, 2500);
      return;
    }
    if (error.message === "Password should be at least 6 characters") {
      passShort.className = "show";
      setTimeout(function () { passShort.className = passShort.className.replace("show", ""); }, 2500);
      return;
    }
    if (error.message === "The email address is badly formatted.") {
      badMail.className = "show";
      setTimeout(function () { badMail.className = badMail.className.replace("show", ""); }, 2500);
      return;
    }

  });

});

/**
 * BUTTON LOGIN.
 * Here we're checking if the mail and password correspond 
 * and send he user to the home page.
 */
document.getElementById("btnLogin").addEventListener('click', e => {

  var wrongData = document.getElementById("wrongData");

  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  firebase.auth().signInWithEmailAndPassword(email, pass).then(function () {
    document.location.href = "home.html";
  }).catch(e => {
    console.log(e.message)
    wrongData.className = "show";
    setTimeout(function () { wrongData.className = wrongData.className.replace("show", ""); }, 2500);
    return;
  })

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
document.getElementById('withGithub').addEventListener('click', e => {

  console.log("Log with github");

  const provider = new firebase.auth.GithubAuthProvider();
  const promise = firebase.auth().signInWithPopup(provider);
  var mailGihtub = document.getElementById("mailGithub");
  promise.then(function (result) {

    /**
     * Two cases here: if the user is new need to register him in the realtime database
     * and then go to home, if the user is old need to go to home.
     */

    if (result.additionalUserInfo.isNewUser) {
      console.log(result)
      document.location.href = "completeInfo.html"
    }
    else {
      document.location.href = "home.html";
    }

    console.log(result)

  }).catch(function (error) {
    if (error.message === "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.") {
      mailGihtub.className = "show";
      setTimeout(function () { mailGihtub.className = mailGihtub.className.replace("show", ""); }, 2500);
      return;
    }
    console.log(error.message);

  });

})






