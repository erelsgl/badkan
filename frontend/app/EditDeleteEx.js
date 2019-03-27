/**
 * This file is used when the admin clicks "My created exercises".
 */

// This line should be the same as in Badkan.js.
var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679, ];
var backendPort = BACKEND_PORTS[5670]
var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"


/**
 * When the user is directed in this page, we should first reload all the submited exercise.
 */
var ownExercises = new Map();
loadExerciseByOwner(ownExercises);    // Defined in util/Firebase.js

var select = document.getElementById("exercises");

function addOption(exercise, key) {
  select.options[select.options.length] = new Option(exercise.name, key);
}

/**
 * BUTTON EDIT.
 */
document.getElementById("btnEdit").addEventListener('click', e => {
  localStorage.setItem("selectedEx", JSON.stringify(select.value));
  localStorage.setItem("selectedExObj", JSON.stringify(ownExercises.get(select.value)));
  document.location.href = "editEx.html";
});

/**
 * BUTTON DELETE
 */
document.getElementById("btnDelete").addEventListener('click', e => {
  var homeUser = JSON.parse(localStorage.getItem("homeUserKey"));
  var user = firebase.auth().currentUser;

  deleteExerciseById(select.value);
  incrementDeletedEx(user.uid, homeUser);

  var submission_json = JSON.stringify({
    delete_exercise: select.value,
  });

  logClient("color:#888", submission_json); // in utils.js
  var websocket = new WebSocket(websocketurl);
  websocket.onopen = (event) => {
    logServer("color:blue", "Submission starting!"); // in utils.js
    logClient("color:green; font-style:italic", submission_json)
    websocket.send(submission_json);
  }
  websocket.onmessage = (event) => {
    console.log(event);
  }
  websocket.onclose = (event) => {
    if (event.code === 1000) {
      logServer("color:blue", "Submission completed!");
    } else if (event.code === 1006)
      logServer("color:red", "Connection closed abnormally!");
    else
      logServer("color:red", "Connection closed abnormally! Code=" + event.code + ". Reason=" + websocketCloseReason(event.code));
    log("&nbsp;", "&nbsp;")
  }
  websocket.onerror = (event) => {
    logServer("color:red", "Error in websocket.");
  }
  websocket.onmessage = (event) => {
    logServer("color:black; margin:0 1em 0 1em", event.data);
    if (event.data.includes("Final Grade:")) {
      console.log(event.data.substring(12, event.data.length));
      grade = event.data.substring(12, event.data.length);
      uploadGrade(grade);
    }
  }
});

/**
 * This function is called when the admin clicks "Download grades".
 */
document.getElementById("grades").addEventListener('click', async e => {
  console.log("ownExercises:")
  console.log(JSON.stringify(ownExercises));
  let values = Array.from(ownExercises.values());
  console.log("values:")
  console.log(JSON.stringify(values));
  let rows = [];
  rows.push(["Exercise Name", "id", "name", "lastName", "grade", "url"]);
  for (let i = 0; i < values.length; i++) {
    console.log("Row "+i+" of "+values.length);
    for (let j = 1; j < values[i].grades.gradeObj.length; j++) {
        let row = [];
        await database.ref('/users/' + values[i].grades.gradeObj[j].id).once('value').then(function(snapshot) {
        var data = snapshot.val();
        if (!data || (typeof data === 'undefined')) {
          // This part is temporary: when the database will be refreshed, it is possible to delete the ifelse statement.
          row.push(values[i].name);
          row.push(values[i].grades.gradeObj[j].id);
          row.push("anonymous");
          row.push("anonymous");
          row.push(values[i].grades.gradeObj[j].grade);
          row.push("anonymous");
        } else {
          // This is the main code that creates the row in the grade table.
          let user = data.user;
          row.push(values[i].name);
          row.push(user.id);
          row.push(user.name);
          row.push(user.lastName);
          row.push(values[i].grades.gradeObj[j].grade);
          row.push(values[i].grades.gradeObj[j].url);
        }
        rows.push(row);
      });
    }
  }
  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
});
