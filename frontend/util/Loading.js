/**
 * This function active or not the loading.
 * @param {int} id 
 */
function loading(id) {
    var x = document.getElementById(id);
    if (!x) return;
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } 
  