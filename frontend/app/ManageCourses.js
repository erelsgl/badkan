var select = document.getElementById("exercises");

function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}

var exercisesMap = new Map();
loadAllExercisesAndAddOptions(exercisesMap);  // defined in Firebase.js.

loadCoursesByOwner();

var myCourses = [];

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
    console.log(values);
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
            writeCourse(new Course(name, values, ["dummyStudentId"], "password", ownerId
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

function addCourseHTML(course) {
    myCourses.push(course);
    var newDiv = document.createElement('div');
    newDiv.innerHTML =
        "Course Name: " + course.name + "<br />" +
        "Course exercises" + "<br />";
    for (var i = 0; i < course.exercises.length; i++) {
        if (course.exercises[i] != "dummyExerciseId") {
            newDiv.innerHTML += i + ": "
                + exercisesMap.get(course.exercises[i]).name
                + "<br />";
        }
    }
    newDiv.innerHTML += "Password: " + course.password + "<br />";
    // add the newly created element and its content into the DOM 
    var currentDiv = document.getElementById("created");
    document.body.insertBefore(newDiv, currentDiv);
    
    /* Add/Create Exercise to the course. */
    var btn_create = document.createElement("div");
    btn_create.innerHTML = "<button id=\"submit\" class=\"btn btn-primary\">Create Exercise</button>"
    document.body.insertBefore(btn_create, currentDiv);
    
    /* Dowload all the grades of the students. */
    var btn_download_all_grades = document.createElement("div");
    btn_download_all_grades.innerHTML = "<button id=\"submit\" class=\"btn btn-primary\">Dowload Grades</button>"
    document.body.insertBefore(btn_download_all_grades, currentDiv);
    
    /* Edit the course. */
    var btn_edit_course = document.createElement("div");
    btn_edit_course.innerHTML = "<button id=\"submit\" class=\"btn btn-primary\">Edit Course</button>"
    document.body.insertBefore(btn_edit_course, currentDiv);

    /* Delete the course. */
    var btn_delete_course = document.createElement("div");
    btn_delete_course.innerHTML = "<button id=\"submit\" class=\"btn btn-primary\">Delete Course</button>"
    document.body.insertBefore(btn_delete_course, btn_edit_course);
}

/**
* Change the option of the list.
*/
function onOptionChange() {
    // Dummy function.
}
