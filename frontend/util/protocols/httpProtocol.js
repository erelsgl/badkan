var BACKEND_FILE_PORTS = [9000];

var backendPort = getParameterByName("backend"); // in utils.js
if (!backendPort)
    backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
var httpurl = "http://" + location.hostname + ":" + backendPort + "/"

function doPostJSON(data, target, onFinish) {
    $.ajax({
        url: httpurl + target + "/",
        type: "POST",
        contentType: "application/json",
        data: data,
        dataType: "json" // SEE HERE WHAT TODO WITH CONFLICT WITH THE RETURN!!
        // MAYBE THIS IS THE SAME PROBLEM THAT WITH OR WITHOUT RETURN!!!
    }).done(function (data) {
        onFinish(data)
    });
}

function doPostJSONWithoutReturn(data, target, onFinish) {
    $.ajax({
        url: httpurl + target + "/",
        type: "POST",
        contentType: "application/json",
        data: data,
    }).done(function () {
        onFinish()
    });
}

