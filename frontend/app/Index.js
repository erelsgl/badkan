/**
 * This js file is linked with the register page.
 */

/**
 * BUTTON SIGNUP.
 * Here we first authenticate the user,
 * then we register the user in the realtime database,
 * then we redirect the user to the home page.
 */
document.getElementById("btnSignUp").addEventListener('click', e => {
  const email = document.getElementById("txtEmailSignIn").value;
  const pass = document.getElementById("txtPasswordSignIn").value;
  const name = document.getElementById("txtName").value;
  const lastName = document.getElementById("txtLastName").value;
  const id = document.getElementById("txtId").value;
  if (checkEmptyFields([email, pass, name, lastName, id])) {
    let checked = document.getElementById("admin").checked;
    if (!adminPrivilege(checked)) {
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function () {
      let notif = new MyNotification("Welcome to the Badkan, this is your first notification.", false, "home.html")
      let homeUser = new User(name, lastName, id, email, 0, 0, 0, [], [], checked, [notif]);
      var authUser = firebase.auth().currentUser;
      writeUserData(homeUser, authUser.uid);
    }).catch(function (error) {
      errorHandling(error.message);
    });
  }
});

/**
 * BUTTON LOGIN.
 * Here we're checking if the mail and password correspond
 * and send he user to the home page.
 */
document.getElementById("btnLogin").addEventListener('click', e => {
  const email = document.getElementById("txtEmail").value;
  const pass = document.getElementById("txtPassword").value;
  firebase.auth().signInWithEmailAndPassword(email, pass).then(function () {
    document.location.href = "home.html";
  }).catch(error => {
    errorHandling(error.message);
  })
});

/**
 * BUTTON GITHUB.
 * Attention !! Must use an HTTP or HTTPS adress.
 * It can't be on the local server but with a web server.
 * Run configuration:
 * Open a terminal and write:
 * python3 -m http.server
 * Then, in the bowser, write: http://localhost/
 * and go to the html file and we're done.
 */
document.getElementById('github').addEventListener('click', e => {
  const provider = new firebase.auth.GithubAuthProvider();
  const promise = firebase.auth().signInWithPopup(provider);
  var mailGihtub = document.getElementById("mailGithub");
  promise.then(function (result) {
    /**
     * Two cases here: if the user is new need to register him in the realtime database
     * and then go to home, if the user is old need to go to home.
     */
    if (result.additionalUserInfo.isNewUser) {
      document.location.href = "completeInfo.html"
    } else {
      document.location.href = "home.html";
    }
  }).catch(function (error) {
    errorHandling(error.message);
  });
});


function errorHandling(errorLog) {
  console.log(errorLog);
  var mailUsed = document.getElementById("mailUsed");
  var passShort = document.getElementById("passShort");
  var badMail = document.getElementById("badMail");
  var wrongData = document.getElementById("wrongData");
  if (errorLog === "The email address is already in use by another account.") {
    showSnackbar(mailUsed)
  } else if (errorLog === "Password should be at least 6 characters") {
    showSnackbar(passShort)
  } else if (errorLog === "The email address is badly formatted.") {
    showSnackbar(badMail)
  } else if (errorLog === "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.") {
    showSnackbar(mailGihtub)
  } else {
    showSnackbar(wrongData)
  }
}

$('a[href="#githubSubmission"]').click(function () {
  swal("Badkan allows users to submit both entire programming projects (through github)" +
  " and than just single files. The instructor can choose the submission way.");
});


$('a[href="#grade"]').click(function () {
  swal("To get the grade, the system run the code provided by the student with" +
  " a specific input and compare the output of the student with the expectation" +
  " the instructor provide for the output. If the expectation correspond to the output" +
  " of the student's code, then some point will be give to the student.");
});

$('a[href="#instructor"]').click(function () {
  swal("Badkan provide an easy graphical interface ot let the instructor customize the input/output system.");
});

$('a[href="#peer"]').click(function () {
  swal("Another interesting way to grade student is by using peer to peer grading: on" +
  "this process, students grade them-self. Indeed, the first part" +
  "of the process is to let student implement test-cases for the given exercise." +
  "Then, the second part is to let them submit their answer for the exercise." +
  "At this point, the platform is able to grade the test-cases submission and" +
  "also the solution of the exercise.");
});

$('a[href="#realtime"]').click(function () {
  swal("The grade is displayed to the student's screen in real time. That is, at every submission, the student will be inform of his grade.");
});

$('a[href="#other"]').click(function () {
  swal("The instructor is able to upload a pdf, to check plagarism, to download all the grades, to run or download a specific project or all the projects...");
});
