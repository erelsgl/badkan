// First, get the uid of the home user
let uid = JSON.parse(localStorage.getItem("homeUserId"));

// Next get te exercise id.
let exerciseId = getParameterByName("exercise"); // in utils.js

// Then, retreive the data from firebase.
getConflictsByUid(exerciseId, uid, addItemToList);


function addItemToList(functionName, numOfReclamation) {
    // TODO: add the test itself then remove conflicts object and rename tests to conflict.
    let txtHtml = "<pre>";
    txtHtml += "Name of the test function: " + functionName + ". <br />";
    txtHtml += "Number of reclamation(s): " + numOfReclamation + ".  <br />";
    txtHtml += "<input type=\"checkbox\" name=\"wrong\" id=\"" + functionName + "\" value=\"Wrong\">Wrong reclamation"
    txtHtml += "</pre>";
    $("div#list").append(txtHtml)
}