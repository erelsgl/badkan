// First, get the uid of the home user
let uid = JSON.parse(localStorage.getItem("homeUserId"));

// Next get te exercise id.
let exerciseId = getParameterByName("exercise"); // in utils.js

// Then, retreive the data from firebase.
getConflictsByUid(exerciseId, uid, addItemToList, noConflicts);

function addItemToList(functionName, numOfReclamation, functionContent) {
    finishLoading()
    // TODO: add the test itself then remove conflicts object and rename tests to conflict.
    let txtHtml = "<pre>";
    txtHtml += "Name of the test function: " + functionName + ". <br />";
    txtHtml += "Number of reclamation(s): " + numOfReclamation + ".  <br /> <br />";
    txtHtml += functionContent + "<br />"
    txtHtml += "<input type=\"checkbox\" name=\"good\" id=\"" + functionName + "\" value=\"Wrong\">Good reclamation"
    txtHtml += "</pre>";
    $("div#list").append(txtHtml)
}

function noConflicts() {
    finishLoading()
}

$("button#confirm").click(() => {
    var checkedBoxes = getCheckedBoxes("good");
    for (var i = 0; i < checkedBoxes.length; i++) {
        // Get the name of the test function that we should flag as "wrong"
        let functionName = checkedBoxes[i].id;
        changeReclamation(uid, exerciseId, functionName);
    }
});
