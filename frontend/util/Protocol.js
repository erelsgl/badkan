var BACKEND_PORTS = [5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679];

function simpleWebsocket(json) {
    // Choose a backend port at random
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    var submission_json = json
    var websocket = new WebSocket(websocketurl);
    websocket.onopen = (_event) => {
        websocket.send(submission_json);
    }
    websocket.onmessage = (event) => {
        finishLoading();
        window.location.href = event.data
        console.log(event.data);
    }
    websocket.onclose = (event) => {
        console.log("finish");
    }
    websocket.onerror = (event) => {
        alert("The websocket protocol failed - please try again or contact the programmer")
        console.log(event.data);
    }
}