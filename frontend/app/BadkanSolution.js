/**
 * This function send the file to the server.
 * @param {File} file 
 */



 //TODO: make test
 function dealWithFilePeerToPeerSolution(file) {
    var uid = firebase.auth().currentUser.uid;
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
      xhr.setRequestHeader('Accept-Language', uid); // To keep the POST method, it has to be something already in the header see: https://stackoverflow.com/questions/9713058/send-post-data-using-xmlhttprequest
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          // Create the json for submission
          json = JSON.stringify({
            target: "check_solution_peer_submission",
            exerciseId: peerSolutionExercise,
            name: exercise.name,
            owner_firebase_id: firebase.auth().currentUser.uid,
            student_name: homeUser.name,
            student_last_name: homeUser.lastName,
            country_id: homeUser.id,
          }); // the variable "submission_json" is read in server.py:run
         
          sendWebsocketPeer(json); // Please accept this conflict too: minor bug in the frontend.
        }
      };
      xhr.send(rawData);
    }
  }



  /*





  */
 