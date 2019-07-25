function onLoadMain() {
    // The user will have a field "myCourses" and retreive all the course by this field.
    // Each course will have a field "My exercises"...
    doPostJSON("", "get_courses_manager/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    alert(JSON.stringify(data))
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