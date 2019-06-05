/**
 * This function active or not the loading.
 * @param {int} id 
 */
function onLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("show").style.display = "none";
}

function finishLoading() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("show").style.display = "block";
}
