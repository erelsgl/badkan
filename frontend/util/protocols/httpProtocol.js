function doPostJSON(data, target, dataType, onFinish, port = 9000, contentType = "application/json") {
    // Maybe change this design. This is the solution to the problem of the asynchronous with utils.
    var BACKEND_FILE_PORTS = [port];
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    $.ajax({
        url: httpurl + target + "/",
        type: "POST",
        contentType: contentType,
        data: data,
        dataType: dataType
    }).done(function (data) {
        if (data == "OK") { // If the return is OK, there is no need to use the data.
            onFinish();
        } else {
            onFinish(data)
        }
    });
}

function doPostJSONAndFile(data, target, dataType, onFinish) {
    // Maybe change this design. This is the solution to the problem of the asynchronous with utils.
    var BACKEND_FILE_PORTS = [9000];
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    $.ajax({
        url: httpurl + target + "/",
        type: "POST",
        processData: false,
        contentType: false,
        data: data,
        dataType: dataType
    }).done(function (data) {
        if (data == "OK") { // If the return is OK, there is no need to use the data.
            onFinish();
        } else {
            onFinish(data)
        }
    });
}

function doGETJSON(data, target, dataType, onFinish) {
    // Maybe change this design. This is the solution to the problem of the asynchronous with utils.
    var BACKEND_FILE_PORTS = [7000];
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    $.ajax({
        url: httpurl + target + "/",
        type: "GET",
        xhr: function () { // Seems like the only way to get access to the xhr object
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob'
            return xhr;
        },
        contentType: 'application/zip',
        data: data,
        dataType: dataType
    }).done(function (data) {
        if (data == "OK") { // If the return is OK, there is no need to use the data.
            onFinish();
        } else {
            onFinish(data)
        }
    });
}