var BACKEND_FILE_PORTS = [9000];

/**
 * This function send the file to the server.
 * @param {File} file 
 */
function doPost(file, args, onSuccess) {
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);
  var rawData = new ArrayBuffer();
  reader.loadend = function () { }
  reader.onload = function (e) {
    rawData = e.target.result;
    // create the request
    const xhr = new XMLHttpRequest();
    var backendPort = getParameterByName("backend"); // in utils.js
    if (!backendPort)
      backendPort = BACKEND_FILE_PORTS[Math.floor(Math.random() * BACKEND_FILE_PORTS.length)];
    var httpurl = "http://" + location.hostname + ":" + backendPort + "/"
    xhr.open('POST', httpurl, true);
    for (let i = 0; i < args.length; i++) {
      xhr.setRequestHeader(args[i], args[++i]); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
    }
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        switch (this.status) {
          case 200:
            onSuccess();
            break;
          // Error handling here
          default: alert("Unexpected error:  " + this.statusText + " - " + this.status + ".\nPlease try again"); break;
        }
      } 
    };
    xhr.send(rawData);
  }
}
