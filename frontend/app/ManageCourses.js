onLoading()

var select = document.getElementById("exercises");

function addOption(exercise, key) {
    select.options[select.options.length] = new Option(exercise.name, key);
}

var homeUserForAdmin = JSON.parse(localStorage.getItem("homeUser"));

if (!homeUserForAdmin.admin) {
    alert("You have no access to this page.");
    document.location.href = "home.html";
} else if (homeUserForAdmin.admin === false) {
    alert("You have no access to this page.");
    document.location.href = "home.html";
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
    onLoading()
    var homeUser = JSON.parse(localStorage.getItem("homeUser"));
    const name = escapeHtml(document.getElementById("courseName").value);
    const grader = escapeHtml(document.getElementById("grader_id").value);
    var values = $('#exercises').val();
    if (!values) {
        values = ["dummyExerciseId"];
    }
    var ownerId = firebase.auth().currentUser.uid;
    let courseId = ownerId + "_" + homeUser.createdEx;
    if (!public) {
        const ids = escapeHtml(document.getElementById("students_ids").value);
        if (checkEmptyFieldsPrivate(name, ids)) {
            writeCourse(new Course(name, values, ["dummyStudentId"], ids, ownerId, grader), courseId);
            incrementCreatedExWithoutCommingHome(ownerId, homeUser);
        }
    } else {
        if (checkEmptyFieldsPublic(name)) {
            writeCourse(new Course(name, values, ["dummyStudentId"], null, ownerId, grader), courseId);
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

function checkEmptyFieldsPrivate(name, ids) {
    var emptyField = document.getElementById("emptyField");
    if (name === "" || ids === "") {
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
var submissionsArray = [];
var exercisesMap = new Map();
loadAllExercisesAndSubmissions(exercisesMap, submissionsArray); // defined in frontend/util/Firebase.js.

var peerExercisesMap = new Map();
loadAllPeerExercises(peerExercisesMap);


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
    if (!course.exercises) {
        text_html += "<h5>You didn't create any exercise for this course yet!</h5>"
    } else {
        for (var i = 0; i < course.exercises.length; i++) {
            if (course.exercises[i] != "dummyExerciseId") {
                if (exercisesMap.get(course.exercises[i])) {
                    text_html +=
                        "<button name =\"" + course.exercises[i] + "$@$" + courseId + "\" id=\"exercise\" class=\"btn btn-link\">" +
                        exercisesMap.get(course.exercises[i]).name +
                        "</button>";

                    if (i != course.exercises.length - 1) text_html += "<br />";
                }


                if (peerExercisesMap.get(course.exercises[i])) {
                    text_html +=
                        "<button name =\"peer" + course.exercises[i] + "$@$" + courseId + "\" id=\"exercise\" class=\"btn btn-link\">" +
                        "<span class=\"glyphicon glyphicon-transfer\"></span>  " +
                        peerExercisesMap.get(course.exercises[i]).name +
                        "  <span class=\"glyphicon glyphicon-transfer\"></span>" +
                        "</button>";

                    if (i != course.exercises.length - 1) text_html += "<br />";
                }
            }
        }
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

function onUser(key, user) {
    usersMap.set(key, user)
    // TODO: This code should be called only after all courses are processed!
    localStorage.setItem("usersMap",
        JSON.stringify(Array.from(usersMap.entries())));

}

function onLoadAllCourses() {
    localStorage.setItem("coursesMap",
        JSON.stringify(Array.from(coursesMap.entries())));
    localStorage.setItem("exercisesMap",
        JSON.stringify(Array.from(exercisesMap.entries())));
    localStorage.setItem("peerExercisesMap",
        JSON.stringify(Array.from(peerExercisesMap.entries())));

    var courses = Array.from(coursesMap.entries())
    for (var i = 0; i < courses.length; ++i) {
        loadUsersOfCourse(courses[i][1],
            onUser
        ); // defined in frontend/util/Firebase.js
    }

}

loadCoursesOwnedByCurrentUser(addCourseHTML, onLoadAllCourses, homeUserForAdmin); // defined in frontend/util/Firebase.js.

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
    let info = e.target.name;
    if (info.startsWith("peer")) {
        let substring = info.substring(4, info.length);
        let arraySPlittedPeer = substring.split("$@$");
        let peerExerciseId = arraySPlittedPeer[0];
        let peerCourseId = arraySPlittedPeer[1];
        localStorage.setItem("courseForGrader", JSON.stringify(coursesMap.get(peerCourseId)));
        document.location.href = "viewPeerExercise.html?exerciseId=" + peerExerciseId;
    } else {
        let arraySPlitted = info.split("$@$");
        let exerciseId = arraySPlitted[0];
        let courseId = arraySPlitted[1];
        localStorage.setItem("courseForGrader", JSON.stringify(coursesMap.get(courseId)));
        document.location.href = "viewExercise.html?exerciseId=" + exerciseId;
    }
});

$('body').on('click', '#create', function (e) {
    $(function () {
        $("#dialog-confirm").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Normal Exercise": function () {
                    let courseId = e.target.name;
                    let course = coursesMap.get(courseId);
                    localStorage.setItem("course", JSON.stringify(course));
                    localStorage.setItem("courseId", JSON.stringify(courseId));
                    document.location.href = "createEx.html";
                    $(this).dialog("close");
                },
                "Peer to peer Exercise": function () {
                    let courseId = e.target.name;
                    let course = coursesMap.get(courseId);
                    localStorage.setItem("course", JSON.stringify(course));
                    localStorage.setItem("courseId", JSON.stringify(courseId));
                    document.location.href = "createPeer.html";
                    $(this).dialog("close");
                }
            }
        });
    });
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
        let exerciseId = course.exercises[i];
        if (exerciseId != 'dummyExerciseId') {
            let exercise = exercisesMap.get(exerciseId);
            if (exercise) {
                for (var j = 0; j < submissionsArray.length; j++) {
                    let currentSubmission = submissionsArray[j];
                    if (currentSubmission.exerciseId == exerciseId) {
                        // Currently there will be double in the grades.
                        for (userUid of currentSubmission.collaboratorsUid) {
                            let user = usersMap.get(userUid);
                            if (!user) {
                                console.log("We detected a student that solved the exercise without be part of the course (maybe by collaboration). \n" +
                                    "His grade will not be stored in the csv. \n" +
                                    "This student has the uid: " + userUid);
                            } else {
                                let row = [];
                                row.push(exercise.name);
                                row.push(user.id);
                                row.push(user.name);
                                row.push(user.lastName);
                                row.push(currentSubmission.grade);
                                row.push(currentSubmission.url);
                                rows.push(row);
                            }
                        }
                    }
                }
            }
        }
    }
    var link = document.createElement('a');
    link.download = 'grades.csv';
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    link.href = encodedUri
    link.click();
    if (!navigator.userAgent.includes("Chrome")) {
        window.open(encodedUri, 'grades.csv');
    }
});

/**
 * Can change the name of the course or the ids.
 */
$('body').on('click', '#edit', function (e) {
    // TODO: change this
    let courseId = e.target.name;
    let course = coursesMap.get(courseId);
    var newName = prompt("New name here:", course.name);
    var newIds = prompt("New ids here:", course.ids);
    course.name = newName;
    course.ids = newIds;
    editCourse(course, courseId, "None")
    document.location.href = "manageCourses.html";

});

$('body').on('click', '#delete', function (e) {
    var r = confirm("Are you sure to delete this course?");
    if (r == true) {
        let courseId = e.target.name;
        deleteCourseById(courseId);
        document.location.href = "manageCourses.html";
    }
});

function onOptionChange() {
    // Dummy function.
}