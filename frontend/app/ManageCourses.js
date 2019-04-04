var select = document.getElementById("exercises");

function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}

var exercisesMap = new Map();
loadAllExercisesAndAddOptions(exercisesMap);  // defined in Firebase.js.

// We need to load all the exercise since it's possible that the owner of the course is not 
// the owner of the exercise. 

loadCoursesByOwner();

var public = true;

$('input[type=radio][name=privacy]').change(function () {
    var x = document.getElementById("pass");
    if (this.value == 'public') {
        public = true;
        x.style.display = "none";
    }
    else if (this.value == 'private') {
        public = false;
        x.style.display = "block";
    }
});

document.getElementById("btnConfirm").addEventListener('click', e => {
    var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
    const name = escapeHtml(document.getElementById("courseName").value);
    var values = $('#exercises').val();
    if (!values[0]) {
        values = ["dummyExerciseId"];
    }
    var ownerId = firebase.auth().currentUser.uid;
    let courseId = ownerId + "_" + homeUser.createdEx;
    if (!public) {
        const password = escapeHtml(document.getElementById("coursePassword").value);
        if (checkEmptyFieldsPrivate(name, password)) {
            writeCourse(new Course(name, values, ["dummyStudentId"], password, ownerId
            ), courseId);
            incrementCreatedExWithoutCommingHome(ownerId, homeUser);
        }
    }
    else {
        if (checkEmptyFieldsPublic(name)) {
            writeCourse(new Course(name, values, ["dummyStudentId"], null, ownerId
            ), courseId);
            incrementCreatedExWithoutCommingHome(ownerId, homeUser);
        }
    }
});

function checkEmptyFieldsPublic(name) {
    var emptyField = document.getElementById("emptyField");
    if (name === "") {
        emptyField.className = "show";
        setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
        return false;
    }
    return true;
}

function checkEmptyFieldsPrivate(name, password) {
    var emptyField = document.getElementById("emptyField");
    if (name === "" || password === "") {
        emptyField.className = "show";
        setTimeout(function () { emptyField.className = emptyField.className.replace("show", ""); }, 2500);
        return false;
    }
    return true;
}

var $template = $(".template");

let hash = 2;

function addCourseHTML(course) {
    var $newPanel = $template.clone();
    $newPanel.find(".collapse").removeClass("in");
    $newPanel.find(".accordion-toggle").attr("href", "#" + (hash))
        .text(course.name);
    $newPanel.find(".panel-collapse").attr("id", hash++).addClass("collapse").removeClass("in");
    $newPanel.find(".panel-body").text('')
    text_html = "";
    if (course.exercises.length === 1 && course.exercises[0] === "dummyExerciseId") {
        text_html += "<h5>You didn't create any exercise for this course yet!</h5>"
    }
    for (var i = 0; i < course.exercises.length; i++) {
        if (course.exercises[i] != "dummyExerciseId") {
            text_html +=
                "<button id=\"submit\" class=\"btn btn-link\">" +
                exercisesMap.get(course.exercises[i]).name +
                "</button>";
            if (i != course.exercises.length -1) text_html += "<br />";
        }
    }
    if (course.password) {
        text_html += "<br />" + "Password: " + course.password + "<br />";
    }
    text_html += "<button id=\"submit\" class=\"btn btn-primary\">Create Exercise</button>";
    text_html += "<button id=\"submit\" class=\"btn btn-primary\">Dowload Grades</button>";
    text_html += "<button id=\"submit\" class=\"btn btn-primary\">Edit Course</button>";
    text_html += "<button id=\"submit\" class=\"btn btn-primary\">Delete Course</button>"
    $newPanel.find(".panel-body").append(text_html);
    $("#accordion").append($newPanel.fadeIn());
}

function onOptionChange() {
    // Dummy function.
}