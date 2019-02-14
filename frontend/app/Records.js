var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));

var str = "";
for (i = 0; i < homeUser.exerciseSolved.length; i++) {
    if (homeUser.exerciseSolved[i].exerciseId != "id") {
        str = str + "Exercise: " + homeUser.exerciseSolved[i].exercise.name +
            ", Grade: " + homeUser.exerciseSolved[i].grade + "<br />";
    }
}

if (str === "") {
    document.getElementById("name").innerHTML = "You didn't solve any exercise yet."
}
else {
    document.getElementById("name").innerHTML = str;
}

$("button#home").click(() => {
    document.location.href = "home.html";
})