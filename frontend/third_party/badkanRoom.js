function submit() {
    let submissionGate = $(".naccs .menu div.active")["0"].innerText
    if (submissionGate == "GitHub") {
        let json = getAdditionnalInfo()
        const githubUrl = escapeHtml($("#githubUrl").val())
        if (checkEmptyFieldsAlert([githubUrl])) {
            json.github_url = githubUrl;
            sendWebsocket(JSON.stringify(json), onOpen, onMessage, onClose, onError)
        }
    } else if (submissionGate == "Zip") {
        const zipFile = $('#zipFile').prop('files')[0];
        if (checkEmptyFieldsAlert([zipFile])) {
            var fd = new FormData();
            fd.append("file", zipFile);
            doPostJSONAndFile(fd, "submit_zip_file/" + exerciseId + "/" + userUid, "text", onReceiveZipFile)
        }
    } else {
        alert("error.")
    }
}

function onOpen(_event) {
    logServer("color:blue", "Submission starting!");
}

function onError(_event) {
    logServer("color:red", "Error in websocket.");
}

function onMessage(_event) {
    let message = _event.data
    try {
        let json = JSON.parse(message)
        logServer(json.style, json.message);
    } catch (e) {
        logServer("color:black", message);
    }
}

function onClose(event) {
    if (event.code === 1000) {
        logServer("color:blue", "Submission completed!");
    } else {
        logServer("color:red", "Connection closed abnormally!");
    }
}