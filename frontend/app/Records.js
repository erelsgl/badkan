/**
 * This script is writting the records of the user.
 * Note that this page doesn't need firebase since all the information can be found on the internal storage.
 */

var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));

document.getElementById("heading").innerHTML =
    "Records for " + homeUser.name + " " + homeUser.lastName + " " + homeUser.id;

loadAllExercises(function (exercises) {     // defined in Firebase.js.
    // exercises maps the exercise ID to the exercise data.
    var str = "";
    for (i = 0; i < homeUser.exerciseSolved.length; i++) {
        var exerciseSolutionObject = homeUser.exerciseSolved[i]
        var exerciseId = exerciseSolutionObject.exerciseId
        if (exerciseId != "id") {
            // The first exercise is a "dummy exercise" added because
            //   Firebase does not allow an empty object.
            // It is marked by a dummy id "id". We skip it here.
            var grade = exerciseSolutionObject.grade
            var exerciseData = exercises.get(exerciseId)
            str = str + "Exercise: " + exerciseData.name + ", Grade: " + grade + "<br />";
        }
    }
    if (str === "") {
        document.getElementById("records").innerHTML = "You didn't solve any exercise yet."
    }
    else {
        document.getElementById("records").innerHTML = str;
    }
})
