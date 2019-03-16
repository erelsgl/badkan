var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));

document.getElementById("heading").innerHTML =
    "Records for " + homeUser.name + " " + homeUser.lastName + " " + homeUser.id;

var str = "";
for (i = 0; i < homeUser.exerciseSolved.length; i++) {
    if (homeUser.exerciseSolved[i].exerciseId != "id") {
        str = str + "Exercise: " + homeUser.exerciseSolved[i].exercise.name +
            ", Grade: " + homeUser.exerciseSolved[i].grade + "<br />";
    }
}

if (str === "") {
    document.getElementById("records").innerHTML = "You didn't solve any exercise yet."
}
else {
    document.getElementById("records").innerHTML = str;
}
