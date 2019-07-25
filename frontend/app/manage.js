function onLoadMain() {
    // The user will have a field "myCourses" and retreive all the course by this field.
    // Each course will have a field "My exercises"...
    doPostJSON("", "get_courses_manager/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    // TODO: make the first active at the beginning.
    var registerCourses = $("#registerCourses");
    var unregisterCourses = $("#unregisterCourses");
    createAccordion(registerCourses, "Register Courses", ["exercises", "exercises"]);  // Example.
    createAccordion(unregisterCourses, "Unregister Courses", ["exercises"]);  // Example.
    createAccordion(registerCourses, "Register Courses2", ["exercises"]);  // Example.
    createAccordion(registerCourses, "Register Courses3", ["exercises"]);  // Example.
    createAccordion(registerCourses, "Register Courses4", ["exercises"]);  // Example.
    $('#main').show();

}

$("#newCourse").click(function () {
    var info = newCourse();
    info.then((json) => {
        doPostJSON(json, "create_course", "text", onCreateCourseSuccess)
    })
})

function onCreateCourseSuccess() {

}

async function newCourse() {
    const {
        value: formValues
    } = await Swal.fire({
        title: 'New course',
        html: '<label for="course_name"><div class="explanation" data-toggle="tooltip" title="Required field">Course name *</div></label>' +
            '<input id="course_name" class="swal2-input" placeholder="C++...">' +
            '<label for="grader"><div class="explanation" data-toggle="tooltip" title="The grader must be admin. \nGives an access to the manage course.">Grader id \n </div></label>' +
            '<input id="grader" class="swal2-input" placeholder="000000000">' +
            '<label for="privacy"><div class="explanation" data-toggle="tooltip" title="The course is shared only with the students you want.">Privacy</div></label>' +
            '<div id=privacy>' +
            '<input type="radio" name="privacy" value="public" onclick=\'$(\"#pass\").hide()\' checked> Public<br>' +
            '<input type="radio" name="privacy" value="private" onclick=\'$(\"#pass\").show()\'> Private<br><br>' +
            '</div>' +
            '<div id="pass" style=display:none;>' +
            '<label for="ids"><div class="explanation" data-toggle="tooltip" title="Please respect the format \nRequired field.">Students ids *</div></label>' +
            '<input id="ids" class="swal2-input" placeholder="000000000 000000000">' +
            '</div>',
        focusConfirm: false,
        preConfirm: () => {
            const course_name = escapeHtml($("#course_name").val())
            const grader = escapeHtml($("#grader").val())
            const privacy = $("input[name='privacy']:checked").val()
            const ids = escapeHtml($("#ids").val())
            if (!(course_name == "" || (ids == "" && privacy == "private"))) {
                return JSON.stringify({
                    owner_uid: userUid,
                    course_name: course_name,
                    grader_uid: grader,
                    privacy: privacy,
                    uids: ids
                })
            } else {
                Swal.showValidationMessage(
                    `Please fill all the required fields.`
                )
            }
        }
    })
    if (formValues) {
        return formValues
    }
}

$('input[type=radio][name=privacy]').change(function () {
    var x = document.getElementById("pass");
    if (this.value == 'public') {
        alert("hi")
        public = true;
        x.style.display = "none";
    } else if (this.value == 'private') {
        public = false;
        x.style.display = "block";
    }
});