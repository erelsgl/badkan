var select = document.getElementById("exercises");

function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}



/*
 * This code belongs to the "create course" tab.
 */

var public = true; // TODO: should this variable be global?

$('input[type=radio][name=privacy]').change(function () {
    var x = document.getElementById("pass");
    if (this.value == 'public') {
        public = true;
        x.style.display = "none";
    } else if (this.value == 'private') {
        public = false;
        x.style.display = "block";
    }
});

document.getElementById("btnCreateCourse").addEventListener('click', e => {
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
            writeCourse(new Course(name, values, ["dummyStudentId"], password, ownerId), courseId);
            incrementCreatedExWithoutCommingHome(ownerId, homeUser);
        }
    } else {
        if (checkEmptyFieldsPublic(name)) {
            writeCourse(new Course(name, values, ["dummyStudentId"], null, ownerId), courseId);
            incrementCreatedExWithoutCommingHome(ownerId, homeUser);
        }
    }
}); // end create course

function checkEmptyFieldsPublic(name) {
    var emptyField = document.getElementById("emptyField");
    if (name === "") {
        emptyField.className = "show";
        setTimeout(function () {
            emptyField.className = emptyField.className.replace("show", "");
        }, 2500);
        return false;
    }
    return true;
}

function checkEmptyFieldsPrivate(name, password) {
    var emptyField = document.getElementById("emptyField");
    if (name === "" || password === "") {
        emptyField.className = "show";
        setTimeout(function () {
            emptyField.className = emptyField.className.replace("show", "");
        }, 2500);
        return false;
    }
    return true;
}




/*
 * This code belongs to the "manage courses" tab.
 */


// We need to load all the exercise since it's possible that the owner of the course is not 
// the owner of the exercise. 

var exercisesMap = new Map();
loadAllExercisesAndAddOptions(exercisesMap); // defined in frontend/util/Firebase.js.

var usersMap = new Map();
var coursesMap = new Map();


/**
 * Add a single course to the HTML and to the courses map.
 */
function addCourseHTML(courseId, course) {
    // TODO: Check duplicate code with Home.js addCourseHTML
    coursesMap.set(courseId, course);

    var $newPanel = addCourseHTML.template.clone();
    $newPanel.find(".collapse").removeClass("in");
    $newPanel.find(".accordion-toggle").attr("href", "#" + (addCourseHTML.hash))
        .text(course.name);
    $newPanel.find(".panel-collapse").attr("id", addCourseHTML.hash++).addClass("collapse").removeClass("in");
    $newPanel.find(".panel-body").text('')
    text_html = "";
    if (course.exercises.length === 1 && course.exercises[0] === "dummyExerciseId") {
        text_html += "<h5>You didn't create any exercise for this course yet!</h5>"
    }
    for (var i = 0; i < course.exercises.length; i++) {
        if (course.exercises[i] != "dummyExerciseId") {
            if (exercisesMap.get(course.exercises[i])) {
                text_html +=
                    "<button name =\"" + course.exercises[i] + "\" id=\"exercise\" class=\"btn btn-link\">" +
                    exercisesMap.get(course.exercises[i]).name +
                    "</button>";
            }
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
}
addCourseHTML.template = $(".template");
addCourseHTML.hash = 2;

function onUser(key, user, i, courses_length) {
    usersMap.set(key, user)
    if (i === courses_length - 1) {
        // TODO: This code should be called only after all courses are processed!
        console.log("usersMap=" + JSON.stringify(usersMap))
        localStorage.setItem("usersMap",
            JSON.stringify(Array.from(usersMap.entries())));
    }
}

function onLoadAllCourses() {
    //console.log("Done loading courses")
    document.getElementById("loading").style.display = "none";

    localStorage.setItem("coursesMap",
        JSON.stringify(Array.from(coursesMap.entries())));
    localStorage.setItem("exercisesMap",
        JSON.stringify(Array.from(exercisesMap.entries())));

    var courses = Array.from(coursesMap.entries())
    for (var i = 0; i < courses.length; ++i) {
        loadUsersOfCourse(courses[i][1],
            onUser,
            i,
            courses.length
        ); // defined in frontend/util/Firebase.js
        console.log("here");
    }

}



loadCoursesOwnedByCurrentUser(addCourseHTML, onLoadAllCourses); // defined in frontend/util/Firebase.js.


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
    //    let exercise = exercisesMap.get(exerciseId);
    //    localStorage.setItem("exercise", JSON.stringify(exercise));
    //    localStorage.setItem("selectedValue", JSON.stringify(exerciseId));
    document.location.href = "viewExercise.html?exerciseId=" + exerciseId;
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
                let submission = exercise.grades.gradeObj[j];
                let user = usersMap.get(submission.id);
                if (user) {
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