function getExercisesItem(exercises, courseId) {
    for (let i = 0; i < exercises.length; i++) {
        if (exercises[i]) {
            let exercise = Object.entries(exercises[i])
            if (exercise[0]) {
                if (exercise[0][1].course_id == courseId) {
                    return i
                }
            }
        }
    }
    return -1
}

function downloadPdfInstruction(exerciseId) {
    doPostJSON(null, "download_instruction/" + exerciseId, "text", onDowloadPdfFinish)
}

function onDowloadPdfFinish(data) {
    window.open(data)
}