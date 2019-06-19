/**
 * Here the current user must be loaded and all the data needed must be loaded
 * in the internal storage. Really important.
 */

// Here the page always begin with the loading
onLoading()

var $template = $('.template');
$template.hide()
let hash = 2;

var numRegistered = 0

var exercisesMap = new Map();
var peerExercisesMap = new Map();
var submissionsArray = []

/**
 * ON STATE CHANGE.
 * Every time the state of the user is changed, this function is called.
 *
 * TODO: There is code duplication with Home.js!
 */
firebase.auth().onAuthStateChanged(authUser => {
  /*** This code runs if there is a logged-in user. ***/
  if (authUser) {
    var userId = authUser.uid
    // For the Home page.
    window.uid = userId;
    loadCurrentUser(userId, (homeUser) => {

      document.getElementById("user_details").innerHTML =
        homeUser.name + " " + homeUser.lastName + ", " +
        "ID " + homeUser.id + ", " +
        homeUser.email;

      // For the current page.
      window.homeUser = homeUser;

      if (exercisesObject) {  // defined in file data/exercises.js
        // synchronous
        for (key in exercisesObject) {
          exercisesMap.set(key, exercisesObject[key].exercise)
        }
      } else {
        alert("Exercises object not found - please try again or contact the programmer")
        finishLoading()   // defined in util/Loading.js
      }
      loadAllPeerExercisesAsync(peerExercisesMap); // TODO: Change this like the "exercises" above.
      loadAllSubmissionsByUserAsync(submissionsArray, homeUser.submissionsId, () => {
        if (coursesObject) {  // defined in file data/courses.js
          // synchronous
          for (key in coursesObject) {
            course = coursesObject[key].course
            addCourseHTML(key, course)
          }

          // on all courses loaded:
          if (numRegistered == 0) {
            $('#accordion-registered')
              .append('<p>You are not registered to any course yet!</p>');
          }

          // Finally, stop the loading
          finishLoading()
        } else {
          alert("Courses object not found - please try again or contact the programmer")
          finishLoading()
        }
      })
    })
  }
  /*** This code runs if there is NO logged-in user. ***/
  else {
    alert("You're not connected, try to sign in again!")
    document.location.href = "index.html"
  }
})

function addCourseHTML(key, course) {
  //  First see if course if private or not:
  if (course.ids) {
    // The course is private
    let arrayIds = course.ids.split(' ')
    if (arrayIds.includes(window.homeUser.id)) {
      if (isRegistered(course)) {
        numRegistered++;
        showGradesInRegisteredCourse(course);
      }
    }
  } else {
    // The course is public
    if (isRegistered(course)) {
      numRegistered++;
      showGradesInRegisteredCourse(course)
    }
  }
}



// TODO: There is code duplication with Home.js!
function isRegistered(course) {
  if (course.students.indexOf(window.uid) > -1) {
    return true;
  } else {
    return false;
  }
}






// Show grades in a course to which the current user is registered.
function showGradesInRegisteredCourse(course) {
  var $newPanel = $template.clone()
  $newPanel.find('.collapse').removeClass('in')
  $newPanel.find('.accordion-toggle')
    .attr('href', '#' + (hash))
    .text(course.name)
  $newPanel.find('.panel-collapse')
    .attr('id', hash++)
    .addClass('collapse')
    .removeClass('in')
  $newPanel.find('.panel-body').text('')
  text_html = '';
  if (!course.exercises) {
    text_html += '<h5>There are no available exercises for this course!</h5>'
  } else {
    text_html += '<table>\n'
    text_html += '<tr>\n'
    text_html += ' <th>Exercise</th>\n'
    text_html += ' <th>Grade</th>\n'
    text_html += ' <th>Collaborators</th>\n'
    text_html += ' <th>URL</th>\n'
    text_html += ' <th>Timestamp</th>\n'
    text_html += ' <th></th>\n'
    for (var i = 0; i < course.exercises.length; i++) {
        let exerciseId = course.exercises[i]
        let exerciseObj = exercisesMap.get(exerciseId)
        if (exerciseObj) {
          text_html += tableRowOfExerciseInGradesTable(exerciseId, exerciseObj)
        }
        let peerExerciseObj = peerExercisesMap.get(exerciseId)
        if (peerExerciseObj) {
          text_html += tableRowOfExerciseInGradesTable(exerciseId, peerExerciseObj)
        }
    }
    text_html += '</table>\n'
  }
  $newPanel.find('.panel-body').append(text_html)
  $('#accordion-registered').append($newPanel.fadeIn())
}



function solveButton(exerciseId) {
  return '<a name ="' + exerciseId + '" class="btn btn-success btn-solve">Solve</a>';
}



function tableRowOfExerciseInGradesTable(exerciseId, exerciseObj) {
  text_html = ''
  subimissionCount=0
  if (submissionsArray) {
    for (value of submissionsArray) {
      if (value.exerciseId === exerciseId) {
        text_html += '<tr class=\'exercise\'>\n'
        text_html += ' <td>' + exerciseObj.name + '</td>\n';
        text_html += ' <td>'+value.grade+'</td>\n'
        text_html += ' <td>'+value.collaboratorsId+'</td>\n'
        text_html += ' <td>'+value.url+'</td>\n'
        text_html += ' <td>'+value.timestamp+'</td>\n'
        text_html += ' <td>'+solveButton(exerciseId)+'</td>\n'
        text_html += '</tr><!--exercise-->\n'
        ++subimissionCount
      }
    }
  }
  if (subimissionCount==0) {
        text_html += '<tr class=\'exercise\'>\n'
        text_html += ' <td>' + exerciseObj.name + '</td>\n';
        text_html += ' <td>'+0+'</td>\n'
        text_html += ' <td>-</td>\n'
        text_html += ' <td>You did not submit yet</td>\n'
        text_html += ' <td>-</td>\n'
        text_html += ' <td>'+solveButton(exerciseId)+'</td>\n'
        text_html += '</tr><!--exercise-->\n'
  }
  return text_html
}


// TODO: Code duplication with Home.js!
$('body').on('click', '.btn-solve', function (e) {
  let exerciseId = e.target.name;
  let exercise = exercisesMap.get(exerciseId);
  if (exercise.deadline && exercise.deadline.date) {
    if (isOpen(exercise.deadline)) {
      localStorage.setItem('exercise', JSON.stringify(exercise));
      document.location.href = 'badkan.html?exercise=' + exerciseId;
    } else {
      alert('The deadline for this exercise is over.')
    }
  } else {
    localStorage.setItem('exercise', JSON.stringify(exercise));
    document.location.href = 'badkan.html?exercise=' + exerciseId;
  }
});
