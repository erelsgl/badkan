function log(style, message) {
    $("div#output").append("<div style='" + style + "'>" + message + "</div>")
}

function logClient(style, message) {
    log(style, "> " + message);
}

function logServer(style, message) {
    log(style, "< " + message);
}

function logCheck(style, message, owner_test_id, function_name) {
    $("div#output").append("<div style='" + style + "'>" +
        message + "<input type=\"checkbox\" name=\"wrong\" id=\"" + owner_test_id + "_" + function_name +
        "\" value=\"Wrong\">Wrong test<br></div>")
}

function logCheckServer(style, message, owner_test_id, function_name) {
    logCheck(style, "<pre>" + message + "<\pre>", owner_test_id, function_name);
}

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i]);
        }
    }
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

/*  From  https://stackoverflow.com/a/28396165/827927 */
function websocketCloseReason(code) {
    if (code == 1000)
        reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
    else if (code == 1001)
        reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
    else if (code == 1002)
        reason = "An endpoint is terminating the connection due to a protocol error";
    else if (code == 1003)
        reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
    else if (code == 1004)
        reason = "Reserved. The specific meaning might be defined in the future.";
    else if (code == 1005)
        reason = "No status code was actually present.";
    else if (code == 1006)
        reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
    else if (code == 1007)
        reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
    else if (code == 1008)
        reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
    else if (code == 1009)
        reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
    else if (code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
        reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
    else if (code == 1011)
        reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
    else if (code == 1015)
        reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    else
        reason = "Unknown reason";
    return reason
}

/**
 * From https://stackoverflow.com/a/901144/827927
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function instructorPrivilege(checked) {
    if (checked) {
        alert("Currently everyone can be instructor, we'll change this by redirecting the user to a payment page.")
        return true;
    } else {
        return true;
    }
}

function displayNoneById(id) {
    document.getElementById(id).style.display = "none";
}


function displayBlockById(id) {
    document.getElementById(id).style.display = "block";
}

function showSnackbar(message) {
    $('#snackbar').html(message);
    myClass = $('#snackbar')[0]
    myClass.className = "show";
    setTimeout(function () {
        myClass.className = myClass.className.replace("show", "");
    }, 2500);
    return;
}

/**
 * This method check that all the field are filed.
 * @param {String} name 
 * @param {String} lastName 
 * @param {Stirng} id 
 */
function checkEmptyFieldsSnackbar(args) {
    if (args.includes(undefined) || args.includes("")) {
        showSnackbar("Please fill all the fields.")
        return false;
    }
    return true;
}

function checkEmptyFieldsAlert(args) {
    if (args.includes(undefined) || args.includes("")) {
        Swal.fire(
            'An error occured!',
            'Please fill all the fields.',
            'error'
          )
        return false;
    }
    return true;
}

/**
 * Sanitize the input of any user.
 * @param {String} unsafe 
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Sanitize the input of any user with respect to git.
 * @param {String} unsafe 
 */
function escapeHtmlWithRespectGit(unsafe) {
    return unsafe
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}