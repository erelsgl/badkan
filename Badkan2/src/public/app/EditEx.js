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
    
});

/**
 * BUTTON DELETE
 */
document.getElementById("btnDelete").addEventListener('click', e => {
    var selected = document.getElementById("exercises");
    deleteExerciseById(selected.value)
});