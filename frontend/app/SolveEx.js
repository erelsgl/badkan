/**
 * When the user is directed in this page, we should first reload all the exercises of the database.
 */

var select = document.getElementById("exercises");
function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}

var exercises = new Map();
loadAllExercisesAndAddOptions(exercises);  // defined in Firebase.js.
    // exercises maps the exercise ID to the exercise data.


/**
 * BUTTON SOLVE IT!.
 */
document.getElementById("btnSolve").addEventListener('click', e => {
    localStorage.setItem("exercise", JSON.stringify(exercises.get(select.value)));
    localStorage.setItem("selectedValue", JSON.stringify(select.value));
    document.location.href = "badkan.html?exercise=" + select.value;
});

/**
 * Change the option of the list.
 */
function onOptionChange() {
    document.getElementById("descr").innerHTML = exercises.get(select.value).description;
    document.getElementById("example").innerHTML = exercises.get(select.value).example;
}
