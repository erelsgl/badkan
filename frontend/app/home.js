$('a[href="#mycourses"]').click(function () {
  showMyCourses()
});

$('a[href="#public"]').click(function () {
  showPublic()
});

function showPublic() {
  $('a[href="#mycourses"]').removeClass("current");
  $('a[href="#public"]').addClass("current");
  $(".public").show()
  $(".myCourse").hide()
  if ($('.public')[0]) {
    $('.public')[0].click();
  }
}

function showMyCourses() {
  $('a[href="#public"]').removeClass("current");
  $('a[href="#mycourses"]').addClass("current");
  $(".myCourse").show()
  $(".public").hide()
  if ($('.myCourse')[0]) {
    $('.myCourse')[0].click();
  }
}

function onLoadMain() {
  // TODO: Make this part much more secure...
  if (userDetails.instructor == "False") {
    $("#becomeInstructor").show()
  } else {
    $("#instructorZone").show()
  }
  doPostJSON("", "get_courses_and_exercises/" + userUid, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
  if (data.courses) {
    for (course of data.courses) {
      createAccordionHome(course, data.exercises, Object.values(data.submissions))
    }
  }
  if (($('.public').length) == 0) {
    noPublicCourseAvailable()
  }
  if (($('.myCourse').length) == 0) {
    noMyCourseAvailable()
  }
  hideLoader()
  showPublic()
}

function noPublicCourseAvailable() {
  $(".nacc").append('<div class="public public_msg"><img class=warning src="images/msg-err.png">No public course available</div>')
}

function noMyCourseAvailable() {
  $(".nacc").append('<div class="myCourse myCourse_msg"><img class=warning src="images/msg-err.png">No my course available</div>')
}

function noExerciseAvailable() {
  return '<div class="no_exercise"><img class=warning src="images/msg-err.png">No exercise available</div>'
}

function createAccordionHome(courseObj, exercises, submissions) {
  let courseId = courseObj[0]
  let course = courseObj[1]
  let myClass = "public"
  if (course.uids) {
    myClass = getClass(course.uids, userUid)
  }
  createAccordionMenu(course.course_name, myClass)
  let panel = "<li>";
  let index = getExercisesItem(exercises, courseId)
  if (index != -1) {
    console.log(course.course_name)
    for (exerciseObj of Object.entries(exercises[index])) {
      let exerciseId = exerciseObj[0]
      let exercise = exerciseObj[1]
      if (myClass == "myCourse") {
        panel += createAccordionBodyHomeSolve(exerciseId, exercise, submissions)
      } else if (myClass == "public") {
        panel += createAccordionBodyHomeRegister(courseId, exercise)
      }
    }
  } else {
    panel += noExerciseAvailable()
  }
  $(".nacc").append(panel + "</li>")
}

function getClass(uids, id) {
  if (Object.values(uids).includes(id)) {
    return "myCourse"
  } else {
    return "public"
  }
}

function createAccordionBodyHomeRegister(courseId, exercise) {
  return '<div class="exercise panel public">' + // Check in the class here for the style
    '<div class="exerciseName title_font">' + exercise.exercise_name + '</div><br><br>' +
    '<div class="description">Compiler : </div>' + '<div class="test">' + exercise.exercise_compiler + '</div><br><br>' +
    (exercise.exercise_description ? '<div class="description"> Description : </div>' + '<div class="test">' +
      exercise.exercise_description + '</div><br><br>' : "") +
    (exercise.deadline ? '<div class=timestamp>Deadline : ' +
      exercise.deadline + '</div><br><br>' : "") +
    '<button class="btn btn_edit" onclick="registeringToCourse(' + "'" + courseId + "'" +
    ')">Register to the course <i class="glyphicon glyphicon-plus"></i></button>' +
    '</div>';
}

function createAccordionBodyHomeSolve(exerciseId, exercise, submissions) {
  return '<div class="exercise panel myCourse">' + // Check in the class here for the style
    '<div class="exerciseName title_font">' + exercise.exercise_name + '</div><br><br>' +
    '<div class="description">Compiler : </div>' + '<div class="test">' + exercise.exercise_compiler + '</div><br><br>' +
    (exercise.exercise_description ? '<div class="description"> Description : </div>' + '<div class="test">' +
      exercise.exercise_description + '</div><br><br>' : "") +
    (exercise.pdf_instruction ? '<button class="btn btn-link"  onclick="downloadPdfInstruction(' + "'" + exerciseId + "'" + ')">Current pdf</button><br><br>' : "") +
    (exercise.deadline ? '<div class=timestamp>Deadline : ' +
      exercise.deadline + '</div><br><br>' : "") +
    '<div class="description">The main function of your submission must be : </div>' + '<div class="test">' + exercise.main_file + '</div><br><br>' +
    '<div class="description">You need to read the input from : </div>' + '<div class="test">' + exercise.input_file_name + '</div><br><br>' +
    '<div class="description">You need to read the output from : </div>' + '<div class="test">' + exercise.output_file_name + '</div><br><br><br><br>' +
    getSubmission(submissions, exerciseId) +
    '<button class="btn btn_edit" onclick="solveExercise(' + "'" + exerciseId + "'" +
    ')">Solve <i class="glyphicon glyphicon-fire"></i></button>' +
    '</div>';
}

function getSubmission(submissions, exerciseId) {
  for (submission of submissions) {
    if (submission.exercise_id == exerciseId) {
      return '<div class=lastSubmission><div class="timestamp text_lastSubmission">Your last stored submission timestamp is : ' + submission.timestamp + '</div><br><br>' +
        (submission.url == "zip" ?
          '<div class="timestamp text_lastSubmission">Your solution was submitted via a ZIP file.</div><br><br>' :
          '<div class="timestamp text_lastSubmission">You solution was submitted via a GitHub url :' + submission.url + '</div><br><br>') +
        '<div class="timestamp text_lastSubmission grade">Your current grade : </div>' + '<div class="timestamp text_lastSubmission grade">' + submission.grade + '</div><br><br>' +
        (submission.manual_grade ? '<div class="timestamp text_lastSubmission grade">Your current manual grade : </div>' + '<div class="timestamp text_lastSubmission grade">' + submission.manual_grade + '</div><br><br></div><br><br>' :
          '</div><br><br>')
    }
  }
  return ""
}

function registeringToCourse(courseId) {
  doPostJSON(null, "registering_to_course/" + courseId + "/" + userUid, "text", reloadHome)
  $("#main").hide()
}

function reloadHome() {
  document.location.reload();
}

function solveExercise(exerciseId) {
  document.location.href = 'badkan.html?exercise=' + exerciseId;
}