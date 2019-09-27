function doPostJSON(data, target, dataType, onFinish, port = 9000, onBlobFinish = false) {
    // Maybe change this design. This is the solution to the problem of the asynchronous with utils.
    var BACKEND_FILE_PORTS = [port];
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    $.ajax({
        xhr: function () { // Seems like the only way to get access to the xhr object
            var xhr = new XMLHttpRequest();
            xhr.responseType = (onBlobFinish ? 'blob' : '')
            return xhr;
        },
        url: httpurl + target + "/",
        type: "POST",
        contentType: 'application/json',
        data: data,
        dataType: dataType,
        complete: function (xmlHttp) {
            handleStatus(xmlHttp.status)
        }
    }).done(function (data) {
        onFinish(data)
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
        dataType: dataType,
        complete: function (xmlHttp) {
            handleStatus(xmlHttp.status)
        }
    }).done(function (data) {
        onFinish(data)
    });
}

function doGETJSON(data, target, dataType, onFinish, type = "GET") {
    // Maybe change this design. This is the solution to the problem of the asynchronous with utils.
    var BACKEND_FILE_PORTS = [7000];
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    $.ajax({
        url: httpurl + target + "/",
        type: type,
        xhr: function () { // Seems like the only way to get access to the xhr object
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob'
            return xhr;
        },
        contentType: 'application/zip',
        data: data,
        dataType: dataType,
        complete: function (xmlHttp) {
            handleStatus(xmlHttp.status)
        }
    }).done(function (data) {
        onFinish(data)
    });
}

function handleStatus(status) {
    if (status == 404) {
        top.location.href = 'index.html';
    }
    if (status == 403) {
        alert("The pdf file is too large, please upload a smaller file.")
    }
    if (status != 200) {
        alert("An error occured.")
        location.reload()
    }
}