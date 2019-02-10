// Import the Exercise object.
//import Exercise from './Exercise'

/**
 * BUTTON CONFIRM.
 */
document.getElementById("btnConfirm").addEventListener('click', e=>{

    console.log("confirm");
  
    const name = document.getElementById("exName").value; 
    const descr = document.getElementById("exDescr").value;

    const testCase = document.getElementById("testCase").files;
    const hiddenTestCase = document.getElementById("hiddenTestCase").files;
    const solution = document.getElementById("solution").files;

    console.log(testCase[0]);
    console.log(hiddenTestCase[0]);
    console.log(solution[0]);

    var emptyField = document.getElementById("emptyField");
  
    if(name === "" || descr === "" || testCase.length == 0 || hiddenTestCase.length == 0 || solution.length == 0) {
      emptyField.className = "show";
      setTimeout(function(){ emptyField.className = emptyField.className.replace("show", ""); }, 2500);
      return;
    } 

    uploadExercise(name, descr, testCase, hiddenTestCase, solution);

});

  