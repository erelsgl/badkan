function doPostJSON(data, target, dataType, onFinish) {
    // Maybe change this design. This is the solution to the problem of the asynchronous with utils.
    var BACKEND_FILE_PORTS = [9000];
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
        backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"

    $.ajax({
        url: httpurl + target + "/",
        type: "POST",
        contentType: "application/json",
        data: data,
        dataType: dataType
    }).done(function (data) {
        if (data == "OK") {  // If the return is OK, there is no need to use the data.
            onFinish();
        } else {
            onFinish(data)
        }
    });
}
