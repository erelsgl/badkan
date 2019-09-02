let exerciseId; // in utils.js

function onLoadMain() {
    exerciseId = getParameterByName("exercise")
    doPostJSON("", "get_exercise_submission/" + exerciseId, "json", onFinishRetreiveData)
}

function onFinishRetreiveData(data) {
    if (data.error && data.error == "The submissions are over.") {
        Swal.fire({
            title: 'The submissions are over',
            text: "The deadline for submission has passed, you can no longer submit."

        }).then(() => {
            document.location.href = "home.html";
        });
    } else {
        $("#exerciseName").html(data.exercise_name);
        $("#userId").val(userDetails.country_id);
        $("#userId").attr('readonly', true);
        $('#main').show();
    }
}

$("#submit").click(function () {
    submit()
})

$("#clear").click(function () {
    clear()
})

$("#clear_and_submit").click(function () {
    clear()
    submit()
})

function clear() {
    $("div#output").html("")
}

function submit() {
    let submissionGate = $(".naccs .menu div.active")["0"].innerText
    if (submissionGate == "GitHub") {
        let json = getAdditionnalInfo()
        const githubUrl = escapeHtml($("#githubUrl").val())
        if (checkEmptyFieldsAlert([githubUrl])) {
            json["github_url"] = githubUrl;
            sendWebsocket(json, onOpen, onMessage, onClose, onError)
        }
    } else if (submissionGate == "Zip") {
        const zipFile = $('#zipFile').prop('files')[0];
        if (checkEmptyFieldsAlert([zipFile])) {
            var fd = new FormData();
            fd.append("file", zipFile);
            // TODO: to continue...
            doPostJSONAndFile(fd, "submit_zip_file/" + exerciseId, "text", onReceiveZipFile)
        }
    } else {
        alert("error.")
    }
}

function onReceiveZipFile() {
    let json = getAdditionnalInfo()
    sendWebsocket(json, onOpen, onMessage, onClose, onError)
}

function getAdditionnalInfo() {
    return JSON.stringify({
        collab1: escapeHtml($("#collab1").val()),
        collab2: escapeHtml($("#collab2").val()),
        saveGrade: $("input[id='saveGrade']:checked").val()
    })
}

function onOpen(_event) {
    logServer("color:blue", "Submission starting!");
}

function onError(_event) {
    logServer("color:red", "Error in websocket.");
}

function onMessage(_event) {
    logServer("color:black", event.data);
}

function onClose(event) {
    if (event.code === 1000) {
        logServer("color:blue", "Submission completed!");
    } else {
        logServer("color:red", "Connection closed abnormally!");
    }
}