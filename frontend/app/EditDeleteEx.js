/**
 * When the user is directed in this page, we should first reload all the submited exercise.
 */

loadExerciseByOwner();
var ownExercises = new Map();

var select = document.getElementById("exercises");


function addOption(exercise, key) {
	select.options[select.options.length] = new Option(exercise.name, key);
}

/**
 * BUTTON EDIT.
 */
document.getElementById("btnEdit").addEventListener('click', e => {
    localStorage.setItem("selectedEx", JSON.stringify(select.value));
    localStorage.setItem("selectedExObj", JSON.stringify(ownExercises.get(select.value)));
    document.location.href = "editEx.html";
});

/**
 * BUTTON DELETE
 */
document.getElementById("btnDelete").addEventListener('click', e => {
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    var user = firebase.auth().currentUser;

    incrementDeletedEx(user.uid, homeUser);
    deleteExerciseById(selected.value)
});