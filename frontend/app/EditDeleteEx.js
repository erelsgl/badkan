/**
 * When the user is directed in this page, we should first reload all the submited exercise.
 */

loadExerciseByOwner();

function addOption(exercise, key) {
	var select = document.getElementById("exercises");
	select.options[select.options.length] = new Option(exercise.name, key);
}

/**
 * BUTTON EDIT.
 */
document.getElementById("btnEdit").addEventListener('click', e => {
    var selected = document.getElementById("exercises");
    localStorage.setItem("selectedEx", JSON.stringify(selected.value));
    document.location.href = "editEx.html";
});

/**
 * BUTTON DELETE
 */
document.getElementById("btnDelete").addEventListener('click', e => {
    var selected = document.getElementById("exercises");
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    var user = firebase.auth().currentUser;

    incrementDeletedEx(user.uid, homeUser);
    deleteExerciseById(selected.value)
});