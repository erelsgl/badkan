var BACKEND_FILE_PORTS = [9000];

var backendPort = getParameterByName("backend"); // in utils.js
if (!backendPort)
    backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
var httpurl = "http://" + location.hostname + ":" + backendPort + "/"

function doPostJSON(data, target, dataType, onFinish) {
    $.ajax({
        url: httpurl + target + "/",
        type: "POST",
        contentType: "application/json",
        data: data,
        dataType: dataType
    }).done(function (data) {
        if (data == "OK") {
            onFinish();
        } else {
            onFinish(data)
        }
    });
}