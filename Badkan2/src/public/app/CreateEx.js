/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnConfirm").addEventListener('click', e => {

  const name = document.getElementById("exName").value;
  const descr = document.getElementById("exDescr").value;

  const testCase = document.getElementById("testCase").files;
  const hiddenTestCase = document.getElementById("hiddenTestCase").files;
  const solution = document.getElementById("solution").files;

  var emptyField = document.getElementById("emptyField");

  if (name === "" || descr === "" || testCase.length == 0 || hiddenTestCase.length == 0 || solution.length == 0) {
    emptyField.className = "show";
    setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
    return;
  }

  uploadExercise(name, descr, testCase, hiddenTestCase, solution);

});

function uploadExercise(name, descr, testCases, grading) {
  // The ref of the folder must be PK.

  // TODO FROM LAST COMMIT : finishing to import exercise: 
  // need to speak with erel, then, edit and delete (so need to implement access to exercise), then part III
  var user = firebase.auth().currentUser;

  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var folderName = user.uid + "_" + homeUser.exerciseNb;

  var storageRef = firebase.storage().ref(folderName);

  for (i = 0; i < testCases.length; i++) {
      var testCaseRef = storageRef.child('testCase/' + i);
      testCaseRef.put(testCases[i]).then(function (snapshot) {
          console.log('Uploaded folder!');
          if (i === testCases.length) {
              document.location.href = "home.html";
          }
      })
  }

  for (i = 0; i < grading; i++) {
    // Send the grading file in the badkan 1.0 server
    // The name of the folder must be the same that what there is in firebase. 
  }

  let exercise = new Exercise(name, descr, user.uid);

  incrementNbExercise(user.uid, homeUser);
  writeExercise(exercise, folderName);

}