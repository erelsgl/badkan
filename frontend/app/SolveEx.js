/**
 * When the user is directed in this page, we should first reload all the exercises of the database.
 */

loadAllExercise();
var exercises = new Map();

var select = document.getElementById("exercises");

function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}

/**
 * BUTTON SOLVE IT!.
 */
document.getElementById("btnSolve").addEventListener('click', e => {
    localStorage.setItem("exercise", JSON.stringify(exercises.get(select.value)));
    localStorage.setItem("selectedValue", JSON.stringify(select.value));
    document.location.href = "badkan.html?exercise=" + select.value;

});

function onOptionChange() {
    document.getElementById("descr").innerHTML = "Here is the description of the exercise: <br />" +
        exercises.get(select.value).description;
    document.getElementById("example").innerHTML = "Here is one example for the exercise: <br />" +
        exercises.get(select.value).example;
}