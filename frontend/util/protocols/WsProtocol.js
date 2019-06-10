var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679];

function sendWebsocket(submission_json, onOpen, onMessage, onClose, onError) {
  // Choose a backend port at random
  var backendPort = getParameterByName("backend"); // in utils.js
  if (!backendPort)
    backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
  var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
  var websocket = new WebSocket(websocketurl);
  websocket.onopen = (event) => {
    websocket.send(submission_json)
    if (onOpen) {
      onOpen(event)
    }
  }
  websocket.onmessage = (event) => {
    if (onMessage) {
      onMessage(event)
    }
  }
  websocket.onclose = (event) => {
    if (onClose) {
      onClose(event)
    }
  }
  websocket.onerror = (event) => {
    if (onError) {
      onError(event)
    }
  }
}

function onOpenTemplate(_event) {
  logServer("color:blue", "Submission starting!");
}

function onCloseTemplate(_event) {
  logServer("color:red", "Error in websocket.");
}

function onMessageWebsocketSubmissionNormal(event) {
  logServer("color:black; margin:0 1em 0 1em", event.data);
  // The line "Final Grade:<grade>" is written in server.py:check_submission
  if (event.data.includes("Final Grade:")) {
    if (document.getElementById("grade").checked) {
      grade = event.data.substring(12, event.data.length) - penality;
      if (penality) {
        alert("you grade is registered with a penalty of " + penality + " points.")
      }
    } else {
      grade = -1
    }
  }
}

function onCloseWebsocketSubmissionNormal(event) {
  if (event.code === 1000) {
    uploadGrade(homeUser.id, collab1Id, collab2Id, createSubmission)
    logServer("color:blue", "Submission completed!");
  } else if (event.code === 1006)
    logServer("color:red", "Connection closed abnormally!");
  else
    logServer("color:red", "Connection closed abnormally! Code=" + event.code + ". Reason=" + websocketCloseReason(event.code));
  log("&nbsp;", "&nbsp;")
}

function onMessageWebsocketSubmissionPeer(event) {
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

function onCloseWebsocketSubmissionPeer(event) {
  if (event.code === 1000) {
    logServer("color:blue", "Submission completed!");
  } else if (event.code === 1006)
    logServer("color:red", "Connection closed abnormally!");
  else
    logServer("color:red", "Connection closed abnormally! Code=" + event.code + ". Reason=" + websocketCloseReason(event.code));
  log("&nbsp;", "&nbsp;")
}

function onMessageCourseChange(event) {
  finishLoading();
  let message = event.data
  if (message.includes("@$@redirect@$@")) {
    window.location.href = message.substring(14, message.length)
  }
}

function onErrorCourseChange(_event) {
  alert("The websocket protocol failed - please try again or contact the programmer")
}
