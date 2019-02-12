/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnConfirm").addEventListener('click', e => {

  const name = document.getElementById("exName").value;
  const descr = document.getElementById("exDescr").value;

  const testCase = document.getElementById("testCase").files;
  const grading = document.getElementById("grading").files;

  var emptyField = document.getElementById("emptyField");

  if (name === "" || descr === "" || testCase.length == 0 || grading.length == 0) {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  }

  uploadExercise(name, descr, testCase, grading);

});

function uploadExercise(name, descr, testCases, grading) {
  // The ref of the folder must be PK.
  var user = firebase.auth().currentUser;

  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var folderName = user.uid + "_" + homeUser.createdEx;

  var storageRef = firebase.storage().ref(folderName);

  var testCaseRef = storageRef.child('testCase/');
  testCaseRef.put(testCases[0]).then(function (snapshot) {
    console.log('Uploaded folder!');
  })

  for (i = 0; i < grading; i++) {
    // Send the grading file in the badkan 1.0 server
    // The name of the folder must be the same that what there is in firebase. 
  }

  let exercise = new Exercise(name, descr, user.uid);

  incrementCreatedEx(user.uid, homeUser);
  writeExercise(exercise, folderName);

}