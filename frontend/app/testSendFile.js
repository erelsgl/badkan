var ws;

// This line should be the same as in myExercises.js.
var BACKEND_PORTS = [5670];

function connectChatServer() {
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
      backendPort = BACKEND_PORTS[Math.floor(Math.random() * BACKEND_PORTS.length)];
    var websocketurl = "ws://" + location.hostname + ":" + backendPort + "/"
    ws = new WebSocket(websocketurl);
    ws.binaryType = "arraybuffer";
    ws.onopen = function() {
        alert("Connected.")
    };
    ws.onmessage = function(evt) {
        alert(evt.msg);
    };
    ws.onclose = function() {
        alert("Connection is closed...");
    };
    ws.onerror = function(e) {
        alert(e.msg);
    }
}

function sendFile() {
    var file = document.getElementById('filename').files[0];
    var reader = new FileReader();
    var rawData = new ArrayBuffer();            
    reader.loadend = function() {
    }
    reader.onload = function(e) {
        rawData = e.target.result;
        ws.send(rawData);
        alert("the File has been transferred.")
    }
    reader.readAsArrayBuffer(file);
}