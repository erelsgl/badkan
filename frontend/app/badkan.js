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
        if (data.submission_via_zip) {
            $('.zip').show()
        } else {
            $('.zip').hide()
        }
        if (data.submission_via_github) {
            $('.github').show()
        } else {
            $('.github').hide()
        }
        $("#exerciseName").html(data.exercise_name);
        $("#userId").val(userDetails.country_id);
        $("#userId").attr('readonly', true);
        hideLoader()
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

function onReceiveZipFile() {
    let json = getAdditionnalInfo()
    sendWebsocket(JSON.stringify(json), onOpen, onMessage, onClose, onError)
}

function getAdditionnalInfo() {
    return {
        target: "check_submission",
        exercise_id: exerciseId,
        uid: userUid,
        country_id: userDetails.country_id,
        collab1: escapeHtml($("#collab1").val()),
        collab2: escapeHtml($("#collab2").val()),
        save_grade: $("input[id='saveGrade']:checked").val()
    }
}