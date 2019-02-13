var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));

var str = "";
for (i = 0; i < homeUser.exerciseSolved.length; i++) {
    str = str + "Exercise: " + homeUser.exerciseSolved[i].exercise.name + 
    ", Grade: " + homeUser.exerciseSolved[i].grade + "<br />";
}

document.getElementById("name").innerHTML = str;

$("button#home").click(() => {
    document.location.href = "home.html";
})