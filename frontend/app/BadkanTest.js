// Map with key: function name, value, function content.
tests = new Map();

function dealWithFilePeerToPeerTest(file) {
  var uid = firebase.auth().currentUser.uid;
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  var rawData = new ArrayBuffer();
  reader.loadend = function () {}
  reader.onload = function (e) {
    rawData = e.target.result;
    // create the request
    const xhr = new XMLHttpRequest();
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
      backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    xhr.open('POST', httpurl, true);
    xhr.setRequestHeader('Accept-Language', uid); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        // Create the json for submission
        json = JSON.stringify({
          target: "check_test_peer_submission",
          exerciseId: peerTestExercise,
          name: exercise.name,
          owner_firebase_id: firebase.auth().currentUser.uid,
          student_name: homeUser.name,
          student_last_name: homeUser.lastName,
          country_id: homeUser.id,
          min_test: exercise.minTest,
          signature_map: exercise.signatureMap
        }); // the variable "submission_json" is read in server.py:run

        sendWebsocketPeer(json);
      }
    };
    xhr.send(rawData);
  }
}

function sendWebsocketPeer(json) {
  let owner_test_id = ""
  let function_name = ""
  // Choose a backend port at random
  var backendPort = getParameterByName("backend"); // in utils.js
  if (!backendPort)
    backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
  logClient("color:#888", "Submitting to backend port: " + backendPort); // in utils.js
  var submission_json = json
  // logClient("color:#888", submission_json); // in utils.js No need to show this, Reut please accept this conflict.
  var websocket = new WebSocket(websocketurl);
  websocket.onopen = (event) => {
    logServer("color:blue", "Submission starting!"); // in utils.js
    // logClient("color:green; font-style:italic", submission_json) No need to show this, Reut please accept this conflict.
    websocket.send(submission_json);
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
    if (event.data.includes("INDICATION FOR BACKEND:")) {
      owner_test_id = event.data.substring(23, event.data.length)
    } else if (event.data.includes("INDICATION FOR BACKEND FUNCTION:")) {
      function_name = event.data.substring(32, event.data.length - 1)
    } else if (event.data.includes("{")) {
      // Store the function name and it content into the map. 
      tests.set(function_name, event.data);
      logCheckServer("color:red; margin:0 1em 0 1em", event.data, 
      owner_test_id, function_name);
    } else {
      logServer("color:black; margin:0 1em 0 1em", event.data);
    }
  }
}


