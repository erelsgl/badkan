var select = document.getElementById("exercises");

function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}

// We need to load all the exercise since it's possible that the owner of the course is not 
// the owner of the exercise. 

var exercisesMap = new Map();
loadAllExercisesAndAddOptions(exercisesMap);  // defined in Firebase.js.

var usersMap = new Map();

loadCoursesByOwner();

var coursesMap = new Map();

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

function addCourseHTML(courseId, course) {
    coursesMap.set(courseId, course);
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
                "<button name =\"" + course.exercises[i] + "\" id=\"exercise\" class=\"btn btn-link\">" +
                exercisesMap.get(course.exercises[i]).name +
                "</button>";
            if (i != course.exercises.length - 1) text_html += "<br />";
        }
    }
    if (course.password) {
        text_html += "<br /> <br />" + " <pre> Password: " + course.password + " </pre>";
    }
    text_html += "<br /> <br />";
    text_html += "<button name =\"" + courseId + "\" id=\"create\" class=\"btn btn-primary\">Create Exercise</button>";
    text_html += "<button name =\"" + courseId + "\" id=\"download\" class=\"btn btn-success\">Dowload Grades</button>";
    text_html += "<button name =\"" + courseId + "\" id=\"edit\" class=\"btn btn-warning\">Edit Course</button>";
    text_html += "<button name =\"" + courseId + "\" id=\"delete\" class=\"btn btn-danger\">Delete Course</button>"
    $newPanel.find(".panel-body").append(text_html);
    $("#accordion").append($newPanel.fadeIn());
    loadUserByOwner(usersMap, coursesMap);
    document.getElementById("loading").style.display = "none";
}

/**
 * Here the user is redirected into a new page "viewExercise".
 * 
 * From there, he can:
 * - Edit the exercise.
 * - Run a code of any user of all of them.
 * - Read and edit any file of any user.
 * - Run the moss command.
 * - dl the summary of the input/output of the student.
 * - optional: dl the grade of the exercise.
 */
$('body').on('click', '#exercise', function (e) {
    let exerciseId = e.target.name;
    let exercise = exercisesMap.get(exerciseId);
    localStorage.setItem("exercise", JSON.stringify(exercise));
    localStorage.setItem("selectedValue", JSON.stringify(exerciseId));
    localStorage.setItem("usersMap", JSON.stringify(Array.from(usersMap.entries())));
    document.location.href = "viewExercise.html";    
});

$('body').on('click', '#create', function (e) {
    let courseId = e.target.name;
    let course = coursesMap.get(courseId);
    localStorage.setItem("course", JSON.stringify(course));
    localStorage.setItem("courseId", JSON.stringify(courseId));
    document.location.href = "createEx.html";
});

/**
 * This function is called when the admin clicks "Download grades".
 */
$('body').on('click', '#download', function (e) {
    let courseId = e.target.name;
    let course = coursesMap.get(courseId);
    let rows = [];
    rows.push(["Exercise Name", "id", "name", "lastName", "grade", "url"]);
    for (var i = 0; i < course.exercises.length; i++) {
        if (course.exercises[i] != 'dummyExerciseId') {
            let exercise = exercisesMap.get(course.exercises[i]);
            for (var j = 1; j < exercise.grades.gradeObj.length; j++) {
                submission = exercise.grades.gradeObj[j];
                let user = usersMap.get(submission.id);
                let row = [];
                row.push(exercise.name);
                row.push(user.id);
                row.push(user.name);
                row.push(user.lastName);
                row.push(submission.grade);
                row.push(submission.url);
                rows.push(row);
            }
        }
    }
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
});

/**
 * Can change the name of the course or the password.
 */
$('body').on('click', '#edit', function (e) {
    let courseId = e.target.name;
    let course = coursesMap.get(courseId);
    var newName = prompt("New name here:", course.name);
    var newPassword = prompt("New password here:", course.password);
    course.name = newName;
    course.password = newPassword;
    editCourse(course, courseId)
    document.location.href = "manageCourses.html";

});

$('body').on('click', '#delete', function (e) {
    let courseId = e.target.name;
    deleteCourseById(courseId);
    document.location.href = "manageCourses.html";
});

function onOptionChange() {
    // Dummy function.
}