function getDeadline(date) {
    let penalities = [];
    for (var i = 1; i < 7; i++) {
        if (document.getElementById("penalityLate" + i).value) {
            let late = document.getElementById("penalityLate" + i).value;
            let point = document.getElementById("penalityGrade" + i).value;
            penalities.push(new Penality(late, point));
        }
    }
    return new Deadline(date, penalities);
}

function getSubmission(github, zip, gitlab) {
    if (!checkViaSubmission(github, zip, gitlab)) {
        finishLoading();
        die("Bye")
    }
    return new ViaSubmission(github, zip, gitlab);
}

function checkViaSubmission(github, zip, gitlab) {
    // Here we first check that the user at least check one of the parameter.
    if (!github && !zip && !gitlab) {
        alert("Please check at least one submission option.");
        return false;
    } else {
        return true;
    }
}